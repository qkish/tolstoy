import { call, put, select, take } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { browserHistory } from 'react-router'

function* redirectWatch () {
    let cp = yield select(state => state.user.get('currentProgram'))
    while (!cp) {
        yield take()
        cp = yield select(state => state.user.get('currentProgram'))
    }
    if (cp) {
      if (cp == 1) browserHistory.push('/hot/bm-ceh23')
      if (cp == 2) browserHistory.push('/hot/bm-mzs17')
    }
}

export default redirectWatch
