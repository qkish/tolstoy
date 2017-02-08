import React from 'react';
import { Link } from 'react-router';
import Follow from 'app/components/elements/Follow';
import User from 'app/components/elements/User';
import Author from 'app/components/elements/Author';
import UserNiche from 'app/components/elements/UserNiche';

class UserListRow extends React.Component {
    render() {
        const {user, loggedIn} = this.props
        return(
            <tr> 
            <td>
            
            <User account={user} width="36" height="36" />
            
           

           
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