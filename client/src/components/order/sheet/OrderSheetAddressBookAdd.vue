<template>
  <div class="order_sheet_address_book_add">
    <div class="order_delivery_add">
      <div>
        <div class="input_field user_name">
          <label
            for="label_user_name"
            class="label_icon"
          >
            받는 분
          </label>
          <span class="input_group">
            <input
              id="label_user_name"
              v-model="recipientName"
              type="text"
              title="받는 분 입력"
              maxlength="8"
              class="form text"
              value=""
              placeholder="받는 분"
              @blur="blurRecipientName($event)"
            >
            <p v-show="isRecipientNameErrMsgShow1" class="error_msg">받는 분을 입력해 주세요.</p>
            <p v-show="isRecipientNameErrMsgShow2" class="error_msg">받는 분을 정확히 입력해 주세요.</p>
          </span>
        </div>
        <div class="input_field phone">
          <label
            for="label_phone"
            class="label_icon"
          >
            휴대전화
          </label>
          <span class="input_group">
            <input
              id="label_phone"
              v-model="phone"
              type="tel"
              title="휴대전화 입력"
              maxlength="11"
              class="form text"
              value=""
              placeholder="휴대폰 번호 (‘-’ 없이 입력)"
              @keydown="keydownNumber($event)"
              @blur="blurPhone($event)"
              @keyup="inputOlnyNumber($event)"
            >
            <p v-show="isPhoneErrMsgShow1" class="error_msg">휴대폰 번호를 입력해 주세요.</p>
            <p v-show="isPhoneErrMsgShow2" class="error_msg">휴대폰 번호를 정확히 입력해 주세요.</p>
          </span>
        </div>
        <div class="input_field address">
          <label
            for="label_address"
            class="label_icon"
          >
            우편번호 찾기
          </label>
          <div class="address_box">
            <span
              v-show="isAddrSearchShow"
              class="input_group"
            >
              <label>
                <input
                  type="text"
                  title="우편번호 찾기 입력"
                  class="form text"
                  value=""
                  placeholder="우편번호 찾기"
                >
              </label>
            </span>
            <!-- 우편번호 선택완료시 노출 -->
            <div v-show="isAddrShow" class="text_address">
              {{ postcode }}<br>
              {{ addr }}
            </div>
            <p class="btn_search">
              <button
                type="button"
                @click="clickSearchPostCodeBtn()"
              >
                우편번호 검색
              </button>
            </p>
          </div>
          <span class="input_group address_detail">
            <input
              v-show="isAddrShow"
              id="label_address"
              v-model="addrDetail"
              type="text"
              title="상세주소 입력"
              class="form text"
              placeholder="상세주소 입력"
              maxlength="100"
              readonly
              @blur="blurAddrDetail($event)"
            >
          </span>
        </div>
        <p v-show="isAddrErrMsgShow" class="error_msg">
          상세주소를 입력해 주세요.
        </p>
        <label class="mt8">
          <input
            v-model="ipDefaultDest"
            type="checkbox"
            class="checkbox square"
          >
          <span class="check_label">기본 배송지로 저장</span>
        </label>
      </div>
      <p class="bottom_button">
        <button
          type="button"
          class="btn"
          @click="clickSetAddressBtn()"
        >
          <span>저장</span>
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import {
  showSafePostCodeWindows,
  insertSeparatorPhoneNumber
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import messageUtil from '@frameworks/messageUtil'
import orderSheetAddressBookAddService from '@services/order/sheet/orderSheetAddressBookAddService'
import bizUtil from '@utils/bizUtil'

export default {
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      globalVal: {},
      isAddrSearchShow: true,
      isAddrShow: false, // 주소
      recipientName: '', // 받는 분
      phone: '', // 휴대폰
      postcode: '', // 우편번호
      zipCode: '',
      addr: '', // 주소
      addrDetail: '', // 상세주소
      addrFlag: '100', // 우편번호 형식(100:지번, 200:도로명주소)
      setAddress1: '', // 세컨드 기본주소(지번일경우 도로명, 도로명일경우 지번)
      setAddress2: '', // 세컨드 상세주소(지번일경우 도로명, 도로명일경우 지번)
      ipDefaultDest: false, // 기본배송지로 저장 체크박스
      custDeliveryMsgCallbackData: [],
      mode: '',
      isRecipientNameErrMsgShow1: false, // 받는 분을 입력해 주세요.
      isRecipientNameErrMsgShow2: false, // 받는 분을 정확히 입력해 주세요.
      isPhoneErrMsgShow1: false, // 휴대폰 번호를 입력해 주세요.
      isPhoneErrMsgShow2: false, // 휴대폰 번호를 정확히 입력해 주세요.
      isAddrErrMsgShow: false // 상세주소를 입력해 주세요.
    }
  },
  created () {
    this.globalVal = this.param.globalVal
    this.mode = this.param.mode

    if (this.mode === 'default') {
      this.ipDefaultDest = true
    } else {
      this.ipDefaultDest = false
    }
  },
  updated () {
    // 기본배송지가 없는 경우 무조건 체크되어 있도록..
    if (this.mode === 'default') {
      this.ipDefaultDest = true
    }
  },
  methods: {
    /**
     * 우편번호검색 버튼 클릭
     */
    async clickSearchPostCodeBtn () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      try {
        const callback = result => {
          this.zipCode = (result.picked === 'road' ? result.roadPost : result.addressPost)
          this.postcode = (result.picked === 'road' ? result.roadPost : result.addressPost)
          this.addrFlag = (result.picked === 'road' ? '200' : '100') // 주소타입(100: 지번주소, 200: 도로명주소)
          this.addr = (result.picked === 'road' ? `${result.road} ${result.roadDong}` : result.address)
          this.addrDetail = (result.picked === 'road' ? result.roadOther : result.addressOther)
          this.setAddress1 = (result.picked === 'road' ? result.address : result.road) // 세컨드 기본주소(지번일경우 도로명, 도로명일경우 지번)
          this.setAddress2 = (result.picked === 'road' ? result.addressOther : result.roadOther) // 세컨드 상세주소(지번일경우 도로명, 도로명일경우 지번)

          this.isAddrSearchShow = false
          this.isAddrShow = true
        }

        showSafePostCodeWindows(callback)
      } catch (e) {
        // handle exception
        messageUtil.alert(`일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.<br />(clickSearchPostCodeBtn)${e}`, () => {
          this.$store.commit('popup/hide')
        })
      }
    },
    /**
     * 저장 버튼 클릭
     */
    async clickSetAddressBtn () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      try {
        const param = {
          tasknm: 'maxCnt',
          var: loginUtil.userId()
        }

        const successHandling = data => {
          if (data != null && data.list !== null && data.list.resultCd === 'insert') { // 입력 가능 상태
            this.insertShippingAddress()
          } else {
            // 30개 이상 등록 불가
            messageUtil.alert('배송지는 30개까지 등록하실 수 있습니다. 배송주소록을 관리하신 후 추가해 주세요.')
            return false
          }
        }

        // 배송주소록 max size(30)을 넘는지 check
        orderSheetAddressBookAddService.clickSetAddressBtn(param, successHandling)
      } catch (e) {
        // handle exception
        messageUtil.alert(`일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.<br />(clickSetAddressBtn)${e}`, () => {
          this.$store.commit('popup/hide')
        })
      }
    },
    /**
     * 배송주소록 추가
     */
    insertShippingAddress () {
      let rtnFlg = true

      this.isRecipientNameErrMsgShow1 = false
      this.isRecipientNameErrMsgShow2 = false
      this.isPhoneErrMsgShow1 = false
      this.isPhoneErrMsgShow2 = false
      this.isAddrErrMsgShow = false

      if (this.recipientName.trim() === '') {
        this.isRecipientNameErrMsgShow1 = true
        this.isRecipientNameErrMsgShow2 = false
        rtnFlg = false
      } else if (!/^[가-힣a-zA-Z]+$/.test(this.recipientName) || this.recipientName.length === 1) {
        this.isRecipientNameErrMsgShow1 = false
        this.isRecipientNameErrMsgShow2 = true
        rtnFlg = false
      }
      if (this.recipientName.length === 1) {
        this.isRecipientNameErrMsgShow1 = false
        this.isRecipientNameErrMsgShow2 = true
        rtnFlg = false
      }
      if (this.phone === '') {
        this.isPhoneErrMsgShow1 = true
        this.isPhoneErrMsgShow2 = false
        rtnFlg = false
      } else if ((this.phone.length < 10 || this.phone.length > 11) || this.phone.substring(0, 1) !== '0') {
        this.isPhoneErrMsgShow1 = false
        this.isPhoneErrMsgShow2 = true
        rtnFlg = false
      }
      if (this.addrDetail.trim() === '') {
        this.isAddrErrMsgShow = true
        rtnFlg = false
      }
      if (!rtnFlg) {
        return false
      }

      const param = {
        processFlag: 'INSERT',
        address_id: '',
        userId: loginUtil.userId(),
        nickName: this.recipientName.trim(),
        lastName: this.recipientName.trim(),
        zip_code: this.postcode,
        zip_codeS: this.postcode,
        zipType: this.addrFlag,
        addressBas: this.addr.trim(),
        addressDtl: this.addrDetail.trim(),
        // 배송지 개편 start
        addressBasS: this.setAddress1,
        addressDtlS: this.setAddress2,
        // 배송지 개편 end
        isPrimary: this.ipDefaultDest === true ? '1' : '0',
        phone1: insertSeparatorPhoneNumber(this.phone.trim(), '-'),
        URL: 'NSShippingAddressCmd'
      }

      const successHandling = data => {
        const message = data.msg.message
        let isSuccess = data.msg.isSuccess

        // api output이 개발과 운영이 상이하여 일단 별개 예외처리
        if (message === null || undefined === message) {
          isSuccess = data.msg.msg.isSuccess
        }

        if (isSuccess === 1) {
          this.$store.commit('popup/hide', data)
        } else {
          messageUtil.alert(message)
        }
      }

      orderSheetAddressBookAddService.insertShippingAddress(param, successHandling)
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
      this.phone = targetVal
    },
    /**
     * 받는분 blur 이벤트
     * @param {object} e event object
     * @returns {void}
     */
    blurRecipientName (e) {
      this.isRecipientNameErrMsgShow1 = false
      this.isRecipientNameErrMsgShow2 = false

      if (this.recipientName.trim() === '') {
        this.isRecipientNameErrMsgShow1 = true
        this.isRecipientNameErrMsgShow2 = false
      } else if (!/^[가-힣a-zA-Z]+$/.test(this.recipientName)) {
        this.isRecipientNameErrMsgShow1 = false
        this.isRecipientNameErrMsgShow2 = true
      } else if (this.recipientName.length === 1) {
        this.isRecipientNameErrMsgShow1 = false
        this.isRecipientNameErrMsgShow2 = true
      }
    },
    /**
     * 휴대폰번호 blur 이벤트
     * @param {object} e event object
     * @returns {void}
     */
    blurPhone (e) {
      this.phone = this.phone.replace(/[^0-9]/g, '')

      this.isPhoneErrMsgShow1 = false
      this.isPhoneErrMsgShow2 = false

      if (this.phone === '') {
        this.isPhoneErrMsgShow1 = true
        this.isPhoneErrMsgShow2 = false
      } else if ((this.phone.length < 10 || this.phone.length > 11) || this.phone.substring(0, 1) !== '0') {
        this.isPhoneErrMsgShow1 = false
        this.isPhoneErrMsgShow2 = true
      }
    },
    /**
     * 상세주소 blur 이벤트
     * @param {object} e event object
     * @returns {void}
     */
    blurAddrDetail (e) {
      this.isAddrErrMsgShow = false

      if (this.addrDetail.trim() === '') {
        this.isAddrErrMsgShow = true
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/sheet/OrderSheetAddressBookAdd";
</style>
