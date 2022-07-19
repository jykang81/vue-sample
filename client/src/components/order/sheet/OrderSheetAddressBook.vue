<template>
  <div class="order_sheet_address_book">
    <p v-if="mypageYn === 'Y' && shipAddrList.length === 0" class="empty">
      배송지를 등록해 주세요.
    </p>
    <ul v-else class="delivery_list">
      <li v-for="(item, index) in shipAddrList" :key="index" :class="[ordAddr.addrId === item.addressID ? 'active' : '']">
        <div class="name">
          {{ item.receiverName }}
          <template v-if="item.ispriamry === '1'">
            <span class="coral">기본 배송지</span>
          </template>
        </div>
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
            v-if="mypageYn !== 'Y'"
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
import messageUtil from '@frameworks/messageUtil'
import loginUtil from '@utils/loginUtil'
import popupUtil from '@frameworks/popupUtil'
import shippingChargeMixin from '@/mixins/order/sheet/delivery/shippingChargeMixin'
import doShippingChargeCmdMixin from '@/mixins/order/sheet/delivery/doShippingChargeCmdMixin'
import finalPaymentAmountMixin from '@/mixins/order/sheet/finalPaymentAmountMixin'
import orderSheetAddressBookService from '@services/order/sheet/orderSheetAddressBookService'
import {
  isNull
} from '@utils/commonutil/commonUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import bizUtil from '@utils/bizUtil'
import uiUtil from '@utils/uiUtil'

export default {
  mixins: [
    shippingChargeMixin,
    doShippingChargeCmdMixin,
    finalPaymentAmountMixin
  ],
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      globalVal: {},
      paymentData: {},
      ordAddr: {},
      chargeItems: {},
      consultYn: '',
      multiYn: '',
      multiIdx: 0,
      multiItemIdx: [],
      shipAddrList: [],
      destAddress1: [], // 주소
      destAddress2: [], // 상세주소
      dataFildsList: [],
      // callbackFlg: false,
      mypageYn: 'N'
    }
  },
  created () {
    this.globalVal = this.param.globalVal
    this.paymentData = this.param.paymentData
    this.ordAddr = this.param.ordAddr
    this.multiYn = this.param.multiYn
    this.multiIdx = this.param.multiIdx
    this.multiItemIdx = this.param.multiItemIdx
    this.chargeItems = this.param.chargeItems
    this.consultYn = this.param.consultYn
    this.mypageYn = this.param.mypageYn

    this.getShipAddrList()
  },
  mounted () {
    uiUtil.preventFixedElementCracking(document.querySelector('.bottom_button'))
  },
  methods: {
    /**
     * 배송주소록 조회
     */
    async getShipAddrList () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      try {
        const param = {
          tasknm: 'ShipAddrList',
          var: loginUtil.userId()
        }

        const successHandling = data => {
          this.shipAddrList = data.ShipAddrList
          this.globalVal.deliveryInfo.shipAddrLength = data.ShipAddrList.length

          if (data.ShipAddrList.length > 0) {
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
              objDataFilds.cst_addrId = item.addressID
              objDataFilds.phone1 = item.phone1
              this.dataFildsList[index] = {
                data: objDataFilds
              }
            }
          } else {
            if (this.mypageYn !== 'Y') {
              this.clickAddressBookAddBtn(true)
            }
          }
        }

        orderSheetAddressBookService.getShipAddrList(param, successHandling)
      } catch (e) {
        // handle exception
        messageUtil.alert(`일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.<br />(getShipAddrList)${e}`)
      }
    },
    /**
     * 선택 버튼 클릭
     * @param {Number} index - 선택된 주소 index
     */
    async clickParentSendDataBtn (index) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      this.globalVal.deliveryInfo.popIdx = index

      if (this.consultYn === 'N') {
        // 배송지역 변경시 적립금/예치금, 무료배송 쿠폰 초기화
        this.$root.$emit('changeShippingEmit')

        // 폼 데이터에 반영
        if (this.multiYn === 'N') {
          // 배송비 조회 및 계산 및 출력
          this.getShippingCharge(0, String(this.globalVal.mInputParams.orderId)
            , { zipCode: this.dataFildsList[index].data.cst_zipCode, addrId: this.dataFildsList[index].data.cst_addrId }
            , this.paymentData.Delivery.deliveryList[0].ITEMS)

          // this.paymentData.Delivery.setItem(0, {
          //   ADDRESS_ID: this.dataFildsList[index].data.cst_addrId
          // })
        } else {
          // 배송비 조회 및 계산 및 출력
          this.getShippingCharge(0, String(this.globalVal.mInputParams.orderId)
            , { zipCode: this.dataFildsList[index].data.cst_zipCode, addrId: '' }
            , this.chargeItems
            , '1'
            , this.multiIdx
            , this.multiItemIdx)
        }
      } else {
        // 상담신청인 경우
        this.$store.commit('popup/hide', this.dataFildsList[index].data)
      }
    },
    /**
     * 배송지 추가 버튼
     */
    async clickAddressBookAddBtn (closePop) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      let mode = ''
      if (isNull(this.shipAddrList)) {
        mode = 'default'
      } else {
        if (!this.shipAddrList.some(item => item.ispriamry === '1')) {
          mode = 'default'
        }
      }

      const param = {
        title: '배송지 추가',
        titleAlign: 'center', // 팝업 상단 타이틀 메세지 정렬 - 없으면 왼쪽 정렬
        isShowSearch: false, // 검색메뉴 안보임
        isShowCart: false, // 장바구니메뉴 안보임
        globalVal: this.globalVal,
        mode
      }

      const callback = result => {
        // if (result === undefined && this.mypageYn !== 'Y') {
        //   setTimeout(() => {
        //     if (!this.callbackFlg) {
        //       this.callbackFlg = false
        //       this.$store.commit('popup/hide', null)
        //     }
        //   }, 10)
        // } else {
        //   this.callbackFlg = true
        // this.getShipAddrList()
        // }
        if (isNull(result) && closePop) {
          setTimeout(() => {
            this.$store.commit('popup/hide', null)
          }, 10)
        } else {
          this.getShipAddrList()
        }
      }

      popupUtil.show('order/sheet/OrderSheetAddressBookAdd', param, callback)

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
            t4: '배송지추가'
          }
        }
      })
    },
    /**
     * 배송지 수정 버튼
     * @param {Number} index - 선택된 주소 index
     * @param {String} mode - 기본배송지 여부
     */
    async clickUpdateDataBtn (index, mode) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      if (!this.shipAddrList.some(item => item.ispriamry === '1')) {
        mode = 'default'
      }
      const param = {
        title: '배송지 수정',
        titleAlign: 'center', // 팝업 상단 타이틀 메세지 정렬 - 없으면 왼쪽 정렬
        isShowSearch: false, // 검색메뉴 안보임
        isShowCart: false, // 장바구니메뉴 안보임
        globalVal: this.globalVal,
        item: this.shipAddrList[index],
        mode
      }

      const callback = result => {
        this.getShipAddrList()
      }

      popupUtil.show('order/sheet/OrderSheetAddressBookUpdate', param, callback)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/sheet/OrderSheetAddressBook";
</style>
