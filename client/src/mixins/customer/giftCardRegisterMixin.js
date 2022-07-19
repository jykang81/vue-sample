import nsaxios from '@frameworks/axiosUtil'
import messageUtil from '@frameworks/messageUtil'

/**
 * 상품권 등록
 * GiftCardRegisterReal
 */
const giftCardRegisterMixin = {
  methods: {
    /**
     * 상품권 등록
     * @param {object} param 상품권 번호 객체
     * @param {function} successCallback 성공 시 콜백 함수
     * @param {function} errorCallback 에러 시 콜백 함수
     */
    giftCardRegisterMypage (param, successCallback, errorCallback) {
      const successHandling = data => {
        const resultCode = data.msg.root.result.resultCode
        const resultMessage = data.msg.root.result.resultMessage
        const successCode = data.msg.root.result.successCode

        if (resultCode === 'S' && resultMessage === 'SUCCESS' && successCode === '00') {
          messageUtil.alert('입력하신 상품권이 정상등록 되었습니다.', () => {
            successCallback()
          })
        } else {
          messageUtil.alert('상품권 번호가 잘못 입력되었거나,\n이미 등록된 상품권 입니다.')
          errorCallback()
        }
      }

      const errorHandling = () => {
        messageUtil.alert('상품권 번호가 잘못 입력되었거나,\n이미 등록된 상품권 입니다.')
        errorCallback()
      }

      nsaxios.post('GiftCardRegisterReal', param, successHandling, errorHandling)
    }
  }
}
export default giftCardRegisterMixin
