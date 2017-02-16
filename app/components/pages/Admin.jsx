import React, { Component } from 'react'
import { connect } from 'react-redux'
import Products from 'app/components/elements/Products'
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
    getMyGroup,
    getUsersCount
} from 'app/utils/ServerApiClient'
import UserEdit from 'app/components/elements/UserEdit'
import { Link } from 'react-router'

function moneyPrettify(text) {
    let moneyInRating
    if (text) {
        moneyInRating = String(text)
        moneyInRating = moneyInRating.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ')
    } else {
        moneyInRating = '0'
    }
    return moneyInRating
}

class Admin extends Component {
    constructor (props) {
        super(props)
        this.state = {currPage: 0, count: 50}
        this.search = this.search.bind(this)
        this.getData = this.getData.bind(this)

        this.handleTenChange = this.handleTenChange.bind(this)
        this.handleHundredChange = this.handleHundredChange.bind(this)
        this.handlePolkChange = this.handlePolkChange.bind(this)
        this.handleCouchGroupChange = this.handleCouchGroupChange.bind(this)

        this.handleTenLeaderChange = this.handleTenLeaderChange.bind(this)
        this.handleHundredLeaderChange = this.handleHundredLeaderChange.bind(this)
        this.handlePolkLeaderChange = this.handlePolkLeaderChange.bind(this)
        this.handleCouchGroupChange = this.handleCouchGroupChange.bind(this)
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

        getUsersByCategory(props.params.category, this.state.currPage).then(users => this.setState({users}))
        getUsersCount(props.params.category).then(count => this.setState({count}))
        getUsersByCategory('tens').then(allTens => this.setState({allTens}))
        getUsersByCategory('hundreds').then(allHundreds => this.setState({allHundreds}))
        getUsersByCategory('polki').then(allPolks => this.setState({allPolks}))
        getUsersByCategory('couches').then(allTrainers => this.setState({allTrainers}))
    }

    handleChangePage = event => {
        event.preventDefault();
        console.log('CHANGEd')
        this.setState({currPage: 50})
        this.getData(this.props)
    }

    handleTenChange ({ user, ten }) {
        console.log('handle ten change', user, ten)
        this.props.changeTen(user.id, ten)
    }

    handleHundredChange ({ user, hundred }) {
        console.log('handle hundred change', user, hundred)
    }

    handlePolkChange ({ user, polk }) {
        console.log('handle polk change', user, polk)
    }

    handleCouchGroupChange ({ user, couchGroup }) {
        console.log('handle couch group change', user, couchGroup)
    }

    handleTenLeaderChange ({ user, value }) {
        console.log('handle ten leader change', user, value)
    }

    handleHundredLeaderChange ({ user, value }) {
        console.log('handle hundred leader change', user, value)
    }

    handlePolkLeaderChange ({ user, value }) {
        console.log('handle polk leader change', user, value)
    }

    handleCouchChange ({ user, value }) {
        console.log('handle couch change', user, value)
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

    pager (count) {
        let result = ''
        if (count > 3)  {
            let countI = count
            let currentCount = 0
            let i = 1
            while (countI > 1) {
                currentCount = count - countI
                countI = countI - 3;
                i++
                result = result + '<a className="btn btn-primary" href="#" role="button" ref="pagenum' + currentCount + '" >' + i + '</a> '//+ <a className="btn btn-primary" href="#" ref="pagenum" + currentCount >i</a>
            }
        }
        return result
    }

    render () {
        console.log('CurrPage: ', this.state.currPage)
        console.log('COUNT: ', this.state.count)

        const isAll = this.props.params.category === 'all'

        let view
        const { users, allTens, allPolks, allHundreds, allTrainers, count } = this.state

        let offset = 0

        const userList = users ? (
            <div className="Admin__wrapper">
                {users.map(user => (
                    <div className="Rating__row">
                        <UserEdit account={user.name} key={user.id} />
                        <div className="Admin__choose">
                            <select defaultValue={user.polk} onChange={({ target }) => this.handlePolkChange({user, polk: target.value })}>
                                {allPolks ? allPolks.map(userOption => (
                                    <option value={userOption.id}>
                                        {`${userOption.first_name} ${userOption.last_name}, ${userOption.name}`}
                                    </option>
                                )) : ''}
                             </select>
                             <label>
                                 <input type="checkbox" defaultChecked={user.polk_leader} onChange={({ target }) => this.handlePolkLeaderChange({ user, value: target.checked })} />
                                 Полководец
                             </label>
                        </div>

                        <div className="Admin__choose">
                            <select defaultValue={user.hundred} onChange={({ target }) => this.handleHundredChange({ user, hundred: target.value })}>
                                {allHundreds ? allHundreds.map(userOption => (
                                    <option value={userOption.id}>
                                        {`${userOption.first_name} ${userOption.last_name}, ${userOption.name}`}
                                    </option>
                                )) : ''}
                            </select>
                            <label>
                                <input type="checkbox" defaultChecked={user.hundred_leader} onChange={({ target }) => this.handleHundredLeaderChange({ user, value: target.checked })} />
                                Сотник
                            </label>
                        </div>

                        <div className="Admin__choose">
                            <select defaultValue={user.ten} onChange={({ target }) => this.handleTenChange({ user, ten: target.value })}>
                                {allTens ? allTens.map(userOption => (
                                    <option value={userOption.id}>
                                        {`${userOption.first_name} ${userOption.last_name}, ${userOption.name}`}
                                    </option>
                                )) : ''}
                            </select>
                            <label>
                                <input type="checkbox" defaultChecked={user.ten_leader} onChange={({ target }) => this.handleTenLeaderChange({ user, value: target.checked })} />
                                Десятник
                            </label>
                        </div>

                        <div className="Admin__choose">
                            <select defaultValue={user.couch_group} onChange={({ target }) => this.handleCouchGroupChange({ user, couch_group: target.value })}>
                                {allTrainers? allTrainers.map(userOption => (
                                    <option value={userOption.id}>
                                        {`${userOption.first_name} ${userOption.last_name}, ${userOption.name}`}
                                    </option>
                                )) : ''}
                            </select>
                            <label>
                                <input type="checkbox" defaultChecked={user.couch} onChange={({ target }) => this.handleCouchChange({ user, value: target.checked })} />
                            </label>
                        </div>
                    </div>
                ))}

                <div className="Admin__pagination">

                {this.pager(count)}
                    <a className="btn btn-default" href="#" role="button">2</a>
                    <a className="btn btn-default" href="#" role="button">3</a>

                </div>
            </div>
        ) : (
            <div>Загрузка</div>
        )
        view = userList

        if (this.props.params.category === 'tens') {
            view = users ? (
                <div className="Admin__wrapper">

                    <div className="Rating__row">
                    {users.map(user => (

                        <UserEdit account={user.name} key={user.id} link={`/admin/ten/${user.id}`} name={`Десятка им. ${user.first_name} ${user.last_name}`} />

                    ))}
                </div>
                </div>
            ) : (
                <div>Загрузка</div>
            )
        }

        if (this.props.params.category === 'hundreds') {
            view = users ? (
                <div className="Admin__wrapper">

                <div className="Rating__row">
                    {users.map(user => (
                        <UserEdit account={user.name} key={user.id} link={`/admin/hundred/${user.id}`} name={`Сотня им. ${user.first_name} ${user.last_name}`} />
                    ))}
                    </div>
                </div>
            ) : (
                <div>Загрузка</div>
            )
        }

        if (this.props.params.category === 'polki') {
            view = users ? (
                <div className="Admin__wrapper">

                  <div className="Rating__row">
                    {users.map(user => (
                        <UserEdit account={user.name} key={user.id} link={`/admin/polk/${user.id}`} name={`Полк им. ${user.first_name} ${user.last_name}`} />
                    ))}
                </div>
                </div>
            ) : (
                <div>Загрузка</div>
            )
        }

        if (this.props.params.category === 'couches') {
            view = users ? (
                <div className="Admin__wrapper">

                <div className="Rating__row">
                    {users.map(user => (
                        <UserEdit account={user.name} key={user.id} link={`/admin/couch-group/${user.id}`} name={`Тренерская группа им. ${user.first_name} ${user.last_name}`} />
                    ))}
                    </div>
                </div>
            ) : (
                <div>Загрузка</div>
            )
        }

        if (this.state.isSearch) {
            view = userList
        }

        let submenu = <div className="Admin__submenu">

                  <input
                        type='text'
                        placeholder='Поиск по имени'
                        onKeyPress={e => e.key === 'Enter' ? this.search(e.target.value) : null}
                        className='Rating__search' />
                    </div>

        return (
            <div className='PostsIndex row'>
                <div className="PostsIndex__left col-md-12 col-sm-12 small-collapse Admin__menu">
                    <HorizontalMenu items={[{
                        active: isAll,
                        link: '/admin/all',
                        value: 'Все'
                    }, {
                        active: this.props.params.category === 'polki',
                        link: '/admin/polki',
                        value: 'Полки'
                    }, {
                        active: this.props.params.category === 'hundreds',
                        link: '/admin/hundreds',
                        value: 'Сотни'
                    }, {
                        active: this.props.params.category === 'tens',
                        link: '/admin/tens',
                        value: 'Десятки'
                    }, {
                        active: this.props.params.category === 'couches',
                        link: '/admin/couches',
                        value: 'Тренера'
                    }, {
                        active: this.props.params.category === 'volunteer',
                        link: '/admin/volunteer',
                        value: 'Волонтеры'
                    }]} />
                {isAll && submenu}
                    {view}
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

const mapDispatchToProps = dispatch => {
    return {
        changeTen: (userId, tenId) => dispatch({
            type: 'admin/TEN_CHANGE',
            payload: {
                userId,
                tenId
            }
        })
    }
}

module.exports = {
    path: 'admin(/:category(/:id))',
    component: connect(mapStateToProps, mapDispatchToProps)(Admin)
}
