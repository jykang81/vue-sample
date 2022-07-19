<template>
  <div v-show="globalVal.showStep3" id="orderReturnArea" class="order_return_step3">
    <ol class="return_step">
      <li>
        사유/수거지 선택
      </li>
      <li>
        환불정보확인
      </li>
      <li class="active">
        반품신청완료
      </li>
    </ol>
    <div class="msg_box">
      <h2 class="subject">
        반품 신청 및 택배사로 수거 요청이 완료되었습니다.
      </h2>
    </div>
    <div class="order_list mt32">
      <ul class="product_info">
        <li>
          <div v-for="(catInfo, catIdx) in catList"
               :key="catIdx + '_0'"
               class="box"
          >
            <figure>
              <a @click="bizUtil.gotoProductDetail(catInfo.goodsCd)">
                <ns-img
                  :product-number="catInfo.goodsCd"
                  :width="144"
                  :height="144"
                  :alt="catInfo.catentryName"
                />
              </a>
            </figure>
            <div class="field">
              <p class="title">
                {{ htmlDecode(catInfo.name) }}
              </p>
              <p class="price">
                <strong>{{ catInfo.price }}</strong>원
              </p>
              <p class="option">
                {{ catInfo.quantity }}개 /
                <span v-for="(attrInfo, attrIdx) in catInfo.attrs"
                      :key="attrIdx + '_1'"
                >
                  {{ htmlDecode(attrInfo) }}
                </span>
              </p>
              <dl v-show="catInfo.showGift" class="free_gift">
                <dt>사은품</dt>
                <dd
                  v-for="(giftInfo, giftIdx) in catInfo.gifts"
                  :key="giftIdx + '_6'"
                >
                  {{ catInfo.gifts.length === 1 ? '' : (giftIdx + 1) + '.' }} {{ htmlDecode(giftInfo.name) }}
                  <span
                    v-for="(giftAttrInfo, giftAttrIdx) in giftInfo.attrs"
                    :key="giftAttrIdx + '_7'"
                  >
                    {{ htmlDecode(giftAttrInfo.value) }}
                  </span>
                </dd>
              </dl>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h3 class="subject line">
      반품사유
    </h3>
    <div class="order_list">
      <ul class="product_info">
        <li>
          <div class="delivery_point">
            <div :class="globalVal.reasonOptionValue === '999' ? 'mb8' : ''">
              {{ globalVal.reasonOptionText }}
            </div>
            <div v-show="globalVal.reasonOptionValue === '999'">
              {{ globalVal.reasonTextValue }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h3 class="subject line">
      수거지 정보
    </h3>
    <div class="order_list">
      <ul class="product_info">
        <li>
          <div class="delivery_point">
            <div class="flex">
              <p class="name">
                {{ pickupInfoData.receiverName }}
              </p>
            </div>
            <div class="address">
              {{ pickupInfoData.address1 }} {{ isNull(pickupInfoData.address2) ? '' : pickupInfoData.address2 }}
            </div>
            <p class="phone">
              휴대폰: {{ isNull(pickupInfoData.phone2) ? pickupInfoData.phone1 : pickupInfoData.phone2 }}
            </p>
            <div class="mt8">
              {{ globalVal.pickupTextValue }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <h3 class="subject line">
      환불정보
    </h3>
    <div class="total_price">
      <dl>
        <dt>총 상품금액</dt>
        <dd><strong>{{ totalProductAmt }}</strong>원</dd>
      </dl>
      <dl>
        <dt>총 할인금액</dt>
        <dd><strong>{{ offerAmt }}</strong>원</dd>
      </dl>
      <dl>
        <dt>총 배송비</dt>
        <dd><strong>{{ shipCharge }}</strong>원</dd>
      </dl>
      <dl class="total">
        <dt>환불 예상금액</dt>
        <dd><strong>{{ finalPaymentAmt }}</strong>원</dd>
      </dl>
      <dl class="payment_option">
        <template v-for="(paymentInfoItem, indexPaymentInfo) in paymentInfo">
          <dt :key="`dtOp${indexPaymentInfo}`">
            {{ paymentInfoItem.label }}
          </dt>
          <dd :key="`ddOp${indexPaymentInfo}`">
            {{ paymentInfoItem.text }}
            <span><strong>{{ paymentInfoItem.amt }}</strong>원</span>
          </dd>
        </template>
      </dl>
    </div>
    <h3 class="subject line">
      반품비 결제
    </h3>
    <div class="total_price">
      <dl>
        <dt>
          반품배송비
        </dt>
        <dd>
          무료
        </dd>
      </dl>
    </div>
    <div class="btn_group">
      <button
        type="button"
        class="btn gray_border"
        @click="onclickOrdersList"
      >
        <span>주문내역 조회</span>
      </button>
      <button
        type="button"
        class="btn coral"
        @click="onclickHome"
      >
        <span>홈으로 가기</span>
      </button>
    </div>
  </div>
</template>

<script>
import {
  htmlDecode,
  isNull
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import NsImg from '@components/common/NsImg'
import orderReturnStepMixin from '@/mixins/order/return/orderReturnStepMixin'

export default {
  name: 'OrderReturnStep3',
  components: {
    NsImg
  },
  mixins: [
    orderReturnStepMixin
  ],
  props: {
    globalVal: {
      type: Object,
      required: true
    },
    orderReturnInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      catList: [],
      totalProductAmt: '',
      shipCharge: '',
      offerAmt: '',
      finalPaymentAmt: '',
      discountList: [],
      paymentInfo: []
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    },
    pickupInfoData () {
      return this.globalVal.pickupInfoData
    }
  },
  mounted () {
    /**
     * 반품신청완료
     *  - this.$root.$emit('orderReturnStep3Emit')
     * @returns {void}
     */
    this.$root.$on('orderReturnStep3Emit', () => {
      this.init()
    })
  },
  methods: {
    htmlDecode,
    isNull,
    /**
     * 초기화
     * @returns {void}
     */
    init () {
      this.setRefundOrdersInfo()
      this.setPaymentInfo()
    },
    /**
     * 주문내역조회 버튼 클릭.
     * @returns {void}
     */
    onclickOrdersList () {
      this.$store.commit('popup/hide', { result: this.orderReturnInfo.result })
    },
    /**
     * 홈으로 이동
     * @returns {void}
     */
    onclickHome () {
      bizUtil.gotoMain()
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/return/OrderReturnStep3";
</style>
