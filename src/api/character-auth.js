import Axios from 'axios'

export const getTenantRoleList = () => {
  return Axios.get(`/tenant/role`)
}
export const deleteTenantRole = (id) => {
  return Axios.delete(`/tenant/role/s/${id}`)
}
export const getTenantRoleItem = (id) => {
  return Axios.get(`/tenant/role/s/${id}`)
}
export const getAuthGroup = () => {
  return Axios.get(`/tenant/auth_group`)
}
export const editTenantRole = (formData) => {
  return Axios.post(`/tenant/role/s/${formData.id}`, formData)
}
export const createTenantRole = (formData) => {
  return Axios.post(`/tenant/role/`, formData)
}
