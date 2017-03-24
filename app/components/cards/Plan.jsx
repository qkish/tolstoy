import React, { Component } from 'react'

class Plan extends Component {
  constructor (props) {
    super(props)
    this.state = {
      plan: null,
      wordPrice: '',
      sended: false
    }

    this.save = this.save.bind(this)
    this.handlePlanChange = this.handlePlanChange.bind(this)
    this.handleWordPriceChange = this.handleWordPriceChange.bind(this)
    this.getPlan = this.getPlan.bind(this)
  }

  async getPlan () {
    const response = await fetch('/api/v1/plan', {
      credentials: 'same-origin',
    })
    const { plan: { plan, word_price } } = await response.json()

    if (plan) {
      this.setState({
        currentPlan: {
          plan,
          wordPrice: word_price
        }
      })
    }
  }

  componentDidMount () {
    this.getPlan()
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

  async save () {
    await fetch('/api/v1/plan', {
      method: 'POST',
      mode: 'no-cors',
      credentials: 'same-origin',
      headers: {
          Accept: 'application/json',
          'Content-type': 'application/json'
      },
      body: JSON.stringify({
        plan: this.state.plan,
        wordPrice: this.state.wordPrice
      })
    })

    this.setState({
      sended: true
    })

    setTimeout(() => {
      this.setState({
        sended: false
      })
      this.getPlan()
    }, 3000)
  }

  render () {
    if (this.state.currentPlan) {
      return (
        <div className='PostSummary__feedback-container' style={{ marginBottom: '10px' }}>
          <div style={{ margin: '10px 0' }}>
            План на неделю: {this.state.currentPlan.plan}
          </div>
          {this.state.currentPlan.wordPrice && <div style={{ margin: '10px 0' }}>
            Цена слова: {this.state.currentPlan.wordPrice}
          </div>}
        </div>
      )
    }

    if (this.state.sended) {
      return (
        <div className='PostSummary__feedback-container' style={{ marginBottom: '10px' }}>
          Сохранено
        </div>
      )
    }

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
