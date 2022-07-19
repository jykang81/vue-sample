<template>
  <div class="shopping_history">
    <div
      class="wish_link"
      @click="allJjimAreaClick"
    >
      <span>찜한 상품이 <strong>{{ wishListLength }}개</strong>가 있습니다</span>
    </div>
    <template v-if="showHistory">
      <div class="total_wrap">
        <button
          type="button"
          class="btn_delete"
          @click="deleteAllHistory"
        >
          <span>전체삭제</span>
        </button>
      </div>
      <!-- 최근 본 상품 목록 -->
      <ul class="goods_list">
        <li v-for="(his, day, i) of parseHistoryData" :key="i">
          <strong class="date">{{ day }}</strong>
          <ul class="product_list">
            <li v-for="(hisEl, j) of his" :key="j">
              <div v-if="hisEl.isProduct" class="product_info">
                <figure @click="moveHistoryClick(hisEl)">
                  <ns-img
                    :src="hisEl.prdImgUrlOrCatTitleName"
                    :alt="hisEl.subTextName.sub1"
                  />
                </figure>
                <div class="price_title" @click="moveHistoryClick(hisEl)">
                  <ns-price
                    :dc-price="hisEl.salePrice"
                    :mm-rntal-prc="hisEl.rentalPrice"
                    :buschn-id="hisEl.busChnId"
                    :disp-type-cd="hisEl.dispTypeCd"
                  />
                  <p class="title">
                    {{ hisEl.subTextName.sub1 }}
                  </p>
                </div>
                <div class="btn_group">
                  <button
                    type="button"
                    class="btn_delete"
                    @click="deleteHistory(hisEl.realIndex, day, j)"
                  >
                    상품삭제
                  </button>
                  <button
                    type="button"
                    class="btn_wish"
                    :class="hisEl.jjimFlag ? 'on' : ''"
                    @click="jjimClick($event, hisEl)"
                  >
                    찜하기
                  </button>
                </div>
              </div>
              <div v-else class="product_info">
                <div
                  class="category_link"
                  @click="moveHistoryClick(hisEl)"
                >
                  <span class="category">{{ hisEl.prdImgUrlOrCatTitleName }}</span>
                  <span class="title">{{ hisEl.subTextName.sub1 }}
                    <span v-if="hisEl.subTextName.sub2">({{ hisEl.subTextName.sub2 }})</span>
                  </span>
                </div>
                <div class="btn_group">
                  <button
                    type="button"
                    class="btn_delete"
                    @click="deleteHistory(hisEl.realIndex, day, j)"
                  >
                    상품삭제
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </template>
    <template v-else>
      <div class="msg_box">
        <p class="msg">
          상품을 보지 않으셨습니다<br>다양한 상품을 만나보시겠어요?
        </p>
        <button
          type="button"
          class="btn_go_home"
          @click="goToHome"
        >
          <span>상품 보러가기</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import {
  getDateParse,
  calcDate
} from '@frameworks/dateutil/dateUtil'
import loginUtil from '@utils/loginUtil'
import {
  getImageUrl,
  isNull,
  htmlDecode,
  isOsApp,
  viewType
} from '@utils/commonutil/commonUtil'
import bizUtil from '@/common/utils/bizUtil'
import localStorageUtil from '@/common/frameworks/localStorageUtil'
import toastUtil from '@frameworks/toastUtil'
import messageUtil from '@frameworks/messageUtil'
import COMMON_CONST from '@constants/common/common'
import COMM_CONST from '@constants/framework/constants'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import nativeUtil from '@/common/frameworks/nativeUtil'

export default {
  name: 'ShoppingHistory',
  components: {
    NsImg,
    NsPrice
  },
  data () {
    return {
      historyData: null, // LocalStorage에 저장되는 실제 값
      parseHistoryData: {}, // LocalStorage의 데이터를 정제하여 View로 뿌려질 값
      wishListLength: 0, // 전체 찜 개수
      showHistory: false // 리스트 화면 노출 여부
    }
  },
  created () {
    this.checkFirstVisit()
    this.getHistoryData()
    this.getProductLoadInfo()
  },
  methods: {
    /**
     * 팝업 화면 첫 진입시 토스트 메세지 노출
     * @returns {void}
     */
    checkFirstVisit () {
      const isFirstVisit = localStorageUtil.get(COMM_CONST.STORAGE_KEY.RVP_VISIT)
      if (!isFirstVisit) {
        localStorageUtil.set(COMM_CONST.STORAGE_KEY.RVP_VISIT, true)
        if (isOsApp() && viewType() === 'ios') {
          nativeUtil.showToast('30일간 최대 100개가 보관됩니다. 최근 본 상품은 가격 변동이 있을 수 있습니다.')
        } else {
          toastUtil.show('30일간 최대 100개가 보관됩니다.\n 최근 본 상품은 가격 변동이 있을 수 있습니다.')
        }
      }
    },
    /**
     * 팝업 화면 진입시 LocalStorage에서 히스토리 데이터 조회
     * @returns {void}
     */
    getHistoryData () {
      this.historyData = bizUtil.getRecentlyViewedProducts() || null
    },
    /**
     * 팝업 화면 진입시 찜 되어있는 상품 목록 조회 및 View에 뿌려질 데이터 정제
     * @returns {void}
     */
    getProductLoadInfo () {
      const historyData = this.historyData
      if (historyData && historyData.length > 0) {
        for (const historyInfo of historyData) {
          const hisDate = getDateParse(historyInfo.settime)
          let parseHisDate = null
          const baseDay = `${hisDate.getFullYear()} ${hisDate.getMonth()} ${hisDate.getDate()}`
          const today = getDateParse(calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss'))
          const targetDay = `${today.getFullYear()} ${today.getMonth()} ${today.getDate()}`
          if (baseDay === targetDay) {
            parseHisDate = '오늘'
          } else {
            let month = hisDate.getMonth() + 1
            let date = hisDate.getDate()
            let day = hisDate.getDay()
            const dayEnum = { 0: '(일)', 1: '(월)', 2: '(화)', 3: '(수)', 4: '(목)', 5: '(금)', 6: '(토)' }
            month = `${month}월`
            date = date < 10 ? `0${date}일` : `${date}일`
            day = dayEnum[day]
            const resultDate = `${month} ${date} ${day}`
            parseHisDate = resultDate
          }
          const { hisGubun, realIndex } = historyInfo
          const isProduct = hisGubun === COMMON_CONST.HISTORY_GUBUN.PRODUCT
          let prdImgUrlOrCatTitleName = ''
          if (isProduct) {
            prdImgUrlOrCatTitleName = getImageUrl(historyInfo.partNumber, 176, 176, historyInfo.adultItemFlag)
          } else {
            prdImgUrlOrCatTitleName = this.getHisTitleName(historyInfo.hisGubun)
          }
          const subTextName = this.getHisSubTextName(historyInfo)
          const catentryId = `${historyInfo.catentryId}`

          const parseHistoryDataObject = {
            realIndex,
            isProduct,
            prdImgUrlOrCatTitleName,
            catentryId,
            subTextName,
            salePrice: historyInfo.salePrice,
            rentalPrice: historyInfo.mmRntalPrc,
            busChnId: historyInfo.busChnId,
            dispTypeCd: historyInfo.dispTypeCd,
            jjimFlag: false
          }
          if (this.parseHistoryData[parseHisDate]) {
            this.parseHistoryData[parseHisDate].push(parseHistoryDataObject)
          } else {
            this.$set(this.parseHistoryData, parseHisDate, [])
            this.parseHistoryData[parseHisDate].push(parseHistoryDataObject)
          }
        }
        this.showHistory = true
      } else {
        this.deleteAllHistory()
      }
      this.getJjimList()
    },
    /**
     * 찜된 리스트 항목 조회
     * @returns {Object} promise
     */
    async getJjimList () {
      const invoke = {}
      const successHandler = response => {
        const data = response.msg.data
        let totalCnt = data.pageInfo.totalCnt
        const { wishProductList } = data
        const isLogon = loginUtil.isLoggedIn()
        if (isLogon) {
          for (const day of Object.values(this.parseHistoryData)) {
            for (const his of day) {
              if (wishProductList.some(wish => wish?.catentryId === his.catentryId)) {
                his.jjimFlag = true
              } else {
                his.jjimFlag = false
              }
            }
          }
          for (const wish of wishProductList) {
            if (!wish) {
              totalCnt--
            }
          }
          this.wishListLength = totalCnt
        }
      }
      const errorHandler = () => {
        messageUtil.alert('일시적으로 오류가 발생했습니다. 잠시 후 다시 시도 하시기 바랍니다.')
      }
      await this.$nsaxios.post('GetWishList', invoke, successHandler, errorHandler)
    },
    /**
     * 전체 히스토리 데이터 삭제
     * @returns {void}
     */
    deleteAllHistory () {
      localStorageUtil.del(COMM_CONST.STORAGE_KEY.USER_VISIT_HIS)
      this.historyData = null
      this.parseHistoryData = {}
      this.showHistory = false
      // this.$store.commit('etc/setIcon') // AS-IS에서 처리되어 있지 않은 부분

      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_최근본상품',
          eventAction: '최근본상품',
          eventLabel: '전체삭제',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 개별 히스토리 데이터 삭제
     * @param {Number} realIndex - 로컬스토리지에서 사용하는 실제 인덱스
     * @param {String} day - 삭제할 데이터가 속해있는 일자
     * @param {Number} indexOfArray - 삭제할 데이터의 배열 인덱스
     * @returns {void}
     */
    deleteHistory (realIndex, day, indexOfArray) {
      this.historyData = bizUtil.delHistoryList(realIndex) || null
      if (!this.historyData || this.historyData.length === 0) {
        this.deleteAllHistory()
      } else {
        this.resetParseHistoryDataRealIndex(realIndex)
        this.$store.commit('shoppingHistory/setIcon')
        this.getJjimList()
        this.parseHistoryData[day].splice(indexOfArray, 1)
        if (this.parseHistoryData[day].length === 0) {
          this.$delete(this.parseHistoryData, day)
        }

        // 마케팅 스크립트 적용 부분
        // GA 360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_최근본상품',
            eventAction: '최근본상품',
            eventLabel: '부분삭제',
            params: {
              t1: null
            }
          }
        })
      }
    },
    /**
     * 히스토리 삭제시 Views에 뿌려지는 데이터의 RealIndex 속성 재할당
     * @param {Number} delRealIndex - 삭제될 대상이 로컬 스토리지에서 사용하는 실제 인덱스
     * @returns {void}
     */
    resetParseHistoryDataRealIndex (delRealIndex) {
      for (const day of Object.values(this.parseHistoryData)) {
        for (const his of day) {
          if (his.realIndex > 0 && his.realIndex > delRealIndex) {
            his.realIndex -= 1
          }
        }
      }
    },
    /**
     * 비상품형 히스토리 데이터의 이름 반환 함수
     * @param {String} hisGubun - 상품유형/비상품유형 구분자
     * @returns {String}
     */
    getHisTitleName (hisGubun) {
      let hisTitleName = ''
      if (hisGubun === COMMON_CONST.HISTORY_GUBUN.CATEGORY) {
        hisTitleName = '카테고리'
      } else if (hisGubun === COMMON_CONST.HISTORY_GUBUN.EXHIBITION) {
        hisTitleName = '기획전'
      } else if (hisGubun === COMMON_CONST.HISTORY_GUBUN.EVENT) {
        hisTitleName = '이벤트'
      }
      return hisTitleName
    },
    /**
     * 비상품형 히스토리 데이터의 경로명 반환 함수
     * @param {Object} historyInfo - 상품유형/비상품유형의 최근본상품 객체
     * @returns {Object}
     */
    getHisSubTextName (historyInfo) {
      const vHisGubun = historyInfo.hisGubun
      const subTextName = {
        sub1: '',
        sub2: ''
      }
      if (vHisGubun === COMMON_CONST.HISTORY_GUBUN.PRODUCT) {
        subTextName.sub1 = htmlDecode(historyInfo.productName)
      } else if (vHisGubun === COMMON_CONST.HISTORY_GUBUN.CATEGORY) {
        if (historyInfo.categoryName5) {
          subTextName.sub1 = historyInfo.categoryName5
          subTextName.sub2 = `${historyInfo.categoryName4} > ${historyInfo.categoryName3}`
        } else if (historyInfo.categoryName4) {
          subTextName.sub1 = historyInfo.categoryName4
          subTextName.sub2 = `${historyInfo.categoryName3} > ${historyInfo.categoryName2}`
        } else if (historyInfo.categoryName3) {
          subTextName.sub1 = historyInfo.categoryName3
          subTextName.sub2 = historyInfo.categoryName2
        } else if (historyInfo.categoryName2) {
          subTextName.sub1 = historyInfo.categoryName2
          subTextName.sub2 = historyInfo.categoryName1
        } else if (historyInfo.categoryName1) {
          subTextName.sub1 = historyInfo.categoryName1
        }
      } else if (vHisGubun === COMMON_CONST.HISTORY_GUBUN.EXHIBITION) {
        subTextName.sub1 = historyInfo.cateGroupName
      } else if (vHisGubun === COMMON_CONST.HISTORY_GUBUN.EVENT) {
        subTextName.sub1 = historyInfo.offerNm
      }
      return subTextName
    },
    /**
     * 메인 화면으로 이동
     * @returns {void}
     */
    goToHome () {
      bizUtil.gotoMain()
    },
    /**
     * 상품형 히스토리 데이터의 찜하기 버튼 선택
     * @param {Object} e - 이벤트 객체
     * @param {Object} history - 최근본상품 객체
     * @returns {Object} promise
     */
    async jjimClick (e, history) {
      await bizUtil.wishToggle(e, history.catentryId, history)
      await this.getJjimList()
    },
    /**
     * View 상에서 히스토리 데이터 영역을 선택했을 경우 해당하는 히스토리로 경로 이동
     * @param {Object} history - 최근본상품 객체
     * @returns {void}
     */
    moveHistoryClick (history) {
      // 마케팅 스크립트 적용 부분
      // E-commerce
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
          params: [
            {
              id: String(history.catentryId),
              name: history.subTextName.sub1
            }
          ],
          subparams: {
            t1: '마이페이지',
            t2: '최근본상품',
            product_list: '마이페이지_최근본상품'
          }
        }
      })
      const historyData = this.historyData
      const selectedHisData = historyData.find(his => his.realIndex === history.realIndex)
      const hisGubun = selectedHisData.hisGubun
      if (hisGubun === COMMON_CONST.HISTORY_GUBUN.PRODUCT) {
        bizUtil.gotoProductDetail(selectedHisData.catentryId, { clksrc: '마이페이지_최근본상품' })
      } else if (hisGubun === COMMON_CONST.HISTORY_GUBUN.CATEGORY) {
        this.$router.push({ name: 'lnbCategory', params: { categoryNumber: selectedHisData.categoryId } })
      } else if (hisGubun === COMMON_CONST.HISTORY_GUBUN.EXHIBITION) {
        const pageParams = selectedHisData.pageParams
        const exhibitionQuery = {
          p_espotid: pageParams.p_espotid,
          p_bannerid: pageParams.p_bannerid,
          catgroupId: pageParams.catgroupId,
          via: 'NSMALL'
        }
        this.$router.push({ name: 'exhibitionDetail', query: { ...exhibitionQuery } })
      } else if (hisGubun === COMMON_CONST.HISTORY_GUBUN.EVENT) {
        const queries = selectedHisData.pageQueries
        if (isNull(queries)) {
          this.$router.push({
            name: selectedHisData.eventPageId,
            params: { offerId: selectedHisData.pageParams.offerId }
          })
        } else {
          this.$router.push({
            name: selectedHisData.eventPageId,
            params: { offerId: selectedHisData.pageParams.offerId },
            query: queries
          })
        }
      }
    },
    /**
     * 전체 찜 개수 영역 Bar 영역 선택
     * @returns {void}
     */
    allJjimAreaClick () {
      this.$router.push({ name: 'wishList' })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/common/ShoppingHistory";
</style>
