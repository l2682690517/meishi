import Axios from 'axios'

export const create = (tenantId, formData) => {
  return Axios.post(`/tenant/t/${tenantId}/product_group`, formData)
}
export const edit = (tenantId, id, formData) => {
  return Axios.post(`/tenant/t/${tenantId}/product_group/s/${id}`, formData)
}
export const getList = (id) => {
  return Axios.get(`/tenant/t/${id}/product_group`)
}
export const getItem = (tenantId, id) => {
  return Axios.get(`/tenant/t/${tenantId}/product_group/s/${id}`)
}
export const deleteListItem = (tenantId, id) => {
  return Axios.delete(`/tenant/t/${tenantId}/product_group/s/${id}`)
}
