import axios from 'axios'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const DELETE_UPDATE = 'reports/DELETE_UPDATE'
export const DELETE_UPDATE_SUCCESS = 'reports/DELETE_UPDATE_SUCCESS'
export const DELETE_UPDATE_FAILURE = 'reports/DELETE_UPDATE_FAILURE'
export const FETCH_REPORTS_REQUESTED = 'reports/FETCH_REPORTS_REQUESTED'
export const FETCH_REPORTS = 'reports/FETCH_REPORTS'
export const FETCH_REPORT_REQUESTED = 'reports/FETCH_REPORT_REQUESTED'
export const FETCH_REPORT = 'reports/FETCH_REPORT'
export const NEW_REPORT_REQUESTED = 'reports/NEW_REPORT_REQUESTED'
export const NEW_REPORT = 'reports/NEW_REPORT'
export const UPDATE_REPORT_REQUESTED = 'reports/UPDATE_REPORT_REQUESTED'
export const UPDATE_REPORT = 'reports/UPDATE_REPORT'
export const UPDATE_REPORT_SCORE_REQUESTED = 'reports/UPDATE_REPORT_SCORE_REQUESTED'
export const UPDATE_REPORT_SCORE = 'reports/UPDATE_REPORT_SCORE'
export const PUBLISH_REPORT = 'reports/PUBLISH_REPORT'
export const PUBLISH_REPORT_SUCCESS = 'reports/PUBLISH_REPORT_SUCCESS'
export const PUBLISH_REPORT_FAILURE = 'reports/PUBLISH_REPORT_FAILURE'
export const PUBLISH_UPDATE = 'reports/PUBLISH_UPDATE'
export const PUBLISH_UPDATE_SUCCESS = 'reports/PUBLISH_UPDATE_SUCCESS'
export const PUBLISH_UPDATE_FAILURE = 'reports/PUBLISH_UPDATE_FAILURE'
export const REFRESH_REPORT = 'reports/REFRESH_REPORT'
export const REFRESH_REPORT_REQUESTED = 'reports/REFRESH_REPORT_REQUESTED'
export const REFRESH_REPORT_ERROR = 'reports/REFRESH_REPORT_ERROR'
export const SORT_CATEGORY_ID = 'reports/SORT_CATEGORY_ID'
export const SORT_ORDER = 'reports/SORT_ORDER'
export const SYNC_REPORT_SCORES_REQUESTED = 'reports/SYNC_REPORT_SCORES_REQUESTED'
export const SYNC_REPORT_SCORES = 'reports/SYNC_REPORT_SCORES'
export const UNPUBLISH_REPORT = 'reports/UNPUBLISH_REPORT'
export const UNPUBLISH_REPORT_SUCCESS = 'reports/UNPUBLISH_REPORT_SUCCESS'
export const UNPUBLISH_REPORT_FAILURE = 'reports/UNPUBLISH_REPORT_FAILURE'
export const UNPUBLISH_UPDATE = 'reports/UNPUBLISH_UPDATE'
export const UNPUBLISH_UPDATE_SUCCESS = 'reports/UNPUBLISH_UPDATE_SUCCESS'
export const UNPUBLISH_UPDATE_FAILURE = 'reports/UNPUBLISH_UPDATE_FAILURE'
export const UPDATE_CATEGORY_SCORES = 'reports/UPDATE_CATEGORY_SCORES'
export const UPDATE_CATEGORY_SCORES_SUCCESS = 'reports/UPDATE_CATEGORY_SCORES_SUCCESS'
export const UPDATE_CATEGORY_SCORES_FAILURE = 'reports/UPDATE_CATEGORY_SCORES_FAILURE'
export const POST_NOTE_COMMENT_REQUESTED = 'reports/POST_NOTE_COMMENT_REQUESTED'
export const POST_NOTE_COMMENT_SUCCESS = 'reports/POST_NOTE_COMMENT_SUCCESS'
export const REMOVE_NOTE_COMMENT_REQUESTED = 'reports/REMOVE_NOTE_COMMENT_REQUESTED'
export const REMOVE_NOTE_COMMENT_SUCCESS = 'reports/REMOVE_NOTE_COMMENT_SUCCESS'
export const UPDATE_NOTE_COMMENT_REQUESTED = 'reports/EDIT_NOTE_COMMENT_REQUESTED'
export const UPDATE_NOTE_COMMENT_SUCCESS = 'reports/EDIT_NOTE_COMMENT_SUCCESS'
export const NOT_SIGNIFICANT_CHANGE_TO_CATEGORY_SCORE = 'reports/NOT_SIGNIFICANT_CHANGE_TO_CATEGORY_SCORE'

// INITIAL STATE ///////////////////////////////////////////////////////////////
const initialState = {
  error: false,
  isFetching: false,
  isDescending: true,
  list: [],
  message: null,
  pending: false,
  selected: null,
  sortCategoryId: 0
}

// STATE ///////////////////////////////////////////////////////////////////////
export default (state = initialState, action) => {
  let newList   = []
  let newReport = {}
  let newScores = {}
  let noteCommentsUpdated
  let newNoteComments

  switch (action.type) {
    case FETCH_REPORTS_REQUESTED:
      return {
        ...state,
        isFetching: true
      }

    case FETCH_REPORTS:
      return {
        ...state,
        list: action.payload,
        isFetching: !state.isFetching
      }

    case FETCH_REPORT_REQUESTED:
    case REFRESH_REPORT_REQUESTED:
      return {
        ...state,
        isFetching: true
      }

    case FETCH_REPORT:
    case REFRESH_REPORT:
      return {
        ...state,
        selected: action.payload,
        isFetching: !state.isFetching
      }

    case REFRESH_REPORT_ERROR:
      return {
        ...state,
        error: true,
        message: action.payload
      }

    case NEW_REPORT_REQUESTED:
      return {
        ...state,
        isFetching: true
      }

    case PUBLISH_REPORT:
    case PUBLISH_UPDATE:
    case DELETE_UPDATE:
      return {
        ...state,
        error: false,
        message: null,
        pending: true
      }

    case PUBLISH_REPORT_SUCCESS:
    case PUBLISH_UPDATE_SUCCESS:
      return {
        ...state,
        selected: action.payload,
        pending: false,
        message: 'Published.'
      }

    case DELETE_UPDATE_SUCCESS:
      return {
        ...state,
        selected: action.payload,
        pending: false,
        message: 'Deleted.'
      }

    case PUBLISH_REPORT_FAILURE:
    case PUBLISH_UPDATE_FAILURE:
    case DELETE_UPDATE_FAILURE:
      return {
        ...state,
        error: true,
        message: action.payload,
        pending: false
      }

    case UNPUBLISH_REPORT:
    case UNPUBLISH_UPDATE:
      return {
        ...state,
        error: false,
        message: null,
        pending: true
      }

    case UNPUBLISH_REPORT_SUCCESS:
    case UNPUBLISH_UPDATE_SUCCESS:
      return {
        ...state,
        selected: action.payload,
        pending: false,
        message: 'Unpublished report.'
      }

    case UNPUBLISH_REPORT_FAILURE:
    case UNPUBLISH_UPDATE_FAILURE:
      return {
        ...state,
        error: true,
        message: action.payload,
        pending: false
      }

    case NEW_REPORT:
      newList = state.list
      newList.push(action.payload)
      return {
        ...state,
        list: newList,
        selected: action.payload,
        isFetching: !state.isFetching
      }

      case UPDATE_REPORT_REQUESTED:
        return {
          ...state,
          isFetching: true
        }

      case UPDATE_REPORT:
        newReport = state.selected
        if (action.payload.description !== null) {
          newReport.description = action.payload.description
        }
        return {
          ...state,
          selected: newReport,
          isFetching: !state.isFetching
        }

    case UPDATE_REPORT_SCORE_REQUESTED:
      return {
        ...state,
        isFetching: true
      }

    case UPDATE_REPORT_SCORE:
      newReport = {
        ...state.selected,
        scores: state.selected.scores.map(score => {
          return((score.id === action.payload.id) ? action.payload : score)
        })
      }

      newList = state.list
      newList.push(newReport)

      return {
        ...state,
        list: newList,
        selected: newReport,
        isFetching: !state.isFetching
      }

      case UPDATE_CATEGORY_SCORES:
        return {
          ...state,
          error: false,
          message: null,
          pending: true
        }

      case UPDATE_CATEGORY_SCORES_SUCCESS:
        newScores = state.selected.scores.map(score => {
          if (score.id === action.payload.id) {
            return action.payload
          } else {
            return score
          }
        })
        return {
          ...state,
          selected: {
            ...state.selected,
            scores: newScores
          },
          pending: false,
          message: 'Category metrics updated.'
        }

      case UPDATE_CATEGORY_SCORES_FAILURE:
        return {
          ...state,
          error: true,
          message: action.payload,
          pending: false
        }

      case POST_NOTE_COMMENT_SUCCESS:
        return {
          ...state,
          selected: {
            ...state.selected,
            noteComments: [...state.selected.noteComments, action.payload]
          }
        }

      case UPDATE_NOTE_COMMENT_SUCCESS:
        newNoteComments = state.selected.noteComments.map(comment => {
          if (comment.id === action.payload.id) {
            return action.payload
          } else {
            return comment
          }
        })
        return {
          ...state,
          selected: {
            ...state.selected,
            noteComments: newNoteComments
          }
        }

      case REMOVE_NOTE_COMMENT_SUCCESS:
        noteCommentsUpdated = state.selected.noteComments
        if(action.payload.status === 'ok') {
          noteCommentsUpdated = noteCommentsUpdated.filter(comment => comment.id.toString() !== action.payload.id)
        }
        return {
          ...state,
          selected: {
            ...state.selected,
            noteComments: noteCommentsUpdated
          }
        }

      case NOT_SIGNIFICANT_CHANGE_TO_CATEGORY_SCORE:
        return {
          ...state,
          pending: false,
          message: 'Not a significant change to score to be updated!'
        }

    default:
      return state
  }
}

// ACTIONS /////////////////////////////////////////////////////////////////////
export function deleteUpdate(id) {
  return dispatch => {
    dispatch({ type: DELETE_UPDATE })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.delete(`/api/updates/${id}`)
      .then((response) => {
        if (response.data.status === 'error') {
          dispatch({ type: DELETE_UPDATE_FAILURE, payload: response.data.message })
          localStorage.setItem('jwt-rencyhq', '')
          dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
        } else {
          dispatch({ type: DELETE_UPDATE_SUCCESS, payload: response.data })
        }
      })
      .catch((error) => {
        localStorage.setItem('jwt-rencyhq', '')
        dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
      })
  }
}

export function fetchReports() {
  return dispatch => {
    dispatch({ type: FETCH_REPORTS_REQUESTED })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.get('/api/reports')
      .then((response) => {
        dispatch({ type: FETCH_REPORTS, payload: response.data })
      })
      .catch((error) => {
        localStorage.setItem('jwt-rencyhq', '')
        dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
      })
  }
}

export function fetchReport(slug) {
  return dispatch => {
    dispatch({ type: FETCH_REPORT_REQUESTED })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.get(`/api/reports/${slug}`)
      .then((response) => {
        dispatch({ type: FETCH_REPORT, payload: response.data })
      })
      .catch((error) => {
        localStorage.setItem('jwt-rencyhq', '')
        dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
      })
  }
}

export function publishReport(slug) {
  return dispatch => {
    dispatch({ type: PUBLISH_REPORT })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.patch(`/api/reports/${slug}/publish`)
      .then((response) => {
        if (response.data.status === 'error') {
          dispatch({ type: PUBLISH_REPORT_FAILURE, payload: response.data.message })
          localStorage.setItem('jwt-rencyhq', '')
          dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
        } else {
          dispatch({ type: PUBLISH_REPORT_SUCCESS, payload: response.data })
        }
      })
      .catch((error) => {
        localStorage.setItem('jwt-rencyhq', '')
        dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
      })
  }
}

export function unpublishReport(slug) {
  return dispatch => {
    dispatch({ type: UNPUBLISH_REPORT })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.patch(`/api/reports/${slug}/unpublish`)
      .then((response) => {
        if (response.data.status === 'error') {
          dispatch({ type: UNPUBLISH_REPORT_FAILURE, payload: response.data.message })
          localStorage.setItem('jwt-rencyhq', '')
          dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
        } else {
          dispatch({ type: UNPUBLISH_REPORT_SUCCESS, payload: response.data })
        }
      })
      .catch((error) => {
        dispatch({ type: UNPUBLISH_REPORT_FAILURE, payload: error.message })
        localStorage.setItem('jwt-rencyhq', '')
        dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
      })
  }
}

export function publishUpdate(id) {
  return dispatch => {
    dispatch({ type: PUBLISH_UPDATE })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.patch(`/api/updates/${id}/publish`)
      .then((response) => {
        if (response.data.status === 'error') {
          dispatch({ type: PUBLISH_UPDATE_FAILURE, payload: response.data.message })
          localStorage.setItem('jwt-rencyhq', '')
          dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
        } else {
          dispatch({ type: PUBLISH_UPDATE_SUCCESS, payload: response.data })
        }
      })
      .catch((error) => {
        localStorage.setItem('jwt-rencyhq', '')
        dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
      })
  }
}

export function unpublishUpdate(id) {
  return dispatch => {
    dispatch({ type: UNPUBLISH_UPDATE })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.patch(`/api/updates/${id}/unpublish`)
      .then((response) => {
        if (response.data.status === 'error') {
          dispatch({ type: UNPUBLISH_UPDATE_FAILURE, payload: response.data.message })
          localStorage.setItem('jwt-rencyhq', '')
          dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
        } else {
          dispatch({ type: UNPUBLISH_UPDATE_SUCCESS, payload: response.data })
        }
      })
      .catch((error) => {
        dispatch({ type: UNPUBLISH_UPDATE_FAILURE, payload: error.message })
        localStorage.setItem('jwt-rencyhq', '')
        dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
      })
  }
}

export function createReport(values, callback) {
  return dispatch => {
    dispatch({ type: NEW_REPORT_REQUESTED })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.post('/api/reports/', values)
      .then((response) => {
        dispatch({ type: NEW_REPORT, payload: response.data })
        callback(response.data.slug)
      })
      .catch((error) => {
        localStorage.setItem('jwt-rencyhq', '')
        dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
      })
  }
}

export function updateReport(slug, value) {
  return dispatch => {
    dispatch({ type: UPDATE_REPORT_REQUESTED })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.put(`/api/reports/${slug}`, {
      description: value
    }).then((response) => {
      dispatch({ type: UPDATE_REPORT, payload: response.data })
    }).catch((error) => {
      localStorage.setItem('jwt-rencyhq', '')
      dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
    })
  }
}

export function updateReportScore(slug, updates) {
  return dispatch => {
    dispatch({ type: UPDATE_REPORT_SCORE_REQUESTED })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.put(`/api/category_scores/${slug}`, updates)
      .then((response) => {
        // TODO: This should send back an updated score
        dispatch({ type: UPDATE_REPORT_SCORE, payload: response.data })
      })
      .catch((error) => {
        localStorage.setItem('jwt-rencyhq', '')
        dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
      })
  }
}

export function updateCategoryScores(score, updates, newValue, callback) {
  return dispatch => {
    dispatch({ type: UPDATE_CATEGORY_SCORES })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.patch(`/api/category_scores/${score.slug}/metrics`, {updates: updates})
      .then((response) => {
        if (response.status === 'error') {
          dispatch({ type: UPDATE_CATEGORY_SCORES_FAILURE, payload: response.data })
          localStorage.setItem('jwt-rencyhq', '')
          dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
        } else {
          if(Math.floor(newValue) - Math.floor(score.value) >= 1 || Math.floor(score.value) - Math.floor(newValue) >= 2) {
            dispatch({ type: UPDATE_CATEGORY_SCORES_SUCCESS, payload: response.data })
          } else {
            dispatch({ type: NOT_SIGNIFICANT_CHANGE_TO_CATEGORY_SCORE })
          }
        }
        callback(response.status)
      })
      .catch((error) => {
        dispatch({ type: UPDATE_CATEGORY_SCORES_FAILURE, payload: error.data })
        localStorage.setItem('jwt-rencyhq', '')
        dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
      })
  }
}

export function refreshReport(slug, callback) {
  return dispatch => {
    dispatch({ type: REFRESH_REPORT_REQUESTED })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.patch(`/api/reports/${slug}/refresh`)
      .then((response) => {
        if (response.status === 'error') {
          dispatch({ type: REFRESH_REPORT_ERROR, payload: response.data })
          localStorage.setItem('jwt-rencyhq', '')
          dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
        } else {
          dispatch({ type: REFRESH_REPORT, payload: response.data })
        }
        callback(response.status)
      })
      .catch((error) => {
        dispatch({ type: REFRESH_REPORT_ERROR, payload: error.data })
      })
  }
}

export function syncReportScores(slug, callback) {
  return dispatch => {
    dispatch({ type: SYNC_REPORT_SCORES_REQUESTED })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.patch(`/api/reports/${slug}/refresh_category_scores`)
      .then((response) => {
        dispatch({ type: SYNC_REPORT_SCORES, payload: response.data })
        callback(response.data.status)
      })
      .catch((error) => {
        localStorage.setItem('jwt-rencyhq', '')
        dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
      })
  }
}

export function createNoteComment(values) {
  return dispatch => {
    dispatch({ type: POST_NOTE_COMMENT_REQUESTED })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.post('/api/note_comments', values)
      .then((response) => {
        dispatch({ type: POST_NOTE_COMMENT_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        localStorage.setItem('jwt-rencyhq', '')
        dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
      })
  }
}

export function removeNoteComment(id) {
  return dispatch => {
    dispatch({ type: REMOVE_NOTE_COMMENT_REQUESTED })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.delete(`/api/note_comments/${id}`)
      .then((response) => {
        dispatch({ type: REMOVE_NOTE_COMMENT_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        localStorage.setItem('jwt-rencyhq', '')
        dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
      })
  }
}

export function updateNoteComment(id, value) {
  return dispatch => {
    dispatch({ type: UPDATE_NOTE_COMMENT_REQUESTED })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-rencyhq')
    axios.put(`/api/note_comments/${id}`, value)
      .then((response) => {
        dispatch({ type: UPDATE_NOTE_COMMENT_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        localStorage.setItem('jwt-rencyhq', '')
        dispatch({ type: 'user/LOGOUT_USER_SUCCESS' })
      })
  }
}
