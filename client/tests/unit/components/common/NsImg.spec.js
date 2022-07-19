import { assert } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import NsImg from '@components/common/NsImg'
import { getImageUrl } from '@utils/commonutil/commonUtil'
import NO_IMAGE_SQUARE from '@/assets/images/common/img_noImage_square.png'
import NO_IMAGE_WIDE from '@/assets/images/common/img_noImage_wide.png'

describe('NsImg', () => {
  let wrapper
  let vm
  // @error 이벤트 mocking
  const mockError = {
    target: {
      src: '',
      getAttribute: () => 0, // 에러 발생으로 이미지 대체된 횟수
      setAttribute: () => {
        // NOTHING TO DO
      }
    }
  }

  // @error 이벤트 두 번째 발생했을 때 mocking
  const mockError2 = {
    target: {
      src: '',
      getAttribute: () => 1, // 에러 발생으로 이미지 대체된 횟수
      setAttribute: () => {
        // NOTHING TO DO
      }
    }
  }

  describe('imageSrc', () => {
    it('src가 있고 와이드 이미지인 경우, 도메인에 image.nsmall.com가 포함 돼있으면 그대로 보여줌', () => {
      wrapper = shallowMount(NsImg, {
        localVue: createLocalVue(),
        propsData: {
          src: '//image.nsmall.com/ec_comimages/nsupload/espot/images/TEST_IMG/banner_food.jpg',
          alt: '상품 이미지',
          width: 500,
          height: 500,
          productNumber: '24862518',
          isAdult: 'N',
          type: 'WIDE',
          replace: 'SQUARE'
        }
      })

      vm = wrapper.vm
      assert.equal(vm.imageSrc, vm.src)
    })

    it('src가 있고 와이드 이미지인 경우, 도메인에 image.nsmall.com가 포함 돼있지 않으면 X6 이미지를 보여줌', () => {
      wrapper = shallowMount(NsImg, {
        localVue: createLocalVue(),
        propsData: {
          src: 'https://product-image.prod-nsmall.com/itemimg/7/29/407/29301407_Q.jpg',
          alt: '상품 이미지',
          width: 500,
          height: 500,
          productNumber: '24862518',
          isAdult: 'N',
          type: 'WIDE',
          replace: 'SQUARE'
        }
      })

      vm = wrapper.vm
      assert.equal(vm.imageSrc, vm.wideImageUrl)
    })

    it('src가 있고 정방형 이미지인 경우 그대로 보여줌', () => {
      wrapper = shallowMount(NsImg, {
        localVue: createLocalVue(),
        propsData: {
          src: 'https://product-image.prod-nsmall.com/itemimg/7/29/407/29301407_Q.jpg',
          alt: '상품 이미지',
          width: 500,
          height: 500,
          productNumber: '24862518',
          isAdult: 'N',
          type: 'SQUARE'
        }
      })

      vm = wrapper.vm
      assert.equal(vm.imageSrc, vm.src)
    })

    it('src가 없고 와이드 이미지인 경우 X6 이미지를 보여줌', () => {
      wrapper = shallowMount(NsImg, {
        localVue: createLocalVue(),
        propsData: {
          alt: '상품 이미지',
          width: 500,
          height: 500,
          productNumber: '24862518',
          isAdult: 'N',
          type: 'WIDE'
        }
      })

      vm = wrapper.vm
      assert.equal(vm.imageSrc, vm.wideImageUrl)
    })

    it('src가 없고 정방형 이미지인 경우 정방형 이미지 생성해서 보여줌', () => {
      wrapper = shallowMount(NsImg, {
        localVue: createLocalVue(),
        propsData: {
          alt: '상품 이미지',
          width: 500,
          height: 500,
          productNumber: '24862518',
          isAdult: 'N',
          type: 'SQUARE'
        }
      })

      vm = wrapper.vm
      assert.equal(vm.imageSrc, getImageUrl(vm.productNumber, vm.width, vm.height, vm.isAdult))
    })

    it('정방형 이미지가 없을 때 에러 이미지는 정방형 노이미지', () => {
      wrapper = shallowMount(NsImg, {
        localVue: createLocalVue(),
        propsData: {
          alt: '상품 이미지',
          width: 500,
          height: 500,
          productNumber: '24862518',
          isAdult: 'N',
          type: 'SQUARE'
        }
      })

      vm = wrapper.vm
      vm.getNoImageUrl(mockError)
      assert.equal(mockError.target.src, NO_IMAGE_SQUARE)
    })

    it('와이드 이미지가 없고 대체 이미지 리사이즈 타입이 없을 때 에러 이미지는 와이드 노 이미지', () => {
      wrapper = shallowMount(NsImg, {
        localVue: createLocalVue(),
        propsData: {
          alt: '상품 이미지',
          width: 500,
          height: 500,
          productNumber: '24862518',
          isAdult: 'N',
          type: 'WIDE'
        }
      })

      vm = wrapper.vm
      vm.getNoImageUrl(mockError)
      assert.equal(mockError.target.src, NO_IMAGE_WIDE)
    })

    it('와이드 이미지가 없고 대체 이미지 리사이즈 타입이 정방형일 때 에러 이미지는 500x500 정방형 이미지', () => {
      wrapper = shallowMount(NsImg, {
        localVue: createLocalVue(),
        propsData: {
          alt: '상품 이미지',
          width: 500,
          height: 500,
          productNumber: '24862518',
          isAdult: 'N',
          type: 'WIDE',
          replace: 'SQUARE'
        }
      })

      vm = wrapper.vm
      vm.getNoImageUrl(mockError)
      assert.equal(mockError.target.src, getImageUrl(vm.productNumber, 500, 500, vm.isAdult))
    })

    it('와이드 이미지가 없고 대체 이미지 리사이즈 타입이 정방형이지만 그 마저도 에러인 경우 에러 이미지는 와이드 노 이미지', () => {
      wrapper = shallowMount(NsImg, {
        localVue: createLocalVue(),
        propsData: {
          alt: '상품 이미지',
          width: 500,
          height: 500,
          productNumber: '24862518',
          isAdult: 'N',
          type: 'WIDE',
          replace: 'SQUARE'
        }
      })

      vm = wrapper.vm
      vm.getNoImageUrl(mockError2)
      assert.equal(mockError2.target.src, NO_IMAGE_WIDE)
    })

    it('와이드 이미지가 없고 대체 이미지 리사이즈 타입이 크롭 이미지일때 에러 이미지는 크롭 이미지', () => {
      wrapper = shallowMount(NsImg, {
        localVue: createLocalVue(),
        propsData: {
          alt: '상품 이미지',
          width: 500,
          height: 500,
          productNumber: '24862518',
          isAdult: 'N',
          type: 'WIDE',
          replace: 'CROP'
        }
      })

      vm = wrapper.vm
      vm.getNoImageUrl(mockError)
      assert.equal(mockError.target.src, getImageUrl(vm.productNumber, 600, 300, vm.isAdult, 'crop'))
    })

    it('와이드 이미지가 없고 대체 이미지 리사이즈 타입이 크롭 이미지이지만 그 마저도 에러인 경우 에러 이미지는 와이드 노 이미지', () => {
      wrapper = shallowMount(NsImg, {
        localVue: createLocalVue(),
        propsData: {
          alt: '상품 이미지',
          width: 500,
          height: 500,
          productNumber: '24862518',
          isAdult: 'N',
          type: 'WIDE',
          replace: 'CROP'
        }
      })

      vm = wrapper.vm
      vm.getNoImageUrl(mockError2)
      assert.equal(mockError2.target.src, NO_IMAGE_WIDE)
    })
  })
})
