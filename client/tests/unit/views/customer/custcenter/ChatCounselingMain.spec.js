import VueRouter from 'vue-router'
import { assert } from 'chai'
import flushPromises from 'flush-promises'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import custCenterLink from '@/router/modules/custCenterLink' // 고객센터 링크

import ChatCounselingMain from '@/views/custcenter/ChatCounselingMain'

const localVue = createLocalVue()
localVue.use(VueRouter)

// 필수 테스트 할 대상 파일명을 넣음
describe('ChatCounselingMain 테스트', () => {
  let wrapper
  const router = new VueRouter({
    routes: [custCenterLink]
  })

  before(() => {
    wrapper = shallowMount(ChatCounselingMain, {
      localVue,
      router
    })
  })

  describe('채팅상담 탭 노출', async () => {
    it('채팅상담 탭 노출', async () => {
      router.push({ name: 'chatCounselingRequest' })

      await flushPromises()

      const html = wrapper.find('.tab_content').html()

      assert.isTrue(html.includes('chat-counseling-request-stub'))
    })
  })

  describe('상담내역 탭 노출', async () => {
    it('상담내역 탭 노출', async () => {
      router.push({ name: 'chatCounselingHistory' })

      await flushPromises()

      const html = wrapper.find('.tab_content').html()

      assert.isTrue(html.includes('chat-counseling-history-stub'))
    })
  })
})
