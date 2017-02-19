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

class EnterPrivate extends React.Component {

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
            privateKey: '',
            

            waiting_list: false,
            hiding: '',
            preoloader: '',
            loading: false};

        this.onSubmit = this.onSubmit.bind(this);
        
        this.onPrivateKeyChange = this.onPrivateKeyChange.bind(this);
       
        
    }

   

    onPrivateKeyChange(e) {
        const emailSet = e.target.value;
      
        this.setState({privateKey: emailSet});
    }

     onSubmit(e) {
        e.preventDefault();
        this.setState({server_error: '', loading: true});
        const {privateKey} = this.state;
        if (!privateKey) return;

      
    }


   


   


    render() {

         
         let loaderStatus = this.state.PreloaderShown;

         const {privateKey} = this.state
      
       

        return <div className="LoginForm">
        
               <h3>Введите приватный ключ VIP-аккаунта</h3>

                <form onSubmit={this.onSubmit} autoComplete="off" noValidate method="post">
                    <div className="LoginForm__login">
                        <label className="LoginForm__label">
                            Введите приватный ключ</label>
                            <input type="password" className="LoginForm__login-input" placeholder="Приватный ключ Голос" ref="privateKey" name="privateKey" onChange={this.onPrivateKeyChange} required value={privateKey} />
                       
                    </div>
                    
                    
                    <div>
                        <input type="submit" className="button LoginForm__signup-button" value="Продолжить вход" disabled={this.state.loading} />
                    </div>
                </form>
      
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
)(EnterPrivate);
