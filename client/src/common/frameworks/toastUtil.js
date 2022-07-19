import $store from '@/vuex'

// 토스트 메시지 유틸
const toastUtil = {
  /**
   * 토스트 메시지 호출
   * @param {String} message (필수) 토스트 메시지
   * @param {String} [customClass=''] (선택) 토스트 메시지 커스텀 클래스
   */
  show (message, customClass = '') {
    const param = {
      message,
      customClass
    }

    $store.commit('toast/setMessage', param)
  },
  /**
   * 토스트 메시지 순차 호출
   * @param {String} message (필수) 토스트 메시지
   * @param {String} [customClass=''] (선택) 토스트 메시지 커스텀 클래스
   */
  showSequentially (message, customClass = '') {
    const param = {
      message,
      customClass
    }

    $store.dispatch('toast/showSequentially', param)
  }
}

export default toastUtil
