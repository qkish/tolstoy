import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import _urls from 'shared/clash/images/urls'
import Apis from 'shared/api_client/ApiInstances'
import { Link } from 'react-router';

const {oneOfType, string, object} = PropTypes

class Author extends Component {
    // you can pass either user object, or username string

    state = {
        image: null,
        account: null
    }

    static defaultProps = {
        width: 48,
        height: 48
    }

    shouldComponentUpdate = shouldComponentUpdate(this, 'Author')

    getAccount = () => {
        const {account} = this.props
        if (typeof account != 'object') {
            Apis.db_api('get_accounts', [account]).then(res => {
              
                this.setState({account: res[0]})
            });
        }
    }

    onError = () => this.setState({image: '/images/user.png'})




    render() {
      

        const {props, state} = this
        let {dispatch, ...rest} = props
        const account = state.account || props.account

        let username = account;



        // get account from state if proper user object was not provided
        if (typeof account != 'object') {
            this.getAccount()
            return <div className="Userpic">
                        <LoadingIndicator type="circle" inline />
                    </div>;
        }

        let fullName = username.name

        // try to extract image url from users metaData
        try { let parseRes = JSON.parse(account.json_metadata)
            if (parseRes.first_name) fullName =  parseRes.first_name || username.name
            if (parseRes.last_name) fullName = fullName + ' ' + parseRes.last_name
        }
        catch (e) {
            // console.warn(e)
            fullName = username.name
        }
      
        return  <span className="Author">
                <span itemProp="author" itemScope itemType="http://schema.org/Person" className="Author__name">
                    <Link to={'/@' + username.name}>{fullName}</Link>
                </span>
            </span>;
    }
}

export default connect(
    (state, {account, ...restOfProps}) => {

        // you can pass either user object, or username string
        if (typeof account == 'string') {
            const accountFromState = state.global.getIn(['accounts', account]);
            if(accountFromState) account = accountFromState.toJS();
        }

        return { account, ...restOfProps }
    }
)(Author)
