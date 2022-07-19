import store from '@/vuex'
import {
  isNull
} from '@utils/commonutil/commonUtil'

// 애니메이션 팝업 유틸
const animationPopupUtil = {
  /**
   * 애니메이션 팝업 호출
   * @param {Object} opitons 팝업 옵션
   * @param {String} opitons.componentPath 컴포넌트 경로 ex) 'customer/MemberAgree'
   * @param {Object} [options.param] 컴포넌트 props로 전달될 객체
   * @param {Number} [options.delay] 애니메이션 delay. (enter/leave AnimationStyle과 중복사용 불가)
   * @param {Object} [options.enterAnimationStyle] 팝업 오픈 시 적용될 style object (leaveAnimationStyle과 함께 사용, delay와 중복사용 불가)
   * @param {Object} [options.leaveAnimationStyle] 팝업 닫힘 시 적용될 style object (enterAnimationStyle과 함께 사용, delay와 중복사용 불가)
   */
  openAnimationPopup (options) {
    const {
      componentPath,
      param = null,
      delay = null,
      enterAnimationStyle = null,
      leaveAnimationStyle = null
    } = options

    const popupObj = {
      // eslint-disable-next-line prefer-template
      dynamicComponent: () => import(/* webpackChunkName: "[request]" */ '@components/' + componentPath),
      param,
      delay,
      enterAnimationStyle,
      leaveAnimationStyle
    }

    if (!isNull(delay)) { // delay 설정
      const defaultEnterStyle = store.state.animationPopup.defaultEnterAnimationStyle

      const style = Object.assign({}, defaultEnterStyle) // 기본 style 복사

      const animation = defaultEnterStyle.animation.replace('1s', `${delay}s`) // 기본 스타일에 delay 값만 변경
      style.animation = animation // delay 변경된 animation으로 교체

      store.commit('animationPopup/setAnimationStyle', style)
    } else if (!isNull(enterAnimationStyle)) { // custom animation 설정
      store.commit('animationPopup/setAnimationStyle', enterAnimationStyle)
    }

    store.commit('animationPopup/setAnimationPopup', popupObj) // 팝업 설정
  }
}

export default animationPopupUtil
