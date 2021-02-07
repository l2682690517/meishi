import ChinaAddressV1Data from 'src/data/china_address_v1.json'

export const allProvince = (() => {
  return ChinaAddressV1Data.filter((item) => {
    return !item.parent
  }).map((item) => {
    return item.name
  })
})()

export const reverseProvince = (currentProvinceList) => {
  let result = []
  for (let item of allProvince) {
    if (currentProvinceList.indexOf(item) < 0) {
      result.push(item)
    }
  }
  return result
}
