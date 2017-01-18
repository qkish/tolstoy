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
        errorMessage: '',
        successMessage: '',

        userImage: this.props.userImage || '',

        // BM data
        first_name: this.props.first_name || '',
        last_name: this.props.last_name || '',
        age: this.props.age || '',
        city: this.props.city || '',
        occupation: this.props.occupation || '',
        target_plan: this.props.target_plan || '',
        target_date: this.props.target_date || '',
        target_point_a: this.props.target_point_a || '',
        target_point_b: this.props.target_point_b || '',
        website: this.props.website || '',
        instagram: this.props.instagram || '',
        facebook: this.props.facebook || '',
        vk: this.props.vk || '',
        looking_for: this.props.looking_for || '',
        i_can: this.props.i_can || '',

        fullname: this.props.fullname || ''
    }

    handleCurrencyChange(event) { store.set('currency', event.target.value) }

    handleLanguageChange = (event) => {
        const language = event.target.value
        store.set('language', language)
        this.props.changeLanguage(language)
    }



    handleUrlChange = event => {
        this.setState({userImage: event.target.value})
    }


    handleUserImageSubmit = event => {
        event.preventDefault()
        this.setState({loading: true})

        const {account, updateAccount} = this.props
        let {metaData} = this.props

        if (!metaData) metaData = {}
        if (metaData == '{created_at: \'GENESIS\'}') metaData = {created_at: "GENESIS"}
        metaData.user_image = this.state.userImage
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

    // -----------------------------
    // User base info handlers

    handleUserBaseInfoSubmit = event => {
        event.preventDefault()
        this.setState({loading: true})

        const {account, updateAccount} = this.props
        let {metaData} = this.props

        if (!metaData) metaData = {}
        if (metaData == '{created_at: \'GENESIS\'}') metaData = {created_at: "GENESIS"}
        metaData.first_name = this.state.first_name;
        metaData.last_name = this.state.last_name;
        metaData.city = this.state.city;
        metaData.age = this.state.age;
        metaData.occupation = this.state.occupation;

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
    // User target info handlers

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
    // User contacts handlers

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
    // User about handlers

    handleLookingForChange = event => {
        this.setState({looking_for: event.target.value})
    }
    handleICanChange = event => {
        this.setState({i_can: event.target.value})
    }


    //HandleUsername

      handleUsernameChange = event => {
        this.setState({fullname: event.target.value})
    }


     handleUsernameSubmit = event => {
        event.preventDefault()
        this.setState({loading: true})

        const {account, updateAccount} = this.props
        let {metaData} = this.props

        if (!metaData) metaData = {}
        if (metaData == '{created_at: \'GENESIS\'}') metaData = {created_at: "GENESIS"}
        metaData.fullname = this.state.fullname;
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

    render() {
        const {state, props} = this
        const {locale} = props.intl

        return <div className="Settings">
                    <div className="row">
                        <div className="small-12 columns">

                            {/* Choose user base info */}
                            <form onSubmit={this.handleUserBaseInfoSubmit}>

                                <h3>{translate('user_base_info')}</h3>

                                {/* First name */}
                                <label>
                                    {translate('first_name')}
                                    <input type="text" onChange={this.handleUserFirstNameChange} value={state.first_name}/>
                                    {state.errorMessage ? <small className="error">{state.errorMessage}</small> : state.successMessage ? <small className="success">{state.successMessage}</small> : null}
                                </label>

                                {/* Last name */}
                                <label>
                                    {translate('last_name')}
                                    <input type="text" onChange={this.handleUserLastNameChange} value={state.last_name}/>
                                    {state.errorMessage ? <small className="error">{state.errorMessage}</small> : state.successMessage ? <small className="success">{state.successMessage}</small> : null}
                                </label>

                                {/* City */}
                                <label>
                                    {translate('city')}
                                    <input type="text" onChange={this.handleUserCityChange} value={state.city}/>
                                    {state.errorMessage ? <small className="error">{state.errorMessage}</small> : state.successMessage ? <small className="success">{state.successMessage}</small> : null}
                                </label>

                                {/* Age */}
                                <label>
                                    {translate('age')}
                                    <input type="text" onChange={this.handleUserAgeChange} value={state.age}/>
                                    {state.errorMessage ? <small className="error">{state.errorMessage}</small> : state.successMessage ? <small className="success">{state.successMessage}</small> : null}
                                </label>

                                {/* Occupation */}
                                <label>
                                    {translate('occupation')}
                                    <textarea onChange={this.handleUserOccupationChange} value={state.occupation}></textarea>
                                </label>

                                <p className="text-center" style={{marginTop: 16.8}}>
                                    <input type="submit" className="button" value={translate('save')} />
                                </p>
                            </form>
                            {/* end of choose */}

                            <hr/>

                            {/* Choose user more info */}
                            <form onSubmit={this.handleUserBaseInfo}>

                                <h3>{translate('user_more_info')}</h3>

                                {/* Looking For */}
                                <label>
                                    {translate('looking_for')}
                                    <textarea onChange={this.handleLookingForChange}>{state.looking_for}</textarea>
                                </label>

                                {/* I Can */}
                                <label>
                                    {translate('i_can')}
                                    <textarea onChange={this.handleICanChange}>{state.i_can}</textarea>
                                </label>

                                <p className="text-center" style={{marginTop: 16.8}}>
                                    <input type="submit" className="button" value={translate('save')} />
                                </p>
                            </form>
                            {/* end of choose */}

                            <hr/>

                            {/* Choose user image/avatar */}
                            {state.userImage ? <img src={_urls.proxyImage(state.userImage)} alt={translate('user_avatar') + ' ' + props.account.name} /> : null}

                            <form onSubmit={this.handleUserImageSubmit}>

                                <h3>{translate('user_photo_info')}</h3>

                                <label>{translate('add_image_url')}
                                    <input type="url" onChange={this.handleUrlChange} value={state.userImage} disabled={!props.isOwnAccount || state.loading} />
                                    {
                                        state.errorMessage
                                            ? <small className="error">{state.errorMessage}</small>
                                            : state.successMessage
                                                ? <small className="success">{state.successMessage}</small>
                                                : null
                                    }
                                </label>
                                <p className="text-center" style={{marginTop: 16.8}}>
                                    <input type="submit" className="button" value={translate('save_avatar')} />
                                </p>
                            </form>
                            {/* End of choose */}

                            <hr/>

                            {/* Choose user target info */}
                            <form onSubmit={this.handleUserBaseInfo}>

                                <h3>{translate('user_target_info')}</h3>

                                {/* Target plan */}
                                <label>
                                    {translate('target_plan')}
                                    <textarea onChange={this.handleTargetPlanChange}>{state.target_plan}</textarea>
                                    {state.errorMessage ? <small className="error">{state.errorMessage}</small> : state.successMessage ? <small className="success">{state.successMessage}</small> : null}
                                </label>

                                {/* Traget data */}
                                <label>
                                    {translate('target_date')}
                                    <input type="text" onChange={this.handleTargetDateChange} value={state.target_date}/>
                                    {state.errorMessage ? <small className="error">{state.errorMessage}</small> : state.successMessage ? <small className="success">{state.successMessage}</small> : null}
                                </label>

                                {/* Target Point A */}
                                <label>
                                    {translate('target_point_a')}
                                    <input type="text" onChange={this.handleTargetPointAChange} value={state.target_point_a}/>
                                    {state.errorMessage ? <small className="error">{state.errorMessage}</small> : state.successMessage ? <small className="success">{state.successMessage}</small> : null}

                                </label>

                                {/* Target Point B */}
                                <label>
                                    {translate('target_point_b')}
                                    <input type="text" onChange={this.handleTargetPointBChange} value={state.target_point_b}/>
                                    {state.errorMessage ? <small className="error">{state.errorMessage}</small> : state.successMessage ? <small className="success">{state.successMessage}</small> : null}

                                </label>

                                <p className="text-center" style={{marginTop: 16.8}}>
                                    <input type="submit" className="button" value={translate('save')} />
                                </p>
                            </form>
                            {/* end of choose */}

                            <hr/>

                                {/* Choose user contacts info */}
                                <form onSubmit={this.handleUserBaseInfo}>

                                    <h3>{translate('user_contacts_info')}</h3>

                                    {/* Website */}
                                    <label>
                                        {translate('website')}
                                        <input type="text" onChange={this.handleWebsiteChange} value={state.website}/>
                                        {state.errorMessage ? <small className="error">{state.errorMessage}</small> : state.successMessage ? <small className="success">{state.successMessage}</small> : null}
                                    </label>

                                    {/* Instagram */}
                                    <label>
                                        {translate('instagram')}
                                        <input type="text" onChange={this.handleInstagramChange} value={state.instagram}/>
                                        {state.errorMessage ? <small className="error">{state.errorMessage}</small> : state.successMessage ? <small className="success">{state.successMessage}</small> : null}
                                    </label>

                                    {/* Facebook */}
                                    <label>
                                        {translate('facebook')}
                                        <input type="text" onChange={this.handleFacebookChange} value={state.facebook}/>
                                        {state.errorMessage ? <small className="error">{state.errorMessage}</small> : state.successMessage ? <small className="success">{state.successMessage}</small> : null}

                                    </label>

                                    {/* VK */}
                                    <label>
                                        {translate('VK')}
                                        <input type="text" onChange={this.handleVKChange} value={state.vk}/>
                                        {state.errorMessage ? <small className="error">{state.errorMessage}</small> : state.successMessage ? <small className="success">{state.successMessage}</small> : null}

                                    </label>

                                    <p className="text-center" style={{marginTop: 16.8}}>
                                        <input type="submit" className="button" value={translate('save')} />
                                    </p>
                                </form>
                                {/* end of choose */}

                            <hr/>

                                <h3>{translate('system_settings')}</h3>

                            {/* Choose language */}
                            <label>{translate('choose_language')}
                                <select defaultValue={locale} onChange={this.handleLanguageChange}>
                                    <option value="ru">русский</option>
                                    <option value="en">english</option>
                                    {/* in react-intl they use 'uk' instead of 'ua' */}
                                    <option value="uk">українська</option>
                                </select>
                            </label>
                            {/* end of choose */}

                            {/* CHOOSE CURRENCY */}
                            <label>{translate('choose_currency')}
                                <select defaultValue={store.get('currency')} onChange={this.handleCurrencyChange}>
                                    {
                                        ALLOWED_CURRENCIES.map(i => {
                                            return <option key={i} value={i}>{i}</option>
                                        })
                                    }
                                </select>
                            </label>
                        </div>
                    </div>
                </div>
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => {

        // Steemit (Golos) data
        const {accountname} =   ownProps.routeParams
        const account       =   state.global.getIn(['accounts', accountname]).toJS()
        const current_user  =   state.user.get('current')
        const username      =   current_user ? current_user.get('username') : ''
        const metaData      =   account ? o2j.ifStringParseJSON(account.json_metadata) : {}
        const userImage     =   metaData ? metaData.user_image : ''

        // UserProfileData(BM)
        // Base info
        const firstName = metaData ? metaData.first_name : ''
        const lastName = metaData ? metaData.last_name : ''
        const age = metaData ? metaData.age : ''
        const city = metaData ? metaData.city : ''
        const occupation = metaData ? metaData.occupation : '' // направление деятельности

        // Target
        const targetPlan = metaData ? metaData.target_plan : ''
        const targetPointA = metaData ? metaData.target_point_a : 0
        const targetPointB = metaData ? metaData.target_point_b : 0

        // Contacts
        const website = metaData ? metaData.website : ''
        const instagram = metaData ? metaData.instagram : ''
        const facebook = metaData ? metaData.facebook : ''
        const vk = metaData ? metaData.vk : ''

        // About user
        const lookingfor = metaData ? metaData.looking_for : ''
        const ican = metaData ? metaData.i_can : ''
        //const groups = metaData ? metaData.groups : ''
        //const teachers = metaData ? metaData.teachers : ''
        //const books = metaData ? metaData.books : ''
        const fullname     =   metaData ? metaData.fullname : ''

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
            targetPointA,
            targetPointB,
            website,
            instagram,
            facebook,
            vk,
            lookingfor,
            ican,

            fullname,
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
