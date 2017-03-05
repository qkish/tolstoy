import React, {Component, PropsTypes} from 'react';
import { translate } from 'app/Translator';
import UserListAvatars from 'app/components/elements/UserListAvatars';
import { Link } from 'react-router';

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



        let followerCount = 0, followingCount = 0;

        if (followers && followers.has('result')) {
            followerCount = followers.get('result').filter(a => {
                return a.get(0) === "blog";
            }).size;
            // loadingFollowers = followers.get("loading");
        }

        if (following && following.has('result')) {
            followingCount = following.get('result').filter(a => {
                return a.get(0) === "blog";
            }).size;
            // loadingFollowing = following.get("loading");
        }


       

        let currentTab = this.state.currentTab;
        let currentTabContent;

        if (currentTab == 'followers' && followers && followers.has('result')) currentTabContent = <div className="UserProfile__moreinfo"><UserListAvatars
                          title={translate('followers')}
                          account={account}
                          users={followers} /></div>;
        

        return <div className="UserProfile__blockinfo UserProfile__subscribers">
            <span id="followers"  className="UserProfile__subtitle UserProfile__followerslink">

            <Link to={`/@${account.name}/followers/`} >
                
                   {translate('followers')}&nbsp;{followerCount}</Link>
            </span>
           
            <span id="follow" onClick={this.setCurrentTab} className="UserProfile__subtitle UserProfile__followedlink">
                <Link to={`/@${account.name}/followed/`} >
                  Подписки&nbsp;{followingCount}</Link>
            </span>
            {currentTabContent}
        </div>
    }

}

export default ViewUserSubscribers;
