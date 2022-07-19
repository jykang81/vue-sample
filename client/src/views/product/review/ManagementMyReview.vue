<template>
  <div class="management_my_review">
    <div class="tabs">
      <button
        type="button"
        class="tab"
        :class="[ pageType === 'unregistered' ? 'active' : '']"
        @click="moveTab('unregistered')"
      >
        상품평 작성 <span class="num">({{ unregistered.totalCount }})</span>
      </button>
      <button
        type="button"
        class="tab"
        :class="[ pageType === 'registered' ? 'active' : '']"
        @click="moveTab('registered')"
      >
        내 상품평 <span class="num">({{ registered.totalCount }})</span>
      </button>
    </div>

    <!-- 상품평 작성 -->
    <div
      v-if="pageType ==='unregistered'"
      class="tab_content"
    >
      <ul
        v-if="unregistered.nonReviewList.length > 0"
        class="my_review_list"
      >
        <li
          v-for="(item, index) in unregistered.nonReviewList"
          :key="index"
        >
          <div class="product_info">
            <router-link
              tag="a"
              :to="'/product/' + item.partnumber"
            >
              <figure>
                <ns-img
                  :product-number="item.partnumber"
                  :width="144"
                  :height="144"
                  :alt="item.goodsName"
                />
              </figure>
            </router-link>
            <div class="field">
              <p class="title">
                <router-link
                  tag="a"
                  :to="'/product/' + item.partnumber"
                >
                  {{ item.goodsName }}
                </router-link>
              </p>
              <p
                v-if="item.dan_attr_desc1"
                class="option"
              >
                {{ item.dan_attr_desc1 }}
              </p>
            </div>
          </div>
          <div class="review_info">
            <ul class="date">
              <li>
                <span>배송완료일</span>
                <span>{{ item.last_dt }}</span>
              </li>
              <li>
                <span>작성기한</span>
                <span>{{ item.max_dt }}</span>
              </li>
            </ul>
            <a
              v-if="item.isShowWriteBtn"
              class="btn_write"
              @click="writeReview(item)"
            >
              <span>상품평 작성</span>
            </a>
          </div>
        </li>
      </ul>

      <div
        v-if="unregistered.nonReviewList.length === 0 && isDataReadied"
        class="review_empty"
      >
        <p class="nodata">
          작성 가능한 상품평이 없습니다.
        </p>
      </div>
    </div>

    <!-- 내 상품평 -->
    <div
      v-if="pageType ==='registered'"
      class="tab_content"
    >
      <ul
        v-if="registered.reviewList.length > 0"
        class="my_review_list"
      >
        <li
          v-for="(item, index) in registered.reviewList"
          :key="index"
        >
          <div class="product_info">
            <router-link
              tag="a"
              :to="'/product/' + item.partnumber"
            >
              <figure>
                <ns-img
                  :product-number="item.partnumber"
                  :width="144"
                  :height="144"
                  :alt="item.goodsName"
                />
              </figure>
            </router-link>
            <div class="field">
              <p class="title">
                <router-link
                  tag="a"
                  :to="'/product/' + item.partnumber"
                >
                  {{ item.goodsName }}
                </router-link>
              </p>
              <p
                v-if="item.attrDesc1"
                class="option"
              >
                {{ item.attrDesc1 }}
              </p>
            </div>
          </div>
          <div class="star_wrap">
            <span class="rating_star">
              <span class="star" />
              <span
                class="rating"
                :style="{ width: getTotalPointRating(item) + '%' }"
              />
            </span>
            <span class="date">{{ item.written_dt }}</span>
          </div>
          <p class="review_text" v-html="item.decodeReviewContents" />
          <ul class="review_comment">
            <template
              v-for="(cate, cateIdx) in item.scoreCateList"
            >
              <li
                :key="cateIdx"
              >
                <strong class="question">{{ cate.name }}</strong>
                <span class="answer">{{ cate.value }}</span>
              </li>
            </template>
          </ul>
          <button
            v-if="item.photo1stUrl"
            type="button"
            class="btn_layer"
            @click="getPhotoList(item.goodgrd_seq, item.goodsName)"
          >
            <ns-img
              :src="item.photo1stUrl"
              :alt="item.goodsName"
            />
            <span
              v-if="item.photoCnt > 1"
              class="num"
            >
              {{ item.photoCnt }}
            </span>
          </button>
          <a
            class="btn_modify"
            @click="modifyReview(item)"
          >
            <span>수정하기</span>
          </a>
        </li>
      </ul>

      <div
        v-if="registered.reviewList.length === 0 && isDataReadied"
        class="review_empty"
      >
        <p class="nodata">
          작성한 상품평이 없습니다.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import routerUtil from '@frameworks/routerUtil'
import popupUtil from '@frameworks/popupUtil'
import loginUtil from '@utils/loginUtil'
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'
import uiUtil from '@utils/uiUtil'
import {
  calcDate
} from '@frameworks/dateutil/dateUtil'
import COMM_CONST from '@constants/framework/constants'
import CONST from '@constants/framework/framework'
import productMyReviewMixin from '@/mixins/product/review/productMyReviewMixin'
import NsImg from '@components/common/NsImg'
import managementMyReviewService from '@services/product/review/managementMyReviewService'

import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'ManagementMyReview',
  components: {
    NsImg
  },
  mixins: [
    productMyReviewMixin
  ],
  data () {
    return {
      isDataReadied: false,
      pageType: 'unregistered',
      swiperThumb: {
        slidesPerView: 'auto',
        spaceBetween: 8
      },
      unregistered: {
        pageIdx: 1,
        rowPerPage: 10,
        totalCount: 0,
        nonReviewList: [],
        intersectionObserverObj: null
      },
      registered: {
        pageIdx: 1,
        rowPerPage: 10,
        totalCount: 0,
        reviewList: [],
        intersectionObserverObj: null
      },
      photoList: [],
      productName: ''
    }
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.init()
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.setPageType()
      this.isDataReadied = false
      this.getReviews()
    },
    /**
     * 선택된 탭 타입에 따라 데이터 요청
     *
     * @returns {Number} 인덱스
     */
    getReviews () {
      if (this.pageType === 'unregistered') {
        this.unregistered.nonReviewList = []
        this.getUnregisteredList('list')
        this.getRegisteredList('count')
      } else if (this.pageType === 'registered') {
        this.registered.reviewList = []
        this.getUnregisteredList('count')
        this.getRegisteredList('list')
      }
    },
    /**
     * 평가 별점 계산
     *
     * @param {Object} reviewItem 평가항목
     * @returns {Number} 인덱스
     */
    getTotalPointRating (reviewItem) {
      const scoreKeys = Object.keys(reviewItem)
        .filter(item => item.startsWith('score'))
        .filter(item => !item.endsWith('List'))
      const totalPoint = scoreKeys.reduce((total, key, index) => {
        return total + reviewItem[key]
      }, 0)
      return (totalPoint / scoreKeys.length) * 20
    },
    /**
     * 라우터 타입에 따라 페이지 타입 설정
     * 타입이 맞지 않는 경우 뒤로 이동
     * @returns {void}
     */
    setPageType () {
      const pageTypeArr = ['unregistered', 'registered']

      // 라우터 params.type 값이 pageTypeArr 에 맞는 값인지 판단
      // 허용하지 않는 url 타입의 경우 뒤로 이동
      if (pageTypeArr.includes(this.$route.params.type)) {
        this.pageType = this.$route.params.type
      } else {
        routerUtil.back()
        return false
      }

      // 값 초기화
      this[this.pageType].pageIdx = 1
      this[this.pageType].rowPerPage = 10
      // this[this.pageType].totalCount = 0 // API 응답 지연에 따른 상품평 수 깜빡임 방지
      this[this.pageType].intersectionObserverObj = null

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: '',
          initFlag: true,
          subparams: {
            t1: '마이페이지',
            t2: '기타활동',
            t3: '상품평관리',
            t4: this.pageType === 'unregistered' ? '상품평 작성' : (this.pageType === 'registered' ? '내 상품평' : '')
          }
        }
      })
    },

    /**
     * 탭 이동
     * @param {string} type 탭 타입
     * @returns {void}
     */
    moveTab (type) {
      if (this.pageType === type) {
        return false
      }

      this.$router.replace(`/product/review/management/${type}`)
    },

    /**
     * 상품평 작성 페이지 데이터 가져오기
     * - 리뷰 미작성 상품
     * - 내 상품평 탭 개수
     * @param {string} type list : 리스트 전체 사용 , count : 개수만 사용
     * @returns {void}
     */
    getUnregisteredList (type) {
      const param = {
        users_id: loginUtil.userId(),
        pageIdx: 1,
        rowPerPage: 1,
        accptPath: COMM_CONST.getAcceptPath()
      }

      // 리스트인 경우 페이지 관련 정보를 추가로 보냄
      if (type === 'list') {
        param.pageIdx = this.unregistered.pageIdx
        param.rowPerPage = this.unregistered.rowPerPage
      }

      const successHandling = data => {
        const nonReviewList = data.msg.root.NonReviewList
        const todayNum = parseInt(calcDate('', 0, 0, 0, 0, 'yyyyMMdd'), 10)

        this.unregistered.totalCount = data.msg.root.totalCount

        // 카운트인 경우 총 개수 정보만 필요하므로 하단 코드 실행하지 않음
        if (type === 'count') {
          return false
        }

        // 리스트 순회하면서 렌더링에 필요한 정보 생성 및 편집
        for (let i = 0; i < nonReviewList.length; i++) {
          const item = nonReviewList[i]
          const brandName = item.brandNM
          const maxDtNum = parseInt(item.max_dt.replace(/\./gi, ''), 10)

          if (todayNum > maxDtNum) {
            item.isShowWriteBtn = false
          } else {
            item.isShowWriteBtn = true
          }

          item.goodsName = htmlDecode((brandName && brandName !== '미정의' ? `[${brandName}]` : '') + item.catentryNM)
        }

        this.unregistered.nonReviewList = this.unregistered.nonReviewList.concat(nonReviewList)

        // 현재 렌더링된 리스트보다 더 불러올 리스트가 있으면 인피니티 스크롤 셋
        if (this.unregistered.pageIdx * this.unregistered.rowPerPage < this.unregistered.totalCount) {
          this.unregistered.intersectionObserverObj = uiUtil.setInfiniteScroll(this, {
            callback: () => {
              if (this.unregistered.intersectionObserverObj) {
                this.unregistered.intersectionObserverObj.disconnect()
                this.unregistered.pageIdx = this.unregistered.pageIdx + 1
                this.getUnregisteredList('list')
              }
            },
            options: {
              rootMargin: '100% 0px'
            }
          })
        }
        this.isDataReadied = true
      }

      managementMyReviewService.getUnregisteredList(param, successHandling)
    },

    /**
     * 내 상품평 페이지 데이터 가져오기
     * - 리뷰 작성한 상품
     * - 상품평 작성 탭 개수
     * @param {string} type list : 리스트 전체 사용 , count : 개수만 사용
     * @returns {void}
     */
    getRegisteredList (type) {
      const param = {
        users_id: loginUtil.userId(),
        pageIdx: 1,
        rowPerPage: 1,
        termVal: 365
      }

      // 리스트인 경우 페이지 관련 정보를 추가로 보냄
      if (type === 'list') {
        param.pageIdx = this.registered.pageIdx
        param.rowPerPage = this.registered.rowPerPage
      }

      const successHandling = data => {
        const reviewList = data.msg.root.ReviewList

        this.registered.totalCount = data.msg.root.totalCount

        // 카운트인 경우 총 개수 정보만 필요하므로 하단 코드 실행하지 않음
        if (type === 'count') {
          return false
        }

        // 리스트 렌더링에 필요한 데이터 편집
        for (let i = 0; i < reviewList.length; i++) {
          const item = reviewList[i]
          const brandName = item.brand_nm
          const scoreParam = {
            score1: item.score1,
            score2: item.score2,
            score3: item.score3,
            score4: item.score4
          }

          if (item.catGB === '30') {
            scoreParam.score5 = item.sizeEvalVal
            scoreParam.score6 = item.colorEvalVal
          }

          item.goodsName = htmlDecode((brandName && brandName !== '미정의' ? `[${brandName}]` : '') + item.catentry_nm)
          item.scoreCateList = this.getScoreCateList(item.catGB, scoreParam)
          // item.decodeReviewContents = htmlDecode(item.review_contents)
          //
          item.decodeReviewContents = item.review_contents

          // 사진이 있으면 대표 이미지 url 설정
          if (item.photoYN === 'Y' && item.photoCnt > 0 && item.photo1st_path) {
            item.photo1stUrl = CONST.NS_IMAGE_CUST_SRV + item.photo1st_path
          }

          // 의류/속옷 및 기타 비식품이면 가격 미노출
          // if (item.catGB[0] === '3') {
          //   item.scoreCateList.splice(1, 1)
          // }

          // 건강식품일 경우 섭취편의 미노출
          if (item.catGB === '20') {
            item.scoreCateList.splice(3, 1)
          }
        }

        this.registered.reviewList = this.registered.reviewList.concat(reviewList)

        // 현재 렌더링된 리스트보다 더 불러올 리스트가 있으면 인피니티 스크롤 셋
        if (this.registered.pageIdx * this.registered.rowPerPage < this.registered.totalCount) {
          this.registered.intersectionObserverObj = uiUtil.setInfiniteScroll(this, {
            callback: () => {
              if (this.registered.intersectionObserverObj) {
                this.registered.intersectionObserverObj.disconnect()
                this.registered.pageIdx = this.registered.pageIdx + 1
                this.getRegisteredList('list')
              }
            },
            options: {
              rootMargin: '100% 0px'
            }
          })
        }
        this.isDataReadied = true
      }

      managementMyReviewService.getRegisteredList(param, successHandling)
    },

    /**
     * 상품평 작성하기
     * @param {object} item 개별 상품평 객체
     */
    writeReview (item) {
      const param = {
        catGb: item.catGB,
        goodsName: item.goodsName,
        option: item.dan_attr_desc1,
        dan_catentry_id: item.dan_catentry_id,
        orders_id: item.orders_id
      }

      this.$router.push({ path: `/product/review/write/${item.partnumber}`, query: param })
    },

    /**
     * 상품평 수정하기
     * @param {object} item 개별 상품평 객체
     */
    modifyReview (item) {
      const param = {
        catGb: item.catGB,
        goodsName: item.goodsName,
        option: item.attrDesc1,
        dan_catentry_id: item.ord_catentry_id,
        goodgrdSeq: item.goodgrd_seq,
        orders_id: item.orders_id,
        photoYN: item.photoYN
      }

      this.$router.push({ path: `/product/review/modify/${item.partnumber}`, query: param })
    },

    /**
     * 사진 상품평 리스트 가져오기
     * @param {number} seq 상품평 번호
     * @param {string} goodsName 상품 이름
     */
    getPhotoList (seq, goodsName) {
      const param = {
        cmdType: 117,
        goodgrdSeq: seq
      }

      const successHandling = data => {
        const photoList = data.photoList.list

        for (let i = 0; i < photoList.length; i++) {
          photoList[i].photoPath = CONST.NS_IMAGE_CUST_SRV + photoList[i].filePath
        }

        this.photoList = photoList
        this.productName = goodsName
        this.openImageSlider()
      }

      managementMyReviewService.getPhotoList(param, successHandling)
    },

    /**
     * 이미지 확대보기 열기
     *
     */
    openImageSlider () {
      const param = {
        title: '상세이미지',
        titleAlign: 'center',
        isShowSearch: false,
        isShowCart: false,
        photoList: this.photoList,
        productName: this.productName
      }
      popupUtil.show('product/ImageSliderLayer', param, null)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/product/review/ManagementMyReview";
</style>
