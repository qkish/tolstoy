import { takeEvery } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { updateUser } from 'app/utils/ServerApiClient'

// WTF? WHY IT DOESN`T WORK?
// export default function* adminSaga () {
//     yield takeEvery('admin/TEN_CHANGE', tenChange)
//     yield takeEvery('admin/HUNDRED_CHANGE', hundredChange)
//     yield takeEvery('admin/POLK_CHANGE', polkChange)
//     yield takeEvery('admin/COUCH_GROUP_CHANGE', couchGroupChange)
//
//     yield takeEvery('admin/TEN_LEADER_CHANGE', tenLeaderChange)
//     yield takeEvery('admin/HUNDRED_LEADER_CHANGE', hundredLeaderChange)
//     yield takeEvery('admin/POLK_LEADER_CHANGE', polkLeaderChange)
//     yield takeEvery('admin/COUCH_CHANGE', couchChange)
// }

export default [
    tenChangeWatch,
    hundredChangeWatch,
    polkChangeWatch,
    couchGroupChangeWatch,
    tenLeaderChangeWatch,
    hundredLeaderChangeWatch,
    polkLeaderChangeWatch,
    couchChangeWatch
]

function* tenChangeWatch () {
    yield* takeEvery('admin/TEN_CHANGE', tenChange)
}

function* hundredChangeWatch () {
    yield* takeEvery('admin/HUNDRED_CHANGE', hundredChange)
}

function* polkChangeWatch () {
    yield* takeEvery('admin/POLK_CHANGE', polkChange)
}

function* couchGroupChangeWatch () {
    yield* takeEvery('admin/COUCH_GROUP_CHANGE', couchGroupChange)
}

function* tenLeaderChangeWatch () {
    yield* takeEvery('admin/TEN_LEADER_CHANGE', tenLeaderChange)
}

function* hundredLeaderChangeWatch () {
    yield* takeEvery('admin/HUNDRED_LEADER_CHANGE', hundredLeaderChange)
}

function* polkLeaderChangeWatch () {
    yield* takeEvery('admin/POLK_LEADER_CHANGE', polkLeaderChange)
}

function* couchChangeWatch () {
    yield* takeEvery('admin/COUCH_CHANGE', couchChange)
}

function* tenChange (action) {
    const payload = {
        ten: action.payload.tenId
    }
    yield updateUser(action.payload.userId, payload)
}

function* hundredChange (action) {
    const payload = {
        hundred: action.payload.hundredId
    }
    yield updateUser(action.payload.userId, payload)
}

function* polkChange (action) {
    const payload = {
        polk: action.payload.polkId
    }
    yield updateUser(action.payload.userId, payload)
}

function* couchGroupChange (action) {
    const payload = {
        couch_group: action.payload.couchGroupId
    }
    yield updateUser(action.payload.userId, payload)
}

function* tenLeaderChange (action) {
    const payload = {
        ten_leader: action.payload.value
    }
    yield updateUser(action.payload.userId, payload)
}

function* hundredLeaderChange (action) {
    const payload = {
        hundred_leader: action.payload.value
    }
    yield updateUser(action.payload.userId, payload)
}

function* polkLeaderChange (action) {
    const payload = {
        polk_leader: action.payload.value
    }
    yield updateUser(action.payload.userId, payload)
}

function* couchChange (action) {
    const payload = {
        couch: action.payload.value
    }
    yield updateUser(action.payload.userId, payload)
}
