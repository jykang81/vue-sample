import { assert } from 'chai'
import { timerObject } from '@utils/commonutil/commonUtil'

describe('timerObject', () => {
  describe('interval 콜백 관리용 타이머 객체', () => {
    it('interval 콜백이 없으면 아무일도 일어나지 않는다', () => {
      timerObject.checkTimerObject()
    })

    it('interval callback id가 있으면 interval callback을 지운다', () => {
      timerObject.m_timer = setInterval(() => {}, 1000) // set interval

      timerObject.checkTimerObject() // clear interval

      assert.equal(timerObject.m_timer, 0)
    })
  })
})
