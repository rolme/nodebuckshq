import { createReducer } from "redux-action"
import axios from 'axios'

export const FETCH = "users/FETCH"
export const FETCH_SUCCESS = "users/FETCH_SUCCESS"
export const FETCH_FAILURE = "users/FETCH_FAILURE"
export const DISABLE_USER = "users/DISABLE_USER"
export const DISABLE_USER_SUCCESS = "users/DISABLE_USER_SUCCESS"
export const DISABLE_USER_FAILURE = "users/DISABLE_USER_FAILURE"
export const ENABLE_USER = "users/ENABLE_USER"
export const ENABLE_USER_SUCCESS = "users/ENABLE_USER_SUCCESS"
export const ENABLE_USER_FAILURE = "users/ENABLE_USER_FAILURE"
export const FETCH_USER = "users/FETCH_USER"
export const FETCH_USER_SUCCESS = "users/FETCH_USER_SUCCESS"
export const FETCH_USER_FAILURE = "users/FETCH_USER_FAILURE"
export const UPDATE_USER_ID_VERIFICATION_STATUS = 'user/UPDATE_USER_ID_VERIFICATION_STATUS'
export const UPDATE_USER_ID_VERIFICATION_STATUS_SUCCESS = 'user/UPDATE_USER_ID_VERIFICATION_STATUS_SUCCESS'
export const UPDATE_USER_ID_VERIFICATION_STATUS_FAILURE = 'user/UPDATE_USER_ID_VERIFICATION_STATUS_FAILURE'
export const UPDATE_AFFILIATES = 'user/UPDATE_AFFILIATES'
export const UPDATE_AFFILIATES_SUCCESS = 'user/UPDATE_AFFILIATES_SUCCESS'
export const UPDATE_AFFILIATES_FAILURE = 'user/UPDATE_AFFILIATES_FAILURE'
export const REMOVE_AFFILIATES = 'user/REMOVE_AFFILIATES'
export const REMOVE_AFFILIATES_SUCCESS = 'user/REMOVE_AFFILIATES_SUCCESS'
export const REMOVE_AFFILIATES_FAILURE = 'user/REMOVE_AFFILIATES_FAILURE'

const initialState = {
  data: {},
  error: false,
  message: '',
  list: [],
  pending: false,
  verifications: [],
  verificationError: false,
  verificationMessage: '',
}

export const fetchUsers = (verificationPendingUsers = false) => {
  return dispatch => {
    dispatch({ type: FETCH })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/users?verification_pending_users=${verificationPendingUsers}`).then(response => {
      if ( response.data.status === 'error' ) {
        dispatch({ type: FETCH_FAILURE, payload: response.data })
      } else {
        dispatch({ type: FETCH_SUCCESS, payload: { data: response.data, verificationPendingUsers } })
      }
    }).catch(err => {
      dispatch({ type: FETCH_FAILURE, payload: err.data })
    })
  }
}

export const fetchUser = (slug) => {
  return dispatch => {
    dispatch({ type: FETCH_USER })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/users/${slug}`).then(response => {
      if ( response.data.status === 'error' ) {
        dispatch({ type: FETCH_USER_FAILURE, payload: response.data })
      } else {
        dispatch({ type: FETCH_USER_SUCCESS, payload: { data: response.data } })
      }
    }).catch(err => {
      dispatch({ type: FETCH_USER_FAILURE, payload: err.data })
    })
  }
}

export const enableUser = (slug) => {
  return dispatch => {
    dispatch({ type: ENABLE_USER })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/users/${slug}/enable`).then(response => {
      if ( response.data.status === 'error' ) {
        dispatch({ type: ENABLE_USER_FAILURE, payload: response.data })
      } else {
        dispatch({ type: ENABLE_USER_SUCCESS, payload: response.data })
      }
    }).catch(err => {
      dispatch({ type: ENABLE_USER_FAILURE, payload: err.data })
    })
  }
}

export const disableUser = (slug) => {
  return dispatch => {
    dispatch({ type: DISABLE_USER })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/users/${slug}/disable`).then(response => {
      if ( response.data.status === 'error' ) {
        dispatch({ type: DISABLE_USER_FAILURE, payload: response.data })
      } else {
        dispatch({ type: DISABLE_USER_SUCCESS, payload: response.data })
      }
    }).catch(err => {
      dispatch({ type: DISABLE_USER_FAILURE, payload: err.data })
    })
  }
}

export function updateUserIdVerificationStatus(slug, status, callback) {
  return dispatch => {
    dispatch({ type: UPDATE_USER_ID_VERIFICATION_STATUS })
    axios.patch(`/api/users/${slug}/${status}`).then(response => {
      dispatch({ type: UPDATE_USER_ID_VERIFICATION_STATUS_SUCCESS, payload: { data: response.data, slug } })
      callback();
    })
      .catch((error) => {
        dispatch({ type: UPDATE_USER_ID_VERIFICATION_STATUS_FAILURE, payload: error.message })
        callback();
      })
  }
}

export function updateAffiliates(slug, tier1Slug) {
  return dispatch => {
    dispatch({ type: UPDATE_AFFILIATES })
    axios.patch(`/api/users/${slug}/update_affiliates`, { tier1_slug: tier1Slug })
    .then(response => {
      dispatch({ type: UPDATE_AFFILIATES_SUCCESS, payload: response.data })
    })
    .catch((error) => {
      dispatch({ type: UPDATE_AFFILIATES_FAILURE, payload: error.message })
    })
  }
}

export function removeAffiliates(slug) {
  return dispatch => {
    dispatch({ type: REMOVE_AFFILIATES })
    axios.patch(`/api/users/${slug}/remove_affiliates`)
    .then(response => {
      dispatch({ type: REMOVE_AFFILIATES_SUCCESS, payload: response.data })
    })
    .catch((error) => {
      dispatch({ type: REMOVE_AFFILIATES_FAILURE, payload: error.message })
    })
  }
}

export default createReducer(initialState, ({
  [ FETCH ]: (payload, state) => {
    return {
      ...state,
      error: false,
      pending: true
    }
  },
  [ FETCH_SUCCESS ]: (payload, state) => {
    if ( payload.verificationPendingUsers ) {
      return {
        ...state,
        error: false,
        pending: false,
        verifications: payload.data
      }
    }
    else {
      return {
        ...state,
        error: false,
        pending: false,
        list: payload.data
      }
    }
  },
  [ FETCH_FAILURE ]: (payload, state) => {
    return {
      ...state,
      error: true,
      pending: false,
      message: payload
    }
  },
  [ ENABLE_USER ]: (payload, state) => {
    return {
      ...state,
      error: false,
      pending: true
    }
  },
  [ DISABLE_USER ]: (payload, state) => {
    return {
      ...state,
      error: false,
      pending: true
    }
  },
  [ FETCH_USER ]: (payload, state) => {
    return {
      ...state,
      error: false,
      pending: true
    }
  },
  [ FETCH_USER_SUCCESS ]: (payload, state) => {
      return {
        ...state,
        error: false,
        pending: false,
        data: payload.data
      }
  },
  [ ENABLE_USER_SUCCESS ]: (payload, state) => {
    return {
      ...state,
      data: payload.data,
      error: false,
      list: merge(state.list, payload.data),
      pending: false
    }
  },
  [ DISABLE_USER_SUCCESS ]: (payload, state) => {
    return {
      ...state,
      data: payload.data,
      error: false,
      list: merge(state.list, payload.data),
      pending: false
    }
  },
  [ FETCH_USER_FAILURE ]: (payload, state) => {
    return {
      ...state,
      error: true,
      pending: false,
      message: payload
    }
  },
  [ ENABLE_USER_FAILURE ]: (payload, state) => {
    return {
      ...state,
      error: true,
      pending: false,
      message: payload
    }
  },
  [ DISABLE_USER_FAILURE ]: (payload, state) => {
    return {
      ...state,
      error: true,
      pending: false,
      message: payload
    }
  },
  [ UPDATE_USER_ID_VERIFICATION_STATUS ]: (payload, state) => {
    return {
      ...state,
      verificationError: false,
      verificationMessage: ''
    }
  },
  [ UPDATE_USER_ID_VERIFICATION_STATUS_SUCCESS ]: (payload, state) => {
    let verifications = [ ...state.verifications ];
    const index = verifications.findIndex(v => v.slug === payload.slug)
    verifications.splice(index, 1);
    return {
      ...state,
      verifications,
      verificationMessage: payload.data.message
    }
  },
  [ UPDATE_USER_ID_VERIFICATION_STATUS_FAILURE ]: (payload, state) => {
    return {
      ...state,
      verificationError: true,
      verificationMessage: payload
    }
  },
  [ UPDATE_AFFILIATES_SUCCESS ]: (payload, state) => {
    return {
      ...state,
      data: {
        ...state.data,
        affiliates: payload.affiliates,
      }
    }
  },
  [ REMOVE_AFFILIATES_SUCCESS ]: (payload, state) => {
    return {
      ...state,
      data: {
        ...state.data,
        affiliates: payload.affiliates,
      }
    }
  },
}))

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
