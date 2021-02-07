import * as R from 'ramda'
import { dateFormatMinute } from 'src/util/format'
import { allTp } from 'src/service/resource/index'

export const allContentTp = {
  product: {
    value: 1,
    text: '商品'
  },
  product_group: {
    value: 2,
    text: '商品组'
  }
}

export const allShowTp = {
  show_long: {
    value: 1,
    text: '长期'
  },
  show_limit: {
    value: 2,
    text: '限时'
  }
}

export const convertHomePageFormToParam = ({carousel, custom}) => {
  const pickCover = R.pickAll(['tp', 'url', 'width', 'height'])

  const pageItem = R.map((item) => {
    if (item.content_tp === allContentTp.product.value && item.product) {
      item.product_id = item.product.id
    }
    if (item.content_tp === allContentTp.product_group.value && item.product_group) {
      item.product_group_id = item.product_group.id
    }

    return R.pipe(
      R.mapObjIndexed((val, key, obj) => {
        if (key === 'cover') {
          if (!val || !val.url) {
            return null
          } else {
            val.tp = allTp.img.value
            return pickCover(val)
          }
        } else if (key === 'show_start' || key === 'show_end') {
          if (obj.show_tp !== allShowTp.show_limit.value) {
            return ''
          } else {
            return dateFormatMinute(val)
          }
        } else {
          return val
        }
      }),
      R.pickAll(['id', 'cover', 'content_tp', 'show_tp', 'show_start', 'show_end', 'content_tp', 'product_id', 'product_group_id'])
    )(item)
  })

  return {
    carousel: pageItem(carousel || []),
    custom: pageItem(custom || [])
  }
}

export const convertPageContentModelToForm = (items) => {
  return R.map((item) => {
    return R.mapObjIndexed((val, key, obj) => {
      if (key === 'cover') {
        return val || {}
      }
      return val
    })(item)
  })(items)
}
