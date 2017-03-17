import React, { Component } from 'react'
import User from 'app/components/elements/User'
import Rate from 'rc-rate'
import 'rc-rate/assets/index.css'

class GamePost extends Component {
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
        {this.props.displayRate && (<div style={{ marginTop: '20px' }}>
          <div className="PostSummary__feedback-subtitle">Интересно:</div>
          <Rate
            count={10}
            onChange={this.props.interestingChange}
            defaultValue={this.props.interestingValue} /> 
          <div className="PostSummary__feedback-subtitle">Просто:</div>
          <Rate
            count={10}
            onChange={this.props.simpleChange}
            defaultValue={this.props.simpleValue} />
          <div className="PostSummary__feedback-subtitle">Понятно:</div>
          <Rate
            count={10}
            onChange={this.props.obviousChange}
            defaultValue={this.props.obviousValue} />
        </div>)}
      </div>
    )
  }
}

export default GamePost
