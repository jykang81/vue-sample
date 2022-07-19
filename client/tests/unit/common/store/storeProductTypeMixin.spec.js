import { assert } from 'chai'
import { mount } from '@vue/test-utils'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'

describe('happyDealMixin ', () => {
  let wrapper
  let vm

  it('method test', () => {
    wrapper = mount(storeProductTypeMixin, {})
    vm = wrapper.vm

    const rental = vm.isRentalProduct({ dispTypeCd: '45' })
    const phone = vm.isPhoneProduct({ dispTypeCd: '57' })
    const consult = vm.isConsultantRequiredProduct({ dispTypeCd: '45' })
    assert.equal(rental, true)
    assert.equal(phone, true)
    assert.equal(consult, true)
    const rprice = vm.rentalPrice({ mmRntalPrc: 50000 })
    assert.equal(rprice, '50,000')
    const ordCntOver = vm.getOrderCount(99999999)
    assert.equal(ordCntOver, '9,999,999개 구매')
    const orderCntFit = vm.getOrderCount(9999999)
    assert.equal(orderCntFit, '9,999,999개 구매')
    const orderCntZero = vm.getOrderCount(0)
    assert.equal(orderCntZero, '')
    const startCntOver = vm.getStarCount(99999)
    assert.equal(startCntOver, '+9,999')
    const startCntFit = vm.getStarCount(9999)
    assert.equal(startCntFit, '9,999')
    const startCntZero = vm.getStarCount(0)
    assert.equal(startCntZero, '')
    const productMock = {
      buschnId: 'TV',
      isFlashSale: 'Y',
      dlvrFreeYn: 'Y',
      promIfiVal: 15,
      promPadYn: 'Y',
      orderQty: '5'
    }
    const isBenefitExist = vm.isBenefitExist(productMock)
    assert.equal(isBenefitExist, true)
    const isBenefitExistForSlot = vm.isBenefitExistForSlot(productMock, 'N')
    assert.equal(isBenefitExistForSlot, true)
  })
})
