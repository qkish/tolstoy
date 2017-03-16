import React, { Component } from 'react'
import GamePost from 'app/components/cards/GamePost'
import { connect } from 'react-redux'

class GameVote extends Component {
  constructor (props) {
    super(props)
    this.state = {}

    this.getData = this.getData.bind(this)
    this.updateScore = this.updateScore.bind(this)
  }

  componentDidMount () {
    this.getData()
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

  async getData () {
    if (this.props.params.category === 'user') {
      const response = await fetch(`/api/v1/game/byuser/${this.props.params.id}`)
      const { posts } = await response.json()
      this.setState({
        posts
      })
    }

    if (this.props.params.category === 'ten') {
      const response = await fetch(`/api/v1/game/byten/${this.props.params.id}`)
      const { posts } = await response.json()
      this.setState({
        posts
      })
    }
  }

  render () {
    if (this.state.posts) {
      console.log(this.state.posts)
      return (
        <div>
          <ul className="nav nav-tabs PostSummary__game-tabs">
            <li className="active"><a href="#">Ответ</a></li>
            <li><a href="#">Моя 10</a></li>
            <li><a href="#">Волонтер</a></li>
            <li><a href="#">Другая 10</a></li>
          </ul>
          {this.state.posts.map(post => (
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
    } else {
      return (<div></div>)
    }
  }
}

const mapStateToProps = state => ({
  myTen: state.user.getIn(['myHierarchy', 'myTen'])
})

module.exports = {
  path: 'gamevote',
  path: 'gamevote(/:category(/:id))',
  component: connect()(GameVote)
}
