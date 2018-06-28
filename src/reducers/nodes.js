import axios from 'axios'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const FETCH = 'nodes/FETCH'
export const FETCH_ERROR = 'nodes/FETCH_ERROR'
export const FETCH_SUCCESS = 'nodes/FETCH_SUCCESS'
export const FETCH_LIST = 'nodes/FETCH_LIST'
export const FETCH_LIST_ERROR = 'nodes/FETCH_LIST_ERROR'
export const FETCH_LIST_SUCCESS = 'nodes/FETCH_LIST_SUCCESS'
export const UPDATE = 'nodes/UPDATE'
export const UPDATE_ERROR = 'nodes/UPDATE_ERROR'
export const UPDATE_SUCCESS = 'nodes/UPDATE_SUCCESS'

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
      return {
        ...state,
        data: action.payload,
        pending: false,
        error: false,
        message: 'Update node successful.'
      }

    default:
      return state
  }
}

// ACTIONS /////////////////////////////////////////////////////////////////////
export function fetchNode(slug) {
  return dispatch => {
    dispatch({ type: FETCH })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/nodes/${slug}`)
      .then((response) => {
        dispatch({ type: FETCH_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function fetchNodes() {
  return dispatch => {
    dispatch({ type: FETCH_LIST })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get('/api/nodes')
      .then((response) => {
        dispatch({ type: FETCH_LIST_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_LIST_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function updateNode(slug, data) {
  return dispatch => {
    dispatch({ type: UPDATE })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/nodes/${slug}`, { crypto: data })
      .then((response) => {
      dispatch({ type: UPDATE_SUCCESS, payload: response.data })
      }).catch((error) => {
        dispatch({ type: UPDATE_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}
