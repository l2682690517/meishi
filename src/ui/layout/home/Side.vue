<template lang="pug">
  div
    div.appMsg
      div
        div.head-image(v-lazy:background-image="currentTenant.head_img")
        div.box
          div.nick-name.single-line {{ currentTenant.nick_name }}
          div
            div.status(:class="{'warning': isWarningStatus}") {{showStatus()}}
          div.qr()
            img(@click="dialogVisible = true", style="width: 16px;", :src="qrcodeIcon")
    el-menu(mode="vertical", :default-active="$route.path" router)
      template(v-for!="menuItem in menus")
        el-submenu(:index="menuItem.name" v-if!="menuItem.isGroup", v-show="showSubmenu(menuItem)")
          template(slot="title") {{ menuItem.title }}
          template(v-for!="childItem in menuItem.items")
            el-menu-item(:index!="fullPath(menuItem, childItem)", v-show="showMenu(childItem)") {{ childItem.meta.title }}
        el-menu-item(v-else :index="menuItem.path", v-show ="showMenu(menuItem)") {{ menuItem.meta.title }}
    el-dialog(title="小程序码", :visible.sync="dialogVisible", width="300px", :modal-append-to-body="false", center)
      img.dlgImg(:src="currentTenant.acode_url")
      el-button.dlgImg-footer(@click="download", type="primary") 下载小程序码
</template>

<script>
  import { mapGetters } from 'vuex'
  import { allAppStatus, appStatus } from 'src/service/tenant/index'
  import * as R from 'ramda'
  export default {
    components: {},
    data () {
      return {
        dialogVisible: false,
        qrcodeIcon: require('src/assets/image/qrcode.png'),
        ...$global.$mapConst({
          'allAppStatus': allAppStatus,
          'appStatus': appStatus
        })
      }
    },
    computed: {
      isWarningStatus () {
        return this.currentTenant.app_status !== allAppStatus.online.value
      },
      menus () {
        const menus = []
        const homeRoute = this.$router.options.routes.find((item) => {
          return item.meta.menu === true
        })
        if (homeRoute) {
          let currentGroup = null
          for (let item of homeRoute.children) {
            if (!item.meta || !item.meta.showInSide) {
              continue
            }
            const currentGroupName = currentGroup ? currentGroup.name : null
            if (!item.meta.group && currentGroupName) {
              currentGroup = null
            } else {
              if (item.meta.group && item.meta.group !== currentGroupName) {
                currentGroup = homeRoute.meta.groups.find(groupItem => {
                  return groupItem.name === item.meta.group
                })
                currentGroup.items = []
                currentGroup.isGroup = true
                menus.push(currentGroup)
              }
            }
            if (!currentGroup) {
              menus.push(item)
            } else {
              currentGroup.items.push(item)
            }
          }
        }
        return menus
      },
      ...mapGetters(['currentTenant', 'tenantRoles', 'isSuper'])
    },
    methods: {
      showSubmenu (item) {
        if (this.isSuper) {
          return true
        }
        let arr = []
        item.items.forEach(i => {
          arr.push(i.meta.title)
        })
        let rolesArr = []
        this.tenantRoles.forEach(i => {
          if (i.auths) {
            i.auths.forEach(n => {
              rolesArr.push(n.name)
            })
          }
        })
        let isRepeat = R.intersection(arr, rolesArr)
        return isRepeat.length > 0
      },
      showMenu (item) {
        if (this.isSuper) {
          return true
        }
        let rolesArr = []
        this.tenantRoles.forEach(i => {
          if (i.auths) {
            i.auths.forEach(n => {
              rolesArr.push(n.name)
            })
          }
        })
        let data = rolesArr.findIndex(i => {
          return i === item.meta.title
        })
        return data !== -1
      },
      showStatus () {
        return this.appStatus[this.currentTenant.app_status]
      },
      fullPath (menuItem, childItem) {
        return `${menuItem.path}${childItem.path}`
      },
      download () {
        let link = document.createElement('a')
        link.href = this.currentTenant.acode_url
        link.download = 'qrcode'
        link.click()
        this.dialogVisible = false
      }
    },
    mounted () {

    }
  }
</script>

<style lang="scss" scoped>
  .el-menu {
    min-height: 100%;
  }

  .dlgImg {
    width: 300px;
    height: 300px;
    margin-left: 10%;
  }

  .appMsg {
    padding-top: 20px;
    background-color: #fff;
    width: $side-width - 10;
    text-align: center;
    padding-bottom: 25px;

    .head-image {
      width: 50px;
      height: 50px;
      background-size: cover;
      background-position: center;
      border-radius: 50%;
      margin-left: auto;
      margin-right: auto;
    }

    .nick-name {
      padding-left: 5px;
      padding-right: 5px;
      color: #303133;
      font-size: 14px;
      line-height: 20px;
      margin-top: 10px;
    }

    .status {
      margin-top: 6px;
      display: inline-block;
      background-color: #67C23A;
      height: 20px;
      border-radius: 10px;
      font-size: 12px;
      line-height: 20px;
      color: #fff;
      padding-left: 12px;
      padding-right: 12px;

      &.warning {
        background-color: #e6a23c;
      }
    }

    .qr {
      margin-top: 10px;

      & > img {
        cursor: pointer;
      }
    }

    .box {
      top: 25px;
      left: 70px;
      display: inline-block;
      width: 100px;
      height: 60px;
      .nick_name {
        color: white;
      }
      .buttonBox {
        position: absolute;
        bottom: 0;
        height: 20px;
        font-size: small;
        margin-top: 5px;
        .status {

          line-height: 20px;
          font-size: 12px;
          position: absolute;
          height: 20px;
          width: 45px;
          padding-left: 8px;
          cursor: default;
          color: #fff;
          border-radius: 4px;
        }
        .statusOnline {
          background-color: #83e671;
          line-height: 20px;
          font-size: 12px;
          position: absolute;
          height: 20px;
          width: 45px;
          padding-left: 8px;
          cursor: default;
          color: #fff;
          border-radius: 4px;
        }
      }
      .icon {
        position: absolute;
        left: 50px;
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }
  .dlgImg {
    width: 150px;
    height: 150px;
    margin-left: 48px;
  }
  .dlgImg-footer {
    margin-top: 10px;
    width: 180px;
    height: 36px;
    font-size: 12px;
    margin-left: 33px;
  }
</style>

