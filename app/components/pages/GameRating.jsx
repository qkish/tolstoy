import React, {Component} from 'react'
import {connect} from 'react-redux'
import Products from 'app/components/elements/Products'
import Beta from 'app/components/elements/Beta'
import Userpic from 'app/components/elements/Userpic'
import HorizontalMenu from 'app/components/elements/HorizontalMenu'
import HorizontalSubmenu from 'app/components/elements/HorizontalSubmenu'

import {
	getUsersByCategory,
	getGameUsersByCategory,
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
		moneyInRating = parseFloat(moneyInRating).toFixed(3);


	} else moneyInRating = '0'

	return moneyInRating
}

const userGroupGetScore = user => {
	return user.Groups[0] && user.Groups[0].total_score || 0
}

class GameRating extends Component {
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

		let currentProgram = this.props.current_program ? this.props.current_program : null
		getGameUsersByCategory(props.params.category, 0, 50, 'undefined', currentProgram)
			.then(users => this.setState({users}))
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
		const {users} = this.state
//		const UserMapper = (users, path, namePrefix) => {
//			const loader = <div>Загрузка</div>
//			const list = (
//				<div className="Rating_wrapper">
//					<div className="Rating__row">
//						{users.map(user => (
//							<User
//								account={user.name}
//								key={user.id}
//								link={`${path}/${user.id}`}
//								name={`${namePrefix} им. ${user.first_name} ${user.last_name}`}
//							/>
//						))}
//					</div>
//				</div>
//			)
//			return users ? list : loader
//		}
		let currentTotalScore


		const userList = users ? (
			<div className="Rating_wrapper">
				{users.map(user => (
					<div className="Rating__row">
						<User account={user.name} key={user.id}
							link={`/gamevote/user/${user.id}`}
							/>
						<div
							className="Rating__money">{moneyPrettify(user.Games.length > 0 ? user.Games[0].total_score : 0)}</div>
					</div>
				))}
			</div>
		) : (
			<div>Загрузка</div>
		)

		view = userList


		if (this.props.params.category === 'polk') {

			view = users ? (
				<div className="Rating_wrapper">
					{users.map(user => (
						<div className="Rating__row">
							<User account={user.name} key={user.id}
							      link={`/gamerating/hundred/${user.id}`}
							      name={`Сотня ${user.first_name} ${user.last_name}`}/>
							<div className="Rating__money">{userGroupGetScore(user)}</div>

						</div>
					))}
				</div>
			) : (
				<div>Загрузка</div>
			)
		}

		if (this.props.params.category === 'hundred') {
			view = users ? (
				<div className="Rating_wrapper">
					{users.map(user => (
						<div className="Rating__row">
							<User account={user.name} key={user.id}
							      link={`/gamerating/ten/${user.id}`}
							      name={`Десятка ${user.first_name} ${user.last_name}`}/>
							<div className="Rating__money">{userGroupGetScore(user)}</div>
						</div>
					))}
				</div>
			) : (
				<div>Загрузка</div>
			)
		}


		if (this.props.params.category === 'tens') {
			view = users ? (
				<div className="Rating_wrapper">
					{users.map(user => (
						<div className="Rating__row">
							<User account={user.name} key={user.id}
							      link={`/gamerating/ten/${user.id}`}
							      name={`Десятка ${user.first_name} ${user.last_name}`}/>
							<div className="Rating__money"><Link to={`/gamevote/ten/${user.id}`}>Оценить десятку</Link></div>
							<div className="Rating__money">{userGroupGetScore(user)} &nbsp;</div>
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
								link={`/gamerating/hundred/${user.id}`}
								name={`Сотня ${user.first_name} ${user.last_name}`}
							/>
							<div className="Rating__money">{userGroupGetScore(user)}</div>
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
							      link={`/gamerating/polk/${user.id}`}
							      name={`Полк ${user.first_name} ${user.last_name}`}/>
							<div className="Rating__money">{userGroupGetScore(user)}</div>
						</div>
					))}
				</div>
			) : (
				<div>Загрузка</div>
			)
		}





		return (
			<div className='PostsIndex row'>
				<div className="PostsIndex__left col-md-8 col-sm-12 small-collapse">
					<HorizontalMenu items={[{
						active: isAll,
						link: '/gamerating/all',
						value: 'Все'
					},
					 {
						active: this.props.params.category === 'hundreds',
						link: '/gamerating/hundreds/',
						value: 'Сотни'
					}, {
						active: this.props.params.category === 'tens',
						link: '/gamerating/tens/',
						value: 'Десятки'
					}]}/>
					{isAll}
					{view}
				</div>
				<div
					className="PostsIndex__topics col-md-4 shrink show-for-large hidden-sm">
					<Beta />
					{/* <Products /> */}
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		users: state.rating.ratingUsers,
		currentUserName: state.user.getIn(['current', 'username']),
		gprops: state.global.get('props'),
		current_program: state.user.get('currentProgram')
	}
}

module.exports = {
	path: 'gamerating(/:category(/:id))',
	component: connect(mapStateToProps)(GameRating)
}
