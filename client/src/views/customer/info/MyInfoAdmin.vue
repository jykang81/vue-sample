<template>
  <div class="my_info_admin">
    <div class="info_admin_title">
      <h3>회원정보</h3>
      <p class="btn">
        <a @click="checkFacebookMember">회원정보 수정</a>
      </p>
    </div>
    <dl class="info_admin_content">
      <dt>이름</dt>
      <dd>{{ userName }}</dd>
      <dt>아이디</dt>
      <dd>{{ userLogonId }}</dd>
      <dt>연락처</dt>
      <dd>{{ userPhone }}</dd>
    </dl>
    <div class="info_admin_title">
      <h3>기본배송지</h3>
      <p class="btn">
        <a @click="deleveryAddressBook">배송지 관리</a>
      </p>
    </div>
    <dl class="info_admin_content">
      <dt>받는분</dt>
      <dd>{{ userReceiverInAddress }}</dd>
      <dt>주소</dt>
      <dd>{{ userAddressInAddress }}</dd>
      <dt>연락처</dt>
      <dd>{{ userPhoneInAddress }}</dd>
    </dl>
    <!-- 2021년 진행예정 -->
    <!-- <div class="info_admin_title">
      <h3>환불계좌 관리</h3>
      <p class="btn">
        <a href="#none">환불계좌 관리</a>
      </p>
    </div>
    <dl class="info_admin_content refund">
      <dt>김엔에스</dt>
      <dd>KEB하나은행 / 620233*****</dd>
    </dl>
    <p class="btn_refund">
      <a href="#none">회원탈퇴</a>
    </p> -->
  </div>
</template>

<script>
import MEMBER_CONST from '@/common/constants/customer/member'
import messageUtil from '@frameworks/messageUtil'
import {
  isNull
} from '@utils/commonutil/commonUtil'
import popupUtil from '@frameworks/popupUtil'
import loginUtil from '@utils/loginUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import routerUtil from '@frameworks/routerUtil'
import localStorageUtil from '@/common/frameworks/localStorageUtil'
import bizUtil from '@utils/bizUtil'

export default {
  name: 'MyInfoManage',
  data () {
    return {
      userName: '', // 이름
      userLogonId: '', // 아이디
      userPhone: '', // 연락처
      userReceiverInAddress: '', // 받는 분
      userAddressInAddress: '', // 주소
      userPhoneInAddress: '' // 연락처(배송지)
    }
  },
  computed: {
    isLogonTypeSimple () {
      const logonType = loginUtil.logonType()
      return logonType === 'simple'
    }
  },
  created () {
    bizUtil.secessionMemberCheker().then(data => {
      if (data) {
        this.onLoad()

        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_PAGE,
          data: {
            category: '',
            initFlag: true,
            subparams: {
              t1: '고객',
              t2: '내정보관리',
              t3: '',
              t4: ''
            }
          }
        })
      }
    })
  },
  methods: {
    /**
     * created 시점에 data 호출 함수
     */
    onLoad () {
      if (!loginUtil.isLoggedIn()) {
        routerUtil.back()
      }
      const invoke = {
        processFlag: 'List'
      }
      const userInfoSuccessHandling = response => {
        const personalInfo = response.msg.root.PersonalInfo
        if (!isNull(personalInfo)) {
          const logonName = response.msg.root.PersonalInfo.lastName
          const logonId = response.msg.root.PersonalInfo.logonId
          let phone = response.msg.root.PersonalInfo.phoneNum
          if (!isNull(phone)) {
            const hpFirst = phone.substring(0, 3)
            let hpMid = ''
            let hpLast = ''
            if (phone.length === 10) {
              hpMid = phone.substring(3, 6)
              hpLast = phone.substring(6)
            } else {
              hpMid = phone.substring(3, 7)
              hpLast = phone.substring(7)
            }
            phone = `${hpFirst}-${hpMid}-${hpLast}`
          }
          this.userName = logonName
          this.userLogonId = logonId
          this.userPhone = phone
        }
      }
      const userAddressSuccessHandling = response => {
        const addressList = response.msg.addressList
        if (addressList.length > 0) {
          const primaryAddress = addressList[0]
          this.userReceiverInAddress = primaryAddress.lastName
          this.userAddressInAddress = `${primaryAddress.addressBas} ${primaryAddress.addressDtl}`
          this.userPhoneInAddress = primaryAddress.phone1
        } else {
          this.userReceiverInAddress = '-'
          this.userAddressInAddress = '-'
          this.userPhoneInAddress = '-'
        }
      }
      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }
      this.$nsaxios.post('MobilePersonalInfoManageCmdReal', invoke, userInfoSuccessHandling, errorHandling)
      this.$nsaxios.post('NSShippingAddressAccessCmdReal', invoke, userAddressSuccessHandling, errorHandling)
    },
    /**
     * 내 배송지 관리 팝업 호출 함수
     */
    async deleveryAddressBook () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      const tmpGlobalVal = {
        deliveryInfo: {
          shipAddrLength: 0,
          popIdx: 0
        },
        mInputParams: {
          orderId: ''
        },
        bSetCustDeliveryMsg: true
      }

      const ordAddr = {
        zipCode: '',
        addr: '',
        addrDetail: '',
        recipientName: '',
        phone: ''
      }

      const param = {
        title: '배송지 관리',
        titleAlign: 'center', // 팝업 상단 타이틀 메세지 정렬 - 없으면 왼쪽 정렬
        isShowSearch: false, // 검색메뉴 안보임
        isShowCart: false, // 장바구니메뉴 안보임
        globalVal: tmpGlobalVal,
        paymentData: {},
        ordAddr,
        multiYn: 'N',
        multiIdx: 0,
        chargeItems: [],
        consultYn: 'N',
        mypageYn: 'Y'
      }

      popupUtil.show('order/sheet/OrderSheetAddressBook', param, () => { this.onLoad() })

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: '',
          initFlag: true,
          subparams: {
            t1: '마이페이지',
            t2: '개인정보',
            t3: '배송지관리',
            t4: ''
          }
        }
      })
    },
    /**
     * 준회원(페이스북 회원) 메뉴 접근 불가 메시지 노출
     * @returns {void}
     */
    async checkFacebookMember () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // 정회원이면
      if (!this.isLogonTypeSimple) {
        this.$router.push({ name: 'memberModify' })
      // 준회원이면,
      } else {
        messageUtil.confirm(`페이스북 로그인 회원에게는 제공하지 않는 메뉴입니다.
        회원가입 하시면 다양한 혜택과 모든 서비스를 이용하실 수 있습니다.
        적립금, 예치금 통합이 필요할 경우, 신규가입 후 고객센터(1800-0770) 으로 요청해 주세요.`,
        () => {
          const joinParams = {
            name: 'memberJoin',
            params: {
              email: loginUtil.email(),
              userName: loginUtil.userName()
            }
          }
          localStorageUtil.set('tmpFacebookMemberInfo', loginUtil.getMemberInfo())
          loginUtil.logout(joinParams)
        }, null, '회원가입 하기', '그냥 이용하기')
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/customer/info/MyInfoAdmin";
</style>
