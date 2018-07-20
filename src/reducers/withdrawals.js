import axios from 'axios'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const FETCH = 'withdrawals/FETCH'
export const FETCH_ERROR = 'withdrawals/FETCH_ERROR'
export const FETCH_SUCCESS = 'withdrawals/FETCH_SUCCESS'
export const FETCH_LIST = 'withdrawals/FETCH_LIST'
export const FETCH_LIST_ERROR = 'withdrawals/FETCH_LIST_ERROR'
export const FETCH_LIST_SUCCESS = 'withdrawals/FETCH_LIST_SUCCESS'
export const UPDATE = 'withdrawals/UPDATE'
export const UPDATE_ERROR = 'withdrawals/UPDATE_ERROR'
export const UPDATE_SUCCESS = 'withdrawals/UPDATE_SUCCESS'

// INITIAL STATE ///////////////////////////////////////////////////////////////
const initialState = {
  data: {},
  list: [],
  pending: false,
  error: false,
  message: ''
}

// STATE ///////////////////////////////////////////////////////////////////////
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH:
    case FETCH_LIST:
    case UPDATE:
      return {
        ...state,
        pending: true,
        error: false,
        message: ''
      }

    case FETCH_ERROR:
    case FETCH_LIST_ERROR:
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

    case FETCH_LIST_SUCCESS:
      return {
        ...state,
        list: action.payload,
        pending: false,
        error: false,
        message: 'Fetch node list successful.'
      }

    case UPDATE_SUCCESS:
      console.log('list', state.list)
      return {
        ...state,
        data: action.payload,
        list: state.list.map(item => {
          if (item.slug === action.payload.slug) {
            return action.payload
          } else {
            return item
          }
        }),
        pending: false,
        error: false,
        message: 'Update node successful.'
      }

    default:
      return state
  }
}

// ACTIONS /////////////////////////////////////////////////////////////////////
export function fetchWithdrawal(slug) {
  return dispatch => {
    dispatch({ type: FETCH })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/withdrawals/${slug}`)
      .then((response) => {
        dispatch({ type: FETCH_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function fetchWithdrawals() {
  return dispatch => {
    dispatch({ type: FETCH_LIST })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get('/api/withdrawals?all')
      .then((response) => {
        dispatch({ type: FETCH_LIST_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_LIST_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function updateWithdrawal(slug, data) {
  return dispatch => {
    dispatch({ type: UPDATE })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/withdrawals/${slug}`, { withdrawal: data })
      .then((response) => {
        dispatch({ type: UPDATE_SUCCESS, payload: response.data })
      }).catch((error) => {
        dispatch({ type: UPDATE_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}
