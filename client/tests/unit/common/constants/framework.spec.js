import { APP_CONFIG } from '@/common/constants/framework/framework'
import { assert } from 'chai'

describe('framework APP_CONFIG 테스트', function () {
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
    const result = APP_CONFIG.getActiveProfile()
    assert.equal(process.env.VUE_APP_IS_SERVER_STATE, result)

    APP_CONFIG.isActiveProfile()
    APP_CONFIG.isLocal()
    APP_CONFIG.isDev()
    APP_CONFIG.isTest()
    APP_CONFIG.isProd()
  })
})
