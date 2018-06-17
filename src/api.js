import axios from 'axios'

if (process.env.REACT_APP_API_SOURCE !== undefined) {
  axios.interceptors.request.use(function (config) {
    const url = process.env.REACT_APP_API_SOURCE
    config.url = url + config.url
    return config
  })
}
