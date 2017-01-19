import React, {Component, PropsTypes} from 'react';
import {numberWithCommas, vestingSteem} from 'app/utils/StateFunctions';

// -------------------------
// Компонент отображает
// основные данные пользователя
// в виде вертикального блока

class ViewUserBase extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static defaultProps = {}

    isFullName(meta) {
        let {first_name, last_name} = meta;
        if (first_name !== '' && last_name !== '') { return true }
        else { return false }
    }

    render() {
        let account = this.props.account;
        let globalProps = this.props.global.getIn(['props']).toJS();
        let metaData = JSON.parse(account.json_metadata);
        let {first_name, last_name, age, city, occupation,
             website, instagram, facebook, vk} = metaData;

        // Подсчет голосов в Steem(golos)
        let vestingSteemFn = vestingSteem(account, globalProps);
        let vestingSteemVal = vestingSteemFn.toFixed(0);

        let yearsCorrect

        return <div className="UserProfile__nameinfo">

                <h2>{this.isFullName(metaData) ? first_name + ' ' + last_name : account.name}</h2>

            <div className="UserProfile__infoboxes">{age + ' ' + yearsCorrect + ', ' + city}</div>
            <div className="UserProfile__infoboxes">{occupation}</div>
            <div className="UserProfile__infoboxes ">Голосов: {vestingSteemVal}</div>

            <div className="UserProfile__infoboxes">Сайт: {website}</div>
            <div className="UserProfile__infoboxes">Instargram: {instagram}</div>
            <div className="UserProfile__infoboxes">Facebook: {facebook}</div>
            <div className="UserProfile__infoboxes">VK: {vk}</div>
        </div>
    }

}

export default ViewUserBase;
