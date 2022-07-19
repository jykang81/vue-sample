
import nsaxios from '@frameworks/axiosUtil'

const doShippingChargeCmdMixin = {
  methods: {
    /**
     * 배송비 계산
     * @param {object} param - 주문내역 object
     * @param {function} callback - callback 함수
     * @returns {void}
     */
    doShippingChargeCmd (param, callback) {
      nsaxios.post('NSShippingChargeCmd', { sandItemInfo: JSON.stringify(param) }, callback)
      // 배송비 계산할 때 복수상품 계산을 위한 순번 초기화
      this.globalVal.deliveryInfo.deliveryStatusIdx = 0
    }
  }
}
export default doShippingChargeCmdMixin
