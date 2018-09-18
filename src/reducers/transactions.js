import { createReducer } from "redux-action"
import axios from 'axios'
import cloneDeep from 'lodash/cloneDeep';

export const FETCH = "transactions/FETCH"
export const FETCH_SUCCESS = "transactions/FETCH_SUCCESS"
export const FETCH_FAILURE = "transactions/FETCH_FAILURE"

export const UPDATE = "transactions/UPDATE"
export const UPDATE_SUCCESS = "transactions/UPDATE_SUCCESS"
export const UPDATE_FAILURE = "transactions/UPDATE_FAILURE"

const initialState = {
  list: [],
  error: false,
  message: '',
  fetching: false,
}

export const fetchTransactions = (fetchMoreType = 'none', offset = 0, callback) => {
  return dispatch => {
    dispatch({ type: FETCH })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/transactions?${fetchMoreType ? `${fetchMoreType}=${offset}` : ''}`).then(response => {
      if (response.data.status === 'error') {
        dispatch({ type: FETCH_FAILURE, payload: response.data })
      } else {
        dispatch({ type: FETCH_SUCCESS, payload: { data: response.data, fetchMoreType }})
        callback()
      }
    }).catch(err => {
      dispatch({ type: FETCH_FAILURE, payload: err.data })
    })
  }
}

export const updateTransaction = (id, data) => {
  return dispatch => {
    dispatch({ type: UPDATE })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
   axios.patch(`/api/transactions/${id}`, { transaction: data }).then(response => {
      if (response.data.status === 'error') {
        dispatch({ type: UPDATE_FAILURE, payload: response.data })
      } else {
        dispatch({ type: UPDATE_SUCCESS, payload: { data: response.data }})
      }
    }).catch(err => {
      dispatch({ type: UPDATE_FAILURE, payload: err.data })
    })
  }
}

export default createReducer(initialState, ({
  [FETCH]: (payload, state) => {
    return {
      ...state,
      error: false,
      fetching: true
    }
  },
  [FETCH_SUCCESS]: (payload, state) => {
    let _list = cloneDeep(state.list);
    if(payload.fetchMoreType === 'pending_offset') {
      _list.pending = [..._list.pending, ...payload.data.pending] 
    } else if(payload.fetchMoreType === 'processed_offset') {
      _list.processed = [..._list.processed, ...payload.data.processed]
    } else if(payload.fetchMoreType === 'canceled_offset') {
      _list.canceled = [..._list.canceled, ...payload.data.canceled]
    } else {
      _list = payload.data
    }

    return {
      ...state,
      error: false,
      fetching: false,
      list: _list
    }
  },
  [UPDATE_SUCCESS]: (payload, state) => {
    const status = payload.data.status
    let list = state.list
    const index = list.pending.findIndex(tx => tx.id === payload.data.id)

    if(status === 'processed') {
      list.pending.splice(index, 1)
      list.processed = [...state.list.processed, payload.data]
      list.processedTotal += 1
      list.pendingTotal -= 1
    } else if(status === 'canceled') {
      list.pending.splice(index, 1)
      list.canceled = [...state.list.canceled, payload.data]
      list.canceledTotal += 1
      list.pendingTotal -= 1
    } else {
      list.pending[index] = payload.data
    }

    return {
      ...state,
    }
  },
  [FETCH_FAILURE]: (payload, state) => {
    return {
      ...state,
      error: true,
      fetching: false,
      message: payload
    }
  },
  [UPDATE_FAILURE]: (payload, state) => {
    return {
      ...state,
      error: true,
      message: payload
    }
  },
}))
