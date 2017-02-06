/* eslint react/prop-types: 0 */
import React from 'react';
import UserListRow from 'app/components/cards/UserListRow';
import { translate } from 'app/Translator';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';



class UserListEmpty extends React.Component {

    constructor() {
        super()
        this.state = {historyIndex: 0}
    }

    

    render() {
        const {state: {historyIndex}} = this
        
        const title = this.props.title

        
      

        
        

        return (<div className="UserProfile__listInner">
            <div className="row">
                {process.env.BROWSER ?
                <div className="column small-12 ">
                    <h3>{title}</h3>
                  
                </div> :
                <LoadingIndicator type="circle" inline />}
            </div>
        </div>);
    }
}

export default UserListEmpty
