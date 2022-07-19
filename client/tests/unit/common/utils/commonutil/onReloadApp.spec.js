import { assert } from 'chai'
import sinon from 'sinon'
import {
  onReloadApp
} from '@utils/commonutil/commonUtil'

describe('onReloadApp', () => {
  const { location } = window

  before(() => {
    delete window.location
  })

  after(() => {
    window.location = location
  })

  it('retry 해쉬가 없으면, 페이지를 리로드한다', () => {
    const spy = sinon.spy()

    window.location = {
      hash: '',
      reload: spy
    }

    onReloadApp()

    assert.isTrue(spy.called)
  })

  it('retry 해쉬가 있으면, 페이지를 리로드 하지 않는다.', () => {
    const spy = sinon.spy()

    window.location = {
      hash: '#retry',
      reload: spy
    }

    onReloadApp()

    assert.isFalse(spy.called)
  })
})
