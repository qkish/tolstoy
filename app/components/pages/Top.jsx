import React from 'react'

const Top = () => {
    return (
        <div>
            <table>
                <tr>
                    <td>
                        <div>Полк Осипова</div>
                        <div>total</div>
                    </td>
                    <td>
                        <div>Полк Дашкиева</div>
                        <div>total</div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div>Имя total</div>
                        <div>Имя total</div>
                        <div>Имя total</div>
                    </td>
                    <td>
                        <div>Имя total</div>
                        <div>Имя total</div>
                        <div>Имя total</div>
                    </td>
                </tr>
            </table>
        </div>
    )
}

module.exports = {
    path: 'top',
    component: Top
}
