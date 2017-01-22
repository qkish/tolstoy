import React, {Component, PropsTypes} from 'react';
import {numberWithCommas, vestingSteem} from 'app/utils/StateFunctions';

// -------------------------
// Компонент отображает
// основные данные пользователя
// в виде вертикального блока

class ViewUserBase extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static defaultProps = {}

    isFullName(meta) {
        let {first_name, last_name} = meta;
        
        if (first_name || last_name) { return true }
        else { return false }
    }
    
    AgeCalc(age) {
    var txt;
    let count = age % 100;
    if (count >= 5 && count <= 20) {
        txt = 'лет';
    } else {
        count = count % 10;
        if (count == 1) {
            txt = 'год';
        } else if (count >= 2 && count <= 4) {
            txt = 'года';
        } else {
            txt = 'лет';
        }
    }
    return txt;
    }


    InstaCorrect(text) {

     var pattern = /^((http|https|ftp):\/\/instagram.com\/)/;

        if(!pattern.test(text)) {
        text = "http://instagram.com/" + text;
         }
        return text;

    }
    FbCorrect(text) {

     var pattern = /^((http|https|ftp):\/\/facebook.com\/)/;

        if(!pattern.test(text)) {
        text = "http://facebook.com/" + text;
         }
        return text;

    }

    VkCorrect(text) {

     var pattern = /^((http|https|ftp):\/\/(vk.com|vkontakte.ru)\/)/;

        if(!pattern.test(text)) {
        text = "http://vk.com/" + text;
         }
        return text;

    }
     LinkCorrect(text) {

     var pattern = /^((http|https|ftp):\/\/)/;

        if(!pattern.test(text)) {
        text = "http://" + text;
         }
        return text;

    }





    render() {
        let account = this.props.account;
        let globalProps = this.props.global.getIn(['props']).toJS();
        let metaData = JSON.parse(account.json_metadata);
        let {first_name, last_name, age, city, occupation,
             website, instagram, facebook, vk} = metaData;

        // Подсчет голосов в Steem(golos)
        let vestingSteemFn = vestingSteem(account, globalProps);
        let vestingSteemVal = vestingSteemFn.toFixed(0);

        let yearsCorrect;
        yearsCorrect = this.AgeCalc(age);




        let instagramLink;
        let facebookLink;
        let vkLink;
        let websiteLink;

       
        
   
        


        if (instagram != '') {
             instagram = this.InstaCorrect(instagram);
            instagramLink = <div className="ViewUserBase_link"><a className="ViewUserBase__instagram" href={instagram} target='_blank'></a></div>;
        }
        if (facebook != '') {
            facebook = this.FbCorrect(facebook);
            facebookLink = <div className="ViewUserBase_link"><a className="ViewUserBase__facebook" href={facebook}  target='_blank'></a></div>;
        }
        if (vk) {
            vk = this.VkCorrect(vk);
            vkLink = <div className="ViewUserBase_link"><a className="ViewUserBase__vk" href={vk}  target='_blank'></a></div>;
        }
        if (website) {
            website = this.LinkCorrect(website);
            websiteLink = <div className="ViewUserBase_link"><a className="ViewUserBase__website" href={website}  target='_blank'>Сайт</a> </div>;
        }



        return <div className="UserProfile__nameinfo">

                <h2>{this.isFullName(metaData) ? first_name + ' ' + last_name : account.name}</h2>

            <div className="UserProfile__infoboxes">{age + ' ' + yearsCorrect + ', ' + city}</div>
            <div className="UserProfile__infoboxes">{occupation ? occupation : ''}</div>
            <div className="UserProfile__infoboxes ">Голосов: {vestingSteemVal}</div>

            <div className="ViewUserBase_linksblock">

            {instagramLink}
            {facebookLink}
            {vkLink}
            {websiteLink}
                
                
                

            </div>

        </div>
    }

}

export default ViewUserBase;
