/* eslint react/prop-types: 0 */
import React from 'react';
import UserListAva from 'app/components/cards/UserListAva';
import { translate } from 'app/Translator';

const PER_PAGE = 6;

class UserListAvatars extends React.Component {

    constructor() {
        super()
        this.state = {historyIndex: 0}
    }

    _setHistoryPagePrevious = () => {
        const newIndex = this.state.historyIndex - PER_PAGE;
        this.setState({historyIndex: Math.max(0, newIndex)});
    }

    _setHistoryPageNext = () => {
        const newIndex = this.state.historyIndex + PER_PAGE;
        this.setState({historyIndex: Math.max(0, newIndex)});
    }

    render() {
        const {state: {historyIndex}} = this
        const account = this.props.account
        const users = this.props.users.get('result')
        const title = this.props.title

        let user_list = users.map((item, index) => {
            if(item.get(0) === "blog") {
                return <UserListAva account={account} user={index} key={index} />
            }
            return null;
        }).filter(el => !!el).toArray();

        let currentIndex = -1;
        const usersLength = users.size;
        const limitedIndex = Math.min(historyIndex, usersLength - PER_PAGE);
        user_list = user_list.reverse().filter(() => {
            currentIndex++;
            return currentIndex >= limitedIndex && currentIndex < limitedIndex + PER_PAGE;
        });

     

        return (<div className="UserList">
            <div className="row">
                <div className="column small-12">
                 
                
                
                            {user_list}
                   
                  
                </div>
            </div>
        </div>);
    }
}

export default UserListAvatars
