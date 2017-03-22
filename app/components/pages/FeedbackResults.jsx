import React, { Component } from 'react'
import User from 'app/components/elements/User'
import StarRatingComponent from 'react-star-rating-component'
import Pagination from 'react-paginate'
import { Link } from 'react-router'
import { DropdownButton, MenuItem } from 'react-bootstrap'

class FeedbackResults extends Component {
  constructor (props) {
    super(props)
    this.state = {
      perPage: 10,
      event: this.getEvent(),
      city: this.getCity()
    }

    this.getNPS = this.getNPS.bind(this)
    this.getReplies = this.getReplies.bind(this)
    this.getEvent = this.getEvent.bind(this)
    this.getCities = this.getCities.bind(this)
    this.getDay = this.getDay.bind(this)
    this.getCity = this.getCity.bind(this)
  }

  componentDidMount () {
    this.getNPS()
    this.getReplies()
    this.getCities()
  }

  getEvent (props = this.props, type = 'numeric') {
    if (props.params.event === 'ceh') {
      return type === 'numeric' ? '1' : 'ceh'
    }
    if (props.params.event === 'mzs') {
      return type === 'numeric' ? '2' : 'mzs'
    }
    return type === 'numeric' ? '1' : 'ceh'
  }

  getCity () {
    return this.props.params.city || 'all'
  }

  getDay () {
    return 'all'
  }

  async getNPS (event = this.state.event, city = this.state.city) {
    const response = await fetch(`/api/v1/feedback/results/nps?event=${event}&city=${city}`)
    const nps = await response.json()
    this.setState({
      nps
    })
  }

  async getReplies (event = this.state.event, city = this.state.city, limit = this.state.perPage, offset = 0) {
    const response = await fetch(`/api/v1/feedback/results/replies?limit=${limit}&offset=${offset}&event=${event}&city=${city}`)
    const { replies, count } = await response.json()
    this.setState({
      replies,
      repliesCount: count
    })
  }

  async getCities (event = this.state.event) {
    const response = await fetch(`/api/v1/feedback/results/cities?event=${event}`)
    const { cities } = await response.json()
    this.setState({
      cities
    })
  }

  componentWillReceiveProps (nextProps) {
    console.log('FUCK UPDATED PROPS', {
      city: nextProps.params.city,
      event: this.getEvent(nextProps)
    })
    const { city } = nextProps.params
    this.getCities(this.getEvent(nextProps))
    this.getNPS(this.getEvent(nextProps), city)
    this.getReplies(this.getEvent(nextProps), city)
  }

  render () {
    return (

      <div>




      <div className="PostsIndex__left col-md-8 col-sm-12 small-collapse">
        <ul className="HorizontalMenu menu FeedbackResults_menu">
          <li className={this.getEvent() === '1' ? 'active' : ''}>


            <Link to={`/feedback/results/ceh/all/all`}>ЦЕХ</Link>


          </li>

           <DropdownButton title='' bsStyle='link'>
      <MenuItem href="all">Весь ЦЕХ</MenuItem>
      <MenuItem href="#podcasts">День 2</MenuItem>
      <MenuItem href="#">День 3</MenuItem>
      <MenuItem href="#">День 4</MenuItem>
      <MenuItem href="#addBlog">День 5</MenuItem>
    </DropdownButton>
          <li className={this.getEvent() === '2' ? 'active' : ''}>
            <Link to={`/feedback/results/mzs/all/all`}>МЗС</Link>



          </li>
            <DropdownButton title='' bsStyle='link'>
       <MenuItem href="all">Весь МЗС</MenuItem>
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
                      this.getReplies(this.getEvent(this.props), this.getCity(), this.state.perPage, offset).then(() => window.scrollTo(0, 0))
                  }} />
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <div className="PostsIndex__topics col-md-4 shrink show-for-large hidden-sm">

        {this.state.cities && (
          <div className="Card Card__minus-margin">
            <ul className="Card__ul-citys">
              <li>
                <Link to={`/feedback/results/${this.getEvent(this.props, 'string')}/${this.getDay()}/all`}>Все города</Link>
              </li>
              {this.state.cities.map(city => (
                <li key={city}>
                  <Link to={`/feedback/results/${this.getEvent(this.props, 'string')}/${this.getDay()}/${city}`}>{city}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

                </div>

      </div>
    )
  }
}

module.exports = {
  path: 'feedback/results(/:event(/:day(/:city)))',
  component: FeedbackResults
}
