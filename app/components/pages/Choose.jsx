import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUsersByCategory, searchUsers } from 'app/utils/ServerApiClient'
import UserEdit from 'app/components/elements/UserEdit'

class Choose extends Component {
	constructor (props) {
		super(props)
		this.state = {}

		this.handleTenLeaderChange = this.handleTenLeaderChange.bind(this)
		this.handleHundredLeaderChange = this.handleHundredLeaderChange.bind(this)
	}

	componentDidMount () {
		let orderBy
		if (this.props.params.group === 'hundreds') {
			orderBy = 'hundred_leader'
		}
		if (this.props.params.group === 'tens') {
			orderBy = 'ten_leader'
		}
		getUsersByCategory('all', 0, 50, orderBy).then(users => this.setState({ users }))
	}

	handleTenLeaderChange ({ user, value }) {
		this.props.changeTenLeader(user.id, value)
	}

	handleHundredLeaderChange ({ user, value }) {
		this.props.changeHundredLeader(user.id, value)
	}

	search (text) {
		searchUsers(text).then(users => this.setState({isSearch: true, users}))
	}

	render () {
		let view

		const searchView = (
			<div className="Admin__submenu">
				<input
					type='text'
					placeholder='Поиск по имени'
					onKeyPress={e => e.key === 'Enter' ? this.search(e.target.value) : null}
					className='Rating__search' />
			</div>
		)

		if (this.props.params.group === 'hundreds') {
			view = (
				<div>
					<h3>Выбери сотников</h3>
					{searchView}
					<div className="Admin__wrapper">
						{this.state.users && this.state.users.map(user => (
							<div className="Rating__row" key={user.id}>
								<UserEdit account={user.name} />
								<div className="Admin__choose">
									<label>
										<input
											type="checkbox"
											defaultChecked={user.hundred_leader}
											onChange={({ target }) => this.handleHundredLeaderChange({ user, value: target.checked })} />
										Сотник
									</label>
								</div>
							</div>
						))}
					</div>
				</div>
			)
		}
		if (this.props.params.group === 'tens') {
			view = (
				<div>
					<h3>Выбери десятников</h3>
					{searchView}
					<div className="Admin__wrapper">
						{this.state.users && this.state.users.map(user => (
							<div className="Rating__row" key={user.id}>
								<UserEdit account={user.name} />
								<div className="Admin__choose">
									<label>
										<input
											type="checkbox"
											defaultChecked={user.ten_leader}
											onChange={({ target }) => this.handleTenLeaderChange({ user, value: target.checked })} />
										Десятник
									</label>
								</div>
							</div>
						))}
					</div>
				</div>
			)
		}

		return (
			<div className='PostsIndex row'>
				<div className="PostsIndex__left col-md-12 col-sm-12 small-collapse Admin__menu">
					{view}
				</div>
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => ({
	changeHundredLeader: (userId, value) => dispatch({
		type: 'admin/HUNDRED_LEADER_CHANGE',
		payload: {
			userId,
			value
		}
	}),
	changeTenLeader: (userId, value) => dispatch({
		type: 'admin/TEN_LEADER_CHANGE',
		payload: {
			userId,
			value
		}
	})
})

module.exports = {
	path: 'choose/:group',
	component: connect(null, mapDispatchToProps)(Choose)
}
