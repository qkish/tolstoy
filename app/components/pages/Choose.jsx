import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	getUsersByCategory,
	searchUsers,
	setHundredLeader,
	setTenLeader,
	getUsersCount,
	chooseSearch
} from 'app/utils/ServerApiClient'
import Pagination from 'react-paginate'
import UserEdit from 'app/components/elements/UserEdit'
import { UserAuthWrapper } from 'redux-auth-wrapper'

class Choose extends Component {
	constructor (props) {
		super(props)
		this.state = {
			perPage: 50,
			currentPage: 1
		}

		this.handleTenLeaderChange = this.handleTenLeaderChange.bind(this)
		this.handleHundredLeaderChange = this.handleHundredLeaderChange.bind(this)
		this.getOrderBy = this.getOrderBy.bind(this)
		this.getOffset = this.getOffset.bind(this)
	}

	componentDidMount () {
		getUsersByCategory(this.getOrderBy(), this.getOffset(), this.state.perPage, this.getOrderBy())
			.then(users => this.setState({ users }))
		getUsersCount(this.getOrderBy()).then(count => this.setState({count}))
	}

	getOffset () {
		return this.state.perPage * (this.state.currentPage - 1)
	}

	getOrderBy () {
		if (this.props.params.group === 'hundreds') {
			return 'hundred_leader'
		}
		if (this.props.params.group === 'tens') {
			return 'ten_leader'
		}
		return null
	}

	handleTenLeaderChange ({ user, value }) {
		setTenLeader(user.id, value)
	}

	handleHundredLeaderChange ({ user, value }) {
		setHundredLeader(user.id, value)
	}

	search (text) {
		let cond
		if (this.props.params.group === 'hundreds') {
			cond = 'hundred'
		}
		if (this.props.params.group === 'tens') {
			cond = 'ten'
		}
		chooseSearch(text, cond).then(users => this.setState({users, isSearch: true}))
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
						<div className="Admin__pagination">
							{this.state.count && !this.state.isSearch ? (
								<Pagination
									pageCount={Math.ceil(this.state.count / this.state.perPage)}
									pageRangeDisplayed={3}
									marginPagesDisplayed={3}
									previousLabel='&laquo;'
									nextLabel='&raquo;'
									containerClassName='pagination'
									activeClassName='active'
									onPageChange={({ selected }) => {
										const currentPage = selected + 1
										const offset = this.state.perPage * selected
										this.setState({ currentPage })
										getUsersByCategory(this.getOrderBy(), offset, this.state.perPage, this.getOrderBy())
											.then(users => this.setState({users}))
									}} />
							) : null}
						</div>
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
						<div className="Admin__pagination">
							{this.state.count && !this.state.isSearch ? (
								<Pagination
									pageCount={Math.ceil(this.state.count / this.state.perPage)}
									pageRangeDisplayed={3}
									marginPagesDisplayed={3}
									previousLabel='&laquo;'
									nextLabel='&raquo;'
									containerClassName='pagination'
									activeClassName='active'
									onPageChange={({ selected }) => {
										const currentPage = selected + 1
										const offset = this.state.perPage * selected
										this.setState({ currentPage })
										getUsersByCategory(this.getOrderBy(), offset, this.state.perPage, this.getOrderBy())
											.then(users => this.setState({users}))
									}} />
							) : null}
						</div>
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

const UserIsAuthenticated = UserAuthWrapper({
	authSelector: (state, ownProps) => {
		if (ownProps.params.group === 'hundreds') {
			return state.user.get('isPolkLeader') ? { allowed: true } : { allowed: false }
		}
		if (ownProps.params.group === 'tens') {
			return state.user.get('isHundredLeader') ? { allowed: true } : { allowed: false }
		}
		return { allowed: false }
	},
	authenticatingSelector: state => !state.user.get('current'),
	wrapperDisplayName: 'UserIsAuthenticated',
	FailureComponent: () => <div>Доступ запрещен</div>,
	LoadingComponent: () => <div>Загрузка...</div>,
	predicate: user => user.allowed
})

module.exports = {
	path: 'choose/:group',
	component: UserIsAuthenticated(Choose)
}
