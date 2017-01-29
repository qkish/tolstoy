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

        let targetPlanDiv = ''
        let targetDateDiv = ''

        target_point_a = String(target_point_a);
        target_point_a = target_point_a.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');

        target_point_b = String(target_point_b);
        target_point_b = target_point_b.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');

        if (target_plan) targetPlanDiv = <div className="UserProfile__infoboxes">{translate('leverage')}: {target_plan}</div>
        if (target_date) targetDateDiv = <div className="UserProfile__infoboxes">{translate('till')} {target_date}</div>

        return <div className="UserProfile__blockinfo UserProfile__goalblock">

            <h6>{translate('target_plan')}</h6>
            

            {targetDateDiv}
            {targetPlanDiv}
            
          
            <div className="UserProfile_progress"></div>
           
            <div className="UserProfile_points row">
                <div className="col-xs-6 UserProfile_rightCol">
                    <div className="UserProfile__point">{translate('target_point_a')}</div>
                    <div className="UserProfile__money">{target_point_a}</div>
                </div>
                <div className="col-xs-6">
                    <div className="UserProfile__point">{translate('target_point_b')}</div>
                    <div className="UserProfile__money">{target_point_b}</div>
                </div>
            </div>
        </div>
    }

}

export default ViewUserTarget;
