import * as R from 'ramda'

export const convertFromToParam = R.curry((form) => {
  return R.mapObjIndexed((val, key) => {
    if (key === 'products') {
      return R.map(item => {
        return item.id
      })(val || [])
    }
    return val
  })(form)
})
