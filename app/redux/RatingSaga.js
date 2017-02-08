import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { getUsers } from 'app/utils/ServerApiClient.js'

function* fetchUsers (action) {
    try {
        const users = yield call(getUsers, action.category)
        yield put({ type: 'USERS_FETCH_SUCCEEDED', users })
    } catch (e) {
        yield put({ type: 'USERS_FETCH_FAILED', e })
    }
}

function* ratingWatch () {
    yield takeEvery('USERS_FETCH_REQUESTED', fetchUsers)
}

export default ratingWatch
