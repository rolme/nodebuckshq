import axios from 'axios'

let api = 'https://nodebucks.herokuapp.com'
if (process.env.REACT_APP_NODEBUCKS_API !== undefined) {
  api = process.env.REACT_APP_NODEBUCKS_API
}

axios.interceptors.request.use(function (config) {
  if ( !config.url.includes('http') ) {
    config.url = api + config.url
  }
  return config
})
