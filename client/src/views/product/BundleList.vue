<template>
  <div class="bundle_list">
    <div class="search_box">
      <p v-if="freeDeliveryPossibleAmount"
         class="guide"
      >
        매장 내 다른 상품<br>
        {{ freeDeliveryPossibleAmount }}원 이상 상품 주문시 배송비 무료
      </p>
      <p class="search">
        <label>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="매장내 검색"
            required
            @keyup.enter="search"
          >
          <button
            type="button"
            class="btn_reset"
            @click="initSearchKeyword"
          >
            <span>검색어초기화</span>
          </button>
          <button
            type="type"
            class="btn_search"
            @click="search"
          >
            검색
          </button>
        </label>
      </p>
    </div>
    <div class="search_result_top border_none">
      <div class="left_box">
        <p class="total">
          전체 <strong>{{ totalProductCount }}</strong>개
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
      <div class="sort">
        <p
          class="current"
          :class="sortClass ? 'active' : ''"
          @click="clickSortButton()"
        >
          {{ getSortLabel(sortCriteria) }}
        </p>
        <ul
          class="filter_list"
          :class="sortClass ? 'active' : ''"
        >
          <li>
            <input
              id="sort1"
              v-model="sortCriteria"
              type="radio"
              name="sort"
              value="weight"
              @change="sort()"
            >
            <label for="sort1">NS추천</label>
          </li>
          <li>
            <input
              id="sort2"
              v-model="sortCriteria"
              type="radio"
              name="sort"
              value="best"
              @change="sort()"
            >
            <label for="sort2">판매량순</label>
          </li>
          <li>
            <input
              id="sort3"
              v-model="sortCriteria"
              type="radio"
              name="sort"
              value="lowPrice"
              @change="sort()"
            >
            <label for="sort3">낮은가격순</label>
          </li>
          <li>
            <input
              id="sort4"
              v-model="sortCriteria"
              type="radio"
              name="sort"
              value="topPrice"
              @change="sort()"
            >
            <label for="sort4">높은가격순</label>
          </li>
          <li>
            <input
              id="sort5"
              v-model="sortCriteria"
              type="radio"
              name="sort"
              value="comment"
              @change="sort()"
            >
            <label for="sort5">상품평순</label>
          </li>
        </ul>
      </div>
    </div>
    <div
      v-if="bundleProductList.length > 0"
      ref="productList"
      class="product_list"
      :class="listGridClass ? 'grid' : ''"
    >
      <div v-for="(bundleProduct,index) in bundleProductList"
           :key="index"
           class="list"
      >
        <router-link
          :to="{ name: 'productDetail', params: { number: bundleProduct.partNumber, clksrc: '장바구니_배송비절약상품목록' }}"
        >
          <div class="product_info">
            <figure>
              <ns-img
                :product-number="bundleProduct.partNumber"
                :width="366"
                :height="366"
                :alt="bundleProduct.brand_kor_nm"
                :is-adult="bundleProduct.adultItemFlag"
              />
            </figure>
            <div class="field">
              <ns-price
                :dc-price="bundleProduct.pricedcprice"
                :dc-rate="bundleProduct.saleRate"
                :price="bundleProduct.priceofferprice"
                :mm-rntal-prc="bundleProduct.mmRntalPrc"
                :prc-wave-disp="bundleProduct.prcWaveDisp"
                :buschn-id="bundleProduct.busChnId"
                :disp-type-cd="bundleProduct.dispTypeCd"
              />
              <p class="title">
                {{ bundleProduct.itncatentrynm }}
              </p>
            </div>
          </div>
        </router-link>
        <div class="product_bottom">
          <ul class="benefit">
            <li v-if="bundleProduct.dlvrPrice === 0">
              무료배송
            </li>
            <li v-if="bundleProduct.ifiValue > 0">
              무이자
            </li>
            <li v-if="bundleProduct.padValue">
              적립금
            </li>
          </ul>
          <div class="star_box">
            <div v-if="bundleProduct.join_cnt" class="star_wrap">
              <span class="rating_star">
                <span class="star" />
                <span
                  class="rating"
                  :style="{width: `${bundleProduct.score}%`}"
                />
              </span>
              <span class="count">({{ bundleProduct.join_cnt }})</span>
            </div>
          </div>
          <p class="wish">
            <span v-if="bundleProduct.orderItemCount">
              {{ bundleProduct.orderItemCount > 9999 ? '+9999' : bundleProduct.orderItemCount }}개 구매중
            </span>
            <span v-else />
            <button
              type="button"
              class="button_wish"
              @click="bizUtil.wishToggle($event, bundleProduct.partNumber, globalVal)"
            >
              <i
                class="icons_wish"
              />
            </button>
          </p>
        </div>
      </div>
    </div>
    <div v-else-if="isLoadingCompleted"
         class="search_result_empty"
    >
      <div>
        <p class="guide">
          <strong>{{ searchKeyword }}</strong>에 대한 아래와 같은 조건값과 일치하는 검색 결과가 없습니다
        </p>
      </div>
    </div>
    <span class="scroll_target" />
  </div>
</template>

<script>
import { insertCommas } from '@utils/commonutil/commonUtil'
import COMM_CONST from '@/common/constants/framework/constants'
import bizUtil from '@utils/bizUtil'
import uiUtil from '@utils/uiUtil'
import { PRODUCT_CONST } from '@/common/constants/product/product'
import SEARCH_CONST from '@/common/constants/search/search'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import bundleListService from '@services/product/bundleListService'
import productDetailService from '@services/product/productDetailService'

export default {
  name: 'BundleList',
  components: {
    NsImg,
    NsPrice
  },
  data () {
    return {
      isLoadingCompleted: false, // 데이터 가져오는 동안 로딩만 보여줌
      isGuideShowOk: false, // 배송비 무료 가이드 표시 여부
      globalVal: {}, // 공통 데이터
      bundleProductList: [], // 상품목록
      pageIdx: 1, // 페이지 인덱스
      pageSize: 10, // 페이징 사이즈
      scrollObject: { // 무한스크롤 설정을 위한 옵션 객체.
        callback: this.pagePulling
      },
      totalProductCount: 0, // 전체 상품 개수
      freeDeliveryPossibleAmount: 0, // 배송비 무료 최소 금액
      currentPage: 1,
      isCallCashReceiptListInLoading: false, // 조회중 플래그
      sortCriteria: 'weight', // 정렬기준
      searchKeyword: '', // 검색어
      listGridClass: '', // 격자보기 클래스
      sortClass: '' // 정렬 클래스
    }
  },
  computed: {
    /**
     * bizUtil
     *
     */
    bizUtil () {
      return bizUtil
    }
  },
  created () {
    this.init()
  },
  updated () {
    // 전문매장, 혜택 높이 정렬
    const vm = this
    const productList = document.querySelectorAll('.product_list .list')
    productList.forEach((element, index) => {
      if (index % 2 === 0) {
        const benefit = element.querySelector('.benefit')
        const nextElement = benefit.closest('.list').nextElementSibling
        if (nextElement) {
          const nextBenefit = nextElement.querySelector('.benefit')
          const benefitHeight = benefit.clientHeight
          const nextBenefitHeight = nextBenefit.clientHeight
          if (vm.listGridClass) {
            if (benefitHeight > nextBenefitHeight) {
              nextBenefit.style.height = `${benefitHeight}px`
            } else if (benefitHeight < nextBenefitHeight) {
              benefit.style.height = `${nextBenefitHeight}px`
            }
          } else {
            benefit.style.height = 'auto'
            nextBenefit.style.height = 'auto'
          }
        }
      }
    })
  },
  async mounted () {
    const scrollEventTarget = document.querySelector('.scroll_target')
    uiUtil.setInfiniteScroll(this, {
      callback: () => {
        if (this.bundleProductList?.length) {
          this.getDCDeliveryProducts()
        }
      },
      targetElement: scrollEventTarget
    })
  },
  methods: {
    insertCommas,
    /**
     * 초기화
     *
     */
    async init () {
      this.globalVal.partNumber = this.$route.params.partNumber
      if (this.$route?.params?.globalVal) {
        this.globalVal = this.$route?.params?.globalVal
      } else {
        const productDetailData = await this.getProductDetail()
        const { info } = productDetailData.msg.goods[0]
        this.$set(this.globalVal, 'productInfo', info)
      }
      this.getDCDeliveryProducts()
    },
    /**
     * 목록 초기화
     */
    initProductInfo () {
      this.pageIdx = 1
      this.bundleProductList = []
    },
    /**
     * 검색창 초기화
     *
     */
    initSearchKeyword () {
      this.searchKeyword = ''
      this.search()
    },
    /**
     * 검색
     *
     */
    search () {
      this.initProductInfo()
      this.getDCDeliveryProducts()
    },
    /**
     * 상품 가격
     *
     * @param {Object} product 상품정보
     * @returns {String} 가격포맷의 가격
     */
    getPrice (product) {
      const isRentalProduct = (
        product.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL ||
       product.dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_PHONE
      )
      const price = isRentalProduct ? product.mmRntalPrc : product.priceofferprice
      return insertCommas(price)
    },
    /**
     * 상품상세 데이터 가져오기
     *
     */
    async getProductDetail () {
      const productDetailParams = {
        partNumber: this.globalVal.partNumber,
        cocd: COMM_CONST.getCocd(), // 외부유입경로 코드(제휴사코드)
        imgSizeType: PRODUCT_CONST.PRODUCT_DETAIL_IMAGE_SIZE
      }

      return await productDetailService.getProductDetail(productDetailParams)
      // const productDetailData = await productDetailService.getProductDetail(productDetailParams)
      // const { info } = productDetailData.msg.goods[0]
      // this.$set(this.globalVal, 'productInfo', info)
    },
    /**
     * 상품목록 가져오기
     *
     */
    getDCDeliveryProducts () {
      const successHandling = response => {
        const { TotalCount, FreeDlvrPossAmt, ProductList } = response.msg.root
        this.totalProductCount = insertCommas(TotalCount)
        this.freeDeliveryPossibleAmount = FreeDlvrPossAmt !== '999,999,999,999' ? insertCommas(FreeDlvrPossAmt) : 0
        this.bundleProductList = [...this.bundleProductList, ...ProductList]

        this.pageIdx++
        this.isLoadingCompleted = true
      }

      const invoke = {
        searchType: 'search',
        currentPage: this.pageIdx,
        pageSize: this.pageSize,
        sortCriteria: this.sortCriteria,
        catentryId: this.globalVal?.productInfo?.catentryId,
        brandName: this.globalVal?.productInfo?.brandName,
        freeDeliverYn: this.globalVal?.productInfo?.freeDeliverYn,
        searchTerm: this.searchKeyword
      }

      this.isLoadingCompleted = false
      if (this.globalVal?.productInfo?.catentryId) {
        bundleListService.getDCDeliveryProducts(invoke, successHandling)
      }
    },
    /**
     * 리스트 그리드 토글
     *
     */
    listGrid () {
      this.listGridClass = !this.listGridClass
    },
    /**
     * 상품 정렬버튼 클릭
     *
     */
    clickSortButton () {
      this.sortClass = !this.sortClass
    },
    /**
     * 정렬기준 변경
     *
     */
    sort () {
      if (this.bundleProductList?.length) {
        this.initProductInfo()
        this.getDCDeliveryProducts()
      }
      this.sortClass = !this.sortClass
    },
    /**
     * 정렬의 한글값을 반환.
     * @param {String} key 라벨 분류키(필수)
     * @returns {String}
     */
    getSortLabel (key) {
      return SEARCH_CONST.SORT_LABEL_LIST[key]
    }

  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/product/BundleList";
</style>
