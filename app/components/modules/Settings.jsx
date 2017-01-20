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

        let currentFieldsBlock

        // ------------------------
        // Tabs -> routes and jsx
        // !!! Вынести в компоненты
        // ________________
        // Base fileds tab
        if (currentTab == 'base') {
            currentFieldsBlock =
                <div className="Settings__FieldsTabs__tab col-xs-12">
                    <form onSubmit={this.handleUserFieldsSubmit}>

                    <h5>{translate('user_base_info')}</h5>

                    <label>
                        {translate('first_name')}
                        <input type="text" onChange={this.handleUserFirstNameChange} value={state.first_name}/>
                    </label>
                    <label>
                        {translate('last_name')}
                        <input type="text" onChange={this.handleUserLastNameChange} value={state.last_name}/>
                    </label>
                    <label>
                        {translate('city')}
                        <input type="text" onChange={this.handleUserCityChange} value={state.city}/>
                    </label>
                    <label>
                        {translate('age')}
                        <input type="text" onChange={this.handleUserAgeChange} value={state.age}/>
                    </label>
                    <label>
                        {translate('occupation')}
                        <textarea onChange={this.handleUserOccupationChange} value={state.occupation}></textarea>
                    </label>

                    {state.errorMessage ?
                        <div className="alert alert-danger">{state.errorMessage}</div> : state.successMessage ?
                            <div className="alert alert-success">{state.successMessage}</div> : null}

                    <p className="text-center" style={{marginTop: 16.8}}>
                        <input type="submit" className="button" value={translate('save')} />
                    </p>
                </form>
            </div>;
        }

        // ________________
        // More fields tab
        if (currentTab == 'more') {
            currentFieldsBlock =
                <div className="Settings__FieldsTabs__tab col-xs-12">
                {/* Choose user more info */}
                <form onSubmit={this.handleUserFieldsSubmit}>

                    <h5>{translate('user_more_info')}</h5>

                    {/* Looking For */}
                    <label>
                        {translate('looking_for')}
                        <textarea onChange={this.handleLookingForChange} value={state.looking_for}></textarea>
                    </label>

                    {/* I Can */}
                    <label>
                        {translate('i_can')}
                        <textarea onChange={this.handleICanChange} value={state.i_can}></textarea>
                    </label>

                    {state.errorMessage ?
                        <div className="alert alert-danger">{state.errorMessage}</div> : state.successMessage ?
                            <div className="alert alert-success">{state.successMessage}</div> : null}

                    <p className="text-center" style={{marginTop: 16.8}}>
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
                <div className="Settings__FieldsTabs__tab col-xs-12">
                    <form onSubmit={this.handleUserFieldsSubmit}>

                        <h5>{translate('user_target_info')}</h5>

                        <label>
                            {translate('target_plan')}
                            <textarea onChange={this.handleTargetPlanChange} value={state.target_plan}></textarea>
                        </label>
                        <label>
                            {translate('target_date')}
                            <input type="text" onChange={this.handleTargetDateChange} value={state.target_date}/>
                        </label>
                        <label>
                            {translate('target_point_a')}
                            <input type="text" onChange={this.handleTargetPointAChange} value={state.target_point_a}/>
                        </label>
                        <label>
                            {translate('target_point_b')}
                            <input type="text" onChange={this.handleTargetPointBChange} value={state.target_point_b}/>
                        </label>

                        {state.errorMessage ?
                            <div className="alert alert-danger">{state.errorMessage}</div> : state.successMessage ?
                                <div className="alert alert-success">{state.successMessage}</div> : null}

                        <p className="text-center" style={{marginTop: 16.8}}>
                            <input type="submit" className="button" value={translate('save')} />
                        </p>
                    </form>
                </div>;
        }

        // ___________________
        // Contacts fields tab
        if (currentTab == 'contacts') {
            currentFieldsBlock =
                <div className="Settings__FieldsTabs__tab col-xs-12">
                    <form onSubmit={this.handleUserFieldsSubmit}>

                        <h5>{translate('user_contacts_info')}</h5>

                        <label>
                            {translate('website')}
                            <input type="text" onChange={this.handleWebsiteChange} defaultValue={state.website}/>
                        </label>
                        <label>
                            {translate('instagram')}
                            <input type="text" onChange={this.handleInstagramChange} defaultValue={state.instagram}/>
                        </label>
                        <label>
                            {translate('facebook')}
                            <input type="text" onChange={this.handleFacebookChange} defaultValue={state.facebook}/>
                        </label>
                        <label>
                            {translate('VK')}
                            <input type="text" onChange={this.handleVKChange} defaultValue={state.vk}/>
                        </label>

                        {state.errorMessage ?
                            <div className="alert alert-danger">{state.errorMessage}</div> : state.successMessage ?
                                <div className="alert alert-success">{state.successMessage}</div> : null}

                        <p className="text-center" style={{marginTop: 16.8}}>
                            <input type="submit" className="button" value={translate('save')} />
                        </p>
                    </form>
                </div>;
        }

        // ___________________
        // Avatar fields tab
        if (currentTab == 'avatar') {
            currentFieldsBlock =
                <div className="Settings__FieldsTabs__tab col-xs-12">
                {state.userImage ? <img src={_urls.proxyImage(state.userImage)} alt={translate('user_avatar') + ' ' + props.account.name} /> : null}

                <form onSubmit={this.handleUserFieldsSubmit}>

                    <h5>{translate('user_photo_info')}</h5>

                    <label>{translate('add_image_url')}
                        <input type="url" onChange={this.handleUserImageChange} value={state.userImage} disabled={!props.isOwnAccount || state.loading} />
                    </label>

                    {state.errorMessage ?
                        <div className="alert alert-danger">{state.errorMessage}</div> : state.successMessage ?
                            <div className="alert alert-success">{state.successMessage}</div> : null}

                    <p className="text-center" style={{marginTop: 16.8}}>
                        <input type="submit" className="button" value={translate('save_avatar')} />
                    </p>
                </form>
            </div>;
        }

        // _____________________
        // Background fields tab
        if (currentTab == 'background') {
            currentFieldsBlock =
                <div className="Settings__FieldsTabs__tab col-xs-12">

                    {state.background_image ? <img src={_urls.proxyImage(state.background_image)} alt={translate('user_avatar') + ' ' + props.account.name} /> : null}

                    <form onSubmit={this.handleUserFieldsSubmit}>

                        <h5>{translate('user_background_info')}</h5>

                        <label>{translate('add_background_image_url')}
                            <input type="url" onChange={this.handleBackgroundImageChange} value={state.background_image} disabled={!props.isOwnAccount || state.loading} />
                        </label>

                        {state.errorMessage ?
                            <div className="alert alert-danger">{state.errorMessage}</div> : state.successMessage ?
                                <div className="alert alert-success">{state.successMessage}</div> : null}

                        <p className="text-center" style={{marginTop: 16.8}}>
                            <input type="submit" className="button" value={translate('save_avatar')} />
                        </p>
                    </form>
                </div>;
        }

        // ___________________
        // System fields tab
        if (currentTab == 'system') {
            currentFieldsBlock =
                <div className="Settings__FieldsTabs__tab col-xs-12">

                    <h5>{translate('system_settings')}</h5>

                    {state.errorMessage ?
                        <div className="alert alert-danger">{state.errorMessage}</div> : state.successMessage ?
                            <div className="alert alert-success">{state.successMessage}</div> : null}

                    <label>
                        {translate('choose_language')}
                        <select defaultValue={locale}
                                onChange={this.handleLanguageChange}>
                            <option value="ru">русский</option>
                         <option value="en">english</option>
                         <option value="uk">українська</option>
                       </select>
                   </label>

                   <label>
                       {translate('choose_currency')}
                       <select defaultValue={store.get('currency')}
                               onChange={this.handleCurrencyChange}>
                       {ALLOWED_CURRENCIES.map(i =>
                       {return <option key={i} value={i}>{i}</option>})}
                    </select>
                </label>
            </div>;
        }

        let tabIsActive = id => { return id === currentTab }

        return <div className="PostSummary Settings" style={{marginLeft: "10px"}}>

            <h3>{translate('settings')}</h3>

                <ul className="nav nav-pills">
                    <li role="presentation" className={currentTab == 'base' ? 'active' : ''}>
                        <a id="base" onClick={this.tabsSelectHandle}>{translate('base_tab')}</a>
                    </li>
                    <li role="presentation" className={currentTab == 'more' ? 'active' : ''}>
                        <a id="more" onClick={this.tabsSelectHandle}>{translate('more_tab')}</a>
                    </li>
                    <li role="presentation" className={currentTab == 'target' ? 'active' : ''}>
                        <a id="target" onClick={this.tabsSelectHandle}>{translate('target_tab')}</a>
                    </li>
                    <li role="presentation" className={currentTab == 'contacts' ? 'active' : ''}>
                        <a id="contacts" onClick={this.tabsSelectHandle}>{translate('contacts_tab')}</a>
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
            <div className="Settings__FieldsTabs row">{currentFieldsBlock}</div>
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
