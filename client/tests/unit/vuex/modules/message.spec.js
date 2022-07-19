import { assert } from 'chai'
import sinon from 'sinon'
import store from '@/vuex'
import { nativeTestUtil } from '@unit/testUtil'

describe('message', () => {
  describe('hide', () => {
    describe('앱일 때', () => {
      before(() => {
        nativeTestUtil.setMockNativeUtil()
      })

      after(() => {
        nativeTestUtil.clearMockNativeUtil()
      })

      it('앱이고 특정 엘리먼트가 있을 때', () => {
        sinon.stub(document, 'querySelector').returns({})

        store.commit('message/hide')

        assert.isTrue(document.querySelector.called)

        document.querySelector.restore()
      })

      it('앱이고 특정 엘리먼트가 없을 때', () => {
        const fakeQuerySelector = selector => {
          if (selector === '.right_order_option.active' || selector === 'div.dimmed_all.native_opa') {
            return null
          }

          return {}
        }

        sinon.stub(document, 'querySelector').callsFake(fakeQuerySelector)

        store.commit('message/hide')

        document.querySelector.restore()
      })
    })
  })
})
