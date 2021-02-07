import Vue from 'vue'
import Router from 'vue-router'
import { getMe } from 'src/api/uc'
import { clearAuthCookie, getAuthRoute, isAuthRouter } from 'src/service/auth/index'

Vue.use(Router)

const homeGroups = [
  {
    name: 'Administrator',
    title: '管理员',
    path: '/'
  }, {
    name: 'Product',
    title: '商品管理',
    path: '/'
  }, {
    name: 'User',
    title: '账号管理',
    path: '/'
  }
]

const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import('src/ui/layout/home/Index.vue'),
      meta: {
        menu: true,
        groups: homeGroups
      },
      children: [
        {
          path: '/',
          name: 'Dashboard',
          component: () => import('src/ui/home/dashboard/Index.vue'),
          meta: {
            title: '概览',
            showInSide: true
          }
        },
        {
          path: '/productmanagement',
          name: 'ProductManagement',
          component: () => import('src/ui/product/product-management/Index.vue'),
          meta: {
            title: '商品管理',
            showInSide: true
          }
        },
        {
          path: '/productmanagement/create',
          name: 'CreateProduct',
          component: () => import('src/ui/product/product-management/Create.vue'),
          meta: {
            title: '创建自营商品',
            breadcrumbItems: [
              {
                text: '商品管理',
                to: {
                  name: 'ProductManagement'
                }
              },
              {
                text: '创建自营商品'
              }
            ]
          }
        },
        {
          path: '/productmanagement/edit/:id',
          name: 'EditProduct',
          component: () => import('src/ui/product/product-management/Edit.vue'),
          meta: {
            customBreadcrumb: true,
            title: '编辑自营商品',
            breadcrumbItems: [
              {
                text: '商品管理',
                to: {
                  name: 'ProductManagement'
                }
              },
              {
                text: '编辑自营商品'
              }
            ]
          }
        },
        {
          path: '/platform_down',
          name: 'PlatformDown',
          component: () => import('src/ui/product/product-management/platform-down/Index.vue'),
          meta: {
            title: '平台下架',
            breadcrumbItems: [
              {
                text: '商品管理',
                to: {
                  name: 'ProductManagement'
                }
              },
              {
                text: '平台下架'
              }
            ]
          }
        },
        {
          path: '/chooseproduct',
          name: 'ChooseProduct',
          component: () => import('src/ui/product/choose-product/Index.vue'),
          meta: {
            title: '选货',
            breadcrumbItems: [
              {
                text: '商品管理',
                to: {
                  name: 'ProductManagement'
                }
              },
              {
                text: '选货'
              }
            ]
          }
        },
        {
          path: '/productgroup',
          name: 'ProductGroup',
          component: () => import('src/ui/product_group/Index.vue'),
          meta: {
            title: '商品组',
            showInSide: true
          }
        },
        {
          path: '/minapphome',
          name: 'MinAppHome',
          component: () => import('src/ui/custom-page/home/Index.vue'),
          meta: {
            title: '首页管理',
            showInSide: true
          }
        },
        {
          path: '/productgroup/create',
          name: 'CreateGroup',
          component: () => import('src/ui/product_group/Create.vue'),
          meta: {
            title: '创建商品组',
            showInSide: false,
            breadcrumbItems: [{
              text: '商品组',
              to: {name: 'ProductGroup'}
            }, {
              text: '创建商品组'
            }]
          }
        },
        {
          path: '/productgroup/edit/:id',
          name: 'EditGroup',
          component: () => import('src/ui/product_group/Edit.vue'),
          meta: {
            title: '编辑商品组',
            showInSide: false,
            breadcrumbItems: [{
              text: '商品组',
              to: {name: 'ProductGroup'}
            }, {
              text: '编辑商品组'
            }]
          }
        },
        {
          path: '/order',
          name: 'OrderIndex',
          component: () => import('src/ui/order/Index.vue'),
          meta: {
            title: '订单',
            showInSide: true
          }
        },
        {
          path: '/order/detail/:id',
          name: 'OrderDetail',
          component: () => import('src/ui/order/detail/Index.vue'),
          meta: {
            title: '订单详情',
            showInSide: false,
            breadcrumbItems: [{
              text: '订单',
              to: {name: 'OrderIndex'}
            }, {
              text: '订单详情'
            }]
          }
        },
        {
          path: '/order/refund/',
          name: 'OrderRefund',
          component: () => import('src/ui/order/refund/Index.vue'),
          meta: {
            title: '退款中',
            showInSide: false,
            breadcrumbItems: [{
              text: '订单',
              to: {name: 'OrderIndex'}
            }, {
              text: '退款中'
            }]
          }
        },
        {
          path: '/order/:id/refund/:oiid',
          name: 'OrderRefundDetail',
          component: () => import('src/ui/order/refund/Detail.vue'),
          meta: {
            customBreadcrumb: true,
            title: '退款详情',
            showInSide: false
          }
        },
        {
          path: '/income',
          name: 'ProfitIndex',
          component: () => import('src/ui/profit/Index.vue'),
          meta: {
            title: '收入',
            showInSide: true,
            breadcrumbDesc: '(截止上月)'
          }
        },
        {
          path: '/userinfo',
          name: 'UserInfoIndex',
          component: () => import('src/ui/user-info/Index.vue'),
          meta: {
            title: '用户',
            showInSide: true
          }
        },
        {
          path: '/userdetail/:uid',
          name: 'UserDetail',
          component: () => import('src/ui/user-info/Detail.vue'),
          meta: {
            title: '用户详情',
            showInSide: false,
            customBreadcrumb: true
          }
        },
        {
          path: '/shop/setting',
          name: 'ShopSetting',
          component: () => import('src/ui/setting/shop/Index.vue'),
          meta: {
            title: '店铺设置',
            showInSide: true
          }
        },
        {
          path: 'sys_user',
          name: 'SysUserIndex',
          component: () => import('src/ui/user/sys/Index.vue'),
          meta: {
            group: 'User',
            title: '管理员列表',
            showInSide: true
          }
        },
        {
          path: 'characterauth',
          name: 'CharacterAuth',
          component: () => import('src/ui/user/character-auth/Index.vue'),
          meta: {
            group: 'User',
            title: '角色管理',
            showInSide: true
          }
        },
        {
          path: 'characterauth/create',
          name: 'CreateCharacter',
          component: () => import('src/ui/user/character-auth/Create.vue'),
          meta: {
            title: '创建角色',
            showInSide: false,
            breadcrumbItems: [{
              text: '角色管理',
              to: {name: 'CharacterAuth'}
            }, {
              text: '创建角色'
            }]
          }
        },
        {
          path: 'characterauth/edit/:id',
          name: 'EditCharacter',
          component: () => import('src/ui/user/character-auth/Edit.vue'),
          meta: {
            title: '编辑角色',
            showInSide: false,
            breadcrumbItems: [{
              text: '角色管理',
              to: {name: 'CharacterAuth'}
            }, {
              text: '编辑角色'
            }]
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('src/ui/auth/login/Index.vue')
    },
    {
      path: '/authorize',
      component: () => import('src/ui/auth/authorize/Index.vue'),
      meta: {},
      children: [{
        path: '/',
        name: 'AuthorizeMain',
        component: () => import('src/ui/auth/authorize/main.vue'),
        meta: {}
      }, {
        path: 'error',
        name: 'AuthorizeError',
        component: () => import('src/ui/auth/authorize/ErrorPage.vue'),
        meta: {}
      }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (!Vue.$store.getters.isLogin) {
    try {
      await getMe()
    } catch (err) {
      if (!err.response || err.response.status !== 401) {
        clearAuthCookie()
      }
      if (to.name !== 'Login') {
        next({
          name: 'Login',
          replace: true
        })
      } else {
        next()
      }
      return
    }
  }

  // 以下就必须已完成了登录
  // 屏蔽掉处理不登录而访问login的情况
  if (to.name === 'Login') {
    if (Vue.$store.getters.isAuthorize && Vue.$store.getters.isRefundAuthorize) {
      next({
        name: 'Dashboard',
        replace: true
      })
    } else {
      next({
        name: 'AuthorizeMain',
        replace: true
      })
    }
    return
  }

  // 处理授权路由，已授权的不能再访问授权路由了
  if (to.name === 'AuthorizeMain' || to.name === 'AuthorizeError') {
    if (Vue.$store.getters.isAuthorize && Vue.$store.getters.isRefundAuthorize) {
      next({
        name: 'Dashboard',
        replace: true
      })
    } else {
      next()
    }
    return
  }
  // 处理其它的路由
  if (Vue.$store.getters.isAuthorize && Vue.$store.getters.isRefundAuthorize) {
    // 处理角色权限
    // 超管无视权限
    if (Vue.$store.getters.isSuper) {
      next()
      return
    }
    // 登录后跳转到有权限的页面
    if (!from.name || from.name === 'AuthorizeMain' || from.name === 'AuthorizeError' || from.name === 'Login') {
      if (!isAuthRouter(to.meta.title, Vue.$store.getters.tenantRoles)) {
        next({
          name: getAuthRoute(router.options.routes[0].children, Vue.$store.getters.tenantRoles),
          replace: true
        })
        return
      } else {
        next()
      }
      return
    }
    next()
  } else {
    next({
      name: 'AuthorizeMain',
      replace: true
    })
  }
})

export default router
