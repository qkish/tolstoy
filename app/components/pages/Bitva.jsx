import React from 'react';
import { translate } from 'app/Translator';
import resolveRoute from 'app/ResolveRoute';


class Bitva extends React.Component {
    


    render() {
        return (
            
            <section className="Bitva_section stats">
    <div className="Bitva_container">
        <div className="stats__content">
            <div className="stats__content-top">
                <div className="peter">
                    <div className="name">Петр Осипов</div>
                    <div className="number">
                        48 000 человек
                    </div>
                </div>

                <div className="counter">
                    <div className="title">количество монет</div>

                    <div className="number">
                        0
                    </div>
                    <div className="number second">
                        0
                    </div>
                </div>

                <div className="michael">
                    <div className="name">Михаил Дашкиев</div>
                    <div className="number">
                        50 000 человек
                    </div>
                </div>
            </div>

            <div className="stats__content-live">
                <div className="video">
                    <iframe width="539" height="303"
                            src="https://www.youtube.com/embed/p8eXQDf0qmc?rel=0&showinfo=0" frameborder="0"
                            allowfullscreen></iframe>
                </div>

                <div className="text">
                    <div className="top">идет вебинар</div>
                    <div className="title">
                        Как выбрать то, чем заниматься и сделать на этом первые деньги?
                    </div>

                    <div className="vote">
                        <div className="vote__title">Проголосуйте за лучшего</div>

                        <div className="vote__item">
                            <button className="vote__item-button">Константин</button>
                            <div className="vote__item-likes">73 530</div>
                        </div>
                        <div className="vote__item last">
                            <button className="vote__item-button">Матильда</button>
                            <div className="vote__item-likes">68 323</div>
                        </div>
                    </div>

                    <div className="description">
                       <a href="http://bmtt.ru" target="_blank" className="Bitva__special">Спецпредложение на ЦЕХ</a>
                    </div>
                </div>
            </div>
        </div>

        <div className="stats__widget">
            <a className="stats__widget-item" href="">
                <div className="number">12 215</div>
                <div className="description">
                    монет у вас<br/>
                    Что это?
                </div>
            </a>
            <a className="stats__widget-item" href="">
                <div className="number">114</div>
                <div className="description">
                    Вы в общем<br/>
                    рейтинге
                </div>
            </a>
            <a className="stats__widget-item" href="">
                <div className="number">17</div>
                <div className="description">
                    Вы в рейтинге<br/>
                    сегодняшнего дня
                </div>
            </a>
        </div>
    </div>


</section>







        );
    }
}

module.exports = {
    path: 'bitva',
    component: Bitva
};
