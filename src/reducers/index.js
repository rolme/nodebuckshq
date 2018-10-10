import { combineReducers } from 'redux'

import announcements from './announcements'
import contacts from './contacts'
import cryptos from './cryptos'
import nodes from './nodes'
import orders from './orders'
import purchasableStatuses from './purchasable_statuses'
import transactions from './transactions'
import user from './user'
import users from './users'
import withdrawals from './withdrawals'
import counts from './counts'

export default combineReducers({
  announcements,
  contacts,
  counts,
  cryptos,
  nodes,
  orders,
  purchasableStatuses,
  transactions,
  user,
  users,
  withdrawals,
})
