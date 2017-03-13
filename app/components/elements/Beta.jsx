import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';

import {connect} from 'react-redux';

class Beta extends Component {
	// you can pass either user object, or username string


  constructor(props) {
        super(props);
        this.state = {};


 
    }

    static defaultProps = {
		
	}




	render() {


        let currentTaskTitle, currentTaskLink, currentTaskDesc, currentTaskImg

        let isShowLastTask = true

    
        if (this.props.current_program && this.props.current_program == 1 && isShowLastTask) {

            currentTaskTitle = '1000 посетителей, 100 репостов, план-кинжал'
            currentTaskLink = '/bm-tasks/@bm-bmtasks/1000-posetitelei-100-repostov-lid-magnit-i-plan-kinzhal'
            currentTaskDesc = 'Сделайте 1000 переходов на сайт, 100 репостов вашей истории, лид магнит и поставьте план-кинжал'
            currentTaskImg = 'https://s3.eu-central-1.amazonaws.com/bm-platform/taskceh4.png'
        }

        let title = currentTaskTitle;
        let link = currentTaskLink;
        let desc = currentTaskDesc;
        let image = currentTaskImg;
      

       

        let backgroundUrl
        if (image) backgroundUrl = {backgroundImage: "url('" + image + "')"};

        let result

        if (!title || !link) result = (<div className="Beta">
            <div className="Beta__overflow">
        <div className="Beta__title">
            Это beta-версия нового поколения IT-платформы БМ
        </div>
    
        <div className="Beta__desc">Теперь система сама будет вести вас до результата. 
        Нейросеть приведет вас к вашей точке B.</div>
        </div>
        </div>)

        if (title && link) result = (<div className="Beta__taskwrap"><Link to={link}>
                <div className="Beta" style={backgroundUrl}>
                <div className="Beta__overflow">
                <div className="Beta__thisistask">Текущее задание</div>
                <div className="Beta__title-large">
            {title}
            </div>
    
           {/* <div className="Beta__desc">{desc}</div> */}
            </div>
            </div></Link></div>

                )

    //let posts = this.getPosts('created', 'bm-tasks');

		
		return result
	}
}

export default connect(
    state => {
   

        const current_program = state.user.get('currentProgram');


        
        return {
       
            current_program
        }
    }
)(Beta);

