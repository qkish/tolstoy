// polyfill webpack require.ensure
//if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import App from 'app/components/App';
import PostsIndex from 'app/components/pages/PostsIndex';
import resolveRoute from './ResolveRoute';


export default {
    path: '/',
    component: App,
    getChildRoutes(nextState, cb) {
        const route = resolveRoute(nextState.location.pathname);
        if (route.page === 'About') {
            //require.ensure([], (require) => {
                cb(null, [require('app/components/pages/About')]);
            //});
        // golos.io ICO page
        // вот бы кто определился с названиями страниц, а то у нас 2 ico
        } else if (route.page === 'Ico') {
            cb(null, [require('app/components/pages/Ico')]);
        // golos.io landing page
        } else if (route.page === 'Landing') {
            cb(null, [require('app/components/pages/Landing')]);
        } else if (route.page === 'Login') {
            //require.ensure([], (require) => {
            cb(null, [require('app/components/pages/Login')]);
            //});
        } else if (route.page === 'LoginCeh') {
            //require.ensure([], (require) => {
            cb(null, [require('app/components/pages/LoginCeh')]);
            //});
        } else if (route.page === 'SignUp') {
            //require.ensure([], (require) => {
            cb(null, [require('app/components/pages/SignUp')]);
            //});
        } else if (route.page === 'Privacy') {
            //require.ensure([], (require) => {
                cb(null, [require('app/components/pages/Privacy')]);
            //});
        } else if (route.page === 'Support') {
            //require.ensure([], (require) => {
                cb(null, [require('app/components/pages/Support')]);
            //});
        } else if (route.page === 'XSSTest' && process.env.NODE_ENV === 'development') {
            //require.ensure([], (require) => {
            cb(null, [require('app/components/pages/XSS')]);
            //});
        } else if (route.page === 'Tags') {
            //require.ensure([], (require) => {
            cb(null, [require('app/components/pages/TagsIndex')]);
            //});
         } else if (route.page === 'Bitva') {
            //require.ensure([], (require) => {
            cb(null, [require('app/components/pages/Bitva')]);
            //});
        } else if (route.page === 'Tos') {
            //require.ensure([], (require) => {
                cb(null, [require('app/components/pages/Tos')]);
            //});
        } else if (route.page === 'ChangePassword') {
            //require.ensure([], (require) => {
            cb(null, [require('app/components/pages/ChangePasswordPage')]);
            //});
        } else if (route.page === 'CreateAccount') {
            //require.ensure([], (require) => {
                cb(null, [require('app/components/pages/CreateAccount')]);
            //});
        } else if (route.page === 'RecoverAccountStep1') {
            //require.ensure([], (require) => {
            cb(null, [require('app/components/pages/RecoverAccountStep1')]);
            //});
        } else if (route.page === 'RecoverAccountStep2') {
            //require.ensure([], (require) => {
            cb(null, [require('app/components/pages/RecoverAccountStep2')]);
            //});
        } else if (route.page === 'WaitingList') {
            //require.ensure([], (require) => {
            cb(null, [require('app/components/pages/WaitingList')]);
            //});
        } else if (route.page === 'Witnesses') {
            //require.ensure([], (require) => {
                cb(null, [require('app/components/pages/Witnesses')]);
            //});
        } else if (route.page === 'SubmitPost') {
            //require.ensure([], (require) => {
            if (process.env.BROWSER)
                cb(null, [require('app/components/pages/SubmitPost')]);
            else
                cb(null, [require('app/components/pages/SubmitPostServerRender')]);
        } else if (route.page === 'UserProfile') {
            //require.ensure([], (require) => {
                cb(null, [require('app/components/pages/UserProfile')]);
            //});
        } else if (route.page === 'TaskProfile') {
            //require.ensure([], (require) => {
                cb(null, [require('app/components/pages/TaskProfile')]);
            //});
        } else if (route.page === 'TaskProfile2') {
            //require.ensure([], (require) => {
                cb(null, [require('app/components/pages/TaskProfile2')]);
            //});
        } else if (route.page === 'Market') {
            //require.ensure([], (require) => {
                cb(null, [require('app/components/pages/Market')]);
            //});
        } else if (route.page === 'Post') {
            //require.ensure([], (require) => {
                cb(null, [require('app/components/pages/PostPage')]);
            //});
        } else if (route.page === 'PostsIndex') {
            //require.ensure([], (require) => {
                //cb(null, [require('app/components/pages/PostsIndex')]);
                cb(null, [PostsIndex]);
            //});
        } else if (route.page === 'Rating') {
            cb(null, [require('app/components/pages/Rating')]);

        } else if (route.page === 'GameRating') {
            cb(null, [require('app/components/pages/GameRating')]);

        } else if (route.page === 'Admin') {
            cb(null, [require('app/components/pages/Admin')]);
        } else if (route.page === 'Choose') {
            cb(null, [require('app/components/pages/Choose')]);
        } else if (route.page === 'Game') {
          cb(null, [require('app/components/pages/Game')])
        } else if (route.page === 'GameVote') {
          cb(null, [require('app/components/pages/GameVote')])
        } else if (route.page === 'FeedbackResults') {
          cb(null, [require('app/components/pages/FeedbackResults')])
        } else {
            //require.ensure([], (require) => {
                cb(process.env.BROWSER ? null : Error(404), [require('app/components/pages/NotFound')]);
            //});
        }
    },
    indexRoute: {
        component: PostsIndex.component
    }
};
