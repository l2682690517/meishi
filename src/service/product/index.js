import * as R from 'ramda'
import R_ from 'src/util/R_'
import * as RE from '@superwy/ramda-e'
import * as ResourceService from 'src/service/resource/index'

export const allTp = {
  platform: {
    value: 1,
    text: ''
  },
  self_support: {
    value: 2,
    text: '自营'
  },
  choose_platform: {
    value: 3,
    text: '平台'
  }
}

export const allStatus = {
  up: {
    value: 1,
    text: '上架'
  },
  down: {
    value: 2,
    text: '下架'
  }
}

export const convertFormToParam = R.curry((form) => {
  return R.pipe(
    R.clone,
    (obj) => {
      const priceField = ['st_price', 'supply_price']
      const intField = ['stock']
      return R.mapObjIndexed((val, key) => {
        if (key === 'head') {
          return R.map((headItem) => {
            return R.assoc('tp', ResourceService.allTp.img.value)(headItem)
          })(val)
        } else if (key === 'cover') {
          if (val && val.url) {
            val.tp = ResourceService.allTp.img.value
            return val
          } else {
            return null
          }
        } else if (priceField.indexOf(key) !== -1) {
          return R_.convertYuanToFen(val)
        } else if (intField.indexOf(key) !== -1) {
          return parseInt(val)
        } else if (key === 'skus') {
          return R.map(skuItem => {
            skuItem.suggest_price = 0
            skuItem.sell_price = R_.convertYuanToFen(skuItem.sell_price)
            skuItem.stock = parseInt(skuItem.stock)
            if (skuItem.image && skuItem.image.url) {
              skuItem.image.tp = ResourceService.allTp.img.value
            } else {
              skuItem.image = null
            }
            return skuItem
          })(val)
        }
        return val
      })(obj)
    },
    (obj) => {
      obj.prop = {
        oversea: !!obj.oversea,
        supply_price: obj.supply_price,
        skus: obj.skus,
        service_tag_group_id: parseInt(obj.service_tag_group_id),
        after_service_id: parseInt(obj.after_service_id),
        delivery_region_id: parseInt(obj.delivery_region_id)
      }
      let data = R.pickAll(['id', 'head', 'status', 'cover', 'name', 'sell_point', 'st_price', 'content', 'prop', 'sale_tick'])(obj)
      console.log(data)
      return data
    }
  )(form)
})

export const convertPlatformSupportFormToParam = R.curry((form) => {
  return R.pipe(
    R.clone,
    (obj) => {
      const priceField = ['st_price', 'supply_price']
      return R.mapObjIndexed((val, key) => {
        if (key === 'head') {
          return R.map((headItem) => {
            return R.assoc('tp', ResourceService.allTp.img.value)(headItem)
          })(val)
        } else if (key === 'cover') {
          if (val && val.url) {
            val.tp = ResourceService.allTp.img.value
            return val
          } else {
            return null
          }
        } else if (priceField.indexOf(key) !== -1) {
          return R_.convertYuanToFen(val)
        } else if (key === 'skus') {
          return R.map(skuItem => {
            return {
              sku_id: skuItem.id,
              sell_price: R_.convertYuanToFen(skuItem.sell_price)
            }
          })(val)
        }
        return val
      })(obj)
    },
    (obj) => {
      obj.tenant_skus = obj.skus
      return R.pickAll(['id', 'head', 'status', 'cover', 'name', 'sell_point', 'st_price', 'content', 'tenant_skus', 'sale_tick'])(obj)
    }
  )(form)
})

export const convertModelToForm = R.curry((form) => {
  return R.pipe(
    R.clone,
    (obj) => {
      const newKey = {
        oversea: ['prop', 'ext', 'oversea'],
        supply_price: ['prop', 'ext', 'supply_price'],
        skus: ['tenant_skus'],
        service_tag_group_id: ['prop', 'ext', 'service_tag_group', 'id'],
        after_service_id: ['prop', 'ext', 'after_service', 'id'],
        delivery_region_id: ['prop', 'ext', 'delivery_region', 'id']
      }
      R.forEachObjIndexed((val, key) => {
        obj[key] = R.path(val)(obj)
      }, newKey)
      return obj
    },
    (obj) => {
      const pickContent = R.pickAll(['id', 'tp', 'text', 'url', 'width', 'height'])
      const priceField = ['st_price', 'supply_price']
      const intField = ['stock', 'service_tag_group_id', 'after_service_id', 'delivery_region_id']
      return R.mapObjIndexed((val, key) => {
        if (key === 'head') {
          return R.map((headItem) => {
            return pickContent(headItem)
          })(val)
        } else if (key === 'cover') {
          return pickContent(val || {})
        } else if (priceField.indexOf(key) !== -1) {
          if (val === 0) {
            return ''
          }
          return `${R_.convertFenToYuan(val)}`
        } else if (intField.indexOf(key) !== -1) {
          return `${val || ''}`
        } else if (key === 'skus') {
          return R.map(skuItem => {
            const si = skuItem.sku
            si.sell_price = `${R_.convertFenToYuan(skuItem.sell_price)}`
            si.suggest_price = `${R_.convertFenToYuan(si.suggest_price)}`
            si.stock = `${si.stock}`
            si.image = pickContent(si.image || {})
            return si
          })(val)
        } else if (key === 'content') {
          return R.map(contentItem => {
            return pickContent(contentItem)
          })(val || [])
        }
        return val
      })(obj)
    },
    (obj) => {
      return R.pickAll(['id', 'status', 'head', 'cover', 'name', 'sell_point', 'st_price', 'oversea', 'supply_price', 'skus', 'content', 'tags', 'service_tag_group_id', 'after_service_id', 'delivery_region_id', 'sale_tick'])(obj)
    }
  )(form)
})

export const formRestoreDefault = (form, sourceProduct) => {
  form.head = R.map(R.assoc('id', 0))(sourceProduct.head)
  form.cover = R.assoc('id', 0)(sourceProduct.cover || {})
  form.name = sourceProduct.name
  form.sell_point = sourceProduct.sell_point
  form.st_price = `${R_.convertFenToYuan(sourceProduct.st_price)}`
  form.content = R.map(R.assoc('id', 0))(sourceProduct.content)
  R.map(item => {
    item.sell_price = item.suggest_price
  })(form.skus)
}

export const showCover = (product) => {
  if (product.cover) {
    return product.cover.url
  }
  if (product.head && product.head.length > 0) {
    return product.head[0].url
  }
  return ''
}

export const showPrice = (product) => {
  if (!product) {
    return ''
  }
  if (product.min_price === product.max_price) {
    return `${RE.fenToYuan(product.min_price)}`
  } else {
    return `${RE.fenToYuan(product.min_price)}~${RE.fenToYuan(product.max_price)}`
  }
}

export const showProfit = (product) => {
  if (!product) {
    return ''
  }
  if (product.min_profit === product.max_profit) {
    return `${RE.fenToYuan(product.min_profit)}`
  } else {
    return `${RE.fenToYuan(product.min_profit)}~${RE.fenToYuan(product.max_profit)}`
  }
}

export const showSuggestPrice = (product) => {
  if (!product || !product.prop) {
    return ''
  }
  if (product.prop.min_suggest_price === product.prop.max_suggest_price) {
    return `${RE.fenToYuan(product.prop.min_suggest_price)}`
  } else {
    return `${RE.fenToYuan(product.prop.min_suggest_price)}~${RE.fenToYuan(product.prop.max_suggest_price)}`
  }
}

export const showSuggesProfit = (product) => {
  if (!product || !product.prop) {
    return ''
  }
  if (product.prop.min_profit === product.prop.max_profit) {
    return `${RE.fenToYuan(product.prop.min_profit)}`
  } else {
    return `${RE.fenToYuan(product.prop.min_profit)}~${RE.fenToYuan(product.prop.max_profit)}`
  }
}
