import React, { Component } from 'react'
import { translate } from 'app/Translator'

function getYoutubeId(url) {
	var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match && match[2].length == 11) {
  	return match[2];
	} else {
		return ''
	}
}

class UploadImagePreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deleted: false,
      isShownClassState: '',
      deleteBtnClass: '',
      isFileShownState: '',
      deleteFileBtnState:'',
    }
  }

  static propTypes = {
    src: React.PropTypes.string,
    uploading: React.PropTypes.bool,
    remove: React.PropTypes.func,
    isThisFile: React.PropTypes.bool,
    youtube: React.PropTypes.string,
  }

  handleOnDelete = event => {

  	event.preventDefault();

    this.props.remove()
  //this.setState({deleted: true})
  //this.setState({isShownClassState: ''})
  //this.setState({deleteBtnClass: ''})
  }

  render () {
    const isPosting = this.props.posting ? true : false
    let imageUrl = this.props.src
    let backgroundUrl
    let stateDeleted = this.state.deleted
    let youtube = this.props.youtube

    let isFile = this.props.isThisFile



    if (imageUrl && !stateDeleted && !isFile && !youtube) {
      backgroundUrl = {backgroundImage: "url('" + imageUrl + "')"}
      this.state.isShownClassState = 'ReplyEditorShort__uploaded'
      this.state.deleteBtnClass = 'ReplyEditorShort__deleteimage'

    }

       if (imageUrl && !stateDeleted && isFile && !youtube) {

      this.state.isFileShownClassState = 'ReplyEditorShort__file-uploaded'
      this.state.deleteFileBtnState = 'ReplyEditorShort__deletefile'

    }

    let returnVar

    https://img.youtube.com/vi/-guCkycoXPg/0.jpg

    if (!isFile && !youtube) { returnVar = <div className={this.state.isShownClassState}><div style={backgroundUrl} className={this.state.isShownClassState}>
        <a href="#" className={this.state.deleteBtnClass} onClick={this.handleOnDelete}></a>
        {this.props.uploading ? <div className="ReplyEditorShort__uploading">{translate('uploading')}</div> : ''}
      </div></div>}


     if (isFile && !youtube) {
        returnVar = (
            <div className={this.state.isShownClassState}>
                <div className='ReplyEditorShort__file'>
                    {this.props.uploading ? translate('uploading') : translate('file_uploaded')}
                </div>
                {!isPosting ? <a href="#" className={this.state.deleteFileBtnState} onClick={this.handleOnDelete}></a> : null}
            </div>
        )
     }

     if (youtube) {
     	let backgroundYoutubeUrl
     	let youtubeImgLink

     	youtubeImgLink = getYoutubeId(youtube);
     	youtubeImgLink = 'https://img.youtube.com/vi/' + youtubeImgLink + '/0.jpg'

     	backgroundYoutubeUrl = {backgroundImage: "url('" + youtubeImgLink + "')"}

     	this.state.isShownClassState = 'ReplyEditorShort__uploaded'
      	this.state.deleteBtnClass = 'ReplyEditorShort__deleteimage'

     	returnVar = <div className={this.state.isShownClassState}><div style={backgroundYoutubeUrl} className={this.state.isShownClassState}>
		{!isPosting ? <a href="#" className={this.state.deleteBtnClass} onClick={this.handleOnDelete}></a> : null}

      </div></div>

     }

    return (returnVar)
  }
}

export default UploadImagePreview
