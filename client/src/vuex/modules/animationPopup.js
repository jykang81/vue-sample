import { setTimeout } from 'core-js'
import {
  isNull
} from '@utils/commonutil/commonUtil'
import uiUtil from '@utils/uiUtil'

/**
 * animation popup 객체
 * @typedef {Object} AnimationPopup
 * @property {Function} dynamicComponent - 동적 컴포넌트
 * @property {Object} param - 컴포넌트 props로 전달될 객체
 * @property {Number|null} delay - 애니메이션 delay
 * @property {Object|null} enterAnimationStyle - 팝업 오픈 애니메이션 스타일
 * @property {Object|null} leaveAnimationStyle - 팝업 닫힘 애니메이션 스타일
 */

export default {
  namespaced: true,

  state: {
    /** @type {AnimationPopup} */
    animationPopup: null,
    isShow: false,
    defaultEnterAnimationStyle: { // enter animation style object (기본값)
      transition: 'all 1s',
      animation: 'fadeIn 1s forwards',
      animationName: 'slidein'
    },
    defaultLeaveAnimationStyle: { // leave animation style object (기본값)
      transition: 'all 1s',
      animation: 'fadeIn 1s forwards',
      animationName: 'slideOut'
    },
    animationStyle: null // 현재 반영되는 animation style
  },

  mutations: {
    /**
     * 팝업 표시
     * @param {Object} state 상태
     */
    show (state) {
      // validation
      if (isNull(state.animationPopup)) {
        return
      }

      uiUtil.disableScroll()

      state.isShow = true // 팝업 보이기
    },
    /**
     * 애니메이션 팝업 객체 할당
     * @param {Object} state 상태
     * @param {AnimationPopup} animationPopup 애니메이션 팝업 객체
     */
    setAnimationPopup (state, animationPopup) {
      state.animationPopup = animationPopup
    },
    /**
     * 팝업 즉시 닫기 (delay 및 애니메이션 효과 없음)
     */
    hideAtOnce (state) {
      // validation
      if (isNull(state.animationPopup)) {
        return
      }

      state.isShow = false // 팝업 닫기
      state.animationPopup = null // 애니메이션 팝업 비우기
    },
    /**
     * 팝업 닫기
     * @param {Object} state 상태
     */
    hide (state) {
      // validation
      if (isNull(state.animationPopup)) {
        return
      }

      const regex = new RegExp(/([0-9]+[.|,][0-9]*)|([0-9]*[.|,][0-9]+)|([0-9]+)/g)
      let animationStyle = null
      let delay = 0

      // animation style 설정
      // 지정 스타일이 없을 때
      if (isNull(state.animationPopup.leaveAnimationStyle)) {
        if (!isNull(state.animationPopup.delay)) { // 지정 delay 있을 때
          animationStyle = Object.assign({}, state.defaultLeaveAnimationStyle)

          const replacedAnimation = state.defaultLeaveAnimationStyle.animation.replace(regex, state.animationPopup.delay)
          animationStyle.animation = replacedAnimation

          const matchedList = animationStyle.animation.match(regex)
          delay = Number(matchedList[0])
        } else { // 지정 delay 없을 때
          animationStyle = state.defaultLeaveAnimationStyle

          delay = 1 // 기본 delay 설정
        }

        state.animationStyle = animationStyle
      } else if (!isNull(state.animationPopup.leaveAnimationStyle)) { // 지정 스타일이 있을 때
        state.animationStyle = state.animationPopup.leaveAnimationStyle

        const matchedList = state.animationStyle.animation.match(regex)
        delay = Number(matchedList[0])
      }

      const timeout = (delay * 1000) * 0.4 // delay <-> 애니메이션 시간 차이 보정
      setTimeout(function () {
        if (!isNull(state.animationPopup)) {
          state.animationPopup = null // 애니메이션 팝업 비우기
          state.isShow = false // 팝업 닫기
          uiUtil.enableScroll()
        }
      }, timeout)
    },
    /**
     * 애니메이션 스타일 설정
     * @param {Object} state 상태
     * @param {Object} styleObject 스타일 객체
     */
    setAnimationStyle (state, styleObject) {
      state.animationStyle = styleObject
    }
  }
}
