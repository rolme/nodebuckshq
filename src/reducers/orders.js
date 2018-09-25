import axios from 'axios'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const FETCH_LIST = 'orders/FETCH_LIST'
export const FETCH_LIST_ERROR = 'orders/FETCH_LIST_ERROR'
export const FETCH_LIST_SUCCESS = 'orders/FETCH_LIST_SUCCESS'
export const REQUEST_PAID = 'orders/REQUEST_PAID'
export const REQUEST_PAID_ERROR = 'orders/REQUEST_PAID_ERROR'
export const REQUEST_PAID_SUCCESS = 'orders/REQUEST_PAID_SUCCESS'
export const REQUEST_UNPAID = 'orders/REQUEST_UNPAID'
export const REQUEST_UNPAID_ERROR = 'orders/REQUEST_UNPAID_ERROR'
export const REQUEST_UNPAID_SUCCESS = 'orders/REQUEST_UNPAID_SUCCESS'

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
      return {
        ...state,
        pending: true,
        error: false,
        message: ''
      }

    case FETCH_LIST_ERROR:
      return {
        ...state,
        pending: false,
        error: true,
        message: action.payload.message
      }


    case FETCH_LIST_SUCCESS:
      return {
        ...state,
        list: action.payload,
        pending: false,
        error: false,
        message: 'Fetch orders list successful.'
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
      }

    case REQUEST_PAID_ERROR:
    case REQUEST_UNPAID_ERROR:
      return {
        ...state,
        message: action.payload.message
      }

    default:
      return state
  }
}

// ACTIONS /////////////////////////////////////////////////////////////////////
export function fetchOrders() {
  return dispatch => {
    dispatch({ type: FETCH_LIST })
    axios.get('/api/orders?all')
      .then((response) => {
        dispatch({ type: FETCH_LIST_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_LIST_ERROR, payload: {message: error.data} })
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
