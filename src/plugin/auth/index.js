const plugin = {
  install (vue, options = {}) {
    vue.mixin({
      computed: {
        $tid () {
          return this.$store.getters.currentTenant.id
        }
      }
    })
  }

}

export default plugin
export const install = plugin.install
