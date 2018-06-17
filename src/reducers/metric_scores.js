import { createReducer } from "redux-action"
import axios from 'axios'

export const FETCH = "metric_scores/FETCH"
export const FETCH_SUCCESS = "metric_scores/FETCH_SUCCESS"
export const FETCH_FAILURE = "metric_scores/FETCH_FAILURE"
export const FETCH_LIST = "metric_scores/FETCH_LIST"
export const FETCH_LIST_FAILURE = "metric_scores/FETCH_LIST_FAILURE"
export const FETCH_LIST_SUCCESS = "metric_scores/FETCH_LIST_SUCCESS"

const initialState = {
  data: {},
  error: false,
  message: '',
  list: [],
  pending: false
}

export const fetchMetricScores = () => {
  return dispatch => {
    dispatch({ type: FETCH_LIST })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.get('/api/metric_scores').then(response => {
      if (response.data.status === 'error') {
        dispatch({ type: FETCH_LIST_FAILURE, payload: response.data })
      } else {
        dispatch({ type: FETCH_LIST_SUCCESS, payload: response.data })
      }
    }).catch(err => {
      dispatch({ type: FETCH_LIST_FAILURE, payload: err.data })
    })
  }
}

export const fetchListing = (slug) => {
  return dispatch => {
    dispatch({ type: FETCH })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.get(`/api/metric_scores/${slug}`)
      .then(response => {
        if (response.data.status !== 'error') {
          dispatch({type: FETCH_SUCCESS, payload: response.data })
        } else {
          dispatch({type: FETCH_FAILURE, payload: response.data })
        }
      }).catch(err => {
        dispatch({type: FETCH_FAILURE, payload: err.data })
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
      data: payload,
      message: 'Marked reviewed',
      pending: false,
    }
  },
  [FETCH_FAILURE]: (payload, state) => {
    return {
      ...state,
      error: true,
      message: 'Fetch failed!',
      pending: false
    }
  },
  [FETCH_LIST]: (payload, state) => {
    return {
      ...state,
      error: false,
      pending: true
    }
  },
  [FETCH_LIST_SUCCESS]: (payload, state) => {
    return {
      ...state,
      error: false,
      pending: false,
      list: payload
    }
  },
  [FETCH_LIST_FAILURE]: (payload, state) => {
    return {
      ...state,
      error: true,
      pending: false,
      message: payload.message
    }
  }
}))
