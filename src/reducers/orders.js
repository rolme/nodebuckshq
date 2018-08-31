import axios from 'axios'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const FETCH_LIST = 'orders/FETCH_LIST'
export const FETCH_LIST_ERROR = 'orders/FETCH_LIST_ERROR'
export const FETCH_LIST_SUCCESS = 'orders/FETCH_LIST_SUCCESS'

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
