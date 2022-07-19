import { assert } from 'chai'
import CommonTimer from '@/common/classes/CommonTimer'

describe('CommonTimer', () => {
  let timer = null

  // eslint-disable-next-line promise/param-names
  const sleep = m => new Promise(r => setTimeout(r, m))

  beforeEach(() => {
    timer = new CommonTimer()
  })

  describe('constructor', () => {
    it('common timer 인스턴스를 생성한다', () => {
      assert.isNotNull(timer)
    })
  })

  describe('hasRemainingTime', () => {
    it('남은 시간이 없으면 false를 반환한다', () => {
      const hasRemainingTime = timer.hasRemainingTime()

      assert.isNotTrue(hasRemainingTime)
    })

    it('남은 시간이 있으면 true를 반환한다', () => {
      const timerOptions = {
        hours: 1,
        minutes: 0,
        seconds: 30
      }
      timer.setTimerOptions(timerOptions)

      const hasRemainingTime = timer.hasRemainingTime()

      assert.isTrue(hasRemainingTime)
    })
  })

  describe('startTimer', () => {
    it('타이머를 시작한다. 남은 시간이 없기 때문에 타이머가 자동으로 멈춘다.', async () => {
      timer.startTimer()

      await sleep(1000)
    })
  })

  describe('elapseTime', () => {
    it('0초이면서 분이 남았을 경우 분/초를 갱신한다', async () => {
      const timerOptions = {
        hours: 0,
        minutes: 1,
        seconds: 0
      }
      timer.setTimerOptions(timerOptions)

      timer.startTimer()

      await sleep(1000)
    })

    it('0초이면서 0분이면서 시간이 남았을 시/분/초를 갱신한다', async () => {
      const timerOptions = {
        hours: 1,
        minutes: 0,
        seconds: 0
      }
      timer.setTimerOptions(timerOptions)

      timer.startTimer()

      await sleep(1000)
    })
  })
})
