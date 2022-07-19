/* eslint-disable */

/**
 * 임직원 상품 체크 -> (ASIS) chkStaffOnlyPrd
 */
import bizUtil from '@utils/bizUtil'
import {
  extend
} from '@utils/commonutil/commonUtil'
import externalUtil from '@utils/externalUtil'
import messageUtil from '@frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'

const checkStaffOnlyPrdMixin = {
  methods: {
    /**
     * 임직원 상품 체크
     * @param {Array} prdList - 상품목록
     * @param {String} type - init 유형
     * @returns {void}
     */
    checkStaffOnlyPrd: function (prdList, type) {
      return new Promise((reslove, reject) => {
        const arr = []
        const callback = (data, staffBnft) => {
          const msg = type === 'init' ? '임직원 전용상품입니다. 임직원 인증 후 확인하실 수 있습니다.' : '임직원 전용상품을 주문 요청하셨습니다. 임직원 인증 후 구매하실 수 있습니다.'
          if (data) {
            messageUtil.alert(msg, bizUtil.gotoMain)
            reslove(false)
          } else {
            reslove(staffBnft)
          }
        }

        for(const k in prdList){
          if (prdList.hasOwnProperty(k)) { // 소나 버그로 추가
            const v = prdList[k] || []
            const obj = {}
            let key = ''

            if (k === 'orderItemIds' || k === 'catEntryIds') {
              if (k === 'orderItemIds') {
                key = 'orderItemId'
              } else if (k === 'catEntryIds') {
                key = 'catentryId'
              }

              for (let i = 0; i < v.length; i++) {
                obj[key] = v[i]
                arr[i] = extend({}, arr[i], obj)
              }
            }
          }
        }

        externalUtil.chkStaffOnlyPrd(arr, callback)
      })
    },

    /**
     * 임직원 상품 체크 Callback
     * @param {Object} result - 임직원 상품 체크 결과
     * @param {Event} event - 결제하기 버튼 이벤트
     * @returns {void}
     */
    callbackStaffOnlyPrdByPaymentType: function (result, event) {
      if (result) {
        // NS 임직원 할인 한도 체크
        if (this.globalVal.confirmInfo.checkedEmployee && result.empYn === 'Y' && result.balanceAmt < this.globalVal.mOutputDatas.orderPrice.TOTAL_PRODUCT_AMT) {
          messageUtil.alert('임직원 잔여한도가 부족하여 임직원 할인이 적용되지 않습니다.')
          this.globalVal.activeDoubleClick = true // CurrentView.bDoubleBtn = false
          return false
        }
        // 최대구매수량
        let maxIndex = 0
        for (let i = 0; i < this.paymentData.Product.size(); i++) {
          const item = extend({}, this.paymentData.Product.getItem(i))

          // 구매제한 개수보다 구매개수가 많으면 체크
          if (item.custPrchQtyLimitYn === 'Y') {
            this.globalVal.maxCheckFlag = true
            if (this.globalVal.partNumberFlag === 0 && this.paymentData.Product.size() > 1) {
              // 신규인입
              this.globalVal.partNumberFlag = item.partNumber
              this.globalVal.maxCountFlag += Number(item.QUANTITY)
              this.globalVal.custDurSpr = item.custDurSpr
              this.globalVal.maxOrderPossQty = item.maxOrderPossQty
              this.globalVal.custPrchQtyLimitYn = item.custPrchQtyLimitYn
              this.globalVal.maxIndex = maxIndex

              this.paymentData.MaxbuyCount.setItem(maxIndex, {
                custDurSpr: this.globalVal.custDurSpr,
                partNumber: this.globalVal.partNumberFlag,
                maxquantity: this.globalVal.maxCountFlag,
                maxOrderPossQty: this.globalVal.maxOrderPossQty,
                custPrchQtyLimitYn: this.globalVal.custPrchQtyLimitYn
              })
            } else if (this.globalVal.partNumberFlag === 0 && this.paymentData.Product.size() === 1) {
              // 신규인입
              this.globalVal.maxCountFlag = Number(item.QUANTITY)
              this.globalVal.partNumberFlag = item.partNumber
              this.globalVal.custDurSpr = item.custDurSpr
              this.globalVal.maxOrderPossQty = item.maxOrderPossQty
              this.globalVal.custPrchQtyLimitYn = item.custPrchQtyLimitYn
              this.globalVal.maxIndex = maxIndex

              this.paymentData.MaxbuyCount.setItem(maxIndex, {
                custDurSpr: this.globalVal.custDurSpr,
                partNumber: this.globalVal.partNumberFlag,
                maxquantity: this.globalVal.maxCountFlag,
                maxOrderPossQty: this.globalVal.maxOrderPossQty,
                custPrchQtyLimitYn: this.globalVal.custPrchQtyLimitYn
              })
            } else if (this.globalVal.partNumberFlag != item.partNumber) {
              // 단품
              this.globalVal.maxCountFlag = Number(item.QUANTITY)
              this.globalVal.partNumberFlag = item.partNumber
              this.globalVal.custDurSpr = item.custDurSpr
              this.globalVal.maxOrderPossQty = item.maxOrderPossQty
              this.globalVal.custPrchQtyLimitYn = item.custPrchQtyLimitYn
              this.globalVal.maxIndex = maxIndex

              this.paymentData.MaxbuyCount.setItem(maxIndex, {
                custDurSpr: this.globalVal.custDurSpr,
                partNumber: this.globalVal.partNumberFlag,
                maxquantity: this.globalVal.maxCountFlag,
                maxOrderPossQty: this.globalVal.maxOrderPossQty,
                custPrchQtyLimitYn: this.globalVal.custPrchQtyLimitYn
              })

              maxIndex++
            } else if (this.globalVal.partNumberFlag === item.partNumber) {
              // 옵션

              this.globalVal.maxCountFlag += Number(item.QUANTITY)
              this.globalVal.partNumberFlag = item.partNumber
              this.globalVal.custDurSpr = item.custDurSpr
              this.globalVal.maxOrderPossQty = item.maxOrderPossQty
              this.globalVal.custPrchQtyLimitYn = item.custPrchQtyLimitYn
              this.globalVal.maxIndex = maxIndex

              this.paymentData.MaxbuyCount.setItem(maxIndex, {
                custDurSpr: this.globalVal.custDurSpr,
                partNumber: this.globalVal.partNumberFlag,
                maxquantity: this.globalVal.maxCountFlag,
                maxOrderPossQty: this.globalVal.maxOrderPossQty,
                custPrchQtyLimitYn: this.globalVal.custPrchQtyLimitYn
              })

              maxIndex++
            } else {
              this.globalVal.maxCheckFlag = false
            }
          }
        }
        // 구매수량대상이 아니면 기존 결제 부분으로 가기 this.globalVal.maxCheckFlag가  false인 경우
        if (!this.globalVal.maxCheckFlag) {
          this.onclickPayment(event)
        } else if (this.globalVal.maxCheckFlag) {
          for (let i = 0; i < this.paymentData.MaxbuyCount.MaxbuyList.length; i++) {
            const invoke = {
              cmdType: 11,
              custDurSpr: this.paymentData.MaxbuyCount.MaxbuyList[i].custDurSpr,
              partNumber: this.paymentData.MaxbuyCount.MaxbuyList[i].partNumber,
              itemCnt: this.paymentData.MaxbuyCount.MaxbuyList[i].maxquantity
            }

            const invokeOther = {
              custDurSpr: this.paymentData.MaxbuyCount.MaxbuyList[i].custDurSpr,
              partNumber: this.paymentData.MaxbuyCount.MaxbuyList[i].partNumber,
              maxquantity: this.paymentData.MaxbuyCount.MaxbuyList[i].maxquantity,
              maxOrderPossQty: this.paymentData.MaxbuyCount.MaxbuyList[i].maxOrderPossQty,
              custPrchQtyLimitYn: this.paymentData.MaxbuyCount.MaxbuyList[i].custPrchQtyLimitYn
            }

            this.onclickAfterPayment(invoke, invokeOther, event)
          }
        }
      }
    }
  }
}

export default checkStaffOnlyPrdMixin
