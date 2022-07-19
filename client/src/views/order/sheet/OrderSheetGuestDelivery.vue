<template>
  <div class="order_sheet_guest_delivery">
    <!-- 배송지 -->
    <h3 id="guestDeliveryArea" class="subject">
      배송지
    </h3>
    <div class="form_group">
      <div class="input_field">
        <label
          for="label_name"
          class="label_text"
        >
          받는 분<span class="essential">필수입력</span>
        </label>
        <span class="input_group">
          <input
            id="label_name"
            v-model="globalVal.orderDeliveryInfo.deliveryInfo[0].recipientName"
            type="text"
            class="form text"
            :maxlength="isRecipientNameMaxLength"
            @blur="blurRecipientName($event)"
            @input="checkUserNameKeyUp($event)"
          >
        </span>
      </div>
      <div v-show="globalVal.guestInfo.isRecipientNameErrMsgShow1" class="input_field">
        <label class="label_text" />
        <div class="input_group">
          <p class="error_msg">
            배송지의 받으시는분을 정확히 입력해 주세요.
          </p>
        </div>
      </div>
      <div class="input_field">
        <label
          for="label_phone"
          class="label_text"
        >
          휴대폰<span class="essential">필수입력</span>
        </label>
        <span class="input_group">
          <input
            v-show="globalVal.guestInfo.isUserPhoneNumShow"
            id="label_phone"
            v-model="globalVal.guestInfo.deliveryHpNo"
            type="text"
            class="form text"
            readonly
            @click="clickDeliveryHpNo()"
          >
          <input
            v-show="globalVal.guestInfo.isUserAuthPhoneNumShow"
            id="label_phone"
            v-model="globalVal.guestInfo.updateHpno"
            type="tels"
            class="form text"
            title="휴대폰 입력"
            maxlength="11"
            @keydown="keydownNumber($event)"
            @blur="blurUpdateHpno($event)"
            @keyup="inputOlnyNumber($event)"
          >
        </span>
      </div>
      <div v-show="globalVal.guestInfo.isDeliveryHpNoErrMsgShow1" class="input_field">
        <label class="label_text" />
        <div class="input_group">
          <p class="error_msg">
            배송지의 휴대폰을 정확히 입력해 주세요.
          </p>
        </div>
      </div>
      <div class="input_field address">
        <label
          for="label_address"
          class="label_text"
        >
          주소<span class="essential">필수입력</span>
        </label>
        <span class="input_group">
          <span class="input_btn">
            <input
              id="label_address"
              v-model="globalVal.orderDeliveryInfo.deliveryInfo[0].postcode"
              type="text"
              class="text"
              readonly
            >
            <button
              type="button"
              class="btn_address"
              @click="clickSearchPostCodeBtn()"
            >
              <span>주소찾기</span>
            </button>
          </span>
          <input
            id="label_address"
            v-model="globalVal.orderDeliveryInfo.deliveryInfo[0].addr"
            type="text"
            class="text"
            readonly
          >
          <input
            id="label_address"
            v-model="globalVal.orderDeliveryInfo.deliveryInfo[0].addrDetail"
            type="text"
            class="text"
            readonly
          >
        </span>
      </div>
      <div class="input_field msg_box">
        <label class="label_text" />
        <div class="input_group">
          <p v-if="globalVal.deliveryInfo.errorMessageAddress" class="error_msg">
            배송지를 입력해 주세요.
          </p>
          <p v-if="isAddrDetailErrMsgShow1" class="error_msg">
            배송지의 상세주소를 정확히 입력해 주세요.
          </p>
          <p class="delivery_box" :style="globalVal.deliveryInfo.checkFlag === 1 ? '' : 'display:none;'">
            <button type="button" @click="clickSafeDeliveryLink()">
              안심 택배함으로 받기
            </button>
          </p>
        </div>
      </div>
      <div class="input_field">
        <label
          for="label_delivery"
          class="label_text"
        >
          배송<br>메세지
        </label>
        <span class="input_group">
          <label class="select">
            <select
              id="label_delivery"
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
              <option value="직접입력(20자 이내)">
                직접입력(20자 이내)
              </option>
            </select>
          </label>
          <input
            v-show="isShippingMessageShow"
            id="label_delivery"
            :value="shippingMessage"
            type="text"
            class="form text"
            placeholder="한글 20자 이내로 입력해주세요."
            @input="shippingMessage = $event.target.value"
            @keyup="keyupShippingMessage()"
          >
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import { PRODUCT_CONST } from '@/common/constants/product/product'
import {
  isNull,
  getPhoneNumber,
  showSafePostCodeWindows,
  getBytes,
  getCutBytes
} from '@utils/commonutil/commonUtil'
import popupUtil from '@frameworks/popupUtil'
import messageUtil from '@frameworks/messageUtil'
import shippingChargeMixin from '@/mixins/order/sheet/delivery/shippingChargeMixin'
import doShippingChargeCmdMixin from '@/mixins/order/sheet/delivery/doShippingChargeCmdMixin'
import finalPaymentAmountMixin from '@/mixins/order/sheet/finalPaymentAmountMixin'

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
      isAddrDetailErrMsgShow1: false, // 배송지의 상세주소를 정확히 입력해 주세요.
      shippingMessageSelected: '', // 배송메세지
      isShippingMessageShow: false, // 배송메세지
      shippingMessage: '', // 배송메세지
      isRecipientNameMaxLength: 8
    }
  },
  mounted () {
    this.globalVal.guestInfo.deliveryHpNo = `${this.globalVal.orderDeliveryInfo.deliveryInfo[0].phone11}-${this.globalVal.orderDeliveryInfo.deliveryInfo[0].phone12}-${this.globalVal.orderDeliveryInfo.deliveryInfo[0].phone13}`
    this.globalVal.guestInfo.updateHpno = this.globalVal.orderDeliveryInfo.deliveryInfo[0].phone11 + this.globalVal.orderDeliveryInfo.deliveryInfo[0].phone12 + this.globalVal.orderDeliveryInfo.deliveryInfo[0].phone13

    this.setOrderDeliveryArea(this.globalVal.mOutputDatas.msg.OrderGoodList)

    /**
     * 배송지정보 - 받는분
     *  - this.$root.$emit('blurRecipientNameEmit')
     * @returns {void}
     */
    this.$root.$on('blurRecipientNameEmit', () => {
      this.blurRecipientName('')
    })

    /**
     * 배송지정보 - 휴대폰
     *  - this.$root.$emit('blurUpdateHpnoEmit')
     * @returns {void}
     */
    this.$root.$on('blurUpdateHpnoEmit', () => {
      this.blurUpdateHpno('')
    })
  },
  updated () {
    if (this.globalVal.isGuest) {
      this.globalVal.orderDeliveryInfo.deliveryInfo[0].phone11 = getPhoneNumber(this.globalVal.guestInfo.deliveryHpNo, '1')
      this.globalVal.orderDeliveryInfo.deliveryInfo[0].phone12 = getPhoneNumber(this.globalVal.guestInfo.deliveryHpNo, '2')
      this.globalVal.orderDeliveryInfo.deliveryInfo[0].phone13 = getPhoneNumber(this.globalVal.guestInfo.deliveryHpNo, '3')

      // console.log('this.globalVal.orderDeliveryInfo.deliveryInfo[0] updated =======>>>>>>')
      // console.log(this.globalVal.deliveryInfo.deliveryInfo[0])
    }
  },
  methods: {
    isNull,
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
     * 주소찾기 버튼 클릭
     */
    clickSearchPostCodeBtn () {
      const callback = result => {
        if (result !== undefined) {
          this.globalVal.orderDeliveryInfo.deliveryInfo[0].zipCode = (result.picked === 'road' ? result.roadPost : result.addressPost)
          this.globalVal.orderDeliveryInfo.deliveryInfo[0].postcode = (result.picked === 'road' ? result.roadPost : result.addressPost)
          this.globalVal.orderDeliveryInfo.deliveryInfo[0].addrFlag = (result.picked === 'road' ? '200' : '100') // 주소타입(100: 지번주소, 200: 도로명주소)
          this.globalVal.orderDeliveryInfo.deliveryInfo[0].addr = (result.picked === 'road' ? result.road : result.address)
          this.globalVal.orderDeliveryInfo.deliveryInfo[0].addrDetail = (result.picked === 'road' ? result.roadOther : result.addressOther)
          this.globalVal.orderDeliveryInfo.deliveryInfo[0].secAddress1 = (result.picked === 'road' ? result.address : result.road) // 세컨드 기본주소(지번일경우 도로명, 도로명일경우 지번)
          this.globalVal.orderDeliveryInfo.deliveryInfo[0].setAddress2 = (result.picked === 'road' ? result.addressOther : result.roadOther) // 세컨드 상세주소(지번일경우 도로명, 도로명일경우 지번)

          // 배송비 조회 및 계산 및 출력
          this.getShippingCharge(0, String(this.globalVal.mInputParams.orderId)
            , { zipCode: this.globalVal.orderDeliveryInfo.deliveryInfo[0].zipCode, addrId: '' }
            , this.paymentData.Delivery.deliveryList[0].ITEMS)
        }
      }

      showSafePostCodeWindows(callback)
    },
    /**
     * 안심택배함으로 받기 클릭 시
     */
    clickSafeDeliveryLink () {
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
          this.globalVal.orderDeliveryInfo.deliveryInfo[0].addr = result.addr1
          this.globalVal.orderDeliveryInfo.deliveryInfo[0].addrDetail = result.addr2
          this.globalVal.orderDeliveryInfo.deliveryInfo[0].zipCode = result.newZipCode
          this.globalVal.orderDeliveryInfo.deliveryInfo[0].postcode = result.newZipCode

          // 배송비 조회 및 계산 및 출력
          this.getShippingCharge(0, String(this.globalVal.mInputParams.orderId)
            , { zipCode: this.globalVal.orderDeliveryInfo.deliveryInfo[0].zipCode, addrId: '' }
            , this.paymentData.Delivery.deliveryList[0].ITEMS)

          // 폼 데이터에 반영
          this.paymentData.Delivery.setItem(0, {
            ADDRESS_ID: ''
          })
        }
      }

      popupUtil.show('order/sheet/OrderSheetSafeDeliverySearch', param, callback)
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
     * globalVal.orderDeliveryInfo 값 세팅
     */
    setOrderDeliveryInfo () {
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
        shippingMessage: '', // 배송메세지
        ADDINFO: '' // 안심택배 최근배송지 falg
      }
    },
    /**
     * key down 방향기, 백스페이스, Del키,  숫자 외 입력 금지
     * maxlength (16) 이상은 방향기, 백스페이스, Del키 만 허용
     * @param {object} e event object
     * @returns {void}
     */
    keydownNumber (e) {
      const code = e.keyCode
      const ALLOW_KEYS = [
        COMM_CONST.KEY_CODE.BACK_SPACE,
        COMM_CONST.KEY_CODE.DELETE,
        COMM_CONST.KEY_CODE.LEFT,
        COMM_CONST.KEY_CODE.RIGHT
      ]

      if (!ALLOW_KEYS.includes(code) && (code < COMM_CONST.KEY_CODE.NUM_0 || code > COMM_CONST.KEY_CODE.NUM_9)) {
        e.preventDefault()
      }

      if (e.target.value.length >= 16) {
        if (!ALLOW_KEYS.includes(code)) {
          e.preventDefault()
        }
      }
    },
    inputOlnyNumber (e) {
      const targetVal = e.target.value.replace(/[^0-9]/g, '')
      e.target.value = targetVal
      this.globalVal.guestInfo.updateHpno = targetVal
    },
    /**
     * 받는분 blur 이벤트
     * @param {object} e event object
     * @returns {void}
     */
    blurRecipientName (e) {
      this.globalVal.guestInfo.isRecipientNameErrMsgShow1 = false

      if (this.globalVal.orderDeliveryInfo.deliveryInfo[0].recipientName.trim() === '') {
        this.globalVal.guestInfo.isRecipientNameErrMsgShow1 = true
      }
      if (this.globalVal.orderDeliveryInfo.deliveryInfo[0].recipientName.length === 1) {
        this.globalVal.guestInfo.isRecipientNameErrMsgShow1 = true
      }
    },
    /**
     * 사용자명 검증 keyUp
     *
     * @param {Event} event 이벤트 객체
     */
    checkUserNameKeyUp (event) {
      this.globalVal.orderDeliveryInfo.deliveryInfo[0].recipientName = this.globalVal.orderDeliveryInfo.deliveryInfo[0].recipientName.replace(/ /gi, '')
      const userName = this.globalVal.orderDeliveryInfo.deliveryInfo[0].recipientName
      const strKorRegExp = /[^ㄱ-ㅎㅏ-ㅣ가-힣]/g.test(userName)
      const strEngRegExp = /[^A-Za-z]/g.test(userName)

      this.globalVal.guestInfo.isRecipientNameErrMsgShow1 = false

      if (strKorRegExp && strEngRegExp) {
        this.globalVal.guestInfo.isRecipientNameErrMsgShow1 = true
      } else {
        if (!strKorRegExp) {
          this.isRecipientNameMaxLength = 10
          if (userName.length > 10) {
            this.globalVal.orderDeliveryInfo.deliveryInfo[0].recipientName = userName.slice(0, -1)
            if (!isNull(event.target)) {
              event.target.value = this.globalVal.orderDeliveryInfo.deliveryInfo[0].recipientName // chrome mobile 대응
            }
          }
        } else if (!strEngRegExp) {
          this.isRecipientNameMaxLength = 20
          if (userName.length > 20) {
            this.globalVal.orderDeliveryInfo.deliveryInfo[0].recipientName = userName.slice(0, -1)
            if (!isNull(event.target)) {
              event.target.value = this.globalVal.orderDeliveryInfo.deliveryInfo[0].recipientName // chrome mobile 대응
            }
          }
        }
      }
    },
    /**
     * 휴대폰 blur 이벤트
     * @param {object} e event object
     * @returns {void}
     */
    blurUpdateHpno (e) {
      this.globalVal.guestInfo.updateHpno = this.globalVal.guestInfo.updateHpno.replace(/[^0-9]/g, '')

      this.globalVal.guestInfo.isDeliveryHpNoErrMsgShow1 = false

      if (this.globalVal.guestInfo.updateHpno === '') {
        this.globalVal.guestInfo.isDeliveryHpNoErrMsgShow1 = true
        return false
      } else if ((this.globalVal.guestInfo.updateHpno.length < 10 || this.globalVal.guestInfo.updateHpno.length > 11) || this.globalVal.guestInfo.updateHpno.substring(0, 1) !== '0') {
        this.globalVal.guestInfo.isDeliveryHpNoErrMsgShow1 = true
        return false
      }

      this.globalVal.guestInfo.isUserAuthPhoneNumShow = false
      this.globalVal.guestInfo.isUserPhoneNumShow = true

      this.globalVal.guestInfo.deliveryHpNo = `${getPhoneNumber(this.globalVal.guestInfo.updateHpno, '1')}-${getPhoneNumber(this.globalVal.guestInfo.updateHpno, '2')}-${getPhoneNumber(this.globalVal.guestInfo.updateHpno, '3')}`
      this.globalVal.orderDeliveryInfo.deliveryInfo[0].phone11 = getPhoneNumber(this.globalVal.guestInfo.deliveryHpNo, '1')
      this.globalVal.orderDeliveryInfo.deliveryInfo[0].phone12 = getPhoneNumber(this.globalVal.guestInfo.deliveryHpNo, '2')
      this.globalVal.orderDeliveryInfo.deliveryInfo[0].phone13 = getPhoneNumber(this.globalVal.guestInfo.deliveryHpNo, '3')
    },
    clickDeliveryHpNo () {
      this.globalVal.guestInfo.isUserAuthPhoneNumShow = true
      this.globalVal.guestInfo.isUserPhoneNumShow = false
    }

  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/sheet/OrderSheetGuestDelivery";
</style>
