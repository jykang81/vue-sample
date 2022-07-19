<template>
  <div v-show="reRenderFlag" class="lnb_category">
    <!-- 중분류 매장일때 소분류 매장 목록 렌더링 -->
    <ul v-if="subCategoryList.length && categoryLevelFinal === '3'" class="category_middle">
      <li
        v-for="(value, index) in subCategoryList"
        :key="`${index}`"
      >
        <router-link :to="{ name: 'lnbCategory', params: { categoryNumber: value.categoryId }}">
          <figure>
            <ns-img
              :src="value.categoryImg"
              :alt="value.categoryNm"
            />
          </figure>
          <p>{{ getHtmlDecode(value.categoryNm) }}</p>
        </router-link>
      </li>
    </ul>
    <!-- 소분류 매장일때 세분류 매장 목록 렌더링 -->
    <ul v-else-if="subCategoryList.length && categoryLevelFinal === '4'" class="category_small">
      <li
        v-for="(value, index) in subCategoryList"
        :key="`${index}`"
      >
        <router-link :to="{ name: 'lnbCategory', params: { categoryNumber: value.categoryId }}">
          {{ getHtmlDecode(value.categoryNm) }}
        </router-link>
      </li>
    </ul>
    <!-- 오늘 베스트 목록 -->
    <template v-if="todayBestList.length">
      <p class="today_best">
        오늘 BEST
      </p>
      <swiper
        ref="swiperList"
        :options="swiperList"
        class="swiper_product"
      >
        <swiper-slide
          v-for="(value, index) in todayBestList"
          :key="`${index}`"
        >
          <router-link
            :to="{ name: 'productDetail', params: { number: value.partnumber, clksrc: '카테고리이동_베스트', lnbCateName: lnbCateName }}"
            @click.native="bestClickLogging(value.rank, value.partnumber, value.itncatentrynm, value.dcPrice, value.buschnId)"
          >
            <figure>
              <ns-img
                :product-number="value.partnumber"
                :width="320"
                :height="320"
                :alt="value.itncatentrynm"
                :is-adult="value.adultItemFlag"
              />
            </figure>
            <ns-price
              :dc-price="value.dcPrice"
              :prc-wave-disp="value.prcWaveDisp"
              :buschn-id="value.buschnId"
              :disp-type-cd="value.dispTypeCd"
            />
            <p class="title">
              {{ value.itncatentrynm }}
            </p>
          </router-link>
        </swiper-slide>
      </swiper>
    </template>
    <div class="search_result_top">
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
      <div :key="reRenderFlag" class="sort">
        <p
          class="current"
          :class="sortClass ? 'active' : ''"
          @click="sort"
        >
          {{ getSortLabel(sortSelected) }}
        </p>
        <ul
          class="filter_list"
          :class="sortClass ? 'active' : ''"
          @change="sortingEvent"
        >
          <li>
            <input
              id="sort1"
              type="radio"
              name="sort"
              checked
              @click="getSortLowerParameter('best')"
            >
            <label for="sort1">{{ getSortLabel('best') }}</label>
          </li>
          <li>
            <input
              id="sort2"
              type="radio"
              name="sort"
              @click="getSortLowerParameter('new')"
            >
            <label for="sort2">{{ getSortLabel('new') }}</label>
          </li>
          <li>
            <input
              id="sort3"
              type="radio"
              name="sort"
              @click="getSortLowerParameter('lowPrice')"
            >
            <label for="sort3">{{ getSortLabel('lowPrice') }}</label>
          </li>
          <li>
            <input
              id="sort4"
              type="radio"
              name="sort"
              @click="getSortLowerParameter('topPrice')"
            >
            <label for="sort4">{{ getSortLabel('topPrice') }}</label>
          </li>
          <li>
            <input
              id="sort5"
              type="radio"
              name="sort"
              @click="getSortLowerParameter('comment')"
            >
            <label for="sort5">{{ getSortLabel('comment') }}</label>
          </li>
        </ul>
      </div>
    </div>
    <!-- 상품 리스트 -->
    <div
      class="product_list"
      :class="listGridClass ? 'grid' : ''"
    >
      <template v-if="productList.length">
        <div
          v-for="(value, index) in productList"
          :key="`${index}`"
          class="list"
        >
          <router-link
            :to="{ name: 'productDetail', params: { number: value.partNumber, clksrc: '카테고리이동_상품목록', lnbCateName: lnbCateName }}"
            @click.native="productClickLogging(value.partNumber, value.busChId, value.productName, value.price, value.brandName)"
          >
            <div class="product_info">
              <figure>
                <ns-img
                  :product-number="value.partNumber"
                  :width="366"
                  :height="366"
                  :alt="value.productName"
                  :is-adult="value.isAdult"
                />
              </figure>
              <div class="field">
                <ns-price
                  :dc-price="value.salePrice"
                  :dc-rate="value.saleRate"
                  :price="value.price"
                  :mm-rntal-prc="value.mmRntalPrc"
                  :prc-wave-disp="value.optRepYn"
                  :buschn-id="value.busChId"
                  :disp-type-cd="value.dispTypeCd"
                />
                <p class="title">
                  {{ setAndGetProductName(value.brandCd, value.busChId, value.brandName, value.productName) }}
                </p>
              </div>
            </div>
          </router-link>
          <div class="product_bottom">
            <ul class="benefit">
              <template
                v-for="(storeTypeValue, storeTypeIndex) in value.storeType"
              >
                <li
                  v-if="Object.values(storeTypeValue).toString() === 'Y'"
                  :key="storeTypeIndex"
                  :class="getStoreTypeClass(Object.keys(storeTypeValue).toString())"
                >
                  {{ getStoreType(Object.keys(storeTypeValue).toString()) }}
                </li>
              </template>
              <li v-if="value.deliveryPrice === 0 && !checkFormlessProduct(value.dispTypeCd)">
                무료배송
              </li>
              <li v-if="value.interestFeeMonth > 0">
                무이자
              </li>
            </ul>
            <div class="star_box">
              <div v-if="!isNull(value.joinCnt) && value.joinCnt > 0" class="star_wrap">
                <span class="rating_star">
                  <span class="star" />
                  <span
                    class="rating"
                    :style="`width: ${value.score}%`"
                  />
                </span>
                <span class="count">({{ getJoinCnt(value.joinCnt) }})</span>
              </div>
              <div v-else class="star_wrap" />
            </div>
            <p class="wish" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {
  isNull,
  htmlDecode,
  insertCommas
} from '@utils/commonutil/commonUtil'
import COMMON_CONST from '@constants/common/common'
import CONST from '@/common/constants/framework/framework'
import STORE_CONST from '@/common/constants/store/store'
import uiUtil from '@utils/uiUtil'
import bizUtil from '@/common/utils/bizUtil'
import loginUtil from '@utils/loginUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'
import storeFormlessMixin from '@/mixins/store/storeFormlessMixin'

export default {
  name: 'LnbCategory',
  components: {
    NsImg,
    NsPrice
  },
  mixins: [
    storeProductTypeMixin,
    storeFormlessMixin
  ],
  data () {
    return {
      swiperList: {
        slidesPerView: 'auto',
        spaceBetween: 8
      }, // swiper options
      wishClass: '', // 찜 클래스
      listGridClass: '', // 리스트 그리드 토글 클래스
      sortClass: false, // 정렬 클래스
      propsData: {}, // 임시
      pageSize: 10, // 상품 목록 갯수 지정 (더 불러올 상품이 있을때 몇건씩 가져올지 결정)
      totalCount: 0, // 총 카운트 (동적 요소)
      pageIdx: 1, // 현재 페이지 (동적 요소)
      totalPage: 1, // 전체 페이지 (동적 요소)
      object: { // 무한스크롤 설정을 위한 옵션 객체.
        callback: this.pagePulling
      },
      pagePullingFlag: false, // 현재 동작이 무한 스크롤인지 아닌지 체크. (스로틀링 콜백 중복호출 방지)
      pushFullEventFlag: false, // 다음 동작이 무한 스크롤인지 아닌지 체크.
      currentView: {}, // 카테고리 정보
      categoryLevelFinal: null, // 현재 카테고리의 구분(중, 소, 세)
      subCategoryList: [], // (중, 소, 세)분류 목록
      todayBestList: [], // 오늘베스트 목록
      sortCriteria: STORE_CONST.LNB_CATEGORY_CONST.SORT_PARAMETERS.BEST, // 정렬 제어
      sortSelected: STORE_CONST.LNB_CATEGORY_CONST.SORT_PARAMETERS.BEST, // 정렬 파라메터
      productList: [], // 상품목록
      selectedSortName: this.getSortLabel('best'), // 선택된 정렬 - 한글표기
      lnbCateName: '', // 선택된 카테고리명
      reRenderFlag: false, // 카테고리 매장에서 다른 카테고리 매장으로 이동시, 이전 카테고리 매장 정보가 남아있다가 바뀌는 이슈 대응용 플래그.
      apiCallingFlag: false // 카테고리 정보 호출중인지 아닌지 여부 - API 중복 호출 방지.
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'lnbCategory') {
        this.reRenderFlag = false
        const prevCateNumber = from.params.categoryNumber
        const nextCateNumber = to.params.categoryNumber
        if (prevCateNumber !== nextCateNumber) {
          this.sortSelected = STORE_CONST.LNB_CATEGORY_CONST.SORT_PARAMETERS.BEST
          this.getCategoryInfo(nextCateNumber, true)
        }
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.initParamObject()
    uiUtil.setInfiniteScroll(this, this.object)
  },
  updated () {
    // 전문매장, 혜택 높이 정렬
    const vm = this
    const productList = document.querySelectorAll('.product_list .list')
    productList.forEach(function (element, index) {
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
  activated () {
    this.initParamObject()
    uiUtil.setInfiniteScroll(this, this.object)
    this.$store.commit('appHeaderDefault/setPageTitle', this.lnbCateName) // 헤더 타이틀 업데이트
  },
  methods: {
    isNull,
    /**
     * 상품 클릭시 로그 전송
     * @param {String} partnumber - 상품코드.
     * @param {String} busChId - 상품분류코드
     * @param {String} productName - 상품명
     * @param {String} productPrice - 상품가격
     * @param {String} brandName - 브랜드명
     */
    productClickLogging (partnumber, busChId, productName, productPrice, brandName) {
      // 마케팅 스크립트 적용 부분
      // GA 360
      let eventAction = ''
      let eventLabel = ''
      if (!isNull(this.currentView.categoryName5)) { // 세분류인 경우
        eventAction = '세분류'
        eventLabel = `${this.currentView.categoryName5}_${partnumber}`
      } else if (!isNull(this.currentView.categoryName4)) { // 소분류인 경우
        eventAction = '소분류'
        eventLabel = `${this.currentView.categoryName4}_${partnumber}`
      } else if (!isNull(this.currentView.categoryName3)) { // 중분류인 경우
        eventAction = '중분류'
        eventLabel = `${this.currentView.categoryName3}_${partnumber}`
      }
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_카테고리매장',
          eventAction,
          eventLabel,
          params: {
            t1: null
          }
        }
      })
      // 제품_상품 유형
      let tvProduct = ''
      if (busChId === 'INT') {
        tvProduct = 'e상품'
      } else {
        tvProduct = 'eTV'
      }
      // E-commerce
      let categoryNm = ''
      if (!isNull(this.currentView.categoryName5)) {
        categoryNm = `${this.currentView.categoryName1}/${this.currentView.categoryName2}/${this.currentView.categoryName3}/${this.currentView.categoryName4}/${this.currentView.categoryName5}`
      } else if (!isNull(this.currentView.categoryName4)) {
        categoryNm = `${this.currentView.categoryName1}/${this.currentView.categoryName2}/${this.currentView.categoryName3}/${this.currentView.categoryName4}`
      } else if (!isNull(this.currentView.categoryName3)) {
        categoryNm = `${this.currentView.categoryName1}/${this.currentView.categoryName2}/${this.currentView.categoryName3}`
      } else if (!isNull(this.currentView.categoryName2)) {
        categoryNm = `${this.currentView.categoryName1}/${this.currentView.categoryName2}`
      } else if (!isNull(this.currentView.categoryName1)) {
        categoryNm = `${this.currentView.categoryName1}`
      }
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
          params: [
            {
              id: String(partnumber),
              name: productName,
              brand: brandName,
              category: categoryNm,
              dimension16: tvProduct
            }
          ],
          subparams: {
            t1: '카테고리이동',
            t2: '상품목록',
            product_list: '카테고리이동_상품목록'
          }
        }
      })
    },
    /**
     * 베스트 상품 클릭시 로그 전송
     * @param {Number} idx - 순위.
     * @param {Number} partnumber - 상품코드.
     * @param {Number} productName - 상품명.
     * @param {Number} productPrice - 상품가격.
     * @param {Number} buschnId - 상품분류코드.
     */
    bestClickLogging (idx, partnumber, productName, productPrice, buschnId) {
      // 마케팅 스크립트 적용 부분
      // GA 360
      const eventAction = '중분류'
      const eventLabel = `베스트_${idx}_${partnumber}`
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_카테고리매장',
          eventAction,
          eventLabel,
          params: {
            t1: null
          }
        }
      })
      // 제품_상품 유형
      let tvProduct = ''
      if (buschnId === 'INT') {
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
              id: String(partnumber),
              name: productName,
              dimension16: tvProduct
            }
          ],
          subparams: {
            t1: '카테고리이동',
            t2: '베스트',
            product_list: '카테고리이동_베스트'
          }
        }
      })
    },
    /**
     * 상품 정렬
     */
    sort () {
      this.sortClass = !this.sortClass
    },
    /**
     * 리스트 그리드 토글
     */
    listGrid () {
      this.listGridClass = !this.listGridClass

      // 마케팅 스크립트 적용 부분
      // GA 360
      let eventAction = ''
      let eventLabel = '리스트뷰'
      if (this.listGridClass) {
        eventLabel = '그리드뷰'
      }
      if (!isNull(this.currentView.categoryName5)) { // 세분류인 경우
        eventAction = '세분류'
      } else if (!isNull(this.currentView.categoryName4)) { // 소분류인 경우
        eventAction = '소분류'
      } else if (!isNull(this.currentView.categoryName3)) { // 중분류인 경우
        eventAction = '중분류'
      }
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_카테고리매장',
          eventAction,
          eventLabel,
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 찜 토글
     */
    wish () {
      this.wishClass = !this.wishClass
    },
    /**
     * 무한스크롤 오브젝트 초기화.
     */
    initParamObject () {
      this.object.callback = this.pagePulling
      this.object.isEnable = true
      this.object.interval = 2000
      this.object.options = {
        rootMargin: '100% 0px'
      }
    },
    /**
     * 무한스크롤 사용여부.
     * @param {bool} param
     */
    setPushFullEventFlag (param) {
      this.pushFullEventFlag = param
    },
    /**
     * 무한스크롤 메소드.
     */
    pagePulling () {
      if (this.pagePullingFlag) { return false }
      this.pagePullingFlag = true
      if (this.pageIdx < this.totalPage) {
        this.setPushFullEventFlag(true)
        const paramCategoryId = this.$route.params.categoryNumber
        this.getCategoryInfo(paramCategoryId)
      } else {
        this.setPushFullEventFlag(false)
      }
    },
    /**
     * 페이징 정보 초기화.
     */
    pageInfoInitial () {
      return new Promise(resolve => {
        if (this.pushFullEventFlag === false) { // 무한 스크롤 이벤트가 아닐때 검색 결과 리스트 및 파라메터 초기화.
          this.productList = []
          this.pageIdx = 1
          this.totalPage = 1
          this.totalCount = 0
        } else {
          this.pageIdx += 1 // 무한스크롤 이벤트일때 현재 페이지 파라메터 증가.
        }
        resolve(true)
      })
    },
    /**
     * 컴포넌트 로딩될떄 실행될 메소드.
     */
    init () {
      this.initializeComponent()
      this.onLoad()
    },
    /**
     * 컴포넌트 로딩될떄 실행될 메소드중에 하나.
     */
    initializeComponent () {
      const params = this.propsData
      this.initInvokeReqPrams(params)
    },
    /**
     * 컴포넌트 로딩될떄 실행될 메소드중에 하나.
     */
    onLoad () {
      const paramCategoryId = this.$route.params.categoryNumber
      this.getCategoryInfo(paramCategoryId)
    },
    /**
     * 카테고리 정보 조회
     * @param {String} categoryId - 카테고리 매장 번호.
     * @param {bool} routeWatchFlag - 라우터 와치에서 호출한 경우, 페이징 정보 초기화.
     * @returns {void}
     */
    getCategoryInfo (categoryId, routeWatchFlag = false) {
      if (!this.apiCallingFlag) {
        this.apiCallingFlag = true
        if (routeWatchFlag) {
          this.setPushFullEventFlag(false)
        }
        this.pageInfoInitial().then(resolvedData => {
          const commandName = 'NSMobileCategory'
          const invoke = {
            categoryId,
            currentPage: this.pageIdx,
            sortCriteria: this.sortSelected
          }
          if (resolvedData) {
            this.$nsaxios.post(
              commandName,
              invoke,
              this.setMidCategoryInfo
            )
          }
        })
      }
    },
    /**
     * 카테고리 정보 및 부가데이터 셋팅.
     * @param {Object} data - 카테고리 정보 및 부가 데이터 정보.
     */
    setMidCategoryInfo (data) {
      const msg = data.msg
      const categoryInfo = msg?.categoryInfo // 카테고리 정보
      this.currentView.catalogId = categoryInfo?.catalogId ? categoryInfo.catalogId : null
      this.lnbCateName = categoryInfo?.categoryNm ? categoryInfo.categoryNm : null // 카테고리명
      this.$store.commit('appHeaderDefault/setPageTitle', this.lnbCateName) // 헤더 타이틀 업데이트
      const subCategoryList = msg?.subCategoryList // 중분류 매장 리스트
      const toDayBestList = msg?.toDayBestList // 오늘 베스트

      if (this.pageIdx === 1) { // 무한 스크롤 이벤트가 아닐때만 설정되는 정보들.
        this.setPageInfo(data)
        this.setShoppingHistory(categoryInfo) // 카테고리 정보
        this.setSubCategoryList(subCategoryList) // 중분류매장 처리
        this.setTodayBestList(toDayBestList) // 오늘 베스트
      }
      this.setProductListPage(data) // 상품목록
      this.pagePullingFlag = false
      this.reRenderFlag = true
      this.apiCallingFlag = false

      // 마케팅 스크립트
      // AIQUA
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'category_viewed',
          params: {
            category_name: this.lnbCateName
          }
        }
      })
    },
    /**
     * 쇼핑 히스토리에 노출되는 카테고리 정보 setting
     * @param {Object} categoryInfo - 카테고리 정보
     */
    setShoppingHistory (categoryInfo) {
      this.currentView.categoryName1 = categoryInfo.categoryName1
      this.currentView.categoryName2 = categoryInfo.categoryName2
      this.currentView.categoryName3 = categoryInfo.categoryName3
      this.currentView.categoryName4 = categoryInfo.categoryName4
      this.currentView.categoryName5 = categoryInfo.categoryName5

      // 카테고리매장 정보 -> history 변경 데이터 경량 화
      const hisParamObj = {}
      hisParamObj.categoryId = this.$route.params.categoryNumber
      hisParamObj.categoryName1 = categoryInfo.categoryName1
      hisParamObj.categoryName2 = categoryInfo.categoryName2
      hisParamObj.categoryName3 = categoryInfo.categoryName3
      hisParamObj.categoryName4 = categoryInfo.categoryName4
      hisParamObj.categoryName5 = categoryInfo.categoryName5
      hisParamObj.hisGubun = COMMON_CONST.HISTORY_GUBUN.CATEGORY
      this.categoryLevelFinal = categoryInfo.categoryLevelFinal
      bizUtil.setRecentlyViewedProducts(hisParamObj) // 카테고리 매장 저장
    },
    /**
     * 매장 icons CDN 기준 이미지 조회
     * @param {String} categoryId 카테고리코드
     * @param {String} ext 확장자
     * @returns {String} CDN 기준 이미지 URL full 경로
     */
    getCateImageUrl (categoryId, ext) {
      // 확장자가 없을 경우 default jpg
      if (isNull(ext)) {
        ext = 'jpg'
      }
      const cateImageUrl = `${CONST.NS_IMAGE_CATE + categoryId}.${ext}`
      return cateImageUrl
    },
    /**
     * 서브 카테고리 리스트 처리
     * @param {Object} subCategoryList - 하위 카테고리 목록
     */
    setSubCategoryList (subCategoryList) {
      const pageId = '' // M_G2161000M - 소분류, M_G2161010M - 세분류
      this.subCategoryList = []
      const arrayForCopy = []
      if (subCategoryList != null && subCategoryList.length > 0) {
        for (let i = 0; i < subCategoryList.length; i++) {
          const subCategory = subCategoryList[i]
          arrayForCopy.push({
            pageId,
            catalogId: subCategory.catalogId,
            categoryId: subCategory.categoryId,
            categoryNm: subCategory.categoryNm,
            categoryImg: this.getCateImageUrl(subCategory.categoryId, 'jpg')
          })
        }
        this.subCategoryList = arrayForCopy
      }

      // 마케팅 스크립트 적용 부분
      // GA 360
      let eventAction = ''
      let eventLabel = ''
      if (!isNull(this.currentView.categoryName5)) { // 세분류인 경우
        eventAction = '소분류'
        eventLabel = `${this.currentView.categoryName4}_${this.currentView.categoryName5}`
        //
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_카테고리매장',
            eventAction,
            eventLabel,
            params: {
              t1: null
            }
          }
        })
      } else if (!isNull(this.currentView.categoryName4)) { // 소분류인 경우
        eventAction = '중분류'
        eventLabel = `${this.currentView.categoryName3}_${this.currentView.categoryName4}`
        //
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_카테고리매장',
            eventAction,
            eventLabel,
            params: {
              t1: null
            }
          }
        })
      } else if (!isNull(this.currentView.categoryName3)) { // 중분류인 경우
        //
      }
      const parentCateNmChecker =
        !isNull(subCategoryList) &&
        subCategoryList.length &&
        !isNull(subCategoryList[0].parentCateNm)
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: '',
          initFlag: true,
          subparams: {
            t1: '매장',
            t2: '카테고리매장',
            t3: parentCateNmChecker ? subCategoryList[0].parentCateNm : '',
            t4: ''
          }
        }
      })
    },
    /**
     * 오늘 베스트 데이터 셋팅
     * @param {Array} todayBestList
     */
    setTodayBestList (todayBestList) {
      this.todayBestList = []
      const arrayForCopy = []
      if (todayBestList !== null && todayBestList.length > 0) {
        const todayBestMaxLen = (todayBestList.length > 5) ? 5 : todayBestList.length // 최대 5개 노출
        for (let i = 0; i < todayBestMaxLen; i++) {
          const todayBest = todayBestList[i]
          arrayForCopy.push({
            itncatentrynm: htmlDecode(todayBest.itncatentrynm),
            rank: todayBest.seq, // 순번
            partnumber: todayBest.partnumber,
            dcPrice: todayBest.dcPrice,
            prcWaveDisp: todayBest.prcWaveDisp,
            buschnId: todayBest.buschnId,
            dispTypeCd: todayBest.dispTypeCd,
            multiCd: todayBest.multiCd
          })
        }
        this.todayBestList = arrayForCopy
      }
    },
    /**
     * 정렬의 한글 라벨 반환.
     * @param {String} sortCriteria - 정렬의 영어 라벨
     * @returns {String}
     */
    getSortCriteriaName (sortCriteria) {
      return STORE_CONST.LNB_CATEGORY_CONST.SORT_OBJ[sortCriteria]
    },
    /**
     * 해당 카테고리의 상품 리스트 정보 설정
     * @param {Object} data - api data
     * @returns {String}
     */
    setProductListPage (data) {
      const msg = data.msg
      const categoryInfo = msg.categoryInfo // 카테고리 정보
      const productList = msg.productList // 상품목록
      const prodTotalCount = categoryInfo.prodTotalCount
      const sortCriteria = categoryInfo.sortCriteria // best

      this.totalCount = insertCommas(prodTotalCount) // 상품건수

      // 상품 정렬 type
      if (!isNull(sortCriteria)) {
        this.sortCriteria = this.getSortCriteriaName(sortCriteria)
      }

      if (!isNull(productList) && productList.length > 0) {
        this.pushFullEvent = false
        this.setProductList(
          productList,
          this.currentView.catalogId,
          this.currentView.categoryId,
          this.currentView.p_espotid,
          this.currentView.p_bannerid
        )
      } else {
        this.productList = []
        return false
      }
    },
    /**
     * 상품리스트 정보 셋팅.
     * @param {Object} data
     * @param {String} catalogId
     * @param {String} categoryId
     * @param {String} espotId
     * @param {String} bannerId
     */
    setProductList (data, catalogId, categoryId, espotId, bannerId) {
      if (isNull(catalogId)) {
        catalogId = ''
      }
      if (isNull(categoryId)) {
        categoryId = ''
      }
      if (isNull(espotId)) {
        espotId = ''
      }
      if (isNull(bannerId)) {
        bannerId = ''
      }
      const dataSetList = []
      const airbridgeProductList = []
      for (let k = 0; k < data.length; k++) {
        const dataSet = {}

        const saleRate = data[k].saleRate
        const brandName = data[k].brand_kor_nm
        const brandCd = data[k].brandCd
        const productName = data[k].itncatentrynm
        const partNumber = data[k].partNumber
        const price = data[k].priceofferprice
        const salePrice = data[k].pricedcprice

        const bestYn = data[k].defsort
        const deliveryPrice = data[k].dlvrPrice
        const couponBnftList = data[k].couponList
        const interestFeeMonth = data[k].ifiValue
        const isAdult = data[k].adultItemFlag
        const strHeadCopy = data[k].headCopy

        const busChId = data[k].busChnId
        let multiCd = data[k].multiCd
        const catentryId = data[k].catentryId

        const joinCnt = data[k].join_cnt
        const score = data[k].score

        let clickUrl = data[k].clickUrl // 개인화 추천 상품인 경우에 값이 들어가 있음.

        const prcWaveDisp = data[k].prcWaveDisp

        // 옵션대표가 flag
        let optRepYn = ''
        if (undefined !== data[k].prcWaveDisp) {
          optRepYn = data[k].prcWaveDisp
        }
        dataSet.optRepYn = optRepYn

        if (clickUrl === 'null' || clickUrl === null) {
          clickUrl = ''
        }
        if (multiCd === 'null' || multiCd === null) {
          multiCd = ''
        }

        dataSet.catentryId = catentryId
        dataSet.catalogId = catalogId
        dataSet.espotId = espotId
        dataSet.categoryId = categoryId
        dataSet.partNumber = partNumber
        dataSet.clickUrl = clickUrl
        dataSet.multiCd = multiCd
        dataSet.bannerId = bannerId
        dataSet.isAdult = isAdult
        dataSet.saleRate = saleRate
        dataSet.joinCnt = (Number(joinCnt))
        dataSet.score = score
        dataSet.dispTypeCd = data[k].dispTypeCd
        dataSet.mmRntalPrc = data[k].mmRntalPrc
        if (!isNull(strHeadCopy)) {
          dataSet.strHeadCopy = strHeadCopy
        }
        dataSet.brandCd = brandCd
        dataSet.busChId = busChId
        dataSet.productName = htmlDecode(productName)
        dataSet.brandName = brandName
        dataSet.price = price
        dataSet.salePrice = salePrice
        dataSet.prcWaveDisp = prcWaveDisp

        dataSet.storeType = [
          { isTvShopping: data[k].isTvShopping },
          { isTvShopPlus: data[k].isTvShopPlus },
          { isHappyDeal: data[k].isHappyDeal },
          { isDepartment: data[k].isDepartment },
          { isShoppingBook: data[k].isShoppingBook }
        ]

        dataSet.bestYn = bestYn
        dataSet.deliveryPrice = Number(deliveryPrice)

        if (couponBnftList != null && couponBnftList.length > 0) {
          dataSet.couponBnftList = couponBnftList
        } else {
          dataSet.couponBnftList = []
        }

        if (Number(interestFeeMonth) > 0) {
          dataSet.interestFeeMonth = interestFeeMonth
        } else {
          dataSet.interestFeeMonth = 0
        }
        dataSetList.push(dataSet)
        //
        airbridgeProductList.push({
          productID: partNumber, // 상품ID
          name: productName, // 상품명
          price: Number(String(salePrice).replaceAll(',', '')), // 가격
          currency: 'KRW', // 통화
          position: k + 1 // index
        })
      }
      if (this.pageIdx === 1) {
        this.productList = dataSetList
      } else {
        const newArray = this.productList.concat(dataSetList)
        this.productList = newArray
      }
      // 마케팅 스크립트 적용 부분
      // 홈쇼핑 모아
      marketingUtil.hsmoaLogger.send({
        data: {
          from_hsmoa: false,
          action: dataSetList.map(item => item.partNumber),
          category: 'list'
        }
      })
      // Airbridge
      let eventAction = ''
      let categoryName = ''
      if (!isNull(this.currentView.categoryName5)) { // 세분류인 경우
        eventAction = '카테고리매장>세'
        categoryName = `${this.currentView.categoryName2}>${this.currentView.categoryName3}>${this.currentView.categoryName4}>${this.currentView.categoryName5}`
      } else if (!isNull(this.currentView.categoryName4)) { // 소분류인 경우
        eventAction = '카테고리매장>소'
        categoryName = `${this.currentView.categoryName2}>${this.currentView.categoryName3}>${this.currentView.categoryName4}`
      } else if (!isNull(this.currentView.categoryName3)) { // 중분류인 경우
        eventAction = '카테고리매장>중'
        categoryName = `${this.currentView.categoryName2}>${this.currentView.categoryName3}`
      }
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.PRODUCT_LIST_VIEW, // 상품 리스트 조회
        data: {
          products: airbridgeProductList,
          customAttributes: {
            categoryNm: categoryName, // 카테고리 매장의 중/소/세 명
            gradeNm: loginUtil.getUserInfo('gradeNm')
          },
          action: eventAction,
          label: '상품리스트조회'
        }
      })
    },
    /**
     * 파라메터 설정
     * @param {Object} params
     */
    initInvokeReqPrams (params) {
      if (!isNull(params.catalogId)) {
        this.currentView.catalogId = params.catalogId
      }
      this.currentView.categoryId = this.$route.params.categoryNumber || null // params.categoryId || null
      this.currentView.categoryNm = params.categoryNm || null
      this.currentView.pageId = params.pageId || null
      this.currentView.chainId = params.chainId || null
      this.currentView.type = params.type || null
    },
    /**
     * 상품목록 정렬조건 변경 시 이벤트
     */
    sortingEvent () {
      const nowCategoryId = this.$route.params.categoryNumber
      this.pushFullEventFlag = false
      this.getCategoryInfo(nowCategoryId)
    },
    /**
     * 상품평 수 반환.
     * @param {Number} param
     * @returns {String} 상품평이 9999개가 넘어가면 +9999 반환, 아니면 콤마를 붙여서 반환.
     */
    getJoinCnt (param) {
      const numberParam = param
      if (numberParam > 9999) {
        return '+9,999'
      } else {
        return insertCommas(numberParam)
      }
    },
    /**
     * 특정 브랜드 코드를 제외하고 상품명 앞에다가 '[브랜드명]' 을 붙여줌.
     * @param {String} brandCd - 브랜드코드
     * @param {String} busChId - 매체타입
     * @param {String} brandName - 브랜드명
     * @param {String} productName - 상품명
     * @returns {String}
     */
    setAndGetProductName (brandCd, busChId, brandName, productName) {
      let productFullText = ''
      if (brandCd === '200000' || brandCd === '250000' || busChId === 'SB') {
        return productName
      } else {
        productFullText = `[${brandName}] ${productName}`
        return productFullText
      }
    },
    /**
     * 전문매장 한글 반환.
     * @param {String} param
     * @returns {String}
     */
    getStoreType (param) {
      return STORE_CONST.COMMON_STORE_TYPE[param.toString()]
    },
    /**
     * 전문매장 영어 반환.
     * @param {String} param
     * @returns {String}
     */
    getStoreTypeClass (param) {
      return STORE_CONST.COMMON_STORE_TYPE_CLASS[param.toString()]
    },
    /**
     * 공통함수 호출후 반환.
     * @param {String} param
     * @returns {String}
     */
    getHtmlDecode (param) {
      return htmlDecode(param)
    },
    /**
     * 무한스크롤 페이징 정보 셋팅.
     * @param {Object} data
     */
    setPageInfo (data) {
      this.totalCount = data.msg.categoryInfo.prodTotalCount
      if (this.totalCount !== 0) {
        this.totalPage = Math.ceil(this.totalCount / this.pageSize)
      } else {
        this.totalPage = 1
      }
    },
    /**
     * 선택된 정렬값을 영어 소문자로 특정객체에 셋팅
     * @param {String} param
     */
    getSortLowerParameter (param) {
      this.sort() // 목록 닫힘
      this.sortSelected = STORE_CONST.LNB_CATEGORY_CONST.SORT_LOWER_PARAMETERS[param]

      // 마케팅 스크립트 적용 부분
      // GA 360
      let eventAction = ''
      let eventLabel = ''
      switch (param) {
        case 'best': // 인기순
          eventLabel = '정렬_인기순'
          break
        case 'new': // 최신순
          eventLabel = '정렬_최신순'
          break
        case 'lowPrice': // 낮은 가격순
          eventLabel = '정렬_낮은가격순'
          break
        case 'topPrice': // 높은 가격순
          eventLabel = '정렬_높은가격순'
          break
        case 'comment': // 상품평순
          eventLabel = '정렬_상품평순'
          break
      }
      if (!isNull(this.currentView.categoryName5)) { // 세분류인 경우
        eventAction = '세분류'
      } else if (!isNull(this.currentView.categoryName4)) { // 소분류인 경우
        eventAction = '소분류'
      } else if (!isNull(this.currentView.categoryName3)) { // 중분류인 경우
        eventAction = '중분류'
      }
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_카테고리매장',
          eventAction,
          eventLabel,
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 정렬의 한글이름 반환 - UI 상에서 보여지기 위함.
     * @param {String} param
     * @returns {String}
     */
    getSortLabel (param) {
      return STORE_CONST.LNB_CATEGORY_CONST.SORT_OBJ[param]
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/store/LnbCategory";
</style>
