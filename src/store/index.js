import Vuex from 'vuex'
import Vue from 'vue'
import { isDebug } from 'src/util/env'
import createLogger from 'vuex/dist/logger'
import auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth
  },
  strict: isDebug,
  plugins: isDebug ? [createLogger()] : []
})
