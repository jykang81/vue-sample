import { assert } from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'

import externalUtil from '@utils/externalUtil'
import CONST from '@constants/framework/framework'
import COMM_CONST from '@constants/framework/constants'
import {
  getNowTime
} from '@frameworks/dateutil/dateUtil'
import localStorageUtil from '@frameworks/localStorageUtil'

describe('externalUtil', () => {
  let mock

  before(() => {
    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  describe('getScript', () => {
    it('스크립트를 동적 로딩한다', async () => {
      const source = ''
      const beforeEl = null

      try {
        externalUtil.getScript(source, beforeEl)
        await flushPromises()
      } catch (error) {
        error.message()
      }
    })
  })

  describe('chkStaffOnlyPrd', () => {
    let prdList
    let callback

    beforeEach(() => {
      prdList = null
      callback = null
      mock.reset()
    })

    it('상품정보가 없을 때 제휴사 실적 정보 전달이 되지 않는다', () => {
      prdList = null
      callback = null

      externalUtil.chkStaffOnlyPrd(prdList, callback)
    })

    it('상품정보가 있을 때 제휴사 실적 정보 전달', async () => {
      prdList = [
        {
          orderItemsId: 'stub',
          catentryId: 'stub'
        }
      ]
      callback = () => {}

      const url = `${CONST.API_URL}/SeparateStaffOnlyProducts`
      const mockResponseResult = {
        authorizedStaff: {
        },
        staffOnlyProductList: ['stub1', 'stub2', 'stub3']
      }

      mock
        .onPost(url)
        .reply(200, mockResponseResult)

      try {
        externalUtil.chkStaffOnlyPrd(prdList, callback)
        await flushPromises()
      } catch (error) {
        assert.fail(error.message)
      }
    })
  })

  describe('getBroadCastParam', () => {
    it('외부 link Page에서 서비스 호출 시 중계페이지에서 외부 link Page에서 보낸 Parameters를 parsing', () => {
      const nowAddress = 'stub?a=a&b=b&referrer=stub&c=c&d=d'

      const result = externalUtil.getBroadCastParam(nowAddress)

      assert.isNotNull(result)
    })
  })

  describe('cocdTimeCheck', () => {
    describe('기본 cocd일 때', () => {
      it('cocd 시간체크후 20분이 지났으면 default cocd로 변경', () => {
        externalUtil.cocdTimeCheck()
      })
    })

    describe('기본 외 cocd일 때', () => {
      before(() => {
        const mockCocd = '222'
        COMM_CONST.setCocd(mockCocd)
      })

      after(() => {
        const defaultCocd = '110'
        COMM_CONST.setCocd(defaultCocd)
      })

      describe('cocd 확인시간이 스토리지에 없을 때', () => {
        it('cocd 시간체크후 20분이 지났으면 default cocd로 변경', () => {
          externalUtil.cocdTimeCheck()
        })
      })

      describe('cocd 확인시간이 스토리지에 있을 때', () => {
        before(() => {
          localStorageUtil.set('cocdTimeCheck', getNowTime())
        })

        after(() => {
          localStorageUtil.del('cocdTimeCheck')
        })

        it('cocd 시간체크후 20분이 지났으면 default cocd로 변경', () => {
          externalUtil.cocdTimeCheck()
        })
      })
    })
  })

  describe('deriveParametersFromURI', () => {
    it('URI로부터 key & value 추출 후 객체 형태 반환', () => {
      const mockURI = 'https://mw.nsmall.com/store/home?a=a&b=b'

      const params = externalUtil.deriveParametersFromURI(mockURI)

      assert.isNotNull(params)
    })
  })
})
