import React, { Component } from 'react'
import { connect } from 'react-redux'
import GamePostEdit from 'app/components/cards/GamePostEdit'
import StarRatingComponent from 'react-star-rating-component'
import QRCode from 'qrcode.react'
import User from 'app/components/elements/User'

class Game extends Component {
  constructor (props) {
    super(props)
    this.state = {
      new: true,
      error: false,
      message: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.getContent = this.getContent.bind(this)
  }

  handleChange (e) {
    const text = e.target.value
    this.setState({
      text
    })
  }

  componentDidMount () {
    this.getContent()
  }

  async getContent () {
    const response = await fetch('/api/v1/game', {
      credentials: 'same-origin'
    })
    const game = await response.json()

    if (game.content) {
      this.setState({
        text: game.content,
        scores: game.scores,
        total_score_1: game.total_score_1,
        total_score_2: game.total_score_2,
        total_score_3: game.total_score_3,
        new: false
      })
    }
  }

  async handleSubmit () {
    const text = this.state.text

    if (!text) {
      this.setState({
        error: 'Заполните ответ на задание',
        message: ''
      })
      return
    }

    this.setState({
      error: false,
      message: ''
    })

    try {
      const response = await fetch('/api/v1/game', {
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({ body: text })
      })

      if (response.status !== 200) {
        throw new Error(response.statusText)
      }

      this.setState({
        new: false,
        message: this.state.new ? 'Отправлено' : 'Обновлено'
      })

      await this.getContent()
    } catch (error) {
      this.setState({
        error: error.message,
        message: ''
      })
    }
  }

  render () {
    return (
      <div className="PostSummary__feedback-container">
        <h3>Ответ на задание</h3>
        <div className="PostSummary__feedback-subtext">Вы можете обновлять ответ в любой момент!</div>

        <div className='ReplyEditorShort__body'>
          <textarea
            rows={3}
            autoComplete='off'
            className='expanded-area'
            placeholder='Напишите ответ'
            onChange={this.handleChange}
            value={this.state.text} />
          <div style={{ marginTop: '20px', height: '50px' }}>
            <button
              className='button ReplyEditorShort__buttons-submit'
              onClick={this.handleSubmit}>
              {this.state.new ? 'Отправить ответ' : 'Обновить'}
            </button>
            <div style={{ color: '#d9534f' }}>{this.state.error}</div>
            <div style={{ color: '#5cb85c' }}>{this.state.message}</div>
          </div>

          {!this.state.new && (
            <div className="PostSummary__feedback-wrap">
              <div className="PostSummary__feedback-title">
                <b>Понятно {this.state.total_score_1 && this.state.total_score_1.toFixed(2)}</b>
              </div>
              <StarRatingComponent
                name='interesting'
                starCount={10}
                editing={false}
                value={this.state.total_score_1}
                emptyStarColor='#e3e1d6' />
              <div className="PostSummary__feedback-title">
                <b>Интересно {this.state.total_score_2 && this.state.total_score_2.toFixed(2)}</b>
              </div>
              <StarRatingComponent
                name='simple'
                starCount={10}
                editing={false}
                value={this.state.total_score_2}
                emptyStarColor='#e3e1d6' />
              <div className="PostSummary__feedback-title">
                <b>Аккуратно {this.state.total_score_3 && this.state.total_score_3.toFixed(2)}</b>
              </div>
              <StarRatingComponent
                name='obvious'
                starCount={10}
                editing={false}
                value={this.state.total_score_3}
                emptyStarColor='#e3e1d6' />

              <div>{this.state.scores && this.state.scores.map(score => (
                <div key={score.id}>
                  <div><User account={score.User.name} /></div>
                  <div>{score.comment}</div>
                  <div>Понятно: {score.score_1}</div>
                  <div>Интересно: {score.score_2}</div>
                  <div>Аккуратно: {score.score_3}</div>
                </div>
              ))}</div>
            </div>
          )}

        </div>
        <div className="PostSummary__feedback-qr"><QRCode value={'http://platform.molodost.bz/gamevote/user/' + this.props.myId} /></div>
        <div className="PostSummary__feedback-mylink">Ваша ссылка: <b>http://platform.molodost.bz/gamevote/user/{this.props.myId}</b></div>
      </div>
    )
  }
}

module.exports = {
  path: 'game',
  component: Game
}
