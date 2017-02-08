import React from 'react';
import { Link } from 'react-router';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import Icon from 'app/components/elements/Icon';
import { connect } from 'react-redux';
import user from 'app/redux/User';
import Reblog from 'app/components/elements/Reblog';
import Voting from 'app/components/elements/Voting';
import Tooltip from 'app/components/elements/Tooltip';
import {immutableAccessor} from 'app/utils/Accessors';
import extractContent from 'app/utils/ExtractContent';
import { browserHistory } from 'react-router';
import VotesAndComments from 'app/components/elements/VotesAndComments';
import TagList from 'app/components/elements/TagList';
import {authorNameAndRep} from 'app/utils/ComponentFormatters';
import {Map} from 'immutable';
import Reputation from 'app/components/elements/Reputation';
import Userpic from 'app/components/elements/Userpic';

import User from 'app/components/elements/User';

import Author from 'app/components/elements/Author';
import UserNiche from 'app/components/elements/UserNiche';
import { translate } from 'app/Translator';
import { detransliterate } from 'app/utils/ParsersAndFormatters';
import store from 'store';
import { FRACTION_DIGITS, DEFAULT_CURRENCY } from 'config/client_config';

function TimeAuthorCategory({post, links, authorRepLog10, gray}) {
    const author = <strong>{post.author}</strong>;
    return (
        <span className="vcard">

            <Tooltip t={new Date(post.created).toLocaleString()}>
                <span className="TimeAgo"><TimeAgoWrapper date={post.created} /></span>
            </Tooltip>
            <span>{' ' + translate('by')}&nbsp;
                <span itemProp="author" itemScope itemType="http://schema.org/Person">
                    {links ? <Link to={post.author_link}>{author}</Link> :
                        <strong>{author}</strong>}&nbsp;

                </span>
            </span>
            <span>{' ' + translate('in')}&nbsp;{links ? <TagList post={post} /> : <strong>{detransliterate(post.category)}</strong>}</span>
        </span>
    );
}

function isLeftClickEvent(event) {
    return event.button === 0
}

function isModifiedEvent(event) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

function navigate(e, onClick, post, url) {
    if (isModifiedEvent(e) || !isLeftClickEvent(e)) return;
    e.preventDefault();
    if (onClick) onClick(post, url);
    else browserHistory.push(url);
}

class PostSummary extends React.Component {
    static propTypes = {
        post: React.PropTypes.string.isRequired,
        pending_payout: React.PropTypes.string.isRequired,
        total_payout: React.PropTypes.string.isRequired,
        content: React.PropTypes.object.isRequired,
        netVoteSign: React.PropTypes.number,
        currentCategory: React.PropTypes.string,
        thumbSize: React.PropTypes.string,
        onClick: React.PropTypes.func,
        jsonMetadata: React.PropTypes.object,
    };

    shouldComponentUpdate(props) {
        return props.thumbSize !== this.props.thumbSize ||
               props.pending_payout !== this.props.pending_payout ||
               props.total_payout !== this.props.total_payout;
    }

    render() {
        const {currentCategory, thumbSize, ignore, onClick} = this.props;
        const {post, content, pending_payout, total_payout, cashout_time, jsonMetadata, accounts} = this.props;
        if (!content) return null;

        const archived = content.get('mode') === 'archived'
        let reblogged_by = content.get('first_reblogged_by')
        if(reblogged_by) {
          reblogged_by = <div className="PostSummary__reblogged_by">
                             <Icon name="reblog" /> {translate('reblogged_by') + ' '} <Link to={'/@'+reblogged_by}>{reblogged_by}</Link>
                         </div>
        }

        const {gray, pictures, authorRepLog10, hasFlag} = content.get('stats', Map()).toJS()
        const p = extractContent(immutableAccessor, content);
        

        let desc = p.desc
        if(p.image_link)// image link is already shown in the preview
            desc = desc.replace(p.image_link, '')
        let title_link_url;
        let title_text = p.title;
        let comments_link;
        let is_comment = false;

        if( content.get( 'parent_author') !== "" ) {
           title_text = "Re: " + content.get('root_title');
           title_link_url = content.get( 'url' );
           comments_link = title_link_url;
           is_comment = true;
        } else {
           title_link_url = p.link;
           comments_link = p.link + '#comments';
        }

        let content_body = <div className="PostSummary__body entry-content">
            <a href={title_link_url} onClick={e => navigate(e, onClick, post, title_link_url)}>{desc}</a>
        </div>;
        let content_title = <h1 className="entry-title">
            <a href={title_link_url} onClick={e => navigate(e, onClick, post, title_link_url)}>{title_text}</a>
        </h1>;

         let money = '0';

        if (p.json_metadata.daySumm)  {
            money = p.json_metadata.daySumm;
            money = String(money);
            money = money.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
         }

         
        let fileLink
         if (p.json_metadata.fileAttached) {
            let filename = p.json_metadata.fileAttached;
            filename = String(filename);

            
            let fileicon
            var fileExt = filename.substring(filename.lastIndexOf(".")+1, filename.length).toLowerCase();

            if (fileExt == 'doc' || fileExt == 'docx') { fileicon = 'PostSummary__file-word '}
            if (fileExt == 'xls' || fileExt == 'xlsx') { fileicon = 'PostSummary__file-excel'}
            if (fileExt == 'pdf') { fileicon = 'PostSummary__file-pdf'}
            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif' || fileExt == 'psd') { fileicon = 'PostSummary__file-image'}


            
            let exactName = filename.split('\\').pop().split('/').pop();

            exactName = decodeURI(exactName)

            exactName = exactName.replace(/[^0-9A-Za-zА-Яа-яЁё _.-]/g, "")

            fileLink = <a href={filename} className={'PostSummary__file ' + fileicon} >{exactName}</a>




         }

        let moneyCurrency = store.get('fetchedCurrency') || DEFAULT_CURRENCY

        let moneyToday = <div className="PostSummary__summToday">{translate('earned_in_post')} {money} {moneyCurrency}</div>

        // author and category
        let author_category = <div className="vcard">

            {/* <div className="Author__avatar_wrapper">
                          <Link to={'/@' + p.author}>
                                <Userpic account={p.author} width="50" height="50" />
                            </Link>
                </div>

            <Author account={p.author}/>
            <TimeAgoWrapper date={p.created} className="updated" />
            <div className="PostSummary__niche"><UserNiche account={p.author} /></div> */}
            <User account={p.author} postdate={p.created} />

        </div>

        if( !(currentCategory && currentCategory.match( /nsfw/ )) ) {
           if (currentCategory !== '-' && currentCategory !== p.category && p.category.match(/nsfw/) ) {
               return null;
           }
        }

        let thumb = null;
        if(pictures && p.image_link) {
          const prox = $STM_Config.img_proxy_prefix
          const size = (thumbSize == 'mobile') ? '640x480' : '556x356'
          const url = (prox ? prox + size + '/' : '') + p.image_link
          if(thumbSize == 'mobile') {
            thumb = <a href={p.link} onClick={e => navigate(e, onClick, post, p.link)} className="PostSummary__image-mobile"><img src={url} /></a>
          } else {
            thumb = <a href={p.link} onClick={e => navigate(e, onClick, post, p.link)} className="PostSummary__image"><img src={url} /></a>
          }
        }
        const commentClasses = []
        if(gray || ignore) commentClasses.push('downvoted') // rephide

        return (
            <article className={'PostSummary hentry' + (thumb ? ' with-image ' : ' ') + commentClasses.join(' ')}
                     itemScope itemType ="http://schema.org/blogPost">
                <div className="PostSummary__author_with_userpic">
                    <span className="PostSummary__time_author_category">
                        {author_category}
                        {!archived && <Reblog author={p.author} permlink={p.permlink} />}
                    </span>
                </div>

                <div className={hasFlag ? '' : 'PostSummary__collapse'}>
                    <div className="float-right"><Voting pending_payout={pending_payout} total_payout={total_payout} showList={false} cashout_time={cashout_time} post={post} flag /></div>
                </div>
                {reblogged_by}
                 <div className="PostSummary__header">
                        {content_title}
                    </div>


                <div className="PostSummary__content">

                    {content_body}
                    {fileLink}



                </div>
                {thumb}
                <div className="PostSummary__footer">
                    <Voting pending_payout={pending_payout} total_payout={total_payout} cashout_time={cashout_time} post={post} showList={false} />
                    {moneyToday}
                </div>
            </article>
        )
    }
}

export default connect(
    (state, props) => {
        const {post} = props;
        const content = state.global.get('content').get(post);
        const accounts = state.global.get('accounts');

        let pending_payout = 0;
        let total_payout = 0;
        if (content) {
            pending_payout = content.get('pending_payout_value');
            total_payout = content.get('total_payout_value');
        }
        return {post, content, pending_payout, total_payout, accounts};
    },

    (dispatch) => ({
        dispatchSubmit: data => { dispatch(user.actions.usernamePasswordLogin({...data})) },
        clearError: () => { dispatch(user.actions.loginError({error: null})) }
    })
)(PostSummary)
