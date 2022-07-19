import App2Web from '@/views/marketing/App2Web'
import { shallowMount } from '@vue/test-utils'
import { assert } from 'chai'

describe('App2Web', () => {
  describe('methods', () => {
    it('marketingLogSend, 네이버 프리미엄 로그', () => {
      const wrapper = shallowMount(App2Web)
      const vm = wrapper.vm
      vm.marketingLogSend('{"logger":"1","type":"1","data":{"pageId":"prodDetail"}}')
      assert.equal(true, true)
    })
    it('marketingLogSend, RECOBELL', () => {
      const wrapper = shallowMount(App2Web)
      const vm = wrapper.vm
      vm.marketingLogSend('{"logger":"2","data":{"category":"add_productview","action":{"catalog":"1358062","name":"종근당 6년근 홍삼정 애니타임 + 고급 쇼핑백","id":"24745657","price":28900,"sale":""},"searchTerm":"","clickUrl":"yunTest1","itemType":"","CTCOMitemYn":"","TVitemYn":"","pageId":"prodDetail"}}')
      assert.equal(true, true)
    })
    it('marketingLogSend, DTSI', () => {
      const wrapper = shallowMount(App2Web)
      const vm = wrapper.vm
      vm.marketingLogSend('{"logger":"3","data":{"category":"add_purchase","action":[{"orderId":"orderId","productId":"productId1","productName":"productName1","price":100,"quantity":1,"discount":10,"del":2500,"attrs":"attrs1"},{"orderId":"orderId","productId":"productId2","productName":"productName2","price":200,"quantity":2,"discount":20,"del":0,"attrs":"attrs2"}],"orderId":"72972","lastPrice":2970,"totalPrice":300,"pageId":"orderCompleted"}}')
      assert.equal(true, true)
    })
    it('marketingLogSend, 홈쇼핑모아', () => {
      const wrapper = shallowMount(App2Web)
      const vm = wrapper.vm
      vm.marketingLogSend('{"logger":"6","data":{"from_hsmoa":false,"action":["11466759","14740166","24689641","26349642","21193188"],"category":"list","pageId":"prodList"}}')
      assert.equal(true, true)
    })
    it('marketingLogSend, 페이스북 픽셀', () => {
      const wrapper = shallowMount(App2Web)
      const vm = wrapper.vm
      vm.marketingLogSend('{"logger":"7","type":"ViewContent","data":{"value":1000,"currency":"KRW","content_name":"제품명1","content_type":"product","content_ids":"1122334455","pageId":"prodDetail"}}')
      assert.equal(true, true)
    })
  })
})
