import React, { Component } from 'react'
import { translate } from 'app/Translator'

class UploadImagePreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deleted: false,
      isShownClassState: '',
      deleteBtnClassState: ''
    }
  }

  static propTypes = {
    src: React.PropTypes.string,
    uploading: React.PropTypes.bool,
    remove: React.PropTypes.func
  }

  handleOnDelete = event => {
    console.log('TRY TO DELETE')
    this.props.remove()
  //this.setState({deleted: true})
  //this.setState({isShownClassState: ''})
  //this.setState({deleteBtnClass: ''})
  }

  render () {
    let imageUrl = this.props.src
    let backgroundUrl
    let stateDeleted = this.state.deleted

    if (imageUrl && !stateDeleted) {
      backgroundUrl = {backgroundImage: "url('" + imageUrl + "')"}
      this.state.isShownClassState = 'ReplyEditorShort__uploaded'
      this.state.deleteBtnClass = 'ReplyEditorShort__deleteimage'
    }

    return (
      <div style={backgroundUrl} className={this.state.isShownClassState}>
        <a href="#" className={this.state.deleteBtnClass} onClick={this.handleOnDelete}></a>
        {this.props.uploading ? <div className="ReplyEditorShort__uploading">{translate('uploading')}</div> : ''}
      </div>
    )
  }
}

export default UploadImagePreview
