import React, {Component, PropsTypes} from 'react';
import {numberWithCommas, vestingSteem} from 'app/utils/StateFunctions';
import parse from 'date-fns/parse';
import { Link } from 'react-router';
import {connect} from 'react-redux';

import UserGroup from 'app/components/elements/UserGroup';

// -------------------------
// Компонент отображает
// основные данные пользователя
// в виде вертикального блока

class ViewUserHierarchy extends Component {

    constructor(props) {
        super(props);
        this.state = {hierarchy: ''};
    }

    getHierarchy = (props) => {
        let email = props.account.name ? props.account.name : '';

        fetch('/api/v1/user_hierarchy', {
            method: 'post',
            mode: 'no-cors',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                csrf: $STM_csrf,
                email
                //json_meta: JSON.stringify({"ico_address": icoAddress})
            })
        }).then(r => r.json()).then(res => {
            if (res.error || res.status !== 'ok') {
                console.error('SignUp server error', res.error);

                this.setState({server_error: res.error || translate('unknown'), loading: false});
            } else {
                this.setState({hierarchy: res.hierarchy});

            }
        }).catch(error => {
            console.error('Caught CreateAccount server error', error);
            this.setState({server_error: (error.message ? error.message : error), loading: false});
        });
    }

   componentWillReceiveProps(nextProps)  {

    this.getHierarchy(nextProps)

    }

    componentDidMount() {
     this.getHierarchy(this.props)
    }

    static defaultProps = {}

    render() {
        let account = this.props.account;

        let hierarchy = this.state.hierarchy

        let myTen, myHundred, myPolk, myGroup

        if (hierarchy && hierarchy.ten) myTen = hierarchy.ten
        if (hierarchy && hierarchy.hundred) myHundred = hierarchy.hundred
        if (hierarchy && hierarchy.polk) myPolk = hierarchy.polk
        if (hierarchy && hierarchy.couch_group) myGroup = hierarchy.couch_group

        return <div className="UserProfile__blockinfo UserProfile__groupinfo">
                <h6>Группы</h6>


                <div className="UserProfile__group-wrap">
                {myTen ? <div className="UserProfile__group">
                <UserGroup link={'/rating/ten/' + myTen} title='Десятка' id={myTen}/></div>
                : '' }

                {myHundred ? <div className="UserProfile__group">
                <UserGroup link={'/rating/hundred/' + myHundred} title='Сотня' id={myHundred} />
                </div> : '' }

                {myPolk ? <div className="UserProfile__group">

                <UserGroup link={'/rating/polk/' + myPolk} title='Полк' id={myPolk}/>
                </div> : '' }

                {myGroup ? <div className="UserProfile__group">
                <UserGroup link={'/rating/couch-group/' + myGroup} title='Группа' id={myGroup} />
                </div> : '' }
                </div>

        </div>
    }

}

export default ViewUserHierarchy;
