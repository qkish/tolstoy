import React from 'react';
import {numberWithCommas, vestingSteem} from 'app/utils/StateFunctions';
import g from 'app/redux/GlobalReducer';


export default class UserprofileNamfeInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
      
    }


render() {

         let account          = this.props.account;
        let gprops           = this.props.global.getIn( ['props'] ).toJS();

        let vesting_steemf = vestingSteem(account, gprops);
        let vesting_steem = vesting_steemf.toFixed(0);
        

        return (
<div className="UserProfile__nameinfo">
                        

                        <h2>{account.name}</h2>
                        <div className="UserProfile__infoboxes">29 лет, Москва</div>
                        <div className="UserProfile__infoboxes">Создание больших систем и сервисов</div>
                        <div className="UserProfile__infoboxes">Голосов: {vesting_steem}</div>
                        <div>
                           
                        </div>
                    </div>

                    )

    }
}


