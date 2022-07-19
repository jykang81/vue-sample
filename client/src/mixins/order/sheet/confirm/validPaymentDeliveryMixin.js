import CONST from '@constants/framework/framework'
import messageUtil from '@frameworks/messageUtil'
import {
  isNull,
  insertSeparatorPhoneNumber,
  includeSpecialCharacter
} from '@utils/commonutil/commonUtil'
import uiUtil from '@utils/uiUtil'
import { PRODUCT_CONST } from '@/common/constants/product/product'

/**
 * ValidPaymentDeliveryMixin
 * onclick_btnPayment -> (ASIS) 배송지 입력 체크
 */
const validPaymentDeliveryMixin = {
  methods: {
    /**
     * 배송지 불가상품 검사
     * @returns {Boolean}
     */
    validNoneDeliveryProduct () {
      // 복수배송일 경우, 적용하지 않은 상품이 있는지 체크 ASIS -> TOBE: 복수배송지에서 체크됨
      // 중복 배송지(주소지 등록 된 배송지만...) 체크
      for (let i = 0; this.paymentData.Delivery.deliveryList.length > i; i++) {
        const strAdId = this.paymentData.Delivery.deliveryList[i].ADDRESS_ID
        for (let j = 0; this.paymentData.Delivery.deliveryList.length > j; j++) {
          const endAdId = this.paymentData.Delivery.deliveryList[j].ADDRESS_ID

          if (i !== j && strAdId === endAdId && !isNull(strAdId)) {
            messageUtil.alert('중복된 배송지가 있습니다.')
            this.globalVal.activeDoubleClick = false
            return false
          }
        }
      }

      return true
    },

    /**
     * 비회원 배송지 검사
     * @returns {Boolean}
     */
    validGuestDelivery () {
      if (this.globalVal.isGuest) {
        const data = this.globalVal.orderDeliveryInfo.deliveryInfo[0]
        const regPhone = /^01([0|1|6|7|8|9]?)([0-9]{3,4})([0-9]{4})$/

        if (isNull(data.recipientName)) {
          this.$root.$emit('blurRecipientNameEmit')
          uiUtil.scrollMove('guestDeliveryArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.globalVal.activeDoubleClick = false
          return false
        }

        if (isNull(data.phone11) &&
              isNull(data.phone12) &&
              isNull(data.phone13)) {
          this.$root.$emit('blurUpdateHpnoEmit')
          uiUtil.scrollMove('guestDeliveryArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.globalVal.activeDoubleClick = false
          return false
        }

        if (!regPhone.test(`${data.phone11}${data.phone12}${data.phone13}`)) {
          this.$root.$emit('blurUpdateHpnoEmit')
          uiUtil.scrollMove('guestDeliveryArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.globalVal.activeDoubleClick = false
          return false
        }

        if (isNull(data.addr) || isNull(data.addrDetail)) {
          this.globalVal.deliveryInfo.errorMessageAddress = true
          uiUtil.scrollMove('guestDeliveryArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          this.globalVal.activeDoubleClick = false
          return false
        } else {
          this.globalVal.deliveryInfo.errorMessageAddress = false
        }
      }

      return true
    },

    /**
     * 배송지 검사
     * @returns {Boolean}
     */
    validPaymentDelivery () {
      // 비회원 배송지 검사
      if (this.validGuestDelivery() === false) {
        return false
      }

      // 배송지 입력 체크
      const PHONE_TYPE = { MOBILE: 'K', PHONE: 'T' } //  (휴대폰: K, 일반전화: T)
      const REGISTER_TYPE = { NONE_MEMBER: 'G' }

      const dispTypeCdChoice = this.globalVal.mOutputDatas.msg.OrderGoodList.length === 1 &&
              (this.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_GIFTISHOW ||
                  this.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.MOBILE_GIFTCARD)
      const deliveryMaxIndex = this.globalVal.orderDeliveryInfo.deliveryInfo.length

      for (let i = 0; i < deliveryMaxIndex; i++) {
        const deliveryInfoItem = this.globalVal.orderDeliveryInfo.deliveryInfo[i]
        // 배송지명 필수입력 체크
        if (this.globalVal.isGuest) { // 비회원일 경우 배송지명이 비노출 이므로 주문하시는분 값을 세팅한다.
          deliveryInfoItem.addrAlias = this.globalVal.orderDeliveryInfo.iptOrdererName
        }

        if (isNull(deliveryInfoItem.zipCode)) {
          this.globalVal.activeDoubleClick = false
          this.globalVal.deliveryInfo.wrongMessage = '필수입력 사항입니다. 선택해 주세요.'
          uiUtil.scrollMove('select_delivery', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          return false
        }

        // 특수문자 체크: 수령장소
        if (includeSpecialCharacter(deliveryInfoItem.shippingMessage)) {
          this.globalVal.activeDoubleClick = false
          messageUtil.error(CONST.API_ERROR_MESSAGES[1].replace('{0}', '수령장소'), null)
          uiUtil.scrollMove('select_delivery', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          return false
        }

        let tempPhone21 = ''
        let tempPhone22 = ''
        let tempPhone23 = ''
        if (deliveryInfoItem.phone21 && deliveryInfoItem.phone22 && deliveryInfoItem.phone23) {
          tempPhone21 = deliveryInfoItem.phone21
          tempPhone22 = deliveryInfoItem.phone22
          tempPhone23 = deliveryInfoItem.phone23
        }

        // 폼 데이터에 반영
        this.paymentData.Delivery.setItem(i, {
          DESTINATION: (this.paymentData.Delivery.getItem(i).DESTINATION || ''),
          NICKNAME: deliveryInfoItem.addrAlias,
          RECIPIENT: (this.paymentData.Delivery.getItem(i).RECIPIENT || ''),
          LASTNAME: deliveryInfoItem.recipientName,
          DLVY_NICNAME: deliveryInfoItem.recipientName,
          DLVY_POSTCODE1: deliveryInfoItem.postcode,
          DLVY_POSTCODE2: deliveryInfoItem.postcode,
          DLVY_ADDRESS1: deliveryInfoItem.addr,
          DLVY_ADDRESS2: deliveryInfoItem.addrDetail,
          FAX1: deliveryInfoItem.addrFlag, // 우편번호 형식(100:지번, 200:도로명주소)
          ZIPCODE: deliveryInfoItem.postcode,
          ADDRESS1: deliveryInfoItem.addr,
          ADDRESS2: deliveryInfoItem.addrDetail,
          PHONE1TYPE: PHONE_TYPE.MOBILE,
          PHONE2TYPE: dispTypeCdChoice ? PHONE_TYPE.MOBILE : PHONE_TYPE.PHONE,
          PHONE1: insertSeparatorPhoneNumber(deliveryInfoItem.phone11 + deliveryInfoItem.phone12 + deliveryInfoItem.phone13, '-'),
          PHONE2: insertSeparatorPhoneNumber(tempPhone21 + tempPhone22 + tempPhone23, '-'),
          MOBILE_NO11: deliveryInfoItem.phone11,
          MOBILE_NO12: deliveryInfoItem.phone12,
          MOBILE_NO13: deliveryInfoItem.phone13,
          MOBILE_NO21: tempPhone21,
          MOBILE_NO22: tempPhone22,
          MOBILE_NO23: tempPhone23,
          DLVY_MESSAGE: dispTypeCdChoice ? '' : deliveryInfoItem.shippingMessage,
          ziptype: deliveryInfoItem.addrFlag, // 우편번호 형식(100:지번, 200:도로명주소),
          SEC_ZIPCODE: deliveryInfoItem.postcode,
          SEC_ADDRESS1: deliveryInfoItem.secAddress1, // 세컨드 기본주소(지번일경우 도로명, 도로명일경우 지번)
          SEC_ADDRESS2: deliveryInfoItem.secAddress2, // 세컨드 상세주소(지번일경우 도로명, 도로명일경우 지번)
          ADDINFO: deliveryInfoItem.ADDINFO || '',
          // 배송지선택 개편
          baseaddrI: deliveryInfoItem.ipDefaultDest ? 'Y' : 'N'
        })

        if (dispTypeCdChoice) { // 모바일 상품권, 기프티콘 주문
          this.paymentData.Delivery.setItem(i, {
            LASTNAME: deliveryInfoItem.recipientName,
            PHONE1: insertSeparatorPhoneNumber(deliveryInfoItem.phone21 + deliveryInfoItem.phone22 + deliveryInfoItem.phone23, '-'), // 받는 사람
            PHONE2: insertSeparatorPhoneNumber(deliveryInfoItem.phone21 + deliveryInfoItem.phone22 + deliveryInfoItem.phone23, '-'), // 받는 사람
            RECIPIENT: deliveryInfoItem.recipientName,
            GIFTSENDERPHONE: insertSeparatorPhoneNumber(deliveryInfoItem.phone11 + deliveryInfoItem.phone12 + deliveryInfoItem.phone13, '-'), // 보내시는분 전화
            MESSAGE_CARD: deliveryInfoItem.shippingMessage,
            ADDRESS_ID: '',
            NICKNAME: `${deliveryInfoItem.recipientName}_${this.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.ORDERS_ID}`,
            ZIPCODE: '000000',
            DLVY_ADDRESS1: '-',
            DLVY_ADDRESS2: '-',
            ADDRESS1: '-',
            ADDRESS2: '-',
            ziptype: '100',
            email: this.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.MOBILE_GIFTCARD && this.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.CARDSENDTYPE === '300' ? this.globalVal.deliveryInfo.receiptEmail : ''
          })
        }

        if (this.globalVal.isGuest && i === 0) { // 비회원
          this.paymentData.OrderUserInfo.setItem({
            FAX1: deliveryInfoItem.addrFlag // 우편번호 형식(100:지번, 200:도로명주소)
          })

          if (!dispTypeCdChoice) {
            this.paymentData.OrderUserInfo.setItem({
              DLVY_POSTCODE1: deliveryInfoItem.postcode,
              DLVY_POSTCODE2: deliveryInfoItem.postcode,

              FAX1: deliveryInfoItem.addrFlag, // 선택 주소 구분 - 지번:100, 도로명:200

              FAX2: deliveryInfoItem.postcode, // 도로명 우편번호
              ADDRESS1: `${deliveryInfoItem.secAddress1}&:${deliveryInfoItem.secAddress2}`, // 도로명 기본 + &: + 상세
              ADDRESS11: deliveryInfoItem.secAddress1, // 도로명 기본주소
              ADDRESS12: deliveryInfoItem.secAddress2, // 도로명 상세주소
              BUSINESSTITLE: deliveryInfoItem.addrAlias, // 도로명 참고주소

              ZIPCODE: deliveryInfoItem.postcode, // 지번 우편주소
              ADDRESS2: deliveryInfoItem.addr, // 지번 기본주소
              ADDRESS3: deliveryInfoItem.addrDetail, // 지번 상세주소

              REGISTERTYPE: REGISTER_TYPE.NONE_MEMBER, // 비회원 하드코딩
              ADDINFO: deliveryInfoItem.ADDINFO || ''

            })
          }
        }
      }

      // 배송지선택 개편 START
      // - 기본배송지 없는 사용자가 화면에서 기본배송지 check가 없는 경우 강제로 첫번째 배송지를 기본 배송지로 설정해준다.
      let nBaseAddr = 0
      if (this.globalVal.mOutputDatas.msg.AddressList === null ||
            this.globalVal.mOutputDatas.msg.AddressList.length === 0) {
        for (let i = 0; i < this.paymentData.Delivery.deliveryList.length; i++) {
          const baseAddr = this.paymentData.Delivery.deliveryList[i].baseaddrI
          if (baseAddr === 'Y') {
            nBaseAddr++
            break
          }
        }

        if (nBaseAddr === 0) {
          this.paymentData.Delivery.setItem(0, {
            baseaddrI: 'Y'
          })
        }
      } // 배송지선택 개편 END

      return true
    }
  }
}
export default validPaymentDeliveryMixin
