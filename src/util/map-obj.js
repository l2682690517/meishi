export const mapMethods = (methods) => {
  let res = {}
  mapFunction(methods).forEach((item) => {
    res[item.key] = item.val
  })
  return res
}

export const mapConst = (data) => {
  let res = {}
  mapField(data).forEach((item) => {
    res[item.key] = item.val
  })
  return res
}

const mapFunction = (map) => {
  if (Array.isArray(map)) {
    throw new Error('no supper array')
    // todo: 在生产环境中运行失败
    // return map.map((item) => {
    //   return {key: item.prototype.constructor.name, val: item}
    // })
  } else {
    return Object.keys(map).map((item) => {
      return {key: item, val: map[item]}
    })
  }
}

const mapField = function (map) {
  if (Array.isArray(map)) {
    // todo: 暂时不支持
    throw new Error('no supper array')
    // return map.map((item) => {
    //   return {key: item, val: item}
    // })
  } else {
    return Object.keys(map).map((item) => {
      return {key: item, val: map[item]}
    })
  }
}
