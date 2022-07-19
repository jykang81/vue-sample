import $store from '@/vuex'
import {
  isOsApp
} from '@utils/commonutil/commonUtil'
import nativeUtil from '@frameworks/nativeUtil'

// 모달 유틸
const modalUtil = {
  /**
   * 모달 호출
   *
   * @param {String} component 모달 컨테이너에 담을 모달 vue 파일의 경로. @components/ 하위의 경로부터 입력합니다. ex) 'customer/MemberAgree'
   * @param {Object} param 모달 컨테이너에 담을 모달 vue 파일에 전달할 파라미터
   * @param {Function} callbackFunction 모달 종료 시 실행할 콜백
  */
  show (component, param, callbackFunction) {
    $store.commit('popup/setPopupList', {
      param,
      callbackFunction,
      // eslint-disable-next-line prefer-template
      path: () => import(/* webpackChunkName: "[request]" */ '@components/' + component)
    })
    $store.commit('popup/show')
    if (isOsApp()) {
      nativeUtil.setRoutePath('/modal')
    }
  },
  /**
   * 모달 닫기
   *
   * @param {*} [callbackData] 모달을 호출한 컴포넌트에 넘겨줄 callback Data
   */
  close (callbackData) {
    $store.commit('popup/hideWithoutBack', callbackData)
  }
}

export default modalUtil
