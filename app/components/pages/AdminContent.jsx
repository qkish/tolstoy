import React, { Component } from 'react'
import { UserAuthWrapper } from 'redux-auth-wrapper'
import { Uploader, UploadField } from '@navjobs/upload'

class AdminContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      post: {}
    }
    this.savePost = this.savePost.bind(this)
  }

  async savePost () {
    try {
      const response = await fetch('/api/v1/post', {
        method: 'post',
        credentials: 'same-origin',
        body: JSON.stringify(this.state.post)
      })
      this.setState({
        saved: true
      })
      if (response.status !== 200) {
        throw new Error(response.statusText)
      }
    } catch(err) {
      console.error(err)
    }
  }

  render () {
    if (this.state.saved) {
      return (
        <div>Сохранено</div>
      )
    }
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
        <Uploader
          request={{
            url: '/api/v1/upload',
            method: 'POST'
          }}
          onComplete={({ response, status }) => this.setState({
            post: Object.assign({}, this.state.post, { cover: response.url })
          })}
          uploadOnSelection={true}
        >
          {({ onFiles, progress, complete }) => (
            <div>
              <UploadField onFiles={onFiles}>
                <button className="btn btn-default">Загрузить обложку</button>
              </UploadField>
              {progress ? `Progress: ${progress}` : null}
              {complete ? 'Загружено' : null}
            </div>
          )}
        </Uploader>
        <Uploader
          request={{
            url: '/api/v1/upload',
            method: 'POST'
          }}
          onComplete={({ response, status }) => this.setState({
            post: Object.assign({}, this.state.post, { file: response.url })
          })}
          uploadOnSelection={true}
        >
          {({ onFiles, progress, complete }) => (
            <div>
              <UploadField onFiles={onFiles}>
                <button className="btn btn-default">Загрузить файл</button>
              </UploadField>
              {progress ? `Progress: ${progress}` : null}
              {complete ? 'Complete!' : null}
            </div>
          )}
        </Uploader>

        <button
          className="btn btn-default"
          onClick={this.savePost}>
          Сохранить
        </button>
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
