import Axios from 'axios/index'
import qs from 'qs'

export const online = (tenantId) => {
  return Axios.get(`/tenant/base/tenant/${tenantId}/online`)
}

export const offline = (tenantId) => {
  return Axios.get(`/tenant/base/tenant/${tenantId}/offline`)
}

export const versionFirst = () => {
  return Axios.get(`/tenant/version/first`)
}

export const versionAll = () => {
  return Axios.get(`/tenant/version`)
}

export const updateSlogan = (tenantId, text) => {
  let formData = {
    text
  }
  return Axios.post(`/tenant/base/tenant/${tenantId}/slogan`, qs.stringify(formData))
}
