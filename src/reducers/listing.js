import { createReducer } from "redux-action"
import axios from 'axios'

export const FETCH = "listing/FETCH"
export const FETCH_SUCCESS = "listing/FETCH_SUCCESS"
export const FETCH_FAILURE = "listing/FETCH_FAILURE"
export const REVIEW = "feedback/REVIEW"
export const REVIEW_FAILURE = "feedback/REVIEW_FAILURE"
export const REVIEW_SUCCESS = "feedback/REVIEW_SUCCESS"

const initialState = {
  data: {},
  error: false,
  message: '',
  list: [],
  pending: false
}

export const fetchListings = () => {
  return dispatch => {
    dispatch({ type: FETCH })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.get('/api/listings').then(response => {
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

export const reviewListing = (slug) => {
  return dispatch => {
    dispatch({ type: REVIEW })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.get(`/api/listings/${slug}/review`)
      .then(response => {
        if (response.data.status !== 'error') {
          dispatch({type: REVIEW_SUCCESS, payload: response.data })
        } else {
          dispatch({type: REVIEW_FAILURE, payload: response.data })
        }
      }).catch(err => {
        dispatch({type: REVIEW_FAILURE, payload: err.data })
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
      message: payload.message
    }
  },
  [REVIEW]: (payload, state) => {
    return {
      ...state,
      pending: true
    }
  },
  [REVIEW_SUCCESS]: (payload, state) => {
    return {
      ...state,
      error: false,
      list: payload,
      message: 'Marked reviewed',
      pending: false,
    }
  },
  [REVIEW_FAILURE]: (payload, state) => {
    return {
      ...state,
      error: true,
      message: 'Review failed!',
      pending: false
    }
  }
}))
