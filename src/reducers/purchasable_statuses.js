import axios from 'axios'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const FETCH_LIST = 'purchasable_status/FETCH_LIST'
export const FETCH_LIST_ERROR = 'purchasable_status/FETCH_LIST_ERROR'
export const FETCH_LIST_SUCCESS = 'purchasable_status/FETCH_LIST_SUCCESS'

// INITIAL STATE ///////////////////////////////////////////////////////////////
const initialState = {
  data: {},
  list: [],
  pending: false,
  error: false,
  errorUpdating: false,
  message: '',
  updateMessage: ''
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
        message: 'Fetch purchasable status list successful.'
      }

    default:
      return state
  }
}

// ACTIONS /////////////////////////////////////////////////////////////////////
export function fetchPurchasableStatuses() {
  return dispatch => {
    dispatch({ type: FETCH_LIST })
    axios.get('/api/cryptos/purchasable_statuses')
      .then((response) => {
        dispatch({ type: FETCH_LIST_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_LIST_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}
