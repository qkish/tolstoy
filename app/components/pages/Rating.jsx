import React, { Component } from 'react'
import { connect } from 'react-redux'
import Products from 'app/components/elements/Products'
import Beta from 'app/components/elements/Beta'
import Userpic from 'app/components/elements/Userpic'
import Apis from 'shared/api_client/ApiInstances'
import HorizontalMenu from 'app/components/elements/HorizontalMenu'
import {
    getUsersByCategory,
    searchUsers,
    getUsersByTen,
    getUsersByHundred,
    getUsersByPolk,
    getMyTen
} from 'app/utils/ServerApiClient'
import User from 'app/components/elements/User'
import { Link } from 'react-router'

class Rating extends Component {
    constructor (props) {
        super(props)
        this.state = {}
        this.search = this.search.bind(this)
    }

    componentDidMount () {
        if (this.props.params.category === 'ten') {
            getUsersByTen(this.props.params.id).then(users => this.setState({users}))
            return
        }
        if (this.props.params.category === 'hundred') {
            getUsersByHundred(this.props.params.id).then(users => this.setState({users}))
            return
        }
        if (this.props.params.category === 'polk') {
            getUsersByPolk(this.props.params.id).then(users => this.setState({users}))
            return
        }
        if (this.props.params.category === 'my-ten') {
            getMyTen(this.state.currentUserName).then(users => this.setState({users}))
            return
        }
        getUsersByCategory(this.props.params.category).then(users => this.setState({users}))
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.params.category === 'ten') {
            getUsersByTen(nextProps.params.id).then(users => this.setState({users}))
            return
        }
        if (nextProps.params.category === 'hundred') {
            getUsersByHundred(nextProps.params.id).then(users => this.setState({users}))
            return
        }
        if (nextProps.params.category === 'polk') {
            getUsersByPolk(nextProps.params.id).then(users => this.setState({users}))
            return
        }
        if (nextProps.params.category === 'my-ten') {
            getMyTen(this.state.currentUserName).then(users => this.setState({users}))
            return
        }
        getUsersByCategory(nextProps.params.category).then(users => this.setState({users}))
    }

    search (text) {
        searchUsers(text).then(users => this.setState({isSearch: true, users}))
    }

    render () {
        let view
        const { users } = this.state
        const userList = users ? (
            <div style={{ padding: '20px' }}>
                {users.map(user => (
                    <User account={user.name} key={user.id} />
                ))}
            </div>
        ) : (
            <div>Загрузка</div>
        )
        view = userList

        if (this.props.params.category === 'desyatki') {
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

        if (this.props.params.category === 'sotni') {
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
                        active: this.props.params.category === 'sotni',
                        link: '/rating/sotni',
                        value: 'Сотни'
                    }, {
                        active: this.props.params.category === 'desyatki',
                        link: '/rating/desyatki',
                        value: 'Десятки'
                    }]} />
                    <HorizontalMenu items={[{
                        active: false,
                        link: '/rating/my-ten',
                        value: 'Моя десятка'
                    }, {
                        active: false,
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
        currentUserName: state.user.getIn(['current', 'username'])
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchUsers: () => dispatch({
            type: 'USERS_FETCH_REQUESTED',
            category: ownProps.params.category || 'all'
        })
    }
}

module.exports = {
    path: 'rating(/:category(/:id))',
    component: connect(mapStateToProps, mapDispatchToProps)(Rating)
};
