<template lang="pug">
  div(v-loading="loading")
    el-form(label-width="50px")
      el-form-item
        div.head
          div.button-head.gradual-change-red.margin-right(@click="toOrder")
            div.text-head 昨日销售额
            div.number-head {{getShowPrice(data.day_stat)}}
          div.button-head.gradual-change-blue(@click="toOrderRefund")
            div.text-head 退款中
            div.number-head {{data.refunding_count}}
      vue-media(:query="{maxWidth: 1400}")
        el-form-item()
          div.body.margin-bottom
            div.button-body.margin-right(@click="toChooseProduct")
              div.center-img
                div.img.background-image-xuanhuo
                div.text-body 选货
            div.button-body(@click="toMinAppHome")
              div.center-img
                div.img.background-image-setting
                div.text-body 首页管理
          div.body
            div.button-body.margin-right(@click="showWeChatHelp")
              div.center-text
                div.title-body 微信官方数据助手
                div.remark 店铺的访问与用户统计
            div.button-body(@click="toWeChat")
              div.center-text
                div.title-body 微信支付商户平台
                div.remark 交易与资金管理
      vue-media(:query="{minWidth: 1400}")
        el-form-item()
          div.body-wide-screen.margin-bottom
            div.flexBox.margin-right
              div.button-body(@click="toChooseProduct")
                div.center-img
                  div.img.background-image-xuanhuo
                  div.text-body 选货
              div.button-body(@click="toMinAppHome")
                div.center-img
                  div.img.background-image-setting
                  div.text-body 首页管理
            div.flexBox
              div.button-body(@click="showWeChatHelp")
                div.center-text
                  div.title-body 微信官方数据助手
                  div.remark 店铺的访问与用户统计
              div.button-body(@click="toWeChat")
                div.center-text
                  div.title-body 微信支付商户平台
                  div.remark 交易与资金管理
    el-dialog(title="小程序数据助手", :visible.sync="dialogVisible", width="300px", center, :modal-append-to-body="false")
      img.dlgImg(:src="weChatHelp")
      div.dlgImg-footer 请小程序管理员扫码查看
</template>

<script>
  import * as HomeApi from 'src/api/home'
  import { PUSH_STATUS_DASHBOARD } from 'src/constants/orderPush'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        dialogVisible: false,
        weChatHelp: require('src/assets/image/wechatHelp.png'),
        data: {
          day_stat: 0,
          refunding_count: 0
        }
      }
    },
    computed: {},
    methods: {
      showWeChatHelp () {
        this.dialogVisible = true
      },
      toWeChat () {
        let url = 'https://pay.weixin.qq.com/index.php/core/home/login'
        window.open(url)
      },
      toMinAppHome () {
        this.$router.push({
          name: 'MinAppHome'
        })
      },
      toChooseProduct () {
        this.$router.push({
          name: 'ChooseProduct'
        })
      },
      toOrder () {
        this.$router.push({
          name: 'OrderIndex',
          query: {
            status: PUSH_STATUS_DASHBOARD
          }
        })
      },
      toOrderRefund () {
        this.$router.push({
          name: 'OrderRefund'
        })
      },
      getShowPrice (num) {
        let val = num * 1.0 / 100
        if (val < 10000) {
          return `¥${val}`
        } else if (val > 100000000) {
          return `¥${(val / 100000000).toFixed(2)}亿`
        } else {
          return `¥${(val / 10000).toFixed(2)}万`
        }
      },
      async getDashboardData () {
        try {
          this.loading = true
          let res = await HomeApi.getHomeData(this.$tid)
          this.data = res.data
          this.loading = false
        } catch (err) {
        } finally {
          this.loading = false
        }
      }
    },
    mounted () {
      this.getDashboardData()
    },
    created () {
    }
  }
</script>


<style lang="scss" scoped>
  .flexBox {
    width: 46.8%;
    display: flex;
    justify-content: space-between;
  }
  .center-img {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 150px;
    height: 84px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .center-text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 150px;
    height: 50px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .body {
    display: flex;
    .button-body {
      position: relative;
      width: 46.8%;
      min-width: 200px;
      height: 200px;
      background: #F5F7FA;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      display: inline-block;
      cursor: pointer;
      .img {
        width: 50px;
        height: 50px;
      }
      .text-body {
        display: inline-block;
        height: 22px;
        line-height: 22px;
        font-size: 16px;
        color: #303133;
      }
      .title-body {
        display: inline-block;
        height: 22px;
        line-height: 22px;
        font-size: 16px;
        color: #303133;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .remark {
        font-size: 14px;
        color: #606266;
        height: 20px;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .body-wide-screen {
    display: flex;
    .button-body {
      position: relative;
      width: 48.7%;
      min-width: 200px;
      height: 200px;
      background: #F5F7FA;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      display: inline-block;
      cursor: pointer;
      .img {
        width: 50px;
        height: 50px;
      }
      .text-body {
        display: inline-block;
        height: 22px;
        line-height: 22px;
        font-size: 16px;
        color: #303133;
      }
      .title-body {
        display: inline-block;
        height: 22px;
        line-height: 22px;
        font-size: 16px;
        color: #303133;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .remark {
        font-size: 14px;
        color: #606266;
        height: 20px;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .head {
    display: flex;
    .button-head {
      cursor: pointer;
      position: relative;
      display: inline-block;
      border-radius: 4px;
      width: 46.8%;
      min-width: 200px;
      height: 200px;
      .text-head {
        height: 20px;
        width: 70px;
        opacity: 0.9;
        font-size: 14px;
        color: #FFFFFF;
        line-height: 20px;
        margin-top: 20px;
        margin-left: 20px;
        display: inline-block;
      }
      .number-head {
        position: absolute;
        display: inline-block;
        line-height: 50px;
        height: 50px;
        font-size: 36px;
        color: #FFFFFF;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .background-image-xuanhuo {
    @include bg-img(url("../../../assets/image/home-xuanhuo.png"));
  }

  .background-image-setting {
    @include bg-img(url("../../../assets/image/home-setting.png"));
  }

  .gradual-change-red {
    background-image: linear-gradient(44deg, #F97998 0%, #FFC582 94%);
  }

  .gradual-change-blue {
    background-image: linear-gradient(45deg, #3BE6F4 0%, #D790FF 100%);
  }

  .button:hover {
    background: #fff;
    border-color: #409eff;
    color: #409eff;
  }

  .button:active {
    border-color: #3a8ee6;
    color: #3a8ee6;
  }

  .margin-right {
    margin-right: 20px;
  }

  .margin-bottom {
    margin-bottom: 20px;
  }

  .dlgImg {
    width: 150px;
    height: 150px;
    margin-left: 48px;
  }

  .dlgImg-footer {
    margin-top: 10px;
    width: 132px;
    height: 17px;
    line-height: 17px;
    font-size: 12px;
    color: #606266;
    margin-left: 57px;
  }
</style>
