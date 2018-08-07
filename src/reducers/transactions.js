import { createReducer } from "redux-action"
import axios from 'axios'
import { push } from 'react-router-redux'
import qs from 'query-string'



export const FETCH = "transactions/FETCH"
export const FETCH_SUCCESS = "transactions/FETCH_SUCCESS"
export const FETCH_FAILURE = "transactions/FETCH_FAILURE"

const initialState = {
  list: [],
  error: false,
  message: '',
  pending: false
}

export const fetchTransactions = () => {
  return dispatch => {
    dispatch({ type: FETCH })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get('/api/transactions').then(response => {
      if (response.data.status === 'error') {
        dispatch({ type: FETCH_FAILURE, payload: response.data })
      } else {
        dispatch({ type: FETCH_SUCCESS, payload: response.data })
      }
    }).catch(err => {
      dispatch({ type: FETCH_FAILURE, payload: err.data })
    })
  }
}


export function filterTransactions(value) {
  return dispatch => {
    dispatch(push({
      search: qs.stringify({ filter: value })
    }))
  }
}

export default createReducer(initialState, ({
  [FETCH]: (payload, state) => {
    return {
      ...state,
      error: false,
      pending: true
    }
  },
  [FETCH_SUCCESS]: (payload, state) => {
    return {
      ...state,
      error: false,
      pending: false,
      list: payload
    }
  },
  [FETCH_FAILURE]: (payload, state) => {
    return {
      ...state,
      error: true,
      pending: false,
      message: payload
    }
  }
}))
