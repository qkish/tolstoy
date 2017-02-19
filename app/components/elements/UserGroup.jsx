import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import _urls from 'shared/clash/images/urls'
import Apis from 'shared/api_client/ApiInstances'
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import { Link } from 'react-router';

const {oneOfType, string, object} = PropTypes

class UserGroup extends Component {
	// you can pass either user object, or username string

    state = {
       
        account: '',

    }

	static defaultProps = {
		width: 100,
		height: 100
	}

    shouldComponentUpdate = shouldComponentUpdate(this, 'UserGroup')

    getAccount = () => {
        const {id} = this.props
       

        fetch('/api/v1/get_group_by_id', {
            method: 'post',
            mode: 'no-cors',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                csrf: $STM_csrf,
                id
                //json_meta: JSON.stringify({"ico_address": icoAddress})
            })
        }).then(r => r.json()).then(res => {
            if (res.error || res.status !== 'ok') {
                console.error('SignUp server error', res.error);
                
                this.setState({server_error: res.error || translate('unknown'), loading: false});
            } else {

                if (typeof res.name.name != 'object') {
                     Apis.db_api('get_accounts', [res.name.name]).then(res => {

                         this.setState({account: res[0]})
                    });
                    }   
               // this.setState({accountname: res.name});


               
                
                // this.props.loginUser(name, password);
                // const redirect_page = localStorage.getItem('redirect');
                // if (redirect_page) {
                //     localStorage.removeItem('redirect');
                //     browserHistory.push(redirect_page);
                // }
                // else {
                //     browserHistory.push('/@' + name);
                // }
            }
        }).catch(error => {
            console.error('Caught CreateAccount server error', error);
            this.setState({server_error: (error.message ? error.message : error), loading: false});
        });
    }

    componentWillMount() {
         this.getAccount()
    }

     




    onError = () => this.setState({image: '/images/user.png'})

	render() {


		const {id, link, title} = this.props
		
        const account = this.state.account || ''

     // get account from state if proper user object was not provided
        if (typeof account != 'object') {
           
            return <div className="User">
                        <LoadingIndicator type="circle" inline />
                    </div>;
        }

        let username = account

        let url
        let userOccupation ='Не указана ниша'
        let fullName

        if (username && username.name) fullName = username.name

          

        let postDateTime


       // if (this.props.postdate) postDateTime = <TimeAgoWrapper date={this.props.postdate} className="updated" />

        // try to extract image url from users metaData

         // try to extract image url from users metaData
        try { let parseRes = JSON.parse(account.json_metadata)
            if (parseRes.first_name) fullName =  parseRes.first_name
            if (parseRes.last_name) fullName = fullName + ' ' + parseRes.last_name

            url = parseRes.user_image || '/images/user.png'

           // if (parseRes.occupation) userOccupation =  parseRes.occupation || 'Не указана ниша'

        }
        catch (e) {
            // console.warn(e)
          if (username && username.name) fullName = username.name
             url = '/images/user.png'
             userOccupation = 'Не указана ниша'
        }




        const proxy = $STM_Config.img_proxy_prefix
        if (proxy && url) {
            const size = props.width + 'x' + props.height
            url = proxy + size + '/' + url;
        }

        

        return  <div className="User__wrap">

            <div className="UserProfile__Group-avatarwrapper">
            <div className="UserProfile__Group-avatar">
                    {process.env.BROWSER ?
                        url ? <Link to={link}> <img src={_urls.proxyImage(url || '')}  onError={this.onError} /></Link> : <Link to={link}><div className="User__defaultAva"></div></Link> :
                        <LoadingIndicator type="circle" inline />}
                </div></div>


                 <span className="Author">
                <span itemProp="author" itemScope itemType="http://schema.org/Person" className="Author__name">
                    <Link to={link}>{title + ' ' + fullName}</Link>
                </span>
                
            </span>



            
             </div>



    }
}

export default UserGroup;
