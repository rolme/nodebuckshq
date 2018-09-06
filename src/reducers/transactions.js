import { createReducer } from "redux-action"
import axios from 'axios'

export const FETCH = "transactions/FETCH"
export const FETCH_SUCCESS = "transactions/FETCH_SUCCESS"
export const FETCH_FAILURE = "transactions/FETCH_FAILURE"

const initialState = {
  list: [],
  error: false,
  message: '',
  fetching: false,
}

export const fetchTransactions = (fetchMoreType = 'none', offset = 0) => {
  return dispatch => {
    dispatch({ type: FETCH })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/transactions?${fetchMoreType ? `${fetchMoreType}=${offset}` : ''}`).then(response => {
      if (response.data.status === 'error') {
        dispatch({ type: FETCH_FAILURE, payload: response.data })
      } else {
        dispatch({ type: FETCH_SUCCESS, payload: { data: response.data, fetchMoreType }})
      }
    }).catch(err => {
      dispatch({ type: FETCH_FAILURE, payload: err.data })
    })
  }
}

export default createReducer(initialState, ({
  [FETCH]: (payload, state) => {
    return {
      ...state,
      error: false,
      fetching: true
    }
  },
  [FETCH_SUCCESS]: (payload, state) => {
    let list = state.list
    if(payload.fetchMoreType === 'pending_offset') {
      list.pending = [...state.list.pending, ...payload.data.pending]
    } else if(payload.fetchMoreType === 'processed_offset') {
      list.processed = [...state.list.processed, ...payload.data.processed]
    } else if(payload.fetchMoreType === 'canceled_offset') {
      list.canceled = [...state.list.canceled, ...payload.data.canceled]
    } else {
      list = payload.data
    }

    return {
      ...state,
      error: false,
      fetching: false,
      list: list
    }
  },
  [FETCH_FAILURE]: (payload, state) => {
    return {
      ...state,
      error: true,
      fetching: false,
      message: payload
    }
  }
}))
