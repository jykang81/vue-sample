<template>
  <div class="ns_pay_management">
    <div class="top_box">
      <h3>
        나의 결제수단
      </h3>
      <p class="btn">
        <router-link
          to="/customer/info/nspay/method/management"
        >
          결제수단 관리
        </router-link>
      </p>
    </div>
    <swiper
      ref="swiperNSPay"
      :options="swiperOptions"
      class="swiper_nspay"
    >
      <swiper-slide
        v-for="item in sortedNSPayList"
        :key="item.bankCardNo"
        :class="`${item.payMethod === '01' ? 'card':'account'} ${getCardandBankInfo(item.payMethod, item.bankCardCode, 'class')}`"
      >
        <p class="name">
          {{ getCardandBankInfo(item.payMethod, item.bankCardCode, 'name') }}
        </p>
        <p class="number">
          {{ item.bankCardNo }}
        </p>
      </swiper-slide>
      <swiper-slide class="btn_add">
        <button
          type="button"
          @click="$router.push('/customer/info/nspay/method/register')"
        >
          결제수단 추가
        </button>
      </swiper-slide>
    </swiper>
    <ul class="menu_list">
      <li>
        <a
          @click="onClickChangePassword"
        >
          결제 비밀번호 변경
        </a>
      </li>
      <li>
        <div class="onetouch_area">
          <div class="onetouch_tit_wrap">
            <span>원터치결제 설정</span>
          </div>
          <div class="check_switches">
            <label>
              <input
                ref="checkBoxInput"
                type="checkbox"
                title="원터치결제 사용여부 체크"
                @click="onClickNSPayOneTouchUseFlag($event)"
              >
              <div class="custom_switch">
                <div class="rail">
                  <span class="switchLabel switch_off">off</span>
                  <span class="switchLabel switch_on">on</span>
                  <span class="handle" />
                </div>
              </div>
            </label>
          </div>
        </div>
      </li>
    </ul>
    <dl class="guide">
      <dt>원터치결제란?</dt>
      <dd>6개월 내 배송 이력이 있는 배송지로 5만원 이하 NS페이 결제 시 비밀번호 입력 없이 원터치로 결제가 진행됩니다.</dd>
      <dd>NSmall 자체 보안 기준에 따라 안전한 거래임을 확인된 경우에 한하며, 보안상 추가 비밀번호를 요구할 수 있습니다.</dd>
    </dl>
  </div>
</template>

<script>
import CONST from '@constants/framework/framework'
import loginUtil from '@utils/loginUtil'
import {
  isNull,
  isOsApp,
  viewType
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import bizUtil from '@utils/bizUtil'
import popupUtil from '@frameworks/popupUtil'
import nspayMixin from '@/mixins/customer/nspayMixin'
import nativeUtil from '@frameworks/nativeUtil'

export default {
  mixins: [
    nspayMixin
  ],
  data () {
    return {
      // swiper 옵션
      swiperOptions: {
        slidesPerView: 'auto',
        spaceBetween: 8
      },
      // NSPay 결제 수단 목록
      nspayList: []
    }
  },
  computed: {
    /**
     * NSPayaList를 정렬 시킨다
     * 순서: 기본계좌-> 기본 카드 -> 계좌 -> 카드
     *
     * @returns {Array}
     */
    sortedNSPayList () {
      const nspayList = this.nspayList

      // 계좌를 앞으로 정렬
      nspayList.sort(function (a, b) {
        if (a.payMethod === '01' && b.payMethod === '16') {
          return 1
        }
        if (a.payMethod === '16' && b.payMethod === '01') {
          return -1
        }
        return 0
      })

      // 주 결제 수단을 앞으로 정렬
      nspayList.sort(function (a, b) {
        if (a.majYn === 'N' && b.majYn === 'Y') {
          return 1
        }
        if (a.majYn === 'Y' && b.majYn === 'N') {
          return -1
        }
        return 0
      })

      return nspayList
    }
  },
  created () {
    this.onLoad()
  },
  methods: {
    /**
     * 순차적 흐름이 필요한 메소드 모음
     * @returns {Promise}
     */
    async onLoad () {
      // NSPay 등록된 전체 결제수단 조회
      await this.getNSPayInfoAll()

      // 원터치 결제 사용여부 조회
      await this.getNSPayOneTouchUseCheck()
    },

    /**
     * NSPay 등록된 전체 결제수단 조회 API 호출
     * @returns {Promise}
     */
    async getNSPayInfoAll () {
      const param = {
        cmdType: 'payInfoAll',
        userId: loginUtil.userId()
      }

      const successHandling = response => {
        // 등록된 결제 수단이 없을 경우
        if (isNull(response.payInfo)) {
          // NSPay 소개 페이지로 이동
          this.$router.replace('/customer/info/nspay/intro')

        // 등록된 결제 수단이 있을 경우
        } else {
          this.nspayList = response.payInfo.payList
        }
      }

      await this.$nsaxios.post('AjaxNSWPay', param, successHandling)
    },

    /**
     * NSPay 사용여부 조회 API 호출
     * @returns {void}
     */
    getNSPayUseCheck () {
      const param = {
        cmdType: 'checkJoinWpay',
        userId: loginUtil.userId()
      }

      const successHandling = response => {
        // useYn 값이 있을 경우
        if (!(isNull(response.msg) || isNull(response.msg.useYn))) {
          window.vm = this // window.open 의 새창에서 call 하기 위함
          window.vm.callbackName = 'callbackNspayPasswordChangeResult'
          const paramPopup = {
            titleAlign: 'center',
            isShowSearch: false,
            isShowCart: false,
            orderNspayParams: {
              sendFlag: 'chgPW',
              userId: loginUtil.userId(),
              returnUrl: `https:${CONST.API_HOST}/nsmall/mobile/wpay/wpay_mob_chg_pw_res.jsp`
            }
          }
          popupUtil.show('order/OrderNspayCert.vue', paramPopup, null)
        }
      }

      this.$nsaxios.post('AjaxNSWPay', param, successHandling)
    },

    /**
     * 원터치 결제 사용여부 조회 API 호출
     * @returns {Promise}
     */
    async getNSPayOneTouchUseCheck () {
      const param = {
        cmdType: 'oneTouchUseCheck',
        userId: loginUtil.userId()
      }

      const successHandling = response => {
        // useYn 값이 있을 경우
        if (!(isNull(response.msg) || isNull(response.msg.useYn) || isNull(this.$refs.checkBoxInput))) {
          // Y/N 값을 true/false로 변환해서 저장
          this.$refs.checkBoxInput.checked = (response.msg.useYn === 'Y')
        }
      }

      await this.$nsaxios.post('AjaxNSWPay', param, successHandling)
    },

    /**
     * 원터치 결제 사용여부 변경 API 호출
     * @returns {void}
     */
    setNSPayOneTouchUseFlag () {
      const param = {
        cmdType: 'setNSPayOneTouchFlag',
        userId: loginUtil.userId(),
        onTouchFlag: !this.$refs.checkBoxInput.checked ? 'Y' : 'N'
      }

      const successHandling = response => {
        if (!(isNull(response.msg) || isNull(response.msg.resultYn) || isNull(response.msg.resultCode)) &&
          // 실패 및 미가입일 경우
          (response.msg.resultYn === 'N' && response.msg.resusltCode === '9999')) {
          messageUtil.alert('결제수단 등록 후 빠르고 편리한 NSPAY 서비스를 이용해 보세요.')
        }
      }

      this.$nsaxios.post('AjaxNSWPay', param, successHandling)
    },

    /**
     * 원터치 결제 사용여부 토글 변경 시 호출되는 함수
     * @param {Event} 체크박스 클릭 이벤트
     * @returns {void}
     */
    onClickNSPayOneTouchUseFlag (event) {
      // 기본 이벤트 막기
      if (event) {
        event.preventDefault()
      }

      // OFF에서 ON로 변경되었을 경우
      if (event.target.checked) {
        this.checkNSPayPassword()

      // ON에서 OFF로 변경되었을 경우
      } else {
        messageUtil.confirm(
          `원터치 결제는 안전한 거래임이 확인된 경우에만 진행 됩니다.

          사용하지 않으면 결제시마다 비밀번호를 입력해야 합니다`,
          () => { // 계속사용
          },
          () => { // 사용안함
            this.setNSPayOneTouchUseFlag()
            event.target.checked = !event.target.checked
          },
          '계속사용',
          '사용안함'
        )
      }
    },

    /**
     * 결제 비밀번호 변경 클릭 이벤트
     * @returns {void}
     */
    onClickChangePassword () {
      this.getNSPayUseCheck()
    },

    /**
     * 결제 비밀번호 확인
     * @returns {void}
     */
    checkNSPayPassword () {
      // 로그인이 되어 있지 않으면,
      if (!loginUtil.checkLogonStatus()) {
        bizUtil.gotoLogin()
      // 로그인이 되어 있으면,
      } else {
        window.vm = this // window.open 의 새창에서 call 하기 위함
        window.vm.callbackName = 'callbackNspayPasswordResult'
        const paramPopup = {
          titleAlign: 'center',
          isShowSearch: false,
          isShowCart: false,
          orderNspayParams: {
            sendFlag: 'checkPW',
            userId: loginUtil.userId(),
            returnUrl: `https:${CONST.API_HOST}/nsmall/mobile/wpay/wpay_mob_check_pw_res.jsp`
          }
        }
        popupUtil.show('order/OrderNspayCert.vue', paramPopup, null)
      }
    },

    /**
     * 결제 비밀번호 변경 후 호출될 callback 함수
     *
     * @param {Object} data - 비밀번호 변경 response data
     * @returns {void}
     */
    callbackNspayPasswordChangeResult (data) {
      if (isOsApp() && viewType() === 'ios') { // APP
        // this.$store.commit('popup/hide')
        nativeUtil.goBack()
      }
      if (data.params.resultCode !== '0000') {
        messageUtil.confirm(decodeURIComponent(data.params.resultMsg), null, null, '예', '취소')
      }
    },

    /**
     * 결제 비밀번호 확인 후 호출될 callback 함수
     *
     * @param {Object} data - 비밀번호 확인 response data
     * @returns {void}
     */
    callbackNspayPasswordResult (data) {
      // 성공
      if (data.params.resultCode === '0000') {
        this.setNSPayOneTouchUseFlag()
        this.$refs.checkBoxInput.checked = true
      // 실패
      } else {
        messageUtil.alert('인증번호 확인이 정상적으로 처리되지 않았습니다!.')
      }
      if (isOsApp() && viewType() === 'ios') { // APP
        // this.$store.commit('popup/hide')
        nativeUtil.goBack()
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/nspay/NSPayManagement";
</style>
