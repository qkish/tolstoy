import React, { Component } from 'react'
import LoadingIndicator from 'app/components/elements/LoadingIndicator'

class Plan extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      sended: false
    }

    this.save = this.save.bind(this)
    this.handlePlanChange = this.handlePlanChange.bind(this)
    this.handleWordPriceChange = this.handleWordPriceChange.bind(this)
    this.getPlan = this.getPlan.bind(this)
  }

  async getPlan () {
    const response = await fetch(`/api/v1/plan?id=${this.props.for}`, {
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

    this.setState({
      loading: true
    })

    try {
      const response = await fetch('/api/v1/plan', {
        method: 'POST',
        mode: 'no-cors',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          id: this.props.for,
          plan: this.state.plan,
          wordPrice: this.state.wordPrice
        })
      })

      if (response.status !== 200) {
        throw new Error(response.statusText)
      }

      this.setState({
        loading: false,
        sended: true
      })

      await this.getPlan()
    } catch (error) {
      this.setState({
        loading: false,
        sended: false,
        error
      })
    }

  }

  render () {
    if (this.state.currentPlan) {
      return (
        <div className='PostSummary__feedback-container' style={{ marginBottom: '10px' }}>
          <div style={{ margin: '10px 0' }}>
            {this.props.titlePlan}: {this.state.currentPlan && this.state.currentPlan.plan} руб.
          </div>
          {this.state.currentPlan.wordPrice && <div style={{ margin: '10px 0' }}>
            Цена слова: {this.state.currentPlan.wordPrice}
          </div>}
        </div>
      )
    }

    if (this.props.readOnly) {
      return (
        <div className='PostSummary__feedback-container' style={{ marginBottom: '10px' }}>
          <div style={{ margin: '10px 0' }}>
            {this.props.titlePlan}: 0 руб.
          </div>
          <div style={{ margin: '10px 0' }}>
            Цена слова: 0
          </div>
        </div>
      )
    }

    return (
      <div className='PostSummary__feedback-container' style={{ marginBottom: '10px' }}>
        <h3>Поставьте план на неделю</h3>
        <input
          style={{ margin: '10px 0' }}
          type='number'
          pattern='\d*'
          inputMode='numeric'
          placeholder='План на неделю'
          value={this.state.plan}
          onChange={this.handlePlanChange} />
        <input
          style={{ margin: '10px 0' }}
          type='text'
          placeholder='Цена слова'
          value={this.state.wordPrice}
          onChange={this.handleWordPriceChange} />
        <div>
          <div>
            <button
              className='button'
              style={{ margin: '10px 0' }}
              disabled={!this.state.plan || this.state.loading}
              onClick={this.save}>
              Сохранить
            </button>
          </div>
          {this.state.loading && <LoadingIndicator type='circle' />}
        </div>
      </div>
    )
  }
}

Plan.defaultProps = {
  titlePlan: 'План на неделю'
}

export default Plan
