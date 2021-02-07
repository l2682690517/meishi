<template lang="pug">
  div(v-loading="loading")
    div.section
      div.title.txt-x-title 轮播图
      div.content
        div
          el-button(type="primary", size="small", plain, icon="el-icon-plus", @click="handleAdd($options.SECTION_CAROUSEL)") 添加
          el-checkbox.select-all(v-model="showAllCarousel") 未上线内容
          a.help(href="https://shimo.im/docs/Jmo3dqcWSQEJ7eWv/", target="view_window") 小程序连接怎么用？
        page-content(:dataList.sync="carouselDataList", :showAll="showAllCarousel", :serverNow="serverNow", @edit="handleEdit(arguments[0], $options.SECTION_CAROUSEL)", @delete="handleDelete(arguments[0], $options.SECTION_CAROUSEL)", @open="showDetail")
    div.section
      div.title.txt-x-title 自定义模块
      div.content
        div
          el-button(type="primary", plain, size="small", icon="el-icon-plus", @click="handleAdd($options.SECTION_CUSTOM)") 添加
          span.count {{  customDataList.length }} / {{ customModelMax }}
          el-checkbox.select-all(v-model="showAllCustom") 未上线内容
          a.help-custom(href="https://shimo.im/docs/Jmo3dqcWSQEJ7eWv/", target="view_window") 小程序连接怎么用？
        page-content(:dataList.sync="customDataList", :showAll="showAllCustom", :serverNow="serverNow", @edit="handleEdit(arguments[0], $options.SECTION_CUSTOM)",  @delete="handleDelete(arguments[0], $options.SECTION_CUSTOM)", @open="showDetail")
    div.margin
      el-button(type="primary", @click="submit") 提 交
      el-button(@click="preview") 预 览

    content-dialog(ref="dlgContent", @added="handleContentAdded")
    preview-dialog(ref="dlgPreview")
    product-detail-dialog(ref="dlgProductDetail")
    product-group-detail-dialog(ref="dlgProductGroupDetail")
</template>

<script>
  import ProductGroupDetailDialog from 'src/ui/custom-page/view/ProductGroupDialog.vue'
  import ProductDetailDialog from 'src/ui/common/ProductDetail/ProductDetailDialog.vue'
  import * as MinAppApi from 'src/api/minApp'
  import {
    convertHomePageFormToParam,
    convertPageContentModelToForm,
    allContentTp
  } from 'src/service/custome-page/index'
  import PageContent from '../view/Content.vue'
  import ContentDialog from '../view/ContentDialog.vue'
  import PreviewDialog from './preview/index'

  const SECTION_CAROUSEL = 'CAROUSEL'
  const SECTION_CUSTOM = 'CUSTOM'

  const getDisabledProductItems = (allData, excludeItem) => {
    let disabledItems = []
    for (const item of allData) {
      if (excludeItem && item === excludeItem) {
        continue
      }
      if (item.content_tp === allContentTp.product.value) {
        disabledItems.push(item.product.id)
      }
    }
    return disabledItems
  }

  const getDisabledProductGroupItems = (allData, excludeItem) => {
    let disabledItems = []
    for (const item of allData) {
      if (excludeItem && item === excludeItem) {
        continue
      }
      if (item.content_tp === allContentTp.product_group.value) {
        disabledItems.push(item.product_group.id)
      }
    }
    return disabledItems
  }

  export default {
    SECTION_CAROUSEL,
    SECTION_CUSTOM,
    components: {
      PageContent,
      ContentDialog,
      PreviewDialog,
      ProductDetailDialog,
      ProductGroupDetailDialog
    },
    data () {
      return {
        loading: false,
        carouselDataList: [],
        customDataList: [],
        customModelMax: 50,
        sectionTag: '',
        showAllCarousel: false,
        showAllCustom: false,
        serverNow: 0,
        change: 0
      }
    },
    computed: {
    },
    watch: {
      carouselDataList: {
        handler: function (newVal, oldVal) {
          if (oldVal.length !== 0) {
            this.change++
          }
        },
        deep: true
      },
      customDataList: {
        handler: function (newVal, oldVal) {
          if (oldVal.length !== 0) {
            this.change++
          }
        },
        deep: true
      },
      change () {
        return this.change > 2
      }
    },
    methods: {
      showDetail (row) {
        if (row.content_tp === 1) {
          this.$refs.dlgProductDetail.show(row.product, this.change)
        } else {
          this.$refs.dlgProductGroupDetail.show(row.product_group.id, this.change)
        }
      },
      handleEdit (props, tag) {
        if (tag !== SECTION_CAROUSEL && tag !== SECTION_CUSTOM) {
          console.error('bad tag', tag)
          return
        }
        const disabledProductItems = getDisabledProductItems(tag === SECTION_CAROUSEL ? this.carouselDataList : this.customDataList, props.row)
        const disabledProductGroupItems = getDisabledProductGroupItems(tag === SECTION_CAROUSEL ? this.carouselDataList : this.customDataList, props.row)
        this.$refs.dlgContent.show(props.row, {
          coverRequired: tag === SECTION_CAROUSEL,
          disabledProductItems: disabledProductItems,
          disabledProductGroupItems: disabledProductGroupItems
        })
      },
      handleAdd (tag) {
        if (tag !== SECTION_CAROUSEL && tag !== SECTION_CUSTOM) {
          console.error('bad tag', tag)
          return
        }
        const disabledProductItems = getDisabledProductItems(tag === SECTION_CAROUSEL ? this.carouselDataList : this.customDataList)
        const disabledProductGroupItems = getDisabledProductGroupItems(tag === SECTION_CAROUSEL ? this.carouselDataList : this.customDataList)
        this.sectionTag = tag
        this.$refs.dlgContent.show(null, {
          coverRequired: tag === SECTION_CAROUSEL,
          disabledProductItems: disabledProductItems,
          disabledProductGroupItems: disabledProductGroupItems
        })
      },
      handleDelete (props, tag) {
        if (tag === SECTION_CAROUSEL) {
          this.carouselDataList.splice(props.index, 1)
        } else if (tag === SECTION_CUSTOM) {
          this.customDataList.splice(props.index, 1)
        }
      },
      handleContentAdded (data) {
        if (this.sectionTag === SECTION_CAROUSEL) {
          this.carouselDataList.push(data)
        } else if (this.sectionTag === SECTION_CUSTOM) {
          if (this.customDataList.length > this.customModelMax) {
            this.$message({
              type: 'error',
              message: '超出限制'
            })
            return
          }
          this.customDataList.push(data)
        }
      },
      async submit () {
        try {
          this.loading = true
          const formData = convertHomePageFormToParam({carousel: this.carouselDataList, custom: this.customDataList})
          const resData = await MinAppApi.update(this.$tid, formData)
          if (resData.data) {
            this.serverNow = resData.data.now
            this.carouselDataList = convertPageContentModelToForm(resData.data.carousel || [])
            this.customDataList = convertPageContentModelToForm(resData.data.custom || [])
          }
          this.$message({
            showClose: true,
            message: '提交成功',
            type: 'success'
          })
        } finally {
          this.loading = false
        }
      },
      async preview () {
        this.$refs.dlgPreview.show({carousel: this.carouselDataList || [], custom: this.customDataList || []})
      },
      async getList () {
        try {
          this.loading = true
          const res = await MinAppApi.getList(this.$tid)
          if (res.data) {
            this.serverNow = res.data.now
            this.carouselDataList = convertPageContentModelToForm(res.data.carousel || [])
            this.customDataList = convertPageContentModelToForm(res.data.custom || [])
          }
        } finally {
          this.loading = false
        }
      }
    },
    mounted () {
      this.getList()
    }
  }
</script>


<style lang="scss" scoped>

  .margin {
    margin-top: 30px
  }

  .section {
    margin-bottom: 30px;

    .title {
      margin-bottom: 10px;
      font-weight: 700;
    }

    .content {
      padding-left: 20px;
    }
    .help {
      margin-left: 396px;
      font-size: 14px;
    }
    .help-custom{
      margin-left: 352px;
      font-size: 14px;
    }
    .select-all {
      margin-left: 10px;
    }

    .count {
      font-size: $font-size-content;
      margin-left: 10px;
      color: $font-color-secondary;
    }
  }


</style>
