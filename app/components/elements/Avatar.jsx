import React, {Component, PropTypes} from 'react';



export default class Avatar extends Component {
	// you can pass either user object, or username string

  constructor(props) {
        super(props);
        this.state = {};
      
    }

    static defaultProps = {
		width: 316,
		height: 316
	}

	render() {

		let url

		if (this.props.account) {

		 let account = this.props.account;
		 

		 console.log('account in Avatar: ', account)

		// try to extract image url from users metaData
		try { url = JSON.parse(account.json_metadata).user_image }
		catch (e) { url = '' }
		const proxy = $STM_Config.img_proxy_prefix
		if (proxy && url) {
			const size = props.width + 'x' + props.height
			url = proxy + size + '/' + url;
		}

	}

		let finalurl = '';
		if (url) finalurl = url; else finalurl = '/images/user.png';
		
		var divStyle = {
            backgroundImage: 'url(' + finalurl + ')'
        }

		// как это сделать средствами react?
		return 	<div className="Avatar" style={divStyle}>
					
						
						
					
				</div>;
	}
}

