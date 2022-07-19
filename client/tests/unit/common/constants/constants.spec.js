import COMM_CONST from '@/common/constants/framework/constants'
// import { assert } from 'chai'

describe('COMM_CONST 테스트', function () {
  before(function () {
    // console.log('블록 범위 내 모든 테스트 전에 실행')
  })

  after(function () {
    // console.log('블록 범위 내 모든 테스트 후에 실행')
  })

  beforeEach(function () {
    // console.log('블록 범위 내 각 테스트 직전에 실행')
  })

  afterEach(function () {
    // console.log('블록 범위 내 각 테스트 직후에 실행')
  })

  // 단위 테스트 설정
  it('APP_CONFIG test', function () {
    COMM_CONST.setCampaignId('aaaaaa')
    COMM_CONST.getCampaignId()
    COMM_CONST.setCocd('110')
    COMM_CONST.getCocd()

    COMM_CONST.getWebAppDefaultCocd()
    COMM_CONST.getWebAppDefaultCocd(true)
    COMM_CONST.getWebAppDefaultCocd('')
    COMM_CONST.getWebAppDefaultCocd('android')
    COMM_CONST.getWebAppDefaultCocd('androidss')
    COMM_CONST.getWebAppDefaultCocd({})
    // assert.equal(process.env.VUE_APP_IS_SERVER_STATE, result)
  })
})
