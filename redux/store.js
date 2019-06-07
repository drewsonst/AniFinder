import { createStore } from 'redux'
import reducer from './reducer'

const DEFAULT_STATE = {
  user: { userId: null, accessToken: null },
  list: { watching: [], planning: [], completed: [], dropped: [] }
}

const store = createStore(reducer, DEFAULT_STATE)

export default store
