import React, { Component } from 'react'
import GamePost from 'app/components/cards/GamePost'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Game from 'app/components/pages/Game'
import LoadingIndicator from 'app/components/elements/LoadingIndicator'

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

  async updateScore ({ id, score_type, value }) {
    console.log('update score for', id, score_type, value)
    await fetch(`/api/v1/game/update_score`, {
      method: 'PUT',
      credentials: 'same-origin',
      body: JSON.stringify({
        id,
        score_type,
        value
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
    let isOnEdit, isOnMyTen, isOnVolunteer, isOnOtherTen

    console.log('HIM ', this.props.params.category)


    if(this.props.myHierarchy && this.props.myHierarchy.myTen) {myTen = this.props.myHierarchy.myTen}


    if(!this.props.params.category) {isOnEdit = true}
    if(this.props.params.category === 'ten' && this.props.params.id == myTen) {isOnMyTen = true}
    if(this.props.params.category === 'ten' && this.props.params.id != myTen) {isOnOtherTen = true}

      return (
        <div>
          <ul className="nav nav-tabs PostSummary__game-tabs">
            <li className={isOnEdit && 'active'}>
              <Link to='/gamevote'>Ответ</Link>
            </li>
            <li className={isOnMyTen && 'active'}>
              <Link to={'/gamevote/ten/' + myTen}>Моя 10</Link>
            </li>
            <li className={isOnVolunteer && 'active'}>
              <Link to={'/gamevote/ten/' + myTen}>Волонтер</Link>
            </li>
            <li className={isOnOtherTen && 'active'}>
              {this.state.otherTenId ? <Link to={`/gamevote/ten/${this.state.otherTenId}`}>Другая 10</Link> : <LoadingIndicator type='circle' />}
            </li>
          </ul>
          {isOnEdit && <Game.component />}
          {!isOnEdit && this.state.posts && this.state.posts.map(post => (
            <GamePost
              key={post.id}
              user={post.author}
              displayRate={true}
              content={post.body}
              interestingValue={Math.round(post.total_score_1)}
              interestingChange={value => this.updateScore({
                id: post.id,
                score_type: 'score_1',
                value
              })}
              simpleValue={Math.round(post.total_score_2)}
              simpleChange={value => this.updateScore({
                id: post.id,
                score_type: 'score_2',
                value
              })}
              obviousValue={Math.round(post.total_score_3)}
              obviousChange={value => this.updateScore({
                id: post.id,
                score_type: 'score_3',
                value
              })} />
          ))}
        </div>
      )

  }
}

const mapStateToProps = state => {
  return {
    myHierarchy: state.user.get('myHierarchy')
  }

}

module.exports = {
  path: 'gamevote',
  path: 'gamevote(/:category(/:id))',
  component: connect(mapStateToProps)(GameVote)
}
