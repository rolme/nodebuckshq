import { createReducer } from "redux-action"
import axios from 'axios'

export const CREATE = "feedback/CREATE"
export const CREATE_FAILURE = "feedback/CREATE_FAILURE"
export const CREATE_SUCCESS = "feedback/CREATE_SUCCESS"
export const FETCH = "feedback/FETCH"
export const FETCH_FAILURE = "feedback/FETCH_FAILURE"
export const FETCH_SUCCESS = "feedback/FETCH_SUCCESS"
export const REVIEW = "feedback/REVIEW"
export const REVIEW_FAILURE = "feedback/REVIEW_FAILURE"
export const REVIEW_SUCCESS = "feedback/REVIEW_SUCCESS"

const initialState = {
  list: [],
  error: '',
  message: '',
  pending: false
}

export const createFeedback = (values) => {
  return dispatch => {
    dispatch({ type: CREATE })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.post('/api/feedback/', values)
      .then(response => {
        if (response.data.status !== 'error') {
          dispatch({type: CREATE_SUCCESS, payload: response.data })
        } else {
          dispatch({type: CREATE_FAILURE, payload: response.data })
        }
      }).catch(err => {
        dispatch({type: CREATE_FAILURE, payload: err.data })
      })
  }
}

export const fetchFeedback = (values) => {
  return dispatch => {
    dispatch({ type: FETCH })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.get('/api/feedback/')
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

export const reviewFeedback = (slug) => {
  return dispatch => {
    dispatch({ type: REVIEW })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.get(`/api/feedback/${slug}/review`)
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
  [CREATE]: (payload, state) => {
    return {
      ...state,
      error: '',
      message: '',
      pending: true
    }
  },
  [CREATE_SUCCESS]: (payload, state) => {
    let newList = state.list
    newList.push(payload)
    return {
      ...state,
      error: '',
      list: newList,
      message: 'Thank you for your feedback!',
      pending: false
    }
  },
  [CREATE_FAILURE]: (payload, state) => {
    return {
      ...state,
      error: payload.messages,
      message: '',
      pending: false
    }
  },
  [FETCH]: (payload, state) => {
    return {
      ...state,
      pending: true
    }
  },
  [FETCH_SUCCESS]: (payload, state) => {
    return {
      ...state,
      error: '',
      list: payload,
      message: '',
      pending: false,
    }
  },
  [FETCH_FAILURE]: (payload, state) => {
    return {
      ...state,
      error: payload.messages,
      message: 'Fetch failed!',
      pending: false
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
      error: '',
      list: payload,
      message: 'Marked reviewed',
      pending: false,
    }
  },
  [REVIEW_FAILURE]: (payload, state) => {
    return {
      ...state,
      error: payload.messages,
      message: 'Review failed!',
      pending: false
    }
  }
}))
