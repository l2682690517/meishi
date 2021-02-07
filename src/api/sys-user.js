import Axios from 'axios'
import * as R from 'ramda'

export const getList = (params) => {
  return Axios.get('/tenant/sys', {
    params: params
  })
}

export const getItem = (id) => {
  return Axios.get(`/tenant/sys/s/${id}`)
}

export const create = (form) => {
  return Axios.post('/tenant/sys', R.pickAll(['name', 'mobile', 'passwd', 'roles'])(form))
}

export const update = (id, form) => {
  return Axios.post(`/tenant/sys/s/${id}`, R.pickAll(['name', 'mobile', 'passwd', 'roles'])(form))
}

export const enable = (id) => {
  return Axios.post(`/tenant/sys/s/${id}/enable`)
}

export const disable = (id) => {
  return Axios.post(`/tenant/sys/s/${id}/disable`)
}
