import Vue from 'vue'
import Axios from 'axios'
import { UPDATE_ME } from 'src/store/types'

export const getMe = (config) => {
  return Axios.get('/tenant/uc', {
    ignoreError: true
  }).then(res => {
    Vue.$store.commit(UPDATE_ME, res.data)
    return res
  })
}

export const updatePassword = ({old_passwd, new_passwd}) => {
  const params = {
    old_passwd,
    new_passwd
  }
  return Axios.post('/tenant/uc/passwd', params)
}
