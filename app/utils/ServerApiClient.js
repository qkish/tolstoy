export function serverApiLogin(account) {

    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    fetch('/api/v1/login_account', {
        method: 'post',
        mode: 'no-cors',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({csrf: $STM_csrf, account})
    });
}

export function serverApiLogin2 (username, password) {
    console.log('SERVER LOGIN2 CALL', username, password);
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch('/api/v1/login2', {
        method: 'post',
        mode: 'no-cors',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({csrf: $STM_csrf, username, password})
    }).then(res => res.json())
}

export function getBMAccessToken (username, password) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    fetch('http://test2.api.molodost.bz/oauth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: 'renat.biktagirov',
            client_secret: '6NbQvMElYMcBbOVWie7a1Bs4rfVt9FpNY4V4Fl6EEGt4xTEUa1K0ugMohlemqFQ5',
            grant_type: 'password',
            username,
            password
        })
    }).then(res => res.json())
}

// Auth controller
export function serverApiGetAccountPrivateKey(username /* , password */) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch('/api/v1/get_account_private_key', {
        method: 'post',
        mode: 'no-cros',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({csrf: $STM_csrf, username})
    }).then(res => res.json());
}

export function serverApiLogout() {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    fetch('/api/v1/logout_account', {
        method: 'post',
        mode: 'no-cors',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({csrf: $STM_csrf})
    });
}

let last_call;
export function serverApiRecordEvent(type, val) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    if (last_call && (new Date() - last_call < 60000)) return;
    last_call = new Date();
    const value = val && val.stack ? `${val.toString()} | ${val.stack}` : val;
    fetch('/api/v1/record_event', {
        method: 'post',
        mode: 'no-cors',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({csrf: $STM_csrf, type, value})
    });
}

export function checkUser (username) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch('/api/v1/check_user', {
        method: 'post',
        mode: 'no-cors',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({csrf: $STM_csrf, username})
    }).then(res => res.json())
}

export function updateMoney (payload) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch('/api/v1/user/update_money', {
        method: 'post',
        mode: 'no-cors',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            csrf: $STM_csrf,
            payload
        })
    }).then(res => res.json());
}

export function getUsersByCategory (category) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/users?category=${category || 'all'}`)
        .then(res => res.json())
        .then(({ users }) => users);
}

export function getUsersByTen (tenId) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/users?ten=${tenId}`)
        .then(res => res.json())
        .then(({ users }) => users);
}

export function getUsersByHundred (hundredId) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/users?hundred=${hundredId}`)
        .then(res => res.json())
        .then(({ users }) => users);
}

export function searchUsers (text) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/users?search=${text}`)
        .then(res => res.json())
        .then(({ users }) => users);
}

export function getMyTen (name) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/users?myTen=${name}`)
        .then(res => res.json())
        .then(({ users }) => users);
}
