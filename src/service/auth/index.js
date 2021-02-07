import Cookies from 'js-cookie'

export const clearAuthCookie = () => {
  try {
    Cookies.remove('web-session', {path: '/'})
  } catch (e) {
    console.log('clear cookie fail')
  }
}
export const getAuthRoute = (routeList, roles) => {
  let authName = ''
  if (roles && roles.length !== 0) {
    authName = roles[0].auths[0].name
  }
  let routeName = 'Dashboard'
  for (let i = 0; i < routeList.length; i++) {
    if (routeList[i].meta.title === authName) {
      routeName = routeList[i].name
      break
    }
  }
  return routeName
}
export const isAuthRouter = (toName, roles) => {
  let authNameArr = []
  if (roles.length !== 0) {
    roles.forEach(i => {
      if (i.auths) {
        i.auths.forEach(n => {
          authNameArr.push(n.name)
        })
      }
    })
  }
  let toNameIndex = authNameArr.findIndex(name => {
    return name === toName
  })
  if (toNameIndex !== -1) {
    return true
  }
  return false
}
