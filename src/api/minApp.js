import Axios from 'axios'

export const getList = (tenantId) => {
  return Axios.get(`/tenant/t/${tenantId}/page/home`)
}
export const update = (tenantId, formData) => {
  return Axios.post(`/tenant/t/${tenantId}/page/home`, formData)
}
