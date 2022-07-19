import CONST from '@/common/constants/framework/framework'
import axiosUtil from '@frameworks/axiosUtil'
import getNowDate from '@frameworks/dateutil/getNowDate'
import cipherUtil from '@frameworks/cipherUtil'

export default {
  /**
   * 주문 배송 조회 V1
   * @param {Object} dlvrEntCd - 택배사코드
   * @param {Object} wblNum - 운송장번호
   * @returns {Promise}
   */
  fetchOrderDeliveryTrackingV1 (dlvrEntCd, wblNum) {
    const auth = cipherUtil.encryptValue(`${CONST.DELIVERY_SECRET_TOKEN}${getNowDate()}`)
    return axiosUtil.request({
      method: 'get',
      url: `${CONST.NSMALL_API_HOST}/order-delivery-tracking/v1/${dlvrEntCd}/${wblNum}`,
      headers: {
        Authorization: auth
      }
    })
  }
}
