import React, { Component } from 'react'
import { connect } from 'react-redux'
import GamePostEdit from 'app/components/cards/GamePostEdit'

import Rate from 'rc-rate'
//import 'rc-rate/assets/index.css'


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
        total_score_1: game.total_score_1,
        total_score_2: game.total_score_2,
        total_score_3: game.total_score_3,
        new: false
      })
    }
  }

  async handleSubmit () {
    console.log('submit')
    const text = this.state.text
    const response = await fetch('/api/v1/game', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({ body: text, 
                             total_score_1: this.state.total_score_1, 
                             total_score_2: this.state.total_score_2,
                             total_score_3: this.state.total_score_3  })
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
      <div className="PostSummary__feedback-container">

    
      <ul className="nav nav-tabs PostSummary__game-tabs">
        <li className="active"><a href="#">Ответ</a></li>
        <li><a href="#">Моя 10</a></li>
        <li><a href="#">Волонтер</a></li>
        <li><a href="#">Другая 10</a></li>
      </ul>




      <h3 className="PostSummary__feedback">Ответ на задание:</h3>
        <div className='ReplyEditorShort__body'>
          <textarea
            rows={3}
            autoComplete='off'
            className='expanded-area'
            placeholder='Написать отзыв'
            onChange={this.handleChange}
            value={this.state.text} />


            <div className="PostSummary">
            <div className="PostSummary__feedback-title"><b>Интересно</b></div>
           
            <div className="PostSummary__feedback-title"><b>Просто</b></div>
            
            <div className="PostSummary__feedback-title"><b>Понятно</b></div>
          
            </div>

          <button
            className='button ReplyEditorShort__buttons-submit'
            onClick={this.handleSubmit}
            disabled={!this.state.text}>
            {this.state.new ? 'Отправить ответ' : 'Сохранено!'}
          </button>
        </div>
       
      </div>
    )
  }
}

module.exports = {
  path: 'feedback',
  component: connect(state => ({
    user: state.user.getIn(['current', 'username'])
  }))(Game)
}
