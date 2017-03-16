import React, { Component } from 'react'
import { connect } from 'react-redux'
import GamePostEdit from 'app/components/cards/GamePostEdit'
import Rate from 'rc-rate'
import { UserAuthWrapper } from 'redux-auth-wrapper'

class Feedback extends Component {
  constructor (props) {
    super(props)
    this.state = {
      new: true,
      error: false,
      sended: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    const text = e.target.value
    this.setState({
      text,
      error: false
    })
  }

  async handleSubmit () {
    const text = this.state.text
    const score_1 = this.state.score_1
    const score_2 = this.state.score_2
    const score_3 = this.state.score_3

    if (!text && !score_1 && !score_2 && !score_3) {
      this.setState({
        error: 'Заполните форму'
      })
      return
    }

    this.setState({
      error: false
    })

    try {
      const response = await fetch('/api/v1/feedback', {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({
          body: text,
          score_1,
          score_2,
          score_3
        })
      })

      if (response.status !== 200) {
        throw new Error(response.statusText)
      }

      this.setState({
        new: false,
        sended: true
      })
    } catch (error) {
      this.setState({
        error: error.message
      })
    }
  }

  render () {
    if (this.state.sended) {
      return (
        <div>
          <h3 className="PostSummary__feedback">Спасибо, ваш отзыв принят!</h3>
        </div>
      )
    }
    return (
      <div className="PostSummary__feedback-container">
        <h3 className="PostSummary__feedback">Оставьте отзыв или предложение о сегодняшнем дне и оцените нас!</h3>
        <div className='ReplyEditorShort__body'>
          <textarea
            rows={3}
            autoComplete='off'
            className='expanded-area'
            placeholder='Написать отзыв'
            onChange={this.handleChange}
            value={this.state.text}
          />
          <div className="PostSummary">
            <div className="PostSummary__feedback-title">
              <b>Качество контента</b>
            </div>
            <Rate
              count={10}
              onChange={value => this.setState({
                score_1: value,
                error: false
              })}
              value={this.state.score_1}
            />
            <div className="PostSummary__feedback-title">
              <b>Эмоции</b>
            </div>
            <Rate
              count={10}
              onChange={value => this.setState({
                score_2: value,
                error: false
              })}
              value={this.state.score_2}
            />
            <div className="PostSummary__feedback-title">
              <b>Организация</b>
            </div>
            <Rate
              count={10}
              onChange={value => this.setState({
                score_3: value,
                error: false
              })}
              value={this.state.score_3}
            />
          </div>
          <button
             className='button ReplyEditorShort__buttons-submit'
             onClick={this.handleSubmit}>
            {this.state.new ? 'Отправить отзыв' : 'Сохранено!'}
          </button>
          <div style={{ color: '#d9534f' }}>{this.state.error}</div>
        </div>
      </div>
    )
  }
}

const UserIsAuthenticated = UserAuthWrapper({
  authSelector: state => state.user.get('current'),
  authenticatingSelector: state => state.user.get('logining'),
  wrapperDisplayName: 'UserIsAuthenticated',
  FailureComponent: () => <div>Доступ запрещен</div>,
  LoadingComponent: () => <div>Загрузка...</div>
})

module.exports = {
  path: 'feedback',
  component: UserIsAuthenticated(Feedback)
}
