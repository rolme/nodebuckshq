import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import cryptos from './cryptos'
import nodes from './nodes'
import user from './user'
import users from './users'
import withdrawals from './withdrawals'
import transactions from './transactions'
import contacts from './contacts'

export default combineReducers({
  cryptos,
  nodes,
  router: routerReducer,
  user,
  users,
  withdrawals,
  transactions,
  contacts
})
