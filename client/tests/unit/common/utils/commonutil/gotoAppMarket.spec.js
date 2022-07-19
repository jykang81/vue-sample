import { assert } from 'chai'
import sinon from 'sinon'
import {
  gotoAppMarket
} from '@utils/commonutil/commonUtil'
import * as viewTypeModule from '@utils/commonutil/viewType'

/**
 * 함수 분석 후 재작성 필요
 */
describe('gotoAppMarket', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('어플리케이션 마켓 다이렉트 이동 (android)', () => {
    const stub = sinon.stub(viewTypeModule, 'default').returns('android')

    gotoAppMarket(true)

    assert.isTrue(stub.called)
  })

  it('어플리케이션 마켓 다이렉트 이동 (iOS)', () => {
    const stub = sinon.stub(viewTypeModule, 'default').returns('ios')

    gotoAppMarket(true)

    assert.isTrue(stub.called)
  })

  it('어플리케이션 실행 (android)', () => {
    const stub = sinon.stub(viewTypeModule, 'default').returns('android')

    gotoAppMarket()

    assert.isTrue(stub.called)
  })

  it('어플리케이션 실행 (iOS)', () => {
    const stub = sinon.stub(viewTypeModule, 'default').returns('ios')

    gotoAppMarket()

    assert.isTrue(stub.called)
  })
})
