import React from 'react';
import {connect} from 'react-redux';
import SvgImage from 'app/components/elements/SvgImage';
import AddToWaitingList from 'app/components/modules/AddToWaitingList';
import { translate } from 'app/Translator';
import { formatCoins } from 'app/utils/FormatCoins';
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from 'config/client_config';
import { localizedCurrency } from 'app/components/elements/LocalizedCurrency';

class SignUp extends React.Component {
    constructor() {
        super();
        this.state = {waiting_list: false};
    }

    render() {
        if ($STM_Config.read_only_mode) {
            return <div className="row">
                <div className="column">
                    <div className="callout alert">
                        <p>{translate("read_only_mode")}</p>
                    </div>
                </div>
            </div>;
        }

        if (this.props.serverBusy || $STM_Config.disable_signups) {
            return <div className="row">
                <div className="column callout" style={{margin: '20px', padding: '40px'}}>
                    <p>
                        {translate("membership_invitation_only") + ' ' + translate("submit_email_to_get_on_waiting_list")}
                    </p>
                    <AddToWaitingList />
                </div>
            </div>;
        }

        return <div className="SignUp">
            <div className="row">
                <div className="column">
                    <h3>{translate("sign_up")}</h3>
                    <p>
                        {translate("we_require_social_account")} {' '}
                        {translate("personal_info_will_be_private")}
                        {' '}
                        <a href={TERMS_OF_SERVICE_URL} target="_blank">
                            {translate("personal_info_will_be_private_link")}
                        </a>.
                    </p>
                </div>
            </div>

            <div className="row">
                <form>
                    <div className="col-xs-12">
                        <label>
                            {translate('register_email_label')}
                            <input type="text"/>
                        </label>
                    </div>
                    <div className="col-xs-12">
                        <label>
                            {translate('register_password_label')}
                            <input type="password"/>
                        </label>
                    </div>
                    <br/>
                    <div className="col-xs-12">
                        <input type="submit" className="btn btn-success" value={translate("register_submit_text")}/>
                    </div>
                </form>
            </div>

            {/*<div className="row">
                <div className="column large-4 shrink">
                    <SvgImage name="reddit" width="64px" height="64px" />
                </div>
                <div className="column large-8">
                    <a href="/connect/reddit" className="button SignUp--reddit-button">
                        {translate("continue_with_reddit")}
                    </a>
                    <br />
                    <span className="secondary">
                        ({translate("requires_5_or_more_reddit_comment_karma")})
                    </span>
                </div>
            </div>*/}

            {/*<div className="row">
                <div className="column">
                      <br />
                    translate("dont_have_facebook") <br />
                    {this.state.waiting_list ? <AddToWaitingList /> : <a href="#" onClick={() => this.setState({waiting_list: true})}>
                        <strong> {translate("subscribe_to_get_sms_confirm")}.</strong>
                    </a>}
                </div>
            </div>*/}
            <div className="row">
                <div className="column">
                    <br />
                    <p className="secondary">
                        {translate('by_verifying_you_agree_with') + ' '}
                        <a href={PRIVACY_POLICY_URL} target="_blank">
                            {translate('by_verifying_you_agree_with_privacy_policy')}
                        </a>
                        {' ' + translate('by_verifying_you_agree_with_privacy_policy_of_website_APP_URL')}.
                    </p>
                </div>
            </div>
        </div>
    }
}

export default connect(
    state => {
        return {
            signup_bonus: state.offchain.get('signup_bonus'),
            serverBusy: state.offchain.get('serverBusy')
        };
    }
)(SignUp);
