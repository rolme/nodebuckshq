import { createReducer } from "redux-action"
import axios from 'axios'

export const FETCH = "subscribers/FETCH"
export const FETCH_SUCCESS = "subscribers/FETCH_SUCCESS"
export const FETCH_FAILURE = "subscribers/FETCH_FAILURE"

const initialState = {
  data: {},
  error: false,
  message: '',
  list: [],
  pending: false
}

export const fetchSubscribers = () => {
  return dispatch => {
    dispatch({ type: FETCH })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.get('/api/subscriptions').then(response => {
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
