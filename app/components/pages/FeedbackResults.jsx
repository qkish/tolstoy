import React, { Component } from 'react'
import User from 'app/components/elements/User'
import StarRatingComponent from 'react-star-rating-component'
import Pagination from 'react-paginate'

class FeedbackResults extends Component {
  constructor (props) {
    super(props)
    this.state = {
      perPage: 10
    }

    this.getNPS = this.getNPS.bind(this)
    this.getReplies = this.getReplies.bind(this)
  }

  componentDidMount () {
    this.getNPS()
    this.getReplies()
  }

  async getNPS () {
    const response = await fetch(`/api/v1/feedback/results/nps`)
    const nps = await response.json()
    this.setState({
      nps
    })
  }

  async getReplies (limit = this.state.perPage, offset = 0) {
    const response = await fetch(`/api/v1/feedback/results/replies?limit=${limit}&offset=${offset}`)
    const { replies, count } = await response.json()
    this.setState({
      replies,
      repliesCount: count
    })
  }

  render () {
    return (
      <div>
        {this.state.nps ? (
          <div className="PostSummary__NPS">
            <table className="PostSummary__NPS-table">
              <tbody>
                <tr>
                  <td>
                    <div className="PostSummary__NPS-title">{Math.round(this.state.nps.nps1 * 10) / 10}</div>
                    <div className="PostSummary__NPS-desc">Контент</div>
                  </td>
                  <td>
                    <div className="PostSummary__NPS-title">{Math.round(this.state.nps.nps2 * 10) / 10}</div>
                    <div className="PostSummary__NPS-desc">Эмоции</div>
                  </td>
                  <td>
                    <div className="PostSummary__NPS-title">{Math.round(this.state.nps.nps3 * 10) / 10}</div>
                    <div className="PostSummary__NPS-desc">Организация</div>
                  </td>
                  <td>
                    <div className="PostSummary__NPS-title">{Math.round(this.state.nps.nps * 10) / 10}</div>
                    <div className="PostSummary__NPS-desc">Общий</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div>Загрузка...</div>
        )}
        {this.state.replies ? (
          <div>
            {this.state.replies.map(reply => (
              <div key={reply.id} className='PostSummary'>
                <div className='PostSummary__author_with_userpic'>
                  <User account={reply.User.name} />
                </div>
                <div className='PostSummary__content'>{reply.body}</div>
                <div style={{ marginTop: '30px' }}>
                  <div className="PostSummary__feedback-subtitle">Качество контента:</div>
                  <StarRatingComponent
                    name='content-quality'
                    starCount={10}
                    value={reply.total_score_1}
                    editing={false}
                    emptyStarColor='#e3e1d6' />
                  <div className="PostSummary__feedback-subtitle">Эмоции:</div>
                  <StarRatingComponent
                    name='emotions'
                    starCount={10}
                    value={reply.total_score_2}
                    editing={false}
                    emptyStarColor='#e3e1d6' />
                  <div className="PostSummary__feedback-subtitle">Организация:</div>
                  <StarRatingComponent
                    name='organization'
                    starCount={10}
                    value={reply.total_score_3}
                    editing={false}
                    emptyStarColor='#e3e1d6' />
                </div>
              </div>
            ))}
            <div className="Admin__pagination">
              <Pagination
                  pageCount={Math.ceil((this.state.repliesCount || 0) / this.state.perPage)}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={3}
                  previousLabel='&laquo;'
                  nextLabel='&raquo;'
                  containerClassName='pagination'
                  activeClassName='active'
                  onPageChange={({ selected }) => {
                      const currentPage = selected + 1
                      const offset = this.state.perPage * selected
                      this.getReplies(this.state.perPage, offset)
                  }} />
            </div>
          </div>
        ) : (
          <div>Загрузка...</div>
        )}
      </div>
    )
  }
}

module.exports = {
  path: 'feedback/results',
  component: FeedbackResults
}
