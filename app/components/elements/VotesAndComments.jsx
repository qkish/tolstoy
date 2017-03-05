import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Icon from 'app/components/elements/Icon';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate'
import { translate } from 'app/Translator';

class VotesAndComments extends React.Component {

    static propTypes = {
        // HTML properties
        post: React.PropTypes.string.isRequired,
        commentsLink: React.PropTypes.string.isRequired,

        // Redux connect properties
        votes: React.PropTypes.object,
        comments: React.PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'VotesAndComments');
    }

    render() {
        const {votes, comments, commentsLink} = this.props;
        const voters_count = votes.reduce((value, vote) => {
            return value + Math.sign(vote.get('percent'));
        }, 0);
        // console.warn('voters_count', voters_count)
        // console.warn('response_count', comments)
        let comments_tooltip = translate('no_responses_yet_click_to_respond');
        if (comments > 0) comments_tooltip = `${translate('response_count', {responseCount: comments})}. ${translate('click_to_respond')}.`
        // console.warn(comments_tooltip)
        // console.warn(translate('followed_count', {followingCount: 44}))

        return (
            <span className="VotesAndComments">
                <span className="Voting__points-total">
                   {voters_count}
                </span>
                <Link to={commentsLink} title={comments_tooltip}><span className={'VotesAndComments__comments Voting__points-total' + (comments === 0 ? ' no-comments' : '')}>
                     
                        {comments}
                     
                 </span></Link>
            </span>
        );
    }
}

export default connect(
    (state, props) => {
        const post = state.global.getIn(['content', props.post]);
        if (!post) return props;
        return {
            ...props,
            votes: post.get('active_votes'),
            comments: post.get('children')
        };
    }
)(VotesAndComments);
