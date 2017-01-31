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
