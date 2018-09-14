import { createReducer } from "redux-action"
import axios from 'axios'

export const FETCH = "users/FETCH"
export const FETCH_SUCCESS = "users/FETCH_SUCCESS"
export const FETCH_FAILURE = "users/FETCH_FAILURE"
export const UPDATE_USER_ID_VERIFICATION = 'user/UPDATE_USER_ID_VERIFICATION'
export const UPDATE_USER_ID_VERIFICATION_SUCCESS = 'user/UPDATE_USER_ID_VERIFICATION_SUCCESS'
export const UPDATE_USER_ID_VERIFICATION_FAILURE = 'user/UPDATE_USER_ID_VERIFICATION_FAILURE'

const initialState = {
  data: {},
  error: false,
  message: '',
  list: [],
  pending: false,
  verifications: [],
}

export const fetchUsers = (verificationsPending = false) => {
  return dispatch => {
    dispatch({ type: FETCH })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/users?verifications_pending=${verificationsPending}`).then(response => {
      if (response.data.status === 'error') {
        dispatch({ type: FETCH_FAILURE, payload: response.data })
      } else {
        dispatch({ type: FETCH_SUCCESS, payload: { data: response.data, verificationsPending } })
      }
    }).catch(err => {
      dispatch({ type: FETCH_FAILURE, payload: err.data })
    })
  }
}

export function updateUserIdVerification(slug, verified) {
  return dispatch => {
    dispatch({ type: UPDATE_USER_ID_VERIFICATION })
    axios.patch(`/api/users/${slug}/verify_id_image`, { user: { verified } }).then(response => {
      dispatch({ type: UPDATE_USER_ID_VERIFICATION_SUCCESS, payload: { data: response.data, slug } })
    })
    .catch((error) => {
      dispatch({ type: UPDATE_USER_ID_VERIFICATION_FAILURE, payload: error.message })
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
    if(payload.verificationsPending) {
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
  [UPDATE_USER_ID_VERIFICATION_SUCCESS]: (payload, state) => {
    let verifications = [...state.verifications];
    const index = verifications.findIndex(v => v.slug === payload.slug)
    console.log(index)
    verifications.splice(index, 1);
    return {
      ...state,
      verifications,
    }
  }
}))
