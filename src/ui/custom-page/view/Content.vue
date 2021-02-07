<template lang="pug">
  smart-table.large-el-table(:dataList="dataList", :showHeader="false", :filterMethod="filterContent", @drag-change="handleDragChange")
    smart-table-column(label="", type="drag")
    smart-table-column(width="400px")
      div.content-column(slot-scope="props")
        div.icon.img-cover(v-lazy:background-image="props.row.cover.url", v-if="props.row.cover.url")
        div.text.single-line
          div.name.single-line(@click="$emit('open', props.row)") {{showNamePrefix(props.row)}}
            span.link {{showName(props.row)}}
          div.time.single-line {{showTime(props.row)}}
    smart-table-column()
      div(slot-scope="props")
        el-button(size="mini", type="", plain, v-clipboard:copy="getAppUrl(props.row)", v-clipboard:success="onCopy", v-clipboard:error="onError") 小程序链接
        el-button(size="mini", type="", @click="$emit('edit', props)",  plain) 更换
        el-button(size="mini", type="danger", @click="$emit('delete', props)",  plain) 删除
</template>

<script>
  import emitter from 'element-ui/src/mixins/emitter'
  import { dateFormatMinute } from 'src/util/format'
  import * as CustomPageService from 'src/service/custome-page/index'
  import { SmartTable, SmartTableColumn } from '@baibao/zeratul'

  export default {
    mixins: [emitter],
    components: {
      SmartTable,
      SmartTableColumn
    },
    props: {
      dataList: {
        type: Array,
        required: true
      },
      showAll: false,
      serverNow: 0
    },
    data () {
      return {
        clientNow: 0,
        ...$global.$mapConst({
          'allContentTp': CustomPageService.allContentTp
        })
      }
    },
    watch: {
      serverNow () {
        this.clientNow = new Date().getTime()
      }
    },
    methods: {
      getAppUrl (row) {
        if (row.content_tp === 2) {
          return `pages/goods/index?gid=${row.product_group.id}`
        }
        return `pages/goods/detail?pid=${row.product.id}`
      },
      onError () {
        this.$message({
          type: 'danger',
          message: '复制失败'
        })
      },
      onCopy () {
        this.$message({
          type: 'success',
          message: '已复制小程序连接到剪贴板'
        })
      },
      handleDragChange (dataList) {
        this.$emit('update:dataList', arguments[0])
        this.dispatch('ElFormItem', 'el.form.change', [dataList])
      },
      showTime (row) {
        if (row.show_tp === CustomPageService.allShowTp.show_limit.value) {
          return `上线时间：${dateFormatMinute(row.show_start)}～${dateFormatMinute(row.show_end)}`
        } else {
          return ''
        }
      },
      showNamePrefix (row) {
        let text = ''
        if (row.content_tp === this.allContentTp.product.value) {
          text = this.allContentTp.product.text
        } else if (row.content_tp === this.allContentTp.product_group.value) {
          text = this.allContentTp.product_group.text
        } else {
          return ''
        }
        return text + '：'
      },
      showName (row) {
        let text = ''
        if (row.content_tp === this.allContentTp.product.value) {
          text = `${row.product.name}`
        } else if (row.content_tp === this.allContentTp.product_group.value) {
          text = `${row.product_group.name}`
        } else {
          return ''
        }
        return text
      },
      filterContent (props) {
        if (!this.showAll) {
          if (props.row.show_tp === CustomPageService.allShowTp.show_limit.value) {
            let currentServerCt = new Date().getTime()
            if (this.serverNow !== 0) {
              currentServerCt = this.serverNow + new Date().getTime() - this.clientNow
            }
            return currentServerCt > props.row.show_start && currentServerCt < props.row.show_end
          }
        }
        return true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content-column {
    display: flex;

    .icon {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }

    .text {
      position: relative;
      height: 50px;
      flex: 1;
      min-width: 0;

      .name {
        color: $font-color-common;
        font-size: $font-size-content;
        line-height: 50px;
        min-width: 0;
        width: 100%;
        cursor: pointer;

        .link {
          color: $color-primary;
        }
      }
      .time {
        position: absolute;
        bottom: 0;
        color: $font-color-secondary;
        font-size: $font-size-desc;
        line-height: 1.2;
      }
    }
  }
</style>
