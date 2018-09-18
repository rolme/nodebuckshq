import { combineReducers } from 'redux'

import announcements from './announcements'
import contacts from './contacts'
import cryptos from './cryptos'
import nodes from './nodes'
import orders from './orders'
import transactions from './transactions'
import user from './user'
import users from './users'
import withdrawals from './withdrawals'

export default combineReducers({
  announcements,
  cryptos,
  nodes,
  user,
  users,
  withdrawals,
  transactions,
  contacts,
  orders
})
