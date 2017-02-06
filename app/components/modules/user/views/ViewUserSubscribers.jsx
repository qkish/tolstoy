import React, {Component, PropsTypes} from 'react';
import { translate } from 'app/Translator';
import UserListAvatars from 'app/components/elements/UserListAvatars';

// -------------------------
// Компонент отображает
// дополнительную информацию
// о пользователе

class ViewUserSubscribers extends Component {

    constructor(props) {
        super(props);
        this.state = {currentTab: 'followers'};
    }

    


    render() {
        let account = this.props.account;
        let globalProps = this.props.global.getIn(['props']).toJS();
        let metaData = JSON.parse(account.json_metadata);
        let {looking_for, i_can} = metaData;

        let followers = this.props.followers;
        let following = this.props.following;

       

        let currentTab = this.state.currentTab;
        let currentTabContent;

        if (currentTab == 'followers' && followers && followers.has('result')) currentTabContent = <div className="UserProfile__moreinfo"><UserListAvatars
                          title={translate('followers')}
                          account={account}
                          users={followers} /></div>;
        

        return <div className="UserProfile__blockinfo UserProfile__subscribers">
            <span id="followers"  className="UserProfile__subtitle">
                
                   <a className="UserProfile__followerslink" href={'/@' + account.name + '/followers/'}>{translate('followers')}</a>
            </span>
           
            <span id="follow" onClick={this.setCurrentTab} className="UserProfile__subtitle">
                
                    <a className="UserProfile__followedlink" href={'/@' + account.name + '/followed/'}>{translate('follow')}</a>
            </span>
            {currentTabContent}
        </div>
    }

}

export default ViewUserSubscribers;
