import React, { Component } from 'react'
import { translate } from 'app/Translator'

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
  }

  handleOnDelete = event => {
  
    this.props.remove()
  //this.setState({deleted: true})
  //this.setState({isShownClassState: ''})
  //this.setState({deleteBtnClass: ''})
  }

  render () {
    let imageUrl = this.props.src
    let backgroundUrl
    let stateDeleted = this.state.deleted

    let isFile = this.props.isThisFile

    if (imageUrl && !stateDeleted && !isFile) {
      backgroundUrl = {backgroundImage: "url('" + imageUrl + "')"}
      this.state.isShownClassState = 'ReplyEditorShort__uploaded'
      this.state.deleteBtnClass = 'ReplyEditorShort__deleteimage'

    }

       if (imageUrl && !stateDeleted && isFile) {
      
      this.state.isFileShownClassState = 'ReplyEditorShort__file-uploaded'
      this.state.deleteFileBtnState = 'ReplyEditorShort__deletefile'

    }

    let returnVar

    if (!isFile) { returnVar = <div className={this.state.isShownClassState}><div style={backgroundUrl} className={this.state.isShownClassState}>
        <a href="#" className={this.state.deleteBtnClass} onClick={this.handleOnDelete}></a>
        {this.props.uploading ? <div className="ReplyEditorShort__uploading">{translate('uploading')}</div> : ''}
      </div></div>}

     





     if (isFile) {

            returnVar = <div className={this.state.isShownClassState}><div className='ReplyEditorShort__file'>
            {this.props.uploading ? translate('uploading') : translate('file_uploaded')}



            </div>  <a href="#" className={this.state.deleteFileBtnState} onClick={this.handleOnDelete}></a> </div>

     }

    return (returnVar)
  }
}

export default UploadImagePreview
