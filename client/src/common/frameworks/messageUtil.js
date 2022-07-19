import $store from '@/vuex'

const messageUtil = {
  /**
   * Alert 레이어 팝업
   *
   * @param {String} message 입력할 메시지
   * @param {Function} [okCallback] 확인버튼 콜백, 기본동작은 팝업닫힘
   * @param {String} [okTxt='확인'] 확인버튼 텍스트
   */
  alert (message, okCallback, okTxt = '확인') {
    const msg = message.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\/n/g, '<br>')
    const params = {
      type: 'alert',
      msg,
      okCallback,
      okTxt
    }

    $store.commit('message/setParam', params)
    $store.commit('message/show')
  },
  /**
   * Confirm 레이어 팝업
   *
   * @param {String} message 입력할 메시지
   * @param {Function} okCallback 확인버튼 콜백
   * @param {Function} [cancelCallback] 취소버튼 콜백, 기본동작 팝업닫힘
   * @param {String} [okTxt='확인'] 확인버튼 텍스트
   * @param {String} [cancelTxt='취소'] 취소버튼 텍스트
   */
  confirm (message, okCallback, cancelCallback, okTxt = '확인', cancelTxt = '취소') {
    const msg = message.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\/n/g, '<br>')
    const params = {
      type: 'confirm',
      msg,
      okCallback,
      cancelCallback,
      okTxt,
      cancelTxt
    }

    $store.commit('message/setParam', params)
    $store.commit('message/show')
  },
  /**
   * Error 레이어 팝업
   *
   * @param {String} msg 입력할 메시지
   * @param {Function} [okCallback] 확인버튼 콜백, 기본동작은 팝업닫힘
   * @param {String} [okTxt='확인'] 확인버튼 텍스트
   */
  error (msg, okCallback, okTxt = '확인') {
    this.alert(msg, okCallback, okTxt)
  }
}

export default messageUtil
