import Axios from 'axios'
import * as ProductService from 'src/service/product'

export const getChooseProductItem = (tenantId, id) => {
  return Axios.get(`/tenant/t/${tenantId}/product/sys/s/${id}`)
}
export const getChooseProductList = (tenantId, params) => {
  return Axios.get(`/tenant/t/${tenantId}/product/sys`, {
    params: params
  })
}
export const getOwnProductList = (tenantId, params) => {
  return Axios.get(`tenant/t/${tenantId}/product/own`, {
    params: params
  })
}
export const getOwnAllProductList = (tid, params) => {
  return Axios.get(`tenant/t/${tid}/product/own/all`, {
    params: params
  })
}
export const up = (tenantId, id) => {
  return Axios.post(`/tenant/t/${tenantId}/product/own/s/${id}/up`)
}
export const down = (tenantId, id) => {
  return Axios.delete(`/tenant/t/${tenantId}/product/own/s/${id}/up`)
}

export const shelvesProduct = (id) => {
  return Axios.post(`/tenant/product/${id}/up`)
}
export const shelvesChooseProduct = (tenantId, id) => {
  return Axios.post(`/tenant/t/${tenantId}/product/own/s/${id}/choose `)
}
export const create = (tenantId, form) => {
  const params = ProductService.convertFormToParam(form)
  return Axios.post(`/tenant/t/${tenantId}/product/own`, params)
}
export const update = (tenantId, id, form, isChoose = false) => {
  const params = !isChoose ? ProductService.convertFormToParam(form) : ProductService.convertPlatformSupportFormToParam(form)
  return Axios.post(`/tenant/t/${tenantId}/product/own/s/${id}`, params)
}
export const getItem = (tenantId, id) => {
  return Axios.get(`/tenant/t/${tenantId}/product/own/s/${id}`)
}

export const getItemSource = (tenantId, id) => {
  return Axios.get(`/tenant/t/${tenantId}/product/own/s/${id}/source`)
}
