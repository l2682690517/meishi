<template lang="pug">
  div(v-loading="loading")
    div.section
      div.section-title 广告语
      div.section-content
        el-form
          el-form-item.hide-validate-el-form()
            div
              el-input.small-el-input(v-model.trim="slogan", :maxlength="25")
              span.right-desc  {{ slogan.length }} / 25
            div.slogan-desc 用于某些分享小程序的场景
          el-button(type="primary", size="small", :loading="savingSlogan", @click="saveSlogan") 保存
    div.divider
    div.section
      div.section-title 小程序状态
      div.section-content
        div.info
          div.icon(v-lazy:background-image="currentTenant.head_img")
          div
            div.name {{ currentTenant.nick_name }}
            div.status {{tenantStatusText}}
        div.status-desc(v-if="currentTenant.app_status === allAppStatus.auditing.value") 可以准备您的店铺了，通过审核后，用户就会看到
        div(v-if="showHomeBtn")
          el-button.goHomeBtn(type="primary", size="small", @click="openHomePage") 前往首页管理
        div.line-btn-wrapper(v-if="showLineButton")
          div(v-if="currentTenant.app_status === allAppStatus.online.value")
            el-button(size="small", @click="handleOffline", type="primary", :loading="savingStatus") 下线
          div(v-if="currentTenant.app_status === allAppStatus.offline.value")
            el-button(size="small", @click="handleOnline", type="primary", :loading="savingStatus") 上线
    div.divider
    div.section
      div.section-title 版本更新记录
      div.section-content
        div.all-version(v-if="versions")
          div.version-item(v-for="item in versions || []")
            div.version-title
              div.version-code {{ item.code }}
              div.version-date  {{ item.update_time | datetime }}
            div.version-text
              div(v-for!="item in versionLines(item.description)") {{ item }}
        div(v-else)
          div.no-version 暂无内容
</template>

<script>
  import { getMe } from 'src/api/uc'
  import { mapGetters } from 'vuex'
  import { allAppStatus, appStatus } from 'src/service/tenant/index'
  import * as TenantApi from 'src/api/tenant'

  export default {
    data () {
      return {
        loading: false,
        savingStatus: false,
        savingSlogan: false,
        loadingColor: false,
        slogan: '',
        logo: '',
        name: '',
        versions: [],
        ...$global.$mapConst({
          'allAppStatus': allAppStatus,
          'appStatus': appStatus
        })
      }
    },
    computed: {
      statusText () {
        return '审核中'
      },
      ...mapGetters(['currentTenant']),
      showLineButton () {
        return this.currentTenant.app_status === allAppStatus.online.value || this.currentTenant.app_status === allAppStatus.offline.value
      },
      tenantStatusText () {
        return this.appStatus[this.currentTenant.app_status]
      },
      showHomeBtn () {
        return this.currentTenant.app_status === allAppStatus.auditing.value
      }
    },
    methods: {
      async refreshData () {
        await getMe()
        this.slogan = this.$store.getters.currentTenant.slogan
        this.chooseColorId = this.$store.getters.currentTenant.theme_color_id
      },
      async handleOnline () {
        await this.$confirm('上线?')
        this.savingStatus = true
        try {
          await TenantApi.online(this.$tid)
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.refreshData()
        } finally {
          this.savingStatus = false
        }
      },
      async handleOffline () {
        await this.$confirm('下线?')
        this.savingStatus = true
        try {
          await TenantApi.offline(this.$tid)
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.refreshData()
        } finally {
          this.savingStatus = false
        }
      },
      async showVersion () {
        try {
          const resVersion = await TenantApi.versionAll()
          this.versions = resVersion.data.data
        } finally {
        }
      },
      openHomePage () {
        this.$router.push({
          name: 'MinAppHome'
        })
      },
      async saveColor () {
      },
      async saveSlogan () {
        if (!this.slogan) {
          this.$message({
            message: '广告语不能为空',
            type: 'error'
          })
          return
        }
        this.savingSlogan = true
        try {
          await TenantApi.updateSlogan(this.$tid, this.slogan)
          this.$message({
            message: '更新成功',
            type: 'success'
          })
        } finally {
          this.savingSlogan = false
        }
      },
      versionLines (desc) {
        if (!desc) {
          return []
        }
        return desc.split('\n')
      }
    },
    async mounted () {
      this.slogan = this.$store.getters.currentTenant.slogan
      this.refreshData()
      this.showVersion()
    }
  }
</script>

<style lang="scss" scoped>
  .colorBox {
    height: 50px;
    @include center-layout('v');
    .colorItem {
      cursor: pointer;
      height: 50px;
      width: 50px;
      margin-right: 15px;
      border-radius:50%;
      position: relative;
        .checkmark {
          display: inline-block;
          height: 30px;
          position: absolute;
          line-height: 30px;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          filter: invert(100%);
          font-size: x-large;
          font-weight: 900;
        }
    }
  }
  .section {
    padding-top: 30px;
    padding-bottom: 30px;
    .section-title {
      font-size: 16px;
      line-height: 22px;
      color: #303133;
    }
    .section-content {
      margin-top: 20px;
    }

  }

  .divider {
    border-top: 1px solid #DCDFE6;
  }

  .right-desc {
    color: #909399;
    font-size: 12px;
  }

  .slogan-desc {
    line-height: 14px;
    margin-top: 10px;
    margin-bottom: 20px;
    color: #909399;
    font-size: 12px;
  }

  .info {
    @include center-layout('v');

    .icon {
      width: 50px;
      height: 50px;
      background-size: cover;
      background-position: center;
      border-radius: 50%;
      margin-right: 10px;
    }

    .name, .status {
      color: #303133;
      font-size: 14px;
      line-height: 20px;
    }

    .name {
      margin-bottom: 6px;
    }

  }

  .status-desc {
    padding-top: 10px;
    color: #909399;
    font-size: 12px;
  }

  .goHomeBtn {
    margin-top: 20px;
  }

  .all-version {
    padding: 20px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    background: #F5F7FA;
    max-height: 190px;
    max-width: 964px;
    overflow-y: auto;
  }

  .line-btn-wrapper {
    margin-top: 20px;
  }

  .version-item {
    .version-title {
      @include center-layout('v');
      justify-content: space-between;
      color: #303133;
      font-size: 12px;
      line-height: 14px;
    }

    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0px;
    }

    .version-date {
      margin-left: 15px;
    }

    .version-text {
      margin-top: 10px;
      color: #909399;
      font-size: 12px;
      line-height: 17px;
    }

  }

  .no-version {
    color: #909399;
    font-size: 14px;
    line-height: 14px;
  }


</style>
