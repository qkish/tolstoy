import React, { Component } from 'react'

class Plan extends Component {
  constructor (props) {
    super(props)
    this.state = {
      plan: null,
      wordPrice: ''
    }
    this.save = this.save.bind(this)
    this.handlePlanChange = this.handlePlanChange.bind(this)
    this.handleWordPriceChange = this.handleWordPriceChange.bind(this)
  }

  handlePlanChange (e) {
    this.setState({
      plan: e.target.value
    })
  }

  handleWordPriceChange (e) {
    this.setState({
      wordPrice: e.target.value
    })
  }

  save () {
    return fetch('/api/v1/plan', {
      method: 'POST',
      mode: 'no-cors',
      credentials: 'same-origin',
      headers: {
          Accept: 'application/json',
          'Content-type': 'application/json'
      },
      body: JSON.stringify({
        plan: this.state.plan,
        wordrice: this.state.wordPrice
      })
    })
  }

  render () {
    return (
      <div className='PostSummary__feedback-container' style={{ marginBottom: '10px' }}>
        <input
          style={{ margin: '10px 0' }}
          type='number'
          placeholder='План на неделю'
          value={this.state.plan}
          onChange={this.handlePlanChange} />
        <input
          style={{ margin: '10px 0' }}
          type='text'
          placeholder='Цена слова'
          value={this.state.wordPrice}
          onChange={this.handleWordPriceChange} />
        <button
          className='button'
          style={{ margin: '10px 0' }}
          onClick={this.save}>
          Сохранить
        </button>
      </div>
    )
  }
}

export default Plan
