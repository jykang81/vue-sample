<template>
  <section class="section_custom">
    <button
      type="button"
      class="btn link"
      @click="gotoCustomerReview(0)"
    >
      <span>상품평 <span class="count">({{ reviewCount }})</span></span>
    </button>
    <div
      v-if="!!totalPointCount"
      class="review"
    >
      <div class="star_wrap">
        <span class="rating_star">
          <span class="star" />
          <span
            class="rating"
            :style="{width: totalPointRating}"
          />
        </span>
        <span class="count">{{ totalPoint }}</span>
        <span class="total">{{ totalPointCount }}명</span>
      </div>
      <ul class="percent_list">
        <li v-for="(evalItem,evalIndex) in evaluationList"
            :key="evalIndex"
        >
          <dl
            v-if="!(isHidePriceCategory && evalIndex === 1)"
          >
            <dt>{{ evalItem.title }}</dt>
            <dd>{{ getEvaluationAnswer(evalItem)[Math.abs(maxScoreKeyList[evalIndex].split("_").pop() -3)] }}</dd>
            <dd class="per">
              {{ avgScoreListObj[maxScoreKeyList[evalIndex]] }}%
            </dd>
          </dl>
        </li>
      </ul>
      <ul v-if="!isFoodGroupProduct"
          class="product_info"
      >
        <li
          v-for="(review,index) in reviewList"
          :key="index"
          @click="gotoCustomerReview(review.seq)"
        >
          <div class="top_box">
            <div class="star_wrap">
              <span class="rating_star">
                <span class="star" />
                <span
                  class="rating"
                  :style="{width: review.totalRate+'%'}"
                />
              </span>
              <span class="date">{{ review.entryDate.split(' ')[0].replace(/-/gi, '.') || '' }}</span>
            </div>
            <div class="info_report">
              <span class="info_id">{{ getMaskingStr(review.logonId) }}</span>
            </div>
          </div>
          <p v-if="review.userOptYn==='Y'"
             class="option"
          >
            {{ review.attr1 }}
          </p>
          <div class="box">
            <figure
              v-if="review.photoYn === 'Y' && !errorImageIndexList.includes(review.seq)"
            >
              <img
                :src="getImageUrl(review.file_path)"
                :alt="review.attr1 !== '' ? review.attr1 : '리뷰 이미지'"
                @error="setErrorImageIndex(review)"
              >
            </figure>
            <p class="text_review">
              {{ review.reviewContents }}
            </p>
          </div>
        </li>
      </ul>
      <button
        type="button"
        class="btn_more"
        @click="gotoCustomerReview(0)"
      >
        <span>상품평 모두보기</span>
      </button>
    </div>
    <div v-if="isFoodGroupProduct"
         class="product_inquiry"
    >
      <strong class="product_inquiry_title">
        상품문의
      </strong>
      <p class="product_inquiry_guide">
        식품, 일부 의료기기 등은 상품문의 이용이 불가능 합니다.
        1:1 문의하기를 이용해주세요.
      </p>
      <button
        type="button"
        class="btn_inquiry"
        @click="gotoOneToOneInquiry"
      >
        <span>1:1 문의하기</span>
      </button>
    </div>
    <button
      v-else
      type="button"
      class="btn link"
      @click="gotoInquiry"
    >
      <span>상품문의 <span class="count">({{ qAListCount }})</span></span>
    </button>
    <router-link
      class="btn link"
      :to="{ name : 'shippingExchangeReturnInfo' }"
      @click.native="exchangeReturnLogging"
    >
      <span>배송/교환/반품안내</span>
    </router-link>
  </section>
</template>

<script>
import {
  getMaskingStr,
  htmlDecode,
  insertCommas
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import loginUtil from '@utils/loginUtil'
import messageUtil from '@frameworks/messageUtil'
import PRODUCT_MESSAGE, { PRODUCT_CONST } from '@/common/constants/product/product'
import CONST from '@constants/framework/framework'
import LOGIN_CONST from '@constants/customer/login'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'SectionCustom',
  props: {
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      errorImageIndexList: [] // 유효하지않은 이미지 가지고 있는 리뷰 seq 목록
    }
  },
  computed: {
    reviewList () {
      return this.globalVal.reviewInfo.list
    },
    /**
     * 문의 개수
     *
     * @returns {String}
     */
    qAListCount () {
      return this.globalVal.qnaGuide.qnaCnt ? insertCommas(this.globalVal.qnaGuide.qnaCnt) : 0
    },
    /**
     * 상품평 카테고리
     * @returns {String}
     */
    reviewTypeIndex () {
      return PRODUCT_CONST.CAT_GB.EVALUATION_PRODUCT_TYPES.includes(this.globalVal.productInfo.catGb) ? this.globalVal.productInfo.catGb : '39'
    },
    /**
     * 가격 항목 노출하지 않는 카테고리 여부
     *
     * @param {Number} index 인덱스
     * @returns {Boolean}
     */
    isHidePriceCategory () {
      return ['30', '39'].includes(this.reviewTypeIndex)
    },
    /**
     * 상세 평가 항목
     *
     * @returns {Array}
     */
    evaluationList () {
      const titleList = PRODUCT_CONST.EVALUATION_ITEMS[this.reviewTypeIndex]
      const returnList = []

      titleList.forEach((title, i) => {
        const scoreRateKey = `score${i + 1}Rate`
        returnList.push({ title, scoreRate: this.globalVal.reviewInfo.summary[scoreRateKey] })
      })
      return returnList
    },
    /**
     * summary에서 별점 평가 항목 추출
     *
     * @returns {Object}
     */
    avgScoreListObj () {
      const avgScoreObj = Object.keys(this.globalVal.reviewInfo.summary)
        .filter(key => key.startsWith('avgScore'))
        .sort()
        .reduce((obj, key) => {
          obj[key] = `${this.globalVal.reviewInfo.summary[key]}`
          return obj
        }, {})
      return avgScoreObj
    },
    /**
     * 항목별 가장 많이 평가된 범위 목록
     * @returns {Array} 목록
     */
    maxScoreKeyList () {
      const returnList = []
      for (let idx = 1; idx <= 4; idx++) {
        const maxVal = Object.keys(this.avgScoreListObj)
          .filter(key => key.startsWith(`avgScore${idx}`))
          .reduce((prev, curr) => Number(this.avgScoreListObj[prev]) > Number(this.avgScoreListObj[curr]) ? prev : curr)
        returnList.push(maxVal)
      }
      return returnList
    },
    /**
     * 식품 상품군 여부
     *
     * @returns {Boolean}
     */
    isFoodGroupProduct () {
      return PRODUCT_CONST.CAT_GB.FOOD_GROUP_PRODUCT_TYPES.includes(this.globalVal.productInfo.catGb)
    },
    /**
     * 의약품 상품 여부
     *
     * @returns {Boolean}
     */
    isMedicineProduct () {
      return this.globalVal.productInfo.catGb === PRODUCT_CONST.CAT_GB.HEALTH_FOOD
    },
    /**
     * 상품평 개수
     *
     * @returns {String}
     */
    reviewCount () {
      return this.globalVal.productInfo.join_cnt ? insertCommas(this.globalVal.productInfo.join_cnt) : 0
    },
    /**
     * 별점 평균 비율
     *
     * @returns {String}
     */
    totalPointRating () {
      return `${this.globalVal.reviewInfo.summary.totalPoint}%`
    },
    /**
     * 총 평점
     * (소수점 둘째자리에서 반올림)
     *
     * @returns {String}
     */
    totalPoint () {
      return !this.globalVal.reviewInfo.summary.totalPoint ? '0' : (this.globalVal.reviewInfo.summary.totalPoint / 20).toFixed(1)
    },
    /**
     * 전체 평가 인원수
     *
     * @returns {Number}
     */
    totalPointCount () {
      return this.globalVal.reviewInfo.summary.totalCnt_ > 0 ? insertCommas(this.globalVal.reviewInfo.summary.totalCnt_) : 0
    }

  },
  methods: {
    getMaskingStr,
    htmlDecode,
    /**
     * file_path의 이미지가 더이상 유효하지 않을 때 썸네일 노출 안시키도록 세팅
     *
     * @param {Object} reviewItem
     */
    setErrorImageIndex (reviewItem) {
      this.errorImageIndexList.push(reviewItem.seq)
    },
    /**
     * 평가 항목 답변
     *
     * @param {Object} evalItem 평가항목
     * @returns {String|null}
     */
    getEvaluationAnswer (evalItem) {
      return PRODUCT_CONST.EVALUATION_ANSWER[evalItem.title] || null
    },
    /**
     * 배송/교환/반품 안내 클릭
     */
    exchangeReturnLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction: '반품/교환안내',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 평가항목 답변 인덱스
     *
     * @param {Number} rate 비율 (100%)
     * @returns {Number} 인덱스
     */
    getEvalCatRateIndex (rate) {
      const isGoodRated = rate >= 80
      const isAverageRated = rate >= 40

      if (isGoodRated) {
        return 0
      } else if (isAverageRated) {
        return 1
      } else {
        return 2
      }
    },
    /**
     * 게시판 문의
     *
     */
    gotoInquiry () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction: '상품문의',
          eventLabel: '상품문의더보기',
          params: {
            t1: null
          }
        }
      })
      const params = {
        globalVal: this.globalVal,
        partNumber: this.globalVal.partNumber
      }
      this.$router.push({ name: 'inquiryList', params })
    },
    /**
     * 1대1 게시판 문의
     *
     */
    gotoOneToOneInquiry () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction: '상품문의',
          eventLabel: '1:1문의하기',
          params: {
            t1: null
          }
        }
      })
      const isLogon = loginUtil.checkLogonStatus()
      if (isLogon) {
        this.$router.push('/custcenter/board-inquiry/inquire')
      } else {
        bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER, 'custCenterBoardInquiryWrite')
      }
    },
    /**
     * 상품평 페이지로 이동
     * @param {String} clickedItemSeq 클릭한 리뷰 번호
     */
    gotoCustomerReview (clickedItemSeq) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction: '상품평',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })

      if (!this.reviewCount) {
        messageUtil.alert(PRODUCT_MESSAGE.NO_CUSTOMER_REVIEW)
      } else {
        const params = {
          globalVal: this.globalVal,
          clickedItemSeq,
          partNumber: this.globalVal.partNumber
        }
        this.$router.push({ name: 'reviewList', params })
      }
    },
    /**
     * 이미지경로 생성
     * @param {String} photoPath 이미지 경로
     * @returns {String}
     */
    getImageUrl (photoPath) {
      return `https:${CONST.NS_IMAGE_CUST_SRV}${photoPath}`
    }
  }

}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/product/SectionCustom";
</style>
