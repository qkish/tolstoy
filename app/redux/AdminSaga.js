import { takeEvery } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'

export default function* adminSaga () {
    yield* takeEvery('admin/TEN_CHANGE', tenChange)
    yield* takeEvery('admin/HUNDRED_CHANGE', hundredChange)
    yield* takeEvery('admin/POLK_CHANGE', polkChange)
    yield* takeEvery('admin/COUCH_GROUP_CHANGE', couchGroupChange)

    yield* takeEvery('admin/TEN_LEADER_CHANGE', tenLeaderChange)
    yield* takeEvery('admin/HUNDRED_LEADER_CHANGE', hundredLeaderChange)
    yield* takeEvery('admin/POLK_LEADER_CHANGE', polkLeaderChange)
    yield* takeEvery('admin/COUCH_CHANGE', couchChange)
}

function* tenChange (action) {
    console.log('-- action --', action)
}

function* hundredChange (action) {
    console.log('-- action --', action)
}

function* polkChange (action) {
    console.log('-- action --', action)
}

function* couchGroupChange (action) {
    console.log('-- action --', action)
}

function* tenLeaderChange (action) {
    console.log('-- action --', action)
}

function* hundredLeaderChange (action) {
    console.log('-- action --', action)
}

function* polkLeaderChange (action) {
    console.log('-- action --', action)
}

function* couchChange (action) {
    console.log('-- action --', action)
}
