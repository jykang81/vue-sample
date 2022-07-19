import {
  isOsApp
} from '@utils/commonutil/commonUtil'
import nativeUtil from '@/common/frameworks/nativeUtil'
import router from '@/router'

/**
 * 바로구매 Mixin
 */
const rightOrderMixin = {
  data () {
    return {
      globalVal: {
        partNumber: '',
        getProductInfoFlag: true
      },
      anchorLayer: false, // 바로 구매 레이어 표시 여부
      finishedSetParamFlag: false
    }
  },
  methods: {
    /**
     * 바로구매 버튼 클릭 이벤트
     * @param {String} partNumber - 상품번호
     * @returns {void}
     */
    onClickRightOrderBtn (partNumber) {
      this.globalVal.partNumber = partNumber
      this.finishedSetParamFlag = true
      this.$nextTick(function () {
        this.rightOrderLayerOpen()
      })
    },
    /**
     * 바로구매 열기 메소드
     * @returns {void}
     */
    rightOrderLayerOpen () {
      this.anchorLayer = true
      if (isOsApp()) { // APP
        nativeUtil.setRoutePath('/popup')
      }
    },
    /**
     * 바로구매 닫기 메소드
     * @returns {void}
     */
    rightOrderLayerClose () {
      this.anchorLayer = false
      this.finishedSetParamFlag = false
      if (isOsApp()) { // APP
        nativeUtil.setRoutePath(router.history.current.path)
      }
    }
  }
}

export default rightOrderMixin
