import axios from 'axios'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const FETCH = 'cryptos/FETCH'
export const FETCH_ERROR = 'cryptos/FETCH_ERROR'
export const FETCH_SUCCESS = 'cryptos/FETCH_SUCCESS'
export const FETCH_LIST = 'cryptos/FETCH_LIST'
export const FETCH_LIST_ERROR = 'cryptos/FETCH_LIST_ERROR'
export const FETCH_LIST_SUCCESS = 'cryptos/FETCH_LIST_SUCCESS'
export const UPDATE = 'cryptos/UPDATE'
export const UPDATE_ERROR = 'cryptos/UPDATE_ERROR'
export const UPDATE_SUCCESS = 'cryptos/UPDATE_SUCCESS'
export const TEST_REWARD_SCRAPER='cryptos/TEST_REWARD_SCRAPER'
export const TEST_REWARD_SCRAPER_SUCCESS = 'cryptos/TEST_REWARD_SCRAPER_SUCCESS'
export const TEST_REWARD_SCRAPER_ERROR = 'cryptos/TEST_REWARD_SCRAPER_ERROR'

// INITIAL STATE ///////////////////////////////////////////////////////////////
const initialState = {
  data: {},
  list: [],
  pending: false,
  error: false,
  errorUpdating: false,
  message: '',
  updateMessage: ''
}

// STATE ///////////////////////////////////////////////////////////////////////
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH:
    case FETCH_LIST:
      return {
        ...state,
        pending: true,
        error: false,
        message: ''
      }

    case UPDATE: {
      return {
        ...state,
        errorUpdating: false,
        updateMessage: ''
      }
    }

    case FETCH_ERROR:
    case FETCH_LIST_ERROR:
      return {
        ...state,
        pending: false,
        error: true,
        message: action.payload.message
      }

    case UPDATE_ERROR:
      return {
        ...state,
        errorUpdating: true,
        updateMessage: action.payload.message
      }

    case FETCH_SUCCESS:
      return {
        ...state,
        data: action.payload,
        pending: false,
        error: false,
        message: 'Fetch cryptocurrency successful.'
      }

    case FETCH_LIST_SUCCESS:
      return {
        ...state,
        list: action.payload,
        pending: false,
        error: false,
        message: 'Fetch cryptocurrency list successful.'
      }

    case UPDATE_SUCCESS:
      return {
        ...state,
        data: action.payload,
        pending: false,
        errorUpdating: false,
        updateMessage: 'Update cryptocurrency successful.'
      }

    default:
      return state
  }
}

// ACTIONS /////////////////////////////////////////////////////////////////////
export function fetchCrypto(slug, orders = true) {
  return dispatch => {
    dispatch({ type: FETCH })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/cryptos/${slug}?orders=${orders}`)
      .then((response) => {
        dispatch({ type: FETCH_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function fetchCryptos() {
  return dispatch => {
    dispatch({ type: FETCH_LIST })
    axios.get('/api/cryptos')
      .then((response) => {
        dispatch({ type: FETCH_LIST_SUCCESS, payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: FETCH_LIST_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function updateCrypto(slug, data) {
  return dispatch => {
    dispatch({ type: UPDATE })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/cryptos/${slug}`, { crypto: data })
      .then((response) => {
      dispatch({ type: UPDATE_SUCCESS, payload: response.data })
      }).catch((error) => {
        dispatch({ type: UPDATE_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

export function testRewardScraper(slug, wallet, date) {
  return dispatch => {
    dispatch({ type: TEST_REWARD_SCRAPER })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/cryptos/${slug}/reward_scraper?wallet=${wallet}&date=${date}`)
      .then((response) => {
      dispatch({ type: TEST_REWARD_SCRAPER_SUCCESS, payload: response.data })
      }).catch((error) => {
        dispatch({ type: TEST_REWARD_SCRAPER_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}
