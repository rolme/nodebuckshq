import axios from 'axios'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const CREATE = 'announcements/CREATE'
export const CREATE_ERROR = 'announcements/CREATE_ERROR'
export const CREATE_SUCCESS = 'announcements/CREATE_SUCCESS'

// INITIAL STATE ///////////////////////////////////////////////////////////////
const initialState = {
  data: null,
  pending: false,
  error: false,
  message: ''
}

// STATE ///////////////////////////////////////////////////////////////////////
export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE:
      return {
        ...state,
        pending: false,
        error: true,
        message: '',
        data: null
      }
    case CREATE_SUCCESS:
      return {
        ...state,
        pending: false,
        error: false,
        message: 'Announcement created',
        data: action.payload
      }
    case CREATE_ERROR:
      return {
        ...state,
        pending: false,
        error: true,
        data: null,
        message: action.payload
      }
    default:
      return state
  }
}

export function createAnnouncement(data) {
  return dispatch => {
    dispatch({ type: CREATE })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.post(`/api/announcements`, { text: data })
      .then((response) => {
      dispatch({ type: CREATE_SUCCESS, payload: response.data })
      }).catch((error) => {
        dispatch({ type: CREATE_ERROR, payload: error.data })
        console.log(error)
      })
  }
}