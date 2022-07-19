import loginUtil from '@utils/loginUtil'
import LOGIN_CONST from '@constants/customer/login'
// import messageUtil from '@frameworks/messageUtil'
import bizUtil from '@utils/bizUtil'
import COMM_CONST from '@constants/framework/constants'
import { PRODUCT_CONST } from '@/common/constants/product/product'
import nsaxios from '@/common/frameworks/axiosUtil'
/**
 * Home and LiveSectionAll Espot Mixin - 상담신청 or 상담하기 클릭시 기능 (간소화된 상품상세 API 콜.)
 */
const consultationMixin = {
  data () {
    return {
      globalVal: {},
      SERVICE_PRODs: { // 렌탈 또는 휴대폰 등의 서비스 상품 상담신청 페이지로 가기위한 params
        dispTypeCd: null,
        brandName: null,
        productName: null,
        modelName: null,
        productNo: null,
        imageUrl: null,
        partNumber: null,
        quantity: 1,
        offerPrice: 0,
        orderPrgrsTypeCd: null,
        addAddressFlag: 'N'
      }
    }
  },
  methods: {
    /**
     * 간소화된 상품상세 정보 조회.
     * @param {String} partnumber - 상품코드.
     * @returns {Promise}
     */
    callNSProductDetailCmd (partnumber) {
      this.globalVal.partNumber = partnumber
      const param = {
        // partnumber,
        partNumber: partnumber,
        cocd: COMM_CONST.getCocd(), // 외부유입경로 코드(제휴사코드)
        imgSizeType: PRODUCT_CONST.PRODUCT_DETAIL_IMAGE_SIZE
        // cmdType: 'PRD_CATE_ORD'
      }
      return new Promise(resolve => {
        const successHandling = response => {
          const info = response.msg.goods[0].info // 상품정보
          resolve(info)
        }
        const errorHandling = err => {
          console.log(err)
        }
        // nsaxios.post('NSProductDetailCmd', param, successHandling, errorHandling)
        nsaxios.post('DetailProductViewReal', param, successHandling, errorHandling)
      })
    },
    /**
     * Live 방송 상품인경우
     *
     * @returns Boolean
     */
    isTvLiveProduct () {
      return this.globalVal.productInfo.tvLiveCd === 'A'
    },
    /**
     * 상담신청 이동
     *
     */
    async moveConsultationRequest (partnumber) {
      const params = await this.setParams(partnumber)
      this.checkLoginStatus(params, true)
    },
    /**
     * 파라미터 세팅
     *
     * @returns {Object}
     */
    async setParams (partnumber) {
      const apiData = await this.callNSProductDetailCmd(partnumber)
      this.globalVal.productInfo = apiData
      const info = this.globalVal.productInfo
      const partNumber = this.globalVal.partNumber
      const {
        orderPrgrsTypeCd, goodsTypeCd, addAddressFlag, brandName, productName, modelName
        , costTypeCd, catentryId, dispTypeCd
      } = info
      const productNo = info.multiCd || partNumber

      let pgmcd = ''
      let brdctDate = ''
      let brdctCnnlCd = ''

      let imageUrl = ''
      if (info.photoList && info.photoList.length > 0) {
        imageUrl = info.photoList?.[0].photoPath
      }

      if (this.isTvLiveProduct()) {
        const items = info.tvList?.[0]
        pgmcd = items.pgmCd
        brdctCnnlCd = items.cnnlNumCd
        brdctDate = items.brdctDate
      }

      const itemNumber = this.getItem(this.globalVal.productInfo.optionList, partNumber)?.SKUs?.[0]?.uniqueID
      let offerPrice = 0
      if (dispTypeCd === '45' || dispTypeCd === '57') {
        offerPrice = info.mmRntalPrc
      } else {
        offerPrice = info.offerPrice
      }

      const params = {
        orderPrgrsTypeCd,
        brandName,
        productName,
        goodsTypeCd,
        addAddressFlag,
        productNo,
        imageUrl,
        pgmcd,
        modelName,
        brdctDate,
        brdctCnnlCd,
        costTypeCd,
        catentryId,
        itemNumber,
        dispTypeCd,
        offerPrice,
        partNumber
      }

      return Object.assign(this.SERVICE_PRODs, params)
    },
    /**
     * 로그인 체크
     * @param {Object} params api 호출 파라미터
     * @param {Boolean} isOnlyUser 비회원 구매가능 여부
     */
    checkLoginStatus (params, isOnlyUser) {
      const isLogon = loginUtil.checkLogonStatus()
      if (isOnlyUser === true && !isLogon) {
        bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER, 'orderConsultSheet', false, { invoke: params, isOnlyUser })
        // const alertMsg = '로그인이 필요한 상품입니다.'
        // messageUtil.alert(alertMsg, () => {
        //   bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER, null, false, { invoke: params, isOnlyUser })
        // })
        // this.$router.push(`/product/${params.partNumber}`)
      } else {
        bizUtil.gotoOrderConsult(params)
      }
    },
    /**
     * partNumber 일치하는 첫번째 아이템 반환
     * @param {Array} items 옵션목록
     * @param {String} partNumber
     * @returns {Object}
     */
    getItem (items, partNumber) {
      return (items && items.length > 0) ? items.find(item => partNumber === item.partNumber) : []
    }
  }
}

export default consultationMixin
