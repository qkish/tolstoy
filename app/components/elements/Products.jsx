import React, {Component, PropTypes} from 'react';



export default class Products extends Component {
	// you can pass either user object, or username string

  constructor(props) {
        super(props);
        this.state = {};
      
    }

    static defaultProps = {
		
	}

	render() {

		
		 


		
		return 	<div className="Products">
    <a className="Products__schedule-title" target="_self" href="http://molodost.bz/shop/">
        Ближайшие программы
       
    </a>

    <div className="Products__schedule-list">
        <a className="Products__link" target="_self"  href="http://molodost.bz/thefirst/">
            <div className="Products__date">
                <div className="Products__date-day">18</div>
                <div className="Products__date-month">фев</div>
            </div>

            <div className="Products__text">
                <div className="Products__title">Интенсив</div>
                <div className="Products__description">Старт и развитие бизнеса</div>
               
            </div>
        </a>

        <a className="Products__link" href="http://molodost.bz/coaching/">
            <div className="Products__date">
                <div className="Products__date-day">25</div>
                <div className="Products__date-month">фев</div>
            </div>

            <div className="Products__text">
                <div className="Products__title">Цех – главный продукт БМ</div>
                <div className="Products__description">Двухмесячная программа</div>
               
            </div>
        </a>

        <a  className="Products__link" target="_self" href="http://molodost.bz/million_coaching/">
            <div className="Products__date">
                <div className="Products__date-day">28</div>
                <div className="Products__date-month">фев</div>
            </div>

            <div className="Products__text">
                <div className="Products__title">Миллион за сто</div>
                <div className="Products__description">Главная ВИП программа</div>
               
            </div>
        </a>
    </div>
</div>
	}
}

