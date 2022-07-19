<template>
  <div class="order_consult_sheet_user">
    <!-- 이용자 정보 -->
    <h3 id="userInfoArea" class="subject">
      이용자 정보
    </h3>
    <div v-show="globalVal.userInfo.showDeliveryArea" class="delivery_point" @click="onclickAddressBookLink()">
      <p v-show="globalVal.userInfo.fullAddress === '' || globalVal.userInfo.showNonDelivery">
        {{ globalVal.userInfo.deliveryLabelText }}를 입력해 주세요.
      </p>
      <p v-show="globalVal.userInfo.showWrongDelivery" class="wrong">
        필수입력 사항입니다. 선택해 주세요.
      </p>
      <p v-show="globalVal.userInfo.fullAddress !== ''" class="name">
        <template v-if="!globalVal.userInfo.showInputUserName">
          {{ globalVal.userInfo.userName }}
        </template>
        <span v-show="globalVal.userInfo.showDeliveryBasicIcon" class="coral">기본 {{ globalVal.userInfo.deliveryLabelText }}</span>
        <span v-show="globalVal.userInfo.showDeliverySafeIcon" class="blue">안심 택배함</span>
      </p>
      <div v-show="globalVal.userInfo.fullAddress !== ''" class="address">
        {{ globalVal.userInfo.fullAddress }}
      </div>
    </div>
    <div class="form_group">
      <div v-show="globalVal.userInfo.showInputUserName" class="input_field top">
        <label for="label_user_name" class="label_text">
          이름 <span class="essential">필수입력</span>
        </label>
        <span class="input_group">
          <input id="label_user_name" v-model="globalVal.userInfo.userName" type="text" class="form text" placeholder="이름을 입력해 주세요.">
          <span v-show="globalVal.userInfo.showWrongUserName" class="error_msg">
            이름을 입력해주세요.
          </span>
        </span>
      </div>
      <div class="input_field top">
        <label for="label_phone_user" class="label_text">
          {{ globalVal.userInfo.phoneLabelText }}<span class="essential">필수입력</span>
        </label>
        <span class="input_group">
          <input id="label_phone_user" v-model="globalVal.userInfo.phoneNo" :type="phoneNoInputType" class="form text" placeholder="휴대폰 번호를 입력해 주세요."
                 @focus="focusDashPhone()"
                 @blur="onblurValueApply($event)"
                 @keydown="keydownNumber($event)"
                 @keyup="keyupNumber($event)"
          >
          <span v-show="globalVal.userInfo.showWrongPhoneNo" class="error_msg">
            {{ globalVal.userInfo.phoneLabelText }} {{ globalVal.userInfo.textWrongPhoneNo }}
          </span>
        </span>
      </div>
      <div v-show="globalVal.userInfo.showCallDateArea" class="mt8">
        <div class="input_field">
          <label class="label_text">
            상담<br>요청일
          </label>
          <span class="input_group radio_wrap">
            <label>
              <input v-model="globalVal.userInfo.checkedCallDate" type="radio" class="radio" name="date" value="N" @change="onchangeCallDate()">
              <span class="radio_label">지정안함</span>
            </label>
            <label>
              <input v-model="globalVal.userInfo.checkedCallDate" type="radio" class="radio" name="date" value="Y" @change="onchangeCallDate()">
              <span class="radio_label">날짜지정</span>
            </label>
          </span>
        </div>
        <div v-show="showCallDate" class="input_field">
          <label class="label_text" />
          <label class="select">
            <select v-model="globalVal.userInfo.selectTime">
              <option value="20">오전</option>
              <option value="30">오후</option>
            </select>
          </label>
        </div>
        <div v-show="showCallDate" class="input_field">
          <label for="label_date" class="label_text" />
          <span class="input_group">
            <input id="label_date" v-model="globalVal.userInfo.callDay" type="text" class="form text" readonly placeholder="날짜를 선택해주세요." @click="onclickCallDay()">
            <span v-show="globalVal.userInfo.showWrongCallDate" class="error_msg">
              상담 요청일을 선택해 주세요.
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import {
  format,
  getNowDate,
  openCalendar
} from '@frameworks/dateutil/dateUtil'
import {
  isNull,
  showSafePostCodeWindows,
  insertSeparatorPhoneNumber
} from '@utils/commonutil/commonUtil'
import popupUtil from '@frameworks/popupUtil'
import loginUtil from '@utils/loginUtil'
import messageUtil from '@frameworks/messageUtil'
import PaymentData from '@/common/order/sheet/paymentData'

export default {
  props: {
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      phoneNoInputType: 'tel',
      showCallDate: true
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * 초기화
     * @returns {void}
     */
    init () {
      if (this.globalVal.mInputParams.orderPrgrsTypeCd !== '800') {
        if (this.globalVal.userInfo.showDeliveryArea) {
          this.globalVal.userInfo.callDay = format(new Date(), 'yyyy-MM-dd')
          if (!isNull(this.globalVal.deliveryInfo) && this.globalVal.deliveryInfo.length > 0) {
            for (const addr of this.globalVal.deliveryInfo) {
              if (addr.isPrimary === 1) {
                this.setUserInfo(addr)
              }
            }
          }
        }
      }

      if (this.globalVal.userInfo.showInputUserName) {
        this.globalVal.userInfo.userName = this.globalVal.memberInfo.userNm
        this.globalVal.userInfo.phoneNo = this.globalVal.memberInfo.phone
      }
    },
    /**
     * 이용자 정보 설정
     * @param {Object} item - 주소정보
     * @returns {void}
     */
    setUserInfo (item) {
      this.globalVal.userInfo.addressId = item.address_id
      this.globalVal.userInfo.isPrimary = item.isPrimary === 1
      this.globalVal.userInfo.showDeliveryBasicIcon = item.isPrimary === 1
      this.globalVal.userInfo.userName = item.lastName
      this.globalVal.userInfo.addrFlag = item.zipType
      this.globalVal.userInfo.zipCode = item.zipCode
      this.globalVal.userInfo.fullAddress = `${item.address2} ${item.address3}`

      this.globalVal.userInfo.addr = item.address2
      this.globalVal.userInfo.addrDetail = item.address3

      let phoneNo = ''
      if (!isNull(item.phone1)) {
        phoneNo = item.phone1
      }
      if (isNull(phoneNo)) {
        phoneNo = loginUtil.hpNo()
      }
      this.globalVal.userInfo.phoneNo = phoneNo
    },
    /**
     * 배송주소 클릭 시
     * @returns {void}
     */
    onclickAddressBookLink () {
      if (this.globalVal.mInputParams.orderPrgrsTypeCd === '800') {
        this.searchPostCode()
      } else {
        this.detailAddressBookLink()
      }
    },
    /**
     * 배송주소 (상세주소포함)
     * @returns {void}
     */
    searchPostCode () {
      try {
        const callback = result => {
          if (!isNull(result)) {
            this.globalVal.userInfo.showWrongDelivery = false
            this.globalVal.userInfo.showNonDelivery = false
            this.globalVal.userInfo.addressId = '02'
            this.globalVal.userInfo.userName = this.globalVal.memberInfo.userNm
            this.globalVal.userInfo.isPrimary = '0'
            this.globalVal.userInfo.showDeliveryBasicIcon = false
            this.globalVal.userInfo.showDeliverySafeIcon = false
            this.globalVal.userInfo.addr = (result.picked === 'road' ? `${result.road} ${result.roadDong}` : result.address)
            this.globalVal.userInfo.addrDetail = (result.picked === 'road' ? '' : result.addressOther) // 세컨드 기본주소(지번일경우 도로명, 도로명일경우 지번)
            this.globalVal.userInfo.fullAddress = `${this.globalVal.userInfo.addr} ${this.globalVal.userInfo.addrDetail}`
            this.globalVal.userInfo.zipCode = (result.picked === 'road' ? result.roadPost : result.addressPost)
            this.globalVal.userInfo.addrFlag = (result.picked === 'road' ? '200' : '100') // 주소타입(100: 지번주소, 200: 도로명주소)
          }
        }

        showSafePostCodeWindows(callback, false, '주소찾기', true)
      } catch (e) {
        messageUtil.alert(`일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.\n${e}`, () => {
          this.$store.commit('popup/hide')
        })
      }
    },
    /**
     * 배송주소 (상세주소포함)
     * @returns {void}
     */
    detailAddressBookLink () {
      const ordAddr = {
        zipCode: this.globalVal.userInfo.zipCode,
        addr: this.globalVal.userInfo.addr,
        addrDetail: this.globalVal.userInfo.addrDetail,
        recipientName: this.globalVal.userInfo.userName,
        phone: this.globalVal.userInfo.phoneNo
      }

      this.globalVal.productInfo = { deliveryDateSelected: '' }

      const param = {
        title: '배송지 선택',
        titleAlign: 'center', // 팝업 상단 타이틀 메세지 정렬 - 없으면 왼쪽 정렬
        isShowSearch: false, // 검색메뉴 안보임
        isShowCart: false, // 장바구니메뉴 안보임
        globalVal: this.globalVal,
        paymentData: {
          Delivery: new PaymentData.Delivery()
        },
        consultYn: 'Y',
        ordAddr,
        multiYn: 'N',
        multiIdx: 0,
        chargeItems: [],
        mypageYn: 'N'
      }

      const callback = result => {
        this.globalVal.userInfo.showWrongDelivery = false
        this.globalVal.userInfo.showNonDelivery = false

        if (!isNull(result)) {
          this.globalVal.userInfo.addressId = result.addressID
          this.globalVal.userInfo.userName = result.receiverName
          this.globalVal.userInfo.isPrimary = (result.ispriamry === '1')
          this.globalVal.userInfo.showDeliveryBasicIcon = (result.ispriamry === '1')
          this.globalVal.userInfo.showDeliverySafeIcon = false
          this.globalVal.userInfo.fullAddress = `${result.cst_addr} ${result.cst_addrDetail}`
          this.globalVal.userInfo.addr = result.cst_addr
          this.globalVal.userInfo.addrDetail = result.cst_addrDetail
          this.globalVal.userInfo.phoneNo = result.phone1.trim()
          this.globalVal.userInfo.zipCode = result.cst_zipCode
          this.globalVal.userInfo.addrFlag = result.fax1
        }
      }

      popupUtil.show('order/sheet/OrderSheetAddressBook', param, callback)
    },
    /**
     * 상담 요청일
     * @returns {void}
     */
    onchangeCallDate () {
      this.showCallDate = this.globalVal.userInfo.checkedCallDate === 'Y'
      if (this.showCallDate) {
        this.globalVal.userInfo.selectTime = '30'
        this.globalVal.userInfo.callDay = format(new Date(), 'yyyy-MM-dd')
      } else {
        this.globalVal.userInfo.showWrongCallDate = false
        this.globalVal.userInfo.selectTime = ''
        this.globalVal.userInfo.callDay = ''
      }
    },
    /**
     * key down 방향기, 백스페이스, Del키,  숫자 외 입력 금지
     * maxlength (16) 이상은 방향기, 백스페이스, Del키 만 허용
     * @param {Object} e - event object
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

      if (e.target.value.length >= 11) {
        if (!ALLOW_KEYS.includes(code)) {
          e.preventDefault()
        }
      }
    },
    /**
     * 입력시 숫자를 제외한 값 제거 후 재할당
     * @param {Object} e - event object
     * @returns {void}
     */
    keyupNumber (e) {
      e.target.value = e.target.value.replace(/[^0-9]/g, '')
    },
    /**
     * 최종 value 적용
     * @param {Object} e - event object
     * @returns {void}
     */
    onblurValueApply (e) {
      this.phoneNoInputType = 'tel'
      this.globalVal.userInfo.phoneNo = insertSeparatorPhoneNumber(e.target.value, '-')
    },
    /**
     * 포커스 시에 '-' 삽입
     * @returns {void}
     */
    focusDashPhone () {
      this.phoneNoInputType = 'number'
      this.globalVal.userInfo.phoneNo = insertSeparatorPhoneNumber(this.globalVal.userInfo.phoneNo, '')
    },
    /**
     * 일자선택
     * @returns {void}
     */
    onclickCallDay () {
      const baseYear = Number(getNowDate().substring(0, 4))
      const startYear = baseYear - 5
      const endYear = baseYear + 1
      openCalendar({ titleName: '날짜선택', setDate: this.globalVal.userInfo.callDay, startYear, endYear }, data => {
        if (data.dateValue !== '') {
          this.globalVal.userInfo.callDay = data.dateValue
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/consult/OrderConsultSheetUser";
</style>
