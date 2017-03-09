import React, { Component } from 'react';
import SvgImage from 'app/components/elements/SvgImage';

class ServerError extends Component {

    render() {
        return (
            <div className="float-center" style={{width: '640px', textAlign: 'center'}}>

            <div  style={{width: '400px', textAlign: 'center', padding:'30px', margin:'0 auto'}}>Сеть блокчейн в данный момент недоступна. Причины устраняются. Домашние задания можно будет загрузить завтра до 14:00!</div>
                <a href="/"><SvgImage name="500" width="640px" height="480px" /></a>

            </div>
        );
    }

}

export default ServerError;
