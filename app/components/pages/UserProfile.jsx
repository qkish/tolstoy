/* eslint react/prop-types: 0 */
import React from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import transaction from 'app/redux/Transaction';
import user from 'app/redux/User';
import Icon from 'app/components/elements/Icon'
import UserKeys from 'app/components/elements/UserKeys';
import PasswordReset from 'app/components/elements/PasswordReset';
import UserWallet from 'app/components/modules/UserWallet';
import Settings from 'app/components/modules/Settings';
import CurationRewards from 'app/components/modules/CurationRewards';
import AuthorRewards from 'app/components/modules/AuthorRewards';
import UserList from 'app/components/elements/UserList';
import UserListEmpty from 'app/components/elements/UserListEmpty';
import Follow from 'app/components/elements/Follow';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import PostsList from 'app/components/cards/PostsList';
import {isFetchingOrRecentlyUpdated} from 'app/utils/StateFunctions';
import {repLog10} from 'app/utils/ParsersAndFormatters.js';
import Tooltip from 'app/components/elements/Tooltip';
import { LinkWithDropdown } from 'react-foundation-components/lib/global/dropdown';
import VerticalMenu from 'app/components/elements/VerticalMenu';
import { translate } from 'app/Translator';
import ReplyEditorShort from 'app/components/elements/ReplyEditorShort'
import HorizontalMenu from 'app/components/elements/HorizontalMenu';
import resolveRoute from 'app/ResolveRoute';

import {
    getUsersByCategory

} from 'app/utils/ServerApiClient'

// BMChain components/modules
import ViewUserBase from 'app/components/modules/user/views/ViewUserBase';
import ViewUserTarget from 'app/components/modules/user/views/ViewUserTarget';
import ViewUserMore from 'app/components/modules/user/views/ViewUserMore';
import ViewUserSubscribers from 'app/components/modules/user/views/ViewUserSubscribers';
import ViewUserHierarchy from 'app/components/modules/user/views/ViewUserHierarchy';
// elements
import Avatar from 'app/components/elements/Avatar';

const formId = 'submitStory';
const SubmitReplyEditor = ReplyEditorShort(formId);

export default class UserProfile extends React.Component {
    constructor() {
        super()
        this.state = {userID: ''}
        this.onPrint = () => {window.print()}
        this.loadMore = this.loadMore.bind(this);

        this.handleTenChange = this.handleTenChange.bind(this)
        this.getData = this.getData.bind(this)
        this.getNameByID = this.getNameByID.bind(this)
    }

    componentWillUnmount() {
        this.props.clearTransferDefaults()
    }

    loadMore(last_post, category) {
        const {accountname} = this.props.routeParams
        if (!last_post) return;

        let order;
        switch(category) {
          case "feed": order = 'by_feed'; break;
          case "blog": order = 'by_author'; break;
          default: console.log("unhandled category:", category);
        }

        if (isFetchingOrRecentlyUpdated(this.props.global.get('status'), order, category)) return;
        let [permlink, author] = last_post.split('/'); // destructuring assignment is a bullshit.
        if (!author) author = accountname; // crutch
        this.props.requestData({author, permlink, order, category, accountname});
    }

    handleTenChange ({id, ten}) {

      console.log('ID TEN', id, ten)
        this.props.changeTen(id, Number(ten))
    }

    getData (props) {

        getUsersByCategory('tens').then(allTens => this.setState({allTens}))
    }

    getNameByID = () => {
           let email = this.props.routeParams.accountname;



        fetch('/api/v1/get_id_by_name', {
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
                this.setState({userID: res.id});


            }
        }).catch(error => {
            console.error('Caught CreateAccount server error', error);
            this.setState({server_error: (error.message ? error.message : error), loading: false});
        });
    }


    componentWillReceiveProps (nextProps) {


       if(nextProps.current_hierarchy && !nextProps.current_hierarchy.myTen) {

        this.getNameByID()
        this.getData(nextProps)


      }
    }

    componentWillMount()  {

    // this.getIdFromDB()

    }



    render() {
        const {
            props: {current_user, wifShown},
            onPrint
        } = this;
        let { accountname, section } = this.props.routeParams;

        const username = current_user ? current_user.get('username') : null
        // const gprops = this.props.global.getIn( ['props'] ).toJS();
        if( !section ) section = 'blog';

        // const isMyAccount = current_user ? current_user.get('username') === accountname : false;
        let account
        let accountImm = this.props.global.getIn(['accounts', accountname]);
        if( accountImm ) {
            account = accountImm.toJS();
        }
        else {
            return <div><center>{translate('unknown_account')}</center></div>
        }

        let followerCount = 0, followingCount = 0;
        const followers = this.props.global.getIn( ['follow', 'get_followers', accountname] );
        const following = this.props.global.getIn( ['follow', 'get_following', accountname] );
        // let loadingFollowers = true, loadingFollowing = true;

        if (followers && followers.has('result')) {
            followerCount = followers.get('result').filter(a => {
                return a.get(0) === "blog";
            }).size;
            // loadingFollowers = followers.get("loading");
        }

        if (following && following.has('result')) {
            followingCount = following.get('result').filter(a => {
                return a.get(0) === "blog";
            }).size;
            // loadingFollowing = following.get("loading");
        }

        // Reputation
        const rep = repLog10(account.reputation);

        const isMyAccount = username === account.name
        const name = account


        let tab_content = null;

        const global_status = this.props.global.get('status');
        const status = global_status ? global_status.getIn([section, 'by_author']) : null;
        const fetching = (status && status.fetching) || this.props.loading;

        // let balance_steem = parseFloat(account.balance.split(' ')[0]);
        // let vesting_steem = vestingSteem(account, gprops).toFixed(2);
        // const steem_balance_str = numberWithCommas(balance_steem.toFixed(2)) + " STEEM";
        // const power_balance_str = numberWithCommas(vesting_steem) + " STEEM POWER";
        // const sbd_balance = parseFloat(account.sbd_balance)
        // const sbd_balance_str = numberWithCommas('$' + sbd_balance.toFixed(2));

        let rewardsClass = "";
        const jsonMetaData = JSON.parse(account.json_metadata)
        const {first_name, last_name} = jsonMetaData
        const fullName = first_name || last_name ? `${first_name} ${last_name}` : account.name


        let current_hierarchy, myTen

        if(this.props.current_hierarchy) {
          current_hierarchy = this.props.current_hierarchy;
          myTen = current_hierarchy.myTen
        }

        let {allTens} = this.state

        let userID
        if(this.state.userID && this.state.userID.id) userID = this.state.userID.id

        let isPayed = false
        if (this.props.current_program) {
          if (this.props.current_program == '1' || this.props.current_program == '2') {isPayed = true}
        }

        let isThereAnyTens = allTens ? allTens.length : ''



        if( section === 'transfers' ) {
            tab_content = <UserWallet global={this.props.global}
                          account={account}
                          showTransfer={this.props.showTransfer}
                          current_user={current_user}
                          withdrawVesting={this.props.withdrawVesting} />
        }
        else if( section === 'curation-rewards' ) {
            rewardsClass = "active";
            tab_content = <CurationRewards global={this.props.global}
                          account={account}
                          current_user={current_user}
                          />
        }
        else if( section === 'author-rewards' ) {
            rewardsClass = "active";
            tab_content = <AuthorRewards global={this.props.global}
                          account={account}
                          current_user={current_user} />
        }
        else if( section === 'followers' ) {
            if (followers && followers.has('result')) {
                tab_content = <UserList
                          title={translate('followers')}
                          account={account}
                          users={followers} />
            } else  tab_content = <UserListEmpty
                          title={translate('followers')} />
        }
        else if( section === 'followed' ) {
            if (following && following.has('result')) {
                tab_content = <UserList
                          title={translate('followed')}
                          account={account}
                          users={following} />
            } else  tab_content = <UserListEmpty
                          title={translate('followed')} />
        }
        else if( section === 'settings' ) {
            tab_content = isMyAccount ? <Settings routeParams={this.props.routeParams} /> :
            <div className="UserProfile__locked">Настройки этого аккаунта недоступны с вашей учетной записью</div>
        }
        else if( section === 'posts' && account.post_history ) {
           if( account.posts )
           {
              tab_content = <section>



                  {isMyAccount ?
                      <div className="SubmitPost" style={{marginLeft: "10px"}}>
                          <SubmitReplyEditor
                              type="submit_story" />
                      </div>: null}
                  <PostsList
                      emptyText={translate('user_hasnt_made_any_posts_yet', {fullName})}
                      posts={account.posts.map(p => `${account.name}/${p}`)}
                      loading={fetching}
                      category="posts"
                      loadMore={null}
                      showSpam />
              </section>;
           }
           else {
              tab_content = (<center><LoadingIndicator type="circle" /></center>);
           }
        } else if(!section || section === 'blog') {
            if (account.blog) {
                tab_content = <section>

                  {isMyAccount && !myTen && isPayed && isThereAnyTens ?
                      <div className="PostSummary" style={{marginLeft: "10px"}} >
                      <h5>Выберите своего десятника</h5>
                          <select onChange={({ target }) => this.handleTenChange({ id: userID, ten: target.value })}>

                          <option>Не выбран десятник</option>
                            {allTens ? allTens.map(userOption => (
                                    <option key={userOption.id} value={userOption.id}>
                                        {`${userOption.first_name} ${userOption.last_name}`}
                                    </option>
                                )) : null}
                          </select>
                      </div>: null}


                    {isMyAccount ?
                        <div className="SubmitPost" style={{marginLeft: "10px"}}>
                            <SubmitReplyEditor type="submit_story" />
                        </div>: null}
                    <PostsList
                        emptyText={translate('user_hasnt_started_bloggin_yet', {fullName})}
                        posts={account.blog}
                        loading={fetching}
                        category="blog"
                        loadMore={this.loadMore}
                        accountName={account.name}
                        showSpam />
                    </section>;
            } else {
                tab_content = (<center><LoadingIndicator type="circle" /></center>);
            }
        }
        // else if(!section || section === 'feed') {
        //     if (account.feed) {
        //         tab_content = <PostsList
        //             emptyText={`Looks like ${account.name} hasn't followed anything yet!`}
        //             posts={account.feed}
        //             loading={fetching}
        //             category="feed"
        //             loadMore={this.loadMore}
        //             showSpam />;
        //     } else {
        //         tab_content = (<center><LoadingIndicator type="circle" /></center>);
        //     }
        // }
        else if( (section === 'recent-replies') && account.recent_replies ) {
              tab_content =
                  <PostsList
                  emptyText={translate('user_hasnt_had_any_replies_yet', {fullName}) + '.'}
                  posts={account.recent_replies}
                  loading={fetching}
                  category="recent-replies"
                  loadMore={null}
                  showSpam={false} />;
        }
        else if( section === 'permissions' && isMyAccount ) {
            tab_content = <UserKeys account={accountImm} />
        } else if( section === 'password' ) {
            tab_content = <PasswordReset account={accountImm} />
        } else {
        //    console.log( "no matches" );
        }



        let printLink = null;
        let section_title = fullName ? fullName : account.name + ' / ' + section;

        //name = fullName;

        if( section === 'blog' ) {
           section_title = fullName + translate('users_blog', {name});
        } else if( section === 'transfers' ) {
           section_title = fullName + translate('users_wallet', {name});
        } else if( section === 'curation-rewards' ) {
          section_title = fullName + translate('users_curation_rewards', {name});
      } else if( section === 'author-rewards' ) {
        section_title = fullName + translate('users_author_rewards', {name});
        } else if( section === 'password' ) {
           section_title = ''
        } else if( section === 'permissions' ) {
           section_title = fullName + translate('users_permissions', {name})
           if(isMyAccount && wifShown) {

               printLink = <div><a className="float-right noPrint" onClick={onPrint}>
                   <Icon name="printer" />&nbsp;{translate('print')}&nbsp;&nbsp;
               </a></div>

           }
        } else if( section === 'posts' ) {
           section_title = fullName + translate('users_posts', {name});
        } else if( section === 'recent-replies' ) {
           section_title = fullName + translate('recent_replies_to_users_posts', {name});
        }

        const wallet_tab_active = section === 'transfers' || section === 'password' || section === 'permissions' ? 'active' : ''; // className={wallet_tab_active}

        let rewardsMenu = [
            {link: `/@${accountname}/curation-rewards`, label: translate('curation_rewards'), value: translate('curation_rewards')},
            {link: `/@${accountname}/author-rewards`, label: translate('author_rewards'), value: translate('author_rewards')}
        ];

        const top_menu = <div className="row UserProfile__top-menu">
            <div className="columns small-10 medium-12 medium-expand">
                <ul className="menu" style={{flexWrap: "wrap"}}>
                    <li><Link to={`/@${accountname}`} activeClassName="active">{translate('blog')}</Link></li>
                    <li><Link to={`/@${accountname}/posts`} activeClassName="active">{translate('comments')}</Link></li>
                    <li><Link to={`/@${accountname}/recent-replies`} activeClassName="active">{translate('replies')}</Link></li>
                    {/*<li><Link to={`/@${accountname}/feed`} activeClassName="active">{translate('feeds')}</Link></li>*/}
                    <li>
                        <LinkWithDropdown
                            closeOnClickOutside
                            dropdownPosition="bottom"
                            dropdownAlignment="right"
                            dropdownContent={
                                <VerticalMenu items={rewardsMenu} />
                            }
                        >
                            <a className={rewardsClass}>
                                {translate('rewards')}
                                <Icon name="dropdown-arrow" />
                            </a>
                        </LinkWithDropdown>
                    </li>

                </ul>
            </div>
            <div className="columns shrink">
                <ul className="menu" style={{flexWrap: "wrap"}}>
                    <li><Link to={`/@${accountname}/transfers`} activeClassName="active">{translate('wallet')}</Link></li>
                    {wallet_tab_active && isMyAccount && <li><Link to={`/@${account.name}/permissions`} activeClassName="active">{translate('permissions')}</Link></li>}
                    {wallet_tab_active && isMyAccount && <li><Link to={`/@${account.name}/password`} activeClassName="active">{translate('password')}</Link></li>}
                    <li><Link to={`/@${accountname}/settings`} activeClassName="active">{translate('settings')}</Link></li>
                </ul>
            </div>
         </div>;

        const background = jsonMetaData.background_image;
        let backgroundUrl
        if (background) backgroundUrl = {backgroundImage: "url('" + background + "')"};



        return (
            <div className="UserProfile">
            <div className="row">
                <div className="UserProfile__cover col-sm-12"
                     style={backgroundUrl}>
                <Avatar account={account} />
                    <div className="UserProfile__buttons-block">
                        <div className="UserProfile__buttons">
                            <Follow follower={username} following={accountname} what="blog" />
                        </div>
                    </div>
                </div>
            </div>

             <div className="row">

                <div className="UserProfile__banner col-sm-4 col-xs-12">
                    <ViewUserBase global={this.props.global} account={account} />
                    <ViewUserTarget global={this.props.global} account={account} />
                    <ViewUserSubscribers global={this.props.global} account={account} followers={followers} following={following}/>
                    <ViewUserHierarchy global={this.props.global} account={account} />
                    <ViewUserMore global={this.props.global} account={account} />
                </div>

                {/* <div className="UserProfile__top-nav row expanded noPrint">
                    {top_menu}
                </div> */}
                {/* <div className="row">
                    <div className="column">
                        {printLink}
                    </div>
                </div>*/}
                <div className="UserProfile_tabcontent col-sm-8 col-xs-12">
                    <div>
                        {/*section_title && <h2 className="UserProfile__section-title">{section_title}</h2>*/}

                       {/* <HorizontalMenu items={sort_order_menu_horizontal} /> */}
                      {process.env.BROWSER ? tab_content : <div className="UserProfile__listInner"><LoadingIndicator type="circle" inline /></div>}
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeTen: (userId, tenId) => dispatch({
            type: 'admin/TEN_CHANGE',
            payload: {
                userId,
                tenId
            }
        })
      }

  }

module.exports = {
    path: '@:accountname(/:section)',
    component: connect(
        state => {
            const wifShown = state.global.get('UserKeys_wifShown')
            const current_user = state.user.get('current')
            const current_hierarchy = state.user.get('myHierarchy')
            const current_program = state.user.get('currentProgram')

            // const current_account = current_user && state.global.getIn(['accounts', current_user.get('username')])
            return {
                discussions: state.global.get('discussion_idx'),
                global: state.global,
                current_user,
                current_hierarchy,
                current_program,
                // current_account,
                wifShown,
                loading: state.app.get('loading')
            };
        },
        dispatch => ({
            login: () => {dispatch(user.actions.showLogin())},
            clearTransferDefaults: () => {dispatch(user.actions.clearTransferDefaults())},
            showTransfer: (transferDefaults) => {
                dispatch(user.actions.setTransferDefaults(transferDefaults))
                dispatch(user.actions.showTransfer())
            },
            withdrawVesting: ({account, vesting_shares, errorCallback, successCallback}) => {
                const successCallbackWrapper = (...args) => {
                    dispatch({type: 'global/GET_STATE', payload: {url: `@${account}/transfers`}})
                    return successCallback(...args)
                }
                dispatch(transaction.actions.broadcastOperation({
                    type: 'withdraw_vesting',
                    operation: {account, vesting_shares},
                    errorCallback,
                    successCallback: successCallbackWrapper,
                }))
            },
            requestData: (args) => dispatch({type: 'REQUEST_DATA', payload: args}),
            changeTen: (userId, tenId) => dispatch({
            type: 'admin/TEN_USER_CHANGE',
            payload: {
                userId,
                tenId
            }
        })

        })
    )(UserProfile)
};
