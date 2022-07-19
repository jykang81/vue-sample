<template>
  <div v-show="!globalVal.isOrderComplete" class="order_cancel_reason">
    <h3 class="subject">
      취소사유
    </h3>
    <div class="form_group">
      <div class="input_field">
        <label for="label_phone" class="label_text">
          휴대폰<span class="essential">필수입력</span>
        </label>
        <span class="input_group">
          <input id="label_phone" v-model="globalVal.reasonPhoneValue" type="text" class="form text" placeholder="휴대폰 번호를 입력해 주세요."
                 @focus="focusDashPhone()"
                 @blur="onblurValueApply($event)"
                 @keydown="keydownNumber($event)"
                 @keyup="keyupNumber($event)"
          >
        </span>
      </div>
      <div class="input_field cancel">
        <label for="label_cancel" class="label_text">
          취소사유<span class="essential">필수입력</span>
        </label>
        <span class="input_group">
          <label class="select">
            <select id="label_cancel" v-model="globalVal.reasonOptionValue" @change="onchangeReasonOption">
              <template v-for="(reasonOptionItem, indexReasonOption) in reasonOptionList">
                <option
                  :key="indexReasonOption"
                  :value="reasonOptionItem.value"
                >{{ reasonOptionItem.text }}
                </option>
              </template>
            </select>
          </label>
          <textarea id="label_cancel" v-model="globalVal.reasonTextValue"
                    :disabled="disabledReasonText"
                    class="textarea"
                    cols="30"
                    rows="10"
                    placeholder="한글 50자 이내로 입력해 주세요."
                    @keyup="keyupReasonMessage"
                    @blur="keyupReasonMessage"
                    @input="keyupReasonMessage"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
// import loginUtil from '@utils/loginUtil'
import {
  getCutBytes,
  insertSeparatorPhoneNumber
} from '@utils/commonutil/commonUtil'
import orderCancelReasonService from '@services/order/cancel/orderCancelReasonService'

export default {
  props: {
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      reasonOptionList: [],
      disabledReasonText: true
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
      this.globalVal.reasonPhoneValue = this.globalVal.mOutputDatas.msg.root.userInfo.phone1 || ''
      this.getReason() // 사유 정보 조회
    },
    /**
     * 취소사유,교환사유,반품사유 조회
     * @returns {void}
     */
    getReason () {
      const invokeParams = {
        tasknm: 'ordrsn',
        var: this.globalVal.action
      }
      orderCancelReasonService.getReason(invokeParams, this.responseCommnCode)
    },
    /**
     * 취소사유,교환사유,반품사유 조회 callback
     * @param {Object} data - 요청 결과 data
     * @returns {void}
     */
    responseCommnCode (data) {
      this.reasonOptionList.push({ text: this.globalVal.SELECT_TXT[this.globalVal.action], value: '' })
      for (let i = 0; i < data.list.length; i++) {
        this.reasonOptionList.push({ text: data.list[i].LV3_NAME, value: data.list[i].LV3_ID })
      }
      this.reasonOptionList.push({ text: '기타(직접 입력)', value: '999' })
    },
    /**
     * 취소사유,교환사유,반품사유 선택
     * @returns {void}
     */
    onchangeReasonOption () {
      this.disabledReasonText = this.globalVal.reasonOptionValue === ''
      this.globalVal.reasonOptionText = this.getReasonText()
      this.globalVal.reasonTextValue = ''
    },
    /**
     * 취소사유,교환사유,반품사유 Text
     * @returns {String}
     */
    getReasonText () {
      const temp = this.reasonOptionList.filter(o => {
        return o.value === this.globalVal.reasonOptionValue
      })
      return temp.length > 0 ? temp[0].text : ''
    },
    /**
     * 취소사유 입력
     * @returns {void}
     */
    keyupReasonMessage (e) {
      const text = getCutBytes(e.target.value, 100)
      e.target.value = text
      this.globalVal.reasonTextValue = text
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
      this.globalVal.reasonPhoneValue = insertSeparatorPhoneNumber(e.target.value, '-')
    },
    /**
     * 포커스 시에 '-' 삽입
     * @returns {void}
     */
    focusDashPhone () {
      this.phoneNoInputType = 'number'
      this.globalVal.reasonPhoneValue = insertSeparatorPhoneNumber(this.globalVal.reasonPhoneValue, '')
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/cancel/OrderCancelReason";
</style>
