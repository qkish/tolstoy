import React, { Component } from 'react'
import { connect } from 'react-redux'
import Products from 'app/components/elements/Products'
import Beta from 'app/components/elements/Beta'
import Userpic from 'app/components/elements/Userpic'
import HorizontalMenu from 'app/components/elements/HorizontalMenu'
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
import { Link } from 'react-router'

class Rating extends Component {
    constructor (props) {
        super(props)
        this.state = {}
        this.search = this.search.bind(this)
        this.getData = this.getData.bind(this)
    }

    getData (props) {
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
        getUsersByCategory(props.params.category).then(users => this.setState({users}))
    }

    componentDidMount () {
        this.getData(this.props)
    }

    componentWillReceiveProps (nextProps) {
        this.getData(nextProps)
    }

    search (text) {
        searchUsers(text).then(users => this.setState({isSearch: true, users}))
    }

    render () {
        let view
        const { users } = this.state
        const userList = users ? (
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                {users.map(user => (
                    <div>
                        <User account={user.name} key={user.id} />
                    </div>
                ))}
            </div>
        ) : (
            <div>Загрузка</div>
        )
        view = userList

        if (this.props.params.category === 'tens') {
            view = users ? (
                <div style={{ padding: '20px' }}>
                    {users.map(user => (
                        <User account={user.name} key={user.id} link={`/rating/ten/${user.id}`} name={`Десятка им. ${user.first_name} ${user.last_name}`} />
                    ))}
                </div>
            ) : (
                <div>Загрузка</div>
            )
        }

        if (this.props.params.category === 'hundreds') {
            view = users ? (
                <div style={{ padding: '20px' }}>
                    {users.map(user => (
                        <User account={user.name} key={user.id} link={`/rating/hundred/${user.id}`} name={`Сотня им. ${user.first_name} ${user.last_name}`} />
                    ))}
                </div>
            ) : (
                <div>Загрузка</div>
            )
        }

        if (this.props.params.category === 'polki') {
            view = users ? (
                <div style={{ padding: '20px' }}>
                    {users.map(user => (
                        <User account={user.name} key={user.id} link={`/rating/polk/${user.id}`} name={`Полк им. ${user.first_name} ${user.last_name}`} />
                    ))}
                </div>
            ) : (
                <div>Загрузка</div>
            )
        }

        if (this.props.params.category === 'couches') {
            view = users ? (
                <div style={{ padding: '20px' }}>
                    {users.map(user => (
                        <User account={user.name} key={user.id} link={`/rating/couch-group/${user.id}`} name={`Тренерская группа им. ${user.first_name} ${user.last_name}`} />
                    ))}
                </div>
            ) : (
                <div>Загрузка</div>
            )
        }

        if (this.state.isSearch) {
            view = userList
        }

        return (
            <div className='PostsIndex row'>
                <div className="PostsIndex__left col-md-8 col-sm-12 small-collapse">
                    <HorizontalMenu items={[{
                        active: this.props.params.category === 'all',
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
                    }]} />
                    <HorizontalMenu items={[{
                        active: this.props.params.category === 'my-ten',
                        link: '/rating/my-ten',
                        value: 'Моя десятка'
                    }, {
                        active: this.props.params.category === 'my-group',
                        link: '/rating/my-group',
                        value: 'Моя группа'
                    }]} />
                    <input
                        type='text'
                        placeholder='Поиск'
                        onKeyPress={e => e.key === 'Enter' ? this.search(e.target.value) : null} />
                    {view}
                </div>
                <div className="PostsIndex__topics col-md-4 shrink show-for-large hidden-sm">
                    <Beta />
                    <Products />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        users: state.rating.ratingUsers,
        currentUserName: state.user.getIn(['current', 'username']),
        gprops: state.global.get('props')
    }
}

module.exports = {
    path: 'rating(/:category(/:id))',
    component: connect(mapStateToProps)(Rating)
}
