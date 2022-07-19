import { assert } from 'chai'
import { onlyNumFormat } from '@utils/commonutil/commonUtil'

describe('onlyNumFormat', () => {
  it('하이픈이 포함된 숫자를 넣으면, 하이픈을 제거한 문자열을 반환한다', () => {
    const phoneNumberContainsHyphen = '010-9905-4455'

    const result = onlyNumFormat(phoneNumberContainsHyphen)

    const phoneNumber = '01099054455'
    assert.equal(result, phoneNumber)
  })
})
