import * as AddressUtil from 'src/util/address'

export const showText = (item) => {
  if (item.include) {
    if (item.province.length < AddressUtil.allProvince.length / 2) {
      return `配送范围支持${item.province.join('、')}。`
    } else {
      let provinceArr = AddressUtil.reverseProvince(item.province)
      return `配送范围支持除${provinceArr.join('、')}以外的中国大陆地区。`
    }
  } else {
    if (item.province.length < AddressUtil.allProvince.length / 2) {
      return `配送范围支持除${item.province.join('、')}以外的中国大陆地区`
    } else {
      let provinceArr = AddressUtil.reverseProvince(item.province)
      return `配送范围支持${provinceArr.join('、')}。`
    }
  }
}
