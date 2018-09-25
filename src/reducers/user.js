import axios from 'axios'
import jwt_decode from 'jwt-decode'
import moment from 'moment'
import { push } from 'connected-react-router'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const CONFIRM_REGISTRATION = 'user/CONFIRM_REGISTRATION'
export const CONFIRM_REGISTRATION_SUCCESS = 'user/CONFIRM_REGISTRATION_SUCCESS'
export const CONFIRM_REGISTRATION_FAILURE = 'user/CONFIRM_REGISTRATION_FAILURE'
export const LOGIN_USER = 'user/LOGIN_USER'
export const LOGIN_USER_SUCCESS = 'user/LOGIN_USER_SUCCESS'
export const LOGIN_USER_FAILURE = 'user/LOGIN_USER_FAILURE'
export const LOGOUT_USER_SUCCESS = 'user/LOGOUT_USER_SUCCESS'
export const REGISTER_USER = 'user/REGISTER_USER'
export const REGISTER_USER_SUCCESS = 'user/REGISTER_USER_SUCCESS'
export const REGISTER_USER_FAILURE = 'user/REGISTER_USER_FAILURE'
export const REQUEST_RESET = 'user/REQUEST_RESET'
export const REQUEST_RESET_SUCCESS = 'user/REQUEST_RESET_SUCCESS'
export const REQUEST_RESET_FAILURE = 'user/REQUEST_RESET_FAILURE'
export const RESET_PASSWORD = 'user/RESET_PASSWORD'
export const RESET_PASSWORD_SUCCESS = 'user/RESET_PASSWORD_SUCCESS'
export const RESET_PASSWORD_FAILURE = 'user/RESET_PASSWORD_FAILURE'
export const UPDATE_USER = 'user/UPDATE_USER'
export const UPDATE_USER_SUCCESS = 'user/UPDATE_USER_SUCCESS'
export const UPDATE_USER_FAILURE = 'user/UPDATE_USER_FAILURE'
export const GET_2FA_SECRET = 'user/GET_2FA_SECRET'
export const GET_2FA_SECRET_SUCCESS = 'user/GET_2FA_SECRET_SUCCESS'
export const GET_2FA_SECRET_FAILURE = 'user/GET_2FA_SECRET_FAILURE'

// INITIAL STATE ///////////////////////////////////////////////////////////////

// TODO: This smells, should probably be moved or figure out another way.
let TOKEN      = localStorage.getItem('jwt-nodebuckshq')
let TOKEN_USER = null

try {
  if (TOKEN !== '' && TOKEN !== null) {
    TOKEN_USER = jwt_decode(TOKEN)
    if (+TOKEN_USER.exp < +moment("","x")) {
      localStorage.setItem('jwt-nodebuckshq', '')
      TOKEN_USER = null
    }
  }
} catch(err) {
  localStorage.setItem('jwt-nodebuckshq', '')
  TOKEN_USER = null
}

const initialState = {
  data: TOKEN_USER,
  error: false,
  message: null,
  pending: false,
  token: TOKEN
}

// STATE ///////////////////////////////////////////////////////////////////////
export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        data: null,
        error: false,
        message: null,
        pending: true,
        token: ''
      }

    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        data: jwt_decode(action.payload.token),
        error: false,
        message: null,
        pending: false,
        token: action.payload.token
      }

    case LOGIN_USER_FAILURE:
      return {
        ...state,
        data: null,
        error: true,
        message: action.payload.message,
        pending: false,
        token: ''
      }
    case GET_2FA_SECRET_FAILURE:
      return {
        ...state,
        data: null,
        error: true,
        message: action.payload,
        token: ''
      }

    case UPDATE_USER:
      return {
        ...state,
        error: false,
        message: null,
        pending: true
      }

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        data: jwt_decode(action.payload.token),
        error: false,
        message: action.payload.message,
        pending: false,
        token: action.payload.token
      }

    case UPDATE_USER_FAILURE:
      return {
        ...state,
        error: true,
        message: action.payload.message,
        pending: false
      }

    case LOGOUT_USER_SUCCESS:
      return {
        ...state,
        data: null,
        error: true,
        message: 'Logged out.',
        pending: false,
        token: ''
      }

    default:
      return state
  }
}

// ACTIONS /////////////////////////////////////////////////////////////////////
export function isAuthenticated() {
  return dispatch => {
    let token = localStorage.getItem('jwt-nodebuckshq')
    let tokenUser = null
    if (token !== '' && token !== null) {
      try {
        tokenUser = jwt_decode(token)
        if (+tokenUser.exp < +moment("","x")) {
          localStorage.setItem('jwt-nodebuckshq', '')
          dispatch({ type: 'LOGOUT_USER_SUCCESS' })
          return false
        }
        return true
      } catch(err) {
        localStorage.setItem('jwt-nodebuckshq', '')
        dispatch({ type: 'LOGOUT_USER_SUCCESS' })
        return false
      }
    }
    return false
  }
}

export function login(email, password) {
  return dispatch => {
    dispatch({ type: LOGIN_USER })

    axios.post(`/auth/admin`, {
      email: email,
      password: password
    }).then((response) => {
      if (response.data !== 'error') {
        localStorage.setItem('jwt-nodebuckshq', response.data.token)
        dispatch({ type: LOGIN_USER_SUCCESS, payload: response.data })
        dispatch(push('/'))
      } else {
        dispatch({ type: LOGIN_USER_FAILURE, payload: response.message })
      }
    })
    .catch((error) => {
      dispatch({ type: LOGIN_USER_FAILURE, payload: { message: 'Email and/or password is invalid.' } })
    })
  }
}

export function logout() {
  return dispatch => {
    localStorage.setItem('jwt-nodebuckshq', '')
    dispatch({ type: LOGOUT_USER_SUCCESS })
    dispatch(push('/login'))
  }
}

/* params = {
     first: string,
     last: string,
     email: string,
     password: string,
     password_confirmation: string
   } */
export function register(params) {
  return dispatch => {
    dispatch({ type: REGISTER_USER })
    axios.post('/api/users', { user: params }).then(response => {
      dispatch({ type: REGISTER_USER_SUCCESS, payload: response.data })
    })
    .catch((error) => {
      dispatch({ type: REGISTER_USER_FAILURE, payload: error.message })
    })
  }
}

/* params = {
     first: string,
     last: string,
     email: string,
     password: string,
     password_confirmation: string
   } */
export function updateUser(slug, currentPassword, params) {
  return dispatch => {
    dispatch({ type: UPDATE_USER })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/users/${slug}`, {
      current_password: currentPassword,
      user: params
    }).then(response => {
      if (response.data.status !== 'error') {
        dispatch({ type: UPDATE_USER_SUCCESS, payload: response.data })
      } else {
        dispatch({ type: UPDATE_USER_FAILURE, payload: response.data })
      }
    }).catch(error => {
      dispatch({ type: UPDATE_USER_FAILURE, payload: error.data })
    })
  }
}

export function confirm(slug) {
  return dispatch => {
    dispatch({ type: CONFIRM_REGISTRATION })
    axios.get(`/api/users/${slug}/confirm`).then(response => {
      dispatch({ type: CONFIRM_REGISTRATION_SUCCESS, payload: response.data })
    })
    .catch((error) => {
      dispatch({ type: CONFIRM_REGISTRATION_FAILURE, payload: error.message })
    })
  }
}

export function requestReset(email) {
  return dispatch => {
    dispatch({ type: REQUEST_RESET })
    axios.patch('/api/users/reset', { email }).then(response => {
      dispatch({ type: REQUEST_RESET_SUCCESS, payload: response.data })
    })
    .catch((error) => {
      dispatch({ type: REQUEST_RESET_FAILURE, payload: error.message })
    })
  }
}

export function resetPassword(resetToken, password, passwordConfirmation) {
  return dispatch => {
    dispatch({ type: RESET_PASSWORD })
    axios.patch(`/api/users/${resetToken}/reset`, {
      user: {
        password,
        password_confirmation: passwordConfirmation
      }
    })
    .then(response => {
      dispatch({ type: RESET_PASSWORD_SUCCESS, payload: response.data })
    })
    .catch((error) => {
      dispatch({ type: RESET_PASSWORD_FAILURE, payload: error.message })
    })
  }
}

export function get2FASecret(data, callback) {
  return dispatch => {
    dispatch({ type: GET_2FA_SECRET })
    axios.post(`/api/users/secret_2fa`, data).then(response => {
      if (response.data.status === 'ok' ) {
        dispatch({ type: GET_2FA_SECRET_SUCCESS, payload: response.data })
        callback(response.data)
      } else {
        dispatch({ type: GET_2FA_SECRET_FAILURE, payload: 'Email and/or password is invalid.' })
      }
    })
      .catch((error) => {
        dispatch({ type: GET_2FA_SECRET_FAILURE, payload: error.message })
      })
  }
}
