import { combineReducers } from 'redux'
import { UPDATE_LIST, UPDATE_USER } from './actions'

const DEFAULT_STATE = { watching: [], planning: [], completed: [], dropped: [] }

const listReducer = (state = null, action) => {
  if (action.type === UPDATE_LIST) {
    return ({ ...state, ...action.payload })
  }
  return state
}

const userReducer = (state = null, action) => {
  if (action.type === UPDATE_USER) {
    return ({ userId: action.payload.userId, accessToken: action.payload.accessToken })
  }
  return state
}

const reducer = combineReducers({
  list: listReducer,
  user: userReducer,
})

export default reducer
