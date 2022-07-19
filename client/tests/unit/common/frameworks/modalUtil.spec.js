import modalUtil from '@frameworks/modalUtil'

describe('modalUtil', () => {
  describe('show & close', () => {
    it('모달을 열고 닫는다', () => {
      const multiLayerParam = {
        title: '회원 가입'
      }

      modalUtil.show('test/MultiModal1', multiLayerParam, callbackData => {})

      modalUtil.close(callbackData => {})
    })
  })
})
