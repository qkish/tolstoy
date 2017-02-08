import React, { Component } from 'react'
import { connect } from 'react-redux'
import Products from 'app/components/elements/Products'
import Beta from 'app/components/elements/Beta'
import Userpic from 'app/components/elements/Userpic'
import Apis from 'shared/api_client/ApiInstances'
import HorizontalMenu from 'app/components/elements/HorizontalMenu'
import { getUsers } from 'app/utils/ServerApiClient'
import User from 'app/components/elements/User'

class Rating extends Component {
    constructor (props) {
        super(props)
        this.state = {}
    }

    componentDidMount () {
        getUsers(this.props.params.category).then(users => this.setState({users}))
    }

    componentWillReceiveProps (nextProps) {
        getUsers(nextProps.params.category).then(users => this.setState({users}))
    }

    render () {
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
                        link: '/rating/my-desyatka',
                        value: 'Моя десятка'
                    }, {
                        active: false,
                        link: '/rating/my-group',
                        value: 'Моя группа'
                    }]} />
                    {userList}
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
        users: state.rating.ratingUsers
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
    path: 'rating(/:category)',
    component: connect(mapStateToProps, mapDispatchToProps)(Rating)
};
