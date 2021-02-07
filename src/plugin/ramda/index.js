import R_ from 'src/util/R_'

const R = require('ramda')
const RA = require('ramda-adjunct')

const plugin = {

  install (vue, options = {}) {
    vue.prototype.R = R
    vue.prototype.R_ = R_
    vue.prototype.RA = RA
    vue.R = R
    vue.R_ = R_
    vue.RA = RA
  }
}

export default plugin
export const install = plugin.install
