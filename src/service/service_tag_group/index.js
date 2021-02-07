import * as R from 'ramda'

export const showItemsText = (group) => {
  return R.join(', ')(R.map(item => {
    return item.name
  })(group.items || []))
}
