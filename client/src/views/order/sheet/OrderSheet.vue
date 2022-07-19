<template>
  <div :class="orderWrapClassName">
    <order-sheet-customer
      v-if="isLoadChildComponent"
      v-show="globalVal.customerInfo.isOrderSheetCustomerShow"
      :payment-data="paymentData"
      :global-val="globalVal"
    />
    <order-sheet-guest-customer
      v-if="isLoadChildComponent"
      v-show="globalVal.isGuest"
      :payment-data="paymentData"
      :global-val="globalVal"
    />
    <order-sheet-delivery
      v-if="isLoadChildComponent"
      v-show="!globalVal.isGuest"
      :payment-data="paymentData"
      :global-val="globalVal"
    />
    <order-sheet-guest-delivery
      v-if="isLoadChildComponent"
      v-show="globalVal.isGuest"
      :payment-data="paymentData"
      :global-val="globalVal"
    />
    <order-sheet-product
      v-if="isLoadChildComponent"
      :payment-data="paymentData"
      :global-val="globalVal"
    />
    <order-sheet-discount
      v-if="isLoadChildComponent && globalVal.completeOrderSheetProduct"
      v-show="globalVal.showOrderSheetDiscount"
      :payment-data="paymentData"
      :global-val="globalVal"
    />
    <order-sheet-payment-method
      v-if="isLoadChildComponent && globalVal.completeOrderSheetProduct && globalVal.completeOrderSheetDiscount && globalVal.paymentMethodInfo.showSectionPaymentMethodArea"
      :payment-data="paymentData"
      :global-val="globalVal"
    />
    <order-sheet-payment-amt
      v-if="isLoadChildComponent && globalVal.completeOrderSheetProduct && globalVal.completeOrderSheetDiscount"
      :payment-data="paymentData"
      :global-val="globalVal"
    />
    <order-sheet-confirm
      v-if="isLoadChildComponent && globalVal.completeOrderSheetProduct && globalVal.completeOrderSheetDiscount"
      :payment-data="paymentData"
      :global-val="globalVal"
    />
    <div id="test" @click="init" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import COMM_CONST from '@constants/framework/constants'
import { PRODUCT_CONST } from '@/common/constants/product/product'
import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import MESSAGES from '@constants/framework/messages'
import messageUtil from '@frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'
import bizUtil from '@utils/bizUtil'
import {
  isNull,
  extend,
  insertSeparatorPhoneNumber,
  getPhoneNumber
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
// import nativeUtil from '@/common/frameworks/nativeUtil'

import PaymentData from '@/common/order/sheet/paymentData'
import OrderSheetCustomer from '@/views/order/sheet/OrderSheetCustomer'
import OrderSheetDelivery from '@/views/order/sheet/OrderSheetDelivery'
import OrderSheetProduct from '@/views/order/sheet/OrderSheetProduct'
import OrderSheetDiscount from '@/views/order/sheet/OrderSheetDiscount'
import OrderSheetPaymentMethod from '@/views/order/sheet/OrderSheetPaymentMethod'
import OrderSheetPaymentAmt from '@/views/order/sheet/OrderSheetPaymentAmt'
import OrderSheetConfirm from '@/views/order/sheet/OrderSheetConfirm'
import OrderSheetGuestCustomer from '@/views/order/sheet/OrderSheetGuestCustomer'
import OrderSheetGuestDelivery from '@/views/order/sheet/OrderSheetGuestDelivery'

import initPaymentAmtMixin from '@/mixins/order/sheet/initPaymentAmtMixin'
import finalPaymentAmountMixin from '@/mixins/order/sheet/finalPaymentAmountMixin'
import setPartnershipDataMixin from '@/mixins/order/sheet/setPartnershipDataMixin'
import orderSheetService from '@services/order/sheet/orderSheetService'
import flushPromises from 'flush-promises'

export default {
  components: {
    OrderSheetCustomer,
    OrderSheetDelivery,
    OrderSheetDiscount,
    OrderSheetProduct,
    OrderSheetPaymentMethod,
    OrderSheetPaymentAmt,
    OrderSheetConfirm,
    OrderSheetGuestCustomer,
    OrderSheetGuestDelivery
  },
  mixins: [
    initPaymentAmtMixin,
    finalPaymentAmountMixin,
    setPartnershipDataMixin
  ],
  data () {
    return {
      isLoadChildComponent: false,

      // Component 전체 공유하며 parent/child 간의 공유하는 data 이다. (신규추가)
      globalVal: {
        mInputParams: {}, // (ASIS) m_inputParams
        mOutputDatas: {}, // (ASIS) m_outputDatas
        form: 'PRODUCT_DETAIL',

        sfinalPaymentAmtSaveExclude: 0, // 부가결제 수단을 재외한 화면에 뿌려지는 값 세팅
        dobuleClickCount: 0, // (ASIS) nDoubleCount 더블 클릭 체크 변수
        activeDoubleClick: false, // (ASIS) bDoubleBtn 더블 클릭 체크 변수(버튼) - 주문 결제 인증 후 로그 적제 직전 세팅되며, 이후 최종 주문 API 까지 오류나 fail일 경우만 풀린다.
        activeDoubleApi: false, // (ASIS) bDoubleApi 최종 주문 API 막기 - 최종 API 통신 시작전에 세팅되며, result 값이 'success'가 아닐경우만 풀린다.

        completeOrderSheetInfo: false, // 주문서정보 데이터 조회 완료 여부
        completeLastCashReceiptData: false, // 마지막 결제정보 데이터 조회 완료 여부
        completeOrderSheetCustomer: false,
        completeOrderSheetDelivery: false,
        completeOrderSheetProduct: false,
        completeOrderSheetPayment: false,
        completeOrderSheetDiscount: false,
        showOrderSheetDiscount: true,
        lastCashReceipt: null,

        maxPaymentPrice: 0, //   // 주문 최대 가능 금액, 월 최대 주문 가능 금액 (ASIS) CurrentView.maxPaymentPrice
        cat2CategoryIdFlag: false, // 중분류코드 (ASIS) CAT2_CATEGORY_ID_flag
        directOrderYN: 'N', // 상품상세 > 바로주문 클릭 후 결제
        isGuest: false, // (ASIS) IS_GUEST
        dispTypeCd: 'GENERAL', // 상품유형(GENERAL: 일반상품, CARD: 상품권, DELIVERY: 정기배달)
        // 1. DISP_TYPE_CD == 55 or DISP_TYPE_CD == 60 : 상품권
        // 2. DISP_TYPE_CD == 30 and PAY_TYPE_CD == 10 : 정기배송
        // 3. DISP_TYPE_CD == 30 and PAY_TYPE_CD == 20 : 정기주문
        // 4. 그 이외 : 일반상품
        checkedLastPayTypeSinglePaymentDiscountFlag: true, // (ASIS) chkLastPayTypeSinglePaymentDiscountFlag (NSSR-19278 주문결제페이지 내 일시불할인 자동적용) 기존 결제수단이 있고 주문서 최초 로딩일 경우 구분 - 기존 결제수단이 네이버페이일 경우 사용

        bDiscount33product: false, // 청구할인 상품 여부
        bDiscount33selected: false, // 청구할인 카드 선택 여부
        discountCardChoice: { // 카드 프로모션 할인 선택 여부 (ASIS) DISCOUNT_CARD_CHOICE
          discountCardLsp: false, // 카드 일시불 할인
          discountCardPreDc31: false, // 카드 선할인
          discountCardPreDc32: false, // 카드 포인트 적립
          discountCardPreDc33: false, // 카드 청구할인
          discountList32: null,
          discountList32Info: null,
          discountList33: null,
          discountList33Info: null
        },
        CONST: {
          FROM_CART: 'CART',
          FROM_PRODUCT_DETAIL: 'PRODUCT_DETAIL',
          DISCOUNT_PRODUCT_CPC_INDEX: 0, // 상품 가격할인의 json에 저장된 index값
          DISCOUNT_COUPON_START_INDEX: 1, // 쿠폰할인의 json에 저장되는 index 시작값
          DISCOUNT_CARD_LSP_INDEX: 5, // 카드일시불할인의 json에 저장된 index값
          DISCOUNT_CARD_PRE_DC_INDEX: 6, // 카드즉시할인의 json에 저장된 index값(data.msg.OrderGoodList.goodsDetail.ORD_CARD_PRE_DC_LST)
          DISCOUNT_YEAR_DC_INDEX: 7, // 연간할인의 json에 저장된 index값
          DISCOUNT_FREE_DLVRY_DC_INDEX: 8 // 무료배송할인의 json에 저장된 index값
        },

        partNumberFlag: 0,
        maxCountFlag: 0, // (ASIS) maxindex
        maxIndex: 0, // (ASIS) maxindex
        maxCheckFlag: false, // (ASIS) maxcheckflag
        custDurSpr: '', // 설정 1 :일, 2: 월, 3 : 기간
        custPrchQtyLimitYn: '', // Y : 구매제한 N : 1회 최대 구매가능수량으로 참조
        maxOrderPossQty: '', // 구매제한 수량
        checkPayFlag: 'Y', // (ASIS) CurrentView.check_pay_flag = "Y";
        chkInventoryQuantityType: '10',
        tmpBusChnId: null, // 채널 저장
        maximumPurchaseQuantityFlag: false, // 최대구매제한 FLAG (ASIS) MaximumPurchaseQuantityFlag

        // 결재 시 필요한 구매자 및 배송지 정보
        orderDeliveryInfo: {
          iptOrdererName: '', // 주문하시는분
          receiptEmail: '', // 받으시는 분 이메일
          ci: '', // 본인인증 여부
          di: '', // 본인인증 여부
          deliveryInfo: [{
            iptOrdererPwd: '', // 비회원주문시 주문하시는분 비밀번호
            iptOrdererPwdConfirm: '', // 비회원주문시 주문하시는분 비밀번호 확인
            iptOrdererHpNo1: '', // 주문하시는분 휴대폰1
            iptOrdererHpNo2: '', // 주문하시는분 휴대폰2
            iptOrdererHpNo3: '', // 주문하시는분 휴대폰3
            iptOrdererEmail: '', // 주문하시는분 이메일
            addrAlias: '', // 배송지명
            recipientName: '', // 받으시는분
            phone11: '', // 받으시는분 휴대폰1
            phone12: '', // 받으시는분 휴대폰2
            phone13: '', // 받으시는분 휴대폰3
            phone21: '', // 추가연락처 1
            phone22: '', // 추가연락처 2
            phone23: '', // 추가연락처 3
            zipCode: '', // 우편번호
            postcode: '', // 우편번호
            addrFlag: '', // 주소타입(100: 지번주소, 200: 도로명주소)
            addr: '', // 주소
            addrDetail: '', // 상세주소
            secAddress1: '', // 세컨드 기본주소(지번일경우 도로명, 도로명일경우 지번)
            secAddress2: '', // 세컨드 상세주소(지번일경우 도로명, 도로명일경우 지번)
            ipDefaultDest: '', // 기본배송지로 설정 여부
            selShippingAddress: '', // 배송지선택
            shippingMessage: '', // 배송메세지
            addInfo: '' // 안심택배 최근배송지 falg
          }]
        },

        guestInfo: {
          deliveryHpNo: '',
          updateHpno: '',
          isUserAuthPhoneNumShow: true,
          isUserPhoneNumShow: false,
          isRecipientNameErrMsgShow1: false,
          isDeliveryHpNoErrMsgShow1: false
        },

        // 구매자 정보
        customerInfo: {
          mHpNoSmsAuthYn: 'N', // 회원가입 시 SMS 인증 여부
          bFirstOrderYnCert: false, // sms회원이고 첫 주문 일 경우 trueh
          effectiveTime: 0, // 입력 제한 시간
          isCertCheck: false, // 회원가입 시 SMS 인증체크 여부
          phNumber: '',
          isErrorMessageAuth: false,
          isConfirmUserAuthInfoShow: false, // 결제하기 클릭시 사용됨.
          isUserHpnoErrorShow: false // 올바른 휴대폰 번호로 수정해주세요.
        },

        // 배송지 정보 (OrderDelivery) - 결제하기때 필요한 정보들 설정
        deliveryInfo: {
          vDeliveryMsg: '', // (ASIS) v_deliveryMsg
          safeCount: '', // 안심택배_count_flag값 (ASIS) safe_count
          checkFlag: null, // 안심택배falg값 (ASIS) check_flag
          multiDelvVal: [], // 복수배송지 불가
          multiDelvIdx: 0, // 복수배송지 불가
          maxDeliveryCount: 10, // 복수배송지 최대 가능 횟수
          strRmaYNCheck: '',
          bDeliveryYn: 'Y', // (ASIS) bDeliveryYN 배송지선택 개편 - 도서산간 배송가능 여부
          deliveryStatus: [], // 복수상품들을 지정한 배송지에 배송되는지 여부를 확인하기 위한 배열변수
          deliveryStatusIdx: 0, // 복수상품들을 지정한 배송지에 배송되는지 여부를 확인하기 위한 배열순번
          bjejuYn: '', // (ASIS) bjejuYN
          maxShippingMessageLength: 120, // 배송메시지 입력값 최대 bytes 수
          bSetCustDeliveryMsg: false, // 배송메시지 조회가 완료된 후 ul 영역을 오픈하도록 완료 여부를 체크한다. (완료되었을 경우 true, 완료되지 않았을 경우 false)
          sumShipCharge: 0, // 총배송비
          rmaShipCharge: 0, // 추가배송비
          rmaChkYn: true, // 도서산간 선택 가능여부
          popIdx: 0,
          isPopClose: false,
          isPopOpenYn: 'Y',
          wrongMessage: '',
          shipAddrLength: 0,
          checkSafeGuest: null, // 안심택배&&비회원 ASIS check_safe_guest
          rmaChkPopFlg: true,
          deliveryClass: 'subject checkbox',

          isMultiDeliveryShow: false, // 여러곳으로 배송받기 선택한 경우 배송지 조회
          isNonDeliveryShow: false, // 배송지 미등록인 경우
          isBasicDeliveryShow: true, // 기본 배송지 조회
          recipientName: '', // 배송지명
          isDeliveryBasicIconShow: false, // 기본 배송지 아이콘
          isDeliverySafeIconShow: false, // 안심 택배함 아이콘
          addrId: '',
          addr: '', // 배송지 주소
          addrDetail: '', // 배송지 상세주소
          phone11: '', // 배송지 휴대폰번호1
          phone12: '', // 배송지 휴대폰번호2
          phone13: '', // 배송지 휴대폰번호3
          zipCode: '', // 우편번호
          addrFlag: '',
          secAddress1: '',
          secAddress2: '',

          multi: [{
            orderItemsId: [],
            selectedCnt: [],
            catentryId: [],
            shipCharge: 0, // 총 배송비
            rmaShipCharge: 0, // 추가 배송비
            sumShipCharge: 0, // 총 배송비 합계
            sumRmaShipCharge: 0 // 추가 배송비 합계
          }],
          resultMulti: [],
          errorMessageAddress: false,
          addInfo: '',
          shippingMessage: ''
        },

        // 상품 정보 (OrderSheetProduct)
        productInfo: {
          nCountGds: 0, // 최초진입시 상품 종류 갯수
          haveAdultItem: 'N', // 성인상품 포함여부
          adultItems: [], // 성인상품
          deliveryDesignatedDayCount: '', // 배송일지정 count값 (ASIS) DeliveryDesignatedDay_count
          deliveryAagreeStatus: 'N', // (ASIS) DeliveryAagreeStatus
          deliveryAagreeDline: [], // 복수개 상품일 때 배송지정일 가능 날짜 세팅값 (ASIS) DeliveryAagreeDline
          deliveryDesignatedDayFlag: '', // 배송일지정falg값 (ASIS) DeliveryDesignatedDay_flag
          deliveryIndexSelectHideStatus: 'N', // (ASIS) DeliveryIndexSelectHideStatus
          fcallProc: 'N', // 지정배송일 상품이 2개이상 장바구니에 담겨있고 복수상품 구매시 주문서페이지에 보여지는 지정배송일을 첫번째 상품만 보여지도록 설정하기 위한 flag
          deliveryDateSelected: '', // 지정 배송일
          deliveryNoDataClass: 'active', // 배송일 지정 순차배송
          deliveryDataClass: [] // 배송일 지정 날짜
        },

        // 할인적용 정보 (OrderSheetDiscount)
        discountInfo: {
          // 금액표시 관련 정보 설정
          // finalPaymentAmountMixin
          cardDcAmt: 0, // 카드할인금액
          dcCouponAmt: 0, // 할인쿠폰
          reservesAvaAmt: 0, // 사용가능 적립금 (ava: available)
          reservesUseAmt: 0, // 적립금 사용금액 - reservedAmt
          happyMoneyAvaAmt: 0, // 사용가능 해피머니
          happyMoneyUseAmt: 0, // 해피머니 사용금액 - happyMoney
          nsGiftCardAvaAmt: 0, // 사용가능 NS상품권
          nsGiftCardUseAmt: 0, // NS상품권 사용금액 - giftCardAmount
          depositAvaAmt: 0, // 사용가능 예치금
          depositUseAmt: 0, // 예치금 사용금액 - depositAmount
          annualDcAvaAmt: 0, // 사용가능 연간할인권
          annualDcUseAmt: 0, // 연간할인권 사용금액 - annualCoupons
          okCashbagAvaAmt: 0, // 사용가능 OK캐쉬백
          okCashbagUseAmt: 0, // OK캐쉬백 사용금액 - okCashbag
          netiWellAvaAmt: 0, // 사용가능 네티웰
          netiWellUseAmt: 0, // 네티웰 사용금액 - netiWell
          forecastReservedAmt: 0, // 예상 적립금 (TOBE: 주문완료 이동)

          // discountAmountMixin
          cardPreDcAmt: 0, // 카드선할인 - totalCardPreDiscountPrice
          shipDcAmt: 0, // 배송비할인 - totalFreeShippingCharge
          flashSaleEnddd: '', // 플래시세일 경우 쿠폰의 종료일 세팅 (ASIS) FLASH_SALE_ENDDD
          showSinglePaymentDiscount: true,
          checkedEmployee: false, // (ASIS) checkemployee
          checkedSinglePaymentDiscount: false, // 일시불 할인 체크여부 -> checkedSinglePaymentDiscount
          disabledCheckboxSinglePaymentDiscount: false // 일시불 할인 체크박스 비활성화 여부
        },

        // 결제수단 정보 (OrderSheetPaymentMethod)
        paymentMethodInfo: {
          checkedNspayOneTouch: false, // chkNspaySmptYn
          paymentMethod: '', // 최종 결제 수단
          objPaymentCertData: {},
          paymentMethodInitData: {}, // 결제수단별 초기화 기본 데이터
          isApplyPaySaveFlag: true,
          bFlagCard31: false, // 선할인 선택 여부
          hasCardPreDc: false, // 카드 선할인 선택 사용 유무 true:사용 (ASIS) HAS_CARD_PRE_DC
          isGalleria: false, // 갤러리아 여부
          // UI 제어
          showSectionPaymentMethodArea: true,
          paymentMethodTitle: '결제수단을 선택해 주세요.',
          wrongMessage: '',
          currentPayType: PAY_TYPE_CONST.CREDIT_CARD,
          dispEpQuotaList: [{ value: '00', text: '일시불' }], // 일시불, 할부 정보 노출

          // 신용카드 포인트 가이드 표시
          cardPointGuide: {
            cardPreDc: { // 카드 할인정보
              isShow: false,
              fullText: ''
            },
            selectedCard: { // 선택된 카드정보
              pointName: '',
              isShow: false
            }
          },

          cardBnftGuideText: '',

          // 결제하기때 필요한 정보들 설정
          selectedCardData: null,
          epCardCode: '', // $('select[name=EP_card_code]').val() === '' // 카드사 선택 -> 카드사코드
          epCardText: '', // frm.find('select[name=EP_card_code] option:selected').text() // 카드사 선택 -> 카드사명
          epCardCoCode: '', // 결제시 필요한지 확인  (UI 엔 필요함)
          epDirectYn: '', // 결제시 필요한지 확인 (UI 엔 필요함)
          epQuota: '00', // $('select[name=EP_quota]').val() === '00', $('#formOrderPaymentInfo [name=EP_quota]').val().indexOf('_n') > -1 // 할부유형 선택
          epCardNo: '', // $('#formOrderPaymentInfo [name=EP_card_no]').val(), -->> 사용되는곳 없음. 확인필요.

          checkedAgreePurchageSave: true, // $('#chkAgreePurchageSave').is(':checked') // 결제정보저장
          checkedEpPointUseYn: false, // ($('#formOrderPaymentInfo [name=EP_point_useyn]').is(':checked') ? 'Y' : 'N'),

          selectedBank: '', // 선택된 은행코드
          selectedBankInfo: '', // 선택된 은행정보
          remitter: '', // 입금자
          checkedReceipt: true, // 현금영수증 신청 체크
          receiptType: 'P', // P: 휴대폰번호, B: 사업자번호
          receiptValue: '', // P: 휴대폰번호 값, B: 사업자번호 값
          isSaveReceiptValue: true, // 다음에도 동일한 번호로 신청합니다.
          isChangeReceipt: false, // 현금영수증 변경여부

          // NS페이
          selectedNspay: {
            item: {
              wpayToken: '',
              quotaList: [{ value: '00', text: '일시불' }] // NS페이 신용카드: 일시불, 할부 정보 노출
            }
          },

          nspayCardPointGuide: {
            cardPreDc: { // 카드 할인정보
              isShow: false,
              fullText: ''
            },
            selectedCard: { // 선택된 카드정보
              pointName: '',
              isShow: false
            }
          },
          previousGrandTotalAmt: 0,
          changeFinalAmtPaymentMethodCardEmit: false,
          changeFinalAmtPaymentMethodNspayCardEmit: false
        },

        // 결제금액 정보 (OrderSheetPaymentAmt)
        paymentAmtInfo: {
          totalProductAmt: 0, // 총 상품금액
          totalSaleAmt: 0, // 총 할인금액
          grandTotalAmt: 0 // 최종 결제 금액
        },

        // 결제하기 정보 (OrderSheetConfirm)
        confirmInfo: {
          isCheckAgreePurchage: false, // 전자상거래법 동의 여부
          isCheckAgreeGuest: false, // 비회원 주문 정보 수집에 동의 여부 (ASIS: guestAgreeCheck)
          isCheckPaymentMethodSave: true, // 결제수단 저장 여부
          enableCallbackResult: true,
          enableComplete: true
        }
      },

      // Component 전체 공유 / 결제처리 관련 Object - (ASIS) PaymentData
      paymentData: {},

      retry: { // (ASIS) CurrentView.param, count, tranId
        param: '',
        count: 0,
        tranId: ''
      }
    }
  },
  computed: {
    ...mapState('orderSheet', ['orderSheetInfo', 'orderProduct', 'fromOrderSheetIsNoMemberOrder']),
    orderWrapClassName () {
      return this.globalVal.isGuest ? 'order_sheet no_member' : 'order_sheet'
    },
    isAllComponentComplete () {
      return (this.globalVal.completeOrderSheetInfo &&
            this.globalVal.completeLastCashReceiptData &&
            this.globalVal.completeOrderSheetCustomer &&
            this.globalVal.completeOrderSheetDelivery &&
            this.globalVal.completeOrderSheetProduct &&
            this.globalVal.completeOrderSheetPayment &&
            this.globalVal.completeOrderSheetDiscount)
    }
  },
  created () {
    this.init()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      const path = from.path || ''
      if (path.indexOf('/cart') > -1) {
        vm.globalVal.from = vm.globalVal.CONST.FROM_CART
      } else {
        vm.globalVal.from = vm.globalVal.CONST.FROM_PRODUCT_DETAIL
      }
    })
  },
  methods: {
    /**
     * Data 초기화
     * @returns {void}
     */
    async init () {
      this.globalVal.mInputParams = this.orderProduct

      if (!this.globalVal.mInputParams.orderId) {
        bizUtil.gotoMain()
        return false
      }

      // 결제정보를 저장할 공간 초기화
      this.paymentData = {}
      this.paymentData.Product = new PaymentData.Product()
      this.paymentData.Delivery = new PaymentData.Delivery()
      this.paymentData.Discount = new PaymentData.Discount()
      this.paymentData.Payment = new PaymentData.Payment()
      this.paymentData.Partnership = new PaymentData.Partnership()
      this.paymentData.OrderUserInfo = new PaymentData.OrderUserInfo()
      this.paymentData.MaxbuyCount = new PaymentData.MaxbuyCount()

      if (loginUtil.isLoggedIn()) {
        await bizUtil.secessionMemberCheker()
      }

      // 주문서정보 조회
      this.getOrderPaymentInfo()
      this.setLastCashReceipt()
    },

    /**
     * 주문서정보 조회
     * @returns {void}
     */
    getOrderPaymentInfo () {
      // 바로주문 여부 세팅 - 주문상세에서 바로 주문을 클릭하여 넘어온 경우 Y
      if (!isNull(this.globalVal.mInputParams.invoke) &&
          !isNull(this.globalVal.mInputParams.invoke.directOrderYN)) {
        this.globalVal.directOrderYN = this.globalVal.mInputParams.invoke.directOrderYN
      }

      const param = {
        orderId: this.globalVal.mInputParams.orderId,
        co_cd: COMM_CONST.getCocd(),
        orderSheetYn: 'Y'
      }

      this.retry.param = param
      this.retry.tranId = 'NSOrderPaymentMobile'
      orderSheetService.getOrderPaymentInfo(param, this.shoppingAmtLimitCheck)
    },

    /**
     * 월 주문 한도 체크 로직 추가에 따른 수정
     * 회원 비회원 여부에 따른 월 주문 금액 조회 후 처리
     * @param {Object} response - 주문 금액 조회 정보
     * @returns {void}
     */
    shoppingAmtLimitCheck (orderInfo) {
      if (orderInfo.msg.isSuccess === 0) { // sucess fail
        // 특정 api이고 특정 횟수 만큼 반복
        if (this.retry.count < 3 && this.retry.tranId === 'NSOrderPaymentMobile') {
          this.retry.count++

          // 시간 딜레이 후 재호출
          setTimeout(async () => {
            await flushPromises()
            this.getOrderPaymentInfo()
          }, 500)

          return
        }
        messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.', () => {
          routerUtil.back()
        })

        return
      }

      const isNotNonMember = orderInfo.msg.root.UserInfo.REGISTERTYPE !== 'G'
      const param = {
        userId: isNotNonMember ? orderInfo.msg.root.UserInfo.USERS_ID : '',
        registerType: isNotNonMember ? orderInfo.msg.root.UserInfo.REGISTERTYPE : 'G',
        userCi: ''
      }

      // 월 주문 금액 조회
      orderSheetService.shoppingAmtLimitCheck(param, data => {
        this.shoppingLimitCheck(orderInfo, '', data.root)
      })
    },

    /**
     * 월 한도금액 이상 주문하려고 할 경우 주문 불가 체크 통신
     * @param {Object} orderInfo - 주문정보
     * @param {String} chkType - 체크유형
     * @param {Object} data - 월 한도금액 이상 주문정보
     * @returns {void}
     */
    async shoppingLimitCheck (orderInfo, chkType, data) {
      if (data != null) {
        this.globalVal.maxPaymentPrice = data.shoppinglimitprice
      }
      this.retry.param = null
      this.retry.count = 0
      this.retry.tranId = ''

      let nLimitCount = 0 // 총 주문 상품 갯수
      nLimitCount = orderInfo.msg.root.OrderGoodList.length // 총 주문 상품 갯수 세팅

      // 배송 형태별 주문 프로세스 처리 시작
      if (undefined === chkType || chkType === '') {
        let strInventoryMsg = '' // alert message
        let maxPrice = 0

        // 주문서에 인입된 상품의 합산금액이 800만원 이상일 경우 처리
        for (let i = 0; nLimitCount > i; i++) { // 상품 갯수 만큼 반복
          const objDataGD = orderInfo.msg.root.OrderGoodList[i].goodsDetail

          maxPrice += Number(objDataGD.DCPRICE) * Number(objDataGD.QUANTITY)
        }

        // 월 주문 한도 체크 로직 추가에 따른 수정
        // 정회원 월 주문 한도 금액 체크
        // 월 주문 금액 + 현 주문 합산 금액이 8백만원 이상인경우 처리
        const tempPrice = data != null ? data.result : '0'
        if (orderInfo.msg.root.UserInfo.REGISTERTYPE !== 'G' && (Number(tempPrice) + Number(maxPrice) > this.globalVal.maxPaymentPrice)) {
          messageUtil.alert('고객님의 총 주문 금액이 당사 기준을 초과하였습니다. 자세한 안내는 NS홈쇼핑 모바일 상담전화 (1800-0770(유료))를 통해 가능합니다.',
            () => {
              routerUtil.back()
            })

          return
        }

        for (let j = 0; nLimitCount > j; j++) { // 상품 갯수 만큼 반복
          const objDataGD = orderInfo.msg.root.OrderGoodList[j].goodsDetail
          const objDataIDI = orderInfo.msg.root.OrderGoodList[j].itemDetailInfo

          // 판매 불가 상품 체크
          // markForDelete: 0 - 상품삭제여부 ( 0 : 삭제아님 / 1 : 삭제 )
          // saleYn: "Y"      - 판매가능여부 ( Y : 판매가능 / N : 판매불가 )
          if (objDataGD.MARKFORDELETE === '1' || objDataGD.SALE_YN === 'N' || objDataGD.itemLiveYN === 'N') {
            let strTitleNm = '' // [브랜드명]상품명
            strTitleNm += objDataIDI.brandName && objDataIDI.brandName !== '미정의' ? `[${objDataIDI.brandName}]` : ''
            strTitleNm += objDataIDI.productName

            messageUtil.alert(`"${strTitleNm}" 상품은 판매 불가 상품입니다.`,
              () => {
                routerUtil.back()
              })

            return
          }

          // 일반배송 10, 지정배송 20, 순차배송 30, 예약배송 40
          // 순차배송 30, 예약배송 40의 경우 confirm 창을 띄워 진행 여부 확인
          if (objDataGD.INVENTORY_QUANTITY_TYPE === '30' || objDataGD.INVENTORY_QUANTITY_TYPE === '40') {
            this.globalVal.chkInventoryQuantityType = objDataGD.INVENTORY_QUANTITY_TYPE
            if (strInventoryMsg !== '') { // 처음이 아닐경우 한줄 띄움
              strInventoryMsg += ' '
            }

            let strTitleNm = '' // [브랜드명]상품명
            strTitleNm += objDataIDI.brandName && objDataIDI.brandName !== '미정의' ? `[${objDataIDI.brandName}]` : ''
            strTitleNm += objDataIDI.productName

            strInventoryMsg += `${strTitleNm} 상품은 `
            strInventoryMsg += `${objDataGD.INVENTORY_QUANTITY_SCHD_DATE.substring(4, 6)}월 `
            strInventoryMsg += `${objDataGD.INVENTORY_QUANTITY_SCHD_DATE.substring(6, 8)}일`

            if (objDataGD.INVENTORY_QUANTITY_TYPE === '30') { // 순차배송일 경우
              strInventoryMsg += ' 까지 순차 배송 예정입니다.' // 순차 배송으로 문구 수정 by seo4872
            } else { // 예약배송일 경우
              strInventoryMsg += '에 배송 예정입니다.'
            }
          }
        }

        // 메시지 변수에 값이 있으며 confirm 창 활성
        if (strInventoryMsg !== '') {
          messageUtil.alert(strInventoryMsg, () => {
            this.shoppingLimitCheck(orderInfo, 'pass')
          })

          return
        }
      }
      // 배송 형태별 주문 프로세스 처리 종료

      let strLimitCheck = 'N' // 주문 불가 체크 값 ; Y:불가, N:가능
      for (const objData of orderInfo.msg.root.OrderGoodList) {
        if (strLimitCheck === 'Y') { // 불가이면 다음 로직 부르고 for문 종료
          this.shoppingLimitCheckNext(orderInfo)
          break
        }

        // 채널 저장
        this.globalVal.tmpBusChnId = objData.goodsDetail.XBUSCHN_ID
        // 월 한도금액 이상 주문하려고 할 경우 주문 불가 체크 통신
        await orderSheetService.shoppingLimitCheck(
          {
            catEntryId: objData.goodsDetail.CATENTRY_ID_PARENT,
            quantity: objData.goodsDetail.QUANTITY,
            price: objData.goodsDetail.PRICE,
            busChnId: objData.goodsDetail.XBUSCHN_ID,
            userId: orderInfo.msg.root.UserInfo.USERS_ID
          },
          inData => { // callback 처리
            if (inData.root.result === 'Y') { // 주문 불가의 경우
              strLimitCheck = 'Y'
            }

            nLimitCount--

            if (nLimitCount === 0) { // 갯수 만큼 통신이 끝난 경우
              this.shoppingLimitCheckNext(orderInfo, strLimitCheck)
            }
          })
      }
    },

    /**
     * 월 한도금액 이상 주문하려고 할 경우 주문 불가 체크하여 처리
     * 정상일 경우 다음 로직 이동
     * 불가일 경우 alert 노출 후 클릭시 이전페이지로 이동
     * @param {Object} orderInfo - 주문정보
     * @param {String} strFlag - 주문 불가여부
     * @returns {void}
     */
    shoppingLimitCheckNext (orderInfo, strFlag) {
      if (strFlag === 'Y') {
        messageUtil.alert('죄송합니다. 대량구매를 원하실 경우 반드시 NS홈쇼핑 모바일 상담전화(1800-0770)로 연락바랍니다.',
          () => {
            routerUtil.back()
          }
        )
      } else {
        this.resultOrderPaymentInfo(orderInfo) // 주문서정보 조회 결과 function 호출
      }
    },

    /**
     * 주문서정보 조회 결과
     * @param {Object} data - 주문정보
     * @returns {void}
     */
    resultOrderPaymentInfo (data) {
      if (data.msg == null) {
        messageUtil.alert(`${MESSAGES.PROCEDURE_ERROR} ${data.tranId}`)
        return false
      }

      if (!data.isSuccessful || (data.msg.resultCode && data.msg.resultCode < 0)) {
        messageUtil.alert(`${MESSAGES.PROCEDURE_ERROR} ${data.tranId} ${data.msg.resultMsg}`, () => {
          bizUtil.gotoMain()
        })
        return false
      }

      if (typeof (data.msg) === 'string') {
        // output데이터의 타입을 string에서 json으로 변환
        data.msg = JSON.parse(data.msg)
      } else if (data.msg.root !== undefined) {
        data.msg = data.msg.root
      }

      // 주문정보 조회 저장
      this.globalVal.mOutputDatas = data
      this.globalVal.isGuest = !loginUtil.isLoggedIn()
      this.globalVal.checkPayFlag = this.globalVal.isGuest ? 'Y' : 'N' // 결제정보저장.
      this.globalVal.paymentMethodInfo.checkedAgreePurchageSave = this.globalVal.isGuest ? 'Y' : 'N' // 결제정보저장.

      // 비회원 일경우 무통장 계좌번호 정보 초기화
      if (this.globalVal.isGuest &&
          !isNull(this.globalVal.mOutputDatas.msg.BankAccntList) &&
          this.globalVal.mOutputDatas.msg.BankAccntList.length > 0) {
        for (let i = 0; this.globalVal.mOutputDatas.msg.BankAccntList.length > i; i++) {
          this.globalVal.mOutputDatas.msg.BankAccntList[i].ACCT_NUM = 'nothing'
        }
      }

      // 주문하실상품 주문금액 등 json 데이터에 임시 저장
      this.globalVal.mOutputDatas.orderPrice = {
        TOTAL_PRODUCT_AMT: 0,
        TOTAL_AMT: 0,
        OFFER_AMT: 0,
        SHIP_CHARGE: 0, // 배송비 금액
        SHIP_CHARGE_ONE_DELIVERY: 0, // 배송지가 하나일때 배송비 금액
        SHIP_CHARGE_MULTI_DELIVERY: 0, // 배송지가 복수일때 배송비 금액
        FINAL_PAYMENT_AMT: 0, // 최종 결제 금액
        CREDITCARD_PAYMENT_AMT: 0, // 신용카드결제 금액
        MOBILE_PAYMENT_AMT: 0, // 핸드폰결제 금액
        ACCOUNT_TRANSFER_PAYMENT_AMT: 0, // 실시간계좌이체 금액
        WITHOUT_BANKBOOK_PAYMENT_AMT: 0, // 무통장입금 금액
        NS_GIFT_CERT_PAYMENT_AMT: 0 // NS상품권 금액
      }

      // 주문 상품 json 데이터에 임시 저장
      this.globalVal.mOutputDatas.orderItem = {
        orderItemIds: [],
        catEntryIds: [],
        orderItemQuantitys: [],
        orderItemAmount: [],
        isFlashSaleNew: []
      }

      // 결제수단별 임시저장
      if (data.msg.LastPayTypeCode !== undefined) {
        this.globalVal.mOutputDatas.OrderMethodSave = {
          LastPayTypeCode: data.msg.LastPayTypeCode,
          userId: data.msg.payMethod.userId,
          payMthdCd: data.msg.payMethod.payMthdCd,
          cardCd: data.msg.payMethod.cardCd,
          acctInfo: data.msg.payMethod.acctInfo,
          rmitrNm: data.msg.payMethod.rmitrNm,
          crCardYn: data.msg.payMethod.crCardYn,
          noBbYn: data.msg.payMethod.noBbYn,
          acctYn: data.msg.payMethod.acctYn,
          ldinPath: data.msg.payMethod.ldinPath
        }
      } else {
        this.globalVal.mOutputDatas.OrderMethodSave = {
          LastPayTypeCode: '',
          paySaveFlag: '1'
        }
      }

      this.globalVal.mOutputDatas.msg.UserInfoBenefit = extend(true, {
        OKCASHBAG_BALANCE: 0,
        NETIWELL_BALANCE: 0,
        HAPPYMONEY_BALANCE: 0,
        GIFTCARD_BALANCE: 0
      }, this.globalVal.mOutputDatas.msg.UserInfoBenefit)

      let strPhone2Type = 'T'

      // 카카오페이를 통한 결제 사고 예방
      for (let j = 0; data.msg.OrderGoodList.length > j; j++) {
        if (data.msg.OrderGoodList[j].goodsDetail.CAT1_CATEGORY_ID === '5') {
          this.globalVal.cat2CategoryIdFlag = true
        }
      }

      if (data.msg.OrderGoodList.length === 1 &&
          (data.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_GIFTISHOW ||
          data.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.MOBILE_GIFTCARD)) {
        strPhone2Type = 'K'
      }

      // 폼 데이터에 반영
      this.paymentData.OrderUserInfo.setDefault({
        USER_ID: data.msg.UserInfo.USERS_ID,
        LASTNAME: data.msg.UserInfo.LASTNAME,
        NICKNAME: data.msg.UserInfo.LASTNAME,
        ZIPCODE: data.msg.UserInfo.ZIPCODE,
        ADDRESS1: data.msg.UserInfo.ADDRESS1,
        ADDRESS2: data.msg.UserInfo.ADDRESS2,
        PHONE1TYPE: (data.msg.UserInfo.PHONE1TYPE || 'K'),
        PHONE2TYPE: (data.msg.UserInfo.PHONE2TYPE || strPhone2Type),
        PHONE1: insertSeparatorPhoneNumber(data.msg.UserInfo.PHONE1, '-'),
        PHONE2: insertSeparatorPhoneNumber(data.msg.UserInfo.PHONE2, '-'),
        MOBILE_NO11: getPhoneNumber(data.msg.UserInfo.PHONE1, '1'),
        MOBILE_NO12: getPhoneNumber(data.msg.UserInfo.PHONE1, '2'),
        MOBILE_NO13: getPhoneNumber(data.msg.UserInfo.PHONE1, '3'),
        PHONE_NO11: getPhoneNumber(data.msg.UserInfo.PHONE2, '1'),
        PHONE_NO12: getPhoneNumber(data.msg.UserInfo.PHONE2, '2'),
        PHONE_NO13: getPhoneNumber(data.msg.UserInfo.PHONE2, '3'),
        EMAIL1: data.msg.UserInfo.EMAIL1
      })

      this.globalVal.completeOrderSheetInfo = true

      if (data.msg.OrderGoodList.length === 0) {
        return
      }

      if (data.msg.cardBnftMsgYn === 'Y') {
        this.globalVal.paymentMethodInfo.cardBnftGuideText = ''
        messageUtil.alert('서로 다른 카드 혜택 적용대상 상품을 동시 주문 하시는 경우 카드 할인을 받으실 수 없습니다. 카드 혜택 적용은 개별 상품 주문 시 적용 가능합니다.', () => {
          this.initPaymentAmt()
          if (!this.checkGalleriaSale()) {
            this.isLoadChildComponent = true
          }
        })
      } else {
        this.initPaymentAmt()
        if (!this.checkGalleriaSale()) {
          this.isLoadChildComponent = true
        }
      }
    },

    /**
     * 마지막 현금영수증 상태 설정
     * @returns {void}
     */
    setLastCashReceipt () {
      orderSheetService.setLastCashReceipt({ tasknm: 'lastCashReceipt' }, data => {
        if (data != null && data.lastCashReceipt != null) {
          this.globalVal.lastCashReceipt = data.lastCashReceipt
        }

        this.globalVal.completeLastCashReceiptData = true
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/sheet/OrderSheet";
</style>
