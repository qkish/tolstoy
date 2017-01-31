import koa_router from 'koa-router';
import koa_body from 'koa-body';
import fetch from 'node-fetch';
import models from 'db/models';
import findUser from 'db/utils/find_user';
import config from 'config';
import recordWebEvent from 'server/record_web_event';
import {esc, escAttrs} from 'db/models';
import {emailRegex, getRemoteIp, rateLimitReq, checkCSRF, encryptPrivateKey, decryptPrivateKey} from 'server/utils';
import coBody from 'co-body';
import {getLogger} from '../../app/utils/Logger'
import {Apis} from 'shared/api_client';
import {createTransaction, signTransaction} from 'shared/chain/transactions';
import {ops} from 'shared/serializer';
import isBefore from 'date-fns/is_before';

const {signed_transaction} = ops;
const print = getLogger('API - general').print

function dbStoreSingleMeta(name, k, v) {
    models.AccountMeta.findOne({
        attributes: [
            'accname', 'k', 'v'
        ],
        where: {
            accname: esc(name),
            k: esc(k)
        }
    }).then(function(it) {
        if (it) {
            if (it.dataValues.v !== v)
                models.AccountMeta.update({
                    v: esc(v)
                }, {
                    where: {
                        accname: esc(name),
                        k: esc(k)
                    }
                });
            }
        else {
            models.AccountMeta.create({accname: esc(name), k: esc(k), v: esc(v)});
        }
    });
}

export default function useGeneralApi(app) {
    const router = koa_router({
        prefix: '/api/v1'
    });
    app.use(router.routes());
    const koaBody = koa_body();

    router.post('/get_account_private_key', koaBody, function*() {
        if (rateLimitReq(this, this.req)) return;
        const params = this.request.body;
        const {csrf, username} = typeof(params) === 'string' ? JSON.parse(params) : params;
        if (!checkCSRF(this, csrf)) return;
        const account = yield models.Account.findOne({
            attributes: ['private_key'],
            where: {
                name: username
            }
        });
        if (account) {
            this.body = JSON.stringify({
                private_key: account.private_key
            });
            this.status = 200;
            return;
        } else {
            this.body = JSON.stringify({
                error: "Account not found"
            });
            this.status = 404;
        }
        recordWebEvent(this, 'api/get_account_private_key', username);
    });

    router.post('/accounts', koaBody, function*() {
        if (rateLimitReq(this, this.req)) return;
        const params = this.request.body;
        print('params', params)
        const account = typeof(params) === 'string' ? JSON.parse(params) : params;
        if (!checkCSRF(this, account.csrf)) return;
        console.log('-- /accounts -->', this.session.uid, this.session.user, account);

        if ($STM_Config.disable_signups) {
            this.body = JSON.stringify({
                error: 'New signups are temporary disabled.'
            });
            this.status = 401;
            return;
        }

        try {
            const meta = {}
            const remote_ip = getRemoteIp(this.req);
            const user_id = this.session.user;
            if (!user_id) { // require user to sign in with identity provider
                this.body = JSON.stringify({
                    error: 'Unauthorized'
                });
                this.status = 401;
                return;
            }

            const user = yield models.User.findOne({
                attributes: ['verified', 'waiting_list'],
                where: {
                    id: user_id
                }
            });
            if (!user) {
                this.body = JSON.stringify({
                    error: 'Unauthorized'
                });
                this.status = 401;
                return;
            }

            const existing_account = yield models.Account.findOne({
                attributes: ['id', 'created_at'],
                where: {user_id, ignored: false},
                order: 'id DESC'
            });
            if (existing_account) { //TODO
                throw new Error("Only one Steem account per user is allowed in order to prevent abuse (Steemit, Inc. funds each new account with 3 STEEM)");
            }

            const same_ip_account = yield models.Account.findOne({
                attributes: ['created_at'],
                where: {
                    remote_ip: esc(remote_ip)
                },
                order: 'id DESC'
            });
            if (same_ip_account) {
                const minutes = (Date.now() - same_ip_account.created_at) / 60000;
                if (minutes < 10) {
                    console.log(`api /accounts: IP rate limit for user ${this.session.uid} #${user_id}, IP ${remote_ip}`);
                    throw new Error('Only one Steem account allowed per IP address every 10 minutes');
                }
            }
            if (user.waiting_list) {
                console.log(`api /accounts: waiting_list user ${this.session.uid} #${user_id}`);
                throw new Error('You are on the waiting list. We will get back to you at the earliest possible opportunity.');
            }
            const eid = yield models.Identity.findOne({
                attributes: ['id'],
                where: {
                    user_id,
                    provider: 'email',
                    verified: true
                },
                order: 'id DESC'
            });
            if (!eid) {
                console.log(`api /accounts: not confirmed email for user ${this.session.uid} #${user_id}`);
                throw new Error('Email address is not confirmed');
            }
            yield createAccount({
                signingKey: config.registrar.signing_key,
                fee: config.registrar.fee,
                creator: config.registrar.account,
                new_account_name: account.name,
                json_metadata: JSON.stringify(new Object()),
                owner: account.owner_key,
                active: account.active_key,
                posting: account.posting_key,
                memo: account.memo_key,
                broadcast: true
            });
            console.log('-- create_account_with_keys created -->', this.session.uid, account.name, user.id, account.owner_key);

            this.body = JSON.stringify({
                status: 'ok'
            });
            models.Account.create(escAttrs({
                    user_id,
                    name: account.name,
                    owner_key: account.owner_key,
                    active_key: account.active_key,
                    posting_key: account.posting_key,
                    memo_key: account.memo_key,
                    remote_ip,
                    referrer: this.session.r
                })).then(instance => {
                })
                .catch(error => {
                    console.error('!!! Can\'t create account model in /accounts api', this.session.uid, error);
                });
        } catch (error) {
            console.error('Error in /accounts api call', this.session.uid, error.toString());
            this.body = JSON.stringify({
                error: error.message
            });
            this.status = 500;
        }
        recordWebEvent(this, 'api/accounts', account ? account.name : 'n/a');
    });

    router.post('/update_email', koaBody, function*() {
        if (rateLimitReq(this, this.req)) return;
        const params = this.request.body;
        const {
            csrf,
            email
        } = typeof(params) === 'string' ? JSON.parse(params): params;
        if (!checkCSRF(this, csrf)) return;
        console.log('-- /update_email -->', this.session.uid, email);
        try {
            if (!emailRegex.test(email.toLowerCase())) throw new Error('not valid email: ' + email);
            // TODO: limit by 1/min/ip
            let user = yield findUser({
                user_id: this.session.user,
                email: esc(email),
                uid: this.session.uid
            });
            if (user) {
                user = yield models.User.update({
                    email: esc(email),
                    waiting_list: true
                }, {
                    where: {
                        id: user.id
                    }
                });
            } else {
                user = yield models.User.create({
                    email: esc(email),
                    waiting_list: true
                });
            }
            this.session.user = user.id;
            this.body = JSON.stringify({
                status: 'ok'
            });
        } catch (error) {
            console.error('Error in /update_email api call', this.session.uid, error);
            this.body = JSON.stringify({
                error: error.message
            });
            this.status = 500;
        }
        recordWebEvent(this, 'api/update_email', email);
    });

    router.post('/login2', koaBody, function* () {
      //  if (rateLimitReq(this, this.req)) return;
        const params = this.request.body;
        const {
            csrf,
            username,
            password
        } = typeof(params) === 'string' ? JSON.parse(params): params;

        console.log('SERV', username, password);

        if (!checkCSRF(this, csrf)) return;

        try {

            // Первый этап
            // Проверить есть ли пользователь на БМ
            const userExistBM = yield getBMAccessToken(username, password);

            console.log('BM check: ' + userExistBM.access_token);

            // If user account have in DB
            if (userExistBM.access_token) {
                // Проверить есть ли пользователь в нашей БД
                 const db_account = yield models.Account.findOne({
                    attributes: ['user_id', 'private_key', 'name'],
                    where: {
                        email: esc(username)
                    }
                });

                // If user accoun have in DB
                if (db_account) {

                    let DectryptedKey = decryptPrivateKey(db_account.private_key);
                    console.log('DECRYPTED: ', DectryptedKey)
                    this.session.a = username;
                    this.session.user = db_account.user_id;
                    console.log('SERVKEY', db_account.name, db_account.private_key)
                    this.body = JSON.stringify({
                        status: 'ok',
                        name: db_account.name,
                        private_key: DectryptedKey
                    });

                    console.log('Server response after login: ', this.body)
                } else {
                    this.body = JSON.stringify({
                        error_status: 'db-user-not-found',
                        error: 'No account found from MYSQL'
                    });
                    this.status = 500;
                }
            } else {
                this.body = JSON.stringify({
                    error_status: 'bm-user-not-found',
                    error: 'No account found from BM'
                });
            }
        } catch (error) {
            console.error('Error in /login2 api call', this.session.uid, error);
            this.body = JSON.stringify({
                error: error.message
            });
            this.status = 500;
        }
        recordWebEvent(this, 'api/login2', username);
    })

    router.post('/check_user', koaBody, function* () {
        if (rateLimitReq(this, this.req)) return;
        const params = this.request.body;
        const {
            csrf,
            username
        } = typeof(params) === 'string' ? JSON.parse(params): params;
        if (!checkCSRF(this, csrf)) return;
        console.log('-- /check_user -->', this.session.uid, username);
        const account = yield models.Account.findOne({
            where: {
                name: esc(username)
            }
        })
        if (account) {
            this.body =  JSON.stringify({
                user_exist: true
            })
        } else {
            this.body = JSON.stringify({
                user_exist: false
            })
        }
        recordWebEvent(this, 'api/check_user', account);
    })

    router.post('/login_account', koaBody, function*() {
        if (rateLimitReq(this, this.req)) return;
        const params = this.request.body;
        const {
            csrf,
            account
        } = typeof(params) === 'string' ? JSON.parse(params): params;
        if (!checkCSRF(this, csrf)) return;
        console.log('-- /login_account -->', this.session.uid, account);
        try {
            this.session.a = account;
            const db_account = yield models.Account.findOne({
                attributes: ['user_id'],
                where: {
                    name: esc(account)
                }
            });
            if (db_account) this.session.user = db_account.user_id;
            this.body = JSON.stringify({
                status: 'ok'
            });
        } catch (error) {
            console.error('Error in /login_account api call', this.session.uid, error);
            this.body = JSON.stringify({
                error: error.message
            });
            this.status = 500;
        }
        recordWebEvent(this, 'api/login_account', account);
    });

    router.post('/logout_account', koaBody, function*() {
        if (rateLimitReq(this, this.req)) return; // - logout maybe immediately followed with login_attempt event
        const params = this.request.body;
        const {
            csrf
        } = typeof(params) === 'string' ? JSON.parse(params): params;
        if (!checkCSRF(this, csrf)) return;
        console.log('-- /logout_account -->', this.session.uid);
        try {
            this.session.a = null;
            this.session.name = null;
            this.session.uid = Math.random().toString(36).slice(2);;
            this.body = JSON.stringify({
                status: 'ok'
            });
        } catch (error) {
            console.error('Error in /logout_account api call', this.session.uid, error);
            this.body = JSON.stringify({
                error: error.message
            });
            this.status = 500;
        }
    });

    router.post('/record_event', koaBody, function*() {
        if (rateLimitReq(this, this.req)) return;
        try {
            const params = this.request.body;
            const {
                csrf,
                type,
                value
            } = typeof(params) === 'string' ? JSON.parse(params): params;
            if (!checkCSRF(this, csrf)) return;
            console.log('-- /record_event -->', this.session.uid, type, value);
            const str_value = typeof value === 'string' ? value : JSON.stringify(value);
            this.body = JSON.stringify({
                status: 'ok'
            });
            recordWebEvent(this, type, str_value);
        } catch (error) {
            console.error('Error in /record_event api call', error);
            this.body = JSON.stringify({
                error: error.message
            });
            this.status = 500;
        }
    });

    router.post('/csp_violation', function*() {
        if (rateLimitReq(this, this.req)) return;
        const params = yield coBody.json(this);
        console.log('-- /csp_violation -->', this.req.headers['user-agent'], params);
        this.body = '';
    });

    router.post('/account_update_hook', koaBody, function * () {
        //if (rateLimitReq(this, this.req)) return;
        const params = this.request.body;
        let {csrf, account_name} = typeof(params) === 'string'
            ? JSON.parse(params)
            : params;
        if (!checkCSRF(this, csrf))
            return; // disable for mass operations
        console.log(account_name);
        // expect array
        if (typeof account_name === 'string') account_name = [account_name]
        this.body = JSON.stringify({status: 'in process'});
        Apis.db_api('get_accounts', account_name).then(function(response) {
            if (!response)
                return;
            response.forEach(function(account) {
                const json_metadata = account.json_metadata;
                const name = account.name;
                var meta = null
                console.log('updating meta for acc ' + name);
                try {
                    meta = JSON.parse(json_metadata)
                } catch (e) {
                    console.log(`account ${name} has invalid json_metadata`);
                    return;
                }
                for (var p in meta) {
                    if (meta.hasOwnProperty(p)) {
                        dbStoreSingleMeta(name, p, meta[p]);
                    }
                }
            })
        }).catch(function(error) {
            console.log("error when updating account meta table", error)
        });
    });


    router.post('/get_account_private_key', koaBody, function*() {
        if (rateLimitReq(this, this.req)) return;
        const params = this.request.body;
        const {csrf, username} = typeof(params) === 'string' ? JSON.parse(params) : params;
        if (!checkCSRF(this, csrf)) return;
        const account = yield models.Account.findOne({
            attributes: ['private_key'],
            where: {
                name: username
            }
        });
        if (account) {
            this.body = JSON.stringify({
                private_key: account.private_key
            });
            this.status = 200;
            return;
        } else {
            this.body = JSON.stringify({
                error: "Account not found"
            });
            this.status = 404;
        }
        recordWebEvent(this, 'api/get_account_private_key', username);
    });

    router.post('/accounts2', koaBody, function*() {
        if (rateLimitReq(this, this.req)) return;



        const params = this.request.body;
        print('params', params)
        const account = typeof(params) === 'string' ? JSON.parse(params) : params;
        if (!checkCSRF(this, account.csrf)) return;
        console.log('-- /accounts -->', this.session.uid, this.session.user, account);

        if ($STM_Config.disable_signups) {
            this.body = JSON.stringify({
                error: 'New signups are temporary disabled.'
            });
            this.status = 401;
            return;
        }

        try {
            const meta = {}
            const remote_ip = getRemoteIp(this.req);

            /* if (same_ip_account) {
                const minutes = (Date.now() - same_ip_account.created_at) / 60000;
                if (minutes < 10) {
                    console.log(`api /accounts: IP rate limit for user ${this.session.uid} #${user_id}, IP ${remote_ip}`);
                    throw new Error('Only one Steem account allowed per IP address every 10 minutes');
                }
            } */


            const getBMtoken = yield getBMAccessToken(account.email, account.bmpassword);
            const getBMmeta = yield getBMUserMeta(getBMtoken.access_token);
            const accountMetaData = {
                first_name: getBMmeta.firstName,
                last_name: getBMmeta.lastName,
                age: getBMmeta.birthDate,
                facebook: getBMmeta.fbId,
                vk: getBMmeta.vkId,
                website: getBMmeta.siteLink,
                user_image: getBMmeta.avatar ? 'http://static.molodost.bz/thumb/160_160_2/img/avatars/' + getBMmeta.avatar : '',
                email: getBMmeta.email,
                phone: getBMmeta.phone
            }


            const attrs = {
            uid: this.session.uid ? this.session.uid : account.name,
            name: account.name,
            email: account.email,
            first_name: getBMmeta.firstName ? getBMmeta.firstName : null,
            last_name: getBMmeta.lastName ? getBMmeta.lastName : null,
            birthday: getBMmeta.age ? getBMmeta.age: null,
            gender: null,
            picture_small: getBMmeta.avatar ? 'http://static.molodost.bz/thumb/160_160_2/img/avatars/' + getBMmeta.avatar : '',
            location_id: null,
            location_name: null,
            locale: null,
            timezone: null,
            remote_ip: getRemoteIp(this.request.req),
            verified: true,
            waiting_list: false,
            facebook_id: getBMmeta.fbId ? getBMmeta.fbId : ''
        };

            const i_attrs = {
            provider: 'bm',
            uid: account.name,
            name: account.name,
            email: account.email,
            verified: true,
            provider_user_id: null
        };

            let user;
            let identity;
            user = yield models.User.create(attrs);

            i_attrs.user_id = user.id;



            console.log('-- BM created user -->', user.id);

            identity = yield models.Identity.create(i_attrs);
            console.log('-- BM created identity -->', this.session.uid, identity.id);



            this.session.user = user.id;


            console.log('MetaData:', accountMetaData)
            yield createAccount({
                signingKey: config.registrar.signing_key,
                fee: config.registrar.fee,
                creator: config.registrar.account,
                new_account_name: account.name,
                json_metadata: JSON.stringify(accountMetaData),
                owner: account.owner_key,
                active: account.active_key,
                posting: account.posting_key,
                memo: account.memo_key,
                broadcast: true
            });
            console.log('-- create_account_with_keys created -->', this.session.uid, account.name, user.id, account.owner_key);

            const encryptedPassword = encryptPrivateKey(account.password);

            this.body = JSON.stringify({
                status: 'ok',
                account: account,
                private_key: encryptedPassword
            });
            yield models.Account.create(escAttrs({
                    user_id: user.id,
                    name: account.name,
                    owner_key: account.owner_key,
                    active_key: account.active_key,
                    posting_key: account.posting_key,
                    memo_key: account.memo_key,
                    remote_ip,
                    private_key: encryptedPassword,
                    email: account.email,
                    referrer: this.session.r
                })).then(instance => {
                })
                .catch(error => {
                    console.error('!!! Can\'t create account model in /accounts2 api', this.session.uid, error);
                });
        } catch (error) {
            console.error('Error in /accounts2 api call', this.session.uid, error.toString());
            this.body = JSON.stringify({
                error: error.message
            });
            this.status = 500;
        }
        recordWebEvent(this, 'api/accounts2', account ? account.name : 'n/a');

        console.log('SERVER RETURNED ACCOUNT: ', account);
       return account;
    });

    router.post('/user/update_vesting_total', koaBody, function*() {
        if (rateLimitReq(this, this.req)) return;
        const params = this.request.body;
        const {csrf, username, value} = typeof(params) === 'string' ? JSON.parse(params) : params;
        if (!checkCSRF(this, csrf)) return;

        const updated = yield models.User.update({
            vesting_total: value
        }, {
            where: {
                name: username
            }
        });
        this.body = JSON.stringify({
            user: updated
        });
    });

    router.post('/user/update_monets', koaBody, function*() {
        if (rateLimitReq(this, this.req)) return;
        const params = this.request.body;
        const {csrf, username, value} = typeof(params) === 'string' ? JSON.parse(params) : params;
        if (!checkCSRF(this, csrf)) return;

        const updated = yield models.User.update({
            monets: value
        }, {
            where: {
                name: username
            }
        });
        this.body = JSON.stringify({
            user: updated
        });
    });

    router.post('/user/update_money_total', koaBody, function*() {
        if (rateLimitReq(this, this.req)) return;
        const params = this.request.body;
        const {csrf, username, value} = typeof(params) === 'string' ? JSON.parse(params) : params;
        if (!checkCSRF(this, csrf)) return;

        const updated = yield models.User.update({
            money_total: value
        }, {
            where: {
                name: username
            }
        });
        this.body = JSON.stringify({
            user: updated
        });
    });

    router.post('/user/update_money', koaBody, function*() {
        if (rateLimitReq(this, this.req)) return;
        const params = this.request.body;
        const {csrf, payload} = typeof(params) === 'string' ? JSON.parse(params) : params;
        if (!checkCSRF(this, csrf)) return;

        const weights = {
            post: 1,
            comment: 1,
            task: 2
        }

        let weight
        if (payload.type === 'submit_story') {
            weight = weights['post']
        }
        if (payload.type === 'submit_comment') {
            weight = weights['comment']
        }
        if (payload.type === 'reply_to_task') {
            weight = weights['task']
        }

        const user = yield models.User.findOne({
            where: {
                name: payload.username
            }
        })

        const last_transaction = user.last_total_transaction
        const was_yesterday = isBefore(last_transaction, new Date())

        console.log('was yesterday', was_yesterday)

        if (!last_transaction || isBefore(last_transaction, new Date())) {
            if (payload.type === 'submit_story') {
                yield user.update({
                    posts_monets: 1
                })
            }
            if (payload.type === 'submit_comment') {
                yield user.update({
                    comments_monets: 1
                })
            }
            if (payload.type === 'reply_to_task') {
                yield user.update({
                    tasks_monets: 1
                })
            }
            yield user.update({
                last_total_transaction: new Date()
            })
        }

        console.log('last transaction', last_transaction)
        // const updated = yield models.User.update({
        //     money_total: value
        // }, {
        //     where: {
        //         name: username
        //     }
        // });
        this.body = JSON.stringify({
            'receive payload': payload
        });
    });

    router.get('/users', koaBody, function* () {
        if (rateLimitReq(this, this.req)) return;
        const osipov = yield models.User.findAll({
            where: {
                polk: 1
            }
        })
        const dashkiev = yield models.User.findAll({
            where: {
                polk: 2
            }
        })
        this.body = JSON.stringify({
            osipov,
            dashkiev
        })
    })
}


function* getBMAccessToken (username, password) {
    return fetch('http://api.molodost.bz/oauth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: 'renat.biktagirov',
            client_secret: '6NbQvMElYMcBbOVWie7a1Bs4rfVt9FpNY4V4Fl6EEGt4xTEUa1K0ugMohlemqFQ5',
            grant_type: 'password',
            username: username,
            password: password

        })
    }).then(res => res.json())
}

function* getBMUserMeta (acces_token) {
    return fetch('http://api.molodost.bz/api/v3/user/me/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + acces_token
        }
    }).then(res => res.json()).catch(e => console.log(e))
}

/**
 @arg signingKey {string|PrivateKey} - WIF or PrivateKey object
 */
function* createAccount({
    signingKey,
    fee,
    creator,
    new_account_name,
    json_metadata = '',
    owner,
    active,
    posting,
    memo,
    broadcast = false,
}) {
    const operations = [
        ['account_create', {
            fee,
            creator,
            new_account_name,
            json_metadata,
            owner: {
                weight_threshold: 1,
                account_auths: [],
                key_auths: [
                    [owner, 1]
                ]
            },
            active: {
                weight_threshold: 1,
                account_auths: [],
                key_auths: [
                    [active, 1]
                ]
            },
            posting: {
                weight_threshold: 1,
                account_auths: [],
                key_auths: [
                    [posting, 1]
                ]
            },
            memo_key: memo,
        }]
    ]
    const tx = yield createTransaction(operations)
    const sx = signTransaction(tx, signingKey)
    if (!broadcast) return signed_transaction.toObject(sx)
    return yield new Promise((resolve, reject) =>
        Apis.broadcastTransaction(sx, () => {
            resolve()
        }).catch(e => {
            reject(e)
        })
    )
}
