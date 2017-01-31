import React from 'react'
import {getUsers} from 'app/utils/ServerApiClient'

class Top extends React.Component {
    componentDidMount () {
        getUsers().then(users => this.setState({users}))
    }

    render () {
        return this.state.users && (
                <div>
                    <table>
                        <tr>
                            <td>
                                <div>Полк Осипова</div>
                                <div>total</div>
                            </td>
                            <td>
                                <div>Полк Дашкиева</div>
                                <div>total</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>{this.users.osipov.map(user => {
                                    <div>
                                        <div>{user.name}</div>
                                        <div>{user.total}</div>
                                    </div>
                                })}</div>
                                <div>Имя total</div>
                                <div>Имя total</div>
                            </td>
                            <td>
                                <div>Имя total</div>
                                <div>Имя total</div>
                                <div>Имя total</div>
                            </td>
                        </tr>
                    </table>
                </div>
        )
    }
}

module.exports = {
    path: 'top',
    component: Top
}
