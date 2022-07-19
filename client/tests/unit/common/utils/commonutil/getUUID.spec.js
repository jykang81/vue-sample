import { assert } from 'chai'
import { getUUID } from '@utils/commonutil/commonUtil'

describe('getUUID', () => {
  it('UUID를 반환한다', () => {
    const uuid = getUUID()

    assert.isNotNull(uuid)
  })
})
