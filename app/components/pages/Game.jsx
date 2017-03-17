import React, { Component } from 'react'
import { connect } from 'react-redux'
import GamePostEdit from 'app/components/cards/GamePostEdit'
import StarRatingComponent from 'react-star-rating-component'

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
        error: 'Заполните ответ на задание'
      })
      return
    }

    this.setState({
      error: false
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
        error: error.message
      })
    }
  }

  render () {
    return (
      <div className="PostSummary__feedback-container">
        <h3 className="PostSummary__feedback">Ответ на задание:</h3>

        <div className='ReplyEditorShort__body'>
          <textarea
            rows={3}
            autoComplete='off'
            className='expanded-area'
            placeholder='Написать отзыв'
            onChange={this.handleChange}
            value={this.state.text} />

          {!this.state.new && (
            <div className="PostSummary">
              <div className="PostSummary__feedback-title">
                <b>Интересно</b>
              </div>
              <StarRatingComponent
                name='interesting'
                starCount={10}
                editing={false}
                value={this.state.total_score_1}
                emptyStarColor='#e3e1d6' />
              <div className="PostSummary__feedback-title">
                <b>Просто</b>
              </div>
              <StarRatingComponent
                name='simple'
                starCount={10}
                editing={false}
                value={this.state.total_score_2}
                emptyStarColor='#e3e1d6' />
              <div className="PostSummary__feedback-title">
                <b>Понятно</b>
              </div>
              <StarRatingComponent
                name='obvious'
                starCount={10}
                editing={false}
                value={this.state.total_score_3}
                emptyStarColor='#e3e1d6' />
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <button
              className='button ReplyEditorShort__buttons-submit'
              onClick={this.handleSubmit}>
              {this.state.new ? 'Отправить ответ' : 'Обновить'}
            </button>
            <div style={{ color: '#d9534f' }}>{this.state.error}</div>
            <div style={{ color: '#5cb85c' }}>{this.state.message}</div>
          </div>

        </div>
      </div>
    )
  }
}

module.exports = {
  path: 'game',
  component: Game
}
