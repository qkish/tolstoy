export function updateVestingTotal(username, value) {
    return {
        type: 'user/UPDATE_VESTING_TOTAL',
        payload: {
            username,
            value
        }
    }
}

export function updateMonets(username, value) {
    return {
        type: 'user/UPDATE_MONETS',
        payload: {
            username,
            value
        }
    }
}

export function updateMoneyTotal(username, value) {
    return {
        type: 'user/UPDATE_MONEY_TOTAL',
        payload: {
            username,
            value
        }
    }
}

export function updateMoney({username, vesting, money, type}) {
    return {
        type: 'user/UPDATE_MONEY',
        payload: {
            username,
            vesting,
            money,
            type
        }
    }
}
