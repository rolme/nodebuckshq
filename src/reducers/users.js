import { createReducer } from "redux-action"
import axios from 'axios'

export const FETCH = "users/FETCH"
export const FETCH_SUCCESS = "users/FETCH_SUCCESS"
export const FETCH_FAILURE = "users/FETCH_FAILURE"
export const UPDATE_USER_ID_VERIFICATION_STATUS = 'user/UPDATE_USER_ID_VERIFICATION_STATUS'
export const UPDATE_USER_ID_VERIFICATION_STATUS_SUCCESS = 'user/UPDATE_USER_ID_VERIFICATION_STATUS_SUCCESS'
export const UPDATE_USER_ID_VERIFICATION_STATUS_FAILURE = 'user/UPDATE_USER_ID_VERIFICATION_STATUS_FAILURE'

const initialState = {
  data: {},
  error: false,
  message: '',
  list: [],
  pending: false,
  verifications: [],
  verificationError: false,
  verificationMessage: '',
}

export const fetchUsers = (verificationPendingUsers = false) => {
  return dispatch => {
    dispatch({ type: FETCH })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/users?verification_pending_users=${verificationPendingUsers}`).then(response => {
      if (response.data.status === 'error') {
        dispatch({ type: FETCH_FAILURE, payload: response.data })
      } else {
        dispatch({ type: FETCH_SUCCESS, payload: { data: response.data, verificationPendingUsers } })
      }
    }).catch(err => {
      dispatch({ type: FETCH_FAILURE, payload: err.data })
    })
  }
}

export function updateUserIdVerificationStatus(slug, status, callback) {
  return dispatch => {
    dispatch({ type: UPDATE_USER_ID_VERIFICATION_STATUS })
    axios.patch(`/api/users/${slug}/${status}`).then(response => {
      dispatch({ type: UPDATE_USER_ID_VERIFICATION_STATUS_SUCCESS, payload: { data: response.data, slug } })
      callback();
    })
    .catch((error) => {
      dispatch({ type: UPDATE_USER_ID_VERIFICATION_STATUS_FAILURE, payload: error.message })
      callback();
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
    if(payload.verificationPendingUsers) {
      return {
        ...state,
        error: false,
        pending: false,
        verifications: payload.data
      }
    }
    else {
      return {
        ...state,
        error: false,
        pending: false,
        list: payload.data
      }
    }
  },
  [FETCH_FAILURE]: (payload, state) => {
    return {
      ...state,
      error: true,
      pending: false,
      message: payload
    }
  },
  [UPDATE_USER_ID_VERIFICATION_STATUS]: (payload, state) => {
    return {
      ...state,
      verificationError: false,
      verificationMessage: ''
    }
  },
  [UPDATE_USER_ID_VERIFICATION_STATUS_SUCCESS]: (payload, state) => {
    let verifications = [...state.verifications];
    const index = verifications.findIndex(v => v.slug === payload.slug)
    verifications.splice(index, 1);
    return {
      ...state,
      verifications,
      verificationMessage: payload.data.message
    }
  },
  [UPDATE_USER_ID_VERIFICATION_STATUS_FAILURE]: (payload, state) => {
    return {
      ...state,
      verificationError: true,
      verificationMessage: payload
    }
  },
}))
