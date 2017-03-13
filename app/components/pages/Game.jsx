import React, { Component } from 'react'
import { connect } from 'react-redux'
import GamePost from 'app/components/cards/GamePost'

class Game extends Component {
  constructor (props) {
    super(props)
    this.state = {
      new: true
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
        content: game.content,
        new: false
      })
    }
  }

  async handleSubmit () {
    const text = this.state.text
    const response = await fetch('/api/v1/game', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({ body: text })
    })
    if (response.status === 200) {
      this.setState({
        new: false
      })
      await this.getContent()
    }
  }

  render () {
    return (
      <div>
        <div className='ReplyEditorShort__body'>
          <textarea
            rows={3}
            autoComplete='off'
            className='expanded-area'
            placeholder='Написать отчет'
            onChange={this.handleChange}
            value={this.state.text} />
          <button
            className='button ReplyEditorShort__buttons-submit'
            onClick={this.handleSubmit}
            disabled={!this.state.text}>
            {this.state.new ? 'Отправить на проверку' : 'Сохранить'}
          </button>
        </div>
        {!this.state.new && <GamePost user={this.props.user} content={this.state.content} />}
      </div>
    )
  }
}

module.exports = {
  path: 'game',
  component: connect(state => ({
    user: state.user.getIn(['current', 'username'])
  }))(Game)
}
