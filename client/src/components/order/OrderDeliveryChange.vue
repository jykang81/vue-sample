<template>
  <div class="order_delivery_change">
    <ul class="delivery_list">
      <li
        v-for="(item, index) in shipAddrList"
        :key="index"
      >
        <p class="name">
          {{ item.receiverName }}
          <template v-if="item.ispriamry === '1'">
            <span class="coral">기본 배송지</span>
          </template>
        </p>
        <div class="address">
          {{ destAddress1[index] }}&nbsp;{{ destAddress2[index] }}
        </div>
        <p class="phone">
          휴대폰: {{ item.phone1 }}
        </p>
        <div v-if="item.phone2 !== null && undefined !== item.phone2 && item.phone2.trim() !== ''">
          {{ item.phone2 }}
        </div>
        <p class="button">
          <button
            type="button"
            class="btn dark_gray_border"
            @click="clickUpdateDataBtn(index)"
          >
            <span>수정</span>
          </button>
          <button
            type="button"
            class="btn coral_border"
            @click="clickParentSendDataBtn(index)"
          >
            <span>선택</span>
          </button>
        </p>
      </li>
    </ul>
    <p class="bottom_button">
      <button
        type="button"
        class="btn"
        @click="clickAddressBookAddBtn()"
      >
        <span>+ 배송지 추가</span>
      </button>
    </p>
  </div>
</template>

<script>
import {
  isNull
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import loginUtil from '@utils/loginUtil'
import popupUtil from '@frameworks/popupUtil'
import orderDeliveryChangeService from '@services/order/orderDeliveryChangeService'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import bizUtil from '@utils/bizUtil'

export default {
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      globalVal: {},
      shipAddrList: [],
      destAddress1: [], // 주소
      destAddress2: [], // 상세주소
      dataFildsList: [],
      popIdx: 0
    }
  },
  created () {
    this.globalVal = this.param.globalVal

    this.getShipAddrList()
  },
  mounted () {
    // 마케팅 스크립트 적용 부분
    // GA360
    let [pageDepth1, pageDepth2, pageDepth3, pageDepth4] = window.marketingRoute.meta.depth.split('>')
    pageDepth1 = isNull(pageDepth1) ? '' : pageDepth1.trim()
    pageDepth2 = isNull(pageDepth2) ? '' : pageDepth2.trim()
    pageDepth3 = isNull(pageDepth3) ? '' : pageDepth3.trim()
    pageDepth4 = isNull(pageDepth4) ? '' : pageDepth4.trim()
    if (isNull(pageDepth1)) {
      pageDepth1 = '배송지변경'
      pageDepth2 = ''
      pageDepth3 = ''
      pageDepth4 = ''
    } else if (isNull(pageDepth2)) {
      pageDepth2 = '배송지변경'
      pageDepth3 = ''
      pageDepth4 = ''
    } else if (isNull(pageDepth3)) {
      pageDepth3 = '배송지변경'
      pageDepth4 = ''
    } else if (isNull(pageDepth4)) {
      pageDepth4 = '배송지변경'
    } else {
      pageDepth4 = `${pageDepth4}>배송지변경`
    }
    marketingUtil.ga360Logger.send({
      type: marketingUtil.ga360Logger.LOG_PAGE,
      data: {
        category: '',
        initFlag: true,
        subparams: {
          t1: pageDepth1,
          t2: pageDepth2,
          t3: pageDepth3,
          t4: pageDepth4
        }
      }
    })
  },
  methods: {
    /**
     * 배송주소록 조회
     */
    getShipAddrList () {
      try {
        const param = {
          tasknm: 'ShipAddrList',
          var: loginUtil.userId()
        }

        const successHandling = data => {
          this.shipAddrList = data.ShipAddrList

          for (let index = 0; index < data.ShipAddrList.length; index++) {
            const item = data.ShipAddrList[index]

            this.destAddress1[index] = item.address1.split('&amp;:')[0]
            this.destAddress2[index] = item.address1.split('&amp;:')[1]

            // callBack Data Setting
            const objDataFilds = item
            objDataFilds.cst_zipCode = item.zipCode
            objDataFilds.cst_addr = item.address1.split('&amp;:')[0]
            objDataFilds.cst_addrDetail = item.address1.split('&amp;:')[1]
            objDataFilds.cst_postcode = item.zipCode
            this.dataFildsList[index] = {
              data: objDataFilds
            }
          }
        }

        orderDeliveryChangeService.getShipAddrList(param, successHandling)
      } catch (e) {
        // handle exception
        messageUtil.alert(`일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.<br />(getShipAddrList)${e}`)
      }
    },
    /**
     * 선택 버튼 클릭
     * @param {Number} index - 주소 index
     */
    async clickParentSendDataBtn (index) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      this.popIdx = index
      if (!isNull(this.globalVal.deliveryInfo)) {
        this.globalVal.deliveryInfo.wrongMessage = ''
      }

      // 배송비 조회 및 계산 및 출력
      this.getShippingCharge(String(this.globalVal.mInputParams.orderId)
        , this.dataFildsList[index].data.cst_zipCode
        , this.globalVal.paymentData.deliveryList[0].ITEMS)
    },
    /**
     * 배송지 추가 버튼
     */
    async clickAddressBookAddBtn () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      const callback = result => {
        this.getShipAddrList()
      }

      popupUtil.show('order/sheet/OrderSheetAddressBookAdd', { globalVal: this.globalVal }, callback)
    },
    /**
     * 배송지 수정 버튼
     * @param {Number} index - 주소 index
     */
    async clickUpdateDataBtn (index) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      const callback = result => {
        this.getShipAddrList()
      }

      popupUtil.show('order/sheet/OrderSheetAddressBookUpdate', { globalVal: this.globalVal, item: this.shipAddrList[index] }, callback)
    },
    /**
     * 도서산간 배송가능 여부 조회
     * @param {String} orderId - 주문번호
     * @param {String} zipCode - 우편번호
     * @param {Object} ITEMS - 상품정보
     */
    getShippingCharge (orderId, zipCode, ITEMS) {
      const param = {
        tasknm: 'notrma',
        var: JSON.stringify({
          ordersId: orderId,
          addressId: ITEMS[0].addressId,
          zipcode: zipCode
        })
      }

      const successHandling = data => {
        let strRmaYNCheck = ''

        if (data.list === null || undefined === data.list || data.list.rmaNotAvailYn === null || undefined === data.list.rmaNotAvailYn) {
          strRmaYNCheck = 'N'
        } else {
          strRmaYNCheck = data.list.rmaNotAvailYn
        }

        // slctDayVal 지정배송일
        if (!isNull(this.globalVal.mInputParams.slctDayVal)) {
          this.getIslandmountain(orderId, zipCode, ITEMS, strRmaYNCheck)
        } else {
          this.getShippingChargeNext(orderId, zipCode, ITEMS, strRmaYNCheck)
        }
      }

      orderDeliveryChangeService.getShippingCharge(param, successHandling)
    },
    /**
     * 도서산간 지역체크
     * @param {String} orderId - 주문번호
     * @param {String} zipCode - 우편번호
     * @param {Object} ITEMS - 상품정보
     * @param {String} strFlag - 도서산간여부
     */
    getIslandmountain (orderId, zipCode, ITEMS, strFlag) {
      const param = {
        tasknm: 'rmacnt',
        var: zipCode
      }

      const successHandling = data => {
        // slctDayVal 지정배송일
        if (data.list.resultCd === 'Y' && this.globalVal.mInputParams.slctDayVal !== '') {
          messageUtil.alert('배송일 지정시 제주/도서지역 주문이 불가합니다.')
          return false
        } else if (data.list.resultCd === 'N') {
          this.getShippingChargeNext(orderId, zipCode, ITEMS, strFlag)
        }
      }

      orderDeliveryChangeService.getIslandmountain(param, successHandling)
    },
    /**
     * 도서산간 배송 가능 여부에 따른 처리
     * 배송비 정보 조회 및 처리
     * @param {String} orderId - 주문번호
     * @param {String} zipCode - 우편번호
     * @param {Object} ITEMS - 상품정보
     * @param {String} strFlag - 도서산간여부
     */
    getShippingChargeNext (orderId, zipCode, ITEMS, strFlag) {
      if (strFlag === 'J' || strFlag === 'D' || strFlag === 'Y') {
        // J : 도서산간 배송이 불가한 상품입니다.
        // D : 제주도 배송이 불가한 상품입니다.
        // Y : 제주도 / 도서산간 배송이 불가한 상품입니다.
        messageUtil.alert('도서산간 지역 배송 안내\n도서산간 배송지로 변경이 불가합니다.', () => {}, '확인')
        return false
      }

      const chargeParam = {
        orderId: String(orderId),
        orderItemList: [],
        zipCode
      }

      let nShipcharge = 0

      for (let i = 0; i < ITEMS.length; i++) {
        chargeParam.orderItemList.push({
          itemId: isNull(ITEMS[i].stdOrderitemsId) ? ITEMS[i].ORDERITEMS_ID : ITEMS[i].stdOrderitemsId,
          quantity: isNull(ITEMS[i].quantity) ? ITEMS[i].QUANTITY : ITEMS[i].quantity
        })

        if (ITEMS[i].SHIPCHARGE === undefined) {
          nShipcharge += Number(ITEMS[i].shipcharge)
        } else {
          nShipcharge += Number(ITEMS[i].SHIPCHARGE)
        }
        if (ITEMS[i].RMASHIPCHARGE === undefined) {
          nShipcharge += Number(ITEMS[i].rmashipcharge)
        } else {
          nShipcharge += Number(ITEMS[i].RMASHIPCHARGE)
        }
      }

      // 배송비 조회 및 처리
      this.doShippingChargeCmd(chargeParam, chargeData => {
        let nShippingCharge = 0
        if (undefined !== chargeData.msg.shippingCharge) {
          nShippingCharge = Number(chargeData.msg.shippingCharge)
        }

        if (nShipcharge !== nShippingCharge) {
          // 해당 주소로의 배송지변경은 배송비 관련 환불 또는 재결제가 필요하므로, PC 또는 고객센터를 통해 변경해주시기 바랍니다.
          messageUtil.alert('선택된 배송지는 배송비 금액이 변경되어 배송지 변경이 불가합니다.<br>고객센터(1800-0770)로 문의해 주세요.', () => {
            this.$store.commit('popup/hide', null)
          })
        } else {
          this.$store.commit('popup/hide', this.dataFildsList[this.popIdx].data)
        }
      })
    },
    /**
     * 배송비 계산 api 통신
     * @param {Object} param - 아이템 수량 object
     * @param {*} callback
     */
    doShippingChargeCmd (param, callback) {
      orderDeliveryChangeService.doShippingChargeCmd({ sandItemInfo: JSON.stringify(param) }, callback)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/OrderDeliveryChange";
</style>
