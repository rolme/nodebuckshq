import axios from 'axios'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const FETCH_REQUESTED = 'categories/FETCH_REQUESTED'
export const FETCH = 'categories/FETCH'

// INITIAL STATE ///////////////////////////////////////////////////////////////
const initialState = {
  list: [],
  isFetching: false
}

// STATE ///////////////////////////////////////////////////////////////////////
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REQUESTED:
      return {
        ...state,
        isFetching: true
      }

    case FETCH:
      return {
        ...state,
        list: action.payload,
        isFetching: !state.isFetching
      }

    default:
      return state
  }
}

// ACTIONS /////////////////////////////////////////////////////////////////////
export function fetchCategories() {
  return dispatch => {
    dispatch({ type: FETCH_REQUESTED })
    axios.get('/api/categories')
      .then((response) => {
        dispatch({ type: FETCH, payload: response.data })
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
