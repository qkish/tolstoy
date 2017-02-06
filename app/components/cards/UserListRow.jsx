import React from 'react';
import { Link } from 'react-router';
import Follow from 'app/components/elements/Follow';
import Userpic from 'app/components/elements/Userpic';
import Author from 'app/components/elements/Author';
import UserNiche from 'app/components/elements/UserNiche';

class UserListRow extends React.Component {
    render() {
        const {user, loggedIn} = this.props
        return(
            <tr> 
            <td>
            <Link to={'/@' + user}>
            <Userpic account={user} width="36" height="36" />
             <Author account={user}/>
            <div className="UserProfile__followers-niche"> <UserNiche account={user}/></div>

            </Link>
                </td>

                {loggedIn && <td width="250">
                    <Follow following={user} what="blog" />
                </td>}
               
            </tr>
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
)(UserListRow)