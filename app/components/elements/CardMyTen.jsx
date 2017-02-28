import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import User from './User'
import {
	getMyTen,
} from 'app/utils/ServerApiClient'
import { Link } from 'react-router'

const rootClass = 'Card'

export const CardTitle = ({data={}, className}) => {
	
	if (data.link || data.title)
		return (<div className={rootClass+'__schedule-title'}><Link to={data.link}>{data.title}</Link></div>)
}

export const CardListItemDate = ({title, desc, day, month, link}) => {
	return (
		<li className={rootClass+'__item'}>
			<a className={rootClass+'__link'} target="_self"  href={link}>
				<div className={rootClass+'__date'}>
					<div className={rootClass+'__date-day'}>{day}</div>
					<div className={rootClass+'__date-month'}>{month}</div>
				</div>
				
				<div className={rootClass+'__text'}>
					<div className={rootClass+'__title'}>{title}</div>
					<div className={rootClass+'__description'}>{desc}</div>
				</div>
			</a>
		</li>
	)
}

export const CardListOfUsers = ({data, className}) => {
	return (
		<li className={rootClass+'__item'}>
			<User
				account={data.name} key={data.id}
			  money={data.money_total}
			/>
		</li>
	)
}

export const CardList = ({data, className}) => {
	className = [rootClass+'__schedule-list', 'ulReset', className].join(' ')
	return (
		<ul
			className={className}
		>
			{data.map(i => <CardListOfUsers data={i}/>)}
		</ul>
	)
}

class CardMyTen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			users: []
		}
		this.getData = this.getData.bind(this)
	}
	
	getData(props) {
		if (props.currentUserName) {
			getMyTen(props.currentUserName).then(users => this.setState({users}))
		}
	}

	componentDidMount() {
		this.getData(this.props)
	}

	componentWillReceiveProps(nextProps) {
		this.getData(nextProps)
	}
	
	render() {
	//	console.log(this.state)
		
		let data = {
			title: {
				title: 'Моя десятка',
				link: '/rating/my-ten',
			},
			list: [],
		}
		const { props, state }  = this
		
		if (props.data) data = props.data
		if (props.dataTitle) data.title = props.dataTitle
		if (props.dataList) data.list = props.dataList
		if (state.users) data.list = state.users
		
		if (state.users.length) {
			return (
				<section className={rootClass}>
					<CardTitle data={data.title}/>
					<CardList data={data.list}/>
				</section>
			)
		}
		return null
	}
}

const mapStateToProps = state => {
	return {
		currentUserName: state.user.getIn(['current', 'username']),
	}
}

export default connect(mapStateToProps)(CardMyTen)