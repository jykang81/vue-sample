<template>
  <div v-if="isLoadingSuccess" class="mypage_order_detail">
    <h3 class="subject checkbox">
      {{ orderDate }}
      <span v-if="intPrdYn === 'Y'" class="order_number">(예약번호 {{ orders.ordersId }})</span>
      <span v-else class="order_number">(주문번호 {{ orders.ordersId }})</span>
    </h3>

    <div
      v-for="(multiInfo, multiIdx) in multi"
      :key="multiIdx"
      class="order_list"
    >
      <ul class="product_info order_detail">
        <li>
          <div class="delivery_point">
            <div v-if="intPrdYn !== 'Y'" class="flex">
              <p class="name">
                <span v-if="multi.length > 1">배송지 {{ multiIdx + 1 }}</span>{{ multiInfo.lastname }}
              </p>
              <button
                v-show="isChangeAddressShow"
                type="button"
                class="btn"
                @click="clickChangeAddress(multiIdx)"
              >
                <span>배송지 변경</span>
              </button>
              <button
                v-show="isDeliveryHistoryBtnShow"
                type="button"
                class="btn"
                @click="clickDeliveryHistory(multiIdx)"
              >
                <span>배송 조회</span>
              </button>
            </div>
            <div v-else>
              <p class="name">
                {{ multiInfo.lastname }}
              </p>
            </div>

            <div class="address">
              {{ multiInfo.address1 }} {{ multiInfo.address2 }}
            </div>
            <p v-show="!isNull(multiInfo.phone11) && !isNull(multiInfo.phone12) && !isNull(multiInfo.phone13)" class="phone">
              휴대폰: {{ multiInfo.phone11 }}-{{ multiInfo.phone12 }}-{{ multiInfo.phone13 }}
            </p>
            <p class="delivery_msg">
              {{ htmlDecode(multiInfo.message) }}
            </p>
          </div>
        </li>
        <li
          v-for="(catInfo, catIdx) in multiInfo.cats"
          :key="catIdx + '_0'"
        >
          <p class="state">
            {{ catInfo.statusName }}
          </p>

          <div class="box">
            <figure>
              <a @click="bizUtil.gotoProductDetail(catInfo.goodsCd, {
                popupId: popupId
              })"
              >
                <ns-img
                  :product-number="catInfo.goodsCd"
                  :width="128"
                  :height="128"
                  :alt="catInfo.catentryName"
                />
              </a>
            </figure>
            <div class="field">
              <a @click="bizUtil.gotoProductDetail(catInfo.goodsCd, {
                popupId: popupId
              })"
              >
                <p class="title">
                  {{ !isNull(catInfo.brandName) && catInfo.brandName !== '미정의' ? '[' + htmlDecode(catInfo.brandName) + ']' : '' }} {{ htmlDecode(catInfo.catentryName) }}
                </p>
              </a>
              <ns-price
                :dc-price="catInfo.price"
                :buschn-id="catInfo.buschnId"
                :disp-type-cd="catInfo.dispTypeCd"
              />
              <div v-if="catInfo.subProducts.length > 0">
                <!-- 초이스, 팩, 사은품 상품 주문 옵션 표시 -->
                <p class="option">
                  {{ catInfo.quantity }}개 /
                  <span
                    v-for="(attrInfo, attrIdx) in catInfo.attrs"
                    :key="attrIdx + '_1'"
                  >
                    {{ attrInfo.attrvalDesc }}
                  </span>
                  <span
                    v-for="(subInfo, subIdx) in catInfo.subProducts"
                    :key="subIdx + '_2'"
                  >
                    <span v-if="subInfo.partgubun === 'CHOICE'">
                      <!-- 초이스 상품일 경우 -->
                      {{ subInfo.name }}<span v-if="subInfo.attrs.length > 0"> {{ htmlDecode(subInfo.attrs.value) }}</span> : {{ subInfo.quantity }}개
                    </span>
                    <span v-else-if="subInfo.partgubun === 'PACK'">
                      <!-- PACK 일 경우 -->
                      {{ subInfo.name }}<span v-if="subInfo.attrs.length > 0"> {{ htmlDecode(subInfo.attrs.value) }}</span>
                    </span>
                  </span>
                </p>
              </div>
              <div v-else>
                <p class="option">
                  {{ catInfo.quantity }}개 /
                  <span
                    v-for="(attrInfo, attrIdx) in catInfo.attrs"
                    :key="attrIdx + '_3'"
                  >
                    {{ htmlDecode(attrInfo.attrvalDesc) }}
                  </span>
                </p>
              </div>
              <dl v-show="catInfo.giftSubPrd.length > 0" class="free_gift">
                <dt>사은품</dt>
                <dd
                  v-for="(giftInfo, giftIdx) in catInfo.giftSubPrd"
                  :key="giftIdx + '_6'"
                >
                  <span v-if="catInfo.giftSubPrd.length === 1">
                    {{ htmlDecode(giftInfo.name) }}
                  </span>
                  <span v-else>
                    {{ giftIdx + 1 }}. {{ htmlDecode(giftInfo.name) }}
                  </span>
                  <!-- <span
                    v-for="(giftAttrInfo, giftAttrIdx) in giftInfo.attrs"
                    :key="giftAttrIdx + '_7'"
                  >
                    {{ htmlDecode(giftAttrInfo.value) }}
                  </span> -->
                </dd>
              </dl>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="intPrdYn !== 'Y'" class="title_wrap">
      <h3 class="subject line">
        결제정보
      </h3>
      <button
        v-show="isPayByCardShow"
        type="button"
        class="btn"
        @click="clickPayByCard()"
      >
        <span>결제수단 변경</span>
      </button>
    </div>
    <div v-if="intPrdYn !== 'Y'" class="total_price">
      <dl>
        <dt>
          총 상품금액
        </dt>
        <dd>
          <strong>{{ insertCommas(Number(orders.totalproduct)) }}</strong>원
        </dd>
      </dl>
      <dl>
        <dt>
          총 할인금액
        </dt>
        <dd>
          <strong>{{ getMoneyFormat('- ', Number(orders.totaladjustment)) }}</strong>원
        </dd>
      </dl>
      <dl>
        <dt>
          총 배송비
        </dt>
        <dd>
          <strong>{{ insertCommas(Number(orders.totalshipping)) }}</strong>원
        </dd>
      </dl>
      <!-- <dl>
        <dt>
          추가 배송비
          <i class="question" />
        </dt>
        <dd>
          <strong>3,000</strong>원
        </dd>
      </dl> -->
      <dl class="total">
        <dt>
          최종 결제금액
        </dt>
        <dd>
          <strong>{{ insertCommas(Number(orders.totalpayment)) }}</strong>원
        </dd>
      </dl>
      <dl v-show="!isNull(orders.payms) && orders.payms.length > 0" class="payment_option">
        <template v-for="(paymInfo, paymIdx) in orders.payms">
          <dt :key="paymIdx + '_5'">
            {{ getPaymentName(paymInfo.paymentname) }}
          </dt>
          <dd v-if="paymInfo.paymdtls.length > 0" :key="paymIdx + '_8'">
            {{ getRelName(paymInfo.paymdtls[0]) }} {{ getInstmMmCnt(paymInfo) }} {{ getRelName(paymInfo.paymdtls[0]) === '' ? '' : ':' }} {{ paymInfo.paymdtls[0].dpstAcctNum }} <span><strong>{{ insertCommas(Number(paymInfo.payAmt)) }}</strong>원</span>
          </dd>
          <dd v-else :key="paymIdx + '_9'">
            <span><strong>{{ insertCommas(Number(paymInfo.payAmt)) }}</strong>원</span>
          </dd>
        </template>
      </dl>
      <!-- <dl class="accumulated_money">
        <dt>
          예상 적립금
        </dt>
        <dd>
          <strong>30</strong>원
        </dd>
      </dl> -->
    </div>
    <div v-if="intPrdYn !== 'Y'" class="btn_group_block">
      <button
        v-show="isOrderCancelBtnShow"
        type="button"
        class="btn"
        @click="clickOrderCancel()"
      >
        <span>주문취소</span>
      </button>
      <button
        v-show="isRefundOrderBtnShow"
        type="button"
        class="btn mb8"
        @click="clickRefundOrder()"
      >
        <span>반품신청</span>
      </button>
      <button
        v-show="isExchangeOrderClickBtnShow"
        type="button"
        class="btn mb8"
        @click="clickExchangeOrder()"
      >
        <span>교환신청</span>
      </button>
      <div v-show="isCancelBtnShow">
        <button
          type="button"
          class="btn mb8"
          @click="clickOrderCancelDetail()"
        >
          <span>취소상세 보기</span>
        </button>
      </div>
      <div v-show="isFefundOrderBtnShow">
        <button
          type="button"
          class="btn"
          @click="clickRefundOrderDetail()"
        >
          <span>반품상세 보기</span>
        </button>
      </div>
      <div v-show="isExchangeOrderBtnShow">
        <button
          type="button"
          class="btn"
          @click="clickExchangeOrderDetail()"
        >
          <span>교환상세 보기</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import loginUtil from '@utils/loginUtil'
import {
  isNull,
  getPhoneNumber,
  htmlDecode,
  insertCommas,
  getMoneyFormat
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import messageUtil from '@frameworks/messageUtil'
import popupUtil from '@frameworks/popupUtil'
import toastUtil from '@frameworks/toastUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import mypageOrderDetailService from '@services/order/detail/mypageOrderDetailService'
import mypageOrderListService from '@services/order/list/mypageOrderListService'
import orderPaymentMethodChangeService from '@services/order/orderPaymentMethodChangeService'

export default {
  name: 'MypageOrderDetail',
  components: {
    NsImg,
    NsPrice
  },
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isLoadingSuccess: false, // 로그인 성공 여부
      isCancelBtnShow: false, // 취소 버튼
      isFefundOrderBtnShow: false, // 반품상세보기
      isExchangeOrderBtnShow: false, // 교환상세보기
      orders: {}, // 주문 데이터
      orderDate: '', // 주문일
      isChangeAddressShow: true, // 배송지 변경 버튼
      isPayByCardShow: true, // 결제수단변경 버튼
      multi: [{
        catsIdx: 0,
        lastname: '',
        addrId: '',
        address1: '',
        address2: '',
        phone11: '',
        phone12: '',
        phone13: '',
        message: '',
        cats: [{
          statusName: '',
          goodsCd: '',
          brandName: '',
          catentryName: '',
          price: '',
          quantity: '',
          subProducts: [],
          attrs: []
        }]
      }], // 배송지 정보
      // giftSubPrd: [{
      //   name: '',
      //   attrs: [{
      //     value: ''
      //   }]
      // }], // 사은품
      guestResultYn: '', // 비회원여부
      logonType: '', // 로그인 타입
      guestType: 'g', // 비회원
      intPrdYn: '', // 무형상품여부
      popupId: '', // 팝업창. #popup-1
      orderCancelInfo: {
        result: ''
      },
      orderReturnInfo: {
        result: ''
      },
      isOrderCancelBtnShow: false,
      isExchangeOrderClickBtnShow: false,
      isRefundOrderBtnShow: false,
      isDeliveryHistoryBtnShow: false
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    }
  },
  created () {
    this.guestResultYn = this.param.guestResultYn // 비회원 여부
    this.logonType = this.param.logonType // 로그인 타입
    this.intPrdYn = this.param.intPrdYn // 무형상품여부

    // 마케팅 스크립트를 위한 부분 (GA 360)
    this.popupId = this.$route.hash

    // 일반회원, SNS회원
    if (this.logonType === COMM_CONST.LOGON_TYPE.NORMAL || this.logonType === COMM_CONST.LOGON_TYPE.SIMPLE) {
      if (!loginUtil.checkLogonStatus()) {
        bizUtil.gotoLogin()
      }
    } else {
      // 비회원이거나 해당 페이지로 바로 들어온 경우 해당 로직을 타게 됨
      // 비회원 일 경우 checkLogonStatus()에서 체크가 안됨
      if (this.guestResultYn === 'N') {
        bizUtil.gotoLogin()
      }
    }

    // 주문 상세정보 조회
    this.getOrdersDetailInfo()
  },
  methods: {
    htmlDecode,
    isNull,
    insertCommas,
    getMoneyFormat,
    /**
     * 주문 상세정보 조회
     */
    getOrdersDetailInfo () {
      const param = {
        ordsid: this.param.ordersId,
        tidx: '', // "". 전체. 1. 일반상품 / 2. 상품권 / 3. NS정기배달 / 4. 서비스상품 /
        channel: 'mobile',
        vwtyp: !loginUtil.checkLogonStatus() ? this.guestType : '' // 비회원일 경우 g
      }

      const successHandling = data => {
        this.orders = data.msg.root.orders[0]

        let orderCancelBtnShowFlg = true
        let exchangeOrderClickBtnShowFlg = true
        let refundOrderBtnShowFlg = true

        let addrIdx = 0
        this.multi = [{
          catsIdx: 0,
          lastname: '',
          addrId: '',
          address1: '',
          address2: '',
          phone11: '',
          phone12: '',
          phone13: '',
          message: '',
          cats: [{
            statusName: '',
            goodsCd: '',
            brandName: '',
            catentryName: '',
            price: '',
            quantity: '',
            subProducts: [],
            attrs: []
          }]
        }]
        for (let i = 0; i < this.orders.cats.length; i++) {
          this.orderDate = this.orders.cats[i].createdate

          if (i === 0) {
            this.multi[addrIdx] = {
              lastname: this.orders.cats[i].ship.lastname,
              addrId: this.orders.cats[i].ship.addressId,
              address1: this.orders.cats[i].ship.address1,
              address2: this.orders.cats[i].ship.address2,
              phone11: this.orders.cats[i].ship.phone11,
              phone12: this.orders.cats[i].ship.phone12,
              phone13: this.orders.cats[i].ship.phone13,
              message: this.orders.cats[i].ship.message,
              cats: []
            }
          } else {
            if (this.multi[addrIdx].lastname !== this.orders.cats[i].ship.lastname || this.multi[addrIdx].address1 !== this.orders.cats[i].ship.address1 ||
            this.multi[addrIdx].address2 !== this.orders.cats[i].ship.address2 || this.multi[addrIdx].phone11 !== this.orders.cats[i].ship.phone11 ||
            this.multi[addrIdx].phone12 !== this.orders.cats[i].ship.phone12 || this.multi[addrIdx].phone13 !== this.orders.cats[i].ship.phone13 ||
            this.multi[addrIdx].message !== this.orders.cats[i].ship.message) {
              addrIdx++
              this.multi[addrIdx] = {
                lastname: this.orders.cats[i].ship.lastname,
                addrId: this.orders.cats[i].ship.addressId,
                address1: this.orders.cats[i].ship.address1,
                address2: this.orders.cats[i].ship.address2,
                phone11: this.orders.cats[i].ship.phone11,
                phone12: this.orders.cats[i].ship.phone12,
                phone13: this.orders.cats[i].ship.phone13,
                message: this.orders.cats[i].ship.message,
                cats: []
              }
            }
          }

          this.multi[addrIdx].cats.push({
            statusName: this.orders.cats[i].statusName,
            goodsCd: this.orders.cats[i].goodsCd,
            brandName: this.orders.cats[i].brandName,
            catentryName: this.orders.cats[i].catentryName,
            price: this.orders.cats[i].price,
            quantity: this.orders.cats[i].quantity,
            subProducts: this.orders.cats[i].subProducts,
            attrs: this.orders.cats[i].attrs,
            dispTypeCd: this.orders.cats[i].dispTypeCd,
            buschnId: this.orders.cats[i].buschnId,
            giftSubPrd: []
          })

          for (let j = 0; j < this.orders.cats[i].subProducts.length; j++) {
            if (this.orders.cats[i].subProducts[j].partgubun === 'GIFT') {
              if (this.orders.cats[i].subProducts[j].attrs.length > 0) {
                this.multi[addrIdx].cats[this.multi[addrIdx].cats.length - 1].giftSubPrd.push({
                  name: this.orders.cats[i].subProducts[j].name,
                  attrs: []
                })
                for (let q = 0; q < this.orders.cats[i].subProducts[j].attrs.length; q++) {
                  this.multi[addrIdx].cats[this.multi[addrIdx].cats.length - 1].giftSubPrd[this.multi[addrIdx].cats[this.multi[addrIdx].cats.length - 1].giftSubPrd.length - 1].attrs.push({
                    value: this.orders.cats[i].subProducts[j].attrs[q].value
                  })
                }
              } else {
                this.multi[addrIdx].cats[this.multi[addrIdx].cats.length - 1].giftSubPrd.push({
                  name: this.orders.cats[i].subProducts[j].name,
                  attrs: [{
                    value: ''
                  }]
                })
              }
            }
          }

          if (this.orders.cats[i].status === 'D' || this.orders.cats[i].status === 'M' || this.orders.cats[i].status === 'T' || this.orders.cats[i].status === 'I') {
            exchangeOrderClickBtnShowFlg = false
            refundOrderBtnShowFlg = false
          } else {
            orderCancelBtnShowFlg = false
            if (this.orders.cats[i].status === 'X') {
              exchangeOrderClickBtnShowFlg = false
              refundOrderBtnShowFlg = false
            }
          }

          if (this.orders.cats[i].statusName === '취소완료') {
            this.isCancelBtnShow = true
          }
          if (this.orders.cats[i].statusName === '반품신청' || this.orders.cats[i].statusName === '반품진행' || this.orders.cats[i].statusName === '반품완료') {
            this.isFefundOrderBtnShow = true
            exchangeOrderClickBtnShowFlg = false
          }
          if (this.orders.cats[i].statusName === '교환신청' || this.orders.cats[i].statusName === '교환진행' || this.orders.cats[i].statusName === '교환완료') {
            this.isExchangeOrderBtnShow = true
            refundOrderBtnShowFlg = false
          }
          if (this.orders.cats[i].status === 'D' || this.orders.cats[i].status === 'M') {
            // 입금대기(D), 입금확인(M)인 경우 배송지 변경 추가
            this.isChangeAddressShow = true
            this.isDeliveryHistoryBtnShow = false
          } else {
            this.isChangeAddressShow = false
            if (this.orders.cats[i].status === 'T' || this.orders.cats[i].status === 'I') {
              this.isDeliveryHistoryBtnShow = false
            } else {
              this.isDeliveryHistoryBtnShow = true
            }
          }

          if (loginUtil.isLoggedIn()) {
            this.isDeliveryHistoryBtnShow = false
          } else {
            if (this.isCancelBtnShow) {
              this.isDeliveryHistoryBtnShow = false
            }
            // 비회원인경우 배송지 변경, 결제수단 변경 숨김처리
            // 추후 운영 API 개발 이후에 노출적용
            this.isChangeAddressShow = false
            this.isPayByCardShow = false
          }
        }

        // 결제 수단이 NS페이-원터치 일 경우 배송지 변경 버튼 비노출
        for (let i = 0; i < this.orders.payms.length; i++) {
          if ((this.orders.payms[i].paymentcode === '1600' || this.orders.payms[i].paymentcode === '1700') && this.orders.payms[i].oneTouchYn === 'Y') {
            this.isChangeAddressShow = false
          }
        }

        // 무통장 결제 – 미입금 상태일 경우에만 결제수단변경 버튼 노출
        for (let i = 0; i < this.orders.payms.length; i++) {
          if (this.orders.payms[i].paymentname !== '무통장 입금') {
            this.isPayByCardShow = false
          }
        }
        for (let i = 0; i < this.orders.cats.length; i++) {
          if (this.orders.cats[i].statusName !== '결제대기') {
            this.isPayByCardShow = false
          }
        }

        if (!loginUtil.isLoggedIn() && orderCancelBtnShowFlg) {
          this.isOrderCancelBtnShow = true
        } else {
          this.isOrderCancelBtnShow = false
        }
        if (!loginUtil.isLoggedIn() && exchangeOrderClickBtnShowFlg) {
          this.isExchangeOrderClickBtnShow = true
        } else {
          this.isExchangeOrderClickBtnShow = false
        }
        if (!loginUtil.isLoggedIn() && refundOrderBtnShowFlg) {
          this.isRefundOrderBtnShow = true
        } else {
          this.isRefundOrderBtnShow = false
        }

        this.isLoadingSuccess = true
      }

      mypageOrderDetailService.getOrdersDetailInfo(param, successHandling)
    },
    /**
     * 배송지변경 버튼
     * @param {String} catsIdx
     */
    async clickChangeAddress (catsIdx) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_주문상세내역',
          eventAction: '주문후활동',
          eventLabel: '배송지변경',
          params: {
            t1: null
          }
        }
      })

      const param = {
        tasknm: 'alejandro',
        var: JSON.stringify({
          cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
          mnm: 'checkOrderStatus',
          args: {
            ordersId: this.orders.ordersId
          }
        })
      }

      const successHandling = data => {
        if (data.list.lockedOrderYn === 'Y') {
          // 상담사 Lock 여부 (DB Transaction)
          messageUtil.alert('선택하신 주문은 상담원이 처리중입니다.')
          return false
        } else if (data.list.lastupdateall !== this.orders.lastupdateall || data.list.latestOperationId !== this.orders.latestOperationId) {
          // 주문 수정일자 & 임시 처리 순번 체크 (DB Transaction)
          messageUtil.alert('이미 등록한 배송정보로 배송이 진행되고 있어 변경할 수 없습니다.')
          // 주문 상태가 변경되었습니다. 1:1 문의 또는 고객센터(1800-0770)로 문의하시기 바랍니다.
          return false
        }

        const param2 = {
          tasknm: 'alejandro',
          var: JSON.stringify({
            cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
            mnm: 'chkRcOrderDtlStats',
            args: {
              ordersId: this.orders.ordersId,
              memberId: loginUtil.userId()
            }
          })
        }

        const successHandling2 = data => {
          // RC DB와 주문 상세가 다른 경우 (실시간 I/F)
          if (data.list.respCd !== 'S') {
            messageUtil.alert('이미 등록한 배송정보로 배송이 진행되고 있어 변경할 수 없습니다.')
            // 주문 상태가 변경되었습니다.<br />1:1 문의 또는 고객센터(1800-0770)로 문의하시기 바랍니다.
            return false
          }

          let slctDay = ''
          for (let i = 0; i < this.orders.cats.length; i++) {
            if (!isNull(this.orders.cats[i].slctDay)) {
              slctDay = this.orders.cats[i].slctDay
            }
          }

          if (loginUtil.checkLogonStatus()) {
            const globalVal = {
              deliveryInfo: '',
              mInputParams: {
                orderId: this.orders.ordersId,
                slctDayVal: slctDay,
                bSetCustDeliveryMsg: false
              },
              paymentData: {
                deliveryList: [{
                  ITEMS: [this.orders.cats[catsIdx]]
                }]
              }
            }

            const callback = result => {
              if (!isNull(result)) {
                const tmpResultAddressId = result.addressID

                // 온라인 지정일 배송이 아닌경우에만 체크
                if (slctDay === '' && this.multi[catsIdx].addrId === result.addressID) {
                  messageUtil.alert('주문시 배송지와 동일한 배송지로 변경하실 수 없습니다.')
                  return false
                }

                this.multi[catsIdx].lastname = result.lastname
                this.multi[catsIdx].address1 = result.cst_addr
                this.multi[catsIdx].address2 = result.cst_addrDetail
                this.multi[catsIdx].phone11 = getPhoneNumber(result.phone1.trim(), '1')
                this.multi[catsIdx].phone12 = getPhoneNumber(result.phone1.trim(), '2')
                this.multi[catsIdx].phone13 = getPhoneNumber(result.phone1.trim(), '3')
                this.multi[catsIdx].message = result.commandContext

                const param3 = {
                  orders_id: this.orders.ordersId,
                  users_id: loginUtil.userId(),
                  cust_num: loginUtil.custNum(),
                  accptPath: COMM_CONST.DEFAULT_PARAMS.accptPath,
                  deliveryModifyList: `[${JSON.stringify({
                  orgAddress_id: this.multi[catsIdx].addrId,
                  ADDRESS_ID: result.addressID,
                  NICKNAME: result.nickname,
                  LASTNAME: result.lastname,
                  DLVY_NICNAME: result.lastname,
                  DLVY_POSTCODE1: result.zipCode,
                  DLVY_POSTCODE2: result.zipCode,
                  DLVY_ADDRESS1: result.cst_addr,
                  DLVY_ADDRESS2: result.cst_addrDetail,
                  FAX1: result.fax1,
                  ZIPCODE: result.zipCode,
                  ADDRESS1: result.cst_addr,
                  ADDRESS2: result.cst_addrDetail,
                  ADDRESS3: result.address3,
                  PHONE1TYPE: 'K',
                  PHONE2TYPE: 'T',
                  PHONE1: result.phone1,
                  PHONE2: result.phone2,
                  MOBILE_NO11: getPhoneNumber(result.phone1, '1'),
                  MOBILE_NO12: getPhoneNumber(result.phone1, '2'),
                  MOBILE_NO13: getPhoneNumber(result.phone1, '3'),
                  MOBILE_NO21: getPhoneNumber(result.phone2, '1'),
                  MOBILE_NO22: getPhoneNumber(result.phone2, '2'),
                  MOBILE_NO23: getPhoneNumber(result.phone2, '3'),
                  DLVY_MESSAGE: result.commandContext,
                  ziptype: result.fax1,
                  SEC_ZIPCODE: result.zipCode,
                  SEC_ADDRESS1: result.address2,
                  SEC_ADDRESS2: result.address3,
                  ADDINFO: ''
                })}]`,
                  slctDayVal: slctDay
                }

                const successHandling3 = data => {
                  if (undefined === data.msg) {
                    messageUtil.alert('배송지 변경을 실패하였습니다.')
                  }
                  // NSSR-28019 배송지 변경 이후 페이지 이동으로 처리(navi.moveBack()으로 할 경우 최근배송지, 배송주소록 선택 시 주문서상세 페이지로 이동하지 않음)
                  if (data.msg.result === 'success' && data.msg.resultCode === '0') {
                    this.$forceUpdate()
                    this.orders.orderitems[catsIdx].addressId = tmpResultAddressId
                    this.multi[catsIdx].addrId = tmpResultAddressId
                    this.getOrdersDetailInfo()
                    toastUtil.show('배송지가 변경되었습니다.')
                  // 배송지선택 개편 start
                  } else if (data.msg.result === 'failure' && data.msg.resultCode === '1' && data.msg.errorCode === 'M') {
                    if (data.msg.resultMessage !== null && data.msg.resultMessage === 'ADDRESS3_byte_error') { // [NSSR-41375] 주소 변경 시 ADDRESS3 length 길이 체크 추가.
                      messageUtil.alert('주소 상세는 100byte를 초과할 수 없습니다.')
                    } else {
                      messageUtil.alert('배송이 완료되어 주문변경 및 취소 불가능상태입니다.') // inQkang 배송지선택 개편 end
                    }
                  // 배송지선택 개편 end
                  } else {
                    messageUtil.alert('배송지 변경을 실패하였습니다.')
                  }
                }

                mypageOrderDetailService.changeAddress(param3, successHandling3)
              }
            }

            // 회원 배송지 변경 팝업
            popupUtil.show('order/OrderDeliveryChange', { title: '배송지 변경', titleAlign: 'center', globalVal }, callback)
          } else {
            // 비회원 배송지 변경 팝업
            popupUtil.show('order/OrderDeliveryChangeGuest', {}, () => {})
          }
        }

        mypageOrderDetailService.chkRcOrderDtlStats(param2, successHandling2)
      }

      mypageOrderDetailService.checkOrderStatus(param, successHandling)
    },
    /**
     * 결제수단 변경 버튼
     */
    async clickPayByCard () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_주문상세내역',
          eventAction: '주문후활동',
          eventLabel: '결제수단변경',
          params: {
            t1: null
          }
        }
      })

      const ordersId = this.orders.ordersId
      let inVal = {
        cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
        mnm: 'checkOrderStatus',
        args:
          {
            ordersId
          }
      }

      const invokeParams1 = {
        tasknm: 'alejandro',
        var: JSON.stringify(inVal)
      }
      const lastupdateall = this.orders.lastupdateall
      const latestOperationId = this.orders.latestOperationId

      const data1 = await orderPaymentMethodChangeService.checkOrderStatus(invokeParams1)
      if (data1.list.lockedOrderYn === 'Y') { // 상담사 Lock 여부 (DB Transaction)
        messageUtil.alert('선택하신 주문은 상담원이 처리중입니다.', () => {})
        return false
      } else if ((String(data1.list.lastupdateall) !== String(lastupdateall) ||
                  String(data1.list.latestOperationId) !== String(latestOperationId))) { //  주문 수정일자 & 임시 처리 순번 체크 (DB Transaction)
        messageUtil.alert('주문상태가 변경 되었습니다.<br />1:1 문의 또는 고객센터(1800-0770)로 문의주시기 바랍니다.', () => {})
        return false
      }

      inVal = {
        cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
        mnm: 'chkRcOrderDtlStats',
        args:
          {
            ordersId,
            memberId: loginUtil.userId()
          }
      }

      const invokeParams2 = {
        tasknm: 'alejandro',
        var: JSON.stringify(inVal)
      }

      const data2 = await orderPaymentMethodChangeService.chkRcOrderDtlStats(invokeParams2)
      if (data2.list.respCd !== 'S') { // RC DB와 주문 상세가 다른 경우 (실시간 I/F)
        messageUtil.alert('주문상태가 변경 되었습니다.<br />1:1 문의 또는 고객센터(1800-0770)로 문의주시기 바랍니다.', () => {})
        return false
      } else if (data2.list.depositInYN === 'Y') {
        messageUtil.alert('이미 무통장입금 완료된 주문 입니다.<br />주문내역으로 이동합니다.', () => {})
        return false
      } else {
        const paramPopup = {
          title: '결제수단 변경',
          titleAlign: 'center',
          isShowSearch: false,
          isShowCart: false,
          from: this.$options.name,
          ordersId: this.orders.ordersId,
          lastupdateall: this.orders.lastupdateall,
          latestOperationId: this.orders.latestOperationId
        }

        popupUtil.show('order/OrderPaymentMethodChange', paramPopup)
      }
    },
    /**
     * 취소상세 보기 버튼
     */
    async clickOrderCancelDetail () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_주문상세내역',
          eventAction: '주문후활동',
          eventLabel: '취소상세보기',
          params: {
            t1: null
          }
        }
      })
      const param = {
        title: '취소상세내역',
        isShowSearch: true,
        isShowCart: true,
        ordersId: this.orders.ordersId,
        footerShow: true,
        bottomShow: true
      }

      const callback = result => {
        if (loginUtil.checkLogonStatus()) {
          let cmd = ''
          if (this.$route.path.includes('cancel-return-exchange')) {
            cmd = 'MypageOrderList'
          }
          this.$store.commit('popup/hide', { cmd })
        }
      }

      popupUtil.show('order/cancel/OrderCancelDetailStatement', param, callback)
    },
    /**
     * 교환상세 보기 버튼
     */
    async clickExchangeOrderDetail () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // 추후 구현
      messageUtil.alert('교환상세 보기 버튼 추후 구현')
    },
    /**
     * 반품상세 보기 버튼
     */
    async clickRefundOrderDetail () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      const param = {
        title: '반품상세내역',
        isShowSearch: true,
        isShowCart: true,
        ordersId: this.orders.ordersId,
        footerShow: true,
        bottomShow: true
      }

      const callback = result => {
        console.log(result)
      }

      popupUtil.show('order/return/OrderReturnDetailStatement', param, callback)
    },
    /**
     * 주문취소
     */
    async clickOrderCancel () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      let isWpayAcct = false
      for (let i = 0; i < this.orders.payms.length; i++) {
        if (this.orders.payms[i].paymentcode === '1700') {
          isWpayAcct = true
        }
      }
      if (isWpayAcct) {
        messageUtil.alert('NS페이 계좌이체로 결제 취소시 환불은 영업일 기준 2일 이내에 처리됩니다.')
      }

      // 상담사 카드주문일 때
      if (this.orders.hasCantTraceCardYn === 'Y') {
        // 단일 상품이 아니고
        if (this.orders.cats.length > 1) {
          messageUtil.alert('본 상품의 취소/반품은 상담원을 통해서 신청해 주시기 바랍니다.')
          return false
        }
        // 무통장입금이 포함되어 있을 때
        for (let i = 0; i < this.orders.payms.length; i++) {
          if (this.orders.payms[i].paymentcode === '200') {
            messageUtil.alert('본 상품의 취소/반품은 상담원을 통해서 신청해 주시기 바랍니다.')
            return false
          }
        }
      }

      const param = {
        tasknm: 'alejandro',
        var: JSON.stringify({
          cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
          mnm: 'checkOrderStatus',
          args: {
            ordersId: this.orders.ordersId
          }
        })
      }

      const successHandling = data => {
        // 상담사 Lock 여부 (DB Transaction)
        if (data.list.lockedOrderYn === 'Y') {
          messageUtil.alert('선택하신 주문은 상담원이 처리중입니다.')
          return false
        } else if (data.list.lastupdateall !== this.orders.lastupdateall || data.list.latestOperationId !== this.orders.latestOperationId) {
          messageUtil.alert('주문 상태가 변경되었습니다.<br />1:1 문의 또는 고객센터(1800-0770)로 문의하시기 바랍니다.')
          return false
        } else if (undefined !== data.list.canYn && data.list.canYn === 'N') {
          messageUtil.alert('주문취소가 불가능한 상태입니다.<br />1:1 문의 또는 고객센터(1688-0770)로 문의주시기 바랍니다.')
          return false
        }

        const invokeParams = {
          tasknm: 'alejandro',
          var: JSON.stringify({
            cnm: 'com.ns.commerce.nsmypage.util.NSAlejandroAdapter',
            mnm: 'chkRcOrderDtlStats',
            args: {
              ordersId: this.orders.ordersId,
              memberId: this.orders.memberId
            }
          })
        }

        const successHandling = data => {
          // RC DB와 주문 상세가 다른 경우 (실시간 I/F)
          if (data.list.respCd !== 'S') {
            messageUtil.alert('주문 상태가 변경되었습니다.<br />1:1 문의 또는 고객센터(1800-0770)로 문의하시기 바랍니다.')
            return false
          }

          // 주문취소 화면 이동
          this.orderCancelInfo.result = ''
          const param = {
            title: '주문취소',
            // titleAlign: 'center',
            isShowSearch: true,
            isShowCart: true,
            footerShow: true,
            bottomShow: true,
            ordersId: this.orders.ordersId,
            action: 'CANCEL',
            pageData: this.orders,
            tabIndex: 0,
            counselor: this.orders.hasCantTraceCardYn, // counselor 추가 (카드면서 상담사일 경우)
            orderCancelInfo: this.orderCancelInfo
          }

          const callback = data => {
            // 성공: SUCCESS(목록 새로고침), 취소: CANCEL, 실패: FAIL
            if ((!isNull(data) && data.result === 'SUCCESS') || this.orderCancelInfo.result === 'SUCCESS') {
              this.getOrdersDetailInfo()
            }
          }

          popupUtil.show('order/cancel/OrderCancel', param, callback)
        }

        // RC DB와 주문 상세가 다른 경우 체크 통신
        mypageOrderListService.orderCancelChkRcOrderDtlStats(invokeParams, successHandling)
      }

      // 상담원 처리 유무 체크 통신
      mypageOrderListService.orderCanceclCheckOrderStatus(param, successHandling)
    },
    /**
     * 반품신청 버튼
     */
    async clickRefundOrder () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // 반품불가 상품 체크 -> 불가상품이면 alert 띄움
      // (1.단일주문(1개상품코드,1개단품코드) 외, 2. 복합결제)
      if (!(this.orders.payms.length === 1 && this.orders.cats.length === 1)) {
        // 임시 처리 - 반품신청 불가 상품은 무조건 막는다
        messageUtil.confirm('신청하신 상품의 반품은 고객센터(1800-0770)를 통해 요청 가능합니다.<br><br><b>고객센터로 전화연결을 하시겠습니까?</b><br>NSmall 상담시간(평일) : 09:00~18:00',
          () => {
            document.location.href = 'tel:1800-0770'
          },
          null,
          '전화연결',
          '취소'
        )
        return false
      }

      const param = {
        tasknm: 'checkRefundItem',
        var: this.orders.ordersId
      }

      const successHandling = data => {
        if (data.list.resultCd === 'Y') {
          // 반품신청화면 이동
          this.orderReturnInfo.result = ''
          const param = {
            title: '반품신청',
            // titleAlign: 'center',
            isShowSearch: true,
            isShowCart: true,
            footerShow: true,
            bottomShow: true,
            ordersId: this.orders.ordersId,
            action: 'RETURN',
            objOrder: this.orders,
            objCats: this.orders.cats[0],
            tabIndex: 0,
            orderReturnInfo: this.orderReturnInfo
          }

          const callback = data => {
            // 성공: SUCCESS(목록 새로고침), 취소: CANCEL, 실패: FAIL
            if ((!isNull(data) && data.result === 'SUCCESS') || this.orderReturnInfo.result === 'SUCCESS') {
              this.getOrdersDetailInfo()
            }
          }
          popupUtil.show('order/return/OrderReturn', param, callback)
        } else {
          messageUtil.confirm('신청하신 상품의 반품은 고객센터(1800-0770)를 통해 요청 가능합니다.<br><br><b>고객센터로 전화연결을 하시겠습니까?</b><br>NSmall 상담시간(평일) : 09:00~18:00',
            () => {
              document.location.href = 'tel:1800-0770'
            },
            null,
            '전화연결',
            '취소'
          )
        }
      }

      mypageOrderListService.clickRefundOrder(param, successHandling)
    },
    /**
     * 교환신청 버튼
     */
    async clickExchangeOrder () {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      messageUtil.confirm('신청하신 상품의 교환은 고객센터(1800-0770)를 통해 요청 가능합니다.<br><br><b>고객센터로 전화연결을 하시겠습니까?</b><br>NSmall 상담시간(평일) : 09:00~18:00',
        () => {
          document.location.href = 'tel:1800-0770'
        },
        null,
        '전화연결',
        '취소'
      )
    },
    /**
     * 배송조회 버튼
     */
    async clickDeliveryHistory (catsIdx) {
      if (!loginUtil.checkLogonStatus()) {
        await bizUtil.secessionMemberCheker()
      }

      // dlvrEntCd(택배사코드) / wblNum(운송장번호)
      const param = {
        tasknm: 'alejandro',
        var: JSON.stringify({
          cnm: 'com.ns.commerce.nsmypage.helper.NSMypageCommJDBCHelper',
          mnm: 'getShipInfo',
          args: {
            ordersId: this.orders.ordersId,
            orderitemsId: this.orders.cats[catsIdx].orderitemsId,
            addressId: this.orders.cats[catsIdx].addressId,
            catentryId: this.orders.cats[catsIdx].catentryId,
            status: this.orders.cats[catsIdx].status
          }
        })
      }

      const successHandling = data => {
        if (data && data.list && data.list.url) {
          if (isNull(data.list.dlvrEntCd)) {
            window.open(data.list.url)
          } else {
            // 배송조회 팝업 호출
            const param = {
              title: '배송조회',
              // titleAlign: 'center',
              isShowSearch: true,
              isShowCart: true,
              footerShow: true, // 팝업에 푸터 노출
              bottomShow: true, // 팝업에 하단 탭바 노출
              ordersId: this.orders.ordersId,
              guestResultYn: 'N',
              logonType: 'normal',
              intPrdYn: this.orders.cats[catsIdx].intPrdYn,
              dlvrEntCd: this.orders.cats[catsIdx].dlvrEntCd, // 택배사코드
              wblNum: this.orders.cats[catsIdx].wblNum, // 운송장번호
              catsIdx
            }

            const callback = result => {
            }

            popupUtil.show('order/tracking/OrderDeliveryTracking', param, callback)
          }
        } else {
          messageUtil.alert('배송정보가 존재하지 않습니다.')
        }
      }

      mypageOrderListService.clickDeliveryHistory(param, successHandling)
    },
    /**
     * 결제수단
     */
    getRelName (paymdtl) {
      return isNull(paymdtl.relNm) || paymdtl.relNm === '-' ? '' : paymdtl.relNm
    },
    /**
     * 할부개월수
     */
    getInstmMmCnt (paymInfo) {
      let strInstmMmCnt = ''

      if (paymInfo.paymentcode === '100' && paymInfo.paymdtls.length > 0) {
        if (paymInfo.paymdtls[0].irFreeYn === 'Y') {
          strInstmMmCnt = `, 무이자${paymInfo.paymdtls[0].irFreeInstmMmCnt}개월`
        } else {
          strInstmMmCnt = paymInfo.paymdtls[0].instmMmCnt === '00' ? ', 일시불' : `, ${paymInfo.paymdtls[0].instmMmCnt}개월`
        }
      }

      return strInstmMmCnt
    },
    getPaymentName (paymentName) {
      return paymentName === 'NS페이 실시간계좌이체' ? 'NS페이 계좌' : paymentName
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/detail/MypageOrderDetail";
</style>
