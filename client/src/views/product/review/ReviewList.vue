<template>
  <div v-if="reviewDataReady"
       class="review_list"
  >
    <section>
      <div class="star_wrap">
        <span class="rating_star">
          <span class="star" />
          <span
            class="rating"
            :style="{width: totalPointRating}"
          />
        </span>
        <span class="count">{{ totalReviewPoint }}</span>
        <span class="total">{{ totalPointCount }}</span>
      </div>
      <div class="collapse_wrap" :class="collapseStar ? 'open' : ''">
        <ul class="graph_list">
          <li v-for="(pointRate,index) in pointRateList"
              :key="index"
              class="max"
          >
            <span>{{ Math.abs(index-5) }}점</span>
            <div class="graph">
              <span :style="{width: `${pointRate}%`}" />
            </div>
            <span class="per">{{ pointRate }}%</span>
          </li>
        </ul>
      </div>
      <button
        type="button"
        class="btn_collapse"
        :class="collapseStar ? 'active' : ''"
        @click="toggleStarDetail()"
      >
        <span>{{ seenStar.text }}</span>
      </button>
      <div class="collapse_wrap" :class="collapsePercent ? 'open' : ''">
        <ul class="percent_list">
          <li
            v-for="(evalItem,evalIndex) in evaluationList"
            :key="evalIndex"
          >
            <dl
              v-show="!(isHidePriceCategory && evalIndex === 1)"
            >
              <dt>{{ evalItem.title }}</dt>
              <dd>{{ getEvaluationAnswer(evalItem)[Math.abs(maxScoreKeyList[evalIndex].split("_").pop() -3)] }}</dd>
              <dd class="per">
                {{ avgScoreListObj[maxScoreKeyList[evalIndex]] }}%
              </dd>
            </dl>
            <ul v-show="!(isHidePriceCategory && evalIndex === 1)"
                class="graph_list"
            >
              <li
                :class="Math.abs(maxScoreKeyList[evalIndex].split('_').pop() -3)=== 0 ? 'max': ''"
              >
                <span>{{ getEvaluationAnswer(evalItem)[0] }}</span>
                <div class="graph">
                  <span
                    :style="{width: avgScoreListObj[`avgScore${evalIndex+1}_3`]+'%'}"
                  />
                </div>
                <span class="per">{{ avgScoreListObj[`avgScore${evalIndex+1}_3`] || '0' }}%</span>
              </li>
              <li
                :class="Math.abs(maxScoreKeyList[evalIndex].split('_').pop() -3)=== 1 ? 'max': ''"
              >
                <span>{{ getEvaluationAnswer(evalItem)[1] }}</span>
                <div class="graph">
                  <span
                    :style="{width: avgScoreListObj[`avgScore${evalIndex+1}_2`]+'%'}"
                  />
                </div>
                <span class="per">{{ avgScoreListObj[`avgScore${evalIndex+1}_2`] || '0' }}%</span>
              </li>
              <li
                :class="Math.abs(maxScoreKeyList[evalIndex].split('_').pop() -3)=== 2 ? 'max': ''"
              >
                <span>{{ getEvaluationAnswer(evalItem)[2] }}</span>
                <div class="graph">
                  <span
                    :style="{width: avgScoreListObj[`avgScore${evalIndex+1}_1`]+'%'}"
                  />
                </div>
                <span class="per">{{ avgScoreListObj[`avgScore${evalIndex+1}_1`] || '0' }}%</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <button
        type="button"
        class="btn_collapse"
        :class="collapsePercent ? 'active' : ''"
        @click="togglePercentDetail()"
      >
        <span>{{ seenPercent.text }}</span>
      </button>
      <a
        v-if="isWritable"
        class="btn_write"
        @click="registerReview"
      >
        <span>상품평 작성</span>
      </a>
    </section>
    <section :key="pageIdx">
      <div class="total_review">
        <div class="title_wrap">
          <strong class="title">
            상품평 <span>{{ insertCommas(reviewTotalCount) }}</span>
          </strong>
          <select
            v-model="selectedSortCondition"
            @change="onChangeSelSortCondition"
          >
            <option :value="1">
              최신순
            </option>
            <option :value="2">
              낮은평점순
            </option>
            <option :value="3">
              높은평점순
            </option>
          </select>
        </div>
        <ul class="product_info">
          <li
            v-for="(reviewItem, reviewIndex) in reviewList"
            :key="reviewIndex"
            :ref="reviewItem.seq"
          >
            <div class="top_box">
              <div class="star_wrap">
                <span class="rating_star">
                  <span class="star" />
                  <span
                    class="rating"
                    :style="{width:reviewItem.totalRate + '%'}"
                  />
                </span>
                <span class="date">{{ reviewItem.entryDate.split(' ')[0].replace(/-/gi, '.') || '' }}</span>
              </div>
              <div class="info_report">
                <span class="info_id">{{ getMaskingStr(reviewItem.logonId) }}</span>
                <button v-if="!isFoodProduct && !isHealthFoodProduct && !isMedicalProduct" type="button"
                        class="btn_report"
                        @click="clickReportReview(reviewItem.seq)"
                >
                  신고하기
                </button>
              </div>
            </div>
            <p v-if="reviewItem.userOptYn==='Y'"
               class="option"
            >
              {{ reviewItem.attr1 }}
            </p>
            <p class="text_review">
              {{ reviewItem.reviewContents }}
            </p>
            <ul class="review_box">
              <template
                v-for="(evalItem,evalIndex) in evaluationList"
              >
                <li
                  :key="evalIndex"
                >
                  <strong class="question">{{ evalItem.title }}</strong>
                  <span class="answer">{{ getReviewEvalAnswer(reviewItem,evalItem.title,evalIndex) }}</span>
                </li>
              </template>
              <template v-if="isClothingProduct">
                <li>
                  <strong class="question"> 사이즈 </strong>
                  <span class="answer"> {{ reviewItem.sizeVal }}</span>
                </li>
                <li>
                  <strong class="question"> 색상 </strong>
                  <span class="answer"> {{ reviewItem.colorVal }}</span>
                </li>
              </template>
            </ul>
            <button
              v-if="reviewItem.photoYn === 'Y' && !errorImageIndexList.includes(reviewItem.seq)"
              type="button"
              class="btn_layer"
            >
              <img
                :src="getImageUrl(reviewItem.file_path)"
                :alt="htmlDecode(globalVal.productInfo.productName)"
                @error="setErrorImageIndex(reviewItem)"
                @click="openImageSlider(reviewItem)"
              >
              <span v-if="reviewItem.file_cnt && reviewItem.file_cnt > 1"
                    class="num"
              >
                {{ reviewItem.file_cnt }}
              </span>
            </button>
            <div v-if="!isFoodProduct && !isHealthFoodProduct && !isMedicalProduct"
                 class="help"
            >
              <span v-if="getUsefulCount(reviewItem.seq) > 0"
                    class="help_guide"
              >
                <strong>{{ insertCommas(getUsefulCount(reviewItem.seq)) }}</strong>명에게 도움 되었습니다.
              </span>
              <button
                type="button"
                class="btn_good"
                :class="getUsefulClass(reviewItem.seq)"
                @click="onHelpClick(reviewItem.seq)"
              >
                <i class="icons_good" />
                <span>도움 돼요</span>
              </button>
            </div>
          </li>
        </ul>
        <a v-show="showMoreButton"
           class="btn_more"
           @click="getCustomerReview"
        >
          <span>더보기</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script>
import CONST from '@constants/framework/framework'
import LOGIN_CONST from '@constants/customer/login'
import { mapState } from 'vuex'
import {
  insertCommas,
  htmlDecode,
  getMaskingStr
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import popupUtil from '@frameworks/popupUtil'
import loginUtil from '@utils/loginUtil'
import bizUtil from '@utils/bizUtil'
import { PRODUCT_CONST } from '@/common/constants/product/product'
import REVIEW_CONST from '@/common/constants/product/review'
import reviewListService from '@services/product/review/reviewListService'

export default {
  data () {
    return {
      clickedItemSeq: 0, // 클릭한 리뷰 번호
      errorImageIndexList: [], // 유효하지않은 이미지 가지고 있는 리뷰 seq 목록
      showMoreButton: true, // 더보기버튼 보이기
      pageIdx: 1, // 페이지 인덱스
      pageSize: 20, // 페이징 사이즈
      photoList: [], // 이미지 확대보기 이미지 경로 목록
      reviewProduct: {}, // 리뷰작성할 아이템
      LikeCountObj: {}, // 도움되요 카운트 목록
      selectedSortCondition: 1, // 리뷰 정렬 조건
      LikeIndexList: [], // 도움돼요 클릭한 리뷰 인덱스 목록
      isWritable: false, // 리뷰 작성 가능 여부
      reviewDataReady: false, // 리뷰 데이터 호출 응답 완료
      isReportable: false, // 신고가능 여부
      globalVal: {},
      reviewList: [],
      collapseStar: '',
      collapsePercent: '',
      seenStar: {
        text: '자세히 보기'
      },
      seenPercent: {
        text: '자세히 보기'
      }
    }
  },
  computed: {
    ...mapState('login', ['loginPopupType', 'isAdultLogin', 'loginParam']),
    /**
     * 식품 상품 여부
     *
     * @returns {Boolean}
     */
    isFoodProduct () {
      return this.globalVal.productInfo.catGb === PRODUCT_CONST.CAT_GB.FOOD
    },
    /**
     * 의약품 상품 여부
     *
     * @returns {Boolean}
     */
    isHealthFoodProduct () {
      return this.globalVal.productInfo.catGb === PRODUCT_CONST.CAT_GB.HEALTH_FOOD
    },
    /**
     * 의료기기 상품 여부
     *
     * @returns {Boolean}
     */
    isMedicalProduct () {
      return this.globalVal.productInfo.catGb === PRODUCT_CONST.CAT_GB.MEDICAL
    },
    /**
     * 의류, 슈즈 상품 여부
     *
     * @returns {Boolean}
     */
    isClothingProduct () {
      return this.globalVal.productInfo.catGb === PRODUCT_CONST.CAT_GB.CLOTHING_AND_SHOES
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
     * 별점 점수별 분포
     *
     *  @returns {Array} 점수별 비율 리스트
     */
    pointRateList () {
      const returnList = []
      returnList.push(this.globalVal.reviewInfo.summary.fivePointRate)
      returnList.push(this.globalVal.reviewInfo.summary.fourPointRate)
      returnList.push(this.globalVal.reviewInfo.summary.threePointRate)
      returnList.push(this.globalVal.reviewInfo.summary.twoPointRate)
      returnList.push(this.globalVal.reviewInfo.summary.onePointRate)
      return returnList
    },
    /**
     * 상세 평가 항목
     *
     * @returns {Array}
     */
    evaluationList () {
      const reviewTypeIndex = PRODUCT_CONST.CAT_GB.EVALUATION_PRODUCT_TYPES.includes(this.globalVal.productInfo.catGb) ? this.globalVal.productInfo.catGb : '39'
      const titleList = PRODUCT_CONST.EVALUATION_ITEMS[reviewTypeIndex]
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
          .reduce((prev, curr) => {
            return Number(this.avgScoreListObj[prev]) > Number(this.avgScoreListObj[curr]) ? prev : curr
          })
        returnList.push(maxVal)
      }
      return returnList
    },
    /**
     * 전체 리뷰 별점
     *
     * @returns {Number} 별점
     */
    totalReviewPoint () {
      return !this.globalVal.reviewInfo.summary.totalPoint ? 0 : (this.globalVal.reviewInfo.summary.totalPoint / 20).toFixed(1)
    },
    /**
     * 전체 평가 인원수
     *
     * @returns {String}
     */
    totalPointCount () {
      return `${insertCommas(this.globalVal.reviewInfo.summary.totalCnt_)}명`
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
     * 전체 리뷰 개수
     *
     * @returns {Number} 개수
     */
    reviewTotalCount () {
      return this.reviewList?.[0]?.totalCnt || 0
    }

  },
  created () {
    if (this.$route?.params?.globalVal) {
      this.globalVal = this.$route.params.globalVal
      this.clickedItemSeq = this.$route.params.clickedItemSeq
    } else {
      this.globalVal = this.loginParam.globalVal
      this.clickedItemSeq = this.loginParam.clickedItemSeq
    }
    this.getCustomerReview()
  },
  updated () {
    if (this.clickedItemSeq) {
      this.$nextTick(() => {
        this.$refs[this.clickedItemSeq][0].scrollIntoView(
          {
            behavior: 'auto',
            block: 'center',
            inline: 'center'
          }
        )
        this.clickedItemSeq = 0
      })
    }
  },
  methods: {
    getMaskingStr,
    insertCommas,
    htmlDecode,
    /**
     * 도움된 사람 수
     *
     * @param {String} seq 리뷰번호
     * @returns {Number}
     */
    getUsefulCount (seq) {
      return this.LikeCountObj?.[seq] || 0
    },
    /**
     * 조건별 정렬
     *
     */
    onChangeSelSortCondition () {
      this.pageIdx = 1
      this.reviewList = []
      this.getCustomerReview()
    },
    /**
     * 도움되는 리뷰 목록
     *
     */
    setUsefulSeqList () {
      this.reviewList.forEach(review => {
        if (review.usefulyn === 'Y') {
          this.LikeIndexList.push(review.seq)
        }
        this.LikeCountObj[review.seq] = review.yesCnt
      })
    },
    /**
     * 도움되요 리뷰 클래스명
     *
     * @param {String} seq 리뷰 번호
     * @returns {String}
     */
    getUsefulClass (seq) {
      return this.LikeIndexList.some(el => el === seq) ? 'active' : ''
    },
    /**
     * 평가 항목 답변
     *
     * @param {Object} reviewItem 평가리뷰
     * @param {String} title 평가항목명
     * @param {Number} evalIndex 비율
     * @returns {String}
     */
    getReviewEvalAnswer (reviewItem, title, evalIndex) {
      const rate = reviewItem[`score${evalIndex + 1}`]
      const evalAnswerIndex = this.getEvalCatRateIndex(rate)
      return PRODUCT_CONST.EVALUATION_ANSWER[title][evalAnswerIndex] || null
    },
    /**
     * 평가항목 답변 인덱스
     *
     * @param {Number} rate 비율 (100%)
     * @returns {Number} 인덱스
     */
    getEvalCatRateIndex (rate) {
      const isGoodRated = rate > 5 ? rate >= 80 : rate >= 4
      const isAverageRated = rate > 5 ? rate >= 40 : rate >= 2

      if (isGoodRated) {
        return 0
      } else if (isAverageRated) {
        return 1
      } else {
        return 2
      }
    },
    /**
     * file_path의 이미지가 더이상 유효하지 않을 때 썸네일 노출 안시키도록 세팅
     *
     * @param {Object} reviewItem
     */
    setErrorImageIndex (reviewItem) {
      this.errorImageIndexList.push(reviewItem.seq)
    },
    /**
     * 로그인 여부 체크
     * @returns {Boolean}
     */
    checkLogin () {
      const isLogon = loginUtil.checkLogonStatus()
      if (isLogon) {
        return true
      } else {
        const globalVal = this.globalVal
        const clickedItemSeq = this.clickedItemSeq
        bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER, null, false, { globalVal, clickedItemSeq })
        return false
      }
    },
    /**
     * 상품평 신고 가능 여부 체크
     *
     * @param {String} seq 상품평순번
     * @returns {Boolean}
     */
    async checkReportable (seq) {
      const reportableParam =
      {
        cmdType: REVIEW_CONST.REVIEW_CMD_TYPE.CHECK_REPORTABLE,
        goodGrdSeq: seq,
        catentryId: this.globalVal.productInfo.catentryId,
        usersId: loginUtil.userId()
      }
      return await reviewListService.checkReportable(reportableParam)
        .then(response => {
          if (response.msg.root.result.code === 'S') {
            this.isReportable = true
            return true
          } else {
            if (response.msg.root.result.code === 'F') {
              messageUtil.alert('본인이 작성한 상품평은 신고할 수 없습니다.')
            } else if (response.msg.root.result.code === 'E') {
              messageUtil.alert('이미 신고한 상품평입니다.')
            } else {
              console.log('예외')
            }

            this.isReportable = false
            return false
          }
        }
        )
    },
    /**
     * 신고하기 버튼 클릭
     * @param {String} seq 상품평순번
     *
     */
    async clickReportReview (seq) {
      if (this.checkLogin()) {
        if (await this.checkReportable(seq)) {
          this.gotoReportReview(seq)
        } else {
          console.log('신고 불가')
        }
      }
    },
    /**
     * 신고페이지로 이동
     * @param {Number} seq 상품평번호
     */
    gotoReportReview (seq) {
      const param = {
        globalVal: this.globalVal,
        seq,
        title: '신고하기',
        titleAlign: 'center',
        isShowSearch: false,
        isShowCart: false
      }
      popupUtil.show('product/ReportReview', param, _ => {})
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
     * 상품평 작성버튼 클릭
     *
     */
    registerReview () {
      const globalVal = this.globalVal
      const clickedItemSeq = this.clickedItemSeq
      this.$store.commit('login/setLoginParam', { globalVal, clickedItemSeq })
      this.$router.push('/product/review/management/unregistered')
    },
    /**
     * 상품평 작성 가능 여부 api 조회
     *
     * postField1 상품코드
     * postField3 NS고객번호
     *
     */
    getCustomerReviewWritable () {
      const successHandling = response => {
        if (response.msg.root.result.code === 'S') {
          this.reviewProduct = response.msg.root.orderinfo
          this.isWritable = true
          this.reviewProduct = response.msg.root.orderinfo
        } else {
          this.isWritable = false
        }
      }
      const params = {
        cmdType: REVIEW_CONST.REVIEW_CMD_TYPE.CHECK_WRITABLE,
        postField1: this.globalVal.productInfo.catentryId,
        postField3: loginUtil.userId()
      }

      reviewListService.getCustomerReviewWritable(params, successHandling)
    },
    /**
     * 상품평목록 조회
     *
     * postField1: 상품코드,
     * postField2: 몰 구분,
     * postField3: pageSize
     * postField4: pageIdx
     * postField6: userId,
     * orderByType: [1: 최신순, 2: 별점 낮은순, 3: 별점 높은순]
     *
     */
    getCustomerReview () {
      const successHandling = response => {
        this.getCustomerReviewWritable() // TODO: 같은 이름의 API 동시 실행 피하기 위해 콜백에 넣어놓음.

        this.reviewList = [...this.reviewList, ...response.reviewList.list]
        this.reviewDataReady = true
        if (!this.reviewTotalCount || this.reviewTotalCount <= this.pageSize * this.pageIdx) {
          this.showMoreButton = false
        } else {
          this.pageIdx++
          this.showMoreButton = true
        }
        this.setUsefulSeqList()
      }
      const params = {
        cmdType: (this.isFoodProduct || this.isHealthFoodProduct) ? REVIEW_CONST.REVIEW_CMD_TYPE.GET_FOOD_AND_MEDICINE : REVIEW_CONST.REVIEW_CMD_TYPE.GET_GENERAL,
        postField1: this.globalVal.productInfo.catentryId,
        postField2: this.globalVal.productInfo.catGb,
        postField3: this.pageSize,
        postField4: this.pageIdx,
        postField6: loginUtil.userId(),
        postField5: this.selectedSortCondition, // TODO: API 수정필요. 임시로 들어간 파라미터
        orderByType: this.selectedSortCondition
      }

      reviewListService.getCustomerReview(params, successHandling)
    },
    /**
     * 상품평 평가
     * postField1 상품코드
     * postField2 상품평순번
     * postField3 NS고객번호
     * postField4 구분값 ["Y" : 도움되요 "N" : 도움되지않아요]
     * postField5 증감구분 ["Y":증가 "N":감소]
     *
     * @param {String} seq 리뷰번호
     * @param {Boolean} isExist 도움돼요 평가여부
     */
    setUsefulYn (seq, isExist) {
      const successHandling = response => {
        if (response.msg.root.result.code === 'Y') {
          this.LikeIndexList.push(seq)
          this.LikeCountObj[seq] = this.LikeCountObj?.[seq] + 1 || 1
        } else if (response.msg.root.result.code === 'D') {
          this.LikeIndexList.splice(this.LikeIndexList.indexOf(seq), 1)
          this.LikeCountObj[seq] = this.LikeCountObj?.[seq] || 0 > 1 ? this.LikeCountObj?.[seq] - 1 : 0
        } else if (response.msg.root.result.code === 'F') {
          messageUtil.alert('본인이 작성한 상품평은 추천할 수 없습니다.')
        } else {
          console.log('예외', response.msg.root.result.code)
        }
      }
      const params = {
        cmdType: REVIEW_CONST.REVIEW_CMD_TYPE.SET_USEFUL,
        postField1: this.globalVal.productInfo.catentryId,
        postField2: seq,
        postField3: loginUtil.userId(),
        postField4: 'Y',
        postField5: isExist ? 'N' : 'Y'
      }

      reviewListService.setUsefulYn(params, successHandling)
    },

    /**
     * 별점 펼치기/접기
     */
    toggleStarDetail () {
      this.collapseStar = !this.collapseStar
      this.seenStar.text = this.collapseStar ? '접기' : '자세히 보기'
      window.scrollTo({
        top: 0,
        left: 0
      })
    },
    /**
     * 퍼센트 펼치기/접기
     */
    togglePercentDetail () {
      this.collapsePercent = !this.collapsePercent
      this.seenPercent.text = this.collapsePercent ? '접기' : '자세히 보기'
      window.scrollTo({
        top: 0,
        left: 0
      })
    },
    /**
     * 도움돼요 토글 버튼
     * @param {String} seq 리뷰번호
     */
    onHelpClick (seq) {
      if (this.checkLogin()) {
        const isSeqExist = this.LikeIndexList.some(el => el === seq)
        this.setUsefulYn(seq, isSeqExist)
      } else {
        const globalVal = this.globalVal
        const clickedItemSeq = this.clickedItemSeq
        bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER, null, false, { globalVal, clickedItemSeq })
      }
    },
    /**
     * 이미지 확대보기 열기
     * @param {Object} reviewItem 리뷰
     */
    async openImageSlider (reviewItem) {
      await this.getCustomerReviewPhotoList(reviewItem)

      const param = {
        title: '상세이미지',
        titleAlign: 'center',
        isShowSearch: false,
        isShowCart: false,
        photoList: this.photoList,
        productName: this.globalVal.productInfo.productName
      }
      popupUtil.show('product/ImageSliderLayer', param, null)
    },
    /**
     * 상품평 이미지리스트 조회
     * @param {Object} reviewItem 리뷰
     */
    async getCustomerReviewPhotoList (reviewItem) {
      const successHandling = response => {
        const { pList } = response.returnValue
        this.photoList = []
        pList.forEach(item => {
          this.photoList.push({ photoPath: `https://${CONST.NS_IMAGE_CUST_SRV}${item.filePath}` })
        })
      }
      const params = {
        cmdType: REVIEW_CONST.REVIEW_CMD_TYPE.GET_PHOTO_LIST,
        goodgrdSeq: reviewItem.seq,
        photoYN: 'Y'
      }

      await reviewListService.getCustomerReviewPhotoList(params, successHandling)
    },
    /**
     * 이미지경로 생성
     * @param {String} photoPath 이미지 경로
     * @returns {String}
     */
    getImageUrl (photoPath) {
      return `https:${CONST.NS_IMAGE_CUST_SRV}${photoPath}`
    },
    /**
     * 글자수 제한
     * @param {String} letters 대상 문자열
     * @param {Number} [limit = 3] 최대 문자수
     * @returns {String} 글자수 제한이 적용된 문자열
     */
    limitCharcter (letters, limit = 3) {
      return letters.slice(0, limit)
    },
    /**
     * 별표 첨가 문자열 반환
     * @param {String} letters 대상 문자열
     * @param {Number} [count = 3] 첨가될 별표 갯수
     * @returns {String}
     */
    appendAsterisks (letters, count = 3) {
      const asterisks = '*'.repeat(count)

      return `${letters}${asterisks}`
    },
    /**
     * 가림 처리된 고객 아이디 반환
     * @param {String} userId
     * @returns {String}
     */
    maskUserId (userId) {
      const limittedUserId = this.limitCharcter(userId)
      const maskedUserId = this.appendAsterisks(limittedUserId)

      return maskedUserId
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/product/review/ReviewList";
</style>
