import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import cryptos from './cryptos'
import user from './user'
import users from './users'

export default combineReducers({
  cryptos,
  router: routerReducer,
  user,
  users
})
