import React, { Component } from 'react'
import GamePost from 'app/components/cards/GamePost'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Game from 'app/components/pages/Game'
import LoadingIndicator from 'app/components/elements/LoadingIndicator'
import { UserAuthWrapper } from 'redux-auth-wrapper'
import Plan from 'app/components/cards/Plan'
import MobileDetect from 'mobile-detect'

const BrowserFail = () => (
  <div style={{ marginTop: '10px' }} className="alert alert-warning">Временно игра не поддерживает бразуер Chrome на iOS. Пожалуйста, используйте бразуер Safari! Приносим извинения за неудобства!</div>
)

class GameVote extends Component {
  constructor (props) {
    super(props)
    this.state = {}

    this.getData = this.getData.bind(this)
    this.updateScore = this.updateScore.bind(this)
    this.getOtherTenId = this.getOtherTenId.bind(this)
  }

  componentDidMount () {
    this.getData(this.props.params.category, this.props.params.id)
    this.getOtherTenId()
  }

  async updateScore ({ id, score_1, score_2, score_3, comment }) {
    await fetch(`/api/v1/game/update_score`, {
      method: 'PUT',
      credentials: 'same-origin',
      body: JSON.stringify({
        id,
        score_1,
        score_2,
        score_3,
        comment
      })
    })
  }

  componentWillReceiveProps (nextProps) {
    this.getData(nextProps.params.category, nextProps.params.id)
  }

  async getData (category, id) {
    if (category === 'user') {
      const response = await fetch(`/api/v1/game/byuser/${id}`, {
        credentials: 'same-origin'
      })
      const { posts } = await response.json()
      this.setState({
        posts
      })

      console.log('POSTS: ', posts)
    }

    if (category === 'ten') {
      const response = await fetch(`/api/v1/game/byten/${id}`, {
        credentials: 'same-origin'
      })
      const { posts } = await response.json()
      this.setState({
        posts
      })
    }
  }

  async getOtherTenId () {
    try {
      const response = await fetch(`/api/v1/game/get_next_ten`, {
      credentials: 'same-origin'
    })
    const { tenId } = await response.json()
    this.setState({
      otherTenId: tenId
    })
  } catch(error) {
      this.setState({
        noReplies: true
      })
  }
  }

  render () {
    let myTen = ''
    let myID = ''
    let isOnEdit, isOnMyTen, isOnVolunteer, isOnOtherTen


    let otherTenTab

    if(!this.state.noReplies) {


    otherTenTab = this.state.otherTenId ? <Link to={`/gamevote/ten/${this.state.otherTenId}`}>Другая десятка</Link> : <div className="PostsIndex__tab-otherten"><LoadingIndicator type='circle' /></div>


    }


    if(this.props.myHierarchy && this.props.myHierarchy.myTen) {myTen = this.props.myHierarchy.myTen}
      if(this.props.myID) {myID = this.props.myID}


    if(!this.props.params.category) {isOnEdit = true}
    if(this.props.params.category === 'ten' && this.props.params.id == myTen) {isOnMyTen = true}
    if(this.props.params.category === 'ten' && this.props.params.id != myTen) {isOnOtherTen = true}

      return (

        <div className="PostsIndex__left col-md-8 col-sm-12 small-collapse">
         {/*  <ul className="HorizontalMenu menu">
            <li className={isOnEdit && 'active'}><Link to='/gamevote'>Ответ</Link></li>
            <li className={isOnMyTen && 'active'}><Link to={'/gamevote/ten/' + myTen}>Моя десятка</Link></li>
            <li className={isOnVolunteer && 'active'}><Link to={'/gamevote/ten/' + myTen}>Волонтер</Link></li>
            <li className={isOnOtherTen && 'active'}>
             {otherTenTab}
            </li>

          </ul>*/}
          {isOnEdit && (
            <div>
              <Plan readOnly titlePlan='Ваш план на неделю был' />
              <Game.component myId={myID} />
            </div>
          )}
          {!isOnEdit && this.state.posts && this.state.posts.map(post => (
            <div>
              <Plan readOnly for={post.User.id} titlePlan='План на неделю был' />
              <GamePost
                save={({ score_1, score_2, score_3, comment }) => this.updateScore({
                  id: post.id,
                  score_1: score_1 || 0,
                  score_2: score_2 || 0,
                  score_3: score_3 || 0,
                  comment
                })}
                interestingValue={post.GameScores && post.GameScores[0] && post.GameScores[0].score_1}
                simpleValue={post.GameScores && post.GameScores[0] && post.GameScores[0].score_2}
                obviousValue={post.GameScores && post.GameScores[0] && post.GameScores[0].score_3}
                commentValue={post.GameScores && post.GameScores[0] && post.GameScores[0].comment || ''}
                key={post.id}
                user={post.User.name}
                displayRate={true}
                content={post.body}
                money={post.money}
              />
            </div>
          ))}
        </div>
      )

  }
}

const mapStateToProps = state => {
  return {
    myHierarchy: state.user.get('myHierarchy'),
    myID: state.user.get('myID')
  }
}

const UserIsAuthenticated = UserAuthWrapper({
  authSelector: state => state.user.get('current'),
  authenticatingSelector: state => state.user.get('logining'),
  wrapperDisplayName: 'UserIsAuthenticated',
  FailureComponent: () => <div>Вы не аутентифицированы. Войдите в аккаунт.</div>,
  LoadingComponent: () => <div>Загрузка...</div>
})

let fail = false

if (process.env.BROWSER) {
  const md = new MobileDetect(window.navigator.userAgent)
  fail = md.os() === 'iOS' && md.userAgent() === 'Chrome'
}

module.exports = {
  path: 'gamevote(/:category(/:id))',
  component: fail ? BrowserFail : UserIsAuthenticated(connect(mapStateToProps)(GameVote))
}
