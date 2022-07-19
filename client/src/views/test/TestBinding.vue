<template>
  <div>
    <ul>
      <li>
        <div class="dhead">
          <label class="set">
            <input
              id="checkemployee"
              v-model="employeeSaleChecked"
              type="checkbox"
              :disabled="!isEmployee"
            >
            <strong>임직원할인</strong>
          </label>
        </div>
      </li>

      <li>
        <div>
          <label>
            <input
              id="checkcoupons"
              type="checkbox"
            >
            <strong>쿠폰할인</strong>
          </label>
        </div>
      </li>
      <li>
        <div>
          <label>
            <input
              id="chkSinglePaymentDiscount"
              type="checkbox"
            >
            <strong>일시불할인</strong>
          </label>
        </div>
      </li>
    </ul>
    <button
      style="width: 30%; height: 50px; border: 1px solid; border-radius: 20px;"
      @click="setToggleUserType"
    >
      임직원 on/off
    </button>
    <div>
      {{ isEmployee ? '임직원입니다' : '일반회원입니다' }}
    </div>
    <div
      v-show="!isEmployee"
      style="color:red"
    >
      (일반회원은 임직원할인 체크박스 조작 불가)
    </div>
  </div>
</template>

<script>
const EMPLOYEE_CODE = 31
const USER_CODE = 32

export default {
  data () {
    return {
      user: {
        userType: EMPLOYEE_CODE
      },
      employeeSaleChecked: true
    }
  },
  computed: {
    isEmployee () {
      return this.user.userType === EMPLOYEE_CODE
    }
  },
  methods: {
    /**
     * 회원 타입 토글 처리 (임직원/일반)
     */
    setToggleUserType () {
      if (this.user.userType === EMPLOYEE_CODE) {
        this.user.userType = USER_CODE
        this.employeeSaleChecked = false
      } else {
        this.user.userType = EMPLOYEE_CODE
      }
    }
  }
}
</script>
