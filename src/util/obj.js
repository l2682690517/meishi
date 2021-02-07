export const syncNewObject = (defaultObj, source) => {
  let target = {...defaultObj}
  Object.keys(target).forEach((key) => {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key]
    }
  })
  return target
}
export const filterEmpty = (params) => {
  let query = {}
  Object.keys(params).map(function (objectKey, index) {
    let value = params[objectKey]
    if (value) {
      query[objectKey] = value
    }
  })
  return query
}
