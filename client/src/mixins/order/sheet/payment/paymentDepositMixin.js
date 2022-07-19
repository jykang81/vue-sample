import COMM_CONST from '@constants/framework/constants'
import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import {
  insertSeparatorDate,
  getPhoneNumber,
  isNull,
  insertSeparatorPhoneNumber,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import {
  getAddDate
} from '@frameworks/dateutil/dateUtil'
import messageUtil from '@frameworks/messageUtil'

/**
 * PaymentDepositMixin
 */
const paymentDepositMixin = {
  data () {
    return {
      // 무통장입금
      CONST_RECEIPT: {
        PHONE_MAXLENGTH: 11,
        BIZ_MAXLENGTH: 10,
        PHONE_RCPT_PBLS_CD: '100',
        BIZ_RCPT_PBLS_CD: '200',
        PHONE_RECEIPT_TPYE: 'P',
        BIZ_RECEIPT_TPYE: 'B'
      },
      receiptObject: {
        tel: '',
        biz: ''
      }
    }
  },
  methods: {
    /**
     * 은행목록
     * @returns {Array}
     */
    getBankList () {
      return this.globalVal.mOutputDatas.msg.BankAccntList || []
    },
    /**
     * 은행정보
     * @param {String} code - 은행코드
     * @returns {String}
     */
    getBankInfo (code) {
      const list = this.globalVal.mOutputDatas.msg.BankAccntList || []
      const temp = list.filter(o => {
        return o.BANKCODE === code
      })
      return temp.length > 0 ? temp[0] : null
    },
    /**
     * 무통장입금 정보설정 (ASIS: setPaymentBankTransfer)
     * @returns {void}
     */
    setDepositInfo () {
      const list = this.getBankList()
      const data = this.globalVal.mOutputDatas.msg
      if (list === null || list.length < 1) {
        return false
      }

      this.bankList = [{ value: '', text: '입금하실 은행을 선택해 주세요', data: {} }]
      for (const item of list) {
        const postText = (item.VIRTUALACCNT_FLAG === 'Y' ? (item.ACCT_NUM === 'nothing' ? '  [전용계좌신청하기]' : `  ${item.ACCT_NUM}`) : '')
        const optionItem = {
          value: item.BANKCODE,
          text: `${item.BANKNAME}${postText}`,
          data: item
        }
        this.bankList.push(optionItem)
      }

      // 무통장입금 최대입금가능날짜 지정(d+4일)
      this.depositDeadline = insertSeparatorDate(getAddDate('day', 4))
      // 결제수단별 초기화 기본데이터 저장
      this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK] = {
        DP_mobileDdd: getPhoneNumber(data.UserInfo.PHONE1, '1'),
        DP_mobileHTel: getPhoneNumber(data.UserInfo.PHONE1, '2'),
        DP_mobileNum: getPhoneNumber(data.UserInfo.PHONE1, '3'),
        DP_payDate: this.depositDeadline
      }
      this.onchangeDepositBankCd()
      this.setReceiptInfo()
    },
    /**
     * 저장된 무통장 입금 정보 설장
     * @returns {void}
     */
    setSavedDepositInfo () {
      const data = this.globalVal.mOutputDatas.msg
      const acctInfo = this.globalVal.mOutputDatas.OrderMethodSave.acctInfo.split('|') // 코드|계좌
      this.globalVal.paymentMethodInfo.selectedBank = acctInfo[0]
      this.globalVal.paymentMethodInfo.selectedBankInfo = this.getBankInfo(acctInfo[0])
      this.globalVal.paymentMethodInfo.remitter = this.globalVal.mOutputDatas.OrderMethodSave.rmitrNm
      this.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      this.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK

      // 무통장입금 최대입금가능날짜 지정(d+4일)
      this.depositDeadline = insertSeparatorDate(getAddDate('day', 4))
      // 결제수단별 초기화 기본데이터 저장
      this.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK] = {
        DP_mobileDdd: getPhoneNumber(data.UserInfo.PHONE1, '1'),
        DP_mobileHTel: getPhoneNumber(data.UserInfo.PHONE1, '2'),
        DP_mobileNum: getPhoneNumber(data.UserInfo.PHONE1, '3'),
        DP_payDate: this.depositDeadline
      }

      // 폼 데이터에 반영
      this.paymentData.Payment.setItem(0, {
        DP_custNum: this.globalVal.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER,
        DP_depositAccountNo: this.globalVal.paymentMethodInfo.selectedBankInfo.ACCT_NUM,
        DP_depositBankCd: this.globalVal.paymentMethodInfo.selectedBankInfo.BANKCODE,
        DP_bankName: `${this.globalVal.paymentMethodInfo.selectedBankInfo.BANKNAME} 은행`
      })
    },
    /**
     * 무통장입금 계좌번호 select change (ASIS: onchange_depositBankCd)
     * @returns {void}
     */
    onchangeDepositBankCd () {
      if (isNull(this.globalVal.paymentMethodInfo.selectedBank)) {
        this.depositBankText = ''
        this.depositBankAccNumText = ''
        return false
      }

      // 비회원 주문시 무통장입금 계좌번호 선택하여 조회전 본인인증 확인하도록 수정
      const authCi = this.paymentData.OrderUserInfo.getItem().CI
      const authDi = this.paymentData.OrderUserInfo.getItem().DI

      if (this.globalVal.isGuest) { // 비회원
        if (!authCi || !authDi || authCi === '' || authDi === '') {
          messageUtil.alert('주문하시는 분의 본인인증 후 재시도 해 주십시오.')
          this.globalVal.paymentMethodInfo.selectedBank = ''
          return false
        }
      }

      const replaceText = text => {
        this.bankList.map(item => {
          if (this.globalVal.paymentMethodInfo.selectedBank === item.value) {
            item.text = text
            return true
          }
          return false
        })
      }
      const replaceAccNum = accNum => {
        this.bankList.map(item => {
          if (this.globalVal.paymentMethodInfo.selectedBank === item.value) {
            item.data.ACCT_NUM = accNum
            return true
          }
          return false
        })
      }

      if (this.globalVal.isGuest) { // 비회원
        if (isNull(authCi) || isNull(authDi)) {
          messageUtil.alert('주문하시는 분의 본인인증 후 재시도 해 주십시오.')
          this.globalVal.paymentMethodInfo.selectedBank = ''
          return
        }
      }

      const bankAccnt = this.getBankInfo(this.globalVal.paymentMethodInfo.selectedBank)

      if (bankAccnt.ACCT_NUM === 'nothing') {
        // 무통장 신규계좌정보 요청
        // 조회 data의 userId의 값을 USERS_ID => CUSTOM_NUMBER
        this.$nsaxios.post('NSOrderRegistVirtualAccntAjaxCmd', { userId: this.globalVal.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER, bankName: bankAccnt.BANKNAME, bankCode: bankAccnt.BANKCODE }, data => {
          if (data && data.root && data.root.VIRTUALACCNT_NO) {
            bankAccnt.ACCT_NUM = data.root.VIRTUALACCNT_NO
            if (bankAccnt.ACCT_NUM.length > 10) {
              bankAccnt.ACCT_NUM = `${bankAccnt.ACCT_NUM.substr(0, 4)}-${bankAccnt.ACCT_NUM.substr(4, 2)}-${bankAccnt.ACCT_NUM.substr(6, 4)}-${bankAccnt.ACCT_NUM.substr(10)}`
            }
            replaceText(`${bankAccnt.BANKNAME}  ${bankAccnt.ACCT_NUM}`)
            replaceAccNum(bankAccnt.ACCT_NUM)
            this.depositBankText = `${bankAccnt.BANKNAME}은행(전용계좌)`
            this.depositBankAccNumText = bankAccnt.ACCT_NUM

            // 폼 데이터에 반영
            this.paymentData.Payment.setItem(0, {
              DP_custNum: data.root.USERS_ID,
              DP_depositAccountNo: bankAccnt.ACCT_NUM,
              DP_depositBankCd: bankAccnt.BANKCODE,
              DP_bankName: `${bankAccnt.BANKNAME} 은행`
            })
          } else {
            replaceText(`${bankAccnt.BANKNAME}:전용계좌 요청 실패`)
          }
        }, null, () => {
          replaceText(`${bankAccnt.BANKNAME}:전용계좌 요청 실패`)
        })
      } else {
        this.depositBankText = `${bankAccnt.BANKNAME}은행(전용계좌)`
        this.depositBankAccNumText = bankAccnt.ACCT_NUM

        // 폼 데이터에 반영
        this.paymentData.Payment.setItem(0, {
          DP_custNum: this.globalVal.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER,
          DP_depositAccountNo: bankAccnt.ACCT_NUM,
          DP_depositBankCd: bankAccnt.BANKCODE,
          DP_bankName: `${bankAccnt.BANKNAME} 은행`
        })
      }
    },
    /**
     * 기능확인필요, 현금영수증 정보설정 (ASIS: setReceiptInfo)
     * @returns {void}
     */
    setReceiptInfo () {
      if (isNull(this.globalVal.paymentMethodInfo.remitter)) {
        this.globalVal.paymentMethodInfo.remitter = this.paymentData.OrderUserInfo.getItem().LASTNAME || ''
      }

      if (!isNull(this.globalVal.paymentMethodInfo.remitter)) {
        this.globalVal.paymentMethodInfo.remitter = htmlDecode(this.globalVal.paymentMethodInfo.remitter)
      }

      if (!isNull(this.globalVal.lastCashReceipt) && !isNull(this.globalVal.lastCashReceipt.REGI_NUM)) {
        if (this.globalVal.lastCashReceipt.RCPT_PBLS_CD === this.CONST_RECEIPT.PHONE_RCPT_PBLS_CD) {
          const regExp = /^(\d{3})(\d{3,4})(\d{4})$/
          const match = regExp.exec(this.globalVal.lastCashReceipt.REGI_NUM)
          let result = ''

          if (match) {
            if (match[2].length === 3) {
              result = `${match[1]}***${match[3]}`
            } else {
              result = `${match[1]}****${match[3]}`
            }
          }
          this.savedReceiptValue = result
          this.globalVal.paymentMethodInfo.receiptType = this.CONST_RECEIPT.PHONE_RECEIPT_TPYE
          this.globalVal.paymentMethodInfo.checkedReceipt = true
        } else if (this.globalVal.lastCashReceipt.RCPT_PBLS_CD === this.CONST_RECEIPT.BIZ_RCPT_PBLS_CD) {
          const regExp = /^(\d{2})(\d{3})(\d{5})$/
          const match = regExp.exec(this.globalVal.lastCashReceipt.REGI_NUM)
          let result = ''

          if (match) {
            result = `${match[1]}****${match[3]}`
          }
          this.savedReceiptValue = result
          this.globalVal.paymentMethodInfo.receiptType = this.CONST_RECEIPT.BIZ_RECEIPT_TPYE
          this.globalVal.paymentMethodInfo.checkedReceipt = true
        }
      } else {
        const custPhone = this.paymentData.OrderUserInfo.getItem().PHONE1.replace(/-/g, '')
        const regExp = /^(\d{3})(\d{3,4})(\d{4})$/
        const match = regExp.exec(custPhone)
        let result = ''

        if (match) {
          if (match[2].length === 3) {
            result = `${match[1]}***${match[3]}`
          } else {
            result = `${match[1]}****${match[3]}`
          }
        }
        this.savedReceiptValue = result
        // 마지막 사용 현금영수증 정보 처리
        if (custPhone != null && custPhone === '') {
          this.onchangeCashReceipt()
          this.globalVal.paymentMethodInfo.checkedReceipt = true
          if (this.globalVal.mOutputDatas.msg.UserInfo.REGISTERTYPE === 'G') {
            this.globalVal.paymentMethodInfo.checkedReceipt = false
            this.showSavedReceiptValue = false
          }
        }
      }
      this.onchangeCashReceipt()
    },
    /**
     * 현금영수증 변경 (ASIS: changeCashReceipt)
     * @returns {void}
     */
    onchangeCashReceipt () {
      if (!this.globalVal.paymentMethodInfo.checkedReceipt) {
        this.globalVal.paymentMethodInfo.isChangeReceipt = false
        this.globalVal.paymentMethodInfo.receiptType = this.CONST_RECEIPT.PHONE_RECEIPT_TPYE
        this.globalVal.paymentMethodInfo.receiptValue = ''
        this.receiptObject.tel = this.globalVal.paymentMethodInfo.receiptValue
      } else {
        this.globalVal.paymentMethodInfo.isChangeReceipt = true
        if (!isNull(this.globalVal.lastCashReceipt) && !isNull(this.globalVal.lastCashReceipt.REGI_NUM)) {
          if (this.globalVal.lastCashReceipt.RCPT_PBLS_CD === this.CONST_RECEIPT.BIZ_RCPT_PBLS_CD) {
            if (isNull(this.globalVal.paymentMethodInfo.receiptValue)) {
              this.globalVal.paymentMethodInfo.receiptValue = this.globalVal.lastCashReceipt.REGI_NUM
            }
            this.globalVal.paymentMethodInfo.receiptType = this.CONST_RECEIPT.BIZ_RECEIPT_TPYE
            this.receiptObject.biz = this.globalVal.paymentMethodInfo.receiptValue
          } else {
            if (isNull(this.globalVal.paymentMethodInfo.receiptValue)) {
              this.globalVal.paymentMethodInfo.receiptValue = insertSeparatorPhoneNumber(this.globalVal.lastCashReceipt.REGI_NUM, '-')
            }
            this.globalVal.paymentMethodInfo.receiptType = this.CONST_RECEIPT.PHONE_RECEIPT_TPYE
            this.receiptObject.tel = this.globalVal.paymentMethodInfo.receiptValue
          }
        } else {
          if (isNull(this.globalVal.paymentMethodInfo.receiptValue)) {
            this.globalVal.paymentMethodInfo.receiptValue = insertSeparatorPhoneNumber(this.paymentData.OrderUserInfo.getItem().PHONE1, '-')
          }
          this.globalVal.paymentMethodInfo.receiptType = this.CONST_RECEIPT.PHONE_RECEIPT_TPYE
          this.receiptObject.tel = this.globalVal.paymentMethodInfo.receiptValue
        }
      }
    },
    /**
     * 현금영수증 유형선택 (ASIS: setReceiptType)
     * @returns {void}
     */
    onchangeReceiptType () {
      this.receiptTypePlaceholder = this.globalVal.paymentMethodInfo.receiptType === this.CONST_RECEIPT.PHONE_RECEIPT_TPYE ? '휴대폰 번호를 입력해 주세요.' : '사업자 등록번호를 입력해 주세요.'
      this.maxlengthReceiptValue = this.globalVal.paymentMethodInfo.receiptType === this.CONST_RECEIPT.PHONE_RECEIPT_TPYE ? this.CONST_RECEIPT.PHONE_MAXLENGTH : this.CONST_RECEIPT.BIZ_MAXLENGTH
      if (this.globalVal.paymentMethodInfo.receiptType === this.CONST_RECEIPT.BIZ_RECEIPT_TPYE) {
        this.inputTypeReceiptValue = 'number'
        this.receiptObject.biz = insertSeparatorPhoneNumber(this.receiptObject.biz, '')
      } else if (this.globalVal.paymentMethodInfo.receiptType === this.CONST_RECEIPT.PHONE_RECEIPT_TPYE) {
        this.inputTypeReceiptValue = 'tel'
        this.receiptObject.tel = insertSeparatorPhoneNumber(this.receiptObject.tel, '-')
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

      if (e.target.value.length >= this.maxlengthReceiptValue) {
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
      this.inputTypeReceiptValue = 'tel'
      if (this.globalVal.paymentMethodInfo.receiptType === this.CONST_RECEIPT.PHONE_RECEIPT_TPYE) {
        this.receiptObject.tel = insertSeparatorPhoneNumber(e.target.value, '-')
      } else {
        this.receiptObject.biz = e.target.value
      }
    },
    /**
     * 포커스 시에 '-' 삽입
     * @returns {void}
     */
    focusDashPhone () {
      this.inputTypeReceiptValue = 'number'
      if (this.globalVal.paymentMethodInfo.receiptType === this.CONST_RECEIPT.PHONE_RECEIPT_TPYE) {
        this.receiptObject.tel = insertSeparatorPhoneNumber(this.receiptObject.tel, '')
      }
    }
  }
}

export default paymentDepositMixin
