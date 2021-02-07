import Axios from 'axios'

export const getList = (tenantId) => {
  return Axios.get(`/tenant/t/${tenantId}/delivery/region`)
}
