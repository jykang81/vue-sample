<template>
  <section class="section_related_prd">
    <div
      v-if="togetherViewList && togetherViewList.length > 2"
      class="recommend_slide_area together_view"
    >
      <h3>고객님들이 함께 보신 상품</h3>
      <swiper
        ref="swiperProgressbar"
        :options="swiperProgressbar"
        class="swiper_product"
      >
        <swiper-slide
          v-for="(togetherViewItem,index) in (togetherViewList) "
          :key="index"
        >
          <router-link
            :to="{
              name: 'productDetail',
              params: {
                number: togetherViewItem.partnumber,
                clksrc: '고객님들이_함께_보신_상품',
                rcCode: togetherViewItem.rccode
              }
            }"
            @click.native="gotoProductDetail(togetherViewItem, '고객님들이_함께_보신_상품')"
          >
            <figure>
              <ns-img
                :product-number="togetherViewItem.partnumber"
                :width="320"
                :height="320"
                :alt="togetherViewItem.itncatentrynm"
                :is-adult="globalVal.productInfo.adultItemFlag"
              />
            </figure>
            <ns-price
              :dc-price="togetherViewItem.dcPrice"
              :prc-wave-disp="togetherViewItem.prcWaveDisp"
              :buschn-id="togetherViewItem.buschnId"
              :disp-type-cd="togetherViewItem.dispTypeCd"
            />
            <p class="title">
              {{ togetherViewItem.itncatentrynm }}
            </p>
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
    <div
      v-if="togetherPurchaseList && togetherPurchaseList.length > 2"
      class="recommend_slide_area together_purchase"
    >
      <h3>고객님들이 함께 구매한 상품</h3>
      <swiper
        ref="swiperProgressbar"
        :options="swiperProgressbar"
        class="swiper_product"
      >
        <swiper-slide
          v-for="(togetherPurchaseItem,index) in (togetherPurchaseList) "
          :key="index"
        >
          <router-link
            :to="{
              name: 'productDetail',
              params: {
                number: togetherPurchaseItem.partnumber,
                clksrc: '고객님들이_함께_구매한_상품',
                rcCode: togetherPurchaseItem.rccode
              }}"
            @click.native="gotoProductDetail(togetherPurchaseItem, '고객님들이_함께_구매한_상품')"
          >
            <figure>
              <ns-img
                :product-number="togetherPurchaseItem.partnumber"
                :width="320"
                :height="320"
                :alt="togetherPurchaseItem.itncatentrynm"
                :is-adult="globalVal.productInfo.adultItemFlag"
              />
            </figure>
            <ns-price
              :dc-price="togetherPurchaseItem.dcPrice"
              :prc-wave-disp="togetherPurchaseItem.prcWaveDisp"
              :buschn-id="togetherPurchaseItem.buschnId"
              :disp-type-cd="togetherPurchaseItem.dispTypeCd"
            />
            <p class="title">
              {{ togetherPurchaseItem.itncatentrynm }}
            </p>
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
    <div
      v-if="popularProductsList && popularProductsList.length > 2"
      class="recommend_slide_area popular_purchase"
    >
      <h3>고객님들이 많이 구매한 인기상품</h3>
      <swiper
        ref="swiperProgressbar"
        :options="swiperProgressbar"
        class="swiper_product"
      >
        <swiper-slide
          v-for="(popularProductsItem,index) in (popularProductsList) "
          :key="index"
        >
          <router-link
            :to="{
              name: 'productDetail',
              params: {
                number: popularProductsItem.partnumber,
                clksrc: '고객님들이_많이_구매한_인기상품',
                rcCode: popularProductsItem.rccode
              }
            }"
            @click.native="gotoProductDetail(popularProductsItem, '고객님들이_많이_구매한_인기상품')"
          >
            <figure>
              <ns-img
                :product-number="popularProductsItem.partnumber"
                :width="320"
                :height="320"
                :alt="popularProductsItem.itncatentrynm"
                :is-adult="globalVal.productInfo.adultItemFlag"
              />
            </figure>
            <ns-price
              :dc-price="popularProductsItem.dcPrice"
              :prc-wave-disp="popularProductsItem.prcWaveDisp"
              :buschn-id="popularProductsItem.buschnId"
              :disp-type-cd="popularProductsItem.dispTypeCd"
            />
            <p class="title">
              {{ popularProductsItem.itncatentrynm }}
            </p>
          </router-link>
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script>
import {
  insertCommas,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'

export default {
  name: 'RelatedProduct',
  components: {
    NsImg,
    NsPrice
  },
  mixins: [
    storeProductTypeMixin
  ],
  props: {
    globalVal: {
      type: Object,
      required: true
    }

  },
  data () {
    return {
      swiperProgressbar: {
        slidesPerView: 'auto',
        spaceBetween: 8
      }

    }
  },
  computed: {
    /**
     * 다른고객님이 함께 보신 상품 목록
     *
     * @returns {Array} 이미지목록
     */
    togetherViewList () {
      return this.globalVal.togetherViewList
    },
    /**
     * 다른 고객님이 함께 구매하신 상품
     *
     * @returns {Array} 이미지목록
     */
    togetherPurchaseList () {
      return this.globalVal.togetherPurchaseList
    },
    /**
     * 고객님들이 많이 구매하신 인기상품
     *
     * @returns {Array} 이미지목록
     */
    popularProductsList () {
      return this.globalVal.popularProductsList
    }
  },
  methods: {
    insertCommas,
    htmlDecode,
    /**
     * 상품 상세 보기 링크
     *
     * @param {object} product (필수) 상품 데이터
     */
    gotoProductDetail (product, flag) {
      let eventAction = ''
      let eventLabel = ''
      if (flag === '고객님들이_함께_보신_상품') {
        eventAction = '다른 고객님이 함께 보신 상품'
        eventLabel = `${product.seq}_${product.catentryId}_${product.itncatentrynm}`
      } else if (flag === '고객님들이_함께_구매한_상품') {
        eventAction = '다른 고객님이 함께 구매하신상품'
        eventLabel = `${product.seq}_${product.catentryId}_${product.itncatentrynm}`
      } else if (flag === '고객님들이_많이_구매한_인기상품') {
        eventAction = '고객님들이 많이 구매하신 인기상품'
        eventLabel = `${product.seq}_${product.catentryId}_${product.itncatentrynm}`
      }
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction,
          eventLabel,
          params: {
            t1: null
          }
        }
      })

      // 동일 상품 페이지 갱신 처리
      const partNumber = this.$route.params.number
      if (partNumber === product.partnumber) {
        this.$emit('requiresRefresh')
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/product/RelatedProduct";
</style>
