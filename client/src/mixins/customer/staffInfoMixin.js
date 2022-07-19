import nsaxios from '@frameworks/axiosUtil'
import {
  insertCommas,
  isNull
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import CONST from '@constants/framework/framework'
import MEMBER_CONST from '@constants/customer/member'
import loginUtil from '@utils/loginUtil'

const staffInfoMixin = {
  methods: {
    /**
     * 임직원 계열사 도메인 목록
     *
     * @returns {void}
     */
    getGroupDomain () {
      const successHandling = response => {
        const companyGroupList = response.companyGroupList

        const tmpList = []
        companyGroupList.forEach(function (data, idx) {
          const domain = `@${data.comm_cd_instc}`
          tmpList[idx] = {
            companyCd: data.comm_cd_val,
            domain,
            text: `${domain} ${data.comm_cd_val_dfin}`
          }
        })
        this.companyGroupList = tmpList
        this.groupDomainSelect = this.companyGroupList[0].companyCd
      }
      const errorHandling = () => {
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }
      nsaxios.post('GetCompanyGroupList', {}, successHandling, errorHandling)
    },
    /**
     * 계열사이메일과 nsmall계정연동하여 임직원신청
     *
     * @param {Object} params 사내메일아이디
     * @param {object} groupDomain 그룹사도메인파라메터
     * @returns {boolean|void}
     */
    onclickBtnCallAuth (params, domainParams) {
      const email = params.value
      if (!email) {
        this.idParams.isError = true
        this.idParams.errorMessage = MEMBER_CONST.MEMBER_TEXT.EMAIL11
        return false
      }

      const sendParams = {
        userId: loginUtil.getUserInfo('userId'),
        recipientMail: email + domainParams.domain,
        companyGroupCode: domainParams.companyCd
      }

      nsaxios.post('SendStaffAuthMail', sendParams, data => {
        if (data) {
          if (data.success) {
            messageUtil.alert(data.msg, () => {
              this.$router.push({ name: 'employeeVerificationEmailComplete' })
            })
          } else {
            this.idParams.isError = true
            this.idParams.errorMessage = data.msg
          }
        } else {
          messageUtil.alert(MEMBER_CONST.WARNING_MESSAGES.EMPLOYEER_API_FAIL)
        }
      })
    },
    /**
     *  그룹사 임직원 등록 여부 체크
     *
     *  임직원 인증 된 사용자는 세션 및 로컬스토리지 업데이트 및 정보리턴
     *  임직원 미인증 사용자  : false
     *
     */
    chkStaff () {
      nsaxios.post('GetStaffAuthInfo', { userId: loginUtil.getUserInfo('userId') }, data => {
        let retData = false
        if (data && Object.keys(data.staffInfo).length > 0) {
          retData = data.staffInfo
          const staffBnft = data.staffBnft
          loginUtil.setUserInfo('staffInfo', 'Y')
          loginUtil.setUserInfo('staffBnft', staffBnft.empYn)
        }

        if (retData) {
          this.$router.push(`/store/slot/${CONST.CATEGORY_ID_HARIM}`)
        } else {
          messageUtil.alert(MEMBER_CONST.EMPLOYEE_MSG.AUTH_FALE)
        }
      })
    },
    /** 마이페이지 그룹사 임직원 인증 여부 체크
     *
     * @returns {Promise}
    */
    async callChkStaff () {
      await nsaxios.post('GetStaffAuthInfo', { userId: loginUtil.getUserInfo('userId') }, data => {
        if (data && Object.keys(data.staffInfo).length > 0) {
          const staffInfo = data.staffInfo
          const staffBnft = data.staffBnft
          this.memberInfo.isHarimStaff = true
          if (staffBnft && staffBnft.empYn === 'Y') {
            if (staffInfo.companyGroupCode === 'NSMALL') {
              this.memberInfo.isNSStaff = true
              this.memberBenefit.staffBalance = insertCommas(isNull(staffBnft.balanceAmt, 0))
              this.staffStoreNumber = staffInfo.nsEmpTopCategoryId
            }
          }
        }
      })
    }
  }
}

export default staffInfoMixin
