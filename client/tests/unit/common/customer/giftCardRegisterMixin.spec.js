import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'
import flushPromises from 'flush-promises'
import giftCardRegisterMixin from '@/mixins/customer/giftCardRegisterMixin'

describe('giftCardRegisterMixin', () => {
  let mock

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  beforeEach(() => {
    mock.reset()
  })

  it('giftCardRegisterMypage success', async () => {
    const giftCardRegisterReal = `${CONST.API_URL}/GiftCardRegisterReal`
    const mockResponseResult = {
      msg: {
        root: {
          result: {
            successCode: '00',
            totalGiftCardAmount: 328900,
            resultCode: 'S',
            resultMessage: 'SUCCESS'
          }
        }
      }
    }
    const param = {
      giftCardNo: '1234567812345678'
    }

    mock
      .onPost(giftCardRegisterReal)
      .reply(200, mockResponseResult)

    giftCardRegisterMixin.methods.giftCardRegisterMypage(param, () => {}, () => {})

    await flushPromises()
  })

  it('giftCardRegisterMypage error', async () => {
    const giftCardRegisterReal = `${CONST.API_URL}/GiftCardRegisterReal`
    const mockResponseResult = {
      msg: {
        root: {
          result: {
            successCode: '-1',
            totalGiftCardAmount: 328900,
            resultCode: 'E',
            resultMessage: '유효한 상품권이 아닙니다1.'
          }
        }
      }
    }
    const param = {
      giftCardNo: '1234567812345678'
    }

    mock
      .onPost(giftCardRegisterReal)
      .reply(200, mockResponseResult)

    giftCardRegisterMixin.methods.giftCardRegisterMypage(param, () => {}, () => {})

    await flushPromises()
  })
})
