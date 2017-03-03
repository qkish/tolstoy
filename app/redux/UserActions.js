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

export function updateTaskReply({url, status}) {
  return {
    type: 'user/UPDATE_TASK_REPLY',
    payload: {
      url,
      status
    }
  }
}
