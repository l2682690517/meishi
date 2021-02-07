import {eventBus} from 'src/util/eventBus'

const install = (Vue, options) => {
  Vue.prototype.$eventBus = eventBus
}

export default {
  install
}
