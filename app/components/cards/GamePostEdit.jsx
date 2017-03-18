import React, { Component } from 'react'
import User from 'app/components/elements/User'
import Rate from 'rc-rate'
import 'rc-rate/assets/index.css'

class GamePostEdit extends Component {
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
        {this.props.displayRate && (<div>
           <div>Понятно</div>
          <Rate
            count={10}
            onHoverChange = {() => null}
            value={this.props.interestingValue} />
          <div>Интересно</div>
          <Rate
            count={10}
            onHoverChange = {() => null}
            value={this.props.simpleValue} /> 
          <div>Аккуратно</div>
          <Rate
            count={10}
            onHoverChange = {() => null}
            value={this.props.obviousValue} /> 
        </div>)}
      </div>
    )
  }
}

export default GamePostEdit