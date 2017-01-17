/* eslint react/prop-types: 0 */
import React from 'react';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate'


import Follow from 'app/components/elements/Follow';
import Icon from 'app/components/elements/Icon';
import { Link } from 'react-router';
import {authorNameAndRep} from 'app/utils/ComponentFormatters';

import { translate } from 'app/Translator';


const {string, bool, number} = React.PropTypes

class Author extends React.Component {
    



    static propTypes = {
        author: string.isRequired,
        follow: bool,
        mute: bool,
        authorRepLog10: number,
    }
    static defaultProps = {
        follow: true,
        mute: true,
    }
    shouldComponentUpdate = shouldComponentUpdate(this, 'Author')

    trackAnalytics = eventType => {
        console.log(eventType)
        analytics.track(eventType)
    }

    render() {
        const {author, follow, mute, authorRepLog10} = this.props // html
        const {username} = this.props // redux

        const author_link = <span className="Author">
    
        <span itemProp="author" itemScope itemType="http://schema.org/Person" className="Author__name">
            <Link to={'/@' + author}><strong>{author}</strong></Link>
        </span>
         </span>

        if(!username)
            return author_link


        return (

           

            <span className="Author">

            

                       
                
                   
                        <span itemProp="author" itemScope itemType="http://schema.org/Person" className="Author__name">
                            <Link to={'/@' + author}>{author}</Link>
                        </span>
                        
                   
                
               
            </span>
        )
               
    }
}

import {connect} from 'react-redux'
export default connect(
    (state, ownProps) => {
        const current = state.user.get('current')
        const username = current && current.get('username')
        return {
            ...ownProps,
            username,
        }
    },
    // dispatch => ({
    //     vote: (abc) => {
    //         dispatch(transaction.actions.broadcastOperation({
    //             abc
    //         }))
    //     },
    // })
)(Author)
