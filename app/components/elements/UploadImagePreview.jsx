import React, { Component } from 'react'
import { translate } from 'app/Translator';

class UploadImagePreview extends Component {
	
	constructor() {
        super()
        this.state = {
        	deleted: false,
        	isShownClassState: '',
        	deleteBtnClassState: '',
        }
    }

	handleOnDelete = event => {

		event.preventDefault()
	
	//this.setState({deleted: true})
	//this.setState({isShownClassState: ''})
	//this.setState({deleteBtnClass: ''})



	}

	

    render () {
    	let imageUrl = this.props.src;
    	
    	let backgroundUrl
    	
    	let stateDeleted = this.state.deleted;
    
    	if (imageUrl && !stateDeleted) {
    		backgroundUrl = {backgroundImage: "url('" + imageUrl + "')"};
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
