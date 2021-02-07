export const isNumber = (val) => {
  if (!val) {
    return false
  }
  const result = parseInt(val)
  if (isNaN(result)) {
    return false
  }
  return true
}
// 加法
// eslint-disable-next-line
Number.prototype.add = function (arg) {
  let r1, r2, m
  try {
    r1 = this.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (this * m + arg * m) / m
}

// 减法
// eslint-disable-next-line
Number.prototype.sub = function (arg) {
  return this.add(-arg)
}

// 乘法
// eslint-disable-next-line
Number.prototype.mul = function (arg) {
  let m = 0
  let s1 = this.toString()
  let s2 = arg.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

// 除法
// eslint-disable-next-line
Number.prototype.div = function (arg) {
  let t1 = 0
  let t2 = 0
  let r1
  let r2
  try {
    t1 = this.toString().split('.')[1].length
  } catch (e) {}
  try {
    t2 = arg.toString().split('.')[1].length
  } catch (e) {}
  r1 = Number(this.toString().replace('.', ''))
  r2 = Number(arg.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

export const getShowCount = (num) => {
  if (num < 10000) {
    return `${num}`
  } else if (num > 100000000) {
    return `${(num / 100000000).toFixed(2)}亿`
  } else {
    return `${(num / 10000).toFixed(2)}万`
  }
}
