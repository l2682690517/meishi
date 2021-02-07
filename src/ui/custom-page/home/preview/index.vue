<template lang="pug">
  div
    el-dialog(title="自定义首页预览", :width="mediumDialogWidth",  :visible.sync="dialogVisible")
      div.content
        div(v-if="model.carousel && model.carousel.length > 0")
          el-carousel.carousel(height="280px")
            el-carousel-item(v-for="item in carouselImages", :key="item")
              div.carousel-img(v-lazy:background-image="item")
        div(v-if="model.custom && model.custom.length > 0")
          div(v-for="item in model.custom")
            img.image(v-if="item.cover && item.cover.url", :src="item.cover.url")
            div.goods(v-else-if="item.content_tp===1")
              div.goods-img.img-cover(v-lazy:background-image="goodsImage(item.product)")
              div.txt-title {{item.product.name}}
              div.txt-txt-desc {{item.product.sell_point}}
              div
                span.price {{goodsPrice(item.product)}}
                span.st-price {{spPrice(item.product.st_price)}}
            div.group(v-else-if="item.content_tp===2")
              div.title.txt-title {{item.product_group.name}}
              div.group-view
                div.group-goods(v-for="product in item.product_group.products")
                  div.goods-icon.img-cover(v-lazy:background-image="goodsImage(product)")
                  div.txt.txt-title {{product.name}}
                  div
                    span.price {{goodsPrice(product)}}
                    span.st-price {{spPrice(product.st_price)}}

      div.dialog-footer(slot="footer")
        el-button(@click="dialogVisible = false") 关闭
</template>

<script>
  import { convertFenToYuan } from '../../../../util/moneyUtil'
  import { mediumDialogWidth } from 'src/config/el'

  export default {
    components: {},
    data () {
      return {
        dialogVisible: false,
        model: {},
        ...$global.$mapConst({
          'mediumDialogWidth': mediumDialogWidth
        })
      }
    },
    computed: {
      carouselImages () {
        return this.model.carousel.map(item => item.cover.url)
      }
    },
    methods: {
      show (model) {
        this.dialogVisible = true
        this.model = model
      },
      goodsImage (product) {
        if (product.cover) {
          return product.cover.url
        } else {
          return product.head[0].url
        }
      },
      spPrice (p) {
        return `￥${convertFenToYuan(p)}`
      },
      goodsPrice (goods) {
        if (goods.min_price === goods.max_price) {
          return `¥${convertFenToYuan(goods.min_price)}`
        } else {
          return `¥${convertFenToYuan(goods.min_price)}~${convertFenToYuan(goods.max_price)}`
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    margin-left: auto;
    margin-right: auto;
  }

  .carousel {
    width: 100%;
    height: 280px;

    .carousel-img {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
    }
  }

  .image {
    width: 100%;
  }

  .price {
    color: $font-color-common;
    font-size: $font-size-desc;
  }

  .st-price {
    margin-left: 10px;
    color: $font-color-secondary;
    font-size: $font-size-desc;
    text-decoration: line-through;
  }

  .goods {
    margin-top: 10px;
    width: 100%;

    .goods-img {
      width: 100%;
      height: 280px;
    }
  }

  .group {
    margin-top: 10px;
    width: 100%;

    .title {
      height: 30px;
      line-height: 30px;
    }

    .group-view {
      width: 100%;
      white-space: nowrap;
      overflow: auto;

      .group-goods {
        font-size: 0;
        vertical-align: top;
        margin: 0 10px;
        width: 180px;
        display: inline-block;

        .goods-icon {
          width: 180px;
          height: 180px;
        }

        .txt {
          margin-top: 6px;
          width: 180px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          word-break: break-all;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
