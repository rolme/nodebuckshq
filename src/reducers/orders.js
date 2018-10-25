import axios from 'axios'
import qs from 'query-string'
import { push } from 'connected-react-router'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const FETCH_LIST = 'orders/FETCH_LIST'
export const FETCH_LIST_ERROR = 'orders/FETCH_LIST_ERROR'
export const FETCH_LIST_SUCCESS = 'orders/FETCH_LIST_SUCCESS'
export const FETCH_ORDER = 'orders/FETCH_ORDER'
export const FETCH_ORDER_SUCCESS = 'orders/FETCH_ORDER_SUCCESS'
export const FETCH_ORDER_ERROR = 'orders/FETCH_ORDER_ERROR'
export const REQUEST_PAID = 'orders/REQUEST_PAID'
export const REQUEST_PAID_ERROR = 'orders/REQUEST_PAID_ERROR'
export const REQUEST_PAID_SUCCESS = 'orders/REQUEST_PAID_SUCCESS'
export const REQUEST_UNPAID = 'orders/REQUEST_UNPAID'
export const REQUEST_UNPAID_ERROR = 'orders/REQUEST_UNPAID_ERROR'
export const REQUEST_UNPAID_SUCCESS = 'orders/REQUEST_UNPAID_SUCCESS'
export const REQUEST_OREDER_CANCELED = 'orders/REQUEST_OREDER_CANCELED'
export const REQUEST_OREDER_CANCELED_SUCCESS = 'orders/REQUEST_OREDER_CANCELED_SUCCESS'
export const REQUEST_OREDER_CANCELED_ERROR = 'orders/REQUEST_OREDER_CANCELED_ERROR'
export const CLEAR_MESSAGES = 'orders/CLEAR_MESSAGES'

// INITIAL STATE ///////////////////////////////////////////////////////////////
const initialState = {
  data: {},
  list: [],
  pending: false,
  error: false,
  message: '',
  canceledOrder: false,
}

// STATE ///////////////////////////////////////////////////////////////////////
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LIST:
    case FETCH_ORDER:
      return {
        ...state,
        pending: true,
        error: false,
        message: ''
      }

    case FETCH_LIST_ERROR:
    case FETCH_ORDER_ERROR:
      return {
        ...state,
        pending: false,
        error: true,
        message: action.payload.message
      }


    case FETCH_LIST_SUCCESS:
      return {
        ...state,
        list: action.payload.filter(order => order.status !== 'canceled'),
        pending: false,
        error: false,
        message: 'Fetch orders list successful.'
      }


    case FETCH_ORDER_SUCCESS:
      return {
        ...state,
        data: action.payload,
        pending: false,
        error: false,
        message: 'Fetch order successful.'
      }

    case REQUEST_PAID:
    case REQUEST_UNPAID:
      return {
        ...state,
        error: false,
      }

    case REQUEST_PAID_SUCCESS:
    case REQUEST_UNPAID_SUCCESS:
      const newList = [...state.list];
      const index = newList.findIndex(el => el.slug === action.payload.slug);
      newList[index] = action.payload;
      return {
        ...state,
        list: newList,
        data: action.payload,
      }

    case REQUEST_PAID_ERROR:
    case REQUEST_UNPAID_ERROR:
      return {
        ...state,
        message: action.payload.message
      }

    case REQUEST_OREDER_CANCELED:
      return {
        ...state,
        canceledOrder: false,
      }

    case REQUEST_OREDER_CANCELED_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          status: 'canceled',
        },
        canceledOrder: true,
      }

    case CLEAR_MESSAGES:
      return {
        ...state,
        canceledOrder: false,
      }

    default:
      return state
  }
}

// ACTIONS /////////////////////////////////////////////////////////////////////
export function fetchOrders(page = 1, limit = 25) {
  return dispatch => {
    dispatch(push({ search: qs.stringify({ limit, page }) }))
    dispatch({ type: FETCH_LIST })
    axios.get(`/api/orders?all&page=${page - 1}&limit=${limit}`)
      .then((response) => {
        dispatch({ type: FETCH_LIST_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_LIST_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function fetchOrder(slug) {
  return dispatch => {
    dispatch({ type: FETCH_ORDER })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/orders/${slug}`)
      .then((response) => {
        dispatch({ type: FETCH_ORDER_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_ORDER_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}



export function orderPaid(slug) {
  return dispatch => {
    dispatch({ type: REQUEST_PAID })
    axios.patch(`/api/orders/${slug}/paid`)
      .then((response) => {
        dispatch({ type: REQUEST_PAID_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: REQUEST_PAID_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function orderUnpaid(slug) {
  return dispatch => {
    dispatch({ type: REQUEST_UNPAID })
    axios.patch(`/api/orders/${slug}/unpaid`)
      .then((response) => {
        dispatch({ type: REQUEST_UNPAID_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: REQUEST_UNPAID_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function orderCanceled(slug, callback) {
  return dispatch => {
    dispatch({ type: REQUEST_OREDER_CANCELED })
    axios.patch(`/api/orders/${slug}/canceled`)
      .then((response) => {
        dispatch({ type: REQUEST_OREDER_CANCELED_SUCCESS, payload: response.data })
        callback()
      })
      .catch((error) => {
        dispatch({ type: REQUEST_OREDER_CANCELED_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function clearMessages() {
  return dispatch => {
    dispatch({ type: CLEAR_MESSAGES })
  }
}
