<template>
  <div class="order_consult_sheet">
    <!-- 신청자 정보 -->
    <order-consult-sheet-customer
      v-if="isLoadChildComponent"
      :global-val="globalVal"
    />
    <!-- 이용자 정보 -->
    <order-consult-sheet-user
      v-if="isLoadChildComponent"
      :global-val="globalVal"
    />
    <!-- 신청상품 -->
    <order-consult-sheet-product
      v-if="isLoadChildComponent"
      :global-val="globalVal"
    />
    <!-- 신청하기 -->
    <order-consult-sheet-confirm
      v-if="isLoadChildComponent"
      :global-val="globalVal"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import bizUtil from '@utils/bizUtil'
import {
  isOsApp,
  isNull,
  extend
} from '@utils/commonutil/commonUtil'
import routerUtil from '@frameworks/routerUtil'
import COMM_CONST from '@/common/constants/framework/constants'
import { PRODUCT_CONST } from '@/common/constants/product/product'
// import nativeUtil from '@/common/frameworks/nativeUtil'

import OrderConsultSheetCustomer from '@/views/order/consult/OrderConsultSheetCustomer'
import OrderConsultSheetUser from '@/views/order/consult/OrderConsultSheetUser'
import OrderConsultSheetProduct from '@/views/order/consult/OrderConsultSheetProduct'
import OrderConsultSheetConfirm from '@/views/order/consult/OrderConsultSheetConfirm'
import orderConsultSheetService from '@services/order/consult/orderConsultSheetService'
import productDetailService from '@services/product/productDetailService'

export default {
  components: {
    OrderConsultSheetCustomer,
    OrderConsultSheetUser,
    OrderConsultSheetProduct,
    OrderConsultSheetConfirm
  },
  data () {
    return {
      isLoadChildComponent: false,
      globalVal: {
        mInputParams: null, // (ASIS: SERVICE_PRODs)
        memberInfo: {
          isUserAuthInfoShow: false,
          isUserHpnoErrorShow: false,
          isConfirmUserAuthInfoShow: false
        },
        deliveryInfo: null, // (ASIS: ADDRESS_INFO)
        logDatas: {},
        userInfo: {
          userName: '',
          addressId: '',
          isPrimary: false,
          zipCode: '',
          addrFlag: '',
          fullAddress: '',
          addr: '',
          addrDetail: '',
          showNonDelivery: false,
          showDeliveryBasicIcon: false, // 기본 배송지
          showDeliverySafeIcon: false, // 안심 택배함
          checkedCallDate: 'Y', // 날짜 지정안함 (ASIS: 40)
          selectTime: '30',
          phoneNo: '',
          callDay: '',
          showWrongDelivery: false,
          showWrongPhoneNo: false,
          textWrongPhoneNo: '',
          showWrongCallDate: false,

          deliveryLabelText: '배송지',
          showDeliveryArea: true,
          phoneLabelText: '휴대폰',
          showCallDateArea: true,
          showInputUserName: false,
          showWrongUserName: false
        },
        confirm: {
          showConsultGuide: true,
          textAgreeForce: '',
          textAgreeForce1: '고객님의 성명과 연락처 정보가 상담, 사은품 배송, CS 등의 목적을 위하여 해당 협력업체에게 제공되고 90일 또는 법적 의무기간까지 보관되는 것에 동의합니다.',
          textAgreeForce2: '고객님의 성명과 연락처 정보가 상담, 사은품 배송, CS 등의 목적을 위하여 해당 협력업체에게 제공되고 법적 의무기간까지 보관되는 것에 동의합니다.',
          textAgreeForce3: '고객님의 성명과 연락처, 주소 정보가 상담, 사은품 배송, CS 등의 목적을 위하여 해당 협력업체에게 제공되고 90일 또는 법적 의무기간까지 보관되는것에 동의합니다.'
        }
      },
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
  computed: {
    ...mapState('orderSheet', ['orderSheetInfo', 'orderProduct'])
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      await bizUtil.secessionMemberCheker()

      if (isOsApp() && !isNull(this.$route.params.number)) { // APP
        const partnumber = this.$route.params.number
        this.globalVal.partNumber = partnumber
        const successHandling = result => {
          this.globalVal.mInputParams = this.setParams(result.msg.goods[0].info)
          this.initSub()
        }
        productDetailService.getProductDetail(this.productDetailParams(), successHandling)
      } else {
        this.globalVal.mInputParams = this.orderProduct
        this.initSub()
      }
    },
    initSub () {
      if (isNull(this.globalVal.mInputParams) || isNull(this.globalVal.mInputParams.productNo)) {
        bizUtil.gotoMain()
        return false
      }
      if (!isNull(this.globalVal.mInputParams.catalogId)) {
        this.globalVal.logDatas.catalogId = this.globalVal.mInputParams.catalogId // 사이트 직속 몰: 대분류
      }

      if (!isNull(this.globalVal.mInputParams.categoryId)) {
        this.globalVal.logDatas.categoryId = this.globalVal.mInputParams.categoryId // 몰 하위 매장: 소분류
      }

      if (!isNull(this.globalVal.mInputParams.catentryId)) {
        this.globalVal.logDatas.catentryId = this.globalVal.mInputParams.catentryId // 개별 상품
      }

      if (!isNull(this.globalVal.mInputParams.catgroupId)) {
        this.globalVal.logDatas.catgroupId = this.globalVal.mInputParams.catgroupId
      }

      if (this.globalVal.mInputParams.orderPrgrsTypeCd === '800') { // 방송소개상품
        this.globalVal.userInfo.phoneLabelText = '휴대폰' // 보임: 이름, 휴대폰(--> 연락처)
        this.globalVal.userInfo.showCallDateArea = false // 숨김: 상담 요청일 관련
        this.globalVal.userInfo.showInputUserName = true // 이용자 정보 이름입력

        if (this.globalVal.mInputParams.addAddressFlag && this.globalVal.mInputParams.addAddressFlag === 'Y') {
          this.globalVal.userInfo.deliveryLabelText = '배송지' // 보임: 배송지(--> 주소)
          this.globalVal.confirm.textAgreeForce = this.globalVal.confirm.textAgreeForce3 // 보임: 동의항목 (chkAgreeForce3)
        } else {
          this.globalVal.userInfo.showDeliveryArea = false // 숨김: 배송지(주소)
          this.globalVal.confirm.textAgreeForce = this.globalVal.confirm.textAgreeForce1 // 보임: 동의항목 (chkAgreeForce1)
        }
      } else {
        this.globalVal.confirm.textAgreeForce = this.globalVal.confirm.textAgreeForce2 // 보임: 동의항목 (chkAgreeForce2)
      }

      // 핸드폰일 경우 안내문구 변경
      if (this.globalVal.mInputParams.dispTypeCd === '57') {
        this.globalVal.confirm.showConsultGuide = false // 핸드폰 안내
      }

      this.getCustomer()
    },
    /**
     * 고객정보 가져오기 (ASIS: getUserInfo, setUserInfo)
     * @returns {Object}
     */
    getCustomer () {
      orderConsultSheetService.getCustomer({ cmdType: 14 }, data => {
        if (isNull(data) || isNull(data.memberInfo) || isNull(data.memberInfo.phone)) {
          routerUtil.back()
          return false
        }

        this.globalVal.memberInfo = extend(true, {}, this.globalVal.memberInfo, data.memberInfo)
        this.getShippingAddress()
      })
    },
    /**
     * 배송지정보 가져오기 (ASIS: getShippingAddress, setShippingAddressList)
     * @returns {Object}
     */
    getShippingAddress () {
      // vdn_cd (모바일 주문 접수 응대 번호) 데이터 다음 API 호출 시 추가
      const vdnCd = isOsApp() ? '54101' : '54102'
      orderConsultSheetService.getShippingAddress({ cmdType: 6, vdn_cd: vdnCd }, data => {
        if (isNull(data) || isNull(data.jsonData) ||
               isNull(data.jsonData.addressList) || data.jsonData.addressList.length === 0) {
          this.globalVal.deliveryInfo = []
        } else {
          this.globalVal.deliveryInfo = data.jsonData.addressList
        }

        this.isLoadChildComponent = true
      })
    },
    /**
     * 상품상세정보조회 API 호출을 위한 파라미터
     * @returns {Object}
     */
    productDetailParams () {
      return {
        partNumber: this.$route.params.number,
        cocd: COMM_CONST.getCocd(), // 외부유입경로 코드(제휴사코드)
        imgSizeType: PRODUCT_CONST.PRODUCT_DETAIL_IMAGE_SIZE
      }
    },
    /**
     * 파라미터 세팅
     * @param {Object}
     * @returns {Object}
     */
    setParams (apiData) {
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
      // Live 방송 상품인경우
      if (info.tvLiveCd === 'A') {
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
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/consult/OrderConsultSheet";
</style>
