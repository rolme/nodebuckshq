import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import categories from './categories'
import cryptos from './cryptos'
import feedback from './feedback'
import listing from './listing'
import metricScores from './metric_scores'
import subscribers from './subscribers'
import reports from './reports'
import user from './user'
import users from './users'

export default combineReducers({
  categories,
  cryptos,
  feedback,
  listing,
  metricScores,
  subscribers,
  reports,
  router: routerReducer,
  user,
  users
})
