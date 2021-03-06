import React from 'react';
import { Link } from 'react-router';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';
import Icon from 'app/components/elements/Icon';
import { connect } from 'react-redux';
// import FormattedAsset from 'app/components/elements/FormattedAsset';
// import Userpic from 'app/components/elements/Userpic';
import user from 'app/redux/User';
import transaction from 'app/redux/Transaction'
import Voting from 'app/components/elements/Voting';
import Reblog from 'app/components/elements/Reblog';
import Tooltip from 'app/components/elements/Tooltip';
import MarkdownViewer from 'app/components/cards/MarkdownViewer';
import ReplyEditor from 'app/components/elements/ReplyEditor';
import ReplyTaskEditor from 'app/components/elements/ReplyTaskEditor';
import {immutableAccessor} from 'app/utils/Accessors';
import extractContent from 'app/utils/ExtractContent';
import FoundationDropdownMenu from 'app/components/elements/FoundationDropdownMenu';
import TagList from 'app/components/elements/TagList';
import Author from 'app/components/elements/Author';
import {Long} from 'bytebuffer'
import {List} from 'immutable'
import {repLog10, parsePayoutAmount} from 'app/utils/ParsersAndFormatters';
import { translate } from 'app/Translator';
import { APP_NAME, APP_NAME_LATIN, APP_URL } from 'config/client_config';
import VotesAndComments from 'app/components/elements/VotesAndComments';

const SubmitStory = ReplyTaskEditor('replyTask')

function TimeAuthorCategory({content, authorRepLog10, showTags}) {

    return (
        <span className="PostFull__time_author_category vcard">
      {translate('by')} <Author account={content.author} />
         

            <Tooltip t={new Date(content.created).toLocaleString()}>
                <Icon name="clock" className="space-right" />
                <span className="TimeAgo"><TimeAgoWrapper date={content.created} /></span>
            </Tooltip>

            
        </span>
     );
}

class PostFull extends React.Component {
    static propTypes = {
        // html props
        /* Show extra options (component is being viewed alone) */
        global: React.PropTypes.object.isRequired,
        post: React.PropTypes.string.isRequired,

        // connector props
        username: React.PropTypes.string,
        unlock: React.PropTypes.func.isRequired,
        deletePost: React.PropTypes.func.isRequired,
        showPromotePost: React.PropTypes.func.isRequired,

        current_program: React.PropTypes.object,
    };

    constructor() {
        super();
        this.state = {};
        this.fbShare = this.fbShare.bind(this);
        this.twitterShare = this.twitterShare.bind(this);
        this.linkedInShare = this.linkedInShare.bind(this);
        this.onShowReply = () => {
            const {state: {showReply, formId}} = this
            this.setState({showReply: !showReply, showEdit: false})
            saveOnShow(formId, !showReply ? 'reply' : null)
        }
        this.onShowEdit = () => {
            const {state: {showEdit, formId}} = this
            this.setState({showEdit: !showEdit, showReply: false})
            saveOnShow(formId, !showEdit ? 'edit' : null)
        }
        this.onDeletePost = () => {
            const {props: {deletePost}} = this
            const content = this.props.global.get('content').get(this.props.post);
            deletePost(content.get('author'), content.get('permlink'))
        }
    }

    componentWillMount() {
        const {post} = this.props
        const formId = `postFull-${post}`
        this.setState({
            formId,
            PostFullReplyEditor: ReplyEditor(formId + '-reply'),
            PostFullEditEditor: ReplyEditor(formId + '-edit')
        })
        if (process.env.BROWSER) {
            let showEditor = localStorage.getItem('showEditor-' + formId)
            if (showEditor) {
                showEditor = JSON.parse(showEditor)
                if (showEditor.type === 'reply') {
                    this.setState({showReply: true})
                }
                if (showEditor.type === 'edit') {
                    this.setState({showEdit: true})
                }
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const names = 'global, post, username'.split(', ')
        return names.findIndex(name => this.props[name] !== nextProps[name]) !== -1 ||
            this.state !== nextState
    }

    fbShare(e) {
        e.preventDefault();
        window.FB.ui({
            method: 'share',
            href: this.share_params.url
        }, () => {});
    }

    twitterShare(e) {
        e.preventDefault();
        const winWidth = 640;
        const winHeight = 320;
        const winTop = (screen.height / 2) - (winWidth / 2);
        const winLeft = (screen.width / 2) - (winHeight / 2);
        const s = this.share_params;
        const q = 'text=' + encodeURIComponent(s.title) + '&url=' + encodeURIComponent(s.url);
        window.open('http://twitter.com/share?' + q, 'Share', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
    }

    linkedInShare(e) {
        e.preventDefault();
        const winWidth = 720;
        const winHeight = 480;
        const winTop = (screen.height / 2) - (winWidth / 2);
        const winLeft = (screen.width / 2) - (winHeight / 2);
        const s = this.share_params;
        const q = 'title=' + encodeURIComponent(s.title) + '&url=' + encodeURIComponent(s.url) + '&source=' + APP_NAME_LATIN + '&mini=true';
        window.open('https://www.linkedin.com/shareArticle?' + q, 'Share', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
    }

    vkShare = (e) => {
        e.preventDefault();
        const winWidth = 720;
        const winHeight = 480;
        const winTop = (screen.height / 2) - (winWidth / 2);
        const winLeft = (screen.width / 2) - (winHeight / 2);
        window.open('https://vk.com/share.php?url=' + this.share_params.url, this.share_params, 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight)
    }

    showPromotePost = () => {
        const post_content = this.props.global.get('content').get(this.props.post);
        if (!post_content) return
        const author = post_content.get('author')
        const permlink = post_content.get('permlink')
        this.props.showPromotePost(author, permlink)
        analytics.track('promote button clicked')
    }

    trackAnalytics = eventType => {
        console.log(eventType)
        analytics.track(eventType)
    }

    render() {
        const {props: {username, post}, state: {PostFullReplyEditor, PostFullEditEditor, formId, showReply, showEdit},
            onShowReply, onShowEdit, onDeletePost} = this
        const post_content = this.props.global.get('content').get(this.props.post);
        // console.log(post_content)
        if (!post_content) return null;
        const p = extractContent(immutableAccessor, post_content);
        const content = post_content.toJS();
        // console.log(content)
        const {author, permlink, parent_author, parent_permlink} = content
        const jsonMetadata = this.state.showReply ? null : p.json_metadata
        // let author_link = '/@' + content.author;
        let link = `/@${content.author}/${content.permlink}`;
        if (content.category) link = `/${content.category}${link}`;

        const content_body = content.body;
        const {category, title, body} = content;
        if (process.env.BROWSER && title) document.title = title + ' — ' + APP_NAME;

        const replyParams = {author, permlink, parent_author, parent_permlink, category, title, body}

        let net_rshares = Long.ZERO
        post_content.get('active_votes', List()).forEach(v => {
            // ? Remove negative votes unless full power -1000 (we had downvoting spam)
            const percent = v.get('percent')
            if(percent < 0 /*&& percent !== -1000*/) return
            net_rshares = net_rshares.add(Long.fromString(String(v.get('rshares'))))
        })
        const showDeleteOption = username === author &&
            post_content.get('replies', List()).size === 0 &&
            net_rshares.compare(Long.ZERO) <= 0

        this.share_params = {
            url: 'https://' + APP_URL + link,
            title: title + ' — ' + APP_NAME,
            desc: p.desc
        };


        
        let fileLink
         if (p.json_metadata.fileAttached) {
            let filename = p.json_metadata.fileAttached;
            filename = String(filename);

            
            let fileicon = 'PostSummary__file-image'
            var fileExt = filename.substring(filename.lastIndexOf(".")+1, filename.length).toLowerCase();

            if (fileExt == 'doc' || fileExt == 'docx') { fileicon = 'PostSummary__file-word '}
            if (fileExt == 'xls' || fileExt == 'xlsx') { fileicon = 'PostSummary__file-excel'}
            if (fileExt == 'pdf') { fileicon = 'PostSummary__file-pdf'}
            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif' || fileExt == 'psd') { fileicon = 'PostSummary__file-image'}


            
            let exactName = filename.split('\\').pop().split('/').pop();

            exactName = decodeURI(exactName)

            exactName = exactName.replace(/[^0-9A-Za-zА-Яа-яЁё _.-]/g, "")

            fileLink = <a href={filename} className={'PostSummary__file ' + fileicon} target="_blank">{exactName}</a>

         }




        const share_menu = [
            {href: '#', onClick: this.vkShare, value: 'VK', icon: 'vk'},
            {href: '#', onClick: this.fbShare, value: 'Facebook', icon: 'facebook'},
            {href: '#', onClick: this.twitterShare, value: 'Twitter', icon: 'twitter'},

        ];
        const Editor = this.state.showReply ? PostFullReplyEditor : PostFullEditEditor
        let renderedEditor = null;
        
        let moneyToEdit ='0'
        if (jsonMetadata && jsonMetadata.daySumm) moneyToEdit = jsonMetadata.daySumm ? jsonMetadata.daySumm : '0'
        
        let fileToEdit = ''
        if (jsonMetadata && jsonMetadata.fileAttached) fileToEdit = jsonMetadata.fileAttached ? jsonMetadata.fileAttached : ''
        
        if (showReply || showEdit) {
            renderedEditor = <div key="editor">
                <Editor {...replyParams} type={this.state.showReply ? 'submit_comment' : 'edit'}
                                         successCallback={() => {
                                                this.setState({showReply: false, showEdit: false})
                                                saveOnShow(formId, null)
                                            }}
                                         onCancel={() => {
                                                this.setState({showReply: false, showEdit: false});
                                                saveOnShow(formId, null)
                                            }}
                                         jsonMetadata={{jsonMetadata}}
                                         money={moneyToEdit}
                                         fileattached={fileToEdit}
                />
            </div>
        }
        const pending_payout = parsePayoutAmount(content.pending_payout_value);
        const total_payout = parsePayoutAmount(content.total_payout_value);
        const high_quality_post = pending_payout + total_payout > 10.0;
        const showEditOption = username === author && post_content.get('mode') != 'archived'
        const authorRepLog10 = repLog10(content.author_reputation)

        let post_header = <h1 className="entry-title">{content.title}</h1>
        if(content.depth > 0) {
            let parent_link = `/${content.category}/@${content.parent_author}/${content.parent_permlink}`;
            let direct_parent_link
            if(content.depth > 1) {
                direct_parent_link = <li>
                    <Link to={parent_link}>
                        {translate('view_the_direct_parent')}
                    </Link>
                </li>
            }
            post_header = <div className="callout">
                <h5>{translate('you_are_viewing_single_comments_thread_from')}:</h5>
                <p>
                    {content.root_title}
                </p>
                <ul>
                    <li>
                        <Link to={content.url}>
                            {translate('view_the_full_context')}
                        </Link>
                    </li>
                    {direct_parent_link}
                </ul>
            </div>
        }

        const archived    = post_content.get('mode') === 'archived'
        const firstPayout = post_content.get('mode') === "first_payout"
        const rootComment = post_content.get('depth') == 0


        console.log('TAGS from FP: ', p.json_metadata.tags)
        



        return (
            <article className="PostFull hentry" itemScope itemType ="http://schema.org/blogPost">
                <div className="float-right"><Voting post={post} flag /></div>
                <div className="PostFull__header">
                    {post_header}
                    <TimeAuthorCategory content={content} authorRepLog10={authorRepLog10}  />
                </div>
                {showEdit ?
                    renderedEditor :
                    <div className="PostFull__body entry-content">
                        <MarkdownViewer formId={formId + '-viewer'} text={content_body} jsonMetadata={jsonMetadata} large highQualityPost={high_quality_post} noImage={!content.stats.pictures} />
                        {fileLink}
                    </div>
                }

               

                {/* {username && firstPayout && rootComment && <div className="float-right">
                    <button className="button hollow tiny" onClick={this.showPromotePost}>{translate('promote')}</button>
                </div>} */}

             {/* <TagList post={content} horizontal /> */}


                <div className="PostFull__footer align-middle">
                    <div className="PostFull_Footer-leftblock">

                        <Voting post={post} /> <VotesAndComments post={post} />
                    </div>
                    <div className="PostFull_Footer-rightblock">
                            {!archived && <Reblog author={author} permlink={permlink} />}

                            <div className="PostFull__reply">
                                {!$STM_Config.read_only_mode && (content.category !== 'bm-tasks') && <a onClick={onShowReply}>{translate('reply')}</a>}
                                {showEditOption && !showEdit && 
                                    
                                    <a onClick={onShowEdit}>{translate('edit')}</a>
                                }
                                {showDeleteOption && !showReply && 
                                 
                                    <a onClick={onDeletePost}>{translate('delete')}</a>
                                }
                            </div>
                            {/* <FoundationDropdownMenu menu={share_menu} onClick={this.trackAnalytics.bind(this, '"share" dropdown menu clicked')} icon="share" label={translate('share')} dropdownPosition="bottom" dropdownAlignment="right" />*/}

                            <div className="PostFull__Share">
                            <span>Поделиться:</span>
                            <a {...share_menu[0]} className="PostFull__share-vk"></a>
                            <a {...share_menu[1]} className="PostFull__share-fb"></a>
                            <a {...share_menu[2]} className="PostFull__share-tw"></a>


                            </div>
                    </div>
                </div>
                <div className="row">
                     <div className="column small-12">
                        {showReply && renderedEditor}
                        {content.category === 'bm-tasks' ? <SubmitStory type="submit_story" taskId={p.json_metadata.tags} taskTitle={p.title} successCallback={() => { window.location = '/created/bm-open' }} /> : ''}
                    </div>
                </div>
            </article>
        )
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => ({
        ...ownProps,
        username: state.user.getIn(['current', 'username']),
        current_program: state.user.get(['currentProgram'])

        
    }),

    // mapDispatchToProps
    (dispatch) => ({
        dispatchSubmit: data => { dispatch(user.actions.usernamePasswordLogin({...data})) },
        clearError: () => { dispatch(user.actions.loginError({error: null})) },
        unlock: () => { dispatch(user.actions.showLogin()) },
        deletePost: (author, permlink) => {
            dispatch(transaction.actions.broadcastOperation({
                type: 'delete_comment',
                operation: {author, permlink},
                confirm: translate('are_you_sure')
            }));
        },
        showPromotePost: (author, permlink) => {
            dispatch({type: 'global/SHOW_DIALOG', payload: {name: 'promotePost', params: {author, permlink}}});
        },
    })
)(PostFull)

const saveOnShow = (formId, type) => {
    if (process.env.BROWSER) {
        if (type)
            localStorage.setItem('showEditor-' + formId, JSON.stringify({type}, null, 0))
        else {
            // console.log('del formId', formId)
            localStorage.removeItem('showEditor-' + formId)
            localStorage.removeItem('replyEditorData-' + formId + '-reply')
            localStorage.removeItem('replyEditorData-' + formId + '-edit')
        }
    }
}
