import React, { Component } from 'react'
import User from 'app/components/elements/User'
import StarRatingComponent from 'react-star-rating-component'
import Pagination from 'react-paginate'
import { Link } from 'react-router';
import { DropdownButton, MenuItem } from 'react-bootstrap'

class FeedbackResults extends Component {
  constructor (props) {
    super(props)
    this.state = {
      perPage: 10,
      event: this.getCurrentEvent()
    }

    this.getNPS = this.getNPS.bind(this)
    this.getReplies = this.getReplies.bind(this)
    this.toggleEvent = this.toggleEvent.bind(this)
    this.getCurrentEvent = this.getCurrentEvent.bind(this)
  }

  componentDidMount () {
    this.getNPS()
    this.getReplies()
  }

  getCurrentEvent () {
    if (this.props.params.event === 'ceh') {
      return '1'
    }
    if (this.props.params.event === 'mzs') {
      return '2'
    }
    return '1'
  }

  toggleEvent (event) {
    this.setState({
      event
    })
    this.getNPS(event)
    this.getReplies(event)
  }

  async getNPS (event = this.state.event) {
    const response = await fetch(`/api/v1/feedback/results/nps?event=${event}`)
    const nps = await response.json()
    this.setState({
      nps
    })
  }

  async getReplies (event = this.state.event, limit = this.state.perPage, offset = 0) {
    const response = await fetch(`/api/v1/feedback/results/replies?limit=${limit}&offset=${offset}&event=${event}`)
    const { replies, count } = await response.json()
    this.setState({
      replies,
      repliesCount: count
    })
  }

  render () {
    return (

      <div>
  
    


      <div className="PostsIndex__left col-md-8 col-sm-12 small-collapse"> 
        <ul className="HorizontalMenu menu FeedbackResults_menu">
          <li className={this.state.event === '1' ? 'active' : ''}>
         

            <a onClick={() => this.toggleEvent('1')}>ЦЕХ</a>
          
             
          </li>

           <DropdownButton title=" " bsStyle="Link">
      <MenuItem href="#books">Весь ЦЕХ</MenuItem>
      <MenuItem href="#podcasts">День 2</MenuItem>
      <MenuItem href="#">День 3</MenuItem>
      <MenuItem href="#">День 4</MenuItem>
      <MenuItem href="#addBlog">День 5</MenuItem>
    </DropdownButton> 
          <li className={this.state.event === '2' ? 'active' : ''}>
            <a onClick={() => this.toggleEvent('2')}>МЗС</a>

           

          </li>
            <DropdownButton title=" " bsStyle="Link">
       <MenuItem href="#books">Весь МЗС</MenuItem>
      <MenuItem href="#podcasts">День 2</MenuItem>
      <MenuItem href="#">День 3</MenuItem>
      <MenuItem href="#">День 4</MenuItem>
      <MenuItem href="#addBlog">День 5</MenuItem>
    </DropdownButton>
        </ul>
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
                    value={reply.score_1}
                    editing={false}
                    emptyStarColor='#e3e1d6' />
                  <div className="PostSummary__feedback-subtitle">Эмоции:</div>
                  <StarRatingComponent
                    name='emotions'
                    starCount={10}
                    value={reply.score_2}
                    editing={false}
                    emptyStarColor='#e3e1d6' />
                  <div className="PostSummary__feedback-subtitle">Организация:</div>
                  <StarRatingComponent
                    name='organization'
                    starCount={10}
                    value={reply.score_3}
                    editing={false}
                    emptyStarColor='#e3e1d6' />
                </div>
              </div>
            ))}
            <div className="Admin__pagination FeedbackResults_pagination">
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
                      this.getReplies(this.state.event, this.state.perPage, offset).then(() => window.scrollTo(0, 0))
                  }} />
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <div className="PostsIndex__topics col-md-4 shrink show-for-large hidden-sm">

        <div className="Card Card__minus-margin">
          <ul className="Card__ul-citys">

        <li className="active"><Link to="/feedback/results/samara">Все города</Link></li>
        <li><Link to="/created/bm-taskmzs8"><b>Москва</b></Link></li>
        <li><Link to="/created/bm-taskmzs9"><b>Санкт-Петербург</b></Link></li>
        <li><Link to="/created/bm-taskmzs10">Самара</Link></li>
        <li><Link to="/created/bm-taskmzs11">Таганрог</Link></li>
        <li><Link to="/created/bm-taskmzs11">Казань</Link></li>
        

    </ul>

        </div>

                </div>

      </div>
    )
  }
}

module.exports = {
  path: 'feedback/results(/:event(/:date))',
  component: FeedbackResults
}
