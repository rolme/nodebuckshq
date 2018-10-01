import axios from 'axios'

export const FETCH_COUNTS = 'orders/FETCH_COUNTS'
export const FETCH_COUNTS_SUCCESS = 'orders/FETCH_COUNTS_SUCCESS'
export const FETCH_COUNTS_ERROR = 'orders/FETCH_COUNTS_ERROR'

const initialState = {
  data: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COUNTS_SUCCESS:
      return {
        data: action.payload
      }

    default:
      return state
  }
}

export function fetchCounts() {
  return dispatch => {
    dispatch({ type: FETCH_COUNTS })
    axios.get('/counts')
      .then((response) => {
        dispatch({ type: FETCH_COUNTS_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_COUNTS_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}
