import { assert } from 'chai'
import sinon from 'sinon'
import { iOSVersionCheck } from '@utils/commonutil/commonUtil'

describe('iOSVersionCheck', () => {
  const sandbox = sinon.createSandbox()

  describe('iOS version 반환', () => {
    afterEach(() => {
      sandbox.restore()
    })

    it('iOS 환경이 아니면 빈 문자열을 반환한다', () => {
      const result = iOSVersionCheck()

      assert.equal(result, '')
    })

    it('iOS 환경이라면 앱 버전 정보를 반환한다', () => {
      const mockAppVersion = 'iOS_1_2_3'

      // stub navigator property
      sandbox.stub(navigator, 'platform').value('iPhone')
      sandbox.stub(navigator, 'appVersion').value(mockAppVersion)

      const result = iOSVersionCheck()

      const expeceted = mockAppVersion.split('_').join('.')

      assert.equal(result, expeceted)
    })
  })
})
