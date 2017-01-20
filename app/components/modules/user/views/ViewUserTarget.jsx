import React, {Component, PropsTypes} from 'react';
import { translate } from 'app/Translator';

// -------------------------
// Компонент отображает
// цели пользователя

class ViewUserTarget extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static defaultProps = {}

    render() {
        let account = this.props.account;
        let globalProps = this.props.global.getIn(['props']).toJS();
        let metaData = JSON.parse(account.json_metadata);
        let {target_plan, target_date, target_point_a, target_point_b} = metaData;

        return <div className="UserProfile__blockinfo">

            <h6>{translate('target_plan')}</h6>

            <div className="UserProfile__infoboxes"><strong>{target_date}</strong></div>
            <div className="UserProfile__infoboxes">{target_plan}</div>
            <hr/>
            <div className="row">
                <div className="col-xs-6" style={{borderRight: "1px solid #ccc"}}>
                    <div className="UserProfile__infoboxes">{translate('target_point_a')}</div>
                    <p className="lead"><strong>{target_point_a}</strong></p>
                </div>
                <div className="col-xs-6">
                    <div className="UserProfile__infoboxes">{translate('target_point_b')}</div>
                    <p className="lead"><strong>{target_point_b}</strong></p>
                </div>
            </div>
        </div>
    }

}

export default ViewUserTarget;
