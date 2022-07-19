import flushPromises from 'flush-promises'
import router from '@/router'
import uiUtil from '@utils/uiUtil'
import {
  isOsApp
} from '@utils/commonutil/commonUtil'
import nativeUtil from '@frameworks/nativeUtil'

/**
 * Modal과 Full layer 팝업 데이터를 담고 있음
 *
 * @typedef popup
 * @property {Promise} path - 팝업 경로
 * @property {Object} param - 팝업에 전달할 파라미터
 * @property {Function} callbackFunction - 팝업 종료시 실행할 callback
 * @property {Boolean} isFullLayer - full layer 팝업 여부 (true: Full 레이어 팝업, false: 모달)
 * @property {Boolean} isShowHeader - 헤더 노출 여부
 */

export default {
  namespaced: true,

  state: {
    /** @type {Array<popup>} */
    popupList: []
  },

  getters: {
    /**
     * fullayer popup 포함 여부
     *
     * @param {Object} state 상태
     * @returns {Boolean} fullayer popup 포함 여부
     */
    hasFullLayerPopup (state) {
      if (state.popupList.length) {
        return state.popupList.some(popupObj => popupObj.isFullLayer)
      }

      return false
    }
  },

  mutations: {
    /**
     * 팝업이 존재하면 팝업을 보여줌
     *
     * @param {Object} state 상태
     */
    show (state) {
      const popupList = state.popupList
      const popupCount = popupList.length
      if (popupCount) {
        // 바닥 페이지 스크롤 금지 설정
        uiUtil.disableScroll()

        const currentPopup = popupList[popupCount - 1]
        currentPopup.isShow = true

        // Full layer 팝업인 경우만 해시 추가
        if (currentPopup.isFullLayer) {
          router.push(`#popup-${popupCount}`)
        }
      }
    },
    /**
     * 팝업 정보를 Array에 push
     *
     * @param {Object} state 상태
     * @param {Object} payload 팝업 정보
     */
    setPopupList (state, payload) {
      state.popupList.push(payload)
    },
    /**
     * 현재 팝업을 닫음 (팝업 해시 #popup-N 삭제하고 팝업 닫을 때 사용)
     *
     * @param {Object} state 상태
     * @param {*} callbackData Callback Data
     */
    hide (state, callbackData) {
      // 해시 삭제
      router.back()

      // callbackData를 팝업 데이터에 넣음. callback은 @router/index.js 의 router.beforeEach 훅에서 hideWithoutBack mutation을 호출할때 실행됨
      const popupList = state.popupList
      const currentPopup = popupList && popupList[popupList.length - 1]
      if (currentPopup) {
        currentPopup.callbackData = callbackData
      }
    },
    /**
     * 열려진 모든 팝업을 닫음
     *
     * @param {Object} state 상태
     */
    hideAll (state) {
      // 팝업 모두 닫음
      state.popupList = []

      // 바닥 페이지 스크롤 금지 해제
      let trialCount = 0
      const intervalRef = setInterval(() => {
        trialCount++
        const layerEl = document.querySelector('.full_layer')

        if (trialCount >= 10) {
          clearInterval(intervalRef)
          uiUtil.enableScroll()
        }

        if (layerEl !== null) {
          return
        }

        clearInterval(intervalRef)
        uiUtil.enableScroll()
      }, 100)

      router.replace(router.history.current.path)
    },
    /**
     * 현재 팝업을 닫음 (팝업 해시 #popup-N 삭제 없이 팝업만 닫을 때 사용)
     *
     * @param {Object} state 상태
     * @param {*} [callbackData] Callback Data
     */
    async hideWithoutBack (state, callbackData) {
      if (isOsApp() && router.history.current.path.indexOf('/native/product/shopping-alarm-register') > -1) {
        nativeUtil.closeWebView()
        return
      }
      // 팝업 닫기(팝업 Array에서 꺼냄)
      const popup = state.popupList.pop()

      // callbackData를 팝업 데이터에 넣음.
      if (callbackData) {
        popup.callbackData = callbackData
      }

      // 바닥 페이지 스크롤 금지 해제
      if (state.popupList.length === 0) {
        let trialCount = 0
        const intervalRef = setInterval(() => {
          trialCount++
          const layerEl = document.querySelector('.full_layer')

          if (trialCount >= 10) {
            clearInterval(intervalRef)
            uiUtil.enableScroll()
          }

          if (layerEl !== null) {
            return
          }

          clearInterval(intervalRef)
          uiUtil.enableScroll()
        }, 100)
      }

      // 팝업을 닫을때 설정된 callback Function을 실행
      if (popup.callbackFunction) {
        // 비동기 처리(라우터 이동 포함)가 끝나길 기다림
        await flushPromises()

        // callback 실행
        popup.callbackFunction(popup.callbackData)
      }
      const element = Boolean(document.querySelector('.mt32'))
      if (isOsApp() &&
      router.history.current.path.trim() !== '/customer/info' &&
      router.history.current.path.trim() !== '/customer/info/' &&
      !element) {
        nativeUtil.setRoutePath(router.history.current.fullPath)
      }
    }
  }
}
