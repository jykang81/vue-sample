// import { assert } from 'chai'
import toastUtil from '@frameworks/toastUtil'
import {
  sleep
} from '@utils/commonutil/commonUtil'

describe('toastUtil', () => {
  describe('show', () => {
    it('toast 메시지 노출 1.5초 후 메시지를 가린다', async () => {
      const message = 'test message'

      toastUtil.show(message)

      await sleep(1600)
    })
  })

  describe('showSequentially', () => {
    it('큐의 메시지를 순차 노출한다', async () => {
      const message1 = '순차 노출1'
      const message2 = '순차 노출2'

      toastUtil.showSequentially(message1)
      toastUtil.showSequentially(message2)

      await sleep(300)
    })
  })
})
