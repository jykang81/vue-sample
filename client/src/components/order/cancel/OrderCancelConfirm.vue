<template>
  <div v-show="!globalVal.isOrderComplete" class="order_cancel_confirm">
    <div class="btn_group">
      <button type="button" class="btn gray_border" @click="onclickCancel">
        <span>신청취소</span>
      </button>
      <button type="button" class="btn coral" @click="onclickComplete">
        <span>신청완료</span>
      </button>
    </div>
  </div>
</template>

<script>

import messageUtil from '@frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'
import {
  isNull,
  getPhoneNumber,
  extend
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import orderCancelConfirmService from '@services/order/cancel/orderCancelConfirmService'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  props: {
    globalVal: {
      type: Object,
      required: true
    },
    orderCancelInfo: {
      type: Object,
      required: true
    }
  },
  methods: {
    /**
     * 주문취소,교환,반품 신청 버튼 (ASIS: onclick_btnCancelOrder)
     * @returns {void}
     */
    onclickComplete () {
      if (!this.globalVal.doubleClick) {
        this.globalVal.doubleClick = true

        if (this.globalVal.action === 'RETURN' || this.globalVal.action === 'EXCHANGE') {
          messageUtil.alert('본 상품의 교환/반품은 상담원을 통해서 신청해 주시기 바랍니다.')
          this.globalVal.doubleClick = false
          return false
        }

        const invokeParams = {
          tasknm: 'alejandro',
          var: JSON.stringify({
            cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
            mnm: 'checkOrderStatus',
            args: { ordersId: this.globalVal.pageDataset[0].ordersId }
          })
        }

        // 상담원 처리 유무 체크 통신
        orderCancelConfirmService.checkOrderStatus(invokeParams, data => {
          if (data.list.lockedOrderYn === 'Y') { // 상담사 Lock 여부 (DB Transaction)
            messageUtil.alert('선택하신 주문은 상담원이 처리중입니다.', () => {
              routerUtil.back()
            })
            this.globalVal.doubleClick = false
            return false
          } else if (String(data.list.lastupdateall) !== String(this.globalVal.pageDataset[0].lastupdateall) ||
                      String(data.list.latestOperationId) !== String(this.globalVal.pageDataset[0].latestOperationId)) { //  주문 수정일자 & 임시 처리 순번 체크 (DB Transaction)
            messageUtil.alert('주문 상태가 변경되었습니다. 1:1 문의 또는 고객센터(1800-0770)로 문의하시기 바랍니다.', () => {
              routerUtil.back()
            })
            this.globalVal.doubleClick = false
            return false
          } else if (this.globalVal.action === 'CANCEL') {
            if (undefined !== data.list.canYn && data.list.canYn === 'N') {
              messageUtil.alert('주문취소가 불가능한 상태입니다. 1:1 문의 또는 고객센터(1688-0770)로 문의주시기 바랍니다.', () => {
                routerUtil.back()
              })
              this.globalVal.doubleClick = false
              return false
            }
          }

          const invokeParams = {
            tasknm: 'alejandro',
            var: JSON.stringify({
              cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
              mnm: 'chkRcOrderDtlStats',
              args: {
                ordersId: this.globalVal.pageDataset[0].ordersId,
                memberId: this.globalVal.pageDataset[0].memberId
              }
            })
          }

          // RC DB와 주문 상세가 다른 경우 체크 통신
          orderCancelConfirmService.chkRcOrderDtlStats(invokeParams, data => {
            if (data.list.respCd !== 'S') { // RC DB와 주문 상세가 다른 경우 (실시간 I/F)
              messageUtil.alert('주문 상태가 변경되었습니다. 1:1 문의 또는 고객센터(1800-0770)로 문의하시기 바랍니다.', () => {
                routerUtil.back()
              })
              this.globalVal.doubleClick = false
              return false
            }

            let strOrdersInfo = ''
            for (let i = 0; i < this.globalVal.pageDataset[0].cats.length; i++) {
              const objCats = this.globalVal.pageDataset[0].cats[i]
              strOrdersInfo += `${objCats.ordersId}:${objCats.stdOrderitemsId}:${objCats.status}^`
            }

            const invokeParams = {
              tasknm: 'alejandro',
              var: JSON.stringify({
                cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
                mnm: 'checkFinalOrderStatus',
                args: { ordersInfo: strOrdersInfo }
              })
            }

            // 최종 주문상태 변경 체크
            orderCancelConfirmService.checkFinalOrderStatus(invokeParams, data => {
              if (data.list.modifyOrder === 'Y') {
                messageUtil.alert('주문 상태가 변경되었습니다. 1:1 문의 또는 고객센터(1800-0770)로 문의하시기 바랍니다.', () => {
                  routerUtil.back()
                })
                this.globalVal.doubleClick = false
              } else {
                this.setOrder() // 최종 처리 진행
              }
            })
          })
          // 마케팅 스크립트 적용 부분
          // E-commerce
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
            data: {
              step: marketingUtil.ga360Logger.ECOMMERCE_STEP_10,
              params: null,
              subparams: {
                t1: '마이페이지',
                t2: '쇼핑정보',
                t3: '주문내역/배송조회',
                t4: '주문취소',
                id: String(this.globalVal.ordsid)
              }
            }
          })
        })
      }
    },
    /**
     * 최종 처리 펑션
     * @returns {void}
     */
    setOrder () {
      // 입력값 validation
      if (isNull(this.globalVal.reasonPhoneValue)) {
        messageUtil.alert('휴대폰 번호를 입력해 주세요.')
        this.globalVal.doubleClick = false
        return false
      }

      const regPhone = /^01([0|1|6|7|8|9]?)([0-9]{3,4})([0-9]{4})$/
      if (!regPhone.test(this.globalVal.reasonPhoneValue.replace(/-/gi, ''))) {
        messageUtil.alert('휴대폰 번호를 정확히 입력해 주세요.')
        this.globalVal.doubleClick = false
        return false
      }

      if (isNull(this.globalVal.reasonOptionValue)) {
        messageUtil.alert(`${this.globalVal.ACTION_TXT[this.globalVal.action]} 사유를 선택해 주세요.`)
        this.globalVal.doubleClick = false
        return false
      }

      if (this.globalVal.reasonOptionValue === '999' &&
          isNull(this.globalVal.reasonTextValue)) {
        messageUtil.alert(`${this.globalVal.ACTION_TXT[this.globalVal.action]} 사유를 입력해 주세요.`)
        this.globalVal.doubleClick = false
        return false
      }

      if (!this.globalVal.isRefund || this.globalVal.refundType === this.globalVal.REFUND_TYPE.DEPOSIT_AMT) { // 예치금
        this.globalVal.refundBankCd = ''
        this.globalVal.refundAccntOwner = ''
        this.globalVal.refundAccntNo = ''
      } else if (this.globalVal.refundType === this.globalVal.REFUND_TYPE.ACCOUNT) { // 계좌환불
        if (isNull(this.globalVal.refundBankCd) ||
            isNull(this.globalVal.refundAccntOwner) ||
            isNull(this.globalVal.refundAccntNo)) {
          messageUtil.alert('환불 계좌정보를 입력하세요.')
          this.globalVal.doubleClick = false
          return false
        }
      }

      // cats
      for (let i = 0; i < this.globalVal.pageDataset[0].cats.length; i++) {
        // 취소,교환,반품 사유 추가
        const info = {
          ordersId: this.globalVal.pageDataset[0].cats[i].ordersId,
          rsn: this.globalVal.reasonOptionValue,
          rsnDesc: this.globalVal.reasonOptionText,
          phone11: getPhoneNumber(this.globalVal.reasonPhoneValue, '1'),
          phone12: getPhoneNumber(this.globalVal.reasonPhoneValue, '2'),
          phone13: getPhoneNumber(this.globalVal.reasonPhoneValue, '3'),
          rsnDtl: this.globalVal.reasonTextValue
        }
        if (this.globalVal.action === 'CANCEL') { // 취소신청.
          info.occurType = '600'
          this.globalVal.pageDataset[0].cats[i].cancelInfo = info
        } else if (this.globalVal.action === 'EXCHANGE') { // 교환신청
          info.occurType = '200'
          this.globalVal.pageDataset[0].cats[i].exchangeInfo = info
        } else if (this.globalVal.action === 'RETURN') { // 반품신청
          info.occurType = '100'
          this.globalVal.pageDataset[0].cats[i].returnInfo = info
        }

        // 교환,반품 일 경우, 수거정보 추가
        if (this.globalVal.action === 'EXCHANGE' || this.globalVal.action === 'RETURN') {
          // 수거정보 추가
          this.globalVal.pageDataset[0].cats[i].pickupInfo = {
            ordersId: this.globalVal.pageDataset[0].cats[i].ordersId,
            type: '2', // 2:택배수거
            conv_dt: '',
            conv_tel11: '',
            conv_tel12: '',
            conv_tel13: '',
            addressId: this.globalVal.pageDataset[0].cats[i].orgship.addressId,
            deliv_name: this.globalVal.pageDataset[0].cats[i].orgship.lastname,
            deliv_tel11: this.globalVal.pageDataset[0].cats[i].orgship.phone11,
            deliv_tel12: this.globalVal.pageDataset[0].cats[i].orgship.phone12,
            deliv_tel13: this.globalVal.pageDataset[0].cats[i].orgship.phone13,
            deliv_tel21: this.globalVal.pageDataset[0].cats[i].orgship.phone21,
            deliv_tel22: this.globalVal.pageDataset[0].cats[i].orgship.phone22,
            deliv_tel23: this.globalVal.pageDataset[0].cats[i].orgship.phone23,
            deliv_ziptype: this.globalVal.pageDataset[0].cats[i].orgship.ziptype,
            deliv_zipcd1: this.globalVal.pageDataset[0].cats[i].orgship.zipcode1,
            deliv_zipcd2: this.globalVal.pageDataset[0].cats[i].orgship.zipcode2,
            deliv_addr1: this.globalVal.pageDataset[0].cats[i].orgship.address1,
            deliv_addr2: this.globalVal.pageDataset[0].cats[i].orgship.address2
          }
        }
      }

      // orderitems
      for (let i = 0; i < this.globalVal.pageDataset[0].orderitems.length; i++) {
        let data = {}
        for (let j = 0; j < this.globalVal.pageDataset[0].cats.length; j++) {
          if (this.globalVal.pageDataset[0].orderitems[i].ordercatsKey === this.globalVal.pageDataset[0].cats[j].ordercatsKey) {
            data = this.globalVal.pageDataset[0].cats[j]
            break
          }
        }

        // 취소,교환,반품 사유 추가
        if (this.globalVal.action === 'CANCEL') { // 취소신청.
          this.globalVal.pageDataset[0].orderitems[i].cancelInfo = data.cancelInfo
          this.globalVal.pageDataset[0].orderitems[i].cancelInfo.orderitemsId = this.globalVal.pageDataset[0].orderitems[i].orderitemsId
        } else if (this.globalVal.action === 'EXCHANGE') { // 교환신청
          this.globalVal.pageDataset[0].orderitems[i].exchangeInfo = data.exchangeInfo
          this.globalVal.pageDataset[0].orderitems[i].exchangeInfo.orderitemsId = this.globalVal.pageDataset[0].orderitems[i].orderitemsId
        } else if (this.globalVal.action === 'RETURN') { // 반품신청
          this.globalVal.pageDataset[0].orderitems[i].returnInfo = data.returnInfo
          this.globalVal.pageDataset[0].orderitems[i].returnInfo.orderitemsId = this.globalVal.pageDataset[0].orderitems[i].orderitemsId
        }
      }

      if (this.globalVal.action === 'CANCEL') { // 취소신청.
        // 결제 취소정보
        const paymCncls = []

        if (this.globalVal.pageDataset[0].paymCncls && this.globalVal.pageDataset[0].paymCncls.length > 0) {
          for (let i = 0; i < this.globalVal.pageDataset[0].paymCncls.length; i++) {
            paymCncls.push(this.globalVal.pageDataset[0].paymCncls[i])
          }
        }

        this.globalVal.pageDataset[0].paymCncls = paymCncls
      }

      // 전체 주문아이템에 대한 환불정보.
      const refundInfo = { // 환불정보.
        ordersId: this.globalVal.pageDataset[0].ordersId,
        newHistSeq: this.globalVal.pageDataset[0].newHistSeq,
        type: this.globalVal.refundType,
        typeDesc: (this.globalVal.refundType === this.globalVal.REFUND_TYPE.DEPOSIT_AMT ? 'NS예치금' : '계좌'),
        bankCd: this.globalVal.refundBankCd, // 환불계좌은행코드
        bankNm: (!isNull(this.globalVal.refundBankCd) ? this.globalVal.refundBankText : ''),
        accntOwner: this.globalVal.refundAccntOwner, // 계좌소유주
        accntNo: this.globalVal.refundAccntNo, // 계좌번호
        refundAmt: this.globalVal.pageDataset[0].refundActSum
      }
      this.globalVal.pageDataset[0].refundInfo = refundInfo

      // 신규 주소 정보
      this.globalVal.pageDataset[0].newAddrs = []

      // 주문변경/취소 실행 (3단계)
      const invokeparams = {
        pageData: JSON.stringify(this.globalVal.pageDataset)
      }
      this.executeOrderAppr(invokeparams, data => {
        // success
        if (data.msg && data.msg.root && data.msg.root.orders) {
          // 취소,교환,반품 완료 정보
          if (data.paymentList && data.paymentList.paymentList && data.paymentList.paymentList.length > 0) {
            for (let i = 0; i < data.paymentList.paymentList.length; i++) {
              console.debug(`주문${this.globalVal.ACTION_TXT[this.globalVal.action]} 완료 paymentList = ${JSON.stringify(data.paymentList.paymentList[i])}`)
            }
          }

          // 취소완료 alert
          let alertText = ''
          if (this.globalVal.action === 'EXCHANGE') {
            alertText = '교환이 정상적으로 신청되었습니다.'
          } else if (this.globalVal.action === 'RETURN') {
            alertText = '반품이 정상적으로 신청되었습니다.'
          }

          if (this.globalVal.action === 'CANCEL') {
            const lastFullLayerElement = document.querySelectorAll('.full_layer:last-child')[0]
            if (lastFullLayerElement) {
              lastFullLayerElement.scrollTo(0, 0)
            }

            this.$root.$emit('orderCancelCompleteEmit')
            this.orderCancelInfo.result = 'SUCCESS'
            setTimeout(() => {
              this.globalVal.isOrderComplete = true
            }, 30)
          } else {
            messageUtil.alert(alertText, () => {
              this.$store.commit('popup/hide', { result: 'SUCCESS' })
            })
          }
        } else if (data.msg.root.errorMsg) {
          const errorMessage = data.msg.root.errorMsg.replace(/java.lang.Exception:/g, '')
          messageUtil.alert(errorMessage,
            () => {
              this.orderCancelInfo.result = 'FAIL'
              this.$store.commit('popup/hide', { result: 'FAIL' })
            })
        }
      })
    },
    /**
     * 주문변경/취소 실행 (3단계)
     * @param {Object} invokeParams - 요청 파라미터
     * @param {Function} callback - 요청완료 후 처리
     * @returns {void}
     */
    executeOrderAppr (invokeparams, callback) {
      invokeparams.tasknm = this.globalVal.action
      invokeparams.subTasknm = 'execute'
      invokeparams.counselorOrderCancel = this.globalVal.counselor // 상담사 카드취소 추가
      this.doModifyOrderCmd(invokeparams, callback)
    },
    /**
     * 주문취소/교환/반품 요청.
     * @param {Object} invokeParams - 요청 파라미터
     * @param {Function} callback - 요청완료 후 처리
     * @returns {void}
     */
    doModifyOrderCmd (invokeParams, callback) {
      invokeParams = extend({
        userId: loginUtil.userId(),
        ordsid: this.globalVal.ordsid,
        tidx: (this.globalVal.mInputParams.tabIndex || 'N'),
        channel: 'mobile'
      }, invokeParams)

      orderCancelConfirmService.doModifyOrderCmd(invokeParams, callback)
    },
    /**
     * 신청취소
     * @returns {void}
     */
    onclickCancel () {
      messageUtil.confirm('신청을 취소하시겠습니까?', () => {
        this.$store.commit('popup/hide', { result: 'CANCEL' })
      }, () => {}, '확인', '취소')
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/cancel/OrderCancelConfirm";
</style>
