import Axios from 'axios'

export const getTagGroupList = (tenantId) => {
  return Axios.get(`/tenant/t/${tenantId}/service_tag_group`)
}
