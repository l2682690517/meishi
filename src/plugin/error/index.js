import Vue from 'vue'
import { UPDATE_ME } from 'src/store/types'

const COMMON_ERROR_MESSAGE = '查询失败'
const NET_CODE_401_ERROR_MSG = '没有权限, 请重新登录'

const commonErrorHandler = (_, msg) => {
  Vue.prototype.$message({
    message: msg,
    type: 'error'
  })
  return true
}

const axiosErrorHandler = (err) => {
  if (err.response) {
    if (err.response.status === 401) {
      Vue.prototype.$message({
        message: NET_CODE_401_ERROR_MSG,
        type: 'error'
      })
      Vue.$store.commit(UPDATE_ME, null)
      Vue.$router.replace({
        name: 'Login'
      })
      return true
    }
    let msg = err.response.data
    if (!msg || msg.length > 50) {
      msg = err.response.status
    }
    Vue.prototype.$message({
      message: msg,
      type: 'error'
    })
    return true
  }
}

const errorHandlers = [
  axiosErrorHandler,
  commonErrorHandler
]

const plugin = {

  install (vue, options = {}) {
    const handleError = (err, defaultMsg = COMMON_ERROR_MESSAGE) => {
      for (const item of errorHandlers) {
        if (item(err, defaultMsg)) {
          break
        }
      }
    }
    if (!vue.$my) {
      vue.$my = {
        handleError
      }
    } else {
      vue.$my.handleError = handleError
    }
    vue.mixin({
      created () {
        this.$my = vue.$my
      }
    })
  }

}

export default plugin
export const install = plugin.install
