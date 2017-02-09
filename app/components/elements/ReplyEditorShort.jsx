import React from 'react';
import {reduxForm} from 'redux-form'
import transaction from 'app/redux/Transaction';
import MarkdownViewer from 'app/components/cards/MarkdownViewer'
import CategorySelector from 'app/components/cards/CategorySelector'
import {validateCategory} from 'app/components/cards/CategorySelector'
import LoadingIndicator from 'app/components/elements/LoadingIndicator'
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate'
import Tooltip from 'app/components/elements/Tooltip'
import sanitizeConfig, {allowedTags} from 'app/utils/SanitizeConfig'
import sanitize from 'sanitize-html'
import HtmlReady from 'shared/HtmlReady'
import g from 'app/redux/GlobalReducer'
import links from 'app/utils/Links'
import {Map, Set} from 'immutable'
import {cleanReduxInput} from 'app/utils/ReduxForms'
import Remarkable from 'remarkable'
import { translate } from 'app/Translator';
import { detransliterate, translateError } from 'app/utils/ParsersAndFormatters';
import {vestingSteem} from 'app/utils/StateFunctions';
import {updateMoney} from 'app/redux/UserActions';
import Upload from 'rc-upload'
import UploadImagePreview from 'app/components/elements/UploadImagePreview'
import Reveal from 'react-foundation-components/lib/global/reveal';
import CloseButton from 'react-foundation-components/lib/global/close-button';


const remarkable = new Remarkable({ html: true, linkify: false })
const RichTextEditor = process.env.BROWSER ? require('react-rte-image').default : null;
const RTE_DEFAULT = false

let saveEditorTimeout

// removes <html></html> wrapper if exists
function getHtml(text) {
    const m = text.match(/<html>([\S\s]*)<\/html>/m);
    return m && m.length === 2 ? m[1] : text;
}

// See also MarkdownViewer render
const isHtmlTest = text =>
    /^<html>/.test(text) ||
    /^<p>[\S\s]*<\/p>/.test(text)


class ReplyEditorShort extends React.Component {

    static propTypes = {

        // html component attributes
        formId: React.PropTypes.string.isRequired, // unique form id for each editor
        author: React.PropTypes.string, // empty or string for top-level post
        permlink: React.PropTypes.string, // new or existing category (default calculated from title)
        parent_author: React.PropTypes.string, // empty or string for top-level post
        parent_permlink: React.PropTypes.string, // new or existing category
        type: React.PropTypes.oneOf(['submit_story', 'submit_comment', 'edit']),
        successCallback: React.PropTypes.func, // indicator that the editor is done and can be hidden
        onCancel: React.PropTypes.func, // hide editor when cancel button clicked
        jsonMetadata: React.PropTypes.object, // An existing comment has its own meta data

        category: React.PropTypes.string, // initial value
        title: React.PropTypes.string, // initial value
        body: React.PropTypes.string, // initial value
        money: React.PropTypes.string,
        filemeta: React.PropTypes.string,

        //redux connect
        reply: React.PropTypes.func.isRequired,
        setMetaLink: React.PropTypes.func.isRequired,
        clearMetaData: React.PropTypes.func.isRequired,
        setMetaData: React.PropTypes.func.isRequired,
        metaLinkData: React.PropTypes.object,
        state: React.PropTypes.object.isRequired,
        hasCategory: React.PropTypes.bool.isRequired,
        isStory: React.PropTypes.bool.isRequired,
        username: React.PropTypes.string,


        // redux-form
        fields: React.PropTypes.object.isRequired,
        handleSubmit: React.PropTypes.func.isRequired,
        resetForm: React.PropTypes.func.isRequired,
        submitting: React.PropTypes.bool.isRequired,
        invalid: React.PropTypes.bool.isRequired,





    }

    static defaultProps = {
        isStory: false,
        author: '',
        parent_author: '',
        parent_permlink: '',
        type: 'submit_comment',
        metaLinkData: Map(),
        category: 'bm-open',
        filemeta: '',
    }

    constructor() {
        super()
        this.state = {
            btnVisible: 'covered',
            textareaState: 'collapsed-area',
            isTextareaEmpty: true,
            fileState:'',
            uploadBtnsClicked: false,
            showYoutube: false,
            youtubeLinkError: 'ReplyEditorShort__youtube-no-error',
            youtubeLink: '',
    }
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'ReplyEditorShort')
        this.onTitleChange = e => {
            const value = e.target.value
            // TODO block links in title (the do not make good permlinks)
            const hasMarkdown = /(?:\*[\w\s]*\*|\#[\w\s]*\#|_[\w\s]*_|~[\w\s]*~|\]\s*\(|\]\s*\[)/.test(value)
            this.setState({ titleWarn: hasMarkdown ? translate('markdown_not_supported') : ''})
            this.props.fields.title.onChange(e)
        }

        this.onMoneyChange = e => {

           const value = e.target.value
            // TODO block links in title (the do not make good permlinks)
            const hasMarkdown = /(?:\*[\w\s]*\*|\#[\w\s]*\#|_[\w\s]*_|~[\w\s]*~|\]\s*\(|\]\s*\[)/.test(value)
            this.setState({ titleWarn: hasMarkdown ? translate('markdown_not_supported') : ''})
            this.props.fields.money.onChange(e)


        }
        this.onCancel = e => {
            if(e) e.preventDefault()
            const {onCancel, resetForm} = this.props
            resetForm()
            this.setAutoVote()
            this.setState({rte_value: RichTextEditor ? RichTextEditor.createEmptyValue() : null})
            if(onCancel) onCancel(e)
        }
        this.onChange = this.onChange.bind(this);
        this.toggleRte = this.toggleRte.bind(this);
        this.focus = (e) => {
            if(e) e.stopPropagation()
            const {postRef, rte, youtubeRef} = this.refs
            if(postRef)
                postRef.focus()
            else {
                if (e.target && e.target.className && e.target.className.indexOf('ReplyEditorShort__body') !== -1)
                    rte._focus();

            }

        }
        this.autoVoteOnChange = () => {
            const {autoVote} = this.props.fields
            const key = 'replyEditorData-autoVote-story'
            localStorage.setItem(key, !autoVote.value)
            autoVote.onChange(!autoVote.value)
        }
    }
    componentWillMount() {
        const {setMetaData, formId, jsonMetadata} = this.props
        if(process.env.BROWSER) {
            let editorData = localStorage.getItem('replyEditorData-' + formId)
            let rte_value = RichTextEditor.createEmptyValue();
            if(editorData) {
                editorData = JSON.parse(editorData)
                if(editorData.formId === formId) {
                    const {fields: {category, title, body, money}} = this.props
                    if(category) category.onChange(editorData.category)
                    if(title) title.onChange(editorData.title)
                    if(money) money.onChange(editorData.money)
                    if (editorData.body) {
                        body.onChange(editorData.body)


                        // const html = getHtml(editorData.body)
                        // console.log('createValueFromString mnt1', html);
                        // this.state.rte_value = RichTextEditor.createValueFromString(html, 'html')
                        // console.log('createValueFromString mnt1 done');
                    }
                }
            }
            this.setAutoVote()
            const {body} = this.props.fields
            let rte = false
            if(process.env.BROWSER) {
                const {isStory} = this.props
                if(isStory) {
                        rte = JSON.parse(localStorage.getItem('replyEditorData-rte') || RTE_DEFAULT);
                }
            }
            if (RichTextEditor) {
                if (body.value) {
                    if (isHtmlTest(body.value)) {
                        rte = true;
                        const html = getHtml(body.value);
                        rte_value = RichTextEditor.createValueFromString(html, 'html')
                    } else {
                        rte = false;
                        // console.log('createValueFromString mnt3');
                        // rte_value = RichTextEditor.createValueFromString(body.initialValue, 'html');
                        // console.log('createValueFromString mnt3 done');
                    }
                }
            }
            this.setState({rte, rte_value})
        }
        setMetaData(formId, jsonMetadata)
    }
    componentDidMount() {
        // focus
        setTimeout(() => {
            if (this.props.isStory) {this.refs.titleRef.focus(); }
            else if (this.refs.postRef) this.refs.postRef.focus();
            else if (this.refs.moneyRef) this.refs.moneyRef.focus();
            else if (this.refs.rte) this.refs.rte._focus()
        }, 300)
    }
    componentWillReceiveProps(nextProps) {
        {
            const {fields: {body}} = nextProps
            let markdownViewerText = ''
            markdownViewerText += body.value
            this.setState({ markdownViewerText })
        }
        if(process.env.BROWSER) {
            const tp = this.props.fields
            const np = nextProps.fields
            if(tp.body.value !== np.body.value ||
                (np.category && tp.category.value !== np.category.value) ||
                (np.title && tp.title.value !== np.title.value) ||
                (np.money && tp.money.value !== np.money.value) ||
                (np.filemeta && tp.filemeta.value !== np.filemeta.value))
             { // also prevents saving after parent deletes this information
                const {fields: {category, title, body, money, filemeta}, formId} = nextProps
                const data = {formId}
                data.title = title ? title.value : undefined
                data.category = category ? category.value : undefined
                data.body = body.value
                data.money = money ? money.value : undefined
                data.filemeta = filemeta ? filemeta.value : undefined

                clearTimeout(saveEditorTimeout)
                saveEditorTimeout = setTimeout(() => {
                    // console.log('save formId', formId)
                    localStorage.setItem('replyEditorData-' + formId, JSON.stringify(data, null, 0))
                }, 350)
            }
            if(tp.body.value !== np.body.value) {
                if(this.state.rte) {
                    const {body} = nextProps.fields
                    const html = getHtml(body.value)
                    this.state.rte_value = RichTextEditor.createValueFromString(html, 'html');
                }
            }
        }
    }
    componentWillUnmount() {
        const {clearMetaData, formId} = this.props
        clearMetaData(formId)
    }
    onChange(rte_value) {
        this.setState({rte_value})


        let html = rte_value.toString('html');
        if (html === '<p><br></p>') html = '';
        else if (html.indexOf('<html>') !== 0) html = `<html>\n${html}\n</html>`;
        const body = this.props.fields.body
        body.onChange(html);


    }

    setAutoVote() {
        const {isStory} = this.props
        if(isStory) {
            const {autoVote} = this.props.fields
            const key = 'replyEditorData-autoVote-story'
            const autoVoteDefault = JSON.parse(localStorage.getItem(key) || false)
            autoVote.onChange(autoVoteDefault)
        }
    }
    testForMetaLink(bodyText) {
        if(!bodyText) return
        // Check for links but not on every character (you'll get a lot of invalid links while typing)
        // Save the link in metaLink when it is complete.
        const {markdownViewerText} = this.state
        const oldLen = markdownViewerText ? markdownViewerText.length : 0
        const newLen = bodyText.length
        const bodyChanged = oldLen !== newLen
        if(!bodyChanged) return
        const match = bodyText.match(links.any)
        if(match) {
            const link = match[0]
            // body suddenly increases by more than one char
            const bodyPasted = oldLen + 1 < newLen
            const {formId, setMetaLink} = this.props
            if(bodyPasted)
                // pasted link is complete
                setMetaLink(formId, link)
            else {
                // user is typing
                if(this.state.typingLink === link) {
                    // the link stopped changing
                    setMetaLink(formId, link)
                } else
                    this.setState({typingLink: link})
            }
        }
    }
    toggleRte(e) {
        e.preventDefault();
        const state = {rte: !this.state.rte};
        if (state.rte) {
            state.rte_value = RichTextEditor.createValueFromString(this.props.fields.body.value, 'html');
        }
        this.setState(state);
        localStorage.setItem('replyEditorData-rte', !this.state.rte)
    }

    toggleAllSteemPower = () => {
        this.setState({allSteemPower: !this.state.allSteemPower})
    }

    handleOnFocus = event => {
        this.refs.postRef.focus()
        this.setState({btnVisible: 'uncovered'})
        this.setState({textareaState: 'expanded-area'})
    }
    handleOnBlur = event => {
        let bodynow = this.props.fields.body.value
        let titlenow = this.props.fields.title.value
        let moneynow = this.props.fields.money.value
        let uploadClicked = this.state.uploadBtnsClicked

        if (bodynow == '' && titlenow == '' && !moneynow && !uploadClicked) {
            this.setState({btnVisible: 'covered'})
            this.setState({textareaState: 'collapsed-area'})
            this.setState({uploadBtnsClicked: false})


        }
    }

    handleOnTitleFocus = event => {
        this.refs.titleRef.focus()
        this.setState({btnVisible: 'uncovered'})
        this.setState({textareaState: 'expanded-area'})
    }

    handleOnTitleBlur = event => {
        let bodynow = this.props.fields.body.value
        let titlenow = this.props.fields.title.value
        let moneynow = this.props.fields.money.value
        let uploadClicked = this.state.uploadBtnsClicked

        if (bodynow == '' && titlenow == '' && !moneynow && !uploadClicked) {
            this.setState({btnVisible: 'covered'})
            this.setState({textareaState: 'collapsed-area'})
            this.setState({uploadBtnsClicked: false})
        }
    }

    handleOnMoneyFocus = event => {
        this.refs.moneyRef.focus()
        this.setState({btnVisible: 'uncovered'})
        this.setState({textareaState: 'expanded-area'})
    }

    handleOnMoneyBlur = event => {
        let bodynow = this.props.fields.body.value
        let titlenow = this.props.fields.title.value
        let moneynow = this.props.fields.money.value
        let uploadClicked = this.state.uploadBtnsClicked

        if (bodynow == '' && titlenow == '' && !moneynow && !uploadClicked) {
            this.setState({btnVisible: 'covered'})
            this.setState({textareaState: 'collapsed-area'})
            this.setState({uploadBtnsClicked: false})
        }

    }

    handleOnButtonsFocus = event => {

        this.setState({uploadBtnsClicked: true})
        this.setState({btnVisible: 'uncovered'})
        this.setState({textareaState: 'expanded-area'})
    }

    hideYoutube = event => {
        this.setState({showYoutube: false})
    }

    insertYoutube = event => {

        event.preventDefault()

        let currentYoutubeLink = this.refs.youtubeRef.value;

        //if ()
        var pattern = /^((http|https|ftp):\/\/(youtube.com|www.youtube.com)\/)/;

        if(pattern.test(currentYoutubeLink)) {
        this.setState({youtubeLink: currentYoutubeLink})
        this.setState({youtubeLinkError: 'ReplyEditorShort__youtube-no-error'})
        this.setState({showYoutube: false})
        this.setState({showPreview: true})
         } else {

        this.setState({youtubeLinkError: 'ReplyEditorShort__youtube-error'})

         }

    }


    handleUploadYoutube = event => {
        event.preventDefault()
        this.setState({showYoutube: true})
        // focus
        setTimeout(() => {
            this.refs.youtubeRef.focus();
        }, 300)

    }



    render() {
        // NOTE title, category, and body are UI form fields ..
        const originalPost = {
            title: this.props.title,
            category: this.props.category,
            body: this.props.body,
            money: this.props.money,
            filemeta: this.state.fileState,
        }




        const {onCancel, autoVoteOnChange} = this
        const {title, category, body, money, autoVote} = this.props.fields
        const {
            reply, username, hasCategory, isStory, formId, noImage,
            author, permlink, parent_author, parent_permlink, type, jsonMetadata, metaLinkData,
            state, successCallback, handleSubmit, submitting, invalid, resetForm //lastComment,
        } = this.props

        let {filemeta} = this.props.fields
        const {postError, markdownViewerText, loading, titleWarn, rte, allSteemPower} = this.state
        const {onTitleChange, onMoneyChange} = this
        const errorCallback = estr => { this.setState({ postError: estr, loading: false }) }
        const successCallbackWrapper = (...args) => {
            this.setState({ loading: false })
            resetForm()
            if (successCallback) successCallback(args)
        }
        const isEdit = type === 'edit'
        // Be careful, autoVote can reset curation rewards.  Never autoVote on edit..
        const autoVoteValue = !isEdit && autoVote.value
        const replyParams = {
            author, permlink, parent_author, parent_permlink, type, state, originalPost,
            jsonMetadata, metaLinkData, autoVote: autoVoteValue, allSteemPower,
            successCallback: successCallbackWrapper, errorCallback
        }
        const postLabel = username ? <Tooltip t={translate('post_as') + ' “' + username + '”'}>{translate('post')}</Tooltip> : translate('post')
        const hasTitleError = title && title.touched && title.error
        let titleError = null
        // The Required title error (triggered onBlur) can shift the form making it hard to click on things..
        if ((hasTitleError && (title.error !== 'Required' || body.value !== '')) || titleWarn) {
            titleError = <div className={hasTitleError ? 'error' : 'warning'}>
                {hasTitleError ? title.error : titleWarn}&nbsp;
            </div>
        }
        let isHtml = false;
        let isMarkdown = false;
        if (body.value) {
            isMarkdown = !isHtmlTest(body.value);
            isHtml = !isMarkdown;
        }

        const vframe_class = isStory ? 'vframe-short' : '';
        const vframe_section_class = isStory ? 'vframe__section' : '';
        const vframe_section_shrink_class = isStory ? 'vframe__section--shrink' : '';

        let btnSubmit = this.state.btnVisible;
        let areaState = this.state.textareaState;
        let isTextareaEmptyVal = this.state.isTextareaEmpty;

        let titleVisible

        if (areaState == 'expanded-area') {
            titleVisible = true
        } else {
            titleVisible = false
        }

        let loadingHide = loading ? 'ReplyEditorShort__hide' : ''



        // Youtube Insert Modal
        let youtubeError = this.state.youtubeLinkError;

        let show_youtube_insert = <div className="">
                                    <CloseButton onClick={this.hideYoutube} />
                                    <h5>Вставьте ссылку на видео Youtube</h5>
                                    <form><input type="text" className="ReplyEditorShort__input-youtube" name="youtube" ref="youtubeRef"/>
                                    <div className={youtubeError}>Ошибка, неверная ссылка</div>
                                    <input type="submit" className="ReplyEditorShort__submit-youtube ReplyEditorShort__buttons-submit button" value="Вставить"  onClick={this.insertYoutube}/>
                                    <input type="button" className="ReplyEditorShort__submit-youtube secondary hollow button no-border ReplyEditorShort__buttons-submit ReplyEditor__buttons-cancel" value="Отмена" onClick={this.hideYoutube}/>

                                    </form>

                                 </div>
        let show_youtube_bool = this.state.showYoutube;

        let youtubeModal = <Reveal show={show_youtube_bool}>{show_youtube_insert}</Reveal>




        return (
            <div className="ReplyEditor row">
                <div className="column small-12">
                    <form className={vframe_class}

                        onSubmit={handleSubmit(data => {
                            const loadingCallback = () => this.setState({loading: true, postError: undefined})
                            let imageAdded 
                            imageAdded = this.state.uploadedImage ? '\n' + this.state.uploadedImage : '';

                            let youtubeAdded
                            youtubeAdded = this.state.youtubeLink ? '\n' + this.state.youtubeLink : '';
                            reply({ ...Object.assign({}, data, {body: `${data.body} ${imageAdded || ''} ${youtubeAdded || ''}`}), ...replyParams, loadingCallback })
                        })}
                        onChange={() => {this.setState({ postError: null })}}
                    >
                        <div className={vframe_section_shrink_class}>
                            {isStory && <span>
                                <input type="text"  {...cleanReduxInput(title)} onChange={onTitleChange} onTouchStart={this.handleOnTitleFocus} disabled={loading} placeholder={translate('reporttitle')} autoComplete="off" ref="titleRef" tabIndex={1} onMouseDown={this.handleOnTitleFocus} onBlur={this.handleOnTitleBlur} className={titleVisible ? 'ReplyEditorShort__titleVisible' : 'ReplyEditorShort__titleInvisible'} />
                            </span>}
                        </div>

                        <div className={'ReplyEditorShort__body ' + (rte ? `rte ${vframe_section_class}` : vframe_section_shrink_class)} onClick={this.focus}>

                                <textarea {...cleanReduxInput(body)} disabled={loading} rows={isStory ? 1 : 3} placeholder={translate(isStory ? 'write_your_story' : 'reply')} autoComplete="off" ref="postRef" tabIndex={2} onMouseDown={this.handleOnFocus} onTouchStart={this.handleOnFocus} onBlur={this.handleOnBlur} className={areaState}  />
                     </div>
                      <input type="number" {...cleanReduxInput(money)} onChange={onMoneyChange} disabled={loading} placeholder={translate('money_for_day')} autoComplete="off" ref="moneyRef" tabIndex={7} onMouseDown={this.handleOnMoneyFocus} onTouchStart={this.handleOnMoneyFocus} onBlur={this.handleOnMoneyBlur} className={titleVisible ? 'ReplyEditorShort__moneyVisible' : 'ReplyEditorShort__moneyInvisible'} />
                      <input type="hidden" {...cleanReduxInput(filemeta)} value={this.state.fileState}/>
                        <div className={vframe_section_shrink_class}>
                            <div className="error">{body.touched && body.error && body.error !== 'Required' && body.error}</div>
                        </div>


                            {hasCategory && <span>
                                <CategorySelector {...category} disabled={loading} isEdit={isEdit} tabIndex={3} />

                            </span>}

                        <div className={vframe_section_shrink_class}>
                            {postError && <div className="error">{translateError(postError)}</div>}
                        </div>

                        {this.state.showPreview ? (
                            <UploadImagePreview
                                uploading={this.state.uploading}
                                src={this.state.UploadImagePreviewPath}
                                isThisFile={this.state.isFile}
                                youtube={this.state.youtubeLink}
                                remove={() => { this.setState({ showPreview: false, uploadBtnsClicked: false }); }} />
                        ) : null}

                        <div className={(vframe_section_shrink_class) + " " + (btnSubmit)}>
                            {!loading && <button type="submit" className={"button ReplyEditorShort__buttons-submit " + (btnSubmit)} disabled={submitting || invalid} tabIndex={4}>{isEdit ? translate('update_post') : postLabel}</button>}
                            {loading && <span><br /><LoadingIndicator type="circle" /></span>}
                            &nbsp; {!loading && this.props.onCancel &&
                                <button type="button" className="secondary hollow button no-border ReplyEditorShort__buttons-submit " tabIndex={5} onClick={(e) => {e.preventDefault(); onCancel()}}>{translate("cancel")}</button>
                            }

                            <div className={'ReplyEditorShort__buttons-add ' + loadingHide}  onMouseDown={this.handleOnButtonsFocus} onTouchStart={this.handleOnButtonsFocus} onClick={this.handleOnButtonsFocus}>
                            <ul>
                                <li>
                                    <Upload
                                        action='/api/v1/upload'
                                        data={{ type: 'image' }}
                                        onStart={file => {
                                            const reader = new FileReader()
                                            reader.onloadend = () => {
                                                this.setState({
                                                    UploadImagePreviewPath: reader.result,
                                                    uploading: true,
                                                    showPreview: true,
                                                    isFile: false,
                                                })
                                            }
                                            reader.readAsDataURL(file)
                                        }}
                                        onError={err => {
                                            console.error(err)
                                            this.setState({
                                                uploading: false
                                            })
                                        }}
                                        onSuccess={res => {
                                            this.setState({
                                                uploadedImage: res.image,
                                                uploading: false
                                            })
                                        }}>
                                            <a href="#" className="ReplyEditorShort__buttons-add-image"></a>
                                    </Upload>
                                </li>
                                <li><a href="#" className="ReplyEditorShort__buttons-add-video" onClick={this.handleUploadYoutube}></a></li>
                                <li>
                                    <Upload
                                        action='/api/v1/upload'
                                        data={{ type: 'attachment' }}

                                        onStart={file => {
                                            const reader = new FileReader()
                                            reader.onloadend = () => {
                                                this.setState({
                                                    UploadImagePreviewPath: reader.result,
                                                    uploading: true,
                                                    showPreview: true,
                                                    isFile: true,
                                                })
                                            }
                                            reader.readAsDataURL(file)
                                        }}
                                        onError={err => {
                                            console.error(err)
                                            this.setState({
                                                uploading: false
                                            })
                                        }}
                                        onSuccess={res => {
                                            this.setState({
                                                fileState: res.image,
                                              
                                                uploading: false
                                            })
                                        }}>

                                        <a href="#" className="ReplyEditorShort__buttons-add-file"></a>
                                    </Upload>
                                </li>
                            </ul>
                            </div>
                            {youtubeModal}


                            {isStory && !isEdit && <div className="float-right">

                                <input type="hidden" onChange={this.toggleAllSteemPower} checked={allSteemPower} />

                                <input type="hidden" {...cleanReduxInput(autoVote)} onChange={autoVoteOnChange} />
                            </div>}
                        </div>

                    </form>
                </div>
            </div>
        )
    }
}

export default formId => reduxForm(
    // config
    {form: formId},
    // https://github.com/erikras/redux-form/issues/949
    // Warning: Failed propType: Required prop `form` was not specified in `ReduxFormConnector(ReplyEditor)`. Check the render method of `ConnectedForm`.

    // mapStateToProps
    (state, ownProps) => {
        // const current = state.user.get('current')||Map()
        const username = state.user.getIn(['current', 'username'])
        const fields = ['body', 'autoVote']
        let {type, parent_author, jsonMetadata} = ownProps
        const isStory =   /submit_story/.test(type) || (
            /edit/.test(type) && parent_author === ''
        )
        const hasCategory = isStory // /submit_story/.test(type)



        if (isStory) fields.push('title')
        if (isStory) fields.push('money')
        if (isStory) fields.push('filemeta')
        if (hasCategory) fields.push('category')


        const isEdit = type === 'edit'
        const maxKb = isStory ? 100 : 16
        const validate = values => ({
           title: isStory && (
           !values.title || values.title.trim() === '' ? translate('required') :
           values.title.length > 255 ? translate('shorten_title') :
           null
           ),
           category: null,
           money: null,
           filemeta: null,
           //hasCategory,
            body: !values.body ? translate('required') :
                  values.body.length > maxKb * 1024 ? translate('exceeds_maximum_length', { maxKb }) : null,
        })
        let {category, title, body, money, filemeta} = ownProps


        if (/submit_/.test(type)) title = body = money = filemeta = ''

        if(hasCategory && jsonMetadata && jsonMetadata.tags) {
            // detransletirate values to avoid disabled 'update post' button on load
            const tags = jsonMetadata.tags.map(tag => detransliterate(tag))
            category = Set([detransliterate(category), ...tags]).join(' ')
        }

        const metaLinkData = state.global.getIn(['metaLinkData', formId])

        const ret = {
            ...ownProps,
            fields, validate, isStory, hasCategory, username,
            initialValues: {title, body, category, money, filemeta}, state,
            // lastComment: current.get('lastComment'),
            formId,
            metaLinkData,
        }

        return ret
    },

    // mapDispatchToProps
    (dispatch, ownProps) => ({
        setMetaLink: (/*id, link*/) => {
            // TODO
            // dispatch(g.actions.requestMeta({id, link}))
        },
        clearMetaData: (id) => {
            dispatch(g.actions.clearMeta({id}))
        },
        setMetaData: (id, jsonMetadata) => {
            dispatch(g.actions.setMetaData({id, meta: jsonMetadata ? jsonMetadata.steem : null}))
        },
        reply: ({category, title, body, money, filemeta, author, permlink, parent_author, parent_permlink,
            type, originalPost, autoVote = false, allSteemPower = false,
            state, jsonMetadata, /*metaLinkData,*/
            successCallback, errorCallback, loadingCallback
        }) => {
            // const post = state.global.getIn(['content', author + '/' + permlink])
            const username = state.user.getIn(['current', 'username'])
            const gprops = state.global.getIn(['props']).toJS();
            const account = state.global.getIn(['accounts', username]);
            const vesting = vestingSteem(account.toJS(), gprops).toFixed(2)

            if (type === 'submit_story' || type === 'submit_comment') {
                dispatch(updateMoney({username, vesting, money, type}))
            }


            let placedFile = originalPost.filemeta;

            // Parse categories:
            // if category string starts with russian symbol, add 'ru-' prefix to it
            // when transletirate it
            // This is needed to be able to detransletirate it back to russian in future (to show russian categories to user)
            // (all of this is needed because blockchain does not allow russian symbols in category)
            if (category) {
                category = category.split(' ')
                                    .map(item => /^[а-яё]/.test(item) ? 'ru--' + detransliterate(item, true) : item)
                                    .join(' ')
                                    .trim()
            }

            if (category) {console.log(category);}else{console.log(author);}
            // Wire up the current and parent props for either an Edit or a Submit (new post)
            //'submit_story', 'submit_comment', 'edit'




            const linkProps =
                /^submit_/.test(type) ? { // submit new
                    parent_author: author,
                    parent_permlink: permlink,
                    author: username
                    // permlink,  assigned in TransactionSaga
                } :
                // edit existing
                /^edit$/.test(type) ? {author, permlink, parent_author, parent_permlink}
                : null

            if (!linkProps) throw new Error('Unknown type: ' + type)

            const formCategories = Set(category ? category.replace(/#/g,"").split(/ +/) : [])
            const rootCategory = originalPost && originalPost.category ?
                originalPost.category : formCategories.first()
            const rootTag = /^[-a-z\d]+$/.test(rootCategory) ? rootCategory : null

            let rtags
            {
                const isHtml = /^<html>([\S\s]*)<\/html>$/.test(body)
                const htmlText = isHtml ? body : remarkable.render(body)
                rtags = HtmlReady(htmlText, {mutate: false})
            }

            allowedTags.forEach(tag => {rtags.htmltags.delete(tag)})
            rtags.htmltags.delete('html')
            if(rtags.htmltags.size) {
                errorCallback(translate('please_remove_following_html_elements') + ' ' + Array(...rtags.htmltags).join(', '))
                return
            }

            let allCategories = Set([...formCategories.toJS(), ...rtags.hashtags])
            if(rootTag) allCategories = allCategories.add(rootTag)

            // merge
            const meta = /edit/.test(type) ? jsonMetadata : {}
            if(allCategories.size) meta.tags = allCategories.toJS(); else delete meta.tags
            if(rtags.usertags.size) meta.users = rtags.usertags; else delete meta.users
            if(rtags.images.size) meta.image = rtags.images; else delete meta.image
            if(rtags.links.size) meta.links = rtags.links; else delete meta.links

            if(money) meta.daySumm = money; else delete meta.daySumm
            if(placedFile) meta.fileAttached = placedFile; else delete meta.fileAttached

          






            // const cp = prop => { if(metaLinkData.has(prop)) json_metadata.steem[prop] = metaLinkData.get(prop) }
            // cp('link')
            // cp('image')
            // cp('description')
            // if(Object.keys(json_metadata.steem).length === 0) json_metadata = {}// keep json_metadata minimal
            const sanitizeErrors = []
            sanitize(body, sanitizeConfig({sanitizeErrors}))
            if(sanitizeErrors.length) {
                errorCallback(sanitizeErrors.join('.  '))
                return
            }

            if(meta.tags.length > 5) {
                const includingCategory = /edit/.test(type) ? translate('including_the_category', {rootCategory: detransliterate(rootCategory)}) : ''
                errorCallback(translate('use_limited_amount_of_tags', {tagsLength: meta.tags.length, includingCategory}))
                return
            }

            const __config = {originalPost, autoVote}

            if(allSteemPower) {
                __config.comment_options = {
                    percent_steem_dollars: 0, // 10000 === 100%
                }
            }

            console.log('SUMBIT ', meta);
            const operation = {
                ...linkProps,
                category: rootCategory, title, body,
                json_metadata: meta,
                __config
            }
            // loadingCallback starts the loading indicator
            loadingCallback()
            dispatch(transaction.actions.broadcastOperation({
                type: 'comment',
                operation,
                errorCallback,
                successCallback,
            }))
        },
    })
)(ReplyEditorShort)
