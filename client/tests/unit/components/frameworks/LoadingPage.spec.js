import Vuex from 'vuex'
import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import store from '@/vuex'

import LoadingPage from '@components/frameworks/LoadingPage' // 테스트 할 대상 컴포넌트

describe('LoadingPage.vue에 대한 테스트 케이스', () => {
  let localVue
  let options
  const text = '카드사 결제'

  before(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    options = {
      localVue,
      store,
      propsData: {
        text,
        preLoader: true
      }
    }
  })

  it('텍스트 노출 확인', async () => {
    const wrapper = shallowMount(LoadingPage, options)

    const actual = wrapper.find('strong.subject').text()
    assert.isTrue(actual.includes(text))
  })
})
