import messageUtil from '@frameworks/messageUtil'
import {
  isNull
} from '@utils/commonutil/commonUtil'

/**
 * ValidCashReceiptMixin
 * onclick_btnPayment -> (ASIS) validCashReceipt
 */
const validCashReceiptMixin = {
  data () {
    return {
      CONST_VALID_CASH_RECEIPT: {
        CONFIRM: 'CONFIRM',
        SELECT: 'SELECT',
        PHONE_RCPT_PBLS_CD: '100',
        BIZ_RCPT_PBLS_CD: '200',
        PHONE_RECEIPT_TPYE: 'P',
        BIZ_RECEIPT_TPYE: 'B'
      }
    }
  },
  methods: {
    /**
     * 현금영수증 처리 유형 확인
     * @param {String} mode - 결제하기(CONFIRM)/결제수단선택(SELECT)
     * @returns {Boolean}
     */
    isConfirm (mode) {
      return this.CONST_VALID_CASH_RECEIPT.CONFIRM === mode
    },
    /**
     * 현금영수증 유효성 검사
     * @param {String} mode - 결제하기(CONFIRM)/결제수단선택(SELECT)
     * @returns {Boolean}
     */
    validCashReceipt (mode = '') {
      mode = isNull(mode) ? this.CONST_VALID_CASH_RECEIPT.CONFIRM : mode

      if (this.globalVal.paymentMethodInfo.checkedReceipt) {
        const receiptValue = this.globalVal.paymentMethodInfo.receiptValue.replace(/-/g, '')
        if (this.globalVal.paymentMethodInfo.isChangeReceipt) {
          const receiptType = this.globalVal.paymentMethodInfo.receiptType
          if (receiptType === this.CONST_VALID_CASH_RECEIPT.PHONE_RECEIPT_TPYE) {
            const regPhone = /^01([0|1|6|7|8|9]?)([0-9]{3,4})([0-9]{4})$/
            if (isNull(receiptValue) || !regPhone.test(receiptValue)) {
              messageUtil.alert('현금영수증 신청 정보를 확인해 주세요.')
              return false
            }
            if (this.isConfirm(mode)) {
              this.paymentData.Payment.setItem(0, {
                receipt_MobileNo: receiptValue,
                PHONE_NUM: receiptValue,
                RECEIPT_TYPE: receiptType
              })
            }
          } else if (receiptType === this.CONST_VALID_CASH_RECEIPT.BIZ_RECEIPT_TPYE) {
            if (isNull(receiptValue) || receiptValue.length !== 10) {
              messageUtil.alert('현금영수증 신청 정보를 확인해 주세요.')
              return false
            }
            const checkId = [1, 3, 7, 1, 3, 7, 1, 3, 5, 1]
            const bizId = receiptValue
            let c2
            let chkSum = 0

            for (let i = 0; i <= 7; i++) {
              chkSum += checkId[i] * bizId.charAt(i)
            }
            c2 = `0${checkId[8] * bizId.charAt(8)}`
            c2 = c2.substring(c2.length - 2, c2.length)
            chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1))
            const remainder = (10 - (chkSum % 10)) % 10

            if (Math.floor(bizId.charAt(9)) !== remainder) {
              messageUtil.alert('현금영수증 신청 정보를 확인해 주세요.')
              return false
            }
            if (this.isConfirm(mode)) {
              this.paymentData.Payment.setItem(0, {
                receipt_BusinessNo: receiptValue,
                BIZ_REG_NUM: receiptValue,
                RECEIPT_TYPE: receiptType
              })
            }
          } else {
            messageUtil.alert('현금영수증 신청 정보를 확인해 주세요.')
            return false
          }
          if (this.isConfirm(mode)) {
            this.paymentData.Payment.setItem(0, {
              RECEIPT_SAVE: this.globalVal.paymentMethodInfo.isSaveReceiptValue
            })
          }
          return true
        } else {
          // 기존 현금 영수증 정보로 처리.
          if (!isNull(this.globalVal.lastCashReceipt) && !isNull(this.globalVal.lastCashReceipt.REGI_NUM)) {
            if (this.isConfirm(mode)) {
              if (this.globalVal.lastCashReceipt.RCPT_PBLS_CD === this.CONST_VALID_CASH_RECEIPT.PHONE_RCPT_PBLS_CD) {
                this.paymentData.Payment.setItem(0, {
                  receipt_MobileNo: this.globalVal.lastCashReceipt.REGI_NUM,
                  PHONE_NUM: this.globalVal.lastCashReceipt.REGI_NUM,
                  RECEIPT_TYPE: this.CONST_VALID_CASH_RECEIPT.PHONE_RECEIPT_TPYE,
                  RECEIPT_SAVE: false
                })
              } else if (this.globalVal.lastCashReceipt.RCPT_PBLS_CD === this.CONST_VALID_CASH_RECEIPT.BIZ_RCPT_PBLS_CD) {
                this.paymentData.Payment.setItem(0, {
                  receipt_BusinessNo: this.globalVal.lastCashReceipt.REGI_NUM,
                  BIZ_REG_NUM: this.globalVal.lastCashReceipt.REGI_NUM,
                  RECEIPT_TYPE: this.CONST_VALID_CASH_RECEIPT.BIZ_RECEIPT_TPYE,
                  RECEIPT_SAVE: false
                })
              }
            }
          } else {
            const custPhone = this.paymentData.OrderUserInfo.getItem().PHONE1.replace(/-/g, '')
            const regPhone = /^01([0|1|6|7|8|9]?)([0-9]{3,4})([0-9]{4})$/

            if (isNull(custPhone) || !regPhone.test(custPhone)) {
              messageUtil.alert('현금영수증 신청 정보를 확인해 주세요.')
              if (this.isConfirm(mode)) {
                this.paymentData.Payment.setItem(0, {
                  receipt_MobileNo: '',
                  PHONE_NUM: '',
                  RECEIPT_TYPE: '',
                  RECEIPT_SAVE: false
                })
              } else {
                this.onchangeCashReceipt()
              }
              return false
            } else {
              if (this.isConfirm(mode)) {
                this.paymentData.Payment.setItem(0, {
                  receipt_MobileNo: this.paymentData.OrderUserInfo.getItem().PHONE1.replace(/-/g, ''),
                  PHONE_NUM: this.paymentData.OrderUserInfo.getItem().PHONE1.replace(/-/g, ''),
                  RECEIPT_TYPE: this.CONST_VALID_CASH_RECEIPT.PHONE_RECEIPT_TPYE,
                  RECEIPT_SAVE: false
                })
              }
            }
          }
          return true
        }
      } else {
        if (this.isConfirm(mode)) {
          this.paymentData.Payment.setItem(0, {
            receipt_MobileNo: '',
            PHONE_NUM: '',
            RECEIPT_TYPE: '',
            RECEIPT_SAVE: false
          })
        }
        return true
      }
    }
  }
}
export default validCashReceiptMixin
