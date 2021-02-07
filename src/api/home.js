import Axios from 'axios'

export const getHomeData = (tid) => {
  return Axios.get(`/tenant/t/${tid}/home`)
}
