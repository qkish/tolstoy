/* eslint react/prop-types: 0 */
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import Topics from './Topics';
import constants from 'app/redux/constants';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import PostsList from 'app/components/cards/PostsList';
import {isFetchingOrRecentlyUpdated} from 'app/utils/StateFunctions';
import g from 'app/redux/GlobalReducer';
import { translate } from 'app/Translator';
import ReplyEditorShort from 'app/components/elements/ReplyEditorShort'
import HorizontalMenu from 'app/components/elements/HorizontalMenu';
import resolveRoute from 'app/ResolveRoute';
import { APP_NAME, APP_ICON } from 'config/client_config';
import capitalizeFirstLetter from 'capitalize';
import { detransliterate } from 'app/utils/ParsersAndFormatters';
import Products from 'app/components/elements/Products';
import CardMyTen from 'app/components/elements/CardMyTen'
import Beta from 'app/components/elements/Beta';
import Apis from 'shared/api_client/ApiInstances'


function sortOrderToLink(so, topic, account) {
    // to prevent probmes check if topic is not the same as account name
    if ('@' + account == topic) topic = ''
    if (so === 'home') return '/@' + account + '/feed';
    if (so === 'tasks') return '/tasks'
    if (topic) return `/${so}/${topic}`;
    return `/${so}`;
}

 
const formId = 'submitStory'
const SubmitReplyEditor = ReplyEditorShort(formId)

class PostsIndex extends React.Component {

    static propTypes = {
        discussions: PropTypes.object,
        status: PropTypes.object,
        routeParams: PropTypes.object,
        requestData: PropTypes.func,
        loading: PropTypes.bool,
        current_account_name: React.PropTypes.string
    };

    static defaultProps = {
        showSpam: false
    }

    constructor() {
        super();
        this.state = {}
        this.loadMore = this.loadMore.bind(this);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'PostsIndex')
    }

    componentDidUpdate(prevProps) {
        if (window.innerHeight && window.innerHeight > 3000 && prevProps.discussions !== this.props.discussions) {
            this.refs.list.fetchIfNeeded();
        }

    }

    getPosts(order, category) {
        const topic_discussions = this.props.discussions.get(category || '');
        if (!topic_discussions) return null;
        return topic_discussions.get(order);
    }

    loadMore(last_post) {
        if (!last_post) return;
        let {accountname} = this.props.routeParams
        let {category, order = constants.DEFAULT_SORT_ORDER} = this.props.routeParams;
        if (category === 'feed'){
            accountname = order.slice(1);
            order = 'by_feed';
        }
        if (isFetchingOrRecentlyUpdated(this.props.status, order, category)) return;
        const [author, permlink] = last_post.split('/');
        this.props.requestData({author, permlink, order, category, accountname});
    }
    onShowSpam = () => {
        this.setState({showSpam: !this.state.showSpam})
    }

   

    render() {
        let {category, order = constants.DEFAULT_SORT_ORDER} = this.props.routeParams;
        let topics_order = order;


        let posts = [];
        let emptyText = '';

        if (!category) {
            category = 'bm-open'
        }


        if (category === 'feed') {
            const account_name = order.slice(1);
            order = 'by_feed';
            topics_order = 'trending';
            posts = this.props.global.getIn(['accounts', account_name, 'feed']);
            emptyText = translate('user_hasnt_followed_anything_yet', {name: account_name});
        } else {
            posts = this.getPosts(order, category);
        }

        const status = this.props.status ? this.props.status.getIn([category || '', order]) : null;
        const fetching = (status && status.fetching) || this.props.loading;
        const {showSpam} = this.state


        const route = resolveRoute(this.props.location.pathname);
        const current_account_name =  this.props.current_account_name;
        let home_account = false;
        let page_title = route.page;

         let sort_order = '';
        let topic = '';
        let topic_original_link = '';
        let user_name = null;
        let page_name = null;

        let bmOpen = '';
        let bmTasks = '';


        

        if (route.page === 'PostsIndex') {

            if (route.params[0] === "tasks") bmTasks = 'active_tab';

            sort_order = route.params[0] ? translate(route.params[0]) : '';
            if (sort_order === 'home') {
                page_title = translate('home')
                const account_name = route.params[1];
                if (current_account_name && account_name.indexOf(current_account_name) === 1)
                    home_account = true;
            } else {
                if (route.params.length > 1) {

                    if (route.params[1] === "bm-open") bmOpen = 'active_tab';

                    
                  

                    if (route.params[1] === "bm-tasks") bmTasks = 'active_tab';



                    topic = detransliterate(route.params[1]);
                    topic_original_link = (route.params[1])
                    // Overwrite default created for more human readable title
                    if (route.params[0] === "created") {
                        page_title = translate('created_posts');
                    }
                    else {
                        page_title = translate('sort_order_topic_posts', {sort_order});
                    }
                } else {
                    if (route.params[0] === "created") {
                        page_title = translate('new_posts');
                    } else if (route.params[0] === 'tasks') {
                        page_title = translate('tasks')
                    } else {
                        page_title = translate('sort_order_posts', {sort_order});
                    }
                }
            }
        } else if (route.page === 'Post') {
            sort_order = '';
            topic = route.params[0];
        } else if (route.page == 'SubmitPost') {
            page_title = translate('create_a_post');
        } else if (route.page == 'Privacy') {
            page_title = translate('privacy_policy');
        } else if (route.page == 'Tos') {
            page_title = translate('terms_of_service');
        } else if (route.page == 'ChangePassword') {
            page_title = translate('change_account_password');
        } else if (route.page == 'CreateAccount') {
            page_title = translate('create_account');
        } else if (route.page == 'RecoverAccountStep1' || route.page == 'RecoverAccountStep2') {
            page_title = translate('stolen_account_recovery');
        } else if (route.page === 'UserProfile') {
            user_name = route.params[0].slice(1);
            page_title = user_name;
            // TODO
            if(route.params[1] === "followers") {
                page_title = translate('people_following_user_name', {user_name}) + ' ';
            }
            if(route.params[1] === "followed") {
                page_title = translate('people_followed_by_user_name', {user_name}) + ' ';
            }
            if(route.params[1] === "curation-rewards") {
                page_title = translate('curation_rewards_by_user_name', {user_name}) + ' ';
            }
            if(route.params[1] === "author-rewards") {
                page_title = translate('author_rewards_by_user_name', {user_name}) + ' ';
            }
            if(route.params[1] === "recent-replies") {
                page_title = translate('replies_by_user_name', {user_name}) + ' ';
            }
            // @user/"posts" is deprecated in favor of "comments" as of oct-2016 (#443)
            if(route.params[1] === "posts" || route.params[1] === "comments") {
                page_title = translate('comments_by_user_name', {user_name}) + ' ';
            }
        } else {
            page_name = ''; //page_title = route.page.replace( /([a-z])([A-Z])/g, '$1 $2' ).toLowerCase();
        }

        // Format first letter of all titles and lowercase user name
        if (route.page !== 'UserProfile') {
            page_title = page_title.charAt(0).toUpperCase() + page_title.slice(1);
        }

        if (process.env.BROWSER && route.page !== 'Post') document.title = page_title + ' — ' + APP_NAME;

           const logo_link = route.params && route.params.length > 1 && this.last_sort_order ? '/' + this.last_sort_order : '/hot';
        let topic_link = topic ? <Link to={`/${this.last_sort_order || 'hot'}/${topic_original_link}`}>{detransliterate(topic)}</Link> : null;



        const sort_orders = [
        ['hot', translate('hot')],
            ['created', translate('new')],

            ['trending', translate('trending_24_hour')],
            // disabled until crowdsale starts
            // ['trending30', translate('trending_30_day')],
            // promotion functionality currently does not work
            // ['promoted', translate('promoted')],
            ['active', translate('active')]
        ];
        if (current_account_name) sort_orders.unshift(['home', translate('home')]);
        const sort_order_menu = sort_orders.filter(so => so[0] !== sort_order).map(so => ({link: sortOrderToLink(so[0], topic_original_link, current_account_name), value: capitalizeFirstLetter(so[1])}));
        // there were a problem when in root route ('/') when header menu didn't
        // had any active links. Thats why selected_sort_order falls down to 'trending' if undefined
        const selected_sort_order = sort_orders.find(so => so[0] === sort_order) || sort_orders[2];
        const sort_orders_horizontal = [
        ['hot', translate('hot')],
            ['created', translate('new')],

            ['trending', translate('trending')],
            // ['promoted', translate('promoted')],
            ['active', translate('active')],
            // ['tasks', translate('tasks')]
        ];
        /* if (current_account_name) sort_orders_horizontal.unshift(['home', translate('home')]); */
        const sort_order_menu_horizontal = sort_orders_horizontal.map(so => {
                sort_order = route.params && route.params[0] !== 'home' ? route.params[0] : null;
                let active = (so[0] === sort_order) || (so[0] === 'trending' && sort_order === 'trending30');
                if (so[0] === 'home' && sort_order === 'home' && !home_account) active = false;
                return {link: sortOrderToLink(so[0], topic_original_link, current_account_name), value: so[1], active};
            });

        // Скрыть форму добавления поста
        // для неавторизованных пользователей
        let formFront = '';
        if (current_account_name && !bmTasks) formFront = <div className="SubmitPost">
            <SubmitReplyEditor successCallback={() => {  }} type="submit_story" />
        </div>;




        return (
            <div className={'PostsIndex row' + (fetching ? ' fetching' : '')}>
                <div className="PostsIndex__left col-md-8 col-sm-12 small-collapse">

                    {formFront}

                    {!bmTasks && <HorizontalMenu items={sort_order_menu_horizontal} />}

                    {!bmTasks && <PostsList ref="list"
                        posts={posts ? posts.toArray() : []}
                        loading={fetching}
                        category={category}
                        loadMore={this.loadMore}
                        emptyText = {emptyText}
                        showSpam={showSpam} /> }

                </div>
                <div className="PostsIndex__topics col-md-4 shrink show-for-large hidden-sm">

                    <Beta />
                    <Products />
	                  <CardMyTen/>
                </div>
            </div>
        );
    }
}

module.exports = {
    path: ':order(/:category)',
    component: connect(
        (state) => {
            // console.log('state.global', state.global)
            const current_user = state.user.get('current');
            const current_account_name = current_user ? current_user.get('username') : state.offchain.get('account');

            return {
                discussions: state.global.get('discussion_idx'),
                status: state.global.get('status'),
                loading: state.app.get('loading'),
                global: state.global,
                current_account_name
            };
        },
        (dispatch) => {
            return {
                requestData: (args) => dispatch({type: 'REQUEST_DATA', payload: args}),
            }
        }
    )(PostsIndex)
};
