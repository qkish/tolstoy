import React, {Component, PropsTypes} from 'react';
import { translate } from 'app/Translator';

// -------------------------
// Компонент отображает
// дополнительную информацию
// о пользователе

class ViewUserMore extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static defaultProps = {currentTab: 'looking'}

    setCurrentTab = event =>  {
        const id = event.target.id
        this.setState({currentTab : id})
    }

    render() {
        let account = this.props.account;
        let globalProps = this.props.global.getIn(['props']).toJS();
        let metaData = JSON.parse(account.json_metadata);
        let {looking_for, i_can} = metaData;

        let curentTab = this.props.curentTab;
        let currentTabContent;

        if (curentTab == 'looking')
            currentTabContent = <div className="UserProfile__infoboxes">{looking_for}</div>
        else currentTabContent = <div className="UserProfile__infoboxes">{i_can}</div>;

        return <div className="UserProfile__blockinfo">
            <h6>
                <a id="looking" onClick={this.setCurrentTab}>{translate('looking_for')}</a> /
                <a id="can" onClick={this.setCurrentTab}>{translate('i_can')}</a>
            </h6>
            {currentTabContent}
        </div>
    }

}

export default ViewUserMore;
