import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import _urls from 'shared/clash/images/urls'

const {oneOfType, string, object} = PropTypes

class Userpic extends Component {
	// you can pass either user object, or username string


	static defaultProps = {
		width: 48,
		height: 48
	}

 constructor(props) {
        super(props);

this.shouldComponentUpdate = shouldComponentUpdate(this, 'Userpic')
    }


	render() {




		const {props} = this
		const {dispatch, account, ...rest} = props



		//let accountobj = '';

		//if (typeof account == 'string') accountobj = dispatch.global.getIn(['accounts', account]).toJS(); else accountobj = account;

		let url

		// try to extract image url from users metaData
		try { url = JSON.parse(account.json_metadata).user_image }
		catch (e) { url = '' }
		const proxy = $STM_Config.img_proxy_prefix
		if (proxy && url) {
			const size = props.width + 'x' + props.height
			url = proxy + size + '/' + url;
		}
		return 	<div className="Userpic">
                    {process.env.BROWSER ?
                        <img src={_urls.proxyImage(url || '')} {...rest} /> :
                        <LoadingIndicator type="circle" inline />}
				</div>;
	}
}

export default connect(
	(state, {account, ...restOfProps}) => {

		// you can pass either user object, or username string

		if (typeof account == 'string') {
			account = state.global.getIn(['accounts', account]);
			if(account) account = account.toJS();


		}

		return { account, ...restOfProps }
	}
)(Userpic)
