export const UPDATE_LIST = 'UPDATE_LIST'
export const UPDATE_USER = 'UPDATE_USER'

export const updateList = update => {
  return ({
    type: UPDATE_LIST,
    payload: update,
  })
}

export const updateUser = update => {
  return ({
    type: UPDATE_USER,
    payload: update,
  })
}

