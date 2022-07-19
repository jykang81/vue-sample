import messageUtil from '@frameworks/messageUtil'
// import { assert } from 'chai'

describe('messageUtil 테스트', function () {
  it('messageUtil', function () {
    const okCallback = function (callbackData) {

    }
    const cancelCallback = function (callbackData) {

    }

    messageUtil.alert('custom 타이틀\n입력하신 회원가입 정보가 모두 삭제됩니다.', okCallback, 'custom 버튼 문구')
    messageUtil.confirm('가입을 취소 하시겠습니까?', okCallback, cancelCallback)
    messageUtil.error('오류가 발생했습니다.', okCallback)
  })
})
