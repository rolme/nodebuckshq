import axios from 'axios'
import { findIndex } from 'lodash'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const FETCH_LIST = 'contacts/FETCH_LIST'
export const FETCH_LIST_ERROR = 'contacts/FETCH_LIST_ERROR'
export const FETCH_LIST_SUCCESS = 'contacts/FETCH_LIST_SUCCESS'
export const REVIEWED = 'contacts/REVIEWED'
export const REVIEWED_ERROR = 'contacts/REVIEWED_ERROR'
export const REVIEWED_SUCCESS = 'contacts/REVIEWED_SUCCESS'

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
    case REVIEWED:
      return {
        ...state,
        pending: true,
        error: false,
        message: ''
      }

    case FETCH_LIST_ERROR:
    case REVIEWED_ERROR:
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
        message: 'Fetch cryptocurrency list successful.'
      }

    case REVIEWED_SUCCESS:
      let list = [...state.list];
      console.log(list)
      let index = findIndex(list, c => c.id === action.payload);
      console.log(index)
      list.splice(index, 1);
      return {
        ...state,
        list: list,
        pending: false,
        error: false,
        message: action.payload.message
      }

    default:
      return state
  }
}

// ACTIONS /////////////////////////////////////////////////////////////////////
export function fetchContacts() {
  return dispatch => {
    dispatch({ type: FETCH_LIST })
    axios.get('/api/contacts')
      .then((response) => {
        dispatch({ type: FETCH_LIST_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_LIST_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function reviewed(id, userSlug) {
  return dispatch => {
    dispatch({ type: REVIEWED })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/contacts/${id}/reviewed`, { user_slug: userSlug})
      .then((response) => {
      dispatch({ type: REVIEWED_SUCCESS, payload: id })
      }).catch((error) => {
        dispatch({ type: REVIEWED_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}
