import Vue from 'vue'
import Axios from 'axios'
import { UPDATE_ME } from 'src/store/types'
import qs from 'qs'
import { clearAuthCookie } from 'src/service/auth/index'

export const login = (params) => {
  return Axios.post('/tenant/pub/login', params)
    .then(res => {
      Vue.$store.commit(UPDATE_ME, res.data)
      return res
    })
}

export const logout = () => {
  return Axios.get('/tenant/pub/logout', {
    ignoreError: true
  }).then(res => {
    Vue.$store.commit(UPDATE_ME, null)
    Vue.$router.replace({
      name: 'Login'
    })
    return res
  }).catch((ex) => {
    Vue.$store.commit(UPDATE_ME, null)
    clearAuthCookie()
    Vue.$router.replace({
      name: 'Login'
    })
    return ex
  })
}
export const Verification = () => {
  return Axios.get('/tenant/pub/captcha')
}
export const loginVerification = (id, code) => {
  let formData = {
    id: id,
    code: code
  }
  return Axios.post('/tenant/pub/captcha/verify', qs.stringify(formData))
}

// 获取小程序授权需要的信息
export const getAuthorizeData = () => {
  return Axios.get('/tenant/uc/pre_auth_msg')
}
