import axios from 'axios'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const FETCH_LIST = 'orders/FETCH_LIST'
export const FETCH_LIST_ERROR = 'orders/FETCH_LIST_ERROR'
export const FETCH_LIST_SUCCESS = 'orders/FETCH_LIST_SUCCESS'
export const FETCH_LIST_BY_NODE = 'orders/FETCH_LIST_BY_NODE'
export const FETCH_LIST_BY_NODE_ERROR = 'orders/FETCH_LIST_BY_NODE_ERROR'
export const FETCH_LIST_BY_NODE_SUCCESS = 'orders/FETCH_LIST_BY_NODE_SUCCESS'
export const FETCH_LIST_BY_USER = 'orders/FETCH_LIST_BY_USER'
export const FETCH_LIST_BY_USER_ERROR = 'orders/FETCH_LIST_BY_USER_ERROR'
export const FETCH_LIST_BY_USER_SUCCESS = 'orders/FETCH_LIST_BY_USER_SUCCESS'

// INITIAL STATE ///////////////////////////////////////////////////////////////
const initialState = {
  list: [],
  pending: false,
  error: false,
  message: ''
}

// STATE ///////////////////////////////////////////////////////////////////////
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LIST:
    case FETCH_LIST_BY_NODE:
    case FETCH_LIST_BY_USER:
      return {
        ...state,
        pending: true,
        error: false,
        message: ''
      }

    case FETCH_LIST_ERROR:
    case FETCH_LIST_BY_NODE_ERROR:
    case FETCH_LIST_BY_USER_ERROR:
      return {
        ...state,
        pending: false,
        error: true,
        message: action.payload.message
      }


    case FETCH_LIST_SUCCESS:
    case FETCH_LIST_BY_NODE_SUCCESS:
    case FETCH_LIST_BY_USER_SUCCESS:
      return {
        ...state,
        list: action.payload,
        pending: false,
        error: false,
        message: 'Fetch orders list successful.'
      }

    default:
      return state
  }
}

// ACTIONS /////////////////////////////////////////////////////////////////////
export function fetchOrders() {
  return dispatch => {
    dispatch({ type: FETCH_LIST })
    axios.get('/api/orders')
      .then((response) => {
        dispatch({ type: FETCH_LIST_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_LIST_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function fetchOrdersByNode(slug) {
  return dispatch => {
    dispatch({ type: FETCH_LIST_BY_NODE })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/orders/n=${slug}`)
      .then((response) => {
        dispatch({ type: FETCH_LIST_BY_NODE_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_LIST_BY_NODE_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function fetchOrdersByUser(slug) {
  return dispatch => {
    dispatch({ type: FETCH_LIST_BY_USER })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/orders/u=${slug}`)
      .then((response) => {
        dispatch({ type: FETCH_LIST_BY_USER_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_LIST_BY_NODE_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}
