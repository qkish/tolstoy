export default function resolveRoute(path)
{
    // routes
    if (path === '/') {
        return {page: 'PostsIndex', params: ['trending']};
    }
    if (path === '/tasks') {
        return {page: 'PostsIndex', params: ['tasks']};
    }
    if (path === '/check-task-reply') {
      return {page: 'PostsIndex', params: ['check_task_reply']};
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
    if (path === '/ceh') {
        return {page: 'LoginCeh'};
    }
     if (path === '/mzs') {
        return {page: 'LoginCeh'};
    }
    if (path === '/signup.html') {
        return {page: 'SignUp'};
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
    if (path === '/game') {
      return { page: 'Game' }
    }
    if (path === '/feedback') {
      return { page: 'Feedback' }
    }
    let match = path.match(/^\/content\/?((mzs|ceh)?\/?(\w+)\/?(.+))?$/)
    if (match) {
      return { page: 'Content', params: match }
    }
    match = path.match(/^\/feedback\/results\/?((mzs|ceh)?\/?(\w+)\/?(.+))?$/)
    if (match) {
      return { page: 'FeedbackResults', params: match }
    }
    match = path.match(/^\/rating\/?(all|polki|hundreds|tens|ten|hundred|polk|my-ten|couches|couch-group|my-group)?\/?(\d+)?$/)
    if (match) {
        return {page: 'Rating', params: match[1]};
    }
    match = path.match(/^\/gamerating\/?(all|polki|hundreds|tens|ten|hundred|polk|my-ten|couches|couch-group|my-group|u|t)?\/?(\d+)?$/)
    if (match) {
        return {page: 'GameRating', params: match[1]};
    }
    match = path.match(/^\/gamevote\/?(ten|user)?\/?(\d+)?$/)
    if (match) {
      return { page: 'GameVote', params: match }
    }
    match = path.match(/^\/choose\/(hundreds|tens|myten)$/)
    if (match) {
        return { page: 'Choose', params: match[1] };
    }
    match = path.match(/^\/admin\/?(all|polki|hundreds|tens|ten|hundred|polk|my-ten|couches|couch-group|my-group|roles|volunteer)?\/?(\d+)?$/)
    if (match) {
        return {page: 'Admin', params: match[1]};
    }

    match = path.match(/^\/admin\/content\/?(\d+)?$/)
    if (match) {
      return { page: 'AdminContent', params: match[1] }
    }

    match = path.match(/^\/(@[\w\.\d-]+)\/feed\/?$/);
    if (match) {
        return {page: 'PostsIndex', params: ['home', match[1]]};
    }


     match = path.match(/^\/(@bm-bmtasks)\/?$/)

    if (match) {
        return {page: 'TaskProfile', params: match.slice(1)};
    }

      match = path.match(/^\/(@bm-bmtasksmz)\/?$/)

    if (match) {
        return {page: 'TaskProfile', params: match.slice(1)};
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
