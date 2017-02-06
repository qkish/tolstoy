import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import _urls from 'shared/clash/images/urls'
import Apis from 'shared/api_client/ApiInstances'

const {oneOfType, string, object} = PropTypes

class UserpicProfile extends Component {
	// you can pass either user object, or username string

    state = {
        image: null,
        account: null
    }

	static defaultProps = {
		width: 84,
		height: 84
	}

    shouldComponentUpdate = shouldComponentUpdate(this, 'Userpic')

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

        // get account from state if proper user object was not provided
        if (typeof account != 'object') {
            this.getAccount()
            return <div className="Userpic">
                        <LoadingIndicator type="circle" inline />
    				</div>;
        }

		let url

        let username = account;

		// try to extract image url from users metaData
		try { url = JSON.parse(account.json_metadata).user_image || '/images/user.png' }
		catch (e) {
            // console.warn(e)
            url = '/images/user.png'
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
        let resultUrl = _urls.proxyImage(url || '');


		const proxy = $STM_Config.img_proxy_prefix
		if (proxy && url) {
			const size = props.width + 'x' + props.height
			url = proxy + size + '/' + url;
		}

        let backgroundUrl
        if (resultUrl) backgroundUrl = {backgroundImage: "url('" + resultUrl + "')"};
       

		return <div> 	{process.env.BROWSER ?
            <div className="UserpicAvatar" style={backgroundUrl}>
                    
                        <div className="UserpicProfile__name">{fullName}</div>
				</div> :
                <LoadingIndicator type="circle" inline />}
                </div>;
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
)(UserpicProfile)
