import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import ImageSliderLayer from '@components/product/ImageSliderLayer'

describe('ImageSliderLayer', () => {
  let localVue
  let options
  let wrapper
  let vm

  beforeEach(function () {
    localVue = createLocalVue()

    options = {
      localVue,
      propsData: {
        param: {
          photoList: [
            {
              class: 'class com.ns.commerce.nsphoto.bean.NSProductPhotoDataBean',
              photoPath: '//product-image.dev-nsmall.com/itemimg/3/24/153/24092153_Q.jpg',
              thumbnailPath: null,
              zoomPath: null
            }
          ]
        }
      }
    }

    wrapper = shallowMount(ImageSliderLayer, options)
    wrapper.vm.$refs.swiperTop.$swiper = {
      activeIndex: 0
    }
    wrapper.vm.$refs.swiperThumbs.$swiper = {
      activeIndex: 0
    }
    vm = wrapper.vm

    it('swiperOptionTop 값 ', () => {
      console.log(vm.swiperOptionTop)
    })
  })

  describe('computed test', () => {
    // it('productPhotoList 값 ', () => {
    //   assert.isNotEmpty(vm.productPhotoList)
    // })
    it('topSwiper ', async function () {
      assert.isNotEmpty(vm.topSwiper)
    })
    it('thumbnailSwiper  ', async function () {
      assert.isNotEmpty(vm.thumbnailSwiper)
    })
  })

  describe('methods', () => {
    it('handleTopSlideChange ', function () {
      const index = 1
      vm.setThumbnailClass(index)
      const expected = 1
      assert.equal(vm.activeThumbnailIndex, expected)
    })
    it('handleTopSlideChange ', function () {
      wrapper.vm.$refs.swiperTop.swiper = {
        activeIndex: 1
      }
      vm.handleTopSlideChange()
    })
    it('handleThumbnailClick  ', function () {
      wrapper.vm.$refs.swiperThumbs.swiper = {
        clickedIndex: 1
      }
      wrapper.vm.$refs.swiperTop.swiper = {
        slideTo: () => {}
      }
      vm.handleThumbnailClick()
    })
    it('handleThumbnailClick : thumbnail 외부 영역 클릭 예외 처리 ', function () {
      wrapper.vm.$refs.swiperThumbs.swiper = {
        clickedIndex: undefined
      }
      wrapper.vm.$refs.swiperTop.swiper = {
        slideTo: () => {}
      }
      vm.handleThumbnailClick()
    })
  })
})
