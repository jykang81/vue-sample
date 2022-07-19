import { assert } from 'chai'
import { moneyUnformat } from '@utils/commonutil/commonUtil'

describe('moneyUnformat', () => {
  it('포맷 되어있는 문자열 금액에서 포맷을 제거한다', () => {
    const formattedMoney = '19,230,920,3,093'

    const result = moneyUnformat(formattedMoney)

    const unformattedMoney = '192309203093'

    assert.equal(result, unformattedMoney)
  })
})
