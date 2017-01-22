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
    }).then(res => res.json()).catch(e => e)
}

export function getBMAccessToken (username, password) {
    fetch('http://test2.api.molodost.bz/oauth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: 'renat.biktagirov',
            client_secret: '6NbQvMElYMcBbOVWie7a1Bs4rfVt9FpNY4V4Fl6EEGt4xTEUa1K0ugMohlemqFQ5',
            grant_type: 'client_credentials',
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
