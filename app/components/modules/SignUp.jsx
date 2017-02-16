import React,  { PropTypes, Component }  from 'react';
import {connect} from 'react-redux';
import SvgImage from 'app/components/elements/SvgImage';
import AddToWaitingList from 'app/components/modules/AddToWaitingList';
import { translate } from 'app/Translator';
import { formatCoins } from 'app/utils/FormatCoins';
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from 'config/client_config';
import { localizedCurrency } from 'app/components/elements/LocalizedCurrency';
import {validate_account_name} from 'app/utils/ChainValidation';
import g from 'app/redux/GlobalReducer';

import reactForm from 'app/utils/ReactForm'

class SignUp extends React.Component {

    static propTypes = {
        //Steemit
        login_error: PropTypes.string,
        onCancel: PropTypes.func,
    };

    static defaultProps = {
        afterLoginRedirectToAccount: false
    };


   



    constructor(props) {
        super(props);


        this.state = {
            email: '',
            name: '',
            lastname: '',
            waiting_list: false,
            hiding: '',
            preoloader: '',
            loading: false};

        this.onSubmit = this.onSubmit.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onLastNameChange = this.onLastNameChange.bind(this);
        
    }

    onNameChange(e) {
        const nameSet = e.target.value;
        this.setState({name: nameSet});
    }

    onLastNameChange(e) {
        const lastnameSet = e.target.value;
        this.setState({lastname: lastnameSet});
    }

    onEmailChange(e) {
        const emailSet = e.target.value;
      
        this.setState({email: emailSet});
    }

     onSubmit(e) {
        e.preventDefault();
        this.setState({server_error: '', loading: true});
        const {email, name, lastname} = this.state;
        if (!email || !name) return;

        

        fetch('/api/v1/bm_signup', {
            method: 'post',
            mode: 'no-cors',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                csrf: $STM_csrf,
                email,
                name,
                lastname
                //json_meta: JSON.stringify({"ico_address": icoAddress})
            })
        }).then(r => r.json()).then(res => {
            if (res.error || res.status !== 'ok') {
                console.error('SignUp server error', res.error);
                
                this.setState({server_error: res.error || translate('unknown'), loading: false});
            } else {
                this.setState({loading: false});
                window.location = `/login.html#account=${name}&msg=accountcreated`;
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


   


    handleMouseDown = event => {
           // this.setState({hiding: 'SignUp_btnCovered'})
           // this.setState({preloader: 'PreloaderShown'})
    }



    render() {

         let btnStatus = this.state.hiding;
         let loaderStatus = this.state.PreloaderShown;

         const {email, name, lastname} = this.state
      
       

        return <div className="LoginForm">
        
               <h3>{translate("sign_up")}</h3>

                <form onSubmit={this.onSubmit} autoComplete="off" noValidate method="post">
                    <div className="LoginForm__login">
                        <label className="LoginForm__label">
                            {translate('enter_username')}</label>
                            <input type="text" className="LoginForm__login-input" placeholder={translate('enter_username')} ref="email" name="email" onChange={this.onEmailChange} required value={email} />
                       
                    </div>
                    <div className="LoginForm__login">
                        <label className="LoginForm__label">
                            {translate('first_name')}</label>
                            <input type="text" className="LoginForm__password-input" ref="name" name="name" placeholder={translate('first_name')} onChange={this.onNameChange} required value={name}/>
                  
                    </div>
                     <div className="LoginForm__login">
                        <label className="LoginForm__label">
                            {translate('last_name')}</label>
                            <input type="text" className="LoginForm__password-input" ref="lastname" name="lastname" placeholder={translate('last_name')} onChange={this.onLastNameChange} value={lastname}/>
                  
                    </div>
                    
                    <div className={this.state.hiding}>
                        <input type="submit" className="button LoginForm__signup-button" value="Зарегистрироваться" onMouseDown={this.handleMouseDown} disabled={this.state.loading} />
                    </div>
                </form>
      
     
              <div className="LoginForm__privacy">
                        {translate('by_verifying_you_agree_with') + ' '}
                        <a href={PRIVACY_POLICY_URL} target="_blank">
                            {translate('by_verifying_you_agree_with_privacy_policy')}
                        </a>
                        {' ' + translate('by_verifying_you_agree_with_privacy_policy_of_website_APP_URL')}.

                        </div>
              </div>
    }
}

let hasError

export default connect(
    state => {
        //const login_error = state.user.get('login_error')
        //hasError = !!login_error
        


        return {
            signup_bonus: state.offchain.get('signup_bonus'),
            serverBusy: state.offchain.get('serverBusy')
        };
    }
)(SignUp);
