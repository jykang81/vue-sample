<template>
  <div class="shopping_alarm_register">
    <div class="shopping_alarm">
      <h3 class="title">
        방송알림 등록
      </h3>
      <div class="product_info">
        <div class="box">
          <figure>
            <ns-img
              :src="registeredProduct.imageUrl"
              :alt="htmlDecode(registeredProduct.productName)"
            />
          </figure>
          <div class="field">
            <p class="title">
              {{ htmlDecode(registeredProduct.productName) }}
            </p>
          </div>
        </div>
      </div>
      <div class="check_list">
        <dl>
          <dt>기간</dt>
          <dd>
            <input
              id="label_month1"
              v-model="pickedPeriod"
              type="radio"
              name="term"
              value="10"
            >
            <label for="label_month1">1개월</label>
          </dd>
          <dd>
            <input
              id="label_month2"
              v-model="pickedPeriod"
              type="radio"
              name="term"
              value="20"
            >
            <label for="label_month2">2개월</label>
          </dd>
          <dd>
            <input
              id="label_month3"
              v-model="pickedPeriod"
              type="radio"
              name="term"
              value="30"
            >
            <label for="label_month3">3개월</label>
          </dd>
        </dl>
        <dl>
          <dt>횟수</dt>
          <dd>
            <input
              id="label_one_time"
              v-model="pickedCnt"
              type="radio"
              name="times"
              value="10"
            >
            <label for="label_one_time">한번만</label>
          </dd>
          <dd>
            <input
              id="label_always"
              v-model="pickedCnt"
              type="radio"
              name="times"
              value="20"
            >
            <label for="label_always">방송시마다</label>
          </dd>
        </dl>
      </div>
      <div class="agree_content">
        <div class="sms">
          <label class="label_checkbox">
            <input
              v-model="isMarketingAgreeChecked"
              type="checkbox"
              class="checkbox"
            >
            <span class="check_label">SMS 마케팅 수신동의</span>
          </label>
          <span class="phone">{{ insertSeparatorPhoneNumber(registeredProduct.mobileNum) }}</span>
          <p class="copy">
            방송알림을 받기 위해서는 수신 동의가 필요합니다.<br>
            동의 시, 회원정보의 SMS 수신 동의 여부가 동일하게 변경됩니다.
          </p>
        </div>
        <ul class="txt_list">
          <li>- NSmall TV Live / TV Shop+ 방송 30분 전, 방송 예정 시간을 카카오톡 알림 메시지로 알려드립니다. (카카오톡 수신 불가 시, 문자로 발송됩니다.)</li>
          <li>- 방송 알림은 방송 편성에 따라 변경될 수 있습니다.</li>
          <li>- 재방송은 알림에서 제외됩니다.</li>
          <li>- 20시 ~ 08시의 심야/새벽 방송은 저녁 8시에 미리 알려드립니다.</li>
        </ul>
      </div>
    </div>
    <div class="button">
      <button
        type="button"
        class="btn gray"
        @click="closePopup"
      >
        닫기
      </button>
      <button
        type="button"
        class="btn coral"
        @click="clickRegisterAlarm"
      >
        등록
      </button>
    </div>
  </div>
</template>

<script>
import messageUtil from '@frameworks/messageUtil'
import toastUtil from '@frameworks/toastUtil'
import modalUtil from '@frameworks/modalUtil'
import {
  extend,
  insertSeparatorPhoneNumber,
  htmlDecode,
  isOsApp
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import NsImg from '@components/common/NsImg'
import shoppingAlarmRegisterService from '@services/product/shoppingAlarmRegisterService'
import nativeUtil from '@frameworks/nativeUtil'

export default {
  name: 'ShoppingAlarmRegister',
  components: {
    NsImg
  },
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      globalVal: {}, // 공통 데이터
      registeredProduct: {}, // 방송알림 등록할 상품 정보
      isRegistSuccess: false, // 방송알림 등록 성공 여부
      getMobileInfoFlag: true, // api 중복호출 막기위한 플래그
      isMarketingAgreeChecked: true, // SMS 마케팅 수신동의 체크(동의) 여부
      pickedPeriod: '10', // 기간
      pickedCnt: '10' // 횟수

    }
  },
  created () {
    this.globalVal = this.param.globalVal
    this.registeredProduct = extend(true, {}, this.param.registeredProductInfo)
    if (this.registeredProduct.partNumber && this.getMobileInfoFlag) {
      this.getAlarmInfoMobile(this.registeredProduct)
      this.getMobileInfoFlag = false
    }
  },
  methods: {
    htmlDecode,
    insertSeparatorPhoneNumber,
    /**
     * 전화번호 받아옴
     *
     * @param {Object} params api 호출 파라미터
     */
    getAlarmInfoMobile (params) {
      const { imageUrl, productName, partNumber, catentryId, isCtcomProduct } = params
      const invokeParams = {
        userId: loginUtil.userId(),
        partNumber,
        catentryId,
        isCtcomProduct,
        processFlag: 'getAlarmInfoMobile'
      }

      const successHandling = response => {
        const mobileNum = response.msg.PhoneNumber

        this.isShowRegistPopup = true
        this.pickedPeriod = '10'
        this.pickedCnt = '10'
        this.registeredProduct = Object.assign(invokeParams, { mobileNum, imageUrl, productName })
      }
      shoppingAlarmRegisterService.getAlarmInfoMobile(invokeParams, successHandling)
    },
    /**
     * 등록 버튼 클릭
     *
     */
    clickRegisterAlarm () {
      if (this.checkInputValue()) {
        this.registerAlarmSettings()
      }
    },
    /**
     * 방송알림 등록
     *
     */
    registerAlarmSettings () {
      const successHandling = response => {
        const success = response.msg.seccess === '0'
        if (success) {
          this.isRegistSuccess = true
          const msg = '방송알림이 등록 되었습니다.'
          if (isOsApp() && this.$route.path.includes('native')) {
            nativeUtil.showToast(msg)
          } else {
            toastUtil.show(msg)
          }
        } else {
          if (isOsApp() && this.$route.path.includes('native')) {
            nativeUtil.showToast(response.msg.resultCode)
          } else {
            toastUtil.show(response.msg.resultCode)
          }
        }
        this.closePopup()
      }

      const invokeParams = {
        userId: loginUtil.userId(),
        catentryId: this.registeredProduct.catentryId,
        partNumber: this.registeredProduct.partNumber,
        processFlag: 'updateAlarmMobile',
        cellphone: this.registeredProduct.mobileNum,
        telYN: this.isMarketingAgreeChecked ? 'Y' : 'N',
        month: this.pickedPeriod,
        num: this.pickedCnt
      }
      if (this.registeredProduct.isCtcomProduct) {
        invokeParams.pgmCd = this.globalVal.productInfo.ctcomTvList[0].pgmCd
        invokeParams.cmdType = 'updateAlarmMobile'
        shoppingAlarmRegisterService.registerTcomAlarmSettings(invokeParams, successHandling)
      } else {
        shoppingAlarmRegisterService.registerTvAlarmSettings(invokeParams, successHandling)
      }
    },
    /**
     * 필수항목 체크 여부
     *
     * @returns {boolean}
     */
    checkInputValue () {
      if (this.isMarketingAgreeChecked) {
        return true
      } else {
        const msg = 'SMS 마케팅 수신동의를 하셔야 방송알림을 받으실 수 있습니다.'
        messageUtil.alert(msg)
        return false
      }
    },
    /**
     * 닫기
     *
     */
    closePopup () {
      if (isOsApp() && this.$route.name === 'naShoppingAlarmRegister') { // APP
        nativeUtil.goBack()
      } else {
        modalUtil.close(this.isRegistSuccess)
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/product/ShoppingAlarmRegister";
</style>
