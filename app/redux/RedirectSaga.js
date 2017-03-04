import { call, put, select, take } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { browserHistory } from 'react-router'
import { startsWith } from 'lodash'

function* redirectWatch () {
    let cp = yield select(state => state.user.get('currentProgram'))
    console.log('URL BEFORE')

    while (!cp) {
        yield take()
        cp = yield select(state => state.user.get('currentProgram'))
    }

    const currentRoute = yield select(state => state.global.get('current_route'))
    let url
    if (startsWith(currentRoute, '/hot')) {
      url = '/hot'
    }
    if (startsWith(currentRoute, '/created')) {
      url = '/created'
    }
    if (startsWith(currentRoute, '/trending')) {
      url = '/trending'
    }
    if (startsWith(currentRoute, '/active')) {
      url = '/active'
    }
    if (startsWith(currentRoute, '/trendng30')) {
      url = '/trendng30'
    }

   
    if (!cp) browserHistory.push(`${url}/bm-open`)

    if (cp && startsWith(currentRoute, '/created/bm-task')) return
    
    if (cp && url) {
      if (cp == 1) browserHistory.push(`${url}/bm-ceh23`)
      if (cp == 2) browserHistory.push(`${url}/bm-mzs17`)

    }
}

export default redirectWatch
