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
    getMyGroup
} from 'app/utils/ServerApiClient'
import UserEdit from 'app/components/elements/UserEdit'
import { Link } from 'react-router'


function moneyPrettify(text) {
      let moneyInRating
        if (text) {

        moneyInRating = String(text);
        moneyInRating = moneyInRating.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');


        } else moneyInRating='0'

        return moneyInRating
}

class Admin extends Component {
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
        let isAll = false
        if(this.props.params.category == 'all' ||
            this.props.params.category == 'my-ten' ||
            this.props.params.category == 'my-group'

            ) {isAll = true}


        let view
        const { users } = this.state

        
      


        const userList = users ? (
            <div className="Admin__wrapper">
                {users.map(user => (
                    <div className="Rating__row">
                        <UserEdit account={user.name} key={user.id} />
                        <div className="Admin__choose">
                         <select>
                            <option value="1">Осипов</option>
                            <option value="2">Дашкиев</option>
                            <option value="3">Воронин</option>
                            <option value="4">Нестеренко</option>
                         </select>

                          <label><input type="checkbox" />
                                Полководец
                            </label>
                        </div>

                        <div className="Admin__choose">
                         <select>
                            <option value="1">Осипов</option>
                            <option value="2">Дашкиев</option>
                            <option value="3">Воронин</option>
                            <option value="4">Нестеренко</option>
                            </select>

                             <label><input type="checkbox" />
                                Сотник
                            </label>
                        </div>

                        <div className="Admin__choose">
                         <select>
                            <option value="1">Десятка им. Петрова</option>
                            <option value="2">Десятка им. Иванова</option>
                            <option value="3">Десятка им. Васнецова</option>
                            <option value="4">Десятка им. Полтавина</option>
                            </select>
                             <label><input type="checkbox" />
                                Десятник
                            </label>
                        </div>

                        <div className="Admin__choose">
                         <select>
                            <option value="1">Нет тренерства</option>
                            <option value="2">Нестеренко</option>
                            <option value="3">Косенко</option>
                            <option value="4">Костромина</option>
                            </select>

                            <label><input type="checkbox" />
                                Тренер
                            </label>
                        </div>


                    
                    </div>
                ))}
            </div>
        ) : (
            <div>Загрузка</div>
        )
        view = userList

        if (this.props.params.category === 'tens') {
            view = users ? (
                <div className="Admin__wrapper">
                    {users.map(user => (
                        <div className="Rating__row">
                        <UserEdit account={user.name} key={user.id} link={`/rating/ten/${user.id}`} name={`Десятка им. ${user.first_name} ${user.last_name}`} />
                        </div>
                    ))}
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
                        <UserEdit account={user.name} key={user.id} link={`/rating/hundred/${user.id}`} name={`Сотня им. ${user.first_name} ${user.last_name}`} />
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
                    {users.map(user => (
                        <UserEdit account={user.name} key={user.id} link={`/rating/polk/${user.id}`} name={`Полк им. ${user.first_name} ${user.last_name}`} />
                    ))}
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
                        <UserEdit account={user.name} key={user.id} link={`/rating/couch-group/${user.id}`} name={`Тренерская группа им. ${user.first_name} ${user.last_name}`} />
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
                   <HorizontalSubmenu items={[{
                        active: this.props.params.category === 'all',
                        link: '/admin/all',
                        value: 'Лучшие'
                    },
                    {
                        active: this.props.params.category === 'my-ten',
                        link: '/admin/my-ten',
                        value: 'Моя десятка'
                    }, {
                        active: this.props.params.category === 'my-group',
                        link: '/admin/my-group',
                        value: 'Моя группа'
                    }]} />
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

module.exports = {
    path: 'admin(/:category(/:id))',
    component: connect(mapStateToProps)(Admin)
}
