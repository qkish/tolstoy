import React from 'react';
import {connect} from 'react-redux'
import user from 'app/redux/User';
import { translate } from 'app/Translator';
import { ALLOWED_CURRENCIES } from 'config/client_config'
import store from 'store';
import transaction from 'app/redux/Transaction'
import o2j from 'shared/clash/object2json'
import _urls from 'shared/clash/images/urls'
import _btc from 'shared/clash/coins/btc'
import { injectIntl } from 'react-intl'

@injectIntl
class Settings extends React.Component {

    state = {
        currentTab: 'base',
        errorMessage: '',
        successMessage: '',
        userImage: this.props.userImage || '',

        // BM data
        first_name: this.props.firstName || '',
        last_name: this.props.lastName || '',
        age: this.props.age || '',
        city: this.props.city || '',
        occupation: this.props.occupation || '',
        target_plan: this.props.targetPlan || '',
        target_date: this.props.targetDate || '',
        target_point_a: this.props.targetPointA || '',
        target_point_b: this.props.targetPointB || '',
        website: this.props.website || '',
        instagram: this.props.instagram || '',
        facebook: this.props.facebook || '',
        vk: this.props.vk || '',
        looking_for: this.props.lookingFor || '',
        i_can: this.props.iCan || '',
        background_image: this.props.backgroundImage || '',
    }

    handleCurrencyChange(event) { store.set('currency', event.target.value) }

    handleLanguageChange = (event) => {
        const language = event.target.value
        store.set('language', language)
        this.props.changeLanguage(language)
    }


    // -----------------------------
    // User base info fields handlers

    handleUserFirstNameChange = event => {
        this.setState({first_name: event.target.value})
    }
    handleUserLastNameChange = event => {
        this.setState({last_name: event.target.value})
    }
    handleUserAgeChange = event => {
        this.setState({age: event.target.value})
    }
    handleUserCityChange = event => {
        this.setState({city: event.target.value})
    }
    handleUserOccupationChange = event => {
        this.setState({occupation: event.target.value})
    }

    // -----------------------------
    // User target info fields handlers

    handleTargetPlanChange = event => {
        this.setState({target_plan: event.target.value})
    }
    handleTargetDateChange = event => {
        this.setState({target_date: event.target.value})
    }
    handleTargetPointAChange = event => {
        this.setState({target_point_a: event.target.value})
    }
    handleTargetPointBChange = event => {
        this.setState({target_point_b: event.target.value})
    }

    // ------------------------------
    // User contacts fields handlers

    handleWebsiteChange = event => {
        this.setState({website: event.target.value})
    }
    handleInstagramChange = event => {
        this.setState({instagram: event.target.value})
    }
    handleFacebookChange = event => {
        this.setState({facebook: event.target.value})
    }
    handleVKChange = event => {
        this.setState({vk: event.target.value})
    }

    // -----------------------------
    // User about fields handlers

    handleLookingForChange = event => {
        this.setState({looking_for: event.target.value})
    }
    handleICanChange = event => {
        this.setState({i_can: event.target.value})
    }
    handleBackgroundImageChange = event => {
        this.setState({background_image: event.target.value})
    }
    handleUserImageChange = event => {
        this.setState({userImage: event.target.value})
    }

    // -----------------------------
    // User base info submit handler

    handleUserFieldsSubmit = event => {
        event.preventDefault()
        this.setState({loading: true})

        const {account, updateAccount} = this.props
        let {metaData} = this.props

        if (!metaData) metaData = {}
        if (metaData == '{created_at: \'GENESIS\'}') metaData = {created_at: "GENESIS"}

        // Base
        metaData.first_name = this.state.first_name;
        metaData.last_name = this.state.last_name;
        metaData.city = this.state.city;
        metaData.age = this.state.age;
        metaData.occupation = this.state.occupation;

        // Target
        metaData.target_plan = this.state.target_plan;
        metaData.target_date = this.state.target_date;
        metaData.target_point_a = this.state.target_point_a;
        metaData.target_point_b = this.state.target_point_b;


        // Contacts
        metaData.website = this.state.website;
        metaData.instagram = this.state.instagram;
        metaData.facebook = this.state.facebook;
        metaData.vk = this.state.vk;

        // More
        metaData.i_can = this.state.i_can;
        metaData.looking_for = this.state.looking_for;
        metaData.background_image = this.state.background_image;
        metaData.user_image = this.state.userImage;

        metaData = JSON.stringify(metaData);

        updateAccount({
            json_metadata: metaData,
            account: account.name,
            memo_key: account.memo_key,
            errorCallback: err => {
                console.error('updateAccount() error!', err)
                this.setState({
                    loading: false,
                    errorMessage: translate('server_returned_error')
                })
            },
            successCallback: () => {
                console.log('SUCCES')
                // clear form ad show successMessage
                this.setState({
                    loading: false,
                    errorMessage: '',
                    successMessage: translate('saved') + '!',
                })
                // remove successMessage after a while
                setTimeout(() => this.setState({successMessage: ''}), 2000)
            }
        })
    }

    // Tabs select handle
    tabsSelectHandle = event =>  {
        const id = event.target.id
        this.setState({currentTab : id})
        console.log('route to settings/' + id)
    }

    // --------------------------------------
    // User user
    render() {
        const {state, props} = this
        const {locale} = props.intl
        const {currentTab} = state

        let currentFieldsBlock;
        const errorView =  state.errorMessage ?
            <div className="alert alert-danger">{state.errorMessage}</div> : state.successMessage ?
                <div className="alert alert-success">{state.successMessage}</div> : null;

        // ------------------------
        // Tabs -> routes and jsx
        // !!! Вынести в компоненты
        // ________________
        // Base fileds tab
        if (currentTab == 'base') {
            currentFieldsBlock =
                <div className="Settings__FieldsTabs__tab">
                    <form onSubmit={this.handleUserFieldsSubmit}>

                        {errorView}

                    <label>
                        <span>{translate('first_name')}</span>
                        <input type="text" onChange={this.handleUserFirstNameChange} value={state.first_name} placeholder={translate('first_name')} />
                    </label>
                    <label>
                        <span>{translate('last_name')}</span>
                        <input type="text" onChange={this.handleUserLastNameChange} value={state.last_name} placeholder={translate('last_name')} />
                    </label>
                    <label>
                        <span>{translate('city')}</span>
                        <input type="text" onChange={this.handleUserCityChange} value={state.city} placeholder={translate('city')} />
                    </label>
                    <label>
                        <span>{translate('age')}</span>
                        <input type="text" onChange={this.handleUserAgeChange} value={state.age} placeholder={translate('age')}/>
                    </label>
                    <label>
                        <span>{translate('occupation')}</span>
                        <textarea onChange={this.handleUserOccupationChange} value={state.occupation} placeholder={translate('occupation')}></textarea>
                    </label>

                    <p className="Settings__submit-wrap" style={{marginTop: 16.8}}>
                        <input type="submit" className="button" value={translate('save')} />
                    </p>
                </form>
            </div>;
        }

        // ________________
        // More fields tab
        if (currentTab == 'more') {
            currentFieldsBlock =
                <div className="Settings__FieldsTabs__tab">
                {/* Choose user more info */}
                <form onSubmit={this.handleUserFieldsSubmit}>

                    {errorView}

                    {/* Looking For */}
                    <label>
                        <span>{translate('looking_for')}</span>
                        <textarea onChange={this.handleLookingForChange} value={state.looking_for} placeholder={translate('looking_for')}></textarea>
                    </label>

                    {/* I Can */}
                    <label>
                        <span>{translate('i_can')}</span>
                        <textarea onChange={this.handleICanChange} value={state.i_can} placeholder={translate('i_can')}></textarea>
                    </label>

                    <p className="Settings__submit-wrap" style={{marginTop: 16.8}}>
                        <input type="submit" className="button" value={translate('save')} />
                    </p>
                </form>
                {/* end of choose */}
            </div>;
        }

        // __________________
        // Target fields tab
        if (currentTab == 'target') {
            currentFieldsBlock =
                <div className="Settings__FieldsTabs__tab">
                    <form onSubmit={this.handleUserFieldsSubmit}>

                        {errorView}

                        <label>
                            <span>{translate('target_date')}</span>
                            <input type="text" onChange={this.handleTargetDateChange} value={state.target_date} placeholder={translate('target_date')} />
                        </label>
                        <label>
                            <span>{translate('target_point_a')}</span>
                            <input type="text" onChange={this.handleTargetPointAChange} value={state.target_point_a} placeholder={translate('target_point_a')} />
                        </label>
                        <label>
                            <span>{translate('target_point_b')}</span>
                            <input type="text" onChange={this.handleTargetPointBChange} value={state.target_point_b} placeholder={translate('target_point_b')} />
                        </label>

                        <p className="Settings__submit-wrap" style={{marginTop: 16.8}}>
                            <input type="submit" className="button" value={translate('save')} />
                        </p>
                    </form>
                </div>;
        }

        // ___________________
        // Contacts fields tab
        if (currentTab == 'contacts') {
            currentFieldsBlock =
                <div className="Settings__FieldsTabs__tab">
                    <form onSubmit={this.handleUserFieldsSubmit}>

                        {errorView}

                        <label>
                            <span>{translate('website')}</span>
                            <input type="text" onChange={this.handleWebsiteChange} value={state.website} placeholder={translate('website')} />
                        </label>
                        <label>
                            <span>{translate('instagram')}</span>
                            <input type="text" onChange={this.handleInstagramChange} value={state.instagram} placeholder={translate('instagram')} />
                        </label>
                        <label>
                            <span>{translate('facebook')}</span>
                            <input type="text" onChange={this.handleFacebookChange} value={state.facebook} placeholder={translate('facebook')} />
                        </label>
                        <label>
                            <span>{translate('VK')}</span>
                            <input type="text" onChange={this.handleVKChange} value={state.vk} placeholder={translate('VK')} />
                        </label>

                        <p className="Settings__submit-wrap" style={{marginTop: 16.8}}>
                            <input type="submit" className="button" value={translate('save')} />
                        </p>
                    </form>
                </div>;
        }

        // ___________________
        // Avatar fields tab
        if (currentTab == 'avatar') {
            currentFieldsBlock =
                <div className="Settings__FieldsTabs__tab">

                    {errorView}

                    {state.userImage ? <img src={_urls.proxyImage(state.userImage)} alt={translate('user_avatar') + ' ' + props.account.name} /> : null}

                    <form onSubmit={this.handleUserFieldsSubmit}>
                        <label>
                            <span>{translate('add_image_url')}</span>
                            <input type="url" onChange={this.handleUserImageChange} value={state.userImage} disabled={!props.isOwnAccount || state.loading} placeholder={translate('add_image_url')} />
                        </label>

                        <p className="Settings__submit-wrap" style={{marginTop: 16.8}}>
                            <input type="submit" className="button" value={translate('save_avatar')} />
                        </p>
                    </form>
                </div>;
        }

        // _____________________
        // Background fields tab
        if (currentTab == 'background') {
            currentFieldsBlock =
                <div className="Settings__FieldsTabs__tab">

                    {errorView}

                    {state.background_image ? <img src={_urls.proxyImage(state.background_image)} alt={translate('user_avatar') + ' ' + props.account.name} /> : null}

                    <form onSubmit={this.handleUserFieldsSubmit}>

                        <label>
                        <span>{translate('add_background_image_url')}</span>
                            <input type="url" onChange={this.handleBackgroundImageChange} value={state.background_image} disabled={!props.isOwnAccount || state.loading} placeholder={translate('add_background_image_url')} />
                        </label>

                        <p className="Settings__submit-wrap" style={{marginTop: 16.8}}>
                            <input type="submit" className="button" value={translate('save_avatar')} />
                        </p>
                    </form>
                </div>;
        }

        // ___________________
        // System fields tab
        if (currentTab == 'system') {
            currentFieldsBlock =
                <div className="Settings__FieldsTabs__tab">

                    {errorView}

                    <label>
                        <span>{translate('choose_language')}</span>
                        <select defaultValue={locale}
                                onChange={this.handleLanguageChange}>
                            <option value="ru">русский</option>
                         <option value="en">english</option>
                         <option value="uk">українська</option>
                       </select>
                   </label>

                   <label>
                      <span> {translate('choose_currency')}</span>
                       <select defaultValue={store.get('currency')}
                               onChange={this.handleCurrencyChange}>
                       {ALLOWED_CURRENCIES.map(i =>
                       {return <option key={i} value={i}>{i}</option>})}
                    </select>
                </label>
            </div>;
        }

        let tabIsActive = id => { return id === currentTab }

        return <div className="Settings" style={{marginLeft: "10px"}}>



                <ul className="menu Settings__tabs">
                    <li role="presentation" className={currentTab == 'base' ? 'active' : ''}>
                        <a id="base" onClick={this.tabsSelectHandle}>{translate('base_tab')}</a>
                    </li>

                    <li role="presentation" className={currentTab == 'target' ? 'active' : ''}>
                        <a id="target" onClick={this.tabsSelectHandle}>{translate('target_tab')}</a>
                    </li>
                    <li role="presentation" className={currentTab == 'contacts' ? 'active' : ''}>
                        <a id="contacts" onClick={this.tabsSelectHandle}>{translate('contacts_tab')}</a>
                    </li>
                    <li role="presentation" className={currentTab == 'more' ? 'active' : ''}>
                        <a id="more" onClick={this.tabsSelectHandle}>{translate('more_tab')}</a>
                    </li>
                    <li role="presentation" className={currentTab == 'avatar' ? 'active' : ''}>
                        <a id="avatar" onClick={this.tabsSelectHandle}>{translate('avatar_tab')}</a>
                    </li>
                    <li role="presentation" className={currentTab == 'background' ? 'active' : ''}>
                        <a id="background" onClick={this.tabsSelectHandle}>{translate('background_tab')}</a>
                    </li>
                    <li role="presentation" className={currentTab == 'system' ? 'active' : ''}>
                        <a id="system" onClick={this.tabsSelectHandle}>{translate('system_tab')}</a>
                    </li>
                </ul>
            <div className="Settings__FieldsTabs">{currentFieldsBlock}</div>
        </div>
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => {

        // Steemit (Golos) data
        const {accountname} = ownProps.routeParams
        const account = state.global.getIn(['accounts', accountname]).toJS()
        const current_user = state.user.get('current')
        const username = current_user ? current_user.get('username') : ''
        const metaData = account ? o2j.ifStringParseJSON(account.json_metadata) : {}
        const userImage = metaData ? metaData.user_image : ''

        // UserProfileData(BM)
        // Base info
        const firstName = metaData ? metaData.first_name : ''
        const lastName = metaData ? metaData.last_name : ''
        const age = metaData ? metaData.age : ''
        const city = metaData ? metaData.city : ''
        const occupation = metaData ? metaData.occupation : '' // направление деятельности

        // Target
        const targetPlan = metaData ? metaData.target_plan : ''
        const targetDate = metaData ? metaData.target_date : ''
        const targetPointA = metaData ? metaData.target_point_a : 0
        const targetPointB = metaData ? metaData.target_point_b : 0

        // Contacts
        const website = metaData ? metaData.website : ''
        const instagram = metaData ? metaData.instagram : ''
        const facebook = metaData ? metaData.facebook : ''
        const vk = metaData ? metaData.vk : ''

        // About user
        const lookingFor = metaData ? metaData.looking_for : ''
        const iCan = metaData ? metaData.i_can : ''
        const backgroundImage = metaData ? metaData.background_image : ''
        //const groups = metaData ? metaData.groups : ''
        //const teachers = metaData ? metaData.teachers : ''
        //const books = metaData ? metaData.books : ''
        //const fullname     =   metaData ? metaData.fullname : ''

        return {
            account,
            metaData,
            userImage,

            // BM rows
            firstName,
            lastName,
            age,
            city,
            occupation,
            targetPlan,
            targetDate,
            targetPointA,
            targetPointB,
            website,
            instagram,
            facebook,
            vk,
            lookingFor,
            iCan,
            backgroundImage,

            //fullname,
            isOwnAccount: username == accountname,
            ...ownProps
        }
    },
    // mapDispatchToProps
    dispatch => ({
        changeLanguage: (language) => {
            dispatch(user.actions.changeLanguage(language))
        },
        updateAccount: ({successCallback, errorCallback, ...operation}) => {
            const options = {type: 'account_update', operation, successCallback, errorCallback}
            dispatch(transaction.actions.broadcastOperation(options))
        }
    })
)(Settings)
