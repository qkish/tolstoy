import React, { Component } from 'react'
import { UserAuthWrapper } from 'redux-auth-wrapper'

class AdminContent extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>{this.props.params.id}</div>
    )
  }
}

const UserIsAuthenticated = UserAuthWrapper({
    authSelector: state => state.user,
    authenticatingSelector: state => !state.user.get('current'),
    wrapperDisplayName: 'UserIsAuthenticated',
    FailureComponent: () => <div>Доступ запрещен</div>,
    LoadingComponent: () => <div>Загрузка...</div>,
    predicate: user => user.get('isVolunteer')
})

module.exports = {
    path: 'admin/content(/:id)',
    component: UserIsAuthenticated(AdminContent)
}