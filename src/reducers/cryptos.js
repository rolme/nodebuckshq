import axios from 'axios'

// ACTION_TYPES ////////////////////////////////////////////////////////////////
export const DELIST = 'cryptos/DELIST'
export const DELIST_ERROR = 'cryptos/DELIST_ERROR'
export const DELIST_SUCCESS = 'cryptos/DELIST_SUCCESS'
export const FETCH = 'cryptos/FETCH'
export const FETCH_ERROR = 'cryptos/FETCH_ERROR'
export const FETCH_SUCCESS = 'cryptos/FETCH_SUCCESS'
export const FETCH_LIST = 'cryptos/FETCH_LIST'
export const FETCH_LIST_ERROR = 'cryptos/FETCH_LIST_ERROR'
export const FETCH_LIST_SUCCESS = 'cryptos/FETCH_LIST_SUCCESS'
export const RELIST = 'cryptos/RELIST'
export const RELIST_ERROR = 'cryptos/RELIST_ERROR'
export const RELIST_SUCCESS = 'cryptos/RELIST_SUCCESS'
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
  updateMessage: '',
  isScraping: false,
  rewarderError: false,
  rewarderMessage: '',
  successfullyScraped: false,
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
        message: '',
        rewarderError: false,
        rewarderMessage: '',
        successfullyScraped: false,
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
        updateMessage: action.payload.message || 'Something went wrong, please try again.'
      }

    case FETCH_SUCCESS:
      return {
        ...state,
        data: action.payload,
        list: updateList(state.list, action.payload),
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
        list: updateList(state.list, action.payload),
        pending: false,
        errorUpdating: false,
        updateMessage: 'Update cryptocurrency successful.'
      }

    case TEST_REWARD_SCRAPER:
      return {
        ...state,
        rewarderError: false,
        rewarderMessage: '',
        successfullyScraped: false,
        isScraping: true,
      }

    case TEST_REWARD_SCRAPER_SUCCESS:
      return {
        ...state,
        rewarderError: false,
        rewarderMessage: action.payload.message,
        successfullyScraped: action.payload,
        isScraping: false,
      }

    case TEST_REWARD_SCRAPER_ERROR:
      return {
        ...state,
        rewarderError: true,
        rewarderMessage: action.payload.message,
        successfullyScraped: false,
        isScraping: false,
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

export const relistCrypto = (slug) => {
  return dispatch => {
    dispatch({ type: RELIST })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/cryptos/${slug}/relist`).then(response => {
      if ( response.data.status === 'error' ) {
        dispatch({ type: RELIST_ERROR, payload: response.data })
      } else {
        dispatch({ type: RELIST_SUCCESS, payload: response.data })
      }
    }).catch(err => {
      dispatch({ type: RELIST_ERROR, payload: err.data })
    })
  }
}

export const delistCrypto = (slug) => {
  return dispatch => {
    dispatch({ type: DELIST })
    axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.patch(`/api/cryptos/${slug}/delist`).then(response => {
      if ( response.data.status === 'error' ) {
        dispatch({ type: DELIST_ERROR, payload: response.data })
      } else {
        dispatch({ type: DELIST_SUCCESS, payload: response.data })
      }
    }).catch(err => {
      dispatch({ type: DELIST_ERROR, payload: err.data })
    })
  }
}

export function testRewardScraper(slug, wallet, date) {
  return dispatch => {
    dispatch({ type: TEST_REWARD_SCRAPER })
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwt-nodebuckshq')
    axios.get(`/api/cryptos/${slug}/test_reward_scraper?wallet=${wallet}&date=${new Date(date)}`)
      .then((response) => {
        if(response.data.status !== 'error') {
          dispatch({ type: TEST_REWARD_SCRAPER_SUCCESS, payload: response.data })
        } else {
          dispatch({ type: TEST_REWARD_SCRAPER_ERROR, payload: response.data })
        }
      }).catch((error) => {
        dispatch({ type: TEST_REWARD_SCRAPER_ERROR, payload: {message: error.data} })
        console.log(error)
      })
  }
}

function updateList(list, item) {
  return list.map(i => { return (i.slug === item.slug) ? item : i })
}
