import axios from 'axios'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const FETCH = 'nodes/FETCH'
export const FETCH_ERROR = 'nodes/FETCH_ERROR'
export const FETCH_SUCCESS = 'nodes/FETCH_SUCCESS'
export const FETCH_LIST = 'nodes/FETCH_LIST'
export const FETCH_LIST_ERROR = 'nodes/FETCH_LIST_ERROR'
export const FETCH_LIST_SUCCESS = 'nodes/FETCH_LIST_SUCCESS'
export const OFFLINE = 'nodes/OFFLINE'
export const OFFLINE_ERROR = 'nodes/OFFLINE_ERROR'
export const OFFLINE_SUCCESS = 'nodes/OFFLINE_SUCCESS'
export const ONLINE = 'nodes/ONLINE'
export const ONLINE_ERROR = 'nodes/ONLINE_ERROR'
export const ONLINE_SUCCESS = 'nodes/ONLINE_SUCCESS'
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
    case OFFLINE:
    case ONLINE:
    case UPDATE:
      return {
        ...state,
        pending: true,
        error: false,
        message: ''
      }

    case FETCH_ERROR:
    case FETCH_LIST_ERROR:
    case OFFLINE_ERROR:
    case ONLINE_ERROR:
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

    case OFFLINE_SUCCESS:
    case ONLINE_SUCCESS:
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
    axios.get('/api/nodes?all')
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
    axios.patch(`/api/nodes/${slug}`, { node: data })
      .then((response) => {
        dispatch({ type: UPDATE_SUCCESS, payload: response.data })
      }).catch((error) => {
        dispatch({ type: UPDATE_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function offlineNode(slug) {
  return dispatch => {
    dispatch({ type: OFFLINE })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/nodes/${slug}/offline`)
      .then((response) => {
        dispatch({ type: OFFLINE_SUCCESS, payload: response.data })
      }).catch((error) => {
        dispatch({ type: OFFLINE_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function onlineNode(slug) {
  return dispatch => {
    dispatch({ type: ONLINE })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/nodes/${slug}/online`)
      .then((response) => {
        dispatch({ type: ONLINE_SUCCESS, payload: response.data })
      }).catch((error) => {
        dispatch({ type: ONLINE_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}
