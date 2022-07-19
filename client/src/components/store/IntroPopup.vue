<template>
  <section
    v-touch:swipe.bottom="handleClose"
    class="intro_popup active"
  >
    <div class="exhibit_popup">
      <h2 class="blind">
        기획전 바로가기
      </h2>
      <div class="exhibit_img">
        <router-link to="" event="" @click.native.prevent="popupClickLogging(isNull(param.marketingText) ? param.contentName : param.marketingText)">
          <img ref="introImage" :src="param.imgUrl" alt="기획전">
        </router-link>
      </div>
      <button
        type="button"
        class="btn_close"
        @click="handleClose"
      >
        <span class="blind">팝업 닫기</span>
      </button>
    </div>
  </section>
</template>

<script>
import getNowDate from '@frameworks/dateutil/getNowDate'
import localStorageUtil from '@frameworks/localStorageUtil'
import COMM_CONST from '@constants/framework/constants'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import appCategoryService from '@services/layouts/items/appCategoryService'
import uiUtil from '@/common/utils/uiUtil'

export default {
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  mounted () {
    this.showAfterImageLoad()
  },
  beforeDestroy () {
    const endDate = `${getNowDate()}235959`
    localStorageUtil.set(COMM_CONST.STORAGE_KEY.EVENT_POPUP_MAIN, endDate)
    uiUtil.enableScroll()
  },
  methods: {
    /**
     * 팝업 닫기 click 콜백
     */
    handleClose () {
      this.$store.commit('animationPopup/hide') // animation popup 닫기 요청
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_팝업',
          eventAction: '팝업',
          eventLabel: '닫기',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 팝업 클릭 - GA360
     * @param {String} popupTitle 팝업명
     */
    async popupClickLogging (popupTitle) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_팝업',
          eventAction: '팝업',
          eventLabel: popupTitle,
          params: {
            t1: null
          }
        }
      })
      const movePath = await this.productDetailRoute()
      if (movePath) { this.$router.push(movePath) }
    },
    /**
     * 클릭 타겟이 'Internal'인 페이지의 랜딩 정보 반환.
     * @param {String} bannerId 컨텐츠 ID
     * @param {String} espotId ESPOT ID
     * @param {String} mdUrl 이동할 md URL
     * @returns {Object}
     */
    setInternalPage (bannerId, espotId, mdUrl) {
      const invoke = {}

      const tmp = mdUrl.split('?')
      if (tmp.length > 1) {
        const paramStr = tmp[1].split('&')

        invoke.bannerId = bannerId
        invoke.espotId = espotId

        for (let i = 0; i < paramStr.length; i++) {
          const param = paramStr[i].split('=')

          invoke[param[0]] = param[1]
        }
      }

      if (!mdUrl.startsWith('/')) {
        mdUrl = `/${mdUrl}`
      }
      return {
        path: mdUrl,
        params: invoke
      }
    },
    /**
     * 클릭 타겟에 따라 랜딩될 페이지와 파라메터 분기후 반환.
     * @returns {Object || false}
     */
    async productDetailRoute () {
      const clickTarget = !isNull(this.param.clickTarget) ? this.param.clickTarget : null
      const mdUrl = this.param.mdUrl
      const mdUrlLastValue = mdUrl.split('/')[mdUrl.split('/').length - 1] // mdUrl 스트링값에서 슬래시(/)로 자른 마지막 값(categoryId 등등..)
      if (clickTarget === 'External') { // External 일때
        const mdUrlChecker = htmlDecode(this.param.mdUrl).replace('?', '&')
        const urlParams = new URLSearchParams(mdUrlChecker)
        const myParam = urlParams.get('offer_id')
        const isNSTimesEvent = mdUrlChecker.indexOf('NSTimesEvent') > -1
        if (isNSTimesEvent) { // 이벤트 매장일때
          return {
            path: `/event/application/${myParam}`
          }
        } else { // 이벤트 매장이 아닐때
          let returnPath = null
          if (mdUrlLastValue === '1636074') { // 띵라이브 매장.
            returnPath = '/store/media/thingLive'
          } else if (mdUrlLastValue === '1313557') { // 샵플러스 매장.
            returnPath = '/store/media/shopplus'
          } else if (mdUrlLastValue === '1397062') { // tv 쇼핑 매장
            returnPath = '/store/media/tv-shopping'
          } else if (mdUrlLastValue === 'NSBroadSchedule' || mdUrlLastValue === 'schedule') { // 편성표 매장
            returnPath = '/media/schedule'
          } else if (mdUrlLastValue === 'SuperHotMain') { // 해피딜 매장.
            returnPath = '/store/theme/happydeal'
          } else { // 슬롯매장 검사 API 찔러서 유효성 체크.
            const apiData = await this.getPLCategoryInfo()
            let checker = !isNull(apiData) && !isNull(apiData.msg) && apiData.msg.length
            if (checker) {
              checker = false
              const msgArray = apiData.msg
              msgArray.forEach(element => {
                if (element.categoryId === mdUrlLastValue) {
                  returnPath = `/store/slot/${mdUrlLastValue}`
                  checker = true
                  return { path: returnPath }
                }
              })
            }
            if (checker) {
              return { path: returnPath }
            } else {
              window.location.href = this.param.mdUrl // 위의 케이스들이 적용되지 않으면 외부 도메인으로 판단.
              return false
            }
          }
          return { path: returnPath }
        }
      } else if (clickTarget === 'Product') { // Product 일때
        return {
          name: 'productDetail',
          params: {
            number: this.param.partNumber
          }
        }
      } else if (clickTarget === 'Category') { // Category 일때
        const categoryId = Number(this.param.clickCode)
        const invoke = {}
        if (categoryId < 0) { // 기획전
          invoke.catgroupId = categoryId
          invoke.via = 'NSMALL'
          return {
            name: 'exhibitionDetail',
            query: invoke
          }
        } else {
          return {
            name: 'lnbCategory',
            params: {
              categoryNumber: this.param.clickCode
            }
          }
        }
      } else if (clickTarget === 'Internal') { // Internal 일때
        return this.setInternalPage(this.param.contentsId, this.param.espotId, this.param.mdUrl)
      } else {
        return false
      }
    },
    /**
     * 현재 운영중인 슬롯매장 조회.
     * @returns {Object}
     */
    getPLCategoryInfo () {
      return appCategoryService.setPLCategoryInfo()
    },
    /**
     * 팝업 표시 (이미지 기준)
     */
    showAfterImageLoad () {
      const introImage = this.$refs.introImage

      if (introImage) {
        this.$refs.introImage.addEventListener('load', () => {
          this.$store.commit('animationPopup/show')
        })
      } else {
        this.handleClose()
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/IntroPopup";
</style>
