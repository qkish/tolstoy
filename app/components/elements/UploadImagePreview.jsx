import React, { Component } from 'react'

class UploadImagePreview extends Component {
    render () {
        return (
            <div style={{position: 'relative'}}>
                <img style={{ width: '200px' }} src={this.props.src} />
                {this.props.uploading ? <div style={{position: 'absolute', top: '20px', left: '20px', color: '#fff'}}>ЗАГРУЗКА</div> : ''}
            </div>
        )
    }
}

export default UploadImagePreview
