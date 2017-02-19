/* eslint react/prop-types: 0 */
import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import {PublicKey} from 'shared/ecc'
import transaction from 'app/redux/Transaction'
import g from 'app/redux/GlobalReducer'
import user from 'app/redux/User'
import {validate_account_name} from 'app/utils/ChainValidation';
import runTests from 'shared/ecc/test/BrowserTests';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate'
import reactForm from 'app/utils/ReactForm'
import { translate } from 'app/Translator';
import { translateError } from 'app/utils/ParsersAndFormatters';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import { Link } from 'react-router';

class LoginForm extends Component {

    static propTypes = {
        //Steemit
        login_error: PropTypes.string,
        onCancel: PropTypes.func,
    };

    static defaultProps = {
        afterLoginRedirectToAccount: false
    }

    constructor(props) {
        super()
        const cryptoTestResult = runTests();
        let cryptographyFailure = false;
        if (cryptoTestResult !== undefined) {
            console.error('CreateAccount - cryptoTestResult: ', cryptoTestResult);
            cryptographyFailure = true
        }
        this.state = {
            email: '',
            loading: false,
            cryptographyFailure,
            hiding: '',
            preloader: 'PreloaderNotShown',
            LoginClass: 'LoginForm__shown',
            RecoveryClass: 'LoginForm__hidden',
            Recovered: 'LoginForm__hidden'
        }

        this.onEmailChange = this.onEmailChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.usernameOnChange = e => {
            const value = e.target.value.toLowerCase()
            this.state.username.props.onChange(value)
        }
        this.onCancel = (e) => {
            if(e.preventDefault) e.preventDefault()
            const {onCancel, loginBroadcastOperation} = this.props
            const errorCallback = loginBroadcastOperation && loginBroadcastOperation.get('errorCallback')
            if (errorCallback) errorCallback(translate('canceled'))
            if (onCancel) onCancel()
        }
        this.qrReader = () => {
            const {qrReader} = props
            const {password} = this.state
            qrReader(data => {password.props.onChange(data)})
        }
        this.initForm(props)
    }

    componentWillMount() {
        // Use username.value as the defult (input types should not contain both value and defaultValue)
        const username = {...this.state.username}
        username.value = this.props.initialUsername
        this.setState({username})
    }

    componentDidMount() {
        if (this.refs.username) ReactDOM.findDOMNode(this.refs.username).focus()
    }

    shouldComponentUpdate = shouldComponentUpdate(this, 'LoginForm')

    onEmailChange(e) {
        const emailSet = e.target.value;

        this.setState({email: emailSet});
    }

    initForm(props) {
        reactForm({
            name: 'login',
            instance: this,
            fields: ['username', 'password', 'saveLogin:bool'],
            initialValues: props.initialValues,
            validation: values => ({
                username: ! values.username ? translate('required') : validate_account_name(values.username.split('/')[0]),
                password: ! values.password ? translate('required') :
                    PublicKey.fromString(values.password) ? translate('you_need_private_password_or_key_not_a_public_key') :
                    null,
            })
        })
    }

    handlePassRecovery = event => {
        this.setState({
            LoginClass: 'LoginForm__hidden',
            RecoveryClass: 'LoginForm__shown'
        })
    }

    handlePassRecoveryEnter = event => {
        this.setState({
            LoginClass: 'LoginForm__shown',
            RecoveryClass: 'LoginForm__hidden'
        })
    }

    handleMouseDown = event => {
        this.setState({hiding: 'SignUp_btnCovered', preloader: 'preloaderShown'})
    }

    saveLoginToggle = () => {
        const {saveLogin} = this.state
        saveLoginDefault = !saveLoginDefault
        localStorage.setItem('saveLogin', saveLoginDefault ? 'yes' : 'no')
        saveLogin.props.onChange(saveLoginDefault) // change UI
    }
    showChangePassword = () => {
        const {username, password} = this.state
        this.props.showChangePassword(username.value, password.value)
    }


    onSubmit(e) {
        e.preventDefault();
        this.setState({server_error: '', loading: true});
        const {email} = this.state;
        if (!email) return;


        console.log('TRY RECOVER: ', email)

        fetch('/api/v1/bm_recovery', {
            method: 'post',
            mode: 'no-cors',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                csrf: $STM_csrf,
                email

                //json_meta: JSON.stringify({"ico_address": icoAddress})
            })
        }).then(r => r.json()).then(res => {
            if (res.error || res.status !== 'ok') {
                console.error('SignUp server error', res.error);

                this.setState({server_error: res.error || translate('unknown'), loading: false});
            } else {
                this.setState({Recovered: 'LoginForm__shown', loading: false})

            }
        }).catch(error => {
            console.error('Caught CreateAccount server error', error);
            this.setState({server_error: (error.message ? error.message : error), loading: false});
        });
    }





    render() {
        if (!process.env.BROWSER) {
            return <div className="row">
                        <div className="column">
                            <p>{translate("loading")}..</p>
                        </div>
                    </div>;
        }
        if (this.state.cryptographyFailure) {
            return <div className="row">
                <div className="column">
                    <div className="callout alert">
                        <h4>{translate("cryptography_test_failed")}</h4>
                        <p>{translate("unable_to_log_you_in")}.</p>
                        <p>
                            {translate('the_latest_versions_of') + ' '}
                            <a href="https://www.google.com/chrome/">Chrome</a>
                            {' ' + translate('and')}
                            <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>
                            {' ' + translate('are_well_tested_and_known_to_work_with')}
                        </p>
                    </div>
                </div>
            </div>;
        }

        if ($STM_Config.read_only_mode) {
            return <div className="row">
                        <div className="column">
                            <div className="callout alert">
                                <p>{translate("read_only_mode")}</p>
                            </div>
                        </div>
                    </div>;
        }

        const {loginBroadcastOperation, dispatchSubmit, afterLoginRedirectToAccount, msg} = this.props;
        const {username, password, saveLogin, loading} = this.state
        const {submitting, valid, handleSubmit} = this.state.login
        const {usernameOnChange, onCancel, /*qrReader*/} = this
        const disabled = submitting || !valid;

        const {email} = this.state

        const title = loginBroadcastOperation ?
            translate('authenticate_for_this_transaction') :
            translate('login_to_your_APP_NAME_account');
        const opType = loginBroadcastOperation ? loginBroadcastOperation.get('type') : null
        const authType = translate(/^vote|comment/.test(opType) ? 'posting' : 'active_or_owner')

        const submitLabel = translate(loginBroadcastOperation ? 'sign' : 'login');
        let error = password.touched && password.error ? password.error : this.props.login_error
        if (error === 'owner_login_blocked') {
            error = <span>
                        {translate("password_is_bound_to_account", {
                                changePasswordLink: <a onClick={this.showChangePassword} >
                                                        {translate('update_your_password')}
                                                    </a>
                            })} />
                        {translate('password_is_bound_to_your_accounts_owner_key')}.
                        <br />
                        {translate('however_you_can_use_it_to') + ' '}
                        <a onClick={this.showChangePassword}>{translate('update_your_password')}</a>
                        {' ' + translate('to_obtaion_a_more_secure_set_of_keys')}.
                    </span>
                } else if (error === 'active_login_blocked') {
                    error = <span>{translate('this_password_is_bound_to_your_accounts_private_key')}</span>
        }
        let message = null;
        if (msg) {
            if (msg === 'accountcreated') {
                message =<div className="alert alert-success" role="alert">
                        <p>{translate("account_creation_succes")}</p>
                    </div>;
            }
            else if (msg === 'accountrecovered') {
                message =<div className="callout primary">
                    <p>{translate("account_recovery_succes")}</p>
                </div>;
            }
            else if (msg === 'passwordupdated') {
                message = <div className="callout primary">
                    <p>{translate("password_update_succes", { accountName: username.value })}.</p>
                </div>;
            }
        }

        const form = (
            <form onSubmit={handleSubmit(data => {
                // bind redux-form to react-redux
                return dispatchSubmit(data, loginBroadcastOperation, afterLoginRedirectToAccount)
            })}
                onChange={this.props.clearError}
                method="post"
            >
                <div className="LoginForm__login">
                <label className="LoginForm__label">{translate('enter_email')}</label>
                    <input type="text" className="LoginForm__login-input" required placeholder={translate('enter_username')} ref="username"
                        {...username.props} onChange={usernameOnChange} autoComplete="on" disabled={submitting} />
                    <div className="error LoginForm__hide-error">{username.touched && username.blur && translateError(username.error)}&nbsp;</div>
                </div>

                <div>
                 <label className="LoginForm__label">{translate('enter_password')}</label>
                    <input type="password" className="LoginForm__password-input" required ref="pw" placeholder={translate('password_or_wif')} {...password.props} autoComplete="on" disabled={submitting} />
                    <div className="error">{translateError(error)}&nbsp;</div>
                </div>
                {loginBroadcastOperation && <div>
                    <div className="info">
                        {translate("requires_auth_key", { authType })}.
                    </div>
                </div>}
                {!loginBroadcastOperation && <div className="LoginForm__keepme">
                    <label htmlFor="saveLogin">
                        {translate("keep_me_logged_in") + ' '}
                        <input id="saveLogin" type="checkbox" ref="pw" {...saveLogin.props} onChange={this.saveLoginToggle} disabled={submitting} /></label>
                </div>}

                <div>
                    <button type="submit" disabled={submitting || this.props.logining || disabled || this.props.login_error} className='button' onClick={this.handleMouseDown} >
                        {this.props.logining ? (
                            <div>
                                <LoadingIndicator type="circle" inline /> Входим...
                            </div>
                        ) : submitLabel}
                    </button>
                </div>
                {/* <div>
                    <LoadingIndicator type="circle" inline />
                </div> */}
                <div className="LoginForm__password-recovery"><a href="#" onClick={this.handlePassRecovery}>Восстановить пароль</a></div>
                <div className="LoginForm__label-support">Техническая поддержка <a href="mailto:bitva@molodost.bz">bitva@molodost.bz</a></div>
            </form>
        )

        const formRecovery = (
               <form onSubmit={this.onSubmit} autoComplete="off" noValidate method="post">

                 <div className="LoginForm__login">
                        <label className="LoginForm__label">
                            {translate('enter_username')}</label>
                            <input type="text" className="LoginForm__login-input" ref="email" name="email" onChange={this.onEmailChange} required value={email} placeholder={translate('enter_username')} />

                    </div>

                    <div>
                        <input type="submit" className="button LoginForm__signup-button" value="Восстановить пароль" disabled={loading} />
                    </div>

                    <div className="LoginForm__password-recovery"><a href="#" onClick={this.handlePassRecoveryEnter}>Войти</a></div>

                </form>

            )

        return (<div className="LoginForm__wrapper">
             <div className={'LoginForm '  + this.state.LoginClass}>
               {message}
               <h3>{title}</h3>
               {form}
             </div>

            <div className={'LoginForm__recovery ' + this.state.RecoveryClass}>

                <div className="LoginForm">
                <h3>{translate('password_recovery')}</h3>

                <div className={'alert alert-success '+ this.state.Recovered} role="alert">Ссылка для восстановления пароля отправлена на ваш E-mail</div>
                    {formRecovery}
                </div>
             </div>

           </div>
       )
    }
}

let hasError
let saveLoginDefault = true
if (process.env.BROWSER) {
    const s = localStorage.getItem('saveLogin')
    if (s === 'no') saveLoginDefault = false
}

function urlAccountName() {
    let suggestedAccountName = '';
    const account_match = window.location.hash.match(/account\=([\w\d\-\.]+)/);
    if (account_match && account_match.length > 1) suggestedAccountName = account_match[1];
    return suggestedAccountName
}

import {connect} from 'react-redux'
export default connect(

    // mapStateToProps
    (state) => {
        const login_error = state.user.get('login_error')
        const currentUser = state.user.get('current')
        const loginBroadcastOperation = state.user.get('loginBroadcastOperation')

        const initialValues = {
            saveLogin: saveLoginDefault,
        }

        // The username input has a value prop, so it should not use initialValues
         const initialUsername = currentUser && currentUser.has('username') ? currentUser.get('username') : urlAccountName()

        const loginDefault = state.user.get('loginDefault')
        if(loginDefault) {
            const {username, authType} = loginDefault.toJS()
            if(username && authType) initialValues.username = username + '/' + authType
        }
        let msg = '';
        const msg_match = window.location.hash.match(/msg\=([\w]+)/);
        if (msg_match && msg_match.length > 1) msg = msg_match[1];
        hasError = !!login_error
        return {
            login_error,
            loginBroadcastOperation,
            initialValues,
            initialUsername,
            msg,
            offchain_user: state.offchain.get('user'),
            logining: state.user.get('logining')
        }
    },

    // mapDispatchToProps
    dispatch => ({
        dispatchSubmit: (data, loginBroadcastOperation, afterLoginRedirectToAccount) => {
            const {password, saveLogin} = data
            const username = data.username.trim().toLowerCase()

            if (loginBroadcastOperation) {
                const {type, operation, successCallback, errorCallback} = loginBroadcastOperation.toJS()
                dispatch(transaction.actions.broadcastOperation({type, operation, username, password, successCallback, errorCallback}))
                // Avoid saveLogin, this could be a user-provided content page and the login might be an active key.  Security will reject that...
                dispatch(user.actions.usernamePasswordLogin({username, password, saveLogin: false, afterLoginRedirectToAccount, operationType: type}))
                dispatch(user.actions.closeLogin())
            } else {
                dispatch(user.actions.usernamePasswordLogin({username, password, saveLogin, afterLoginRedirectToAccount}))
            }
        },
        clearError: () => { if (hasError) dispatch(user.actions.loginError({error: null})) },
        qrReader: (dataCallback) => {
            dispatch(g.actions.showDialog({name: 'qr_reader', params: {handleScan: dataCallback}}));
        },
        showChangePassword: (username, defaultPassword) => {
            dispatch(user.actions.closeLogin())
            dispatch(g.actions.remove({key: 'changePassword'}))
            dispatch(g.actions.showDialog({name: 'changePassword', params: {username, defaultPassword}}))
        },
    })
)(LoginForm)
