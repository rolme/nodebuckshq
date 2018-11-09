import axios from 'axios'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const FETCH = 'system/FETCH'
export const FETCH_ERROR = 'system/FETCH_ERROR'
export const FETCH_SUCCESS = 'system/FETCH_SUCCESS'
export const UPDATE = 'system/UPDATE'
export const UPDATE_ERROR = 'system/UPDATE_ERROR'
export const UPDATE_SUCCESS = 'system/UPDATE_SUCCESS'

// INITIAL STATE ///////////////////////////////////////////////////////////////
const initialState = {
  data: {},
  pending: false,
  error: false,
  message: ''
}

// STATE ///////////////////////////////////////////////////////////////////////
export default (state = initialState, action) => {
  switch ( action.type ) {
    case FETCH:
    case UPDATE:
      return {
        ...state,
        pending: true,
        error: false,
        message: ''
      }

    case FETCH_ERROR:
    case UPDATE_ERROR:
      return {
        ...state,
        pending: false,
        error: true,
        message: action.payload.message
      }

    case FETCH_SUCCESS:
      return {
        ...state,
        data: action.payload,
        pending: false,
        error: false,
        message: 'Fetch node successful.'
      }

    case UPDATE_SUCCESS:
      return {
        ...state,
        data: action.payload,
        pending: false,
        error: false,
        message: action.payload.updatedItem + ' updated successful.'
      }

    default:
      return state
  }
}

// ACTIONS /////////////////////////////////////////////////////////////////////
export function fetchSystem(slug) {
  return dispatch => {
    dispatch({ type: FETCH })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/system`)
      .then((response) => {
        dispatch({ type: FETCH_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_ERROR, payload: { message: error.data } })
        console.log(error)
      })
  }
}

export function updateSystemSetting(key, value) {
  return dispatch => {
    dispatch({ type: UPDATE })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/system/setting`, { setting: { key: key, value: value }})
      .then((response) => {
        if(response.data.status !== 'error') {
          dispatch({ type: UPDATE_SUCCESS, payload: response.data })
        } else {
          dispatch({ type: UPDATE_ERROR, payload: { message: response.data.message } })
        }
      }).catch((error) => {
      dispatch({ type: UPDATE_ERROR, payload: { message: error.data } })
      console.log(error)
    })
  }
}
