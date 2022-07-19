<template>
  <div class="order_complete">
    <order-complete-message v-if="isLoadChildComponent" :global-val="globalVal" />
    <order-complete-detail v-if="isLoadChildComponent" :global-val="globalVal" />
    <order-complete-payment v-if="isLoadChildComponent" :global-val="globalVal" />
    <order-complete-confirm v-if="isLoadChildComponent" :global-val="globalVal" />
  </div>
</template>

<script>
import bizUtil from '@utils/bizUtil'

import OrderCompleteMessage from '@/views/order/complete/OrderCompleteMessage'
import OrderCompleteDetail from '@/views/order/complete/OrderCompleteDetail'
import OrderCompletePayment from '@/views/order/complete/OrderCompletePayment'
import OrderCompleteConfirm from '@/views/order/complete/OrderCompleteConfirm'
import loginUtil from '@utils/loginUtil'
import COMM_CONST from '@constants/framework/constants'
import {
  viewType,
  isNull,
  isOsApp
} from '@utils/commonutil/commonUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import nsaxios from '@frameworks/axiosUtil'
import orderCompleteService from '@services/order/complete/orderCompleteService'

export default {
  components: {
    OrderCompleteMessage,
    OrderCompleteDetail,
    OrderCompletePayment,
    OrderCompleteConfirm
  },
  data () {
    return {
      isLoadChildComponent: false,

      globalVal: {
        mInputParams: {}, // (ASIS) m_inputParams
        mOutputDatas: {
          msg: {
            paymentList: null
          }
        }, // (ASIS) m_outputDatas

        // 띠베너 정보
        lineBannerInfo: [],

        // 주문완료 - 상단정보
        messageInfo: {
          paymentList: null
        },

        // 주문완료 - 주문내역
        detailInfo: {
        },

        // 주문완료 - 결제정보
        paymentInfo: {
        },

        // 주문완료 - 하단정보
        confirmInfo: {
        },

        // 결제관련 데이터
        paymentData: {
          productList: null,
          deliveryList: null,
          discountList: null,
          paymentList: null,
          partnershipList: null,
          orderUserInfo: null
        }
      }
    }
  },
  async created () {
    if (isOsApp()) {
      window.scroll(0, document.body.scrollHeight)
      setTimeout(() => {
        // 상단으로 이동
        window.scroll(0, 0)
      }, 100)
    }
    this.globalVal.mInputParams = this.$route.params
    if (!this.globalVal.mInputParams.ordersId) {
      bizUtil.gotoMain()
      return false
    }

    // 띠배너
    /*
    if (this.globalVal.mInputParams.busChnId === 'TV' ||
       this.globalVal.mInputParams.busChnId === 'TCOMM' ||
       this.globalVal.mInputParams.busChnId === 'CTCOM') {
      this.lineBanner()
    }
    */
    this.lineBanner()
    this.init()
  },
  methods: {
    /**
     * 띠배너
     */
    lineBanner () {
      orderCompleteService.nsEspotCommon({
        espotInfo: 'MOB_ORDER_BANNERLIST|Content'
      }, data => {
        if (!isNull(data) && !isNull(data.msg)) {
          for (const item of data.msg.root._MOB_ORDER_BANNERLIST) {
            if (!isNull(item.clickTarget)) {
              this.globalVal.lineBannerInfo.push(item)
            }
          }
        }
      })
    },
    /**
     * 초기화
     */
    init () {
      const parseJSON = function (key, value) {
        if (value == null || value.length === 0) {
          return []
        }

        const jsonString = Array.isArray(value) ? value[0] : value
        const jsonObject = JSON.parse(jsonString)
        return jsonObject[key]
      }

      // init
      this.globalVal.paymentData.productList = parseJSON('productList', this.globalVal.mInputParams.msg.productList)
      this.globalVal.paymentData.deliveryList = parseJSON('deliveryList', this.globalVal.mInputParams.msg.deliveryList)
      this.globalVal.paymentData.discountList = parseJSON('discountList', this.globalVal.mInputParams.msg.discountList)
      this.globalVal.paymentData.paymentList = parseJSON('paymentList', this.globalVal.mInputParams.msg.paymentList)
      this.globalVal.paymentData.partnershipList = parseJSON('partnershipList', this.globalVal.mInputParams.partnershipList)
      this.globalVal.paymentData.orderUserInfo = parseJSON('orderUserInfo', this.globalVal.mInputParams.orderUserInfo)
      this.globalVal.mOutputDatas.msg.paymentList = parseJSON('paymentList', this.globalVal.mInputParams.msg.paymentList)

      // OrderCompleteMessage
      this.globalVal.messageInfo.ordersId = this.globalVal.mInputParams.ordersId
      this.globalVal.messageInfo.paymentList = this.globalVal.paymentData.paymentList
      this.globalVal.messageInfo.deliveryList = this.globalVal.paymentData.deliveryList

      // OrderCompleteDetail
      this.globalVal.detailInfo.deliveryList = this.globalVal.paymentData.deliveryList
      this.globalVal.detailInfo.productList = this.globalVal.paymentData.productList

      // OrderCompletePayment
      this.globalVal.paymentInfo.bDiscount33selected = this.globalVal.mInputParams.bDiscount33selected
      this.globalVal.paymentInfo.bDiscount33selected = this.globalVal.mInputParams.bDiscount33selected
      this.globalVal.paymentInfo.orderPrice = this.globalVal.mInputParams.orderPrice
      this.globalVal.paymentInfo.expectAccmAmt = this.globalVal.mInputParams.expectAccmAmt
      this.globalVal.paymentInfo.paymentList = this.globalVal.paymentData.paymentList
      this.globalVal.paymentInfo.discountList = this.globalVal.paymentData.discountList

      this.isLoadChildComponent = true

      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: '',
          initFlag: true,
          subparams: {
            t1: '주문/결제',
            t2: '주문완료',
            t3: '',
            t4: ''
          }
        }
      })
      // 네이버 프리미엄
      marketingUtil.naverLogger.send({ // 유입
        type: marketingUtil.naverLogger.TRACE_INFLOW
      })
      // 네이버 프리미엄 로그
      marketingUtil.naverLogger.send({ // 전환
        type: marketingUtil.naverLogger.TRACE_TRANS,
        data: {
          strTranSoft: '1',
          strTranValue: '1' // String(this.globalVal.paymentInfo.orderPrice.TOTAL_PRODUCT_AMT)
        }
      })

      this.globalVal.paymentData.productList.forEach((item, index) => {
        const params = {
          rcmdGbn: 'PRODUCT',
          rcmdValue: item.GOODSPARTNUMBER
        }
        let happyDealProduct = 'N'
        if (!isNull(this.globalVal.mInputParams.isFlashSaleNew[index])) {
          happyDealProduct = this.globalVal.mInputParams.isFlashSaleNew[index]
        } else {
          happyDealProduct = 'N'
        }
        nsaxios.post('NSRcmdCmd', params, function (data) {
          // AIQUA - User Event : product_purchased
          marketingUtil.aiquaLogger.send({
            type: marketingUtil.aiquaLogger.USER_EVENT,
            data: {
              event: 'product_purchased',
              params: {
                md_name: data.msg.empNm,
                md_team_name: data.msg.orgNm,
                product_id: item.GOODSPARTNUMBER,
                product_name: item.PRODUCT_NAME,
                product_image_url: `https:${item.IMG}`,
                product_price: Number(String(item.BasePrice).replaceAll(',', '')),
                product_channel: item.BUSCHN_ID,
                happydeal_product: happyDealProduct
              }
            }
          })
        })
      })

      // E-commerce
      const productArray = []
      // 쿠폰
      let couponNum = ''
      for (let i = 0; i < this.globalVal.paymentData.discountList.length; i++) {
        if (this.globalVal.paymentData.discountList[0].couponList.length !== 0) {
          couponNum = this.globalVal.paymentData.discountList[0].couponList[0].CP_IDFR
          for (let j = 0; j < this.globalVal.paymentData.discountList[i].couponList.length; j++) {
            const num = this.globalVal.paymentData.discountList[i].couponList[j].CP_IDFR
            couponNum += `/${num}`
          }
        } else {
          couponNum = ''
        }
      }

      let payType = ''
      const type = this.globalVal.paymentInfo.paymentList[0].payType
      if (type === '100') {
        payType = '신용카드'
      } else if (type === '200') {
        payType = '무통장입금'
      } else if (type === '300') {
        payType = '실시간계좌이체'
      } else if (type === '400') {
        payType = '휴대폰결제'
      } else if (type === '1400') {
        payType = 'PAYCO'
      } else if (type === '1500') {
        payType = '네이버'
      } else if (type === '1600') {
        payType = 'NS페이 신용카드'
      } else if (type === '1700') {
        payType = 'NS페이 계좌이체'
      }

      let balance = '' // 예치금
      let savedMoney = '' // 적립금
      let nsGiftCard = '' // NS상품권
      if (!isNull(this.globalVal.paymentData.paymentList)) {
        for (let i = 0; i < this.globalVal.paymentData.paymentList.length; i++) {
          const paymentType = this.globalVal.paymentData.paymentList[i].payType
          if (paymentType === '500') { // 예치금
            balance = this.globalVal.paymentData.paymentList[i].payAmt
          } else if (paymentType === '600') { // 적립금
            savedMoney = this.globalVal.paymentData.paymentList[i].payAmt
          } else if (paymentType === '700') { // NS상품권
            nsGiftCard = this.globalVal.paymentData.paymentList[i].payAmt
          }
        }
      }

      let discount = '' // 카드선할인
      let discountCard = '' // 카드 일시불할인
      let couponId = '' // 쿠폰
      // const promotionCoupon = '' // 마케팅 쿠폰
      for (let i = 0; i < this.globalVal.paymentData.discountList.length; i++) {
        if (!isNull(this.globalVal.paymentData.discountList[i].couponList)) {
          for (let j = 0; j < this.globalVal.paymentData.discountList[0].couponList.length; j++) {
            if (this.globalVal.paymentData.discountList[0].couponList[j].ListName === 'LSP') {
              discount = this.globalVal.paymentData.discountList[i].couponList[j].DiscountPrice
            } else if (this.globalVal.paymentData.discountList[0].couponList[j].ListName === 'cardPreDc') {
              discountCard = this.globalVal.paymentData.discountList[i].couponList[j].DiscountPrice
            } else if (this.globalVal.paymentData.discountList[0].couponList[j].ListName === '1') {
              if (this.globalVal.paymentData.discountList[i].couponList[j].WWW_AMT === '0') {
                couponId = `상품${this.globalVal.paymentData.discountList[i].couponList[j].WWW_RATE}%할인`
              } else {
                couponId = `상품${this.globalVal.paymentData.discountList[i].couponList[j].WWW_AMT}원할인`
              }
            }
            // 추후 확정 시 사용
            //  else if (this.globalVal.paymentData.discountList[i].couponList[j].ListName !== '3') { // 마케팅 쿠폰 미정
            //   if (this.globalVal.paymentData.discountList[i].couponList[j].WWW_AMT === '0') {
            //     promotionCoupon = `상품${this.globalVal.paymentData.discountList[i].couponList[j].WWW_RATE}%할인`
            //   } else {
            //     promotionCoupon = `상품${this.globalVal.paymentData.discountList[i].couponList[j].WWW_AMT}원할인`
            //   }
            // }
          }
        }
      }
      const item = this.globalVal.paymentData.productList
      for (let k = 0; k < item.length; k++) {
        // 제품_상품 유형
        let type = ''
        let type2 = ''
        if (item[k].BUSCHN_ID === 'INT') {
          type = 'e상품'
        } else if (item[k].BUSCHN_ID === 'CTCOM') {
          type = 'eTV'
          type2 = 'Shop+'
        } else if (item[k].BUSCHN_ID === 'TV') {
          type = 'eTV'
          type2 = 'NSLIVE'
        }

        // 옵션
        let value = ''
        if (item[k].BUSCHN_ID === 'INT') {
          if (!isNull(item[k].ATTRIBUTES[0].NAME)) {
            value = item[k].ATTRIBUTES[0].NAME
          } else {
            value = null
          }
        } else {
          if (!isNull(item[k].ATTRIBUTES[0].VALUE)) {
            value = item[k].ATTRIBUTES[0].VALUE
          } else {
            value = null
          }
        }

        // 카테고리
        let cate = ''
        if (!isNull(this.globalVal.mInputParams.productCategoryName)) {
          cate = this.globalVal.mInputParams.productCategoryName[`partNum_${item[k].GOODSPARTNUMBER}.cate1Nm`]
          if (!isNull(this.globalVal.mInputParams.productCategoryName[`partNum_${item[k].GOODSPARTNUMBER}.cate2Nm`])) {
            cate = `${cate}/${this.globalVal.mInputParams.productCategoryName[`partNum_${item[k].GOODSPARTNUMBER}.cate2Nm`]}`
          }
          if (!isNull(this.globalVal.mInputParams.productCategoryName[`partNum_${item[k].GOODSPARTNUMBER}.cate3Nm`])) {
            cate = `${cate}/${this.globalVal.mInputParams.productCategoryName[`partNum_${item[k].GOODSPARTNUMBER}.cate3Nm`]}`
          }
          if (!isNull(this.globalVal.mInputParams.productCategoryName[`partNum_${item[k].GOODSPARTNUMBER}.cate4Nm`])) {
            cate = `${cate}/${this.globalVal.mInputParams.productCategoryName[`partNum_${item[k].GOODSPARTNUMBER}.cate4Nm`]}`
          }
          if (!isNull(this.globalVal.mInputParams.productCategoryName[`partNum_${item[k].GOODSPARTNUMBER}.cate5Nm`])) {
            cate = `${cate}/${this.globalVal.mInputParams.productCategoryName[`partNum_${item[k].GOODSPARTNUMBER}.cate5Nm`]}`
          }
        }

        productArray.push({
          id: String(item[k].GOODSPARTNUMBER),
          name: item[k].PRODUCT_NAME,
          brand: item[k].BRAND_KOR_NM,
          category: cate,
          price: Number(String(this.globalVal.mInputParams.orderItemAmount[k]).replaceAll(',', '')),
          quantity: Number(String(item[k].QUANTITY).replaceAll(',', '')),
          variant: value,
          coupon: couponId,
          dimension15: '', // promotionCoupon
          dimension16: type,
          dimension20: type2
        })
      }
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_09,
          params: productArray,
          subparams: {
            t1: '주문/결제',
            t2: '주문완료',
            checkout_option: '',
            ordersid: String(this.globalVal.mInputParams.orderId),
            revenue: this.globalVal.paymentInfo.orderPrice.FINAL_PAYMENT_AMT,
            coupon: couponNum,
            shipping: this.globalVal.mInputParams.orderPrice.SHIP_CHARGE,
            dimension14: `${payType}_${this.globalVal.paymentInfo.paymentList[0].DP_bankName}`,
            totaldiscount: this.globalVal.mInputParams.orderPrice.TOTAL_SALE_AMT, // 최종할인금액
            nsgift: nsGiftCard, // NS상품권
            cash1: balance, // 사용예치금
            cash2: savedMoney, // 사용적립금
            savecash: this.globalVal.paymentInfo.expectAccmAmt, // 예상 적립포인트
            discountdelivery: this.globalVal.paymentInfo.orderPrice.freeShippingDcAmt, // 배송비할인
            discountprice: this.globalVal.paymentInfo.paymentList[0].OFFER_AMT, // 가격할인
            discountcoupon: this.globalVal.paymentInfo.orderPrice.couponDcAmt, // 쿠폰할인
            discount1: discount, // this.globalVal.paymentInfo.orderPrice.cardDcAmt, // 카드일시불할인
            discountcard: discountCard // 카드선할인
          },
          product_list: String(this.globalVal.mInputParams.orderId)
        }
      })

      let numberOfProducts = 0
      let pointUsed = 0
      this.globalVal.mInputParams.orderItemQuantitys.forEach((item, index) => {
        numberOfProducts += Number(item[index])
      })
      this.globalVal.mOutputDatas.msg.paymentList.forEach((item, index) => {
        if (item.payType === '600') {
          pointUsed = item.payAmt
        }
      })
      let paymentCard = ''
      if (this.globalVal.paymentInfo.paymentList[0].payType === '100') {
        if (this.globalVal.paymentInfo.paymentList[0].EP_card_cd === '016' && this.globalVal.paymentInfo.paymentList[0].KvpCardCode.substring(6, 8) === '90') {
          paymentCard = '카카오뱅크'
        } else {
          paymentCard = bizUtil.getCreditCardCodeName(this.globalVal.paymentInfo.paymentList[0].EP_usedcard_code)
        }
      } else {
        paymentCard = ''
      }
      // AIQUA
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_PROFILE,
        data: {
          userId: loginUtil.getUserInfo('custNum'),
          name: '', // loginUtil.getUserInfo('userName'),
          email: '', // loginUtil.getUserInfo('email'),
          phoneNumber: '', // loginUtil.getUserInfo('telNo'),
          birthday: '', // loginUtil.getUserInfo('birthday'),
          gender: '', // loginUtil.getUserInfo('gender'),
          loginStatus: loginUtil.getUserInfo('loginyn'),
          devicePushAgree: '', // pushState,
          notificationModifiedDate: null, // 푸쉬 마케팅 수신 동의 처리 일시
          isEmployee: loginUtil.getUserInfo('staffBnft'),
          level: loginUtil.getUserInfo('gradeNm'),
          coCd: COMM_CONST.getCocd(),
          lastLogin: '' // qg_fileter_last_login 값
        }
      })
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'payment_info_added',
          params: {
            payment_method: this.globalVal.paymentInfo.paymentList[0].payType,
            payment_card: paymentCard
          }
        }
      })
      marketingUtil.aiquaLogger.send({
        type: marketingUtil.aiquaLogger.USER_EVENT,
        data: {
          event: 'checkout_completed',
          params: {
            order_id: String(this.globalVal.mInputParams.orderId),
            order_amount: Number(String(this.globalVal.mInputParams.orderPrice.TOTAL_PRODUCT_AMT).replaceAll(',', '')),
            payment_method: this.globalVal.paymentInfo.paymentList[0].payType,
            payment_card: paymentCard,
            coupon_used: couponNum,
            number_of_products: numberOfProducts, // 상품의 총 주문 개수 전송
            point_used: Number(String(pointUsed).replaceAll(',', '')), // 적립금 사용금액 전송
            media: viewType(),
            co_cd: COMM_CONST.getCocd()
          }
        }
      })

      const dtsiProductList = [] // DTSI
      const airbridgeProductList = [] // Airbridge
      const hsmoaProductList = [] // 홈쇼핑모아
      const recobellProductList = [] // Recobell

      const ordersId = String(this.globalVal.mInputParams.orderId)
      let totalPrice = 0
      let lastPrice = 0
      let attrs = ''
      this.globalVal.detailInfo.productList.forEach((item, index) => {
        // orderId = String(item.ORDERITEMS_ID)
        totalPrice += Number(item.PRICE)
        lastPrice += Number(item.PRICE) * Number(item.QUANTITY) - Number(item.DiscountPrice) + Number(item.SHIPCHARGE)
        if (!isNull(item.ATTRIBUTES) && (item.ATTRIBUTES.length > 0 && !isNull(item.ATTRIBUTES[0].NAME))) {
          attrs = encodeURIComponent(item.ATTRIBUTES[0].NAME)
        }

        // DTSI 제품 정보
        dtsiProductList.push({
          orderId: ordersId, // String(item.ORDERITEMS_ID), // 주문번호
          productId: item.GOODSPARTNUMBER, // 제품 ID
          productName: item.PRODUCT_NAME, // encodeURIComponent(item.PRODUCT_NAME), // 제품명
          price: item.PRICE, // 제품 가격
          quantity: item.QUANTITY, // 제품 개수
          del: item.SHIPCHARGE, // 배송비
          discount: item.adjustment, // 할인금액
          attrs // 속성
        })
        // Airbridge 제품 정보
        airbridgeProductList.push({
          productID: item.GOODSPARTNUMBER, // 제품 ID
          name: item.PRODUCT_NAME, // 제품명
          price: Number(String(item.PRICE).replaceAll(',', '')), // 제품 가격
          quantity: Number(String(item.QUANTITY).replaceAll(',', '')), // 제품 개수
          currency: 'KRW',
          position: index + 1
        })
        // Recobell 제품 정보
        recobellProductList.push({
          orderId: ordersId, // String(item.ORDERITEMS_ID), // 주문번호
          productId: item.GOODSPARTNUMBER, // 제품 ID
          productName: encodeURIComponent(item.PRODUCT_NAME), // 제품명
          price: item.PRICE, // 제품 가격
          quantity: item.QUANTITY, // 제품 개수
          del: item.SHIPCHARGE, // 배송비
          discount: item.adjustment, // 할인금액
          attrs // 속성
        })

        // 홈쇼핑모아
        hsmoaProductList.push(item.GOODSPARTNUMBER)
      })
      // DTSI 로그
      marketingUtil.dtsiLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_PURCHASE,
          action: dtsiProductList,
          orderId: ordersId,
          lastPrice,
          totalPrice
        }
      })
      // 페이스북 픽셀
      marketingUtil.fbpixelLogger.send({
        type: marketingUtil.fbpixelLogger.EVENT.PURCHASE,
        data: {
          value: lastPrice, // 구매 금액
          currency: 'KRW'
        }
      })
      // Airbridge
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.PURCHASED, // 결제
        data: {
          transactionID: ordersId,
          totalValue: totalPrice,
          currency: 'KRW',
          inAppPurchased: false,
          products: airbridgeProductList,
          customAttributes: {
            categoryNm: '',
            gradeNm: loginUtil.getUserInfo('gradeNm')
          },
          action: '구매완료',
          label: '구매완료'
        }
      })
      // 홈쇼핑 모아
      marketingUtil.hsmoaLogger.send({
        data: {
          co_cd: COMM_CONST.getCocd(),
          action: hsmoaProductList,
          category: 'purchase'
        }
      })
      // Recobell
      marketingUtil.recobellLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_PURCHASE,
          action: recobellProductList,
          orderId: ordersId,
          lastPrice,
          totalPrice
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/complete/OrderComplete";
</style>
