<template lang="pug">

  mixin imageContent
    div.box
      div.image-content(v-if!="props.row.tp === allContentTp.img.value", v-lazy:background-image="props.row.url")
      div.text-content(v-if!="props.row.tp === allContentTp.img.value") {{computeFileName(props.row.url)}}
  mixin textContent
    div.text-content(v-if!="props.row.tp === allContentTp.text.value")
      el-form-item.show-validate-el-form(:ref="`text${props.index}`", :prop="'content.' + props.index + '.text'", :rules="formRules.text")
        el-input(style="width: 100%", v-model="props.row.text", :maxlength="2000", type="textarea", :autosize="{ minRows: 1, maxRows: 15}")

  div
    smart-table.large-el-table(ref="contentTable", :dataList="content", :showHeader="false",  @drag-change="handleDragChange",  @drag-end="handleDragEnd")
      smart-table-column(type="drag")
      smart-table-column(label="内容")
        div(slot-scope="props")
          +imageContent
          +textContent
      smart-table-column(label="", width="250px")
        div(slot-scope="props")
          el-button(type="", size="mini", icon="el-icon-plus", plain, @click="handleCreateAbove(props.index)") 上面
          el-button(type="", size="mini",  icon="el-icon-plus", plain, @click="handleCreateBelow(props.index)") 下面
          el-button(type="danger", size="mini", plain, @click="handleDel(props.index)") 删除
    div
      el-button(type="primary", size="mini", plain, @click="handleCreate") 添加描述
      el-button(type="", size="mini", plain, @click="showPreview") 预 览
    create-content-dialog(ref="dlgCreateContent", @success="handleCreateSuccess")
    preview-dialog(ref="dlgPreview", :resources="content")
</template>

<script>
  import emitter from 'element-ui/src/mixins/emitter'
  import {SmartTable, SmartTableColumn} from '@baibao/zeratul'
  import CreateContentDialog from './CreateContentDialog.vue'
  import * as ResourceService from 'src/service/resource/index'
  import PreviewDialog from 'src/ui/common/preview/PreviewDialog'

  export default {
    mixins: [emitter],
    components: {
      SmartTable,
      SmartTableColumn,
      CreateContentDialog,
      PreviewDialog
    },
    props: {
      content: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        formRules: {
          text: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        createAtPos: -1,
        ...$global.$mapConst({
          'allContentTp': ResourceService.allTp
        })
      }
    },
    methods: {
      showPreview () {
        this.$refs.dlgPreview.show()
      },
      handleDragChange (dataList) {
        this.$emit('update:content', arguments[0])
        this.dispatch('ElFormItem', 'el.form.change', [dataList])
      },
      async handleDragEnd () {
        await this.$nextTick()
        for (const i in this.content) {
          this.$refs[`text${i}`] && this.$refs[`text${i}`].clearValidate()
        }
      },
      handleCreate () {
        this.createAtPos = this.content.length
        this.$refs.dlgCreateContent.show()
      },
      handleCreateAbove (index) {
        this.createAtPos = index
        this.$refs.dlgCreateContent.show()
      },
      handleCreateBelow (index) {
        this.createAtPos = index + 1
        this.$refs.dlgCreateContent.show()
      },
      handleCreateSuccess (data) {
        if (this.createAtPos < 0 || this.createAtPos >= this.content.length) {
          this.content.push(...this.R.clone(data))
        } else {
          this.content.splice(this.createAtPos, 0, ...this.R.clone(data))
        }
      },
      handleDel (index) {
        this.content.splice(index, 1)
      },
      computeFileName (url) {
        var index = url.lastIndexOf('/')
        var ext = url.substr(index + 1)
        return decodeURIComponent(ext.replace(/%25/g, '%'))
      }
    }
  }
</script>

<style lang="scss" scoped>
  .text-content {
    height: 50px;
    margin-left: 10px;
    line-height: 50px;
    display: inline-block;
    width: 95%;
  }

  .box {
    display: flex;
  }

  .image-content {
    width: 50px;
    height: 50px;
    display: inline-block;
    background-size: cover;
    background-position: center;
  }
</style>
