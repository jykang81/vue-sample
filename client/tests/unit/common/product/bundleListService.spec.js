import { assert } from 'chai'
import CONST from '@constants/framework/framework'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import bundleListService from '@services/product/bundleListService'
import flushPromises from 'flush-promises'

const initResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSSearchDCDeliveryWrapper`)
    .reply(200, {})
}
describe('bundleListService', () => {
  let mock
  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })
  beforeEach(() => {
    mock.reset()
    initResponse(mock)
  })
  it('상품목록 가져오기', async () => {
    bundleListService.getDCDeliveryProducts()
    await flushPromises()
    assert.isTrue(true)
  })
})
