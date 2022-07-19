import routerUtil from '@frameworks/routerUtil'
// import { assert } from 'chai'

describe('routerUtil 테스트', function () {
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
  it('back', function () {
    routerUtil.back()
  })

  it('onRouterAbortShim', function () {
    routerUtil.onRouterAbortShim()
  })
})
