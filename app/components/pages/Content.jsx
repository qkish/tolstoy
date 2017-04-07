import React, { Component } from 'react'
import { compose } from 'redux'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { UserAuthWrapper } from 'redux-auth-wrapper'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import HorizontalSubmenu from 'app/components/elements/HorizontalSubmenu'
import StarRatingComponent from 'react-star-rating-component'
import ReactPlayer from 'react-player'

class Content extends Component {
  constructor (props) {
    super(props)

    this.state = {
      tags: [],
      content: []
    }

    this.getTag = this.getTag.bind(this)
    this.getEvent = this.getEvent.bind(this)
  }

  componentDidMount () {
    this.getContent(this.props.location.query.tag, this.props.params.event)
    this.getTags(this.props.params.event)
  }

  getEvent (props = this.props, type = 'numeric') {
    if (props.params.event === 'ceh') return type === 'numeric' ? '1' : 'ceh'
    if (props.params.event === 'mzs') return type === 'numeric' ? '2' : 'mzs'
    return type === 'numeric' ? '1' : 'ceh'
  }

  getTag (props = this.props) {
    return (props.location && props.location.query) ? props.location.query.tag || 'all' : 'all'
  }

  getContentType (props = this.props) {
    return (props.location && props.location.query) ? props.location.query.type || 'all' : 'all'
  }

  tags = [
    { name: 'Дашкиев', count: 2 },
    { name: 'Смешной тег', count: 15 },
    { name: 'Видео', count: 5 },
    { name: 'Трафик', count: 6 },
    { name: 'Мотивация', count: 3 }
  ]

  types = [
    { name: 'Все', code: 'all' },
    { name: 'Видео', code: 'video' },
    { name: 'Статьи', code: 'articles' },
    { name: 'Презентации', code: 'presentations' }
  ]

  programs = [
    { name: 'ЦЕХ', code: 'ceh', num: 1 },
    { name: 'МЗС', code: 'mzs', num: 2 }
  ]

  programsByKey = {
    ceh: { name: 'ЦЕХ', code: 'ceh', num: 1 },
    mzs: { name: 'МЗС', code: 'mzs', num: 2 }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.location.query.tag !== nextProps.location.query.tag) this.getContent(nextProps.location.query.tag, nextProps.params.event)
    else if (this.props.params.event !== nextProps.params.event) this.getContent(null, nextProps.params.event)
  }

  getContent (tag, event) {
    let url = '/api/v1/content_list?program=' + this.props.currentProgram || 1
    if (tag) url = url + '&tag=' + tag

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          content: res.result
        })
      })
      .catch(err => {})
  }

  getTags (event) {
    fetch('/api/v1/content_list_tags?program=' + this.programsByKey[event || 'ceh'].num || 1)
      .then(res => res.json())
      .then(res => {
        this.setState({
          tags: res.result
        })
      })
      .catch(err => {})
  }

  render () {
    let { content, tags } = this.state

    return (<div>
      <div className="PostsIndex__left col-md-8 col-sm-12 small-collapse">

        <ul className="HorizontalMenu menu FeedbackResults_menu">
          { this.types.map(el => (
            <li className={this.getContentType() === el.code ? 'active' : ''} key={ 'content-type-' + el.code }>
              <Link to={`/content/${this.getEvent(this.props, 'string')}?type=` + el.code}>{ el.name }</Link>
            </li>
          )) }
        </ul>

        <div className="Rating__submenu">
          <ul className="HorizontalSubmenu menu">
            { this.programs.map(el => (
              <li className={this.getEvent() == el.num ? 'active' : ''} key={ 'content-program-' + el.code }>
                <Link to={`/content/` + el.code }>{ el.name }</Link>
              </li>
            )) }
          </ul>
        </div>

        <br />

        { (content && content.length) && content.map(el => (
          <div className="PostSummary content-post" key={ 'content-post-' + el.Post.id }>
            <div
              className="content-post__image-container"
              style={{ cursor: 'pointer' }}
              onClick={() => this.setState({
                [`${el.Post.id}-showVideo`]: true
              })}>
              {this.state[`${el.Post.id}-showVideo`] ? (
                <div>
                  {el.video &&  <ReactPlayer url={el.video} controls={true} width='100%' />}
                </div>
              ) : (
                <div>{el.cover && <img className="content-post__image" src={el.cover} alt={ el.Post.title } />}</div>
              )}
            </div>
            <h3>{ el.Post.title }</h3>
            <div>{ el.Post.content }</div>
            {el.file && (
              <div>
                <a href={el.file} className='PostSummary__file PostSummary__file-pdf' target="_blank">
                  {decodeURIComponent(el.file.substring(el.file.lastIndexOf('/') + 1))}
                </a>
              </div>
            )}
            { el.Post.Tags.length && <div className="content-post__row content-post__row_tags">
              { el.Post.Tags.map(tag => (
                <Link key={el.Post.id + '-tag-' + tag.name + Math.random() } className="content-post__tag" to={ `/content/${this.getEvent(this.props, 'string')}?tag=` + tag.name }>{ tag.name }</Link>
              ))}
            </div>}
          </div>
        )) }

      </div>

      <div className="PostsIndex__topics col-md-4 shrink show-for-large hidden-sm">
        <div className="Card Card__minus-margin">
          <ul className="Card__ul-citys">
            { tags.map(el => (
              <li className={ this.getTag() === el.name ? "active" : "" } key={ 'content-tags-' + el.name }>
                <Link to={ `/content/${this.getEvent(this.props, 'string')}?tag=` + el.name }>{ el.name }</Link>
              </li>
            )) }
          </ul>
        </div>
      </div>

    </div>)
  }
}

const UserIsAuthenticated = UserAuthWrapper({
  authSelector: state => state.user.get('current'),
  authenticatingSelector: state => state.user.get('logining'),
  wrapperDisplayName: 'UserIsAuthenticated',
  FailureComponent: () => <div>Вы не аутентифицированы. Войдите в аккаунт.</div>,
  LoadingComponent: () => <div>Загрузка...</div>
})

const enhanced = compose(
  UserIsAuthenticated,
  connect(state => ({ currentProgram: state.user.get('currentProgram') }))
)

module.exports = {
  path: 'content(/:event)',
  component: enhanced(Content)
}
