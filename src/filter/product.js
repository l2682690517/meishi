import { showPrice, showProfit, showSuggestPrice, showSuggesProfit, allStatus } from 'src/service/product'

export const productPrice = (val, showSymbol = true) => {
  return ` ${showSymbol ? '¥' : ''}${showPrice(val)}`
}

export const productProfit = (val, showSymbol = true) => {
  return ` ${showSymbol ? '¥' : ''}${showProfit(val)}`
}

export const productSuggestPrice = (val, showSymbol = true) => {
  return ` ${showSymbol ? '¥' : ''}${showSuggestPrice(val)}`
}

export const productSuggestProfit = (val, showSymbol = true) => {
  return ` ${showSymbol ? '¥' : ''}${showSuggesProfit(val)}`
}

export const productStatusControl = (val) => {
  if (val.status === allStatus.up.value) {
    return allStatus.down.text
  } else if (val.status === allStatus.down.value) {
    return allStatus.up.text
  }
  return ''
}
