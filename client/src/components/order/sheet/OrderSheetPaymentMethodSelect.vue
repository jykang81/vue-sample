<template>
  <div class="order_sheet_payment_method_select">
    <ul class="payment_change_tab">
      <li
        :class="disabledNSPay ? 'disabled' : isNSPay ? 'active' : ''"
        @click="setNSPay()"
      >
        NS페이
      </li>
      <li
        :class="disabledCard ? 'disabled' : isCard ? 'active' : ''"
        @click="setCard()"
      >
        신용카드
      </li>
      <li
        :class="disabledNaverpay ? 'disabled' : isNaverpay ? 'active' : ''"
        @click="setNaverpay()"
      >
        네이버페이
      </li>
      <li
        :class="disabledPayco ? 'disabled' : isPayco ? 'active' : ''"
        @click="setPayco()"
      >
        PAYCO
      </li>
      <li
        :class="disabledMobile ? 'disabled' : isMobile ? 'active' : ''"
        @click="setMobile()"
      >
        휴대폰 결제
      </li>
      <li
        :class="disabledDeposit ? 'disabled' : isDeposit ? 'active' : ''"
        @click="setDeposit()"
      >
        무통장 입금
      </li>
    </ul>
    <!-- NS PAY -->
    <div v-show="isNSPay">
      <div class="nspay_box">
        <swiper
          ref="swiperNspay"
          :options="swiperNspay"
          class="swiper_nspay"
          @slideChange="onchangeNspaySlideChange"
        >
          <template v-for="(sliderItem, indexSliderItem) in swiperNspay.sliderItems">
            <template v-if="sliderItem.payMethod === '01'">
              <swiper-slide :key="`slide${indexSliderItem}`">
                <!-- c1 = 신한 c2 = 국민 c3 = 비씨 c4 = 현대 c5 = 삼성 c6 = 하나 c7 = 롯데 c8 = 농협 -->
                <div :class="`card ${sliderItem.ciCode}`">
                  <h2 class="logo">
                    {{ sliderItem.cardName }}
                  </h2>
                  <p class="card_num">
                    {{ sliderItem.bankCardNo }}
                  </p>
                  <div class="combo_box">
                    <label for="cardQuota" class="blind">할부 단위를 선택해 주세요</label>
                    <select :ref="`nspayCardQuota${indexSliderItem}`" class="select" :disabled="sliderItem.disabledQuota" @change="onchangeNspaySelectQuota()">
                      <template v-for="(quotaItem, indexQuotaItem) in sliderItem.quotaList">
                        <option
                          :key="`nspay${indexQuotaItem}`"
                          :value="quotaItem.value"
                        >
                          {{ quotaItem.text }}
                        </option>
                      </template>
                    </select>
                  </div>
                  <div class="basic_check">
                    <label>
                      <input :ref="`nspayMajYn${indexSliderItem}`" type="checkbox" @change="onchangeNspayMajor(indexSliderItem)">
                      <span>기본카드</span>
                    </label>
                  </div>
                  <button type="button" class="btn_delete" @click="onclickDelNspayInfo()">
                    삭제
                  </button>
                </div>
              </swiper-slide>
            </template>
            <template v-if="sliderItem.payMethod === '16'">
              <swiper-slide :key="`slide${indexSliderItem}`">
                <!--
                  b0 = 계좌로고없음
                  b1 = 농협 b2 = 국민 b3 = 우리 b4 = 신한 b5 = 하나
                  b6 = 기업 b7 = 산업 b8 = SC   b9 = 수협 b10 = 전북
                  b11 = 시티 b12 = 제주 b13 = 새마을 b14 = 신협   b15 = 대구
                  b16 = 부산 b17 = 광주 b18 = 경남   b19 = 우체국 b20 = NS페이 b21 = K뱅크
                -->
                <div :class="`account ${sliderItem.ciCode}`">
                  <h2 class="logo">
                    {{ sliderItem.cardName }}
                  </h2>
                  <p class="card_num">
                    {{ sliderItem.bankCardNo }}
                  </p>
                  <div class="basic_check">
                    <label>
                      <input :ref="`nspayMajYn${indexSliderItem}`" type="checkbox" @change="onchangeNspayMajor(indexSliderItem)">
                      <span>기본계좌</span>
                    </label>
                  </div>
                  <button type="button" class="btn_delete" @click="onclickDelNspayInfo()">
                    삭제
                  </button>
                </div>
              </swiper-slide>
            </template>
            <template v-if="sliderItem.payMethod === 'DEFAULT'">
              <swiper-slide :key="`slide${indexSliderItem}`">
                <div class="card_account_add">
                  <button v-show="swiperNspay.sliderItems.length > 1" type="button" class="btn_ty2" @click="onclickNspayMemUnReg()">
                    해지
                  </button>
                  <ul class="list_add">
                    <li>
                      <button type="button" class="btn_add" @click="onclickAddNspayInfo('16')">
                        계좌추가
                      </button>
                    </li>
                    <li>
                      <button type="button" class="btn_add" @click="onclickAddNspayInfo('01')">
                        카드추가
                      </button>
                    </li>
                  </ul>
                </div>
              </swiper-slide>
            </template>
          </template>
          <div
            slot="pagination"
            class="swiper-pagination"
          />
        </swiper>
        <div class="onetouch_area">
          <div class="onetouch_tit_wrap">
            <span>원터치결제 사용</span>
            <button class="info_btn" type="button" data-name="oneTouch" @click="isShowTooltipRefund = true">
              <span>?</span>
            </button>
          </div>
          <div class="check_switches">
            <label>
              <input v-model="globalVal.paymentMethodInfo.checkedNspayOneTouch" type="checkbox" title="원터치결제 사용여부 체크" @change="onchangeNspayOneTouch()">
              <div class="custom_switch">
                <div class="rail">
                  <span class="switchLabel switch_off">off</span>
                  <span class="switchLabel switch_on">on</span>
                  <span class="handle" />
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
    <!-- 신용카드 -->
    <div v-show="isCard">
      <label class="select">
        <select v-model="globalVal.paymentMethodInfo.epCardCode" @change="onchangeSelectEpCardCode()">
          <option value="">
            카드선택
          </option>
          <template v-for="(cardItem, indexCardItem) in useCardList">
            <option
              :key="`${indexCardItem}${cardItem.CARD_SEQ}${cardItem.CARD_CO_CD}`"
              :value="`${cardItem.CARD_CO_CD}_${cardItem.EZPAYCD}_${cardItem.DIRECT_YN}_${cardItem.CARD_SEQ}`"
            >
              {{ cardItem.CARD_CO_NM }}
            </option>
          </template>
        </select>
      </label>
      <label class="select mt8">
        <select v-model="globalVal.paymentMethodInfo.epQuota" @change="onchangeSelectEpQuota()">
          <template v-for="(dispEpQuotaItem, indexDispEpQuota) in globalVal.paymentMethodInfo.dispEpQuotaList">
            <option
              :key="indexDispEpQuota"
              :value="dispEpQuotaItem.value"
            >{{ dispEpQuotaItem.text }}
            </option>
          </template>
        </select>
      </label>
      <dl class="guide">
        <dt>이용안내</dt>
        <dd>신용카드 결제금액이 30만원 이상일 경우(단, 삼성카드는 50만원) ARS, 공인인증서 등 추가 인증이 필요합니다.</dd>
        <dd>카드사별 포인트 혜택은 각 카드사를 통해 확인해주시기 바랍니다.</dd>
        <dd>청구할인 대상 및 유의사항은 각 청구할인 행사페이지를 참고해주시기 바랍니다.</dd>
      </dl>
    </div>
    <!-- 네이버페이 -->
    <div v-show="isNaverpay">
      <dl class="guide">
        <dt>이용안내</dt>
        <dd>네이버페이 결제시 무이자할인/일시불할인/청구할인은 적용되지 않습니다.</dd>
        <dd>순금은 네이버페이로 결제하실 수 없습니다.</dd>
        <dd>주문 변경 시 카드사 혜택 및 할부 적용 여부는 해당 카드사 정책에 따라 변경될 수 있습니다.</dd>
        <dd>네이버페이는 네이버ID로 별도 앱 설치 없이 신용카드 또는 은행계좌 정보를 등록하여 네이버페이 비밀번호로 결제할 수 있는 간편결제 서비스입니다.</dd>
        <dd>결제 가능한 신용카드: 신한, 삼성, 현대, BC, KB국민, KEB하나, 롯데, NH농협, 씨티</dd>
        <dd>결제 가능한 은행: NH농협, KB국민, 신한, KEB하나, 우리, 기업, SC제일, 부산, 경남, 수협, 신협, 우체국, 미래에셋대우, 광주, 대구, 전북, 새마을금고, 제주은행</dd>
        <dd>네이버페이 카드 간편결제는 네이버페이에서 제공하는 카드사 별 무이자, 청구할인 혜택을 받을 수 있습니다.</dd>
        <dd>iOS는 설정에서 팝업을 허용해 주세요.</dd>
      </dl>
    </div>
    <!-- PAYCO -->
    <div v-show="isPayco">
      <dl class="guide">
        <dt>이용안내</dt>
        <dd>PAYCO는 온/오프라인 쇼핑은 물론 송금, 멤버십 적립까지 가능한 통합 서비스입니다.</dd>
        <dd>PAYCO 결제시 NSmall 무이자할부/일시불할인/청구할인은 적용되지 않습니다.<br>(PAYCO에서 제공하는 카드사별 혜택만 적용됩니다.)</dd>
        <dd>휴대폰과 카드 명의자가 동일해야 결제 가능하며, 결제금액 제한은 없습니다.<br>(지원카드: 모든 국내 신용/체크카드)</dd>
        <dd>순금, 상품권 등 환금성 상품은 PAYCO로 결제하실 수 없습니다.</dd>
        <dd>주문 변경 시 카드사 혜택 및 할부 적용 여부는 해당 카드사 정책에 따라 변경될 수 있습니다.</dd>
      </dl>
    </div>
    <!-- 휴대폰 결제 -->
    <div v-show="isMobile">
      <dl class="guide">
        <dt>이용안내</dt>
        <dd>휴대폰 소액결제는 결제대행 페이지로 이동하여 결제를 진행합니다.</dd>
        <dd>결제금액은 사용하시는 이동통신사의 휴대폰결제 등급에 따라 당월 최대 30만원까지만 가능하며 결제한도 및 이용이 제한될 수 있습니다.</dd>
        <dd>휴대폰 소액결제에 대한 현금영수증은 휴대폰 요금을 현금으로 납부하는 경우에 한하여 발급됩니다.</dd>
      </dl>
    </div>
    <!-- 무통장 입금 -->
    <div v-show="isDeposit">
      <label class="select mb8">
        <select v-model="globalVal.paymentMethodInfo.selectedBank" @change="onchangeDepositBankCd()">
          <option
            v-for="(bankItem, indexBankItem) in bankList"
            :key="indexBankItem"
            :value="bankItem.value"
          >
            {{ bankItem.text }}
          </option>
        </select>
      </label>
      <div class="input_field line">
        <label class="label_text">
          입금계좌
        </label>
        <span class="input_group">
          <span class="text border_none">
            {{ depositBankText }} <template v-show="depositBankAccNumText !== ''"><br></template>{{ depositBankAccNumText }}
          </span>
        </span>
      </div>
      <div class="input_field line">
        <label class="label_text">
          예금주
        </label>
        <span class="input_group">
          <span class="text border_none">
            (주)엔에스쇼핑
          </span>
        </span>
      </div>
      <div class="input_field line">
        <label for="label_name" class="label_text">
          입금자명
        </label>
        <span class="input_group">
          <input id="label_name" v-model="globalVal.paymentMethodInfo.remitter" type="text" maxlength="10" class="form text border" title="입금자명 입력">
        </span>
      </div>
      <div class="input_field line">
        <label class="label_text">
          입금마감일:
        </label>
        <span class="input_group">
          <span class="text border_none">
            {{ depositDeadline }}
          </span>
        </span>
      </div>
    </div>
    <!-- 현금영수증 -->
    <div v-show="isDeposit || swiperNspay.isDeposit">
      <div class="checkbox_field">
        <label>
          <input v-model="globalVal.paymentMethodInfo.checkedReceipt" type="checkbox" class="checkbox square" @change="onchangeCashReceipt()">
          <span class="check_label">현금영수증 신청</span>
        </label>
      </div>
      <div v-show="globalVal.paymentMethodInfo.checkedReceipt" class="receipt">
        <div class="radio_wrap">
          <label>
            <input v-model="globalVal.paymentMethodInfo.receiptType" type="radio" class="radio" name="receipt" value="P" @change="onchangeReceiptType()">
            <span class="radio_label">개인소득공제용</span>
          </label>
          <label>
            <input v-model="globalVal.paymentMethodInfo.receiptType" type="radio" class="radio" name="receipt" value="B" @change="onchangeReceiptType()">
            <span class="radio_label">사업자증빙용</span>
          </label>
        </div>
        <div class="input_field">
          <label for="label_phone" class="label_text blind">
            휴대폰 번호
          </label>
          <span class="input_group">
            <template v-if="globalVal.paymentMethodInfo.receiptType === CONST_VALID_CASH_RECEIPT.PHONE_RECEIPT_TPYE">
              <input id="label_phone"
                     v-model="receiptObject.tel"
                     :type="inputTypeReceiptValue"
                     class="form text border"
                     :placeholder="receiptTypePlaceholder"
                     @focus="focusDashPhone()"
                     @blur="onblurValueApply($event)"
                     @keydown="keydownNumber($event)"
                     @keyup="keyupNumber($event)"
              >
            </template>
            <template v-else-if="globalVal.paymentMethodInfo.receiptType === CONST_VALID_CASH_RECEIPT.BIZ_RECEIPT_TPYE">
              <input id="label_phone"
                     v-model="receiptObject.biz"
                     :type="inputTypeReceiptValue"
                     class="form text border"
                     :placeholder="receiptTypePlaceholder"
                     @focus="focusDashPhone()"
                     @blur="onblurValueApply($event)"
                     @keydown="keydownNumber($event)"
                     @keyup="keyupNumber($event)"
              >
            </template>
          </span>
        </div>
      </div>
    </div>
    <!-- 선택한 결제수단을 다음에도 사용 -->
    <div v-show="!globalVal.isGuest">
      <label>
        <input v-model="globalVal.paymentMethodInfo.checkedAgreePurchageSave" type="checkbox" class="checkbox square">
        <span class="check_label">선택한 결제수단을 다음에도 사용</span>
      </label>
    </div>
    <p class="bottom_button">
      <button type="button" class="btn" @click="onclickSelectCompmlete()">
        <span>선택완료</span>
      </button>
    </p>

    <!-- 툴팁 컨테이너 -->
    <container-tooltip
      :show="isShowTooltipRefund"
      @close="isShowTooltipRefund = false"
    >
      <template #title>
        원터치결제란?
      </template>
      <template #content>
        <ul class="refund_guide">
          <li>6개월 내 배송 이력이 있는 배송지로 5만원 이하 NSPAY 결제 시 비밀번호 입력 없이 원터치로 결제가 진행됩니다.</li>
          <li>NSmall 자체 보안 기준에 따라 안전한 거래임을 확인된 경우에 한하며, 보안상 추가 비밀번호를 요구할 수 있습니다.</li>
        </ul>
      </template>
    </container-tooltip>
  </div>
</template>

<script>
import CONST from '@constants/framework/framework'
import messageUtil from '@frameworks/messageUtil'
import {
  // iOSVersionCheck,
  isNull,
  insertCommas,
  includeSpecialCharacter
} from '@utils/commonutil/commonUtil'
import { PAY_TYPE_CONST } from '@/common/constants/order/order'

import ContainerTooltip from '@components/frameworks/ContainerTooltip'

import doPaymentApprovalRequestMixin from '@/mixins/order/sheet/doPaymentApprovalRequestMixin'
import finalPaymentAmountMixin from '@/mixins/order/sheet/finalPaymentAmountMixin'
import discountAmountMixin from '@/mixins/order/sheet/discountAmountMixin'
import singlePaymentDiscountMixin from '@/mixins/order/sheet/singlePaymentDiscountMixin'
import paymentDepositMixin from '@/mixins/order/sheet/payment/paymentDepositMixin'
import validCashReceiptMixin from '@/mixins/order/sheet/confirm/validCashReceiptMixin'
import paymentCreditCardMixin from '@/mixins/order/sheet/payment/paymentCreditCardMixin'
import calcCardPreDcAmtMixin from '@/mixins/order/sheet/payment/calcCardPreDcAmtMixin'
import calcChargeDcAmtMixin from '@/mixins/order/sheet/payment/calcChargeDcAmtMixin'
import calcCardPointAmtMixin from '@/mixins/order/sheet/payment/calcCardPointAmtMixin'
import paymentNspayMixin from '@/mixins/order/sheet/payment/paymentNspayMixin'
import paymentOtherMixin from '@/mixins/order/sheet/payment/paymentOtherMixin'
import nativeUtil from '@frameworks/nativeUtil'
import uiUtil from '@utils/uiUtil'

export default {
  components: {
    ContainerTooltip
  },
  mixins: [
    doPaymentApprovalRequestMixin,
    finalPaymentAmountMixin,
    discountAmountMixin,
    singlePaymentDiscountMixin,
    paymentNspayMixin,
    paymentCreditCardMixin,
    calcCardPreDcAmtMixin,
    calcChargeDcAmtMixin,
    calcCardPointAmtMixin,
    paymentDepositMixin,
    paymentOtherMixin,
    validCashReceiptMixin
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

      isCat2Category: false,
      showDeliveryPaymentGuide: false,

      showPaycoFirst: false, // 생에 첫결제

      // 무통장입금
      bankList: [],
      depositBankText: '', // 입금계좌정보: 신한은행(전용계좌)
      depositBankAccNumText: '', // 입금계좌정보: 200-14303-200
      depositDeadline: '', // 입금마감일
      receiptTypePlaceholder: '휴대폰 번호를 입력해 주세요.',
      savedReceiptValue: '', // 저장된 현금영수증 정보
      buttonReceiptText: '변경', // 변경/변경취소 버튼 Text
      showSavedReceiptValue: true,
      maxlengthReceiptValue: 11,
      inputTypeReceiptValue: 'tel',

      // NS페이
      isShowTooltipRefund: false
    }
  },
  computed: {
    swiper () {
      return this.$refs.swiperNspay.$swiper
    }
  },
  mounted () {
    this.init()

    // 페이지 진입시 선택완료 버튼 위치 재정의
    if (!isNull(document.querySelector('.bottom_button'))) {
      document.querySelector('.bottom_button').style.bottom = '-1px'
      setTimeout(() => {
        document.querySelector('.bottom_button').style.bottom = 0
      }, 100)
    }

    uiUtil.preventFixedElementCracking(document.querySelector('.bottom_button'))
  },
  methods: {
    /**
     * init
     * @returns {void}
     */
    init () {
      // 저장된 결제수단 정보 설정
      if (this.isNSPay) {
        this.setNSPay()
      } else {
        if (this.isCard) {
          this.setCard()
        } else if (this.isNaverpay) {
          this.setNaverpay()
        } else if (this.isPayco) {
          this.setPayco()
        } else if (this.isMobile) {
          this.setMobile()
        } else if (this.isDeposit) {
          this.setDeposit()
        }
      }
    },
    /**
     * NSPay 설정
     * @returns {void}
     */
    setNSPay () {
      if (this.globalVal.isGuest) {
        return false
      }

      if (!isNull(this.swiperNspay)) {
        this.swiperNspay.isDeposit = false
      }

      if (this.disabledNSPay) {
        return false
      }

      this.globalVal.paymentMethodInfo.paymentMethod = ''
      this.globalVal.paymentMethodInfo.currentPayType = 'NSPay'
      this.globalVal.paymentMethodInfo.wrongMessage = ''

      if (this.globalVal.cat2CategoryIdFlag) {
        messageUtil.alert('환금성 상품(금, 상품권 등)은 NS페이로 구매하실 수 없습니다.', () => {
          this.setCard()
        })
        this.globalVal.paymentMethodInfo.wrongMessage = '환금성 상품(금, 상품권 등)은 NS페이로 구매하실 수 없습니다.'
        return false
      }

      this.setNspayInfo()
    },
    /**
     * 신용카드 설정
     * @returns {void}
     */
    setCard () {
      if (!isNull(this.swiperNspay)) {
        this.swiperNspay.isDeposit = false
      }

      if (this.disabledCard) {
        return false
      }

      // ios결제오류 수정
      /*
      if (viewType() === 'ios') {
        const iosversion = iOSVersionCheck()
        const version = '1.0' // 확인후 적용 WL.Client.getAppProperty('APP_VERSION').replace(/\./gi, '')
        const iosnum = iosversion.replace('.', '').replace('.', '')
        if (Number(version) <= 299) {
          if (Number(iosnum) >= 1031) {
            messageUtil.alert('현재 버전에서는 카드결제가 불가합니다. \n 최신 버전으로 업데이트 해주시기 바랍니다.')
          }
        }
      }
      */
      if (PAY_TYPE_CONST.isNaverpay(this.globalVal.paymentMethodInfo.paymentMethod) ||
          PAY_TYPE_CONST.isPayco(this.globalVal.paymentMethodInfo.paymentMethod)) {
        this.globalVal.paymentMethodInfo.epQuota = '00'
      }

      this.setPaymentCreditCard(this.globalVal.mOutputDatas.msg)

      const isEpCardCode = !isNull(this.globalVal.paymentMethodInfo.epCardCode)
      const isPaySaveFlag = this.globalVal.mOutputDatas.OrderMethodSave.paySaveFlag !== '1'
      const isLastPayTypeCode = this.globalVal.mOutputDatas.OrderMethodSave.LastPayTypeCode != null
      const isCardCd = this.globalVal.mOutputDatas.OrderMethodSave.cardCd
      const isApplyPaySaveFlag = this.globalVal.paymentMethodInfo.isApplyPaySaveFlag

      if (isEpCardCode && isPaySaveFlag && isLastPayTypeCode && isCardCd && isApplyPaySaveFlag) {
        this.globalVal.paymentMethodInfo.isApplyPaySaveFlag = false
        const cardCd = this.globalVal.mOutputDatas.OrderMethodSave.cardCd.split('|')
        const savedCard = this.useCardList.filter(o => {
          return o.EZPAYCD === cardCd[0] && o.CARD_CO_NM === cardCd[1]
        })[0]
        const epCardCode = `${savedCard.CARD_CO_CD}_${savedCard.EZPAYCD}_${savedCard.DIRECT_YN}_${savedCard.CARD_SEQ}`
        this.triggerChangeSelectEpCardCode(epCardCode)
        this.triggerChangeSelectEpNoinstFlag()
      } else {
        const epCardCode = this.globalVal.paymentMethodInfo.epCardCode
        const epQuota = this.globalVal.paymentMethodInfo.epQuota
        this.triggerChangeSelectEpCardCode(epCardCode)
        this.triggerChangeSelectEpNoinstFlag(epQuota)
      }
    },
    /**
     * 네이버페이 설정
     * @returns {void}
     */
    setNaverpay () {
      if (!isNull(this.swiperNspay)) {
        this.swiperNspay.isDeposit = false
      }
      if (this.disabledNaverpay) {
        return false
      }

      this.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.NAVER_PAY
      this.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.NAVER_PAY
      this.globalVal.paymentMethodInfo.wrongMessage = ''

      if (this.globalVal.cat2CategoryIdFlag) {
        messageUtil.alert('환금성 상품(금, 상품권 등)은 네이버페이로 구매하실 수 없습니다.', () => {
          this.setCard()
        })
        this.globalVal.paymentMethodInfo.wrongMessage = '환금성 상품(금, 상품권 등)은 네이버페이로 구매하실 수 없습니다.'
        return false
      }

      if (this.globalVal.discountInfo.showSinglePaymentDiscount &&
          this.globalVal.discountInfo.checkedSinglePaymentDiscount) {
        const strConfirmMsg = `네이버페이는 일시불할인 적용이 불가능한 결제수단입니다.일시불 할인 -${insertCommas(this.paymentData.Payment.getItem(0).cardDcAmt)}원이 취소됩니다. 네이버페이로 결제하시겠습니까?`
        messageUtil.confirm(strConfirmMsg, () => { // 확인
          this.globalVal.discountInfo.checkedSinglePaymentDiscount = false
          this.onchangeSinglePaymentDiscount()
          this.setNaverpayInfo()
        }, () => { // 취소 - 신용카드_일시불선택 + 일시불할인 적용
          this.setCard()
        }, '확인', '취소')
        return false
      }

      this.setNaverpayInfo()
    },
    /**
     * 페이코 설정
     * @returns {void}
     */
    setPayco () {
      if (!isNull(this.swiperNspay)) {
        this.swiperNspay.isDeposit = false
      }

      if (this.disabledPayco) {
        return false
      }
      this.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.PAYCO
      this.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.PAYCO
      this.globalVal.paymentMethodInfo.wrongMessage = ''

      if (this.globalVal.cat2CategoryIdFlag) {
        messageUtil.alert('환금성 상품(금, 상품권 등)은 PAYCO로 구매하실 수 없습니다.', () => {
          this.setCard()
        })
        this.globalVal.paymentMethodInfo.wrongMessage = '환금성 상품(금, 상품권 등)은 PAYCO로 구매하실 수 없습니다.'
        return false
      }

      if (this.globalVal.discountInfo.showSinglePaymentDiscount &&
          this.globalVal.discountInfo.checkedSinglePaymentDiscount) {
        const strConfirmMsg = `PAYCO는 일시불할인 적용이 불가능한 결제수단입니다.일시불 할인 -${insertCommas(this.paymentData.Payment.getItem(0).cardDcAmt)}원이 취소됩니다. PAYCO로 결제하시겠습니까?`
        messageUtil.confirm(strConfirmMsg, () => { // 확인
          this.globalVal.discountInfo.checkedSinglePaymentDiscount = false
          this.onchangeSinglePaymentDiscount()
          this.setPaycoInfo()
        }, () => { // 취소 - 신용카드_일시불선택 + 일시불할인 적용
          this.setCard()
        }, '확인', '취소')
        return false
      }

      this.setPaycoInfo()
    },
    /**
     * 모바일 설정
     * @returns {void}
     */
    setMobile () {
      if (!isNull(this.swiperNspay)) {
        this.swiperNspay.isDeposit = false
      }

      if (this.disabledMobile) {
        return false
      }
      this.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.MOBILE
      this.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.MOBILE
      this.globalVal.paymentMethodInfo.wrongMessage = ''
      this.checkOtherPaymentMethod()
      this.setMobileInfo()
    },
    /**
     * 무통장입금 설정
     * @returns {void}
     */
    setDeposit () {
      // 배송일 지저정시에는 무통장 입금을 사용할 수 없다.
      if (!isNull(this.globalVal.productInfo.deliveryDateSelected)) {
        messageUtil.alert('배송일을 지정하시면 무통장 입금으로\n구매하실 수 없습니다.')
        return false
      }

      // 제휴사코드가 갤러리아일 때 무통장 입금을 사용할 수 없다.
      if (this.globalVal.paymentMethodInfo.isGalleria) {
        messageUtil.alert('무통장 입금을 사용하실 수 없습니다.')
        return false
      }
      if (this.disabledDeposit) {
        return false
      }
      this.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      this.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      this.globalVal.paymentMethodInfo.wrongMessage = ''
      this.checkOtherPaymentMethod()
      this.setDepositInfo()
    },
    /**
     * 선택완료
     * @returns {void}
     */
    onclickSelectCompmlete () {
      if (this.globalVal.paymentMethodInfo.receiptType === this.CONST_RECEIPT.PHONE_RECEIPT_TPYE) {
        this.globalVal.paymentMethodInfo.receiptValue = this.receiptObject.tel
      } else {
        this.globalVal.paymentMethodInfo.receiptValue = this.receiptObject.biz
      }
      if (!this.valid()) {
        return false
      }

      let name = ''
      let quota = ''
      if (this.isCard) {
        const data = this.getCardTmplTitleInfo()
        name = data.name
        quota = data.quota
      } else if (this.isDeposit) {
        this.globalVal.paymentMethodInfo.selectedBankInfo = this.getBankInfo(this.globalVal.paymentMethodInfo.selectedBank)
        name = this.globalVal.paymentMethodInfo.selectedBankInfo.BANKNAME
      } else if (this.isNSPay) {
        this.globalVal.paymentMethodInfo.selectedNspay.item = this.swiperNspay.selectedItem

        if (PAY_TYPE_CONST.isNSPayCreditCard(this.globalVal.paymentMethodInfo.paymentMethod)) {
          name = this.getNspayCardCiList().getName(this.swiperNspay.selectedItem.bankCardCode)
          quota = this.getNspayCardCiList().getQuotaName(this.swiperNspay.selectedItem.quota, this.swiperNspay.selectedItem.quotaList)
        } else if (PAY_TYPE_CONST.isNSPayAccountTransfer(this.globalVal.paymentMethodInfo.paymentMethod)) {
          name = this.getNspayAcctCiList().getName(this.swiperNspay.selectedItem.bankCardCode)
          this.saveNspayReceiptInfo()
        }
      }

      this.globalVal.paymentMethodInfo.enableDiscountQuota = true
      this.globalVal.paymentMethodInfo.paymentMethodTitle = PAY_TYPE_CONST.getTmplTitle(this.globalVal.paymentMethodInfo.currentPayType, name, quota)
      this.globalVal.lastCashReceipt.RCPT_PBLS_CD = this.globalVal.paymentMethodInfo.receiptType === this.CONST_RECEIPT.PHONE_RECEIPT_TPYE ? this.CONST_RECEIPT.PHONE_RCPT_PBLS_CD : this.CONST_RECEIPT.BIZ_RCPT_PBLS_CD
      this.globalVal.lastCashReceipt.REGI_NUM = this.globalVal.paymentMethodInfo.receiptValue
      this.$store.commit('popup/hide', { success: true })
    },
    /**
     * 유효성 확인
     * @returns {Boolean}
     */
    valid () {
      if (this.isNSPay) {
        if (isNull(this.swiperNspay.selectedItem) || this.swiperNspay.selectedItem.payMethod === 'DEFAULT') {
          messageUtil.alert('결제 수단을 선택해 주세요.')
          return false
        }
        if (PAY_TYPE_CONST.isNSPayAccountTransfer(this.globalVal.paymentMethodInfo.paymentMethod)) {
          if (!this.validCashReceipt(this.CONST_VALID_CASH_RECEIPT.SELECT)) {
            return false
          }
        }
      } else if (this.isCard) {
        if (isNull(this.globalVal.paymentMethodInfo.epCardCode)) {
          messageUtil.alert('신용카드사를 선택해 주세요.')
          return false
        }
      } else if (this.isNaverpay) {
        return true
      } else if (this.isPayco) {
        return true
      } else if (this.isMobile) {
        return true
      } else if (this.isDeposit) {
        if (isNull(this.globalVal.paymentMethodInfo.selectedBank)) {
          messageUtil.alert('입금계좌를 선택해주세요.')
          return false
        }

        if (isNull(this.globalVal.paymentMethodInfo.remitter)) {
          messageUtil.alert('입금자를 입력해주세요.')
          return false
        }

        // 특수문자 체크: 입금자명
        if (includeSpecialCharacter(this.globalVal.paymentMethodInfo.remitter)) {
          messageUtil.error(CONST.API_ERROR_MESSAGES[1].replace('{0}', '입금자명'), null)
          return false
        }

        if (!this.validCashReceipt(this.CONST_VALID_CASH_RECEIPT.SELECT)) {
          return false
        }
      }

      return true
    },
    /**
     * 유효성 확인
     * @returns {Boolean}
     */
    getOSVersion () {
      window.callbackOSVersion = this.callbackOSVersion // IOS 버전 콜백함수
      nativeUtil.getOSVersion('callbackOSVersion') // IOS 버전 브리지 호출
    },
    /**
     * Apple Login visible 처리
     *
     * @param {object} returnValue IOS Version 값
     */
    callbackOSVersion (returnValue) {
      if (Number(returnValue) < 13) {
        messageUtil.alert('현재 버전에서는 카드결제가 불가합니다. \n 최신 버전으로 업데이트 해주시기 바랍니다.')
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/sheet/OrderSheetPaymentMethodSelect";
</style>
