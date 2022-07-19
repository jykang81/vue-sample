import { assert } from 'chai'
import product from '@/vuex/modules/product'

describe('product 테스트', function () {
  // 단위 테스트 설정
  it('product test', function () {
    // console.log('product : ', product)
    // console.log('product : ', product.mutations.productInfo)
    assert.isNotNull(product.state)
    // product.mutations.productInfo(product.state, 'rrr')
    // assert.equal(process.env.VUE_APP_IS_SERVER_STATE, result)
  })

  describe('mutation ', function () {
    it('setProductInfo', function () {
      product.mutations.setProductInfo(product.state, 'productInfo')
    })
    it('setProduct', function () {
      product.mutations.setProduct(product.state, 'product')
    })
    it('setSelectedGiftList', function () {
      product.mutations.setSelectedGiftList(product.state, 'selectedGiftList')
    })
  })
})
