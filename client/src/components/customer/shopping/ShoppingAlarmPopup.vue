<template>
  <div class="shopping_alarm_popup">
    <div class="popup_container">
      <div
        class="dimmed_all"
        @click="popupClose"
      />
      <div class="popup">
        <div class="shopping_alarm">
          <h3 class="title">
            방송알림 등록
          </h3>
          <div class="product_info">
            <div class="box">
              <figure>
                <ns-img
                  :product-number="modifyProduct.partNumber"
                  :width="88"
                  :height="88"
                  :alt="modifyProduct.productName"
                />
              </figure>
              <div class="field">
                <p class="title">
                  {{ modifyProduct.productName }}
                </p>
              </div>
            </div>
          </div>
          <div class="check_list">
            <dl>
              <dt>기간</dt>
              <dd>
                <input
                  id="radio1_1"
                  v-model="pickedPeriod"
                  type="radio"
                  name="sort1"
                  value="10"
                >
                <label for="radio1_1">1개월</label>
              </dd>
              <dd>
                <input
                  id="radio1_2"
                  v-model="pickedPeriod"
                  type="radio"
                  name="sort1"
                  value="20"
                >
                <label for="radio1_2">2개월</label>
              </dd>
              <dd>
                <input
                  id="radio1_3"
                  v-model="pickedPeriod"
                  type="radio"
                  name="sort1"
                  value="30"
                >
                <label for="radio1_3">3개월</label>
              </dd>
            </dl>
            <dl>
              <dt>횟수</dt>
              <dd>
                <input
                  id="radio2_1"
                  v-model="pickedCnt"
                  type="radio"
                  name="sort2"
                  value="10"
                >
                <label for="radio2_1">한번만</label>
              </dd>
              <dd>
                <input
                  id="radio2_2"
                  v-model="pickedCnt"
                  type="radio"
                  name="sort2"
                  value="20"
                >
                <label for="radio2_2">방송시마다</label>
              </dd>
            </dl>
          </div>
          <div class="agree_content">
            <div class="sms">
              <label class="label_checkbox">
                <input
                  v-model="isSmsMarcketingAgreeChecked"
                  type="checkbox"
                  class="checkbox"
                >
                <span class="check_label">SMS 마케팅 수신동의</span>
              </label>
              <span class="phone">{{ insertSeparatorPhoneNumber(modifyProduct.mobileNum) }}</span>
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
            @click="popupClose"
          >
            닫기
          </button>
          <button
            type="button"
            class="btn coral"
            @click="confirmAlarm"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loginUtil from '@utils/loginUtil'
import toastUtil from '@frameworks/toastUtil'
import {
  getPhoneNumber,
  insertSeparatorPhoneNumber,
  isNull
} from '@utils/commonutil/commonUtil'
import NsImg from '@components/common/NsImg'
import messageUtil from '@/common/frameworks/messageUtil'

export default {
  name: 'ShoppingAlarmPopup',
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
      isSmsMarcketingAgreeChecked: false, // SMS 마케팅 수신동의 동의 여부
      isShowModifyPopup: false,
      isShowRegistPopup: false,
      pickedPeriod: '10',
      pickedCnt: '10',
      resultData: {
        resultCode: '01'
      },
      modifyProduct: {}
    }
  },
  created () {
    this.modifyProduct = this.param

    this.init()
  },
  methods: {
    insertSeparatorPhoneNumber,
    /**
     * 페이지로딩후 데이터 처리
     *
     * @returns {void}
     */
    init () {
      if (!isNull(this.modifyProduct.partNumber) && this.modifyProduct.isShowRegistPopup) {
        this.getAlarmInfoMobile(this.modifyProduct)
      }

      this.pickedPeriod = isNull(this.modifyProduct.pickedPeriod) ? 10 : this.modifyProduct.pickedPeriod
      this.pickedCnt = isNull(this.modifyProduct.pickedCnt) ? 10 : this.modifyProduct.pickedCnt
      this.isSmsMarcketingAgreeChecked = isNull(this.modifyProduct.isSmsMarcketingAgreeChecked) ? false : this.modifyProduct.isSmsMarcketingAgreeChecked
      this.isShowModifyPopup = isNull(this.modifyProduct.isShowModifyPopup) ? false : this.modifyProduct.isShowModifyPopup
      this.isShowRegistPopup = isNull(this.modifyProduct.isShowRegistPopup) ? false : this.modifyProduct.isShowRegistPopup
    },
    /**
     * 커스텀 팝업 닫기
     *
     * @returns {void}
     */
    // 커스텀 팝업 닫기
    popupClose () {
      this.$store.commit('popup/hide', { resultData: this.resultData })
    },
    /**
     * 알림 설정 전화번호 취득
     *
     * @param {object} params 상품정보
     * @returns {void}
     */
    getAlarmInfoMobile (params) {
      const invokeParams = {
        userId: loginUtil.userId(),
        partNumber: params.partNumber,
        processFlag: 'getAlarmInfoMobile',
        catentryId: params.catentryId
      }
      const productName = params.productName

      const successHandling = response => {
        const mobileNum = response.msg.PhoneNumber

        this.isShowRegistPopup = true
        this.pickedPeriod = '10'
        this.pickedCnt = '10'
        this.modifyProduct = Object.assign(invokeParams, { mobileNum, productName })
      }

      this.$nsaxios.post('TVHomeShoppingAjax', invokeParams, successHandling)
    },
    /**
     * 알림 설정 등록
     *
     * @returns {void}
     */
    registerAlarmSettings () {
      const successHandling = () => {
        this.resultData.resultCode = '00'
        this.popupClose()
      }
      const invokeParams = {
        userId: loginUtil.userId(),
        catentryId: this.modifyProduct.catentryId,
        partNumber: this.modifyProduct.partNumber,
        processFlag: 'updateAlarmMobile',
        cellphone: this.modifyProduct.mobileNum,
        telYN: this.isSmsMarcketingAgreeChecked ? 'Y' : 'N',
        month: this.pickedPeriod,
        num: this.pickedCnt
      }

      this.$nsaxios.post('TVHomeShoppingAjax', invokeParams, successHandling)
    },
    /**
     * 등록버튼 클릭
     *
     */
    confirmAlarm () {
      if (this.isShowRegistPopup) {
        this.registerAlarmSettings()
      } else {
        this.modifyAlarm()
      }
    },
    /**
     * 알림 설정 수정
     *
     * @returns {void}
     */
    modifyAlarm () {
      const pickedPeriod = this.pickedPeriod
      const pickedCnt = this.pickedCnt
      const mobileNum = this.modifyProduct.mobileNum

      if (!this.isSmsMarcketingAgreeChecked) {
        messageUtil.alert('SMS 마케팅 수신동의를 하셔야 방송알림을 받으실 수 있습니다.')
        return false
      }

      const params = {
        userId: loginUtil.userId(),
        infrId: this.modifyProduct.infrId,
        phone1: getPhoneNumber(mobileNum, '1'),
        phone2: getPhoneNumber(mobileNum, '2'),
        phone3: getPhoneNumber(mobileNum, '3'),
        recvDurClssfCd: pickedPeriod,
        recvNumClssfCd: pickedCnt
      }

      const successHandling = response => {
        if (response.msg.root.resultKey === 1) {
          this.resultData.resultCode = '00'
          this.popupClose()
          const msg = '방송 알림이 등록 되었습니다.'
          toastUtil.show(msg)
        } else {
          const msg = '방송 알림 등록이 실패 하였습니다.<br />다시 한번 확인해 주세요.'
          toastUtil.show(msg)
        }
      }

      this.$nsaxios.post('ModifyAlarmReal', params, successHandling)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/customer/shopping/ShoppingAlarmPopup";
</style>
