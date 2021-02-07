import { dateFormat } from 'src/util/format'

export const date = value => {
  return dateFormat(value, 'YYYY-MM-DD')
}

export const datetime = value => {
  return dateFormat(value, 'YYYY-MM-DD HH:mm:ss')
}

export const monthtime = value => {
  return dateFormat(value, 'MM月DD日 HH:mm:ss')
}

export const minutetime = value => {
  return dateFormat(value, 'MM月DD日 HH:mm')
}
