import PHONE_CONSTONST from '@/common/constants/customer/phone'
import MEMBER_CONST from '@/common/constants/customer/member'
import {
  isNull
} from '@utils/commonutil/commonUtil'

const inputMixin = {
  methods: {
    /**
     * 숫자를 제외한 모든 문자를 제거한다
     *
     * @param {object} e 이벤트 객체
     * @param {object} params prop of parent component
     */
    filterStringOut (e, params) {
      /** input type 검증 */
      if (!this.isNumberInput(e)) {
        return
      }

      /** 방향키 및 기타 키 예외 처리 */
      const pressedKey = e.charCode || e.keyCode || 0
      const BACKSPACE = 8
      const TAB = 9
      const DEL = 46

      if (pressedKey === BACKSPACE ||
        pressedKey === TAB ||
        pressedKey === DEL ||
        (pressedKey >= 37 && pressedKey <= 40) // 방향키
      ) {
        return
      }
      const eventTarget = e.target

      // type='number' 일땐 숫자값만 value에 담겨있다.
      const currentValue = eventTarget.value || params.value

      params.type = 'text'
      eventTarget.type = 'text'

      // chrome -> 셀렉션 커서 초기화 이슈 대응
      eventTarget.selectionStart = eventTarget.value.length

      params.type = 'number'
      eventTarget.type = 'number'

      eventTarget.value = currentValue
    },
    /**
     * input type 체크
     *
     * @param {object} e 이벤트 객체
     */
    isNumberInput (e) {
      const currentInputType = e.target.type
      return currentInputType === 'number'
    },
    /**
     * 최대 문자수 초과 시 문자 자르기
     *
     * @param {object} e 이벤트 객체
     * @param {params} params input 객체
     */
    removeOverLengthValue (e, params) {
      /** number type 검증 */
      if (!this.isNumberInput(e)) {
        return
      }

      const maxlength = params.maxlength
      const inputValue = params.value

      if (maxlength && inputValue.length > maxlength) {
        const slicedValue = inputValue.slice(0, maxlength)
        params.value = slicedValue
        e.target.value = slicedValue
      }
    },
    /**
     * 핸드폰번호 검증
     *
     * @param {object} e 이벤트 객체
     * @param {object} params prop of parent component
     */
    isPhonePattern (e, params) {
      let phoneNum = params.value
      let isPattern = false
      const pattern = /^([0-9]{1,})$/

      if (isNull(phoneNum)) {
        params.isError = true
        params.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE13
        return false
      }

      if (!pattern.test(phoneNum)) {
        phoneNum = phoneNum.slice(0, -1)
        params.value = phoneNum
      }

      phoneNum = params.value

      if (phoneNum.substring(0, 1) !== '0') {
        params.isError = true
        params.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE12
        return false
      } else {
        params.isError = false
      }

      if (phoneNum.length > params.maxlength && params.type === 'tel') {
        params.value = phoneNum.substring(0, params.maxlength)
      }

      if (phoneNum.length > 3) {
        const dialing = PHONE_CONSTONST.HP_DIALING
        const inputDialing = phoneNum.substring(0, 3)

        for (let i = 0; i < dialing.length; i++) {
          if (dialing[i] === inputDialing) {
            isPattern = true
          }
        }

        if (!isPattern) {
          params.isError = true
          params.errorMessage = MEMBER_CONST.MEMBER_TEXT.PHONE12
        } else {
          params.isError = false
        }
      }
    }
  }
}

export default inputMixin
