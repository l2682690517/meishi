import { mapMethods, mapConst } from 'src/util/map-obj'

const plugin = {

  install (vue, options = {}) {
    if (!window.$global) {
      window.$global = {
        $mapMethods: mapMethods,
        $mapConst: mapConst
      }
    } else {
      window.$global.$mapMethods = mapMethods
      window.$global.$mapConst = mapConst
    }
  }
}

export default plugin
export const install = plugin.install
