import Vue from 'vue'
import Axios from 'axios'
import Qs from 'qs'

const configAxios = () => {
  Axios.defaults.baseURL = '/api'
  Axios.defaults.paramsSerializer = (params) => {
    return Qs.stringify(params, {arrayFormat: 'repeat'})
  }
  Axios.interceptors.request.use(config => {
    if (!config.ignoreHeader) {
      if (config.headers) {
        config.headers['X_Platform'] = '1'
      }
    }
    return config
  })
  Axios.interceptors.response.use(
    response => {
      return response
    },
    error => {
      if (error && error.config && error.config.ignoreError) {
        console.log('error', error)
      } else {
        Vue.$my.handleError(error)
      }
      return Promise.reject(error)
    })
}

(function () {
  configAxios()
})()
