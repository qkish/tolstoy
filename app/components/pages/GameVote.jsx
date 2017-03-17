import React, { Component } from 'react'
import GamePost from 'app/components/cards/GamePost'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Game from 'app/components/pages/Game'
import LoadingIndicator from 'app/components/elements/LoadingIndicator'
import { UserAuthWrapper } from 'redux-auth-wrapper'

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

  async updateScore ({ id, score_1, score_2, score_3 }) {
    await fetch(`/api/v1/game/update_score`, {
      method: 'PUT',
      credentials: 'same-origin',
      body: JSON.stringify({
        id,
        score_1,
        score_2,
        score_3
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
    const response = await fetch(`/api/v1/game/get_next_ten`, {
      credentials: 'same-origin'
    })
    const { tenId } = await response.json()
    this.setState({
      otherTenId: tenId
    })
  }

  render () {


    let myTen = ''
    let myID = ''
    let isOnEdit, isOnMyTen, isOnVolunteer, isOnOtherTen

    if(this.props.myHierarchy && this.props.myHierarchy.myTen) {myTen = this.props.myHierarchy.myTen}
      if(this.props.myID) {myID = this.props.myID}


    if(!this.props.params.category) {isOnEdit = true}
    if(this.props.params.category === 'ten' && this.props.params.id == myTen) {isOnMyTen = true}
    if(this.props.params.category === 'ten' && this.props.params.id != myTen) {isOnOtherTen = true}

      return (

        <div className="PostsIndex__left col-md-8 col-sm-12 small-collapse">
          <ul className="HorizontalMenu menu">
            <li className={isOnEdit && 'active'}><Link to='/gamevote'>Ответ</Link></li>
            <li className={isOnMyTen && 'active'}><Link to={'/gamevote/ten/' + myTen}>Моя десятка</Link></li>
            {/* <li className={isOnVolunteer && 'active'}><Link to={'/gamevote/ten/' + myTen}>Волонтер</Link></li> */}
            <li className={isOnOtherTen && 'active'}>
              {this.state.otherTenId ? <Link to={`/gamevote/ten/${this.state.otherTenId}`}>Другая десятка</Link> : <div className="PostsIndex__tab-otherten"><LoadingIndicator type='circle' /></div>}
            </li>

          </ul>
          {isOnEdit && <Game.component myId={myID} />}
          {!isOnEdit && this.state.posts && this.state.posts.map(post => (
            <GamePost
              save={({ score_1, score_2, score_3 }) => this.updateScore({
                id: post.id,
                score_1: score_1 || Math.round(post.total_score_1),
                score_2: score_2 || Math.round(post.total_score_2),
                score_3: score_3 || Math.round(post.total_score_3)
              })}
              key={post.id}
              user={post.author}
              displayRate={true}
              content={post.body}
            />
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

module.exports = {
  path: 'gamevote(/:category(/:id))',
  component: UserIsAuthenticated(connect(mapStateToProps)(GameVote))
}
