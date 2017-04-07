import React, { Component } from 'react'
import { UserAuthWrapper } from 'redux-auth-wrapper'

class AdminContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      post: {}
    }
    this.savePost = this.savePost.bind(this)
  }

  async savePost () {
    await fetch('/api/v1/post', {
      method: 'post',
      credentials: 'same-origin',
      body: JSON.stringify(this.state.post)
    })
  }

  render () {
    return (
      <div>
        <input
          type='text'
          placeholder='Заголовок'
          value={this.state.post.title}
          onChange={e => this.setState({
            post: Object.assign({}, this.state.post, { title: e.target.value })
          })} />
        <textarea
          placeholder='Текст'
          value={this.state.post.content}
          onChange={e => this.setState({
            post: Object.assign({}, this.state.post, { content: e.target.value })
          })} />
        <input
          type='text'
          placeholder='Обложка'
          value={this.state.post.cover}
          onChange={e => this.setState({
            post: Object.assign({}, this.state.post, { cover: e.target.value })
          })} />
        <input
          type='text'
          placeholder='Файл'
          value={this.state.post.file}
          onChange={e => this.setState({
            post: Object.assign({}, this.state.post, { file: e.target.value })
          })} />
        <button onClick={this.savePost}>Сохранить</button>
      </div>
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
