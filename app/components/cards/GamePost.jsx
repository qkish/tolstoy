import React, { Component } from 'react'
import User from 'app/components/elements/User'
import Rate from 'rc-rate'
import shortid from 'shortid'

class GamePost extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comment: props.commentValue
    }
    this.handleSave = this.handleSave.bind(this)
    this.handleCommentChange = this.handleCommentChange.bind(this)
  }

  handleSave () {
    this.props.save({
      score_1: this.state.score_1 || this.props.interestingValue,
      score_2: this.state.score_2 || this.props.simpleValue,
      score_3: this.state.score_3 || this.props.obviousValue,
      comment: this.state.comment
    })
    this.setState({
      message: 'Сохранено'
    })
  }

  handleCommentChange (e) {
    this.setState({
      comment: e.target.value
    })
  }

  render () {
    const content = this.props.content && this.props.content.split('\n').map(x => (
      <span key={shortid.generate()}>{x}<br /></span>
    ))
    return (
      <div className='PostSummary'>
        <div className='PostSummary__author_with_userpic'>
          <User account={this.props.user} />
        </div>
        <div className='PostSummary__content'>{content}</div>
        {this.props.displayRate && (
          <div style={{ marginTop: '20px' }}>
            <div className='ReplyEditorShort__body PostSummary__feedback-comment-input'>
              <textarea
                rows={1}
                autoComplete='off'
                className='expanded-area'
                placeholder='Ваш комментарий'
                onChange={this.handleCommentChange}
                value={this.state.comment} />
            </div>
            <div className="PostSummary__feedback-subtitle">Понятно:</div>
            <Rate
              count={10}
              onChange={value => this.setState({ score_1: value })}
              defaultValue={this.props.interestingValue}
               />
            <div className="PostSummary__feedback-subtitle">Интересно:</div>
            <Rate
              count={10}
              onChange={value => this.setState({ score_2: value })}
              defaultValue={this.props.simpleValue} />
            <div className="PostSummary__feedback-subtitle">Аккуратно:</div>
            <Rate
              count={10}
              onChange={value => this.setState({ score_3: value })}
              defaultValue={this.props.obviousValue}  />
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
