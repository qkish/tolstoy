import React from 'react';
import LoginForm from 'app/components/modules/LoginForm';
import { translate } from 'app/Translator';
import {connect} from 'react-redux';


//require

class LoginCeh extends React.Component {

    static propTypes = {
       username: React.PropTypes.string,
       loggedIn: React.PropTypes.bool
    };

 

    render() {

        let loggedUser = this.props.loggedIn


        if (loggedUser) {
            window.location = '/';
        }
        

        
        if (!process.env.BROWSER) { // don't render this page on the server
            return <div className="LoginCeh row">
                <div className="column">
                    {translate('loading')}..
                </div>
            </div>;
        }
        return (
            <div className="LoginCeh row">
                <div className="column">
                    <LoginForm afterLoginRedirectToAccount />
                </div>
            </div>
        );
    }
}





module.exports = {
    path: 'ceh',
    component: connect( 
     state => {
        if (!process.env.BROWSER) {
            return {
                username: null,
                loggedIn: false,
                
            }
        }
        const username = state.user.getIn(['current', 'username']);
        
        const loggedIn = !!username;

        
        return {
            username,
            loggedIn
        }
    }

)(LoginCeh)
};

