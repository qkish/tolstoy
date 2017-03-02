import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';

class TaskCheckLink extends Component {
	// you can pass either user object, or username string

  constructor(props) {
        super(props);
        this.state = {};
 
    }

    static defaultProps = {
		
	}





	render() {

    //let posts = this.getPosts('created', 'bm-tasks');


    let tasksToCheck
    if (this.props.current_program == '1') {tasksToCheck = <ol className="Card__ul-tasks">

        <li><Link to="/created/bm-taskceh1">Заполнить A/B</Link></li>
        <li><Link to="/created/bm-taskceh2">Задание на неделю 1</Link></li>

    </ol>}

    if (this.props.current_program == '2') {tasksToCheck = <ol className="Card__ul-tasks">

        <li><Link to="/created/bm-taskmzs1">Заполнить A/B</Link></li>
        <li><Link to="/created/bm-taskmzs2">Нарисуйте два плаката</Link></li>
        <li><Link to="/created/bm-taskmzs3">Чатбот и соцсети</Link></li>
        <li><Link to="/created/bm-taskmzs4">Еженедельный отчет</Link></li>

    </ol>}

		
		return 	<section className="Card Card__minus-margin">

        <div className="Card__schedule-title">
            Задания на проверку
        </div>

       
            {tasksToCheck}

        


        </section>
	}
}


export default connect(
    state => {
   

        const current_program = state.user.get('currentProgram');


       
        return {
    
            current_program
        }
    }
)(TaskCheckLink);

