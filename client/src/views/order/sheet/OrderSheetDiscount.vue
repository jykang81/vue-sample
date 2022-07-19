<template>
  <div class="order_sheet_discount">
    <!-- 할인/혜택 사용 -->
    <h3 class="subject">
      할인/혜택 사용
    </h3>
    <dl class="discount">
      <!-- 임직원 할인 -->
      <dt v-show="showDiscountStaff">
        <input id="checkedEmployee" v-model="globalVal.discountInfo.checkedEmployee"
               type="checkbox"
               class="checkbox square"
               :disabled="disabledEmployee"
               @change="oncheckedStaffCoupon()"
        >
        <div>
          <label for="checkedEmployee">
            <span class="check_label">임직원 할인</span>
            <span class="guide">{{ employeeBalanceAmt }}</span>
          </label>
        </div>
      </dt>
      <dd v-show="showDiscountStaff">
        <label>
          <input type="text" :value="employeeDcAmt" placeholder="0" readonly>
          <span>원</span>
        </label>
      </dd>
      <!-- 일시불 할인 -->
      <dt v-show="showSinglePaymentDiscount">
        <input id="checkedSinglePaymentDiscount" v-model="globalVal.discountInfo.checkedSinglePaymentDiscount" type="checkbox" class="checkbox square" @change="onchangeSinglePaymentDiscount()">
        <div>
          <label for="checkedSinglePaymentDiscount">
            <span class="check_label">일시불 할인</span>
          </label>
        </div>
      </dt>
      <dd v-show="showSinglePaymentDiscount">
        <label>
          <input type="text" :value="cardDcAmt" placeholder="0" readonly>
          <span>원</span>
        </label>
      </dd>
      <!-- 카드선할인 -->
      <dt v-show="showCardPreDcAmt">
        <input id="checkedCardPreDcAmt" v-model="checkedCardPreDcAmt" type="checkbox" class="checkbox square" disabled>
        <div>
          <label for="checkedCardPreDcAmt">
            <span class="check_label">카드선할인</span>
          </label>
        </div>
      </dt>
      <dd v-show="showCardPreDcAmt">
        <label>
          <input type="text" :value="cardPreDcAmt" placeholder="0" readonly>
          <span>원</span>
        </label>
      </dd>
      <!-- 할인쿠폰 -->
      <dt v-show="showDcCoupons">
        <input id="checkedCoupons"
               v-model="checkedCoupons"
               type="checkbox"
               class="checkbox square"
               :disabled="disabledCheckboxCoupons || totalCouponCount === 0"
               @change="oncheckedCouponbox()"
        >
        <div>
          <label for="checkedCoupons">
            <span class="check_label">할인쿠폰 <strong>({{ totalCouponCount }}장)</strong></span>
          </label>
          <button type="button"
                  class="btn coral_border"
                  :class="openCoupon ? 'blind' : ''"
                  @click="couponOpen()"
          >
            <span>적용</span>
          </button>
          <button type="button"
                  class="btn dark_gray_border"
                  :class="openCoupon ? '' : 'blind'"
                  @click="couponClose()"
          >
            <span>닫기</span>
          </button>
        </div>
      </dt>
      <dd v-show="showDcCoupons">
        <label>
          <input type="text" :value="dcCouponAmt" placeholder="0" readonly>
          <span>원</span>
        </label>
      </dd>
      <!-- 할인쿠폰 목록 -->
      <dd
        v-show="showDcCoupons"
        class="coupon"
        :class="openCoupon ? 'active' : ''"
      >
        <ul class="coupon_list">
          <li
            v-for="(couponItem, indexCouponItem) in couponList"
            :key="indexCouponItem"
          >
            <p class="title">
              {{ getProductTitle(couponItem) }}
            </p>
            <!-- 할인쿠폰(1), 더할인쿠폰(2), 알뜰쿠폰(3) -->
            <template v-for="(selectboxItem, indexSelectboxItem) in couponItem.selectbox">
              <label :key="`${selectboxItem.orderItemsId}_${indexSelectboxItem}`" :class="'select' + (selectboxItem.disabled ? ' disabled' : '')">
                <select :id="selectboxItem.selectId" :disabled="selectboxItem.disabled" @change="onchangeCouponDiscount(selectboxItem.selectId)">
                  <template v-for="(optionItem, indexOptionItem) in selectboxItem.option">
                    <template v-if="optionItem.isView">
                      <option
                        :key="`${selectboxItem.orderItemsId}_${indexSelectboxItem}_${optionItem.data.CP_IDFR}_${indexOptionItem}`"
                        :value="optionItem.value"
                      >{{ optionItem.text }}
                      </option>
                    </template>
                  </template>
                </select>
              </label>
            </template>

            <!-- 무료배송쿠폰 -->
            <label v-show="showFreeDlvryCoupon" class="select">
              <select :id="`${freeDlvryCoupon.id}_${couponItem.ORDERITEMS_ID}`" @change="onchangeDeliveryCoupon(couponItem.ORDERITEMS_ID)">
                <template v-for="(optionItem, indexOptionItem) in freeDlvryCoupon.option">
                  <option
                    :key="indexOptionItem"
                    :value="optionItem.value"
                  >{{ optionItem.text }}
                  </option>
                </template>
              </select>
            </label>
          </li>
        </ul>
      </dd>

      <template v-for="(adjustmentItem, indexAdjustmentItem) in adjustmentList">
        <template v-if="adjustmentItem.name === PAY_ASSIST_CONST.INFO.RESERVED_AMT.EN && showReservesAvaAmt">
          <!-- 적립금 -->
          <dt :key="indexAdjustmentItem + '01'+ PAY_ASSIST_CONST.RESERVED_AMT">
            <input id="checkedReservedAmt" v-model="checkedReservedAmt" type="checkbox" class="checkbox square"
                   :disabled="disabledCheckboxReservedAmt"
                   @change="oncheckedSalebox(PAY_ASSIST_CONST.RESERVED_AMT)"
            >
            <div>
              <label for="checkedReservedAmt">
                <span class="check_label">적립금 <strong>({{ reservesAvaAmt }}원)</strong></span>
              </label>
            </div>
          </dt>
          <dd :key="indexAdjustmentItem + '02'+ PAY_ASSIST_CONST.RESERVED_AMT">
            <label>
              <input :value="globalVal.discountInfo.reservesUseAmt" type="tel" placeholder="0"
                     :disabled="disabledReservedAmt"
                     @paste="pasteValidChange($event)"
                     @input="inputOnlyNumber(PAY_ASSIST_CONST.RESERVED_AMT, $event)"
                     @focus="focusChangeInputType(PAY_ASSIST_CONST.RESERVED_AMT)"
                     @blur="onblurUseAmt(PAY_ASSIST_CONST.RESERVED_AMT)"
              >
              <span :class="adjustmentItem.amount === 0 ? 'empty' : ''">원</span>
            </label>
          </dd>
        </template>

        <template v-if="adjustmentItem.name === PAY_ASSIST_CONST.INFO.HAPPY_MONEY.EN">
          <!-- 해피머니 -->
          <dt :key="indexAdjustmentItem + '01'+ PAY_ASSIST_CONST.HAPPY_MONEY">
            <input id="checkedHappyMoneyAmt" v-model="checkedHappyMoneyAmt" type="checkbox" class="checkbox square"
                   :disabled="disabledCheckboxHappyMoneyAmt"
                   @change="oncheckedSalebox(PAY_ASSIST_CONST.HAPPY_MONEY)"
            >
            <div>
              <label for="checkedHappyMoneyAmt">
                <span class="check_label">해피머니 <strong>({{ happyMoneyAvaAmt }}원)</strong></span>
              </label>
              <button type="button" class="btn coral_border" @click="onclickAvaAmtLink(PAY_ASSIST_CONST.HAPPY_MONEY)">
                <span>조회</span>
              </button>
            </div>
          </dt>
          <dd :key="indexAdjustmentItem + '02'+ PAY_ASSIST_CONST.HAPPY_MONEY">
            <label>
              <input :value="globalVal.discountInfo.happyMoneyUseAmt" type="tel" placeholder="0"
                     :disabled="disabledHappyMoneyAmt"
                     @paste="pasteValidChange($event)"
                     @input="inputOnlyNumber(PAY_ASSIST_CONST.HAPPY_MONEY, $event)"
                     @focus="focusChangeInputType(PAY_ASSIST_CONST.HAPPY_MONEY)"
                     @blur="onblurUseAmt(PAY_ASSIST_CONST.HAPPY_MONEY)"
              >
              <span :class="adjustmentItem.amount === 0 ? 'empty' : ''">원</span>
            </label>
          </dd>
        </template>

        <template v-if="adjustmentItem.name === PAY_ASSIST_CONST.INFO.NS_GIFT_CARD.EN">
          <!-- NS상품권 -->
          <dt :key="indexAdjustmentItem + '01'+ PAY_ASSIST_CONST.NS_GIFT_CARD">
            <input id="checkedGiftCardAmt" v-model="checkedGiftCardAmt" type="checkbox" class="checkbox square"
                   :disabled="disabledCheckboxGiftCardAmt"
                   @change="oncheckedSalebox(PAY_ASSIST_CONST.NS_GIFT_CARD)"
            >
            <div>
              <label for="checkedGiftCardAmt">
                <span class="check_label">NS상품권 <strong>({{ nsGiftCardAvaAmt }}원)</strong></span>
              </label>
              <button type="button" class="btn coral_border" @click="onclickAvaAmtLink(PAY_ASSIST_CONST.NS_GIFT_CARD)">
                <span>등록</span>
              </button>
            </div>
          </dt>
          <dd :key="indexAdjustmentItem + '02'+ PAY_ASSIST_CONST.NS_GIFT_CARD">
            <label>
              <input :value="globalVal.discountInfo.nsGiftCardUseAmt" type="tel" placeholder="0"
                     :disabled="disabledGiftCardAmt"
                     @paste="pasteValidChange($event)"
                     @input="inputOnlyNumber(PAY_ASSIST_CONST.NS_GIFT_CARD, $event)"
                     @focus="focusChangeInputType(PAY_ASSIST_CONST.NS_GIFT_CARD)"
                     @blur="onblurUseAmt(PAY_ASSIST_CONST.NS_GIFT_CARD)"
              >
              <span :class="adjustmentItem.amount === 0 ? 'empty' : ''">원</span>
            </label>
          </dd>
        </template>

        <template v-if="adjustmentItem.name === PAY_ASSIST_CONST.INFO.DEPOSIT_AMT.EN && showDepositAvaAmt">
          <!-- 예치금 -->
          <dt :key="indexAdjustmentItem + '01'+ PAY_ASSIST_CONST.DEPOSIT_AMT">
            <input id="checkedDepositAmt" v-model="checkedDepositAmt" type="checkbox" class="checkbox square"
                   :disabled="disabledCheckboxDepositAmt"
                   @change="oncheckedSalebox(PAY_ASSIST_CONST.DEPOSIT_AMT)"
            >
            <div>
              <label for="checkedDepositAmt">
                <span class="check_label">예치금 <strong>({{ depositAvaAmt }}원)</strong></span>
              </label>
            </div>
          </dt>
          <dd :key="indexAdjustmentItem + '02'+ PAY_ASSIST_CONST.DEPOSIT_AMT">
            <label>
              <input :value="globalVal.discountInfo.depositUseAmt" type="tel" placeholder="0"
                     :disabled="disabledDepositAmt"
                     @paste="pasteValidChange($event)"
                     @input="inputOnlyNumber(PAY_ASSIST_CONST.DEPOSIT_AMT, $event)"
                     @focus="focusChangeInputType(PAY_ASSIST_CONST.DEPOSIT_AMT)"
                     @blur="onblurUseAmt(PAY_ASSIST_CONST.DEPOSIT_AMT)"
              >
              <span :class="adjustmentItem.amount === 0 ? 'empty' : ''">원</span>
            </label>
          </dd>
        </template>

        <template v-if="adjustmentItem.name === PAY_ASSIST_CONST.INFO.OK_CASHBAG.EN">
          <!-- OK캐쉬백 -->
          <dt :key="indexAdjustmentItem + '01'+ PAY_ASSIST_CONST.OK_CASHBAG">
            <input id="checkedOkCashbagAmt" v-model="checkedOkCashbagAmt" type="checkbox" class="checkbox square"
                   :disabled="disabledCheckboxOkCashbagAmt"
                   @change="oncheckedSalebox(PAY_ASSIST_CONST.OK_CASHBAG)"
            >
            <div>
              <label for="checkedOkCashbagAmt">
                <span class="check_label">OK캐쉬백 <strong>({{ okCashbagAvaAmt }}원)</strong></span>
              </label>
              <button type="button" class="btn coral_border" @click="onclickAvaAmtLink(PAY_ASSIST_CONST.OK_CASHBAG)">
                <span>조회</span>
              </button>
            </div>
          </dt>
          <dd :key="indexAdjustmentItem + '02'+ PAY_ASSIST_CONST.OK_CASHBAG">
            <label>
              <input :value="globalVal.discountInfo.okCashbagUseAmt" type="tel" placeholder="0"
                     :disabled="disabledOkCashbagAmt"
                     @paste="pasteValidChange($event)"
                     @input="inputOnlyNumber(PAY_ASSIST_CONST.OK_CASHBAG, $event)"
                     @focus="focusChangeInputType(PAY_ASSIST_CONST.OK_CASHBAG)"
                     @blur="onblurUseAmt(PAY_ASSIST_CONST.OK_CASHBAG)"
              >
              <!-- 0원일때 class="empty 추가" -->
              <span :class="adjustmentItem.amount === 0 ? 'empty' : ''">원</span>
            </label>
          </dd>
        </template>
      </template>
    </dl>
  </div>
</template>

<script>
import messageUtil from '@frameworks/messageUtil'
import modalUtil from '@frameworks/modalUtil'
import {
  htmlDecode,
  insertCommas,
  isNull
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'

import COMM_CONST from '@constants/framework/constants'
import { PAY_TYPE_CONST, PAY_ASSIST_CONST } from '@/common/constants/order/order'

import discountAmountMixin from '@/mixins/order/sheet/discountAmountMixin'
import singlePaymentDiscountMixin from '@/mixins/order/sheet/singlePaymentDiscountMixin'
import finalPaymentAmountMixin from '@/mixins/order/sheet/finalPaymentAmountMixin'
import discountMixin from '@/mixins/order/sheet/discount/discountMixin'
import paymentNspayMixin from '@/mixins/order/sheet/payment/paymentNspayMixin'

export default {
  mixins: [
    discountAmountMixin,
    singlePaymentDiscountMixin,
    finalPaymentAmountMixin,
    discountMixin,
    paymentNspayMixin
  ],
  props: {
    paymentData: {
      type: Object,
      required: true
    },
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isFloorMode: true,
      openCoupon: false,

      couponAlertCheck: true,
      happyDealCouponFlag: 'N',

      // 할인정보
      checkedShipDcAmt: false, // 배송비할인 체크여부
      checkedOfferDcAmt: false, // 가격할인 체크여부
      checkedCardPreDcAmt: false, // 카드선할인 체크여부

      // 쿠폰정보
      couponList: [],
      autoSelectedCoupon: [], // 자동선택 목록
      staffCouponList: [], // 임직원 쿠폰 자동선택 목록
      previousCoupons: {}, // 이전에 선택된 쿠폰
      couponCount: {}, // 화면에 생성되는 쿠폰을 카운트 한다
      checkedCoupons: false, // 쿠폰 체크박스 체크여부
      disabledCheckboxCoupons: false, // 쿠폰 체크박스 비활성화 여부
      showDcCoupons: true, // 쿠폰 사용여부
      freeDlvryCoupon: { // 무료배송쿠폰 selectbox
        id: 'coupon_freeshipping',
        name: '',
        selected: '',
        option: []
      }, // 무료배송쿠폰 리스트
      showFreeDlvryCoupon: false, // 무료배송쿠폰 숨김/사용
      totalCouponCount: 0,

      // 할인정보
      CONST_MODE: {
        CHECKBOX: 'CHECKBOX',
        INPUT: 'INPUT',
        CANCEL: 'CANCEL'
      },
      adjustmentList: [], // 할인정보 목록

      checkedReservedAmt: false, // 적립금 체크박스 체크여부
      checkedHappyMoneyAmt: false, // 해피머니 체크박스 체크여부
      checkedGiftCardAmt: false, // NS상품권 체크박스 체크여부
      checkedDepositAmt: false, // 예치금 체크박스 체크여부
      checkedOkCashbagAmt: false, // OK캐쉬백 체크박스 체크여부
      checkedAnnualDcAmt: false, // 연간할인권 체크박스 체크여부 (기능제외)
      checkedNetiWellAmt: false, // 네티웰 체크박스 체크여부 (기능제외)

      disabledCheckboxReservedAmt: false, // 적립금  체크박스 비활성화 여부
      disabledCheckboxHappyMoneyAmt: false, // 해피머니  체크박스 비활성화 여부
      disabledCheckboxGiftCardAmt: false, // NS상품권  체크박스 비활성화 여부
      disabledCheckboxDepositAmt: false, // 예치금  체크박스 비활성화 여부
      disabledCheckboxOkCashbagAmt: false, // OK캐쉬백  체크박스 비활성화 여부
      disabledCheckboxAnnualDcAmt: false, // 연간할인권 체크박스 비활성화 여부 (기능제외)
      disabledCheckboxNetiWellAmt: false, // 네티웰 체크박스 비활성화 여부 (기능제외)

      disabledReservedAmt: false, // 적립금  비활성화 여부
      disabledHappyMoneyAmt: false, // 해피머니  비활성화 여부
      disabledGiftCardAmt: false, // NS상품권  비활성화 여부
      disabledDepositAmt: false, // 예치금  비활성화 여부
      disabledOkCashbagAmt: false, // OK캐쉬백 비활성화 여부
      disabledAnnualDcAmt: false, // 연간할인권 비활성화 여부 (기능제외)
      disabledNetiWellAmt: false, // 네티웰 비활성화 여부 (기능제외)

      disabledInitReserved: false, // init 적립금  비활성화 여부
      disabledInitHappyMoney: false, // init 해피머니  비활성화 여부
      disabledInitGiftCard: false, // init NS상품권  비활성화 여부
      disabledInitDeposit: false, // init 예치금  비활성화 여부
      disabledInitOkCashbag: false, // init OK캐쉬백 비활성화 여부
      disabledInitAnnualDc: false, // init 연간할인권 비활성화 여부 (기능제외)
      disabledInitNetiWell: false, // init 네티웰 비활성화 여부 (기능제외)

      // 카드 일시불 할인 정보

      // NS임직원 할인 정보
      disabledEmployee: false, // NS임직원 할인 disabled
      isUseStaffBnftWithCoupon: false, // NS임직원 할인시 쿠폰과 중복사용 여부
      staffBnftBalanceAmt: 0, // NS임직원 잔여한도
      showDiscountStaff: false, // NS임직원 숨김/사용
      staffCouponId: '',

      // 상품마다 구매 수량 2개 이상일 때 사용할 변수 (event 에서 사용됨)
      firsttimeCalc: [],
      tempSeperatePrice: [],
      tempSeperatePriceBase: [],
      cpClssf: [],
      tempDiscountPrice: [],
      sumDiscountPrice: [],
      existStaffCp: false,
      isStaffBnftBigger: true
    }
  },
  computed: {
    /**
     * 결제 보조 수단 Const
     */
    PAY_ASSIST_CONST () {
      return PAY_ASSIST_CONST
    },
    /**
     * 임직원 할인금액
     * @returns {String}
     */
    employeeDcAmt () {
      if (this.globalVal.discountInfo.checkedEmployee) {
        return this.displayUseAmt(this.globalVal.discountInfo.dcCouponAmt)
      } else {
        return '0'
      }
    },
    /**
     * 임직원 잔여한도
     * @returns {String}
     */
    employeeBalanceAmt () {
      if (this.isUseStaffBnftWithCoupon) {
        return `(잔여한도 ${insertCommas(this.staffBnftBalanceAmt)}원)`
      } else {
        return '쿠폰과 중복 사용 불가'
      }
    },
    /**
     * 배송비할인
     * @returns {String}
     */
    shipDcAmt () {
      return this.displayUseAmt(this.globalVal.discountInfo.shipDcAmt)
    },
    /**
     * 배송비할인 보임/숨김 여부
     * @returns {String}
     */
    showShipDcAmt () {
      return this.getNumber(this.globalVal.discountInfo.shipDcAmt) > 0
    },
    /**
     * 가격할인
     * @returns {String}
     */
    offerDcAmt () {
      return this.displayUseAmt(this.globalVal.mOutputDatas.orderPrice.OFFER_AMT)
    },
    /**
     * 가격할인 보임/숨김 여부
     * @returns {String}
     */
    showOfferDcAmt () {
      return this.getNumber(this.globalVal.mOutputDatas.orderPrice.OFFER_AMT) > 0
    },
    /**
     * 카드할인, 일시불 할인금액
     * @returns {String}
     */
    cardDcAmt () {
      return this.displayUseAmt(this.globalVal.discountInfo.cardDcAmt)
    },
    /**
     * 카드할인, 일시불 할인금액 보임/숨김 여부
     * @returns {String}
     */
    showSinglePaymentDiscount () {
      return this.getNumber(this.globalVal.discountInfo.cardDcAmt) > 0 ||
              this.globalVal.discountInfo.showSinglePaymentDiscount
    },
    /**
     * 카드선할인
     * @returns {String}
     */
    cardPreDcAmt () {
      return this.displayUseAmt(this.globalVal.discountInfo.cardPreDcAmt)
    },
    /**
     * 카드선할인 보임/숨김 여부
     * @returns {String}
     */
    showCardPreDcAmt () {
      return this.getNumber(this.globalVal.discountInfo.cardPreDcAmt) > 0
    },
    /**
     * 할인쿠폰 금액
     * @returns {String}
     */
    dcCouponAmt () {
      if (this.globalVal.discountInfo.checkedEmployee && !this.isUseStaffBnftWithCoupon) {
        return '0'
      } else {
        return this.displayUseAmt(this.globalVal.discountInfo.dcCouponAmt + this.globalVal.discountInfo.shipDcAmt)
      }
    },
    /**
     * 적립금 사용가능금액
     * @returns {String}
     */
    reservesAvaAmt () {
      return insertCommas(this.globalVal.discountInfo.reservesAvaAmt)
    },
    /**
     * 적립금 보임/숨김 여부
     * @returns {String}
     */
    showReservesAvaAmt () {
      return this.getNumber(this.globalVal.discountInfo.reservesAvaAmt) > 0
    },
    /**
     * 해피머니 사용가능금액
     * @returns {String}
     */
    happyMoneyAvaAmt () {
      return insertCommas(this.globalVal.discountInfo.happyMoneyAvaAmt)
    },
    /**
     * NS상품권 사용가능금액
     * @returns {String}
     */
    nsGiftCardAvaAmt () {
      return insertCommas(this.globalVal.discountInfo.nsGiftCardAvaAmt)
    },
    /**
     * 예치금 사용가능금액
     * @returns {String}
     */
    depositAvaAmt () {
      return insertCommas(this.globalVal.discountInfo.depositAvaAmt)
    },
    /**
     * 예치금 보임/숨김 여부
     * @returns {String}
     */
    showDepositAvaAmt () {
      return this.getNumber(this.globalVal.discountInfo.depositAvaAmt) > 0
    },
    /**
     * OK캐쉬백 사용가능금액
     * @returns {String}
     */
    okCashbagAvaAmt () {
      return insertCommas(this.globalVal.discountInfo.okCashbagAvaAmt)
    },
    /**
     * 연간할인권 사용가능금액
     * @returns {String}
     */
    annualDcAvaAmt () {
      return insertCommas(this.globalVal.discountInfo.annualDcAvaAmt)
    },
    /**
     * 연간할인권 사용금액
     * @returns {String}
     */
    annualDcUseAmt () {
      return this.displayUseAmt(this.globalVal.discountInfo.annualDcUseAmt)
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.initMounted()

    /**
     * 임직원 제외 모두 비활성화 처리
     *  - this.$root.$emit('disabledAllExcludeEmployeeEmit')
     * @returns {void}
     */
    this.$root.$on('disabledAllExcludeEmployeeEmit', () => {
      this.disabledAllExcludeEmployee()
    })

    /**
     * 적립금/예치금 사용 모두 취소
     *  - this.$root.$emit('useAmtCancelEmit')
     * @returns {void}
     */
    this.$root.$on('useAmtCancelEmit', () => {
      this.useAmtCancel()
    })

    /**
     * 할인영역 적립금 비활성화
     * 결제수단선택 (OrderSheetPaymentMethodSelect - checkOtherPaymentMethod)
     * 신용카드 결제가 아니고, 모바일 결제가 아닌경우 적립금 비활성화
     *  - this.$root.$emit('disabledReserved')
     * @returns {void}
     */
    this.$root.$on('disabledReservedEmit', () => {
      this.disabledReserved(true)
    })

    /**
     * 배송지역 변경시 적립금/예치금, 무료배송 쿠폰 초기화
     *  - this.$root.$emit('changeShippingEmit')
     * @returns {void}
     */
    this.$root.$on('changeShippingEmit', () => {
      if (this.$route.name === 'orderSheet') {
        const preCheckedCoupons = this.checkedCoupons
        this.initFreeDlvryCoupon()
        if (this.checkedCoupons !== preCheckedCoupons) {
          this.checkedCoupons = preCheckedCoupons
        }

        this.useAmtCancel()
      }
    })
  },
  methods: {
    /**
     * init
     * @returns {void}
     */
    init () {
      this.setDiscountCoupons() // 쿠폰할인 출력
      this.setAdjustmentList() // 할인정보 출력
      this.setDiscountAmount() // 할인금액 출력
      this.setDisplayDcAmt() // 할인금액 화면설정

      if (this.globalVal.isGuest) {
        this.globalVal.showOrderSheetDiscount = this.showSinglePaymentDiscount
      }
    },
    /**
     * initMounted
     * @returns {void}
     */
    async initMounted () {
      this.setStaffDiscount(this.globalVal.mOutputDatas.msg.staffBnft) // 임직원 할인 노출 설정
      if (isNull(this.globalVal.mOutputDatas.msg.staffBnft) ||
          this.globalVal.mOutputDatas.msg.staffBnft.empYn !== 'Y') {
        this.setAutoSelectedCoupon() // 쿠폰자동 선택
      } else if (!isNull(this.globalVal.mOutputDatas.msg.staffBnft) &&
          this.globalVal.mOutputDatas.msg.staffBnft.empYn === 'Y' &&
          (this.isUseStaffBnftWithCoupon || !this.isStaffBnftBigger)) {
        this.setAutoSelectedCoupon() // 쿠폰자동 선택
      }

      await this.$nextTick()

      if (PAY_TYPE_CONST.isNotNaverpay(this.globalVal.mOutputDatas.OrderMethodSave.LastPayTypeCode) &&
        PAY_TYPE_CONST.isNotPayco(this.globalVal.mOutputDatas.OrderMethodSave.LastPayTypeCode)) {
        this.setSinglePaymentDiscount() // 일시불 할인 설정
      }
      this.applyStaffCoupon() // 임직원 할인 적용
      this.removeStaffCoupon() // 임직원 할인 관련
      this.disabledAvaAmt() // 보유액이 0원일때 비활성화

      if (!loginUtil.isLoggedIn() || loginUtil.logonType() === COMM_CONST.LOGON_TYPE.FACEBOOK) {
        this.showDcCoupons = false // 쿠폰 사용안함
      }

      this.globalVal.completeOrderSheetDiscount = true
    },
    /**
     * 할인쿠폰 열기
     * @returns {void}
     */
    couponOpen () {
      const coupon = document.querySelector('.coupon')
      const height = coupon.scrollHeight
      coupon.style.height = `${height}px`
      this.openCoupon = true
    },
    /**
     * 할인쿠폰 닫기
     * @returns {void}
     */
    couponClose () {
      const coupon = document.querySelector('.coupon')
      coupon.style.height = 0
      this.openCoupon = false
    },
    /**
     * 할인금액 체크박스 설정
     * @returns {void}
     */
    setDisplayDcAmt () {
      this.checkedShipDcAmt = this.globalVal.discountInfo.shipDcAmt > 0 // 배송비할인
      this.checkedOfferDcAmt = this.globalVal.mOutputDatas.orderPrice.OFFER_AMT > 0 // 가격할인
      this.globalVal.discountInfo.checkedSinglePaymentDiscount = this.globalVal.discountInfo.cardDcAmt > 0 // 일시불 할인
      this.checkedCardPreDcAmt = this.globalVal.discountInfo.cardPreDcAmt > 0 // 카드선할인
    },
    /**
     * 금액표시 ('-', 콤마)
     * @param {Number} amt
     * @returns {void}
     */
    displayUseAmt (amt) {
      const isZero = amt === 0
      const dispAmt = insertCommas(amt)
      return isZero ? dispAmt : `-${dispAmt}`
    },
    /**
     * 쿠폰 자동선택
     *  @returns {void}
     */
    setAutoSelectedCoupon () {
      if (this.autoSelectedCoupon.length > 0) {
        for (const itemCoupon of this.autoSelectedCoupon) {
          this.$nextTick(() => {
            document.getElementById(itemCoupon.selectboxId).value = itemCoupon.optionValue
            this.onchangeCouponDiscount(itemCoupon.selectboxId)
          })
        }
      } else {
        this.$nextTick(() => {
          this.checkedCoupons = false
        })
      }
    },
    /**
     * 주문상품 타이틀
     * @param {Object} data
     * @returns {void}
     */
    getProductTitle (item) {
      return htmlDecode(`${item.brandName && item.brandName !== '미정의' ? `[${item.brandName}]` : ''} ${item.productName}`)
    },
    /**
     * NS 임직원 할인 선택 이벤트 (ASIS: onchange_staffCoupon)
     * @returns {void}
     */
    oncheckedStaffCoupon () {
      if (!this.isUseStaffBnftWithCoupon) {
        this.checkedCoupons = false
      }
      this.oncheckedCouponbox()
      this.addStaffCoupon()
      this.$nextTick(() => {
        this.applyStaffCoupon()
      })
    },
    /**
     * 임직원 할인 체크시에 임직원 할인 쿠폰 추가된 후에 적용되어 계산한다.
     * @returns {void}
     */
    applyStaffCoupon () {
      if (this.globalVal.discountInfo.checkedEmployee) {
        if (this.staffCouponList.length > 0) {
          for (const itemStaffCoupon of this.staffCouponList) {
            document.getElementById(itemStaffCoupon.selectboxId).value = itemStaffCoupon.value
            this.onchangeCouponDiscount(itemStaffCoupon.selectboxId, true)

            if (!this.isUseStaffBnftWithCoupon) {
              const selectboxItem = this.getCouponSelectbox(itemStaffCoupon.selectboxId)
              if (selectboxItem.option.length > 1) {
                const removeIndex = selectboxItem.option.findIndex(option => { return option.value === itemStaffCoupon.value })
                if (removeIndex > 0) {
                  selectboxItem.option.splice(removeIndex, 1)
                }
                if (selectboxItem.option.length === 1) {
                  selectboxItem.option[0].text = '적용가능한 쿠폰 없음'
                  selectboxItem.disabled = true
                } else {
                  selectboxItem.option[0].text = selectboxItem.defaultText
                  selectboxItem.disabled = false
                }
              }
              document.getElementById(itemStaffCoupon.selectboxId).value = ''
            }
          }
        }
        this.couponClose()
      }
    },
    /**
     * 무료배송 쿠폰 초기화
     * @returns {void}
     */
    initFreeDlvryCoupon () {
      if (this.couponList.length > 0) {
        for (const couponItem of this.couponList) {
          if (this.freeDlvryCoupon.option.length > 0) {
            const freeDlvryCouponId = `${this.freeDlvryCoupon.id}_${couponItem.ORDERITEMS_ID}`
            document.getElementById(freeDlvryCouponId).value = ''
            this.onchangeDeliveryCoupon(couponItem.ORDERITEMS_ID)
          }
        }
      }
    },
    /**
     * 쿠폰 선택 박스 처리 (ASIS: oncheckbox_coupon)
     * @returns {void}
     */
    oncheckedCouponbox () {
      // 임직원 쿠폰정보(staffCouponElement) 있는경우 처리, ASIS: line 4569
      // 해피딜쿠폰(happydealcoupon_flag: Y/N) 처리
      if (this.checkedCoupons) {
        this.removeStaffCoupon()
        this.setAutoSelectedCoupon()
      } else {
        if (this.couponList.length > 0) {
          for (const couponItem of this.couponList) {
            for (const selectboxItem of couponItem.selectbox) {
              if (!isNull(selectboxItem.selectId)) {
                document.getElementById(selectboxItem.selectId).value = ''
                this.onchangeCouponDiscount(selectboxItem.selectId)
              }
            }

            if (this.freeDlvryCoupon.option.length > 0) {
              const freeDlvryCouponId = `${this.freeDlvryCoupon.id}_${couponItem.ORDERITEMS_ID}`
              document.getElementById(freeDlvryCouponId).value = ''
              this.onchangeDeliveryCoupon(couponItem.ORDERITEMS_ID)
            }
          }

          this.previousCoupons = {}
        }
      }
    },
    /**
     * 쿠폰할인 select onchange (ASIS: onchange_discountCoupons)
     * @param {String} selectboxId
     * @returns {void}
     */
    onchangeCouponDiscount (selectboxId, isStaff = false) {
      const selectedBox = this.getCouponSelectbox(selectboxId)
      const selectedOption = this.getCouponOption(selectedBox)

      if (isNull(selectedOption.value)) {
        if (this.couponList.length > 0) {
          for (const couponItem of this.couponList) {
            for (const selectboxItem of couponItem.selectbox) {
              if (!isNull(selectboxItem.selectId) &&
                  selectboxItem.selectId !== selectboxId &&
                  selectboxItem.couponIndex > selectedBox.couponIndex) {
                document.getElementById(selectboxItem.selectId).value = ''
              }
            }

            if (this.freeDlvryCoupon.option.length > 0) {
              const freeDlvryCouponId = `${this.freeDlvryCoupon.id}_${couponItem.ORDERITEMS_ID}`
              document.getElementById(freeDlvryCouponId).value = ''
              this.onchangeDeliveryCoupon(couponItem.ORDERITEMS_ID)
            }
          }
        }
        this.applyCouponDiscount(selectboxId, isStaff)
      } else {
        this.applyCouponDiscount(selectboxId, isStaff)
      }
    },
    /**
     * 쿠폰할인적용 select onchange (ASIS: onchange_discountCoupons)
     * @param {String} selectboxId
     * @returns {void}
     */
    applyCouponDiscount (selectboxId, isStaff = false) {
      const selectKeyList = this.paymentData.Discount.getDefineValue('CouponSelectInfo', 'selectKeyList')
      const selectedBox = this.getCouponSelectbox(selectboxId)
      const selectedOption = this.getCouponOption(selectedBox)
      let staffCouponFlag = false // 임직원 쿠폰인지 여부

      // 쿠폰 수량에 따른 중복 선택 체크
      if (!isNull(selectedOption.value)) {
        let nCount = 0

        for (const couponItem of this.couponList) {
          for (const selectbox of couponItem.selectbox) {
            if (!isNull(selectbox.orderItemsId)) {
              const targetOption = this.getCouponOption(selectbox)

              for (const option of selectbox.option) {
                if (targetOption.value === option.value) {
                  if (selectedOption.data.CP_IDFR === option.data.CP_IDFR) {
                    nCount++
                  }
                }
              }
            }
          }
        }

        if (this.staffCouponListId === selectedOption.data.CP_IDFR) {
          staffCouponFlag = true
        }

        if (Number(selectedOption.data.MAX_USE_NUM) < nCount) {
          // TOBE: confirm 확인, 취소 기능으로 변경
          messageUtil.confirm('다른 상품에 이미 적용 되어 있습니다. 변경하시겠습니까?', () => {
            const prevSelectbox = this.getPreviousCouponSelectboxByValue(selectedOption.value)
            if (!isNull(prevSelectbox)) {
              document.getElementById(prevSelectbox.selectId).value = ''
              this.onchangeCouponDiscount(prevSelectbox.selectId)
              if (!isNull(this.previousCoupons[prevSelectbox.selectId])) {
                this.previousCoupons[prevSelectbox.selectId] = ''
              }
            }
            this.onchangeCouponDiscount(selectboxId)
          }, () => {
            if (!isNull(this.previousCoupons[selectboxId])) {
              this.previousCoupons[selectboxId] = ''
            }

            document.getElementById(selectboxId).value = this.previousCoupons[selectboxId] || ''
            this.onchangeCouponDiscount(selectboxId)
          })

          return false
        }
      }

      if (selectKeyList.length - 1 >= selectedBox.couponIndex) {
        // ASIS 하위 쿠폰 목록을 모두 사용안함 처리
        for (let i = selectKeyList.length - 1; i >= selectedBox.couponIndex; i--) {
          this.paymentData.Discount.removeCouponItem(selectedBox.itemIndex, i + this.globalVal.CONST.DISCOUNT_COUPON_START_INDEX)
          if (i > selectedBox.couponIndex) {
            const dummy = this.couponList[selectedBox.itemIndex].selectbox.filter(o => o.couponIndex === i)
            if (!isNull(dummy) && dummy.length > 0) {
              document.getElementById(dummy[0].selectId).value = ''
            }
          }
        }

        // 상품 수량이 2개 이상이면서 임직원은 아닌 경우
        if (Number(selectedBox.data.QUANTITY) > 1 && !this.existStaffCp) {
          if (selectedBox.couponIndex === 0) {
            for (let v = 0; v < Number(selectedBox.data.QUANTITY); v++) {
              this.tempSeperatePrice[selectedBox.itemIndex][v] = this.tempSeperatePriceBase[selectedBox.itemIndex]
            }

            for (let w = 0; w < 4; w++) {
              this.tempDiscountPrice[selectedBox.itemIndex][w] = 0
            }
          } else if (selectedBox.couponIndex === 1 || selectedBox.couponIndex === 2 || selectedBox.couponIndex === 3) {
            for (let j = 3; j >= selectedBox.couponIndex; j--) {
              for (let i = 0; i < Number(selectedBox.data.QUANTITY); i++) {
                if (this.cpClssf[selectedBox.itemIndex][j] === '12' || this.cpClssf[selectedBox.itemIndex][j] === '14') {
                  if (i === 0) { this.tempSeperatePrice[selectedBox.itemIndex][i] = this.tempSeperatePrice[selectedBox.itemIndex][i] + this.tempDiscountPrice[selectedBox.itemIndex][j] }
                } else {
                  this.tempSeperatePrice[selectedBox.itemIndex][i] = this.tempSeperatePrice[selectedBox.itemIndex][i] + this.tempDiscountPrice[selectedBox.itemIndex][j]
                }
              }
            }

            for (let num = selectedBox.couponIndex; num < 4; num++) {
              this.tempDiscountPrice[selectedBox.itemIndex][num] = 0
            }
          }
        }
      }

      // 무료배송쿠폰
      if (this.freeDlvryCoupon.option.length > 0) {
        document.getElementById(`${this.freeDlvryCoupon.id}_${selectedBox.orderItemsId}`).value = ''
        this.onchangeDeliveryCoupon(selectedBox.orderItemsId)
      }

      // 적립금/예치금 사용 모두 취소
      this.useAmtCancel()

      if (isNull(selectedOption.value)) {
        this.recalcSinglePaymentDiscount() // 일시불할인 재계산 (ASIS: recalc_singlePaymentDiscount)
        this.setDiscountAmount() // 할인금액 정보 출력
        this.checkedCoupons = this.globalVal.discountInfo.dcCouponAmt > 0
        return false
      }

      // 일반쿠폰 적용 일 경우 임직원 할인 해제
      if (!staffCouponFlag && this.globalVal.discountInfo.checkedEmployee) {
        this.globalVal.discountInfo.checkedEmployee = false
        this.checkedCoupons = true

        for (let a = 0; a < this.paymentData.Discount.discountList.length; a++) {
          this.paymentData.Discount.removeCouponItem(a, 3)
        }
      }

      // 쿠폰 할인금액 계산에 사용할 상품아이템 정보
      const itemBaseData = this.globalVal.mOutputDatas.msg.OrderGoodList[selectedBox.itemIndex].itemBaseData
      const itemIndex = selectedBox.itemIndex
      const couponIndex = selectedBox.couponIndex
      const keyIndex = selectedBox.keyIndex

      // 할인 금액 계산
      const selectData = selectedBox.data
      const optionsData = selectedOption.data
      optionsData.WWW_AMT = Number(optionsData.WWW_AMT)
      optionsData.WWW_RATE = Number(optionsData.WWW_RATE)
      optionsData.MAX_USE_NUM = Number(optionsData.MAX_USE_NUM)

      const totalQuantity = (optionsData.MAX_USE_NUM > Number(selectData.QUANTITY) ? Number(itemBaseData.QTY) : optionsData.MAX_USE_NUM)
      const savedDiscountPrice = this.paymentData.Discount.getTotalDiscountPrice(itemIndex) // 선택한 쿠폰의 합산된 할인금액
      const dataOrderGoodList = this.globalVal.mOutputDatas.msg.OrderGoodList[itemIndex]
      let offerAmt = 0
      // 할인쿠폰, 더할인쿠폰, 가격할인은 별도 계산식에 따라 처리
      const strXCatentryDispXmdMinCntrbPfrate = dataOrderGoodList.goodsDetail.XCATENTRY_DISP_XMD_MIN_CNTRB_PFRATE // MD 이익률(문자열)
      if (undefined === strXCatentryDispXmdMinCntrbPfrate || strXCatentryDispXmdMinCntrbPfrate === null || strXCatentryDispXmdMinCntrbPfrate === '') {
        offerAmt += dataOrderGoodList.goodsDetail.IMDTDCCPAMT * dataOrderGoodList.goodsDetail.QUANTITY
      } else {
        const nPRICE = Number(dataOrderGoodList.goodsDetail.PRICE) // 매가 - dataOrderGoodList.goodsDetail.PRICE
        const nDcPrice = Number(dataOrderGoodList.goodsDetail.IMDTDCCPAMT) // 할인금액 - dataOrderGoodList.goodsDetail.PROM_VAL_CPC
        const nXPriceDtlCostVatPerdo = Number(dataOrderGoodList.goodsDetail._XPriceDtl_COST_VAT_PERDO) // 원가 VAT 별도금액 - dataOrderGoodList.goodsDetail._XPriceDtl_COST_VAT_PERDO
        const nXPriceDtlVatAmt = Number(dataOrderGoodList.goodsDetail._XPriceDtl_VAT_AMT) // 부과세액 - dataOrderGoodList.goodsDetail._XPriceDtl_VAT_AMT
        const nXCatentryDispXmdMinCntrbPfrate = Number(strXCatentryDispXmdMinCntrbPfrate) // MD 이익률 - dataOrderGoodList.goodsDetail.XCATENTRY_DISP_XMD_MIN_CNTRB_PFRATE

        // (매가 - 할인금액 - 원가 VAT 별도금액 - 부과세액) / 매가  >= MD 이익률
        if ((nPRICE - nDcPrice - nXPriceDtlCostVatPerdo - nXPriceDtlVatAmt) / nPRICE >= nXCatentryDispXmdMinCntrbPfrate / 100) {
          offerAmt += dataOrderGoodList.goodsDetail.IMDTDCCPAMT * dataOrderGoodList.goodsDetail.QUANTITY
        } else {
          offerAmt += 0
        }
      }

      // TV홈쇼핑 상품이면서, CTCOM인 경우 PROM_VAL_ARS 값이 있을 경우 할인 금액 세팅
      // 방송중 동일혜택
      const strBusChnId = dataOrderGoodList.goodsDetail.XBUSCHN_ID
      if ((strBusChnId === 'TV' || strBusChnId === 'TCOMM' || strBusChnId === 'SB' || strBusChnId === 'CTCOM') && undefined !== dataOrderGoodList.goodsDetail.PROM_VAL_ARS) {
        offerAmt = Number(dataOrderGoodList.goodsDetail.PROM_VAL_ARS) * dataOrderGoodList.goodsDetail.QUANTITY
      }

      // NSSR-37841 모바일에서 쿠폰과 일시불할인(정률) 동시 적용 시 계산 오류 수정
      // savedDiscountPrice는 일시불할인이 포함된 할인금액  => aBasePrice에 일시불할인금액을 더해준다
      const couponList = this.paymentData.Discount.getItem(itemIndex).couponList
      let lspPrice = 0 // 일시불할인 금액
      for (let i = 0; i < couponList.length; i++) {
        if (couponList[i] !== undefined && couponList[i] != null && couponList[i].PRMT_TYPE_CD === 'LSP') {
          lspPrice = Number(couponList[i].DiscountPrice)
        }
      }

      const aBasePrice = itemBaseData.Price - offerAmt - savedDiscountPrice + lspPrice

      // 알뜰쿠폰의 최소 판매금액을 적용하기 위한 로직, NSSR-24582
      if (couponIndex === '2') {
        let tBasePrice = Number(selectData.PRICE) - (savedDiscountPrice)
        if (tBasePrice < Number(selectData.DCPRICE)) {
          tBasePrice = Number(selectData.DCPRICE)
        }

        if (optionsData.AMT_START_VAL && Number(tBasePrice) < Number(optionsData.AMT_START_VAL)) {
          document.getElementById(selectboxId).value = ''
          this.onchangeCouponDiscount(selectboxId)
          return false
        }
      }

      this.cpClssf[itemIndex][couponIndex] = optionsData.CP_CLSSF
      if (Number(selectData.QUANTITY) > 1 && !this.existStaffCp && !this.firsttimeCalc[itemIndex]) { // 상품 수량이 2개 이상이면서 임직원은 아닌 경우
        for (let i = 0; i < Number(selectData.QUANTITY); i++) {
          this.tempSeperatePrice[itemIndex][i] = aBasePrice / Number(selectData.QUANTITY)
        }
        this.tempSeperatePriceBase[itemIndex] = aBasePrice / Number(selectData.QUANTITY)
      }

      // 상품 한개당 쿠폰 할인금액 계산(정액할인/정율할인금액)
      let tDiscountPrice = (optionsData.WWW_AMT > 0 ? (optionsData.WWW_AMT) : (aBasePrice / Number(selectData.QUANTITY) * (optionsData.WWW_RATE / 100)))

      let strSingDiscountPrice = 0
      if (Number(selectData.QUANTITY) === 1 || this.existStaffCp) { // 상품 수량이 1개이거나 임직원인 경우
        tDiscountPrice = Math.ceil(Math.round(tDiscountPrice) / 10) * 10
        // 정률일 경우에 최대치 보다 큰 할인은 최대치로 한다.
        if (optionsData.WWW_RATE > 0 && optionsData.MAX_BNFT_LIMIT) {
          optionsData.MAX_BNFT_LIMIT = Number(optionsData.MAX_BNFT_LIMIT)
          if (tDiscountPrice > optionsData.MAX_BNFT_LIMIT) {
            // 최고 한도에 걸릴경우 수량만큼 곱한다.
            tDiscountPrice = optionsData.MAX_BNFT_LIMIT
          }
        }
        strSingDiscountPrice = String(tDiscountPrice)
        tDiscountPrice = tDiscountPrice * totalQuantity
      } else if (Number(selectData.QUANTITY) > 1 && !this.existStaffCp) { // 상품 수량이 2개 이상이면서 임직원은 아닌 경우
        if (couponIndex === 0) { // 상품쿠폰
          if (this.cpClssf[itemIndex][0] === '12' || this.cpClssf[itemIndex][0] === '14') { // 상품쿠폰이 고객할인 or 멤버십 쿠폰인 경우
            const discountPrice = (optionsData.WWW_AMT > 0 ? (optionsData.WWW_AMT) : (Math.ceil(Math.round(this.tempSeperatePrice[itemIndex][0] * (optionsData.WWW_RATE / 100)) / 10) * 10))
            this.tempDiscountPrice[itemIndex][0] = discountPrice
            this.tempSeperatePrice[itemIndex][0] = this.tempSeperatePrice[itemIndex][0] - discountPrice
            this.sumDiscountPrice[itemIndex] += discountPrice
          } else { // 상품쿠폰이 상품할인 쿠폰인 경우
            for (let i = 0; i < totalQuantity; i++) {
              const discountPrice = (optionsData.WWW_AMT > 0 ? (optionsData.WWW_AMT) : (Math.ceil(Math.round(this.tempSeperatePrice[itemIndex][i] * (optionsData.WWW_RATE / 100)) / 10) * 10))
              this.tempDiscountPrice[itemIndex][0] = discountPrice
              this.tempSeperatePrice[itemIndex][i] = this.tempSeperatePrice[itemIndex][i] - discountPrice
              this.sumDiscountPrice[itemIndex] += discountPrice
            }
          }
        } else if (couponIndex === 1) { // 상품플러스 쿠폰
          if (this.cpClssf[itemIndex][1] === '12' || this.cpClssf[itemIndex][1] === '14') { // 상품플러스쿠폰이 고객할인 or 멤버십 쿠폰인 경우
            const discountPrice = (optionsData.WWW_AMT > 0 ? (optionsData.WWW_AMT) : (Math.ceil(Math.round(this.tempSeperatePrice[itemIndex][0] * (optionsData.WWW_RATE / 100)) / 10) * 10))
            this.tempDiscountPrice[itemIndex][1] = discountPrice
            this.tempSeperatePrice[itemIndex][0] = this.tempSeperatePrice[itemIndex][0] - discountPrice
            this.sumDiscountPrice[itemIndex] += discountPrice
          } else { // 상품플러스쿠폰이 상품할인 쿠폰인 경우
            if (this.cpClssf[itemIndex][0] === '12' || this.cpClssf[itemIndex][0] === '14') {
              let discountPrice = (optionsData.WWW_AMT > 0 ? (optionsData.WWW_AMT) : (Math.ceil(Math.round(this.tempSeperatePrice[itemIndex][0] * (optionsData.WWW_RATE / 100)) / 10) * 10))
              if (this.tempSeperatePrice[0] > this.tempSeperatePrice[1]) { discountPrice = (optionsData.WWW_AMT > 0 ? (optionsData.WWW_AMT) : (Math.ceil(Math.round(this.tempSeperatePrice[itemIndex][1] * (optionsData.WWW_RATE / 100)) / 10) * 10)) }
              for (let i = 0; i < totalQuantity; i++) {
                this.tempDiscountPrice[itemIndex][1] = discountPrice
                this.tempSeperatePrice[itemIndex][i] = this.tempSeperatePrice[itemIndex][i] - discountPrice
                this.sumDiscountPrice[itemIndex] += discountPrice
              }
            } else {
              for (let i = 0; i < totalQuantity; i++) {
                const discountPrice = (optionsData.WWW_AMT > 0 ? (optionsData.WWW_AMT) : (Math.ceil(Math.round(this.tempSeperatePrice[itemIndex][i] * (optionsData.WWW_RATE / 100)) / 10) * 10))
                this.tempDiscountPrice[itemIndex][1] = discountPrice
                this.tempSeperatePrice[itemIndex][i] = this.tempSeperatePrice[itemIndex][i] - discountPrice
                this.sumDiscountPrice[itemIndex] += discountPrice
              }
            }
          }
        } else if (couponIndex === 2) { // 마케팅 쿠폰
          for (let i = 0; i < totalQuantity; i++) {
            const discountPrice = (optionsData.WWW_AMT > 0 ? (optionsData.WWW_AMT) : (Math.ceil(Math.round(this.tempSeperatePrice[itemIndex][i] * (optionsData.WWW_RATE / 100)) / 10) * 10))
            this.tempDiscountPrice[itemIndex][2] = discountPrice
            this.tempSeperatePrice[itemIndex][i] = this.tempSeperatePrice[itemIndex][i] - discountPrice
            this.sumDiscountPrice[itemIndex] += discountPrice
          }
        } else { // 마케팅플러스 쿠폰
          for (let k = 0; k < totalQuantity; k++) {
            const discountPrice = (optionsData.WWW_AMT > 0 ? (optionsData.WWW_AMT) : (Math.ceil(Math.round(this.tempSeperatePrice[itemIndex][k] * (optionsData.WWW_RATE / 100)) / 10) * 10))
            this.tempDiscountPrice[itemIndex][3] = discountPrice
            this.tempSeperatePrice[itemIndex][k] = this.tempSeperatePrice[itemIndex][k] - discountPrice
            this.sumDiscountPrice[itemIndex] += discountPrice
          }
        }

        strSingDiscountPrice = String(tDiscountPrice)
        tDiscountPrice = this.sumDiscountPrice[itemIndex]
        this.sumDiscountPrice[itemIndex] = 0

        // 정률일 경우에 최대치 보다 큰 할인은 최대치로 한다.
        if (optionsData.WWW_RATE > 0 && optionsData.MAX_BNFT_LIMIT) {
          optionsData.MAX_BNFT_LIMIT = Number(optionsData.MAX_BNFT_LIMIT)
          if (tDiscountPrice > optionsData.MAX_BNFT_LIMIT) {
            tDiscountPrice = optionsData.MAX_BNFT_LIMIT
          }
        }

        this.firsttimeCalc[itemIndex] = true
      }

      // 최소 판매금액 이하 판매 금지
      if (optionsData.AMT_START_VAL && Number(aBasePrice) < Number(optionsData.AMT_START_VAL)) {
        document.getElementById(selectboxId).value = ''
        this.onchangeCouponDiscount(selectboxId)
        return false
      }

      // 할인정보 폼 데이터에 반영
      this.paymentData.Discount.setItem(itemIndex, {
        orderItemId: selectData.ORDERITEMS_ID,
        CATENTRY_ID: selectData.CATENTRY_ID_CHILD
      })

      this.paymentData.Discount.setCouponItem(itemIndex, couponIndex + this.globalVal.CONST.DISCOUNT_COUPON_START_INDEX, {
        ListName: keyIndex,
        ImdtDcCpAmt: strSingDiscountPrice,
        DiscountPrice: String(tDiscountPrice),
        PRMT_TYPE_CD: this.paymentData.Discount.getDefineValue('PRMT_TYPE_CD', keyIndex), // 프로모션타입코드
        DC_TYPE_CD: this.paymentData.Discount.getDefineValue('DC_TYPE_CD', keyIndex), // 할인타입코드
        WWW_RATE: String(optionsData.WWW_RATE),
        WWW_AMT: String(optionsData.WWW_AMT),
        MAX_USE_NUM: String(optionsData.MAX_USE_NUM),
        CP_IDFR: optionsData.CP_IDFR,
        USED_COUPON_QTY: String(totalQuantity)
      })

      // 확인필요, 쿠폰할인 정보를 화면에 표시
      this.globalVal.discountInfo.dcCouponAmt = tDiscountPrice

      if (!isStaff) {
        this.checkedCoupons = tDiscountPrice > 0
      }

      // 일시불할인 재계산 (ASIS: recalc_singlePaymentDiscount)
      this.recalcSinglePaymentDiscount()
      // 할인금액 정보 출력
      this.setDiscountAmount()
      // 선택된 쿠폰정보 저장
      // 임직원 쿠폰인경우 제외
      let selectedValue = document.getElementById(selectboxId).value
      let isAdd = true
      if (!isNull(this.staffCouponList) && this.staffCouponList.length > 0) {
        for (const staffCoupon of this.staffCouponList) {
          if (staffCoupon.value === selectedValue) {
            isAdd = false
            selectedValue = ''
          }
        }
      }

      if (isAdd) {
        this.previousCoupons[selectboxId] = selectedValue
      }
      // 신용카드의 할부개월수 설정
      const currentPayType = this.globalVal.paymentMethodInfo.currentPayType
      if (PAY_TYPE_CONST.isCreditCard(currentPayType) &&
          !isNull(this.globalVal.paymentMethodInfo.epCardCode)) {
        this.$root.$emit('paymentMethodCardSelectEmit')
      }
    },
    /**
     * 할인 선택 박스 처리 (ASIS: oncheckbox_sale)
     * @param {String} code
     * @returns {void}
     */
    oncheckedSalebox (code) {
      this.setPaymentAmount(code, this.CONST_MODE.CHECKBOX)
    },
    /**
     * 붙여넣기
     * @param {Object} event
     */
    pasteValidChange (event) {
      event.preventDefault()
    },
    /**
     * 숫자만 허용
     * @param {String} 할인 유형
     * @param {Object} event
     * @returns {void}
     */
    inputOnlyNumber (type, event) {
      const reg = /[0-9]/
      if (reg.exec(event.target.value) === null || (!isNull(event.data) && reg.exec(event.data) === null)) {
        if (isNull(event.target.value) || (!isNull(event.data) && reg.exec(event.data) === null)) {
          switch (type) {
            case PAY_ASSIST_CONST.RESERVED_AMT: // 적립금
              event.target.value = String(this.globalVal.discountInfo.reservesUseAmt).length === 1 ? 0 : this.globalVal.discountInfo.reservesUseAmt
              break
            case PAY_ASSIST_CONST.HAPPY_MONEY: // 해피머니
              event.target.value = String(this.globalVal.discountInfo.happyMoneyUseAmt).length === 1 ? 0 : this.globalVal.discountInfo.happyMoneyUseAmt
              break
            case PAY_ASSIST_CONST.NS_GIFT_CARD: // NS상품권
              event.target.value = String(this.globalVal.discountInfo.nsGiftCardUseAmt).length === 1 ? 0 : this.globalVal.discountInfo.nsGiftCardUseAmt
              break
            case PAY_ASSIST_CONST.DEPOSIT_AMT: // 예치금
              event.target.value = String(this.globalVal.discountInfo.depositUseAmt).length === 1 ? 0 : this.globalVal.discountInfo.depositUseAmt
              break
            case PAY_ASSIST_CONST.OK_CASHBAG: // OK캐쉬백
              event.target.value = String(this.globalVal.discountInfo.okCashbagUseAmt).length === 1 ? 0 : this.globalVal.discountInfo.okCashbagUseAmt
              break
            case PAY_ASSIST_CONST.ANNUAL_COUPONS: // 연간할인권
              event.target.value = String(this.globalVal.discountInfo.annualDcUseAmt).length === 1 ? 0 : this.globalVal.discountInfo.annualDcUseAmt
              break
            case PAY_ASSIST_CONST.NETI_WELL: // 네티웰
              event.target.value = String(this.globalVal.discountInfo.netiWellUseAmt).length === 1 ? 0 : this.globalVal.discountInfo.netiWellUseAmt
              break
            default: break
          }
        }
        event.preventDefault()
        return
      }

      switch (type) {
        case PAY_ASSIST_CONST.RESERVED_AMT: // 적립금
          this.globalVal.discountInfo.reservesUseAmt = this.getNumber(event.target.value)
          break
        case PAY_ASSIST_CONST.HAPPY_MONEY: // 해피머니
          this.globalVal.discountInfo.happyMoneyUseAmt = this.getNumber(event.target.value)
          break
        case PAY_ASSIST_CONST.NS_GIFT_CARD: // NS상품권
          this.globalVal.discountInfo.nsGiftCardUseAmt = this.getNumber(event.target.value)
          break
        case PAY_ASSIST_CONST.DEPOSIT_AMT: // 예치금
          this.globalVal.discountInfo.depositUseAmt = this.getNumber(event.target.value)
          break
        case PAY_ASSIST_CONST.OK_CASHBAG: // OK캐쉬백
          this.globalVal.discountInfo.okCashbagUseAmt = this.getNumber(event.target.value)
          break
        case PAY_ASSIST_CONST.ANNUAL_COUPONS: // 연간할인권
          this.globalVal.discountInfo.annualDcUseAmt = this.getNumber(event.target.value)
          break
        case PAY_ASSIST_CONST.NETI_WELL: // 네티웰
          this.globalVal.discountInfo.netiWellUseAmt = this.getNumber(event.target.value)
          break
        default: break
      }
    },
    /**
     * Input type text/number 변경
     * @param {String} type
     * @returns {void}
     */
    focusChangeInputType (type) {
      let useAmt = 0

      switch (type) {
        case PAY_ASSIST_CONST.RESERVED_AMT: // 적립금
          useAmt = this.globalVal.discountInfo.reservesUseAmt
          this.globalVal.discountInfo.reservesUseAmt = this.getNumber(useAmt) // 사용금액
          break
        case PAY_ASSIST_CONST.HAPPY_MONEY: // 해피머니
          useAmt = this.globalVal.discountInfo.happyMoneyUseAmt
          this.globalVal.discountInfo.happyMoneyUseAmt = this.getNumber(useAmt) // 사용금액
          break
        case PAY_ASSIST_CONST.NS_GIFT_CARD: // NS상품권
          useAmt = this.globalVal.discountInfo.nsGiftCardUseAmt
          this.globalVal.discountInfo.nsGiftCardUseAmt = this.getNumber(useAmt) // 사용금액
          break
        case PAY_ASSIST_CONST.DEPOSIT_AMT: // 예치금
          useAmt = this.globalVal.discountInfo.depositUseAmt
          this.globalVal.discountInfo.depositUseAmt = this.getNumber(useAmt) // 사용금액
          break
        case PAY_ASSIST_CONST.OK_CASHBAG: // OK캐쉬백
          useAmt = this.globalVal.discountInfo.okCashbagUseAmt
          this.globalVal.discountInfo.okCashbagUseAmt = this.getNumber(useAmt) // 사용금액
          break
        case PAY_ASSIST_CONST.ANNUAL_COUPONS: // 연간할인권
          useAmt = this.globalVal.discountInfo.annualDcUseAmt
          this.globalVal.discountInfo.annualDcUseAmt = this.getNumber(useAmt) // 사용금액
          break
        case PAY_ASSIST_CONST.NETI_WELL: // 네티웰
          useAmt = this.globalVal.discountInfo.netiWellUseAmt
          this.globalVal.discountInfo.netiWellUseAmt = this.getNumber(useAmt) // 사용금액
          break
        default: break
      }
    },
    /**
     * 할인금액 입력완료
     * @param {String} type
     * @returns {void}
     */
    onblurUseAmt (type) {
      this.$root.$emit('paymentMethodCardSelectEmit') // 카드사 디폴트 고정
      this.setPaymentAmount(type, this.CONST_MODE.INPUT)
    },
    /**
     * 보유액 조회 링크 클릭 onclick (ASIS: onclick_btnReserveUseLink, 적립금사용 조회 링크 클릭 onclick)
     * @param {String} defineValueKey
     * @returns {void}
     */
    onclickAvaAmtLink (type) {
      const defineValueKey = PAY_ASSIST_CONST.getDefineValueKey(type)
      const index = this.paymentData.Payment.getDefineValue(defineValueKey, 'index')
      const payType = this.paymentData.Payment.getDefineValue(defineValueKey, 'payType')
      const callback = data => {
        if (!isNull(data)) {
          const isSuccess = (data.msg && data.msg.result === 'success')
          let amount = 0

          switch (type) {
            case PAY_ASSIST_CONST.OK_CASHBAG: // 'okCashbag':
              if (isSuccess) {
                if (data.msg.resultCode.trim() === '0' && !isNull(data.msg.AccPoint.trim())) {
                // AccPoint => AvPoint
                  amount = Number(isNull(data.msg.AvPoint) ? '0' : data.msg.AvPoint.trim())
                  // 보유금액 json 업데이트
                  this.globalVal.mOutputDatas.msg.UserInfoBenefit.OKCASHBAG_BALANCE = amount
                  this.globalVal.discountInfo.okCashbagAvaAmt = amount // 보유금액 화면에 출력
                  this.disabledOkCashbag(amount === 0)

                  // 결제 폼 데이터 반영
                  this.paymentData.Payment.setItem(index, {
                    payType,
                    enc_identity: data.enc_identity,
                    enc_passwd: data.enc_passwd,
                    enc_nidno: data.enc_nidno,
                    channel: data.channel,
                    srch_cond: data.srch_cond,
                    mbr_fg: data.mbr_fg,
                    ordersId: this.globalVal.mInputParams.orderId
                  })
                } else {
                  messageUtil.alert(data.msg.msg2)
                }
              } else {
                messageUtil.alert(data.msg.resultMessage)
              }

              break
            case PAY_ASSIST_CONST.NETI_WELL: // 'netiWell':
              amount = Number(isNull(data.msg.pointAmt) ? '0' : data.msg.pointAmt.trim())
              // 보유금액 json 업데이트
              this.globalVal.mOutputDatas.msg.UserInfoBenefit.NETIWELL_BALANCE = amount
              this.globalVal.discountInfo.netiWellAvaAmt = amount // 보유금액 화면에 출력
              this.disabledNetiWell(amount === 0)

              // 결제 폼 데이터 반영
              this.paymentData.Payment.setItem(index, {
                payType,
                netiId: data.netiId,
                netiPw: data.netiPw
              })
              break
            case PAY_ASSIST_CONST.HAPPY_MONEY: // 'happyMoney':
              if (isSuccess) {
                if (data.msg.resCd === 'P000') {
                  amount = Number(isNull(data.msg.resRemAmt) ? '0' : data.msg.resRemAmt.trim())
                  // 보유금액 json 업데이트
                  this.globalVal.mOutputDatas.msg.UserInfoBenefit.HAPPYMONEY_BALANCE = amount
                  this.globalVal.discountInfo.happyMoneyAvaAmt = amount // 보유금액 화면에 출력
                  this.disabledHappyMoney(amount === 0)

                  // 결제 폼 데이터 반영
                  this.paymentData.Payment.setItem(index, {
                    payType,
                    happyID: data.happyID,
                    happyPW: data.happyPW
                  })
                } else {
                  messageUtil.alert(data.msg.resMsg)
                }
              } else {
                messageUtil.alert('아이디 또는 비밀번호를 다시 확인해 주세요')
              }
              break
            case PAY_ASSIST_CONST.NS_GIFT_CARD: // 'giftCardAmount'
              if (isSuccess && data.msg.resultCd === 'S') {
                amount = this.getNumber(isNull(data.msg.GIFTCARD_BALANCE) ? '0' : data.msg.GIFTCARD_BALANCE.trim())
                // 보유금액 json 업데이트
                this.globalVal.mOutputDatas.msg.UserInfoBenefit.GIFTCARD_BALANCE = amount
                this.globalVal.discountInfo.nsGiftCardAvaAmt = amount // 보유금액 화면에 출력
                this.disabledGiftCard(amount === 0)
              } else {
                messageUtil.alert('상품권 번호가 잘못 입력되었거나,\n이미 등록된 상품권 입니다.', () => {}, '확인')
              }
              break
            default:
              break
          }
        }
      }

      switch (type) {
        case PAY_ASSIST_CONST.OK_CASHBAG: // 'okCashbag':
          // Ns.Popup.showLayer('M_B1341000L', param)
          modalUtil.show('order/sheet/OrderSheetDiscountOkCashbag', { globalVal: this.globalVal, paymentData: this.paymentData }, callback)
          break
        case PAY_ASSIST_CONST.NETI_WELL:
          // Ns.Popup.showLayer('M_B1342000L', param)
          break
        case PAY_ASSIST_CONST.HAPPY_MONEY: // 'happyMoney':
          // Ns.Popup.showLayer('M_B1343000L', param)
          modalUtil.show('order/sheet/OrderSheetDiscountHappyMoney', { globalVal: this.globalVal, paymentData: this.paymentData }, callback)
          break
        case PAY_ASSIST_CONST.NS_GIFT_CARD: // 'giftCardAmount':
          // Ns.Popup.showLayer('M_B1344000L', param)
          modalUtil.show('order/sheet/OrderSheetDiscountGiftCard', { globalVal: this.globalVal, paymentData: this.paymentData }, callback)
          break
        default:
          break
      }
      return false
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/sheet/OrderSheetDiscount";
</style>
