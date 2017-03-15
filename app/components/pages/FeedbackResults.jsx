import React, { Component } from 'react'
import User from 'app/components/elements/User'

class FeedbackResults extends Component {
  constructor (props) {
    super(props)
    this.state = {}

    this.getData = this.getData.bind(this)
  }

  componentDidMount () {
    this.getData()
  }

  async getData () {
    const response = await fetch('/api/v1/feedback/results')
    const data = await response.json()
    this.setState({
      data
    })
  }

  render () {
    return (<div>
      {this.state.data ? (
        <div>
          <table>
            <tbody>
              <tr>
                <td>
                  <div style={{ textAlign: 'center', fontSize: '28px' }}>{Math.round(this.state.data.nps1 * 10) / 10}</div>
                  <div style={{ textAlign: 'center' }}>Качество контента</div>
                </td>
                <td>
                  <div style={{ textAlign: 'center', fontSize: '28px' }}>{Math.round(this.state.data.nps2 * 10) / 10}</div>
                  <div style={{ textAlign: 'center' }}>Эмоции</div>
                </td>
                <td>
                  <div style={{ textAlign: 'center', fontSize: '28px' }}>{Math.round(this.state.data.nps3 * 10) / 10}</div>
                  <div style={{ textAlign: 'center' }}>Организация</div>
                </td>
                <td>
                  <div style={{ textAlign: 'center', fontSize: '28px' }}>{Math.round(this.state.data.nps * 10) / 10}</div>
                  <div style={{ textAlign: 'center' }}>Общий</div>
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            {this.state.data.replies.map(reply => (
              <div key={reply.id} className='PostSummary'>
                <div className='PostSummary__author_with_userpic'>
                  <User account={reply.User.name} />
                </div>
                <div className='PostSummary__content'>{reply.body}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>Загрузка</div>
      )}
    </div>)
  }
}

module.exports = {
  path: 'feedback/results',
  component: FeedbackResults
}
