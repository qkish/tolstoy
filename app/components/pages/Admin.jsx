import React, { Component } from 'react'
import { connect } from 'react-redux'
import Products from 'app/components/elements/Products'
import Beta from 'app/components/elements/Beta'
import Userpic from 'app/components/elements/Userpic'
import HorizontalMenu from 'app/components/elements/HorizontalMenu'
import HorizontalSubmenu from 'app/components/elements/HorizontalSubmenu'
import Pagination from 'react-paginate'
import { UserAuthWrapper } from 'redux-auth-wrapper'
import { routerActions } from 'react-router-redux'
import { getUsersByCategory, searchUsers, getUsersCount } from 'app/utils/ServerApiClient'
import UserEdit from 'app/components/elements/UserEdit'
import { Link } from 'react-router'
import Select from 'react-select'
import { find } from 'lodash'
import 'react-select/dist/react-select.css'

class Admin extends Component {
    constructor (props) {
        super(props)

        this.state = {
            perPage: 50,
            currentPage: 1
        }

        this.search = this.search.bind(this)
        this.getData = this.getData.bind(this)
        this.getOffset = this.getOffset.bind(this)

        this.handleTenChange = this.handleTenChange.bind(this)
        this.handleHundredChange = this.handleHundredChange.bind(this)
        this.handlePolkChange = this.handlePolkChange.bind(this)
        this.handleCouchGroupChange = this.handleCouchGroupChange.bind(this)

        this.handleTenLeaderChange = this.handleTenLeaderChange.bind(this)
        this.handleHundredLeaderChange = this.handleHundredLeaderChange.bind(this)
        this.handlePolkLeaderChange = this.handlePolkLeaderChange.bind(this)
        this.handleCouchGroupChange = this.handleCouchGroupChange.bind(this)
        this.handleVolunteerChange = this.handleVolunteerChange.bind(this)
    }

    getOffset () {
        return this.state.perPage * (this.state.currentPage - 1)
    }

    getData (props) {

        let currentProgram = this.props.current_program ? this.props.current_program : null

        getUsersByCategory(props.params.category, this.getOffset(), this.state.perPage, 'undefined', currentProgram).then(users => this.setState({users}))
        getUsersCount(props.params.category).then(count => this.setState({count}))
        getUsersByCategory('tens', 0, 1000, 'undefined', currentProgram).then(allTens => this.setState({allTens}))
        getUsersByCategory('hundreds', 0, 1000, 'undefined', currentProgram).then(allHundreds => this.setState({allHundreds}))
        getUsersByCategory('polki',0, 100, 'undefined', currentProgram).then(allPolks => this.setState({allPolks}))
        getUsersByCategory('couches', 0, 500, 'undefined', currentProgram).then(allTrainers => this.setState({allTrainers}))
    }

    handleTenChange ({ user, ten }) {
        this.props.changeTen(user.id, Number(ten))
    }

    handleHundredChange ({ user, hundred }) {
        this.props.changeHundred(user.id, Number(hundred))
    }

    handlePolkChange ({ user, polk }) {
        this.props.changePolk(user.id, Number(polk))
    }

    handleCouchGroupChange ({ user, couchGroup }) {
        this.props.changeCouchGroup(user.id, Number(couchGroup))
    }

    handleTenLeaderChange ({ user, value, ten }) {
        this.props.changeTenLeader(user.id, value)
        if(value) this.props.changeTen(user.id, Number(ten))
    }

    handleHundredLeaderChange ({ user, value }) {
        this.props.changeHundredLeader(user.id, value)
    }

    handlePolkLeaderChange ({ user, value }) {
        this.props.changePolkLeader(user.id, value)
    }

    handleCouchChange ({ user, value }) {
        this.props.changeCouch(user.id, value)
    }

    handleVolunteerChange ({ user, value }) {
        this.props.changeVolunteer(user.id, value)
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
        const { users, allTens, allPolks, allHundreds, allTrainers, count } = this.state

        let current_program = this.props.current_program ? this.props.current_program : null

        const userList = users ? (
            <div className="Admin__wrapper">
                {users.map(user => (
                    <div className="Rating__row" key={user.id}>
                        <UserEdit account={user.name} />
                        <div className="Admin__choose">
                            <Select
                              name='select-polk'
                              value={user.polk}
                              options={allPolks && [{ value: null, label: 'Полк не выбран' }, ...allPolks.map(p => ({
                                value: p.id,
                                label: `${p.first_name} ${p.last_name}`
                              }))]}
                              placeholder='Полк не выбран'
                              noResultsText='Нет полков'
                              clearable={false}
                              onChange={({ value }) => {

                                const data = users.splice(0)
                                find(data, {id: user.id}).polk = value || null
                                this.setState({
                                  users: data
                                })
                                this.handlePolkChange({user, polk: value || undefined })
                              }} />
                             <label>
                                 <input type="checkbox" defaultChecked={user.polk_leader} onChange={({ target }) => this.handlePolkLeaderChange({ user, value: target.checked })} />
                                 Полководец
                             </label>
                        </div>

                        <div className="Admin__choose">
                          <Select
                            name='select-hundred'
                            value={user.hundred}
                            options={allHundreds && [{ value: null, label: 'Сотня не выбрана' },...allHundreds.map(h => ({
                              value: h.id,
                              label: `${h.first_name} ${h.last_name}`
                            }))]}
                            placeholder='Сотня не выбрана'
                            noResultsText='Нет сотен'
                            clearable={false}
                            onChange={({ value }) => {
                              const data = users.splice(0)
                              find(data, {id: user.id}).hundred = value || null
                              this.setState({
                                users: data
                              })
                              this.handleHundredChange({user, hundred: value || undefined })
                            }} />
                            <label>
                                <input type="checkbox" defaultChecked={user.hundred_leader} onChange={({ target }) => this.handleHundredLeaderChange({ user, value: target.checked })} />
                                Сотник
                            </label>
                        </div>

                        <div className="Admin__choose">
                          <Select
                            name='select-ten'
                            value={user.ten}
                            options={allTens && [{ value: null, label: 'Десятка не выбрана' },...allTens.map(t => ({
                              value: t.id,
                              label: `${t.first_name} ${t.last_name}`
                            }))]}
                            placeholder='Десятка не выбрана'
                            noResultsText='Нет десяток'
                            clearable={false}
                            onChange={({ value }) => {

                              const data = users.splice(0)
                              find(data, {id: user.id}).ten = value || null
                              this.setState({
                                users: data
                              })
                              this.handleTenChange({user, ten: value || undefined })
                            }} />
                            <label>
                                <input type="checkbox" defaultChecked={user.ten_leader} onChange={({ target }) => this.handleTenLeaderChange({ user, value: target.checked, ten: user.id || undefined })} />
                                Десятник
                            </label>
                        </div>

                        <div className="Admin__choose">
                          <Select
                            name='select-couch-group'
                            value={user.couch_group}
                            options={allTrainers && [{ value: null, label: 'Тренерская группа не выбрана' }, ...allTrainers.map(c => ({
                              value: c.id,
                              label: `${c.first_name} ${c.last_name}`
                            }))]}
                            placeholder='Тренерская группа не выбрана'
                            noResultsText='Нет тренерских групп'
                            clearable={false}
                            onChange={({ value }) => {
                              const data = users.splice(0)
                              find(data, {id: user.id}).couch_group = value || null
                              this.setState({
                                users: data
                              })
                              this.handleCouchGroupChange({user, couchGroup: value || undefined })
                            }} />
                            <label>
                                <input type="checkbox" defaultChecked={user.couch} onChange={({ target }) => this.handleCouchChange({ user, value: target.checked })} />
                                Тренер
                            </label>
                        </div>
                    </div>
                ))}
                <div className="Admin__pagination">
                    {this.state.count ? (
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
                                getUsersByCategory(this.props.params.category, offset, this.state.perPage, 'undefined', current_program).then(users => this.setState({users}))
                            }} />
                    ) : null}
                </div>
            </div>
        ) : (
            <div>Загрузка</div>
        )
        view = userList

        if (this.props.params.category === 'volunteer') {
            view = users ? (
                <div className="Admin__wrapper">
                    {users.map(user => (
                        <div className="Rating__row" key={user.id}>
                            <UserEdit account={user.name} />
                            <div className="Admin__choose">
                                 <label>
                                     <input type="checkbox" defaultChecked={user.volunteer} onChange={({ target }) => this.handleVolunteerChange({ user, value: target.checked })} />
                                     Волонтер
                                 </label>
                            </div>
                        </div>
                    ))}
                    <div className="Admin__pagination">
                        {this.state.count ? (
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
                                    getUsersByCategory(this.props.params.category, offset, this.state.perPage, 'undefined', current_program).then(users => this.setState({users}))
                                }} />
                        ) : null}
                    </div>
                </div>
            ) : (
                <div>Загрузка</div>
            )
        }

        const submenu = (
          <div className="Admin__submenu">
            <input
              type='text'
              placeholder='Поиск по имени'
              onKeyPress={e => e.key === 'Enter' ? this.search(e.target.value) : null}
              className='Rating__search' />
          </div>
        )

        return (
            <div className='PostsIndex row'>
                <div className="PostsIndex__left col-md-12 col-sm-12 small-collapse Admin__menu">
                    <HorizontalMenu items={[{
                        active: !this.props.params.category || this.props.params.category === 'all',
                        link: '/admin/all',
                        value: 'Все'
                    }, 
                    {
                        active: this.props.params.category === 'volunteer',
                        link: '/admin/volunteer',
                        value: 'Волонтеры'
                    },
                    {
                        active: this.props.params.category === 'content',
                        link: '/admin/content',
                        value: 'Контент'
                    }
                    ]} />
                    {submenu}
                    {view}
                </div>
            </div>
        )
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
        }),
        changeHundred: (userId, hundredId) => dispatch({
            type: 'admin/HUNDRED_CHANGE',
            payload: {
                userId,
                hundredId
            }
        }),
        changePolk: (userId, polkId) => dispatch({
            type: 'admin/POLK_CHANGE',
            payload: {
                userId,
                polkId
            }
        }),
        changeCouchGroup: (userId, couchGroupId) => dispatch({
            type: 'admin/COUCH_GROUP_CHANGE',
            payload: {
                userId,
                couchGroupId
            }
        }),
        changeTenLeader: (userId, value) => dispatch({
            type: 'admin/TEN_LEADER_CHANGE',
            payload: {
                userId,
                value
            }
        }),
        changeHundredLeader: (userId, value) => dispatch({
            type: 'admin/HUNDRED_LEADER_CHANGE',
            payload: {
                userId,
                value
            }
        }),
        changePolkLeader: (userId, value) => dispatch({
            type: 'admin/POLK_LEADER_CHANGE',
            payload: {
                userId,
                value
            }
        }),
        changeCouch: (userId, value) => dispatch({
            type: 'admin/COUCH_CHANGE',
            payload: {
                userId,
                value
            }
        }),
        changeVolunteer: (userId, value) => dispatch({
            type: 'admin/VOLUNTEER_CHANGE',
            payload: {
                userId,
                value
            }
        })
    }
}

const UserIsAuthenticated = UserAuthWrapper({
    authSelector: state => state.user,
    authenticatingSelector: state => !state.user.get('current'),
    wrapperDisplayName: 'UserIsAuthenticated',
    FailureComponent: () => <div>Доступ запрещен</div>,
    LoadingComponent: () => <div>Загрузка...</div>,
    predicate: user => user.get('isVolunteer')
})

const mapStateToProps = state => {

    return {
        current_program: state.user.get('currentProgram')
    }
}

module.exports = {
    path: 'admin(/:category(/:id))',
    component: UserIsAuthenticated(connect(mapStateToProps, mapDispatchToProps)(Admin))
}
