import React, {Component} from 'react'
import {connect} from 'react-redux'
import Products from 'app/components/elements/Products'
import CardMyTen from 'app/components/elements/CardMyTen'
import Beta from 'app/components/elements/Beta'
import Userpic from 'app/components/elements/Userpic'
import HorizontalMenu from 'app/components/elements/HorizontalMenu'
import HorizontalSubmenu from 'app/components/elements/HorizontalSubmenu'

import {
	getUsersByCategory,
	searchUsers,
	getUsersByTen,
	getUsersByHundred,
	getUsersByPolk,
	getUsersByCouchGroup,
	getMyTen,
	getMyGroup
} from 'app/utils/ServerApiClient'
import User from 'app/components/elements/User'
import {Link} from 'react-router'


function moneyPrettify(text) {
	let moneyInRating
	if (text) {
		
		moneyInRating = String(text);
		moneyInRating = moneyInRating.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
		
		
	} else moneyInRating = '0'
	
	return moneyInRating
}

const userGroupGetMoney = (user) => {
	let money
	try {
		money = user.Groups[0].money
	} catch (e) {
		money = 0
	}
	return moneyPrettify(money /* + user.money_total */)
}

class Rating extends Component {
	constructor(props) {
		super(props)
		this.state = {}
		this.search = this.search.bind(this)
		this.getData = this.getData.bind(this)
	}
	
	getData(props) {
		if (props.params.category === 'ten') {
			getUsersByTen(props.params.id).then(users => this.setState({users}))
			return
		}
		if (props.params.category === 'hundred') {
			getUsersByHundred(props.params.id).then(users => this.setState({users}))
			return
		}
		if (props.params.category === 'polk') {
			getUsersByPolk(props.params.id).then(users => this.setState({users}))
			return
		}
		if (props.params.category === 'couch-group') {
			getUsersByCouchGroup(props.params.id).then(users => this.setState({users}))
			return
		}
		if (props.params.category === 'my-ten') {
			if (props.currentUserName) {
				getMyTen(props.currentUserName).then(users => this.setState({users}))
			}
			return
		}
		if (props.params.category === 'my-group') {
			if (props.currentUserName) {
				getMyGroup(props.currentUserName).then(users => this.setState({users}))
			}
			return
		}
		getUsersByCategory(props.params.category)
			.then(users => {
				this.setState({users})
			})
	}
	
	componentDidMount() {
		this.getData(this.props)
	}
	
	componentWillReceiveProps(nextProps) {
		this.getData(nextProps)
	}
	
	search(text) {
		searchUsers(text).then(users => this.setState({isSearch: true, users}))
	}
	
	render() {
		let isAll = false
		if (this.props.params.category == 'all' ||
			this.props.params.category == 'my-ten' ||
			this.props.params.category == 'my-group'
		
		) {
			isAll = true
		}
		
		
		let view
		const {users, myTenCardUsers} = this.state
		console.log(myTenCardUsers)
		
		const userList = users ? (
			<div className="Rating_wrapper">
				{users.map(user => (
					<div className="Rating__row">
						<User account={user.name} key={user.id}/>
						<div
							className="Rating__money">{moneyPrettify(user.money_total)}</div>
					</div>
				))}
			</div>
		) : (
			<div>Загрузка</div>
		)

		view = userList
		
		if (this.props.params.category === 'tens') {
			view = users ? (
				<div className="Rating_wrapper">
					{users.map(user => (
						<div className="Rating__row">
							<User account={user.name} key={user.id}
							      link={`/rating/ten/${user.id}`}
							      name={`Десятка им. ${user.first_name} ${user.last_name}`}/>
							<div className="Rating__money">{userGroupGetMoney(user)}</div>
						</div>
					))}
				</div>
			) : (
				<div>Загрузка</div>
			)
		}
		
		if (this.props.params.category === 'hundreds') {
			view = users ? (
				<div className="Rating_wrapper">
					{users.map(user => (
						<div className="Rating__row">
							<User
								account={user.name} key={user.id}
								link={`/rating/hundred/${user.id}`}
								name={`Сотня им. ${user.first_name} ${user.last_name}`}
							/>
							<div className="Rating__money">{userGroupGetMoney(user)}</div>
						</div>
					))}
				</div>
			) : (
				<div>Загрузка</div>
			)
		}
		
		if (this.props.params.category === 'polki') {
			view = users ? (
				<div className="Rating_wrapper">
					{users.map(user => (
						<div className="Rating__row">
							<User account={user.name} key={user.id}
							      link={`/rating/polk/${user.id}`}
							      name={`Полк им. ${user.first_name} ${user.last_name}`}/>
							<div className="Rating__money">{userGroupGetMoney(user)}</div>
						</div>
					))}
				</div>
			) : (
				<div>Загрузка</div>
			)
		}
		
		
		if (this.props.params.category === 'couches') {
			view = users ? (
				<div className="Rating_wrapper">
						{users.map(user => (
							<div className="Rating__row">
								<User account={user.name} key={user.id}
								      link={`/rating/couch-group/${user.id}`}
								      name={`Тренерская группа им. ${user.first_name} ${user.last_name}`}/>
								<div className="Rating__money">{userGroupGetMoney(user)}</div>
							</div>
						))}
				</div>
			) : (
				<div>Загрузка</div>
			)
		}
		//
		if (this.state.isSearch) {
			view = userList
		}
		
		let submenu = <div className="Rating__submenu">
			<HorizontalSubmenu items={[{
				active: this.props.params.category === 'all',
				link: '/rating/all',
				value: 'Лучшие'
			},
				{
					active: this.props.params.category === 'my-ten',
					link: '/rating/my-ten',
					value: 'Моя десятка'
				}, {
					active: this.props.params.category === 'my-group',
					link: '/rating/my-group',
					value: 'Моя группа'
				}]}/>
			<input
				type='text'
				placeholder='Поиск по имени'
				onKeyPress={e => e.key === 'Enter' ? this.search(e.target.value) : null}
				className='Rating__search'/>
		</div>
		
		return (
			<div className='PostsIndex row'>
				<div className="PostsIndex__left col-md-8 col-sm-12 small-collapse">
					<HorizontalMenu items={[{
						active: isAll,
						link: '/rating/all',
						value: 'Все'
					}, {
						active: this.props.params.category === 'polki',
						link: '/rating/polki',
						value: 'Полки'
					}, {
						active: this.props.params.category === 'hundreds',
						link: '/rating/hundreds',
						value: 'Сотни'
					}, {
						active: this.props.params.category === 'tens',
						link: '/rating/tens',
						value: 'Десятки'
					}, {
						active: this.props.params.category === 'couches',
						link: '/rating/couches',
						value: 'Тренера'
					}]}/>
					{isAll && submenu}
					{view}
				</div>
				<div
					className="PostsIndex__topics col-md-4 shrink show-for-large hidden-sm">
					<Beta />
					<Products />
					<CardMyTen />
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		users: state.rating.ratingsUsers,
		currentUserName: state.user.getIn(['current', 'username']),
		gprops: state.global.get('props')
	}
}

module.exports = {
	path: 'rating(/:category(/:id))',
	component: connect(mapStateToProps)(Rating)
}
