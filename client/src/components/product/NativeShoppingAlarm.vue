<template>
  <div />
</template>
<script>
import modalUtil from '@frameworks/modalUtil'
import {
  getImageUrl
} from '@utils/commonutil/commonUtil'

export default {
  props: {
    paramData: {
      type: Object,
      required: true
    }
  },
  created () {
    this.clickShoppingAlarm(this.paramData)
  },
  methods: {
    /**
     * 방송알림 버튼 클릭
     * @param {Number} info - 상품정보 (필수)
     * @returns {void}
     */
    clickShoppingAlarm (info) {
      let toggle = ''
      if (info.mediaType === 'shopplus') {
        toggle = 'active'
      }
      const registeredProductInfo = {
        partNumber: info.partNumber, // '26196200', // bundleGroup[0].partNumber,
        catentryId: info.catentryId, // '26196200', // bundleGroup[0].partNumber,
        productName: info.goodsName,
        isCtcomProduct: toggle === 'active', // 샵플러스 상품 여부 dalcom
        imageUrl: getImageUrl(info.partNumber, 88, 88, info.adultItemFlag)
      }
      const param = {
        globalVal: {
          productInfo: {
            ctcomTvList: [{
              pgmCd: toggle === 'active' ? info.pgmCD : ''
            }]
          }
        },
        registeredProductInfo
      }
      document.body.style = 'background-color: transparent;'
      modalUtil.show('product/ShoppingAlarmRegister', param, responseData => this.closeAlarmRegister(responseData))
    }
  }
}
</script>
