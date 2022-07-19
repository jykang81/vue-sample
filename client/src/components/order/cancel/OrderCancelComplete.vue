<template>
  <div v-show="globalVal.isOrderComplete" class="order_cancel_complete">
    <div class="msg_box">
      <h2 class="subject">
        주문 취소가 완료되었습니다.
      </h2>
      <p v-show="guideMessage1List.length > 0" class="msg">
        <template v-for="(item, index1) in guideMessage1List">
          {{ item }}
          <br v-if="guideMessage1List.length > 1 && index1 === 0" :key="`guideMessage1${index1}`">
        </template>
      </p>
      <!-- <button type="button" class="btn" @click="onclickAddCart">
        <span>장바구니 담기</span>
      </button> -->
      <button type="button" class="btn" @click="onclickOrdersList">
        <span>주문내역 조회</span>
      </button>
    </div>
    <div class="msg_bullet_list">
      <strong class="title">주문 취소 안내</strong>
      <ul>
        <li v-for="(item, index2) in guideMessage2List"
            :key="`guideMessage2${index2}`"
        >
          {{ item }}
          <br v-if="guideMessage2List.length > 1 && index2 === 0">
        </li>
        <li>문의가 있으신 경우 NS홈쇼핑 모바일 상담전화 (1800-0770(유료))로 전화주시기 바랍니다.</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { PAY_TYPE_CONST } from '@/common/constants/order/order'

import addCartMixin from '@/mixins/order/cart/addCartMixin'
import loginUtil from '@utils/loginUtil'

import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  mixins: [
    addCartMixin
  ],
  props: {
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      guideMessage1List: [],
      guideMessage2List: []
    }
  },
  mounted () {
    /**
     * 신청완료
     *  - this.$root.$emit('orderCancelCompleteEmit')
     * @returns {void}
     */
    this.$root.$on('orderCancelCompleteEmit', () => {
      this.init()
    })
  },
  methods: {
    /**
     * 초기화
     * @returns {void}
     */
    init () {
      // 메시지 설정
      if (PAY_TYPE_CONST.isCreditCard(this.globalVal.paymemntMethod) ||
          (PAY_TYPE_CONST.isNSPayCreditCard(this.globalVal.paymemntMethod))) { // 신용카드,  NS페이 (신용카드)
        this.guideMessage1List.push('카드사로 결제 취소 요청이 전달되었습니다.')
        this.guideMessage1List.push('카드사 취소 처리: 평균 영업일 1~4일 소요')
        this.guideMessage2List.push('취소 기간은 카드 종류와 카드사 정책에 따라 달라질 수 있습니다.')
      } else if (PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.paymemntMethod) &&
                  this.globalVal.paymemntMethodStatus === 'M') { // 무통장(입금완료)
        this.guideMessage1List.push('등록된 환불계좌로 영업일 2일 이내에 환불됩니다.')
        this.guideMessage2List.push('취소된 내용은 주문/배송 조회 페이지에서 확인하실 수 있습니다.')
      } else if (PAY_TYPE_CONST.isMobile(this.globalVal.paymemntMethod)) { // 휴대폰소액결제
        this.guideMessage1List.push('통신사로 결제 취소 요청이 전달되었습니다.')
        this.guideMessage1List.push('휴대폰 결제 이용 한도 복구 처리: 평균 영업일 2일 이내')
        this.guideMessage2List.push('취소 기간은 이동통신사 정책에 따라 달라질 수 있습니다.')
        this.guideMessage2List.push('한도 복구가 불가한 경우 예치금 또는 고객님의 환불 계좌로 환불해드립니다.')
      } else if (PAY_TYPE_CONST.isNSPayAccountTransfer(this.globalVal.paymemntMethod)) { // NS페이 (계좌)
        this.guideMessage1List.push('영업일 2일 이내에 환불됩니다.')
        this.guideMessage2List.push('취소된 내용은 주문/배송 조회 페이지에서 확인하실 수 있습니다.')
      }

      this.setAddCart()

      // 마케팅 스크립트 적용 부분
      // Airbridge
      const orderId = this.globalVal.orderDataInfo[0].ordersId
      // const totalPrice = this.globalVal.orderDataInfo[0].totalpayment
      const airbridgeProductList = []
      this.globalVal.orderDataInfo[0].cats.forEach(function (item, index) {
        airbridgeProductList.push({
          // transactionID: orderId,
          productID: item.goodsCd, // item.orderitemsId, // 제품 ID
          name: item.catentryName, // 제품명
          price: Number(String(item.price).replaceAll(',', '')), // 가격.
          quantity: Number(String(item.quantity).replaceAll(',', '')), // 개수
          currency: 'KRW',
          position: index + 1
        })
      })
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.CANCELED, // 취소
        data: {
          transactionID: orderId,
          semanticAttributes: { // 기본 이벤트처럼 전송하면 상품정보가 넘어가지 않는다.
            products: airbridgeProductList,
            transactionID: orderId
          },
          customAttributes: {
            categoryNm: '',
            gradeNm: loginUtil.getUserInfo('gradeNm')
            // transactionDtm: `${getNowDate('-')} ${getNowTime(':')}`
          },
          action: '구매취소',
          label: '구매취소'
        }
      })
    },
    /**
     * 장바구니 담기
     * @returns {void}
     */
    onclickAddCart () {
      // E-commerce
      this.globalVal.orderDataInfo[0].cats.forEach(function (item, index) {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_03,
            params: [
              {
                id: String(item.orderitemsId),
                name: item.catentryName,
                dimension16: 'e상품'
              }
            ],
            subparams: {
              t1: '주문취소',
              t2: '장바구니담기',
              t3: item.catentryName
            }
          }
        })
      })

      this.addCart()
    },
    /**
     * 장바구니 담기 정보설정
     * @returns {void}
     */
    setAddCart () {
      const catalogId = this.globalVal.mOutputDatas.catalogId.toString()
      this.globalVal.mInputParams.invoke = { preParam: { extCatalogId_1: catalogId } }

      const data = this.globalVal.pageDataset[0]
      if (data.cats && data.cats.length > 0) {
        for (let i = 0; i < data.cats.length; i++) {
          this.addCartItems.push({
            DISP_TYPE_CD: data.cats[i].dispTypeCd,
            QUANTITY: data.cats[i].quantity === '0' ? '1' : data.cats[i].quantity,
            CATENTRY_ID: data.cats[i].catentryId,
            busChnId: data.cats[i].busChnId,
            goodsCd: data.cats[i].goodsCd
          })
        }
      }
    },
    /**
     * 주문내역조회 버튼 클릭.
     * @returns {void}
     */
    onclickOrdersList () {
      this.$store.commit('popup/hide', { result: 'SUCCESS' })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/cancel/OrderCancelComplete";
</style>
