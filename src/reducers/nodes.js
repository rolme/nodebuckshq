import axios from 'axios'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const CLEAR_MESSAGES = 'nodes/CLEAR_MESSAGES'
export const DELETE = 'nodes/DELETE'
export const DELETE_ERROR = 'nodes/DELETE_ERROR'
export const DELETE_SUCCESS = 'nodes/DELETE_SUCCESS'
export const DISBURSE = 'nodes/DISBURSE'
export const DISBURSE_ERROR = 'nodes/DISBURSE_ERROR'
export const DISBURSE_SUCCESS = 'nodes/DISBURSE_SUCCESS'
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
export const RESTORE = 'nodes/RESTORE'
export const RESTORE_ERROR = 'nodes/RESTORE_ERROR'
export const RESTORE_SUCCESS = 'nodes/RESTORE_SUCCESS'
export const UN_DISBURSE = 'nodes/UN_DISBURSE'
export const UN_DISBURSE_ERROR = 'nodes/UN_DISBURSE_ERROR'
export const UN_DISBURSE_SUCCESS = 'nodes/UN_DISBURSE_SUCCESS'
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
  switch ( action.type ) {
    case DELETE:
    case DISBURSE:
    case FETCH:
    case FETCH_LIST:
    case OFFLINE:
    case ONLINE:
    case UN_DISBURSE:
    case RESTORE:
      return {
        ...state,
        pending: true,
        error: false,
        message: ''
      }

    case UPDATE:
      return {
        ...state,
        error: false,
        message: ''
      }

    case DELETE_ERROR:
    case DISBURSE_ERROR:
    case FETCH_ERROR:
    case FETCH_LIST_ERROR:
    case OFFLINE_ERROR:
    case ONLINE_ERROR:
    case UN_DISBURSE_ERROR:
    case UPDATE_ERROR:
    case RESTORE_ERROR:
      return {
        ...state,
        pending: false,
        error: true,
        message: action.payload.message
      }

    case DELETE_SUCCESS:
      return {
        ...state,
        list: merge(state.list, action.payload),
        data: action.payload,
        pending: false,
        error: false,
        message: 'Delete successful.'
      }

    case DISBURSE_SUCCESS:
      return {
        ...state,
        list: merge(state.list, action.payload),
        data: action.payload,
        pending: false,
        error: false,
        message: 'Disbursed successful.'
      }

    case FETCH_SUCCESS:
      return {
        ...state,
        list: merge(state.list, action.payload),
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

    case UN_DISBURSE_SUCCESS:
      return {
        ...state,
        list: merge(state.list, action.payload),
        data: action.payload,
        pending: false,
        error: false,
        message: 'Undisbursed successful.'
      }

    case RESTORE_SUCCESS:
      return {
        ...state,
        list: merge(state.list, action.payload),
        data: action.payload,
        pending: false,
        error: false,
        message: 'Restore successful.'
      }


    case OFFLINE_SUCCESS:
    case ONLINE_SUCCESS:
    case UPDATE_SUCCESS:
      return {
        ...state,
        list: merge(state.list, action.payload),
        data: action.payload,
        pending: false,
        error: false,
        message: 'Update node successful.'
      }

    case CLEAR_MESSAGES:
      return {
        ...state,
        pending: false,
        error: false,
        message: ''
      }

    default:
      return state
  }
}

// ACTIONS /////////////////////////////////////////////////////////////////////
export function fetchNode(slug) {
  return dispatch => {
    dispatch({ type: FETCH })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/nodes/${slug}`)
      .then((response) => {
        dispatch({ type: FETCH_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_ERROR, payload: { message: error.data } })
        console.log(error)
      })
  }
}

export function fetchNodes() {
  return dispatch => {
    dispatch({ type: FETCH_LIST })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get('/api/nodes?all')
      .then((response) => {
        dispatch({ type: FETCH_LIST_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_LIST_ERROR, payload: { message: error.data } })
        console.log(error)
      })
  }
}

export function updateNode(slug, data) {
  return dispatch => {
    dispatch({ type: UPDATE })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/nodes/${slug}`, { node: data })
      .then((response) => {
        if(response.data.status !== 'error') {
          dispatch({ type: UPDATE_SUCCESS, payload: response.data })
        } else {
          dispatch({ type: UPDATE_ERROR, payload: { message: response.data.message } })
        }
      }).catch((error) => {
      dispatch({ type: UPDATE_ERROR, payload: { message: error.data } })
      console.log(error)
    })
  }
}

export function deleteNode(slug) {
  return dispatch => {
    dispatch({ type: DELETE })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.delete(`/api/nodes/${slug}`)
      .then((response) => {
        dispatch({ type: DELETE_SUCCESS, payload: response.data })
      }).catch((error) => {
      dispatch({ type: DELETE_ERROR, payload: { message: error.data } })
      console.log(error)
    })
  }
}

export function restoreNode(slug) {
  return dispatch => {
    dispatch({ type: RESTORE })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/nodes/${slug}/restore`)
      .then((response) => {
        dispatch({ type: RESTORE_SUCCESS, payload: response.data })
      }).catch((error) => {
      dispatch({ type: RESTORE_ERROR, payload: { message: error.data } })
      console.log(error)
    })
  }
}

export function offlineNode(slug) {
  return dispatch => {
    dispatch({ type: OFFLINE })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/nodes/${slug}/offline`)
      .then((response) => {
        dispatch({ type: OFFLINE_SUCCESS, payload: response.data })
      }).catch((error) => {
      dispatch({ type: OFFLINE_ERROR, payload: { message: error.data } })
      console.log(error)
    })
  }
}

export function onlineNode(slug) {
  return dispatch => {
    dispatch({ type: ONLINE })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/nodes/${slug}/online`)
      .then((response) => {
        dispatch({ type: ONLINE_SUCCESS, payload: response.data })
      }).catch((error) => {
      dispatch({ type: ONLINE_ERROR, payload: { message: error.data } })
      console.log(error)
    })
  }
}

export function disburseNode(slug) {
  return dispatch => {
    dispatch({ type: DISBURSE })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/nodes/${slug}/disburse`)
      .then((response) => {
        if ( response.data.status !== 'error' ) {
          dispatch({ type: DISBURSE_SUCCESS, payload: response.data })
        } else {
          dispatch({ type: DISBURSE_ERROR, payload: response.data })
        }
      }).catch((error) => {
      dispatch({ type: DISBURSE_ERROR, payload: { message: error.data } })
      console.log(error)
    })
  }
}

export function unDisburseNode(slug) {
  return dispatch => {
    dispatch({ type: UN_DISBURSE })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/nodes/${slug}/undisburse`)
      .then((response) => {
        if ( response.data.status !== 'error' ) {
          dispatch({ type: UN_DISBURSE_SUCCESS, payload: response.data })
        } else {
          dispatch({ type: UN_DISBURSE_ERROR, payload: response.data })
        }
      }).catch((error) => {
      dispatch({ type: UN_DISBURSE_ERROR, payload: { message: error.data } })
      console.log(error)
    })
  }
}

export function clearMessages() {
  return dispatch => {
    dispatch({ type: CLEAR_MESSAGES })
  }
}

// TODO: Move into a helper with an optional key
function merge(originalList, newItem) {
  let found = false
  let list = originalList.map(item => {
    if (item.slug === newItem.slug) {
      found = true
      return newItem
    } else {
      return item
    }
  })
  return (found) ? list : list.push(newItem) && list
}
