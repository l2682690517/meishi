import {UPDATE_ME} from '../types'

const state = {
  me: null
}

const getters = {
  isLogin: state => {
    if (state.me && state.me.id) {
      return true
    }
    return false
  },
  isRefundAuthorize: state => {
    if (state.me && state.me.company && state.me.company.tenants && state.me.company.tenants.length > 0 && state.me.company.tenants[0].refund_status === 1) {
      return false
    } else {
      return true
    }
  },
  isAuthorize: state => {
    if (state.me && state.me.company && state.me.company.tenants && state.me.company.tenants.length > 0 && state.me.company.tenants[0].app_status !== 4) {
      return true
    } else {
      return false
    }
  },
  currentTenant: state => {
    if (state.me && state.me.company && state.me.company.tenants && state.me.company.tenants.length > 0) {
      return state.me.company.tenants[0]
    } else {
      return {}
    }
  },
  tenantRoles: state => {
    if (state.me && state.me.roles && state.me.roles.length > 0) {
      return state.me.roles
    } else {
      return []
    }
  },
  isSuper: state => {
    if (state.me && state.me.super) {
      return true
    } else {
      return false
    }
  }
}

const mutations = {

  /**
   * 更新ME
   * @param state
   * @param me
   */
  [UPDATE_ME] (state, me) {
    state.me = me
  }
}

export default {
  state,
  getters,
  mutations
}
