import Axios from 'axios'

export const getUserList = (tid, params) => {
  return Axios.get(`/tenant/t/${tid}/user`, {
    params: params
  })
}
export const getUserDetail = (tid, id) => {
  return Axios.get(`/tenant/t/${tid}/user/s/${id}`)
}
