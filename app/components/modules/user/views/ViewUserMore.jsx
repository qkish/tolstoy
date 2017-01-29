import React, {Component, PropsTypes} from 'react';
import { translate } from 'app/Translator';

// -------------------------
// Компонент отображает
// дополнительную информацию
// о пользователе

class ViewUserMore extends Component {

    constructor(props) {
        super(props);
        this.state = {currentTab: 'looking'};
    }

    setCurrentTab = event =>  {
        const id = event.target.id;
        if (id !== this.state.currentTab) {
            this.setState({currentTab : id});
            console.log('change more/tab to ' + id);
        }
    }

    render() {
        let account = this.props.account;
        let globalProps = this.props.global.getIn(['props']).toJS();
        let metaData = JSON.parse(account.json_metadata);
        let {looking_for, i_can} = metaData;

        let currentTab = this.state.currentTab;
        let currentTabContent;

        if (currentTab == 'looking') currentTabContent = <div className="UserProfile__moreinfo">{looking_for}</div>;
        if (currentTab == 'can') currentTabContent = <div className="UserProfile__moreinfo">{i_can}</div>;

        return <div className="UserProfile__blockinfo">
            <span id="looking" onClick={this.setCurrentTab} className="UserProfile__subtitle">
                {currentTab == 'looking' ?
                    <strong>{translate('looking_for')}</strong> : translate('looking_for')}
            </span>
           
            <span id="can" onClick={this.setCurrentTab} className="UserProfile__subtitle">
                {currentTab == 'can' ?
                    <strong>{translate('i_can')}</strong> : translate('i_can')}
            </span>
            {currentTabContent}
        </div>
    }

}

export default ViewUserMore;
