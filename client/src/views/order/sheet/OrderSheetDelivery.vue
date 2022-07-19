<template>
  <div class="order_sheet_delivery">
    <h3 id="select_delivery" :class="globalVal.deliveryInfo.deliveryClass">
      배송지
      <!-- 여러 곳으로 배송 받기 -->
      <label v-show="isManyDeliveryShow">
        <input
          v-model="multiDeliveryChecked"
          type="checkbox"
          class="checkbox square"
          @change="changeManyDeliveryCheckBox()"
        >
        <span class="check_label">여러 곳으로 배송 받기</span>
      </label>
    </h3>
    <!-- 배송주소 -->
    <div class="delivery_point" @click="clickAddressBookLink()">
      <div v-show="globalVal.deliveryInfo.isMultiDeliveryShow">
        <p class="name">
          총 {{ multiDeliveryCount }}개의 배송지가 선택되어 있습니다.
        </p>
      </div>
      <!-- 조회 시 배송지 기본 설정 -->
      <div v-show="globalVal.deliveryInfo.isBasicDeliveryShow">
        <p class="name">
          {{ globalVal.deliveryInfo.recipientName }}
          <span v-show="globalVal.deliveryInfo.isDeliveryBasicIconShow" class="coral">기본 배송지</span>
          <!-- 추후 최근 배송지 개발 <span v-show="isDeliveryLatestIconShow" class="mint">최근 배송지</span> -->
          <span v-show="globalVal.deliveryInfo.isDeliverySafeIconShow" class="blue">안심 택배함</span>
        </p>
        <div class="address">
          {{ globalVal.deliveryInfo.addr }} {{ globalVal.deliveryInfo.addrDetail }}
        </div>
        <p class="phone">
          휴대폰: {{ globalVal.deliveryInfo.phone11 }}-{{ globalVal.deliveryInfo.phone12 }}-{{ globalVal.deliveryInfo.phone13 }}
        </p>
      </div>
      <div v-show="globalVal.deliveryInfo.isNonDeliveryShow">
        <p class="name">
          배송지를 입력해 주세요.
        </p>
        <p v-show="globalVal.deliveryInfo.wrongMessage !== ''" class="wrong">
          {{ globalVal.deliveryInfo.wrongMessage }}
        </p>
      </div>
    </div>
    <div v-show="isMultiShippingSafeMsgShow">
      <!-- 안심 택배함 -->
      <p class="delivery_box" :style="globalVal.deliveryInfo.checkFlag === 1 ? '' : 'display:none;'">
        <button type="button" @click="clickSafeDeliveryLink()">
          안심 택배함으로 받기
        </button>
      </p>
      <!-- 메세지 -->
      <label class="select">
        <select
          v-model="shippingMessageSelected"
          @change="changeShippingMsg()"
        >
          <option value="">
            수령장소를 선택해 주세요.
          </option>
          <option value="문앞">
            문앞
          </option>
          <option value="경비실">
            경비실
          </option>
          <option value="직접수령, 부재 시 경비실">
            직접수령, 부재 시 경비실
          </option>
          <option value="택배함">
            택배함
          </option>
          <option
            v-for="(custDeliveryMsg, msgIdx) in custDeliveryMsgList"
            :key="msgIdx"
            :value="custDeliveryMsg.value"
          >
            {{ custDeliveryMsg.text }}
          </option>
          <option value="직접입력(20자 이내)">
            직접입력(20자 이내)
          </option>
        </select>
      </label>
      <!-- 셀렉트 박스 직접 입력(20자 이내) 선택시 노출 -->
      <span v-show="isShippingMessageShow" class="input_group">
        <label>
          <input
            :value="shippingMessage"
            type="text"
            title="직접입력(20자 이내)"
            class="form text"
            placeholder="직접입력(20자 이내)"
            @input="shippingMessage = $event.target.value"
            @keyup.stop="keyupShippingMessage()"
          >
        </label>
      </span>
    </div>
  </div>
</template>

<script>
import { PRODUCT_CONST } from '@/common/constants/product/product'
import {
  getStepNumberString,
  htmlDecode,
  getPhoneNumber,
  isNull,
  getCutBytes,
  getBytes,
  extend
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import popupUtil from '@frameworks/popupUtil'
import messageUtil from '@frameworks/messageUtil'
import shippingChargeMixin from '@/mixins/order/sheet/delivery/shippingChargeMixin'
import doShippingChargeCmdMixin from '@/mixins/order/sheet/delivery/doShippingChargeCmdMixin'
import finalPaymentAmountMixin from '@/mixins/order/sheet/finalPaymentAmountMixin'
import orderSheetDeliveryService from '@services/order/sheet/orderSheetDeliveryService'
import bizUtil from '@utils/bizUtil'

export default {
  mixins: [
    shippingChargeMixin,
    doShippingChargeCmdMixin,
    finalPaymentAmountMixin
  ],
  props: {
    paymentData: {
      type: Object,
      required: true
    },
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isManyDeliveryShow: true, // 여러곳으로 배송 받기 체크박스
      isDeliveryLatestIconShow: false, // 최근 배송지 아이콘
      shippingMessageSelected: '', // 배송메세지
      custDeliveryMsgList: [], // 배송메세지 리스트
      isShippingMessageShow: false, // 배송메세지
      shippingMessage: '', // 배송메세지
      custDeliveryMsgCallbackData: [],
      isShippingMessage: false,
      multiDeliveryChecked: false, // 여러곳으로 배송 받기 체크박스
      multiDeliveryCount: 0,
      isMultiDeliveryShow: false,
      isNonDeliveryShow: false,
      isBasicDeliveryShow: false,
      tmpBDeliveryYn: '',
      isMultiShippingSafeMsgShow: true
    }
  },
  mounted () {
    this.init()
    this.globalVal.completeOrderSheetDelivery = true
  },
  methods: {
    init () {
      this.setOrderDeliveryArea(this.globalVal.mOutputDatas.msg.OrderGoodList)

      let strDispTypeCd = ''
      if (this.globalVal.mOutputDatas.msg.OrderGoodList.length === 1 &&
        (this.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_GIFTISHOW ||
          this.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.MOBILE_GIFTCARD)) {
        strDispTypeCd = this.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD
      }
      let deliveryMsg = null
      if (undefined === this.globalVal.mOutputDatas.msg.deliveryMsg) {
        deliveryMsg = false
      } else {
        deliveryMsg = this.globalVal.mOutputDatas.msg.deliveryMsg
        this.globalVal.deliveryInfo.vDeliveryMsg = this.globalVal.mOutputDatas.msg.deliveryMsg
      }
      if (this.globalVal.mOutputDatas.msg.OrderGoodList.length === 1 && (strDispTypeCd === '50' || strDispTypeCd === '55')) {
        this.setAddressList(deliveryMsg, this.globalVal.mOutputDatas.msg.SelfAddressList, strDispTypeCd, this.globalVal.mOutputDatas.msg.OrderGoodList[0]) // 배송지 입력
      } else {
        this.setAddressList(deliveryMsg, this.globalVal.mOutputDatas.msg.AddressList, strDispTypeCd) // 배송지 입력
      }

      this.clickGetCustDeliveryMsg()
    },
    /**
     * 배송지 영역 출력
     * @param {Object} data - 배송정보 object
     */
    setOrderDeliveryArea (data) {
      for (let index = 0; index < data.length; index++) {
        // 안심택배
        this.globalVal.deliveryInfo.safeCount += data[index].goodsDetail.relaxGb
        let checkSafeFlag = ''
        checkSafeFlag = data[index].goodsDetail.relaxGb

        if (this.globalVal.deliveryInfo.safeCount.indexOf('N') === -1) {
          this.globalVal.deliveryInfo.checkFlag = 1
        } else {
          this.globalVal.deliveryInfo.checkFlag = null
        }
        if (checkSafeFlag === undefined) {
          this.globalVal.deliveryInfo.checkFlag = null
        }

        // 배송일지정
        this.globalVal.productInfo.deliveryDesignatedDayCount += data[index].goodsDetail.SLCT_DAY_OBJT_GOODS_YN
        this.globalVal.productInfo.deliveryAagreeDline.push(data[index].goodsDetail.AGREE_DLINE)

        for (let i = 0; i < this.globalVal.productInfo.deliveryAagreeDline.length; i++) {
          if (this.globalVal.productInfo.deliveryAagreeDline[i] <= 2) {
            this.globalVal.productInfo.deliveryAagreeStatus = 'Y'
          } else {
            this.globalVal.productInfo.deliveryAagreeStatus = 'N'
            break
          }
        }

        if (this.globalVal.productInfo.deliveryDesignatedDayCount.indexOf('N') === -1 && this.globalVal.productInfo.deliveryAagreeStatus === 'Y') {
          this.globalVal.productInfo.deliveryDesignatedDayFlag = 'Y'
        } else {
          this.globalVal.productInfo.deliveryDesignatedDayFlag = 'N'
        }

        if (this.globalVal.productInfo.deliveryDesignatedDayFlag === 'Y' && this.globalVal.productInfo.deliveryAagreeStatus === 'Y') {
          this.isManyDeliveryShow = false // 여러곳으로 배송 받기 체크박스 숨김
        } else {
          if (this.globalVal.productInfo.deliveryIndexSelectHideStatus === 'Y') {
            this.isManyDeliveryShow = true // 조건에 의해 여러곳으로 배송 받기 체크박스 숨겨졌을 경우에 다시 보여준다.
          }
        }

        // 복수배송지 불가 - Start
        this.globalVal.deliveryInfo.multiDelvVal[this.globalVal.deliveryInfo.multiDelvIdx] = data[index].itemDetailInfo.excptYn
        this.globalVal.deliveryInfo.multiDelvIdx = this.globalVal.deliveryInfo.multiDelvIdx + 1
        // 복수배송지 불가 - End

        // 정기배송은 배송횟수만큼 곱하여 계산함.
        if (data[index].goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.DELIVERY &&
            data[index].goodsDetail.PAY_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.GENERAL_NO_SINGLE) {
          data[index].goodsDetail.QUANTITY = Number(data[index].goodsDetail.QUANTITY) * Number(data[index].goodsDetail.CNVEY_NUM)
        }
      }
    },
    /**
     * 배송지정보 출력
     * @param {String} info - 배송메세지
     * @param {Object} data - 배송정보 object
     * @param {String} strDispTypeCd - 상품타입
     * @param {Object} orderGood - 상품 object
     */
    setAddressList (info, data, strDispTypeCd, orderGood) {
      let baseAddressLine = null

      // 코드가 50(기프티콘), 55(모바일상품권)일 경우 별도 변수에 담는다.
      const strDispTypeCdChoice = strDispTypeCd === '50' || strDispTypeCd === '55' ? strDispTypeCd : ''
      // 코드가 50(기프티콘), 55(모바일상품권)일 경우 true
      const bDispTypeCdChoice = strDispTypeCdChoice !== ''

      // 복수배송 select 출력
      if (this.globalVal.mOutputDatas.TOTAL_ITEM_COUNT > 1 && !this.globalVal.isGuest) { // 비회원이 아니면서, 상품 갯수가 1개 이상일 경우
        // 복수배송지 불가 - Start
        let tmpMultiValFlag = 'N'
        if (this.globalVal.deliveryInfo.multiDelvIdx > 1) {
          for (let len = 0; len < this.globalVal.deliveryInfo.multiDelvIdx; len++) {
            if (this.globalVal.deliveryInfo.multiDelvVal[len] === 'Y') {
              tmpMultiValFlag = 'Y'
              break
            }
          }
        } else {
          tmpMultiValFlag = this.globalVal.deliveryInfo.multiDelvVal[0]
        }

        if (tmpMultiValFlag === 'Y') {
          this.isManyDeliveryShow = false // 여러곳으로 배송 받기 체크박스
        } else {
          // 복수배송지 불가 - End
          if (bDispTypeCdChoice) {
            this.isManyDeliveryShow = false // 여러곳으로 배송 받기 체크박스
          }
        }// 복수배송지 불가
      } else {
        this.isManyDeliveryShow = false // 여러곳으로 배송 받기 체크박스
      }

      if (data && data.length > 0) {
        // 기본배송지 확인
        baseAddressLine = data[0]
        for (let i = 0; i < data.length; i++) {
          if (data[i].ISPRIMARY === '1') {
            baseAddressLine = data[i]
            this.globalVal.deliveryInfo.isDeliveryBasicIconShow = true
            break
          }
        }
      } else {
        this.globalVal.deliveryInfo.isMultiDeliveryShow = false // 여러곳으로 배송받기 선택한 경우 배송지 조회
        this.globalVal.deliveryInfo.isBasicDeliveryShow = false // 기본 배송지 조회
        this.globalVal.deliveryInfo.isNonDeliveryShow = true // 배송지 미등록인 경우
      }

      // 첫번째 배송지 영역 출력
      // 기본적으로 첫번째 배송지에 배송아이템 모두 추가
      this.paymentData.Delivery.setItem(0, {
        DELIVERY_SEQ_NM: `${getStepNumberString(0)}번째`
      })

      // 배송지선택 개편 시작
      if (baseAddressLine !== null) {
        this.setBaseAddressLine(baseAddressLine, 0)
      } // 배송지선택 개편 종료

      /* 기프티콘, 상품권 추후 구현
      if (bDispTypeCdChoice) {
        this.globalVal.deliveryInfo.recipientName = this.globalVal.mOutputDatas.msg.UserInfo.LASTNAME
        this.globalVal.deliveryInfo.phone11 = getPhoneNumber(this.globalVal.mOutputDatas.msg.UserInfo.PHONE1, '1')
        this.globalVal.deliveryInfo.phone12 = getPhoneNumber(this.globalVal.mOutputDatas.msg.UserInfo.PHONE1, '2')
        this.globalVal.deliveryInfo.phone13 = getPhoneNumber(this.globalVal.mOutputDatas.msg.UserInfo.PHONE1, '3')

        if (strDispTypeCdChoice === '55') {
          this.receiptEmailReadonly = true
          this.shippingMessageReadonly = true

          this.receiptEmail = orderGood.goodsDetail.ITEM_RECEIVER_EMAIL
          this.shippingMessage = orderGood.goodsDetail.CARDMESSAGE
        }
      }
      */
    },
    /**
     * 기본배송지 출력
     * @param {Object} data - 배송정보 object
     * @param {Number} index - 배송지 index
     */
    setBaseAddressLine (data, index) {
      this.globalVal.deliveryInfo.checkSafeGuest = null

      // 주소 및 우편번호 분리
      if (data.ADDRESS1.trim().length > 0) {
        const strAddr1 = htmlDecode(data.MOBILE_ADDRESS1)
        if (strAddr1.indexOf('&:') > -1) {
          const arrAddr = strAddr1.split('&:')
          data.ADDRESS2 = arrAddr[0]
          data.ADDRESS3 = arrAddr[1]
        } else {
          data.ADDRESS2 = data.MOBILE_ADDRESS1
          data.ADDRESS3 = ''
        }
      } else {
        data.ZIPCODE = (data.FAX2 || data.ZIPCODE)
      }

      this.globalVal.deliveryInfo.recipientName = (`${data.LASTNAME} ${data.FIRSTNAME}`).trim() // 배송지명
      this.globalVal.deliveryInfo.zipCode = data.ZIPCODE
      this.globalVal.deliveryInfo.addrId = data.ADDRESS_ID
      this.globalVal.deliveryInfo.addr = data.ADDRESS2.trim() // 배송지 주소
      this.globalVal.deliveryInfo.addrDetail = data.ADDRESS3.trim() // 배송지 상세주소
      this.globalVal.deliveryInfo.phone11 = getPhoneNumber(data.PHONE1.trim(), '1') // 배송지 휴대폰번호1
      this.globalVal.deliveryInfo.phone12 = getPhoneNumber(data.PHONE1.trim(), '2') // 배송지 휴대폰번호2
      this.globalVal.deliveryInfo.phone13 = getPhoneNumber(data.PHONE1.trim(), '3') // 배송지 휴대폰번호3

      if (!this.globalVal.deliveryInfo.isDeliveryBasicIconShow) {
        this.isDeliveryLatestIconShow = true // 최근 배송지 아이콘
      } else {
        this.isDeliveryLatestIconShow = false // 최근 배송지 아이콘
      }
      if (this.globalVal.deliveryInfo.addrDetail.substr(this.globalVal.deliveryInfo.addrDetail.length - 5, 4) === '무인택배') {
        this.globalVal.deliveryInfo.isDeliverySafeIconShow = true
        this.globalVal.deliveryInfo.addInfo = 'X'
        this.globalVal.deliveryInfo.shippingMessage = '무인택배함 보관'
      } else {
        this.globalVal.deliveryInfo.isDeliverySafeIconShow = false
      }

      // 폼 데이터에 반영
      this.paymentData.Delivery.setItem(index, {
        ADDRESS_ID: data.ADDRESS_ID
      })

      this.setOrderDeliveryInfo()
    },
    /**
     * 배송주소 클릭 시
     */
    async clickAddressBookLink () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      if (this.globalVal.deliveryInfo.isMultiDeliveryShow) {
        const param = {
          title: '복수배송지',
          titleAlign: 'center', // 팝업 상단 타이틀 메세지 정렬 - 없으면 왼쪽 정렬
          isShowSearch: false, // 검색메뉴 안보임
          isShowCart: false, // 장바구니메뉴 안보임
          globalVal: this.globalVal,
          paymentData: this.paymentData,
          resultMulti: this.globalVal.deliveryInfo.resultMulti
        }

        const callback = result => {
          if (!isNull(result)) {
            this.isMultiShippingSafeMsgShow = false

            this.globalVal.deliveryInfo.resultMulti = result

            this.globalVal.deliveryInfo.sumShipCharge = result[0].sumShipCharge
            this.globalVal.deliveryInfo.rmaShipCharge = result[0].sumRmaShipCharge

            this.globalVal.mOutputDatas.orderPrice.SHIP_CHARGE = Number(this.globalVal.deliveryInfo.sumShipCharge)
            this.globalVal.mOutputDatas.orderPrice.RMA_SHIP_CHARGE = this.globalVal.deliveryInfo.rmaShipCharge

            // 최종 합산 배송비 적재
            this.paymentData.Payment.setItem(0, {
              SHIP_CHARGE: Number(this.globalVal.deliveryInfo.sumShipCharge), // + Number(this.globalVal.deliveryInfo.rmaShipCharge),
              RMA_SHIP_CHARGE: this.globalVal.deliveryInfo.rmaShipCharge,
              SHIP_CHARGE_ONE_DELIVERY: Number(this.globalVal.deliveryInfo.sumShipCharge) + Number(this.globalVal.deliveryInfo.rmaShipCharge),
              SHIP_CHARGE_MULTI_DELIVERY: Number(this.globalVal.deliveryInfo.sumShipCharge) + Number(this.globalVal.deliveryInfo.rmaShipCharge)
            })

            // 총결제금액 다시 출력
            this.setFinalPaymentAmount()

            this.globalVal.deliveryInfo.isMultiDeliveryShow = true
            this.globalVal.deliveryInfo.isBasicDeliveryShow = false
            this.globalVal.deliveryInfo.isNonDeliveryShow = false

            this.multiDeliveryCount = result.length

            for (let i = 0; i < result.length; i++) {
              this.globalVal.orderDeliveryInfo.deliveryInfo[i] = {
                iptOrdererHpNo1: '', // 주문하시는분 휴대폰1
                iptOrdererHpNo2: '', // 주문하시는분 휴대폰2
                iptOrdererHpNo3: '', // 주문하시는분 휴대폰3
                iptOrdererEmail: '', // 주문하시는분 이메일
                addrAlias: result[i].recipientName, // 배송지명
                recipientName: result[i].recipientName, // 받으시는분
                phone11: result[i].phone11, // 받으시는분 휴대폰1
                phone12: result[i].phone12, // 받으시는분 휴대폰2
                phone13: result[i].phone13, // 받으시는분 휴대폰3
                phone21: '', // 추가연락처 1
                phone22: '', // 추가연락처 2
                phone23: '', // 추가연락처 3
                zipCode: result[i].zipCode, // 우편번호
                postcode: result[i].zipCode, // 우편번호
                addrFlag: result[i].addrFlag, // 주소타입(100: 지번주소, 200: 도로명주소)
                addr: result[i].addr, // 주소
                addrDetail: result[i].addrDetail, // 상세주소
                secAddress1: result[i].secAddress1, // 세컨드 기본주소(지번일경우 도로명, 도로명일경우 지번)
                secAddress2: result[i].secAddress2, // 세컨드 상세주소(지번일경우 도로명, 도로명일경우 지번)
                ipDefaultDest: '', // 기본배송지로 설정 여부
                selShippingAddress: '', // 배송지선택
                shippingMessage: result[i].shippingMessage, // 배송메세지
                ADDINFO: '' // 안심택배 최근배송지 falg
              }
            }
          }
        }

        popupUtil.show('order/sheet/OrderSheetAddressMulti', param, callback)
      } else {
        this.isMultiShippingSafeMsgShow = true

        this.tmpBDeliveryYn = this.globalVal.deliveryInfo.bDeliveryYn
        this.globalVal.deliveryInfo.checkSafeGuest = null

        const ordAddr = {
          addrId: this.globalVal.deliveryInfo.addrId,
          zipCode: this.globalVal.deliveryInfo.zipCode,
          addr: this.globalVal.deliveryInfo.addr,
          addrDetail: this.globalVal.deliveryInfo.addrDetail,
          recipientName: this.globalVal.deliveryInfo.recipientName,
          phone: `${this.globalVal.deliveryInfo.phone11}-${this.globalVal.deliveryInfo.phone12}-${this.globalVal.deliveryInfo.phone13}`
        }

        const param = {
          title: '배송지 선택',
          titleAlign: 'center', // 팝업 상단 타이틀 메세지 정렬 - 없으면 왼쪽 정렬
          isShowSearch: false, // 검색메뉴 안보임
          isShowCart: false, // 장바구니메뉴 안보임
          globalVal: this.globalVal,
          paymentData: this.paymentData,
          ordAddr,
          multiYn: 'N',
          multiIdx: 0,
          chargeItems: [],
          consultYn: 'N',
          mypageYn: 'N'
        }

        const callback = result => {
          if (!isNull(result)) {
            if (this.globalVal.deliveryInfo.shipAddrLength === 0) {
              this.globalVal.deliveryInfo.isMultiDeliveryShow = false
              this.globalVal.deliveryInfo.isNonDeliveryShow = true
              this.globalVal.deliveryInfo.isBasicDeliveryShow = false
            } else {
              this.globalVal.deliveryInfo.isNonDeliveryShow = false
              this.globalVal.deliveryInfo.isBasicDeliveryShow = true

              this.globalVal.deliveryInfo.isDeliveryBasicIconShow = (result.ispriamry === '1')
              if (result.cst_addrDetail.substr(result.cst_addrDetail.length - 5, 4) === '무인택배') {
                this.globalVal.deliveryInfo.isDeliverySafeIconShow = true
                this.globalVal.deliveryInfo.addInfo = 'X'
                this.globalVal.deliveryInfo.shippingMessage = '무인택배함 보관'
              } else {
                this.globalVal.deliveryInfo.isDeliverySafeIconShow = false
              }

              this.globalVal.deliveryInfo.recipientName = result.receiverName
              this.globalVal.deliveryInfo.addrId = result.addressID
              this.globalVal.deliveryInfo.addr = result.cst_addr
              this.globalVal.deliveryInfo.addrDetail = result.cst_addrDetail
              this.globalVal.deliveryInfo.phone11 = getPhoneNumber(result.phone1.trim(), '1')
              this.globalVal.deliveryInfo.phone12 = getPhoneNumber(result.phone1.trim(), '2')
              this.globalVal.deliveryInfo.phone13 = getPhoneNumber(result.phone1.trim(), '3')
              this.globalVal.deliveryInfo.zipCode = result.cst_zipCode
              this.globalVal.deliveryInfo.addrFlag = result.fax1
              this.globalVal.deliveryInfo.secAddress1 = result.fax1 === '100' ? result.address2 : result.address1
              this.globalVal.deliveryInfo.secAddress2 = result.fax1 === '100' ? result.address3 : result.address1

              this.setOrderDeliveryInfo()
            }
          } else {
            this.globalVal.deliveryInfo.bDeliveryYn = this.tmpBDeliveryYn
          }
        }

        popupUtil.show('order/sheet/OrderSheetAddressBook', param, callback)
      }
    },
    /**
     * 안심택배함으로 받기 클릭 시
     */
    async clickSafeDeliveryLink () {
      if (!this.globalVal.isGuest) {
        await bizUtil.secessionMemberCheker()
      }

      this.globalVal.deliveryInfo.checkSafeGuest = 1

      const customerData = {
        recipientName: this.globalVal.mOutputDatas.msg.UserInfo.LASTNAME,
        phone: this.globalVal.customerInfo.phNumber
      }

      const param = {
        title: '안심 택배함 찾기',
        titleAlign: 'center', // 팝업 상단 타이틀 메세지 정렬 - 없으면 왼쪽 정렬
        isShowSearch: false, // 검색메뉴 안보임
        isShowCart: false, // 장바구니메뉴 안보임
        globalVal: this.globalVal,
        paymentData: this.paymentData,
        customerData
      }

      const callback = result => {
        if (!isNull(result)) {
          this.globalVal.deliveryInfo.isNonDeliveryShow = false
          this.globalVal.deliveryInfo.isBasicDeliveryShow = true

          this.globalVal.deliveryInfo.isDeliveryBasicIconShow = false
          this.isDeliveryLatestIconShow = false
          this.globalVal.deliveryInfo.isDeliverySafeIconShow = true
          this.globalVal.deliveryInfo.recipientName = result.recipientName
          this.globalVal.deliveryInfo.addrId = result.addrId
          this.globalVal.deliveryInfo.addr = result.addr1
          this.globalVal.deliveryInfo.addrDetail = result.addr2
          this.globalVal.deliveryInfo.zipCode = result.zipCode
          this.globalVal.deliveryInfo.phone11 = getPhoneNumber(result.phone.trim(), '1')
          this.globalVal.deliveryInfo.phone12 = getPhoneNumber(result.phone.trim(), '2')
          this.globalVal.deliveryInfo.phone13 = getPhoneNumber(result.phone.trim(), '3')
          this.globalVal.deliveryInfo.addInfo = 'X'
          this.globalVal.deliveryInfo.shippingMessage = '무인택배함 보관'

          // 배송지역 변경시 적립금/예치금, 무료배송 쿠폰 초기화
          this.$root.$emit('changeShippingEmit')

          // 배송비 조회 및 계산 및 출력
          this.getShippingCharge(0, String(this.globalVal.mInputParams.orderId)
            , { zipCode: this.globalVal.deliveryInfo.zipCode, addrId: result.addrId }
            , this.paymentData.Delivery.deliveryList[0].ITEMS)

          // 폼 데이터에 반영
          this.paymentData.Delivery.setItem(0, {
            ADDRESS_ID: result.addrId
          })

          this.setOrderDeliveryInfo()
        }
      }

      popupUtil.show('order/sheet/OrderSheetSafeDeliverySearch', param, callback)
    },
    /**
     * 최근 배송 메세지 목록 호출
     */
    clickGetCustDeliveryMsg () {
      // API가 호출된 적이 없고 비회원이 아니면, API 호출
      if (!this.globalVal.deliveryInfo.bSetCustDeliveryMsg && !isNull(loginUtil.userId())) {
        // NSCustDeliveryMsg API 호출
        const param = {
          userId: loginUtil.userId()
        }

        const successHandling = data => {
          if (!isNull(data) && !isNull(data.msg)) {
            this.custDeliveryMsgCallbackData = data.msg

            // 최근 배송 메시지 목록 개수 만큼 for문 실행
            for (let i = 0; i < this.custDeliveryMsgCallbackData.length; i++) {
              this.custDeliveryMsgList[i] = {
                value: htmlDecode(this.custDeliveryMsgCallbackData[i].DELI_MSG),
                text: `(최근) ${htmlDecode(this.custDeliveryMsgCallbackData[i].DELI_MSG)}`
              }
            }
          }

          // 최근 배송 메시지 리스트 세팅 완료 여부 변경
          this.globalVal.deliveryInfo.bSetCustDeliveryMsg = true

          // 배송 메시지 리스트 가져온 여부 추가
          this.isShippingMessage = true

          this.$forceUpdate()
        }

        orderSheetDeliveryService.clickGetCustDeliveryMsg(param, successHandling)

      // API가 호출된적이 있거나, 비회원일 경우
      } else {
        // 최근 배송 메시지를 리스트에 추가하지 않았고, 비회원이 아니면, 기존에 받아온 최근 배송 메시지 추가
        if (!this.isShippingMessage && !isNull(loginUtil.userId())) {
          // 최근 배송 메시지 리스트 추가
          for (let i = 0; i < this.custDeliveryMsgCallbackData.length; i++) {
            this.custDeliveryMsgList[i] = {
              value: this.custDeliveryMsgCallbackData[i].DELI_MSG,
              text: `(최근) ${this.custDeliveryMsgCallbackData[i].DELI_MSG}`
            }
          }
        }

        // 배송 메시지 리스트 가져온 여부 추가
        this.isShippingMessage = true

        this.$forceUpdate()
      }
    },
    /**
     * 배송메세지 변경
     */
    changeShippingMsg () {
      if (this.shippingMessageSelected === '직접입력(20자 이내)') {
        this.isShippingMessageShow = true
        this.shippingMessage = ''
        this.globalVal.orderDeliveryInfo.deliveryInfo[0].shippingMessage = ''
      } else {
        this.shippingMessage = this.shippingMessageSelected
        this.isShippingMessageShow = false
        this.globalVal.orderDeliveryInfo.deliveryInfo[0].shippingMessage = this.shippingMessage
      }
    },
    /**
     * 배송메세지 입력
     */
    keyupShippingMessage () {
      if (getBytes(this.shippingMessage) > 40) {
        messageUtil.alert('한글20글자를 초과 입력할 수 없습니다. 초과된 내용은 자동으로 삭제됩니다.', () => {
          this.shippingMessage = getCutBytes(this.shippingMessage, 40)
          this.globalVal.orderDeliveryInfo.deliveryInfo[0].shippingMessage = this.shippingMessage
        }, '확인')
      } else {
        this.globalVal.orderDeliveryInfo.deliveryInfo[0].shippingMessage = this.shippingMessage
      }
    },
    /**
     * 여러곳으로 배송 받기 체크박스 클릭 시
     */
    async changeManyDeliveryCheckBox () {
      if (!this.globalVal.isGuest) {
        await bizUtil.secessionMemberCheker()
      }

      // 배송지역 변경시 적립금/예치금, 무료배송 쿠폰 초기화
      this.$root.$emit('changeShippingEmit')

      this.isMultiDeliveryShow = this.globalVal.deliveryInfo.isMultiDeliveryShow
      this.isBasicDeliveryShow = this.globalVal.deliveryInfo.isBasicDeliveryShow
      this.isNonDeliveryShow = this.globalVal.deliveryInfo.isNonDeliveryShow

      if (this.multiDeliveryChecked) {
        const param = {
          title: '복수배송지',
          titleAlign: 'center', // 팝업 상단 타이틀 메세지 정렬 - 없으면 왼쪽 정렬
          isShowSearch: false, // 검색메뉴 안보임
          isShowCart: false, // 장바구니메뉴 안보임
          globalVal: this.globalVal,
          paymentData: this.paymentData,
          resultMulti: this.globalVal.deliveryInfo.resultMulti
        }

        const callback = result => {
          if (this.globalVal.deliveryInfo.resultMulti.length === 0) {
            this.isMultiShippingSafeMsgShow = true

            this.multiDeliveryChecked = false

            this.globalVal.deliveryInfo.resultMulti = []
            this.globalVal.deliveryInfo.multi = [{
              orderItemsId: [],
              selectedCnt: [],
              catentryId: [],
              shipCharge: 0, // 총 배송비
              rmaShipCharge: 0, // 추가 배송비
              sumShipCharge: 0, // 총 배송비 합계
              sumRmaShipCharge: 0 // 추가 배송비 합계
            }]

            this.globalVal.deliveryInfo.isMultiDeliveryShow = this.isMultiDeliveryShow
            this.globalVal.deliveryInfo.isBasicDeliveryShow = this.isBasicDeliveryShow
            this.globalVal.deliveryInfo.isNonDeliveryShow = this.isNonDeliveryShow

            this.multiDeliveryCount = 0

            // 배송비 조회 및 계산 및 출력
            this.getShippingCharge(0, String(this.globalVal.mInputParams.orderId)
              , { zipCode: this.globalVal.deliveryInfo.zipCode, addrId: this.globalVal.deliveryInfo.addrId }
              , this.paymentData.Delivery.deliveryList[0].ITEMS)

            this.setOrderDeliveryInfo()
          } else {
            if (result.length > 0) {
              this.isMultiShippingSafeMsgShow = false

              this.globalVal.deliveryInfo.resultMulti = result

              this.globalVal.deliveryInfo.sumShipCharge = result[0].sumShipCharge
              this.globalVal.deliveryInfo.rmaShipCharge = result[0].sumRmaShipCharge

              this.globalVal.mOutputDatas.orderPrice.SHIP_CHARGE = Number(this.globalVal.deliveryInfo.sumShipCharge)
              this.globalVal.mOutputDatas.orderPrice.RMA_SHIP_CHARGE = this.globalVal.deliveryInfo.rmaShipCharge

              // 최종 합산 배송비 적재
              this.paymentData.Payment.setItem(0, {
                SHIP_CHARGE: Number(this.globalVal.deliveryInfo.sumShipCharge), // + Number(this.globalVal.deliveryInfo.rmaShipCharge),
                RMA_SHIP_CHARGE: this.globalVal.deliveryInfo.rmaShipCharge,
                SHIP_CHARGE_ONE_DELIVERY: Number(this.globalVal.deliveryInfo.sumShipCharge) + Number(this.globalVal.deliveryInfo.rmaShipCharge),
                SHIP_CHARGE_MULTI_DELIVERY: Number(this.globalVal.deliveryInfo.sumShipCharge) + Number(this.globalVal.deliveryInfo.rmaShipCharge)
              })

              // 총결제금액 다시 출력
              this.setFinalPaymentAmount()

              this.globalVal.deliveryInfo.isMultiDeliveryShow = true
              this.globalVal.deliveryInfo.isBasicDeliveryShow = false
              this.globalVal.deliveryInfo.isNonDeliveryShow = false

              this.multiDeliveryCount = result.length

              this.multiDeliveryChecked = true

              for (let i = 0; i < result.length; i++) {
                this.globalVal.orderDeliveryInfo.deliveryInfo[i] = {
                  iptOrdererHpNo1: '', // 주문하시는분 휴대폰1
                  iptOrdererHpNo2: '', // 주문하시는분 휴대폰2
                  iptOrdererHpNo3: '', // 주문하시는분 휴대폰3
                  iptOrdererEmail: '', // 주문하시는분 이메일
                  addrAlias: result[i].recipientName, // 배송지명
                  recipientName: result[i].recipientName, // 받으시는분
                  phone11: result[i].phone11, // 받으시는분 휴대폰1
                  phone12: result[i].phone12, // 받으시는분 휴대폰2
                  phone13: result[i].phone13, // 받으시는분 휴대폰3
                  phone21: '', // 추가연락처 1
                  phone22: '', // 추가연락처 2
                  phone23: '', // 추가연락처 3
                  zipCode: result[i].zipCode, // 우편번호
                  postcode: result[i].zipCode, // 우편번호
                  addrFlag: result[i].addrFlag, // 주소타입(100: 지번주소, 200: 도로명주소)
                  addr: result[i].addr, // 주소
                  addrDetail: result[i].addrDetail, // 상세주소
                  secAddress1: result[i].secAddress1, // 세컨드 기본주소(지번일경우 도로명, 도로명일경우 지번)
                  secAddress2: result[i].secAddress2, // 세컨드 상세주소(지번일경우 도로명, 도로명일경우 지번)
                  ipDefaultDest: '', // 기본배송지로 설정 여부
                  selShippingAddress: '', // 배송지선택
                  shippingMessage: result[i].shippingMessage, // 배송메세지
                  ADDINFO: result[i].addInfo // 안심택배 최근배송지 falg
                }
              }
            } else {
              this.isMultiShippingSafeMsgShow = true

              this.multiDeliveryChecked = false

              this.globalVal.deliveryInfo.resultMulti = []
              this.globalVal.deliveryInfo.multi = [{
                orderItemsId: [],
                selectedCnt: [],
                catentryId: [],
                shipCharge: 0, // 총 배송비
                rmaShipCharge: 0, // 추가 배송비
                sumShipCharge: 0, // 총 배송비 합계
                sumRmaShipCharge: 0 // 추가 배송비 합계
              }]

              this.globalVal.deliveryInfo.isMultiDeliveryShow = this.isMultiDeliveryShow
              this.globalVal.deliveryInfo.isBasicDeliveryShow = this.isBasicDeliveryShow
              this.globalVal.deliveryInfo.isNonDeliveryShow = this.isNonDeliveryShow

              this.multiDeliveryCount = 0

              // 배송비 조회 및 계산 및 출력
              this.getShippingCharge(0, String(this.globalVal.mInputParams.orderId)
                , { zipCode: this.globalVal.deliveryInfo.zipCode, addrId: this.globalVal.deliveryInfo.addrId }
                , this.paymentData.Delivery.deliveryList[0].ITEMS)

              this.setOrderDeliveryInfo()
            }
          }
        }

        popupUtil.show('order/sheet/OrderSheetAddressMulti', param, callback)
      } else {
        this.isMultiShippingSafeMsgShow = true

        this.paymentData.Delivery.setItem(0, {
          ADDRESS_ID: this.globalVal.deliveryInfo.addrId
        })

        const tmpDeliveryList = this.paymentData.Delivery.deliveryList[0]
        for (let i = 0; i < tmpDeliveryList.ITEMS.length; i++) {
          this.paymentData.Delivery.setProductItem(0, i, {
            QUANTITY: Number(tmpDeliveryList.ITEMS[i].ORIGINAL_QUANTITY)
          })
        }

        for (let j = 0; j < this.paymentData.Product.size(); j++) {
          const item = extend({}, this.paymentData.Product.getItem(j))
          item.ROWID = String(j + 1)
          item.BASEPRICE = item.PRICE
          item.SHIPCHARGE = item.shipCharge
          item.RMASHIPCHARGE = item.rmaShipCharge
          item.TOTALPRODUCT = String(Number(item.BASEPRICE) * Number(item.QUANTITY))
          item.TOTALADJUSTMENT = String(Number(item.adjustment) * -1)
          delete item.itemAmt
          delete item.BasePrice
          delete item.adjustment
          delete item.shipCharge
          this.paymentData.Delivery.setProductItem(0, j, item)
        }

        this.paymentData.Delivery.deliveryList = []
        this.paymentData.Delivery.deliveryList.push(tmpDeliveryList)

        this.globalVal.deliveryInfo.resultMulti = []
        this.globalVal.deliveryInfo.multi = [{
          orderItemsId: [],
          selectedCnt: [],
          catentryId: [],
          shipCharge: 0, // 총 배송비
          rmaShipCharge: 0, // 추가 배송비
          sumShipCharge: 0, // 총 배송비 합계
          sumRmaShipCharge: 0 // 추가 배송비 합계
        }]

        this.globalVal.deliveryInfo.isMultiDeliveryShow = false
        this.globalVal.deliveryInfo.isBasicDeliveryShow = true
        this.globalVal.deliveryInfo.isNonDeliveryShow = false

        this.multiDeliveryCount = 0

        // 배송비 조회 및 계산 및 출력
        this.getShippingCharge(0, String(this.globalVal.mInputParams.orderId)
          , { zipCode: this.globalVal.deliveryInfo.zipCode, addrId: this.globalVal.deliveryInfo.addrId }
          , this.paymentData.Delivery.deliveryList[0].ITEMS)

        this.setOrderDeliveryInfo()
      }
    },
    /**
     * globalVal.orderDeliveryInfo 값 세팅
     */
    setOrderDeliveryInfo (safeFlg) {
      this.globalVal.orderDeliveryInfo.deliveryInfo = [{
        iptOrdererHpNo1: '', // 주문하시는분 휴대폰1
        iptOrdererHpNo2: '', // 주문하시는분 휴대폰2
        iptOrdererHpNo3: '', // 주문하시는분 휴대폰3
        iptOrdererEmail: '', // 주문하시는분 이메일
        addrAlias: '', // 배송지명
        recipientName: '', // 받으시는분
        phone11: '', // 받으시는분 휴대폰1
        phone12: '', // 받으시는분 휴대폰2
        phone13: '', // 받으시는분 휴대폰3
        phone21: '', // 추가연락처 1
        phone22: '', // 추가연락처 2
        phone23: '', // 추가연락처 3
        zipCode: '', // 우편번호
        postcode: '', // 우편번호
        addrFlag: '', // 주소타입(100: 지번주소, 200: 도로명주소)
        addr: '', // 주소
        addrDetail: '', // 상세주소
        secAddress1: '', // 세컨드 기본주소(지번일경우 도로명, 도로명일경우 지번)
        secAddress2: '', // 세컨드 상세주소(지번일경우 도로명, 도로명일경우 지번)
        ipDefaultDest: '', // 기본배송지로 설정 여부
        selShippingAddress: '', // 배송지선택
        shippingMessage: '', // 배송메세지
        ADDINFO: '' // 안심택배 최근배송지 falg
      }]

      this.globalVal.orderDeliveryInfo.deliveryInfo[0] = {
        iptOrdererHpNo1: '', // 주문하시는분 휴대폰1
        iptOrdererHpNo2: '', // 주문하시는분 휴대폰2
        iptOrdererHpNo3: '', // 주문하시는분 휴대폰3
        iptOrdererEmail: '', // 주문하시는분 이메일
        addrAlias: this.globalVal.deliveryInfo.recipientName, // 배송지명
        recipientName: this.globalVal.deliveryInfo.recipientName, // 받으시는분
        phone11: this.globalVal.deliveryInfo.phone11, // 받으시는분 휴대폰1
        phone12: this.globalVal.deliveryInfo.phone12, // 받으시는분 휴대폰2
        phone13: this.globalVal.deliveryInfo.phone13, // 받으시는분 휴대폰3
        phone21: '', // 추가연락처 1
        phone22: '', // 추가연락처 2
        phone23: '', // 추가연락처 3
        zipCode: this.globalVal.deliveryInfo.zipCode, // 우편번호
        postcode: this.globalVal.deliveryInfo.zipCode, // 우편번호
        addrFlag: this.globalVal.deliveryInfo.addrFlag, // 주소타입(100: 지번주소, 200: 도로명주소)
        addr: this.globalVal.deliveryInfo.addr, // 주소
        addrDetail: this.globalVal.deliveryInfo.addrDetail, // 상세주소
        secAddress1: this.globalVal.deliveryInfo.secAddress1, // 세컨드 기본주소(지번일경우 도로명, 도로명일경우 지번)
        secAddress2: this.globalVal.deliveryInfo.secAddress2, // 세컨드 상세주소(지번일경우 도로명, 도로명일경우 지번)
        ipDefaultDest: '', // 기본배송지로 설정 여부
        selShippingAddress: '', // 배송지선택
        shippingMessage: this.globalVal.deliveryInfo.shippingMessage, // 배송메세지
        ADDINFO: this.globalVal.deliveryInfo.addInfo // 안심택배 최근배송지 falg
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/sheet/OrderSheetDelivery";
</style>
