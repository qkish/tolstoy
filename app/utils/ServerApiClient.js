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

export function getUsersByCategory (category = 'all', offset = 0, limit = 50, order, program) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/users?category=${category}&offset=${offset}&limit=${limit}&order=${order}&program=${program}`, {
      credentials: 'same-origin'
    })
    .then(res => res.json())
    .then(({ users }) => users);
}

export function getGameUsersByCategory (category = 'all', offset = 0, limit = 50, order, program, taskid) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/gameusers?category=${category}&offset=${offset}&limit=${limit}&order=${order}&program=${program}&task=${taskid}`, {
      credentials: 'same-origin'
    })
    .then(res => res.json())
    .then(({ users }) => users);
}

export function getUsersCount (category) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/usersCount?category=${category || 'all'}`)
        .then(res => res.json())
        .then(({ count }) => count);
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

export function getUsersByPolk (polkId) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/users?polk=${polkId}`)
        .then(res => res.json())
        .then(({ users }) => users);
}



export function getGameUsersByTen (tenId) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/gameusers?ten=${tenId}`)
        .then(res => res.json())
        .then(({ users }) => users);
}

export function getGameUsersByHundred (hundredId) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/gameusers?hundred=${hundredId}`)
        .then(res => res.json())
        .then(({ users }) => users);
}

export function getGameUsersByPolk (polkId) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/gameusers?polk=${polkId}`)
        .then(res => res.json())
        .then(({ users }) => users);
}



export function getUsersByCouchGroup (couchGroupId, program) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/users?couch_group=${couchGroupId}&program=${program}`)
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
    return fetch(`/api/v1/get_ten_by_name`, {
        method: 'post',
        mode: 'no-cors',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            csrf: $STM_csrf,
            name
        })
    })
        .then(res => res.json())
        .then(({ users }) => users);
}

export function getMyGroup (name) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/get_group_by_name`, {
        method: 'post',
        mode: 'no-cors',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            csrf: $STM_csrf,
            name
        })
    })
        .then(res => res.json())
        .then(({ users }) => users);
}

export function deleteFromS3 (key) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch('/api/v1/delete_from_s3', {
        method: 'post',
        mode: 'no-cors',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            csrf: $STM_csrf,
            key
        })
    })
}

export function updateUser (userId, payload) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/users/${userId}`, {
        method: 'PUT',
        credentials: 'same-origin',
        body: JSON.stringify({ csrf: $STM_csrf, payload })
    })
}

export function updateUserTen (userId, payload) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    return fetch(`/api/v1/users/ten_choosing/${userId}`, {
        method: 'PUT',
        credentials: 'same-origin',
        body: JSON.stringify({ csrf: $STM_csrf, payload })
    })
}

export function setTenLeader (userId, value) {
  if (!process.env.BROWSER || window.$STM_ServerBusy) return;
  return fetch('/api/v1/users/set_ten_leader', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({ csrf: $STM_csrf, userId, value })
  })
}

export function setHundredLeader (userId, value) {
  if (!process.env.BROWSER || window.$STM_ServerBusy) return;
  return fetch('/api/v1/users/set_hundred_leader', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({ csrf: $STM_csrf, userId, value })
  })
}

export function setMyTen (userId, value) {
  if (!process.env.BROWSER || window.$STM_ServerBusy) return;
  return fetch('/api/v1/users/set_my_ten', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({ csrf: $STM_csrf, userId, value })
  })
}

export function chooseSearch (query, group) {
  if (!process.env.BROWSER || window.$STM_ServerBusy) return;
  return fetch(`/api/v1/users/choose_search?q=${query}&group=${group}`, {
      credentials: 'same-origin'
  }).then(res => res.json()).then(({ users }) => users)
}

export function updateProgram (value) {
  if (!process.env.BROWSER || window.$STM_ServerBusy) return;
  return fetch(`/api/v1/user/update_program`, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        csrf: $STM_csrf,
        current_program: value
      })
  })
}

export function updateTaskReply ({ url, status }) {
  if (!process.env.BROWSER || window.$STM_ServerBusy) return;
  return fetch(`/api/v1/reply/update_status`, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        csrf: $STM_csrf,
        payload: {
          url, status
        }
      })
  })
}
