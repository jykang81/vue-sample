<template>
  <div class="order_consult_sheet_confirm">
    <label class="agree_consult">
      <input v-model="checkedAgreeForce" type="checkbox" class="checkbox square">
      <span class="check_label">{{ globalVal.confirm.textAgreeForce }}</span>
    </label>
    <button type="button" class="btn_consult" @click="onclickConsultConfirm()">
      <span>상담 신청하기</span>
    </button>
    <div v-show="globalVal.confirm.showConsultGuide" class="consult_guide">
      <p class="title">
        상담접수 상품 안내
      </p>
      <p class="change">
        상품에 따라 프로세스가 변경될 수 있습니다.
      </p>
      <ol>
        <li>
          <p class="title">
            Step1.<br>
            상담 신청하기
          </p>
          <p class="content">
            고객님이 상담신청서를 작성합니다.
          </p>
        </li>
        <li>
          <p class="title">
            Step2.<br>
            해피콜 받기
          </p>
          <p class="content">
            전문상담원과 배송 및 설치방문일자를 확정합니다.
          </p>
        </li>
        <li>
          <p class="title">
            Step3.<br>
            배송 및 설치
          </p>
          <p class="content">
            고객님께서 원하시는 곳에 상품을 배송하여 설치를 진행합니다.
          </p>
        </li>
        <li>
          <p class="title">
            Step4.<br>
            결제 안내 및 확인
          </p>
          <p class="content">
            방문기사님께 설치 확인 및 관련 안내를 받고 결제를 진행합니다.
          </p>
        </li>
      </ol>
      <p class="promise">
        NSmall은 본 상품의 상담예약신청을 대행하고 있으며,<br>
        협력업체가 책임있는 서비스를 제공해 드릴 것을 약속드립니다.
      </p>
    </div>
    <div v-show="!globalVal.confirm.showConsultGuide" class="consult_guide">
      <p class="title">
        휴대폰상품 주문단계 안내
      </p>
      <ol>
        <li>
          <p class="title">
            Step1.<br>
            상담 신청하기
          </p>
          <p class="content">
            고객님이 상담신청서를 작성합니다.
          </p>
        </li>
        <li>
          <p class="title">
            Step2.<br>
            해피콜 받기
          </p>
          <p class="content">
            전문상담원에게 상품안내 및 요금제등 가입관련 정보를 확정합니다.
          </p>
        </li>
        <li>
          <p class="title">
            Step3.<br>
            개통 및 배송
          </p>
          <p class="content">
            신청하신 휴대폰의 개통 처리 후 상품을 배송 합니다.
          </p>
        </li>
        <li>
          <p class="title">
            Step4.<br>
            개통 확인
          </p>
          <p class="content">
            개통된 휴대폰을 수령하여 사용합니다.
          </p>
        </li>
      </ol>
      <p class="promise">
        NSmall은 본 상품의 상담예약신청을 대행하고 있으며,<br>
        협력업체가 책임있는 서비스를 제공해 드릴 것을 약속드립니다.
      </p>
    </div>
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import {
  isNull,
  getPhoneNumber,
  isOsApp
} from '@utils/commonutil/commonUtil'
import routerUtil from '@frameworks/routerUtil'
import messageUtil from '@frameworks/messageUtil'
import {
  getDateParse,
  calcDate,
  getNowDate,
  getNowTime
} from '@frameworks/dateutil/dateUtil'
import loginUtil from '@utils/loginUtil'
import uiUtil from '@utils/uiUtil'
import bizUtil from '@utils/bizUtil'
import orderConsultSheetConfirmService from '@services/order/consult/orderConsultSheetConfirmService'

export default {
  components: {
  },
  props: {
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      checkedAgreeForce: false // (ASIS) chkAgreeForce3
    }
  },
  methods: {
    /**
     * 유효성 검사
     * @returns {Boolean}
     */
    validConsult () {
      // 동의하기 확인 (ASIS: onclick_OKCunsult)
      if (!this.checkedAgreeForce) {
        messageUtil.alert('개인정보 제공 및 관련 동의에 체크해 주신 이후 상담신청을 완료할 수 있습니다.')
        return false
      }

      const regPhone = /^01([0|1|6|7|8|9]?)([0-9]{3,4})([0-9]{4})$/

      // 입력값 확인 (ASIS: checkEssentialInputValues)
      // 방송소개상품 유무에 따라 분기
      if (this.globalVal.mInputParams.orderPrgrsTypeCd === '800') {
        if (this.globalVal.mInputParams.addAddressFlag === 'N') {
          this.globalVal.userInfo.showWrongUserName = false
          if (isNull(this.globalVal.userInfo.userName)) {
            this.globalVal.userInfo.showWrongUserName = true
            uiUtil.scrollMove('userInfoArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
            return false
          }
        } else {
          this.globalVal.userInfo.showWrongDelivery = false
          if (!this.globalVal.userInfo.showInputUserName) {
            if (isNull(this.globalVal.userInfo.userName) ||
              this.globalVal.userInfo.userName.length < 2) {
              this.globalVal.userInfo.showWrongDelivery = true
              uiUtil.scrollMove('userInfoArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
              return false
            }
          }

          if (isNull(this.globalVal.userInfo.fullAddress) ||
              this.globalVal.userInfo.fullAddress.length < 2) {
            this.globalVal.userInfo.showWrongDelivery = true
            uiUtil.scrollMove('userInfoArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
            return false
          }
        }

        if (this.globalVal.userInfo.showInputUserName) {
          this.globalVal.userInfo.showWrongUserName = false
          if (isNull(this.globalVal.userInfo.userName)) {
            this.globalVal.userInfo.showWrongUserName = true
            uiUtil.scrollMove('userInfoArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
            return false
          }
        }
        this.globalVal.userInfo.showWrongPhoneNo = false
        if (isNull(this.globalVal.userInfo.phoneNo)) {
          this.globalVal.userInfo.showWrongPhoneNo = true
          this.globalVal.userInfo.textWrongPhoneNo = '번호를 입력해 주세요.'
          uiUtil.scrollMove('userInfoArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          return false
        }

        if (!regPhone.test(this.globalVal.userInfo.phoneNo.replace(/-/gi, ''))) {
          this.globalVal.userInfo.showWrongPhoneNo = true
          this.globalVal.userInfo.textWrongPhoneNo = '번호를 정확히 입력해 주세요.'
          uiUtil.scrollMove('userInfoArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          return false
        }
      } else if (this.globalVal.mInputParams.orderPrgrsTypeCd !== '800') {
        this.globalVal.userInfo.showWrongDelivery = false
        if (isNull(this.globalVal.userInfo.userName) ||
            this.globalVal.userInfo.userName.length < 2) {
          this.globalVal.userInfo.showWrongDelivery = true
          uiUtil.scrollMove('userInfoArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          return false
        }

        if (isNull(this.globalVal.userInfo.fullAddress) ||
            this.globalVal.userInfo.fullAddress.length < 2) {
          this.globalVal.userInfo.showWrongDelivery = true
          uiUtil.scrollMove('userInfoArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          return false
        }

        this.globalVal.userInfo.showWrongPhoneNo = false
        if (isNull(this.globalVal.userInfo.phoneNo)) {
          this.globalVal.userInfo.showWrongPhoneNo = true
          this.globalVal.userInfo.textWrongPhoneNo = '번호를 입력해 주세요.'
          uiUtil.scrollMove('userInfoArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          return false
        }

        if (!regPhone.test(this.globalVal.userInfo.phoneNo.replace(/-/gi, ''))) {
          this.globalVal.userInfo.showWrongPhoneNo = true
          this.globalVal.userInfo.textWrongPhoneNo = '번호를 정확히 입력해 주세요.'
          uiUtil.scrollMove('userInfoArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          return false
        }

        if (this.globalVal.userInfo.checkedCallDate === 'Y') {
          if (isNull(this.globalVal.userInfo.showWrongCallDate) ||
            this.globalVal.userInfo.showWrongCallDate.length < 2) {
            this.globalVal.userInfo.showWrongCallDate = true
            uiUtil.scrollMove('userInfoArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
            return false
          }

          const currTime = getDateParse(`${calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd')} 00:00:00`)
          const maxDate = getDateParse(`${calcDate('', 0, 0, 0, 7, 'yyyy-MM-dd')} 00:00:00`)
          const selTime = getDateParse(`${this.globalVal.userInfo.callDay} 00:00:00`)
          const interval = selTime.getTime() - currTime.getTime()
          const intervalMax = selTime.getTime() - maxDate.getTime()

          if (interval < 0) {
            messageUtil.alert('상담요청일을 정확히 입력하세요.', () => {
              uiUtil.scrollMove('userInfoArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
            })
            return false
          }

          if (intervalMax > 0) {
            messageUtil.alert('상담신청일기준 7일 이후 날짜는 선택 할 수 없습니다.', () => {
              uiUtil.scrollMove('userInfoArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
            })
            return false
          }

          if (this.globalVal.userInfo.callDay.replace(/-/gi, '') === getNowDate()) {
            if (this.globalVal.userInfo.selectTime === '20' && Number(getNowTime()) >= 120000) {
              messageUtil.alert('오전/오후 구분을 정확히 선택하세요. 금일 정오가 지나 오전을 선택하실 수 없습니다.', () => {
                uiUtil.scrollMove('userInfoArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
              })
              return false
            }
          }
        } else {
          this.globalVal.userInfo.selectTime = '40'
        }
      }

      return true
    },
    /**
     * 상담 신청하기 (ASIS: onclick_OKCunsult)
     * @returns {Object}
     */
    async onclickConsultConfirm () {
      await bizUtil.secessionMemberCheker()

      if (!this.validConsult()) {
        return false
      }

      // 상담신청 요청 (ASIS: onclick_OKCunsult)
      this.requestConsultConfirm()
    },
    /**
     * 상담신청 확인요청 (ASIS: authCheckFn)
     * @returns {Object}
     */
    requestConsultConfirm () {
      orderConsultSheetConfirmService.requestConsultConfirm({ cmdType: 14 }, data => {
        if (isNull(data) || isNull(data.memberInfo)) {
          messageUtil.alert('서버와 통신이 원활하지 않습니다.', () => {
            routerUtil.back()
          })
          return false
        }

        // 휴대폰 인증 확인 (ASIS: onclick_OKCunsult)
        if (data.memberInfo.hpNoSmsAuthYn === 'Y') {
          this.executeCunsult()
        } else {
          messageUtil.alert('휴대폰 인증을 진행해주세요.', () => {
            this.globalVal.memberInfo.isUserHpnoErrorShow = false
            this.globalVal.memberInfo.isConfirmUserAuthInfoShow = true
            uiUtil.scrollMove('customerInfoArea', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
          })
          return false
        }
      })
    },
    /**
     * 상담신청 (ASIS: executeCunsulting)
     * @returns {Object}
     */
    executeCunsult () {
      let csMallId = COMM_CONST.getDefaultCatalogId()
      if (!isNull(this.globalVal.mInputParams.pgmcd)) {
        csMallId = COMM_CONST.DEFAULT_PARAMS.catalogId.tv // TV상품.
      }
      if (!isNull(this.globalVal.mInputParams.catalogId)) {
        csMallId = this.globalVal.mInputParams.catalogId
      }

      let callYear = ''
      let callMonth = ''
      let callDay = ''
      if (this.globalVal.userInfo.checkedCallDate === 'Y') {
        callYear = this.globalVal.userInfo.callDay.substring(0, 4)
        callMonth = this.globalVal.userInfo.callDay.substring(5, 7)
        callDay = this.globalVal.userInfo.callDay.substring(8, 10)
      }

      const invoke = {
        catentryId: this.globalVal.mInputParams.catentryId,
        partNumber: this.globalVal.mInputParams.partNumber,
        itemNumber: this.globalVal.mInputParams.itemNumber.replace(',', ''),
        busChnId: 'MOBIL', // Const.getBusChannelId(),
        counsPgmCd: (this.globalVal.mInputParams.pgmcd == null) ? '' : this.globalVal.mInputParams.pgmcd,
        counsBrdctDate: (this.globalVal.mInputParams.brdctDate == null) ? '' : this.globalVal.mInputParams.brdctDate,
        counsBrdctCnnlCd: (this.globalVal.mInputParams.brdctCnnlCd == null) ? '' : this.globalVal.mInputParams.brdctCnnlCd,
        csMallId,
        orderPrgrsTypeCd: this.globalVal.mInputParams.orderPrgrsTypeCd,
        goodsTypeCd: this.globalVal.mInputParams.goodsTypeCd,
        cstTypeCd: this.globalVal.mInputParams.costTypeCd,
        userId: loginUtil.userId(),
        isprimary: this.globalVal.userInfo.isPrimary,
        address_id: this.globalVal.userInfo.addressId,
        txtRecvName: this.globalVal.userInfo.userName,
        zipType: this.globalVal.userInfo.addrFlag,
        postCode1: this.globalVal.userInfo.zipCode,
        address1: this.globalVal.userInfo.addr,
        address2: this.globalVal.userInfo.addrDetail,
        txtRecvMobile1: getPhoneNumber(this.globalVal.userInfo.phoneNo, '1'),
        txtRecvMobile2: getPhoneNumber(this.globalVal.userInfo.phoneNo, '2'),
        txtRecvMobile3: getPhoneNumber(this.globalVal.userInfo.phoneNo, '3'),
        sbRecvPhoneReqTmYYYY: callYear,
        sbRecvPhoneReqTmMM: callMonth,
        sbRecvPhoneReqTmDD: callDay,
        sbRecvPhoneReq: this.globalVal.userInfo.selectTime,
        custDstnClssfNum: 1,
        orderQty: 1,
        productNm: this.globalVal.mInputParams.productName,
        intAddInfo: (this.globalVal.mInputParams.orderPrgrsTypeCd === '800' ? `${this.globalVal.userInfo.addr} ${this.globalVal.userInfo.addrDetail}` : this.globalVal.userInfo.addr)
      }

      // vdn_cd (모바일 주문 접수 응대 번호) 데이터 다음 API 호출 시 추가
      if (isOsApp()) { // App
        invoke.vdn_cd = '54101'
      } else { // Web
        invoke.vdn_cd = '54102'
      }

      // 최종 상담신청전 로그인 여부를 한번더 체크하도록 추가
      if (isNull(invoke.userId) || isNull(loginUtil.userId()) ||
          (isNull(loginUtil.logonType()) || loginUtil.logonType() === COMM_CONST.LOGON_TYPE.NONMEMBER) ||
            loginUtil.checkLogonStatus() === false) {
        messageUtil.alert('로그인이 필요한 상품입니다.', () => {
          routerUtil.back()
        })
        return false
      }

      // 방송소개상품
      if (this.globalVal.mInputParams.orderPrgrsTypeCd === '800') {
        // 해당값 초기화
        invoke.txtRecvName = ''
        invoke.txtRecvMobile = ''
        invoke.txtRecvMobile2 = ''
        invoke.txtRecvMobile3 = ''

        invoke.cmdType = 10
        invoke.txtRecvName = this.globalVal.userInfo.userName // 이용자정보
        invoke.txtRecvMobile = getPhoneNumber(this.globalVal.userInfo.phoneNo, '1') // 입력받은 연락처1
        invoke.txtRecvMobile2 = getPhoneNumber(this.globalVal.userInfo.phoneNo, '2') // 입력받은 연락처2
        invoke.txtRecvMobile3 = getPhoneNumber(this.globalVal.userInfo.phoneNo, '3') // 입력받은 연락처3

        invoke.ldinTelD = getPhoneNumber(this.globalVal.memberInfo.phone, '1') // 신청자정보 연락처1
        invoke.ldinTelH = getPhoneNumber(this.globalVal.memberInfo.phone, '2') // 신청자정보 연락처2
        invoke.ldinTelNO = getPhoneNumber(this.globalVal.memberInfo.phone, '3') // 신청자정보 연락처3

        invoke.itemNumber = this.globalVal.mInputParams.itemNumber.replace(',', '') // 단품코드
      } else {
        invoke.cmdType = 4
      }

      orderConsultSheetConfirmService.executeCunsult(invoke, data => {
        const response = data.jsonData
        // 방송소개상품 : orderPrgrsTypeCd : 800
        if (response.result === 'true') {
          this.$router.push({ name: 'orderConsultComplete', params: { mInputParams: this.globalVal.mInputParams, userInfo: this.globalVal.userInfo } })
        } else {
          messageUtil.alert('상담신청을 접수하지 못했습니다.', () => {
            routerUtil.back()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/consult/OrderConsultSheetConfirm";
</style>
