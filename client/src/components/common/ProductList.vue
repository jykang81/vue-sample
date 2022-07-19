<template>
  <div v-if="productList.length" :name="espotName" class="product_list_box">
    <div v-if="useTop" class="search_result_top">
      <div class="left_box">
        <p class="total">
          전체 <strong>{{ totalCount }}</strong>개
        </p>
        <p
          class="btn_list_gird"
          :class="listGridClass ? 'grid' : ''"
        >
          <button
            type="button"
            @click="listGrid"
          >
            그리드/리스트
          </button>
        </p>
      </div>
      <div v-if="useSort" class="sort">
        <p
          class="current"
          :class="sortClass ? 'active' : ''"
          @click="sortClass = !sortClass"
        >
          {{ currentSortName }}
        </p>
        <ul class="filter_list" :class="sortClass ? 'active' : ''">
          <li v-for="(sortData, index) in sortOption" :key="index">
            <input
              :id="`sort_${sortData.value}`"
              v-model="sortCriteria"
              type="radio"
              name="sort"
              :value="sortData.value"
              @click="sortClass = false; $emit('get:product', sortData.value)"
            >
            <label :for="`sort_${sortData.value}`">{{ sortData.name }}</label>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="product_list"
      :class="listGridClass ? 'grid' : ''"
    >
      <div v-for="(product, index) in productList" :key="index" class="list">
        <router-link
          :to="{ name: 'productDetail', params: { number: product.partnumber, clksrc }}"
          @click.native="productLogging(product, index)"
        >
          <div class="product_info">
            <figure>
              <ns-img
                :product-number="product.partnumber"
                :width="230"
                :height="230"
                :alt="product.itncatentrynm"
                :is-adult="product.adultItemFlag"
              />
            </figure>
            <div class="field">
              <ns-price
                :dc-price="product.dcPrice"
                :dc-rate="product.dcRate"
                :price="product.price"
                :mm-rntal-prc="product.mmRntalPrc"
                :prc-wave-disp="product.prcWaveDisp"
                :buschn-id="product.buschnId"
                :disp-type-cd="product.dispTypeCd"
              />
              <p class="title">
                <template v-if="!isNull(product.headCopy)">
                  {{ htmlDecode(product.headCopy) }}
                </template>
                {{ htmlDecode(product.itncatentrynm) }}
              </p>
            </div>
          </div>
        </router-link>
        <div class="product_bottom">
          <ul ref="benefit" class="benefit">
            <li v-if="product.dlvrFreeYn === 'Y' && !isConsultantRequiredProduct(product)">
              무료배송
            </li>
            <li v-if="Number(product.promIfiVal)">
              무이자
            </li>
            <li v-if="product.promPadYn === 'Y'">
              적립금
            </li>
          </ul>
          <div class="star_box">
            <div v-if="Number(product.joinCnt) !== 0" class="star_wrap">
              <span class="rating_star">
                <span class="star" />
                <span
                  class="rating"
                  :style="`width: ${product.scoreRate}%`"
                />
              </span>
              <span class="count">({{ getStarCount(Number(product.joinCnt)) }})</span>
            </div>
          </div>
          <p class="wish">
            <span v-if="Number(product.orderQty) !== 0">
              {{ getOrderCount(Number(product.orderQty)) }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  isNull,
  insertCommas,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'

export default {
  name: 'ProductList',
  components: {
    NsImg,
    NsPrice
  },
  mixins: [
    storeProductTypeMixin
  ],
  props: {
    espotName: { // Name 속성에 넣을 Espot명
      type: String,
      default: ''
    },
    productList: { // 상품 목록
      type: Array,
      required: true
    },
    useTop: { // 상품 목록 상단 그리드/리스트, 정렬 영역 사용 여부
      type: Boolean,
      default: false
    },
    useSort: { // 정렬 사용여부
      type: Boolean,
      default: false
    },
    parentInfo: { // 상품 목록
      type: String,
      default: '',
      requred: false
    },
    clksrc: { // 전자상거래 태그
      type: String,
      default: '',
      requred: false
    },
    totalCount: { // 전체 상품 개수
      type: String,
      default: '',
      required: false
    }
  },
  data () {
    return {
      sortCriteria: 'weight',
      wishClass: false,
      listGridClass: true,
      sortClass: false,
      sortOption: [
        { value: 'weight', name: 'NS추천' },
        { value: 'best', name: '판매량순' },
        { value: 'lowerPrice', name: '낮은가격순' },
        { value: 'topPrice', name: '높은가격순' },
        { value: 'comment', name: '상품평순' },
        { value: 'eval', name: '별점순' },
        { value: 'new', name: '최신순' }
      ]
    }
  },
  computed: {
    /**
     * 현재 정렬 코드
     *
     * @returns {String} 현재 정렬 코드
     */
    currentSortName () {
      return this.sortOption.find(sortData => sortData.value === this.sortCriteria).name
    }
  },
  updated () {
    // 전문매장, 혜택 높이 정렬
    const refs = this?.$refs?.benefit
    if (refs) {
      refs.forEach((element, index) => {
        if (index % 2 === 0) {
          const benefit = this.$refs.benefit[index]
          const nextBenefit = this.$refs.benefit[index + 1]
          if (nextBenefit) {
            const maxHeight = Math.max(benefit.clientHeight, nextBenefit.clientHeight)
            nextBenefit.style.height = this.listGridClass ? `${maxHeight}px` : 'auto'
            benefit.style.height = this.listGridClass ? `${maxHeight}px` : 'auto'
          }
        }
      })
    }
  },
  methods: {
    isNull,
    insertCommas,
    htmlDecode,
    /**
     * 상품 로깅
     *
     * @param {Object} productInfo 상품 정보
     * @param {Number} index 인덱스
     */
    productLogging (productInfo, index) {
      let eventCate = ''
      let eventAction = ''
      let eventLabel = ''
      let btnName = ''
      if (this.parentInfo === 'HappyDeal') {
        eventCate = 'MOBILE_해피딜'
        eventAction = '주간특가'
        eventLabel = `추천해피딜_${productInfo.seq}_${productInfo.partnumber}_${productInfo.itncatentrynm}`
        btnName = '주간특가'
      } else if (this.parentInfo === '1618059') {
        eventCate = 'MOBILE_해피딜'
        eventAction = '카테고리 매장'
        eventLabel = `신석식품_${productInfo.seq}_${productInfo.partnumber}_${productInfo.itncatentrynm}`
        btnName = '신선식품'
      } else if (this.parentInfo === '1618060') {
        eventCate = 'MOBILE_해피딜'
        eventAction = '카테고리 매장'
        eventLabel = `가공식품_${productInfo.seq}_${productInfo.partnumber}_${productInfo.itncatentrynm}`
        btnName = '가공식품'
      } else if (this.parentInfo === '1618061') {
        eventCate = 'MOBILE_해피딜'
        eventAction = '카테고리 매장'
        eventLabel = `건강식품_${productInfo.seq}_${productInfo.partnumber}_${productInfo.itncatentrynm}`
        btnName = '건강식품'
      } else if (this.parentInfo === '1618065') {
        eventCate = 'MOBILE_해피딜'
        eventAction = '카테고리 매장'
        eventLabel = `패션의류_${productInfo.seq}_${productInfo.partnumber}_${productInfo.itncatentrynm}`
        btnName = '패션의류'
      } else if (this.parentInfo === '1618062') {
        eventCate = 'MOBILE_해피딜'
        eventAction = '카테고리 매장'
        eventLabel = `잡화/뷰티_${productInfo.seq}_${productInfo.partnumber}_${productInfo.itncatentrynm}`
        btnName = '잡화/뷰티'
      } else if (this.parentInfo === '1618063') {
        eventCate = 'MOBILE_해피딜'
        eventAction = '카테고리 매장'
        eventLabel = `인테리어_${productInfo.seq}_${productInfo.partnumber}_${productInfo.itncatentrynm}`
        btnName = '인테리어'
      } else if (this.parentInfo === '1618064') {
        eventCate = 'MOBILE_해피딜'
        eventAction = '카테고리 매장'
        eventLabel = `리빙_${productInfo.seq}_${productInfo.partnumber}_${productInfo.itncatentrynm}`
        btnName = '리빙'
      } else if (this.parentInfo === '1618066') {
        eventCate = 'MOBILE_해피딜'
        eventAction = '카테고리 매장'
        eventLabel = `유아동_${productInfo.seq}_${productInfo.partnumber}_${productInfo.itncatentrynm}`
        btnName = '유아동'
      }
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate,
          eventAction,
          eventLabel,
          params: {
            t1: null
          }
        }
      })
      // 제품_상품 유형
      let tvProduct = ''
      if (productInfo.buschnId === 'INT') {
        tvProduct = 'e상품'
      } else {
        tvProduct = 'eTV'
      }
      // E-commerce
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
          params: [
            {
              id: String(productInfo.partnumber),
              name: productInfo.itncatentrynm,
              brand: productInfo.brandKorNm,
              dimension16: tvProduct
            }
          ],
          subparams: {
            t1: '해피딜',
            t2: btnName,
            t3: '상품목록',
            product_list: `해피딜_${btnName}_상품목록`
          }
        }
      })
    },
    /**
     * 리스트 / 그리드 토글
     *
     */
    listGrid () {
      this.listGridClass = !this.listGridClass
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/common/ProductList";
</style>
