import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수
import BaseLayout from '@components/layouts/BaseLayout'

describe('BaseLayout 테스트', () => {
  let localVue
  let wrapper
  let vm

  before(function () {
    localVue = createLocalVue()
    wrapper = shallowMount(BaseLayout, {
      localVue,
      router,
      store
    })
    vm = wrapper.vm
  })

  it('LayoutEmpty 레이아웃 테스트', async () => {
    vm.layoutName = 'LayoutEmpty'
    const actual = vm.layoutConfig
    const expected = {
      appHeaderMain: false,
      appHeaderDefault: false,
      appHeaderProduct: false,
      appHeaderSub: false,
      appSearchHeader: false,
      appCategory: false,
      appFooter: false,
      appBottomNavi: false
    }
    assert.deepEqual(actual, expected)
  })

  it('LayoutSearchResult 레이아웃 테스트', async () => {
    vm.layoutName = 'LayoutSearchResult'
    const actual = vm.layoutConfig
    const expected = {
      appHeaderMain: false,
      appHeaderDefault: false,
      appHeaderProduct: false,
      appHeaderSub: false,
      appSearchHeader: true,
      appCategory: false,
      appFooter: true,
      appBottomNavi: true
    }
    assert.deepEqual(actual, expected)
  })

  it('LayoutPageNonFooter 레이아웃 테스트', async () => {
    vm.layoutName = 'LayoutPageNonFooter'
    const actual = vm.layoutConfig
    const expected = {
      appHeaderMain: false,
      appHeaderDefault: false,
      appHeaderProduct: false,
      appHeaderSub: true,
      appSearchHeader: false,
      appCategory: false,
      appFooter: false,
      appBottomNavi: false
    }
    assert.deepEqual(actual, expected)
  })

  it('LayoutPage 레이아웃 테스트', async () => {
    vm.layoutName = 'LayoutPage'
    const actual = vm.layoutConfig
    const expected = {
      appHeaderMain: false,
      appHeaderDefault: false,
      appHeaderProduct: false,
      appHeaderSub: true,
      appSearchHeader: false,
      appCategory: false,
      appFooter: true,
      appBottomNavi: false
    }
    assert.deepEqual(actual, expected)
  })

  it('LayoutProduct 레이아웃 테스트', async () => {
    vm.layoutName = 'LayoutProduct'
    const actual = vm.layoutConfig
    const expected = {
      appHeaderMain: false,
      appHeaderDefault: false,
      appHeaderProduct: true,
      appHeaderSub: false,
      appSearchHeader: false,
      appCategory: false,
      appFooter: true,
      appBottomNavi: false
    }
    assert.deepEqual(actual, expected)
  })

  it('LayoutLnbNonFooter 레이아웃 테스트', async () => {
    vm.layoutName = 'LayoutLnbNonFooter'
    const actual = vm.layoutConfig
    const expected = {
      appHeaderMain: false,
      appHeaderDefault: true,
      appHeaderProduct: false,
      appHeaderSub: false,
      appSearchHeader: false,
      appCategory: false,
      appFooter: false,
      appBottomNavi: true
    }
    assert.deepEqual(actual, expected)
  })

  it('LayoutLnb 레이아웃 테스트', async () => {
    vm.layoutName = 'LayoutLnb'
    const actual = vm.layoutConfig
    const expected = {
      appHeaderMain: false,
      appHeaderDefault: true,
      appHeaderProduct: false,
      appHeaderSub: false,
      appSearchHeader: false,
      appCategory: false,
      appFooter: true,
      appBottomNavi: true
    }
    assert.deepEqual(actual, expected)
  })

  it('LayoutDefault 레이아웃 테스트', async () => {
    vm.layoutName = 'LayoutDefault'
    const actual = vm.layoutConfig
    const expected = {
      appHeaderMain: true,
      appHeaderDefault: false,
      appHeaderProduct: false,
      appHeaderSub: false,
      appSearchHeader: false,
      appCategory: true,
      appFooter: true,
      appBottomNavi: true
    }
    assert.deepEqual(actual, expected)
  })
})
