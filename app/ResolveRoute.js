export default function resolveRoute(path)
{
    // routes
    if (path === '/') {
        return {page: 'PostsIndex', params: ['trending']};
    }
    if (path === '/tasks') {
        return {page: 'PostsIndex', params: ['tasks']};
    }
    if (path === '/about.html') {
        return {page: 'About'};
    }
    // golos.io landing page
    if (path === '/ico') {
        return {page: 'Landing'};
    }
    if (path === '/login.html') {
        return {page: 'Login'};
    }
    if (path === '/privacy.html') {
        return {page: 'Privacy'};
    }
    if (path === '/support.html') {
        return {page: 'Support'};
    }
    if (path === '/xss/test' && process.env.NODE_ENV === 'development') {
        return {page: 'XSSTest'};
    }
    if (path.match(/^\/tags\.html/)) {
        return {page: 'Tags'};
    }
    if (path === '/tos.html') {
        return {page: 'Tos'};
    }
    if (path === '/change_password') {
        return {page: 'ChangePassword'};
    }
    if (path === '/create_account') {
        return {page: 'CreateAccount'};
    }
    if (path === '/recover_account_step_1') {
        return {page: 'RecoverAccountStep1'};
    }
    if (path === '/recover_account_step_2') {
        return {page: 'RecoverAccountStep2'};
    }
    if (path === '/waiting_list.html') {
        return {page: 'WaitingList'};
    }
    if (path === '/market') {
        return {page: 'Market'};
    }
    if (path === '/bitva') {
        return {page: 'Bitva'};
    }
    if (path === '/~witnesses') {
        return {page: 'Witnesses'};
    }
    if (path === '/submit.html') {
        return {page: 'SubmitPost'};
    }
    if (path === '/top') {
        return {page: 'Top'};
    }
    let match = path.match(/^\/(@[\w\.\d-]+)\/feed\/?$/);
    if (match) {
        return {page: 'PostsIndex', params: ['home', match[1]]};
    }
    

     match = path.match(/^\/(@bm-bmtasks)\/?$/)
        
    if (match) {
        return {page: 'TaskProfile', params: match.slice(1)};
    }

      match = path.match(/^\/(@bmdfef8c9b77aa)\/?$/)
        
    if (match) {
        return {page: 'TaskProfile2', params: match.slice(1)};
    }




    match = path.match(/^\/(@[\w\.\d-]+)\/?$/) ||
        path.match(/^\/(@[\w\.\d-]+)\/(blog|posts|recommended|transfers|curation-rewards|author-rewards|permissions|created|recent-replies|feed|password|followed|followers|settings)\/?$/);
    if (match) {
        return {page: 'UserProfile', params: match.slice(1)};
    }


    match = path.match(/^\/(\@[\w\d-]+)\/([\w\d-]+)\/?$/) ||
        path.match(/^\/([\w\d\-\/]+)\/(\@[\w\d\.-]+)\/([\w\d-]+)\/?$/) ||
        path.match(/^\/([\w\d\-\/]+)\/(\@[\w\d\.-]+)\/([\w\d-]+)\/?\?sort=(\w+)$/);
    if (match) {
        return {page: 'Post', params: match.slice(1)};
    }
    match = path.match(/^\/(best|updated|hot|votes|responses|trending|trending30|promoted|cashout|created|recent|active)\/?$/)
         || path.match(/^\/(best|updated|hot|votes|responses|trending|trending30|promoted|cashout|created|recent|active)\/([\w\d-]+)\/?$/);
    if (match) {
        return {page: 'PostsIndex', params: match.slice(1)};
    }
    return {page: 'NotFound'};
}
