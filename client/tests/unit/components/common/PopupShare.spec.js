import { assert } from 'chai'
import { mount } from '@vue/test-utils'
import PopupShare from '@/components/common/PopupShare'
import {
  viewType
} from '@utils/commonutil/commonUtil'

describe('PopupShare', () => {
  const wrapper = mount(PopupShare, {
    propsData: {
      param: {
        title: '타이틀',
        description: '설명',
        imageUrl: 'https://image.nsmall.com/ec_comimages/nsupload/espot/images/banner/mobile/d0116_theme_17NEWYEAR_EXHIBITION.jpg',
        likeCount: 1,
        viewCount: 2,
        shareUrl: 'https://devm2.nsmall.com/test'
      }
    }
  })
  const vm = wrapper.vm

  describe('PopupShare', () => {
    it('setSmsUrl', async () => {
      await vm.setSmsUrl()

      if (viewType() === 'androidweb') {
        assert.equal(vm.smsUrl, 'sms:?body=https://devm2.nsmall.com/test')
      } else if (viewType() === 'ios' || viewType() === 'iosweb') {
        assert.equal(vm.smsUrl, 'sms:&body=https://devm2.nsmall.com/test')
      } else {
        assert.equal(vm.smsUrl, '')
      }
    })

    it('onClickKakaotalk ', () => {
      vm.onClickKakaotalk()
    })

    it('onClickFacebook ', () => {
      vm.onClickFacebook()
    })

    it('sharePopupClose ', () => {
      vm.sharePopupClose()
    })
  })
})
