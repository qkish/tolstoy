import React from 'react';
import { Link } from 'react-router';
import Follow from 'app/components/elements/Follow';
import UserpicProfile from 'app/components/elements/UserpicProfile';


class UserListAva extends React.Component {
    render() {
        const {user, loggedIn} = this.props
        return(
                    <Link to={'/@' + user}>

                <UserpicProfile account={user} width="84" height="84" />
                   
                </Link>
        );
    }
}

import {connect} from 'react-redux'
export default connect(
    (state, ownProps) => {
        const loggedIn = state.user.hasIn(['current', 'username'])
        return {
            ...ownProps,
            loggedIn
        }
    },
)(UserListAva)