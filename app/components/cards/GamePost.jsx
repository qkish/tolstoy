import React, { Component } from 'react'
import User from 'app/components/elements/User'
import Rate from 'rc-rate'

class GamePost extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.handleSave = this.handleSave.bind(this)
  }

  handleSave () {
    this.props.save({
      score_1: this.state.score_1,
      score_2: this.state.score_2,
      score_3: this.state.score_3
    })
    this.setState({
      message: 'Сохранено'
    })
  }

  render () {
    const content = this.props.content && this.props.content.split('\n').map(x => (
      <span>{x}<br /></span>
    ))
    return (
      <div className='PostSummary'>
        <div className='PostSummary__author_with_userpic'>
          <User account={this.props.user} />
        </div>
        <div className='PostSummary__content'>{content}</div>
        {this.props.displayRate && (
          <div style={{ marginTop: '20px' }}>
            <div className="PostSummary__feedback-subtitle">Интересно:</div>
            <Rate
              count={10}
              onChange={value => this.setState({ score_1: value })} />
            <div className="PostSummary__feedback-subtitle">Просто:</div>
            <Rate
              count={10}
              onChange={value => this.setState({ score_2: value })} />
            <div className="PostSummary__feedback-subtitle">Понятно:</div>
            <Rate
              count={10}
              onChange={value => this.setState({ score_3: value })} />
            <div style={{ marginTop: '10px' }}>
              {!this.state.message && <button
                className='button ReplyEditorShort__buttons-submit'
                onClick={this.handleSave}>
                Сохранить
              </button>}
              <div style={{ color: '#5cb85c' }}>{this.state.message}</div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default GamePost
