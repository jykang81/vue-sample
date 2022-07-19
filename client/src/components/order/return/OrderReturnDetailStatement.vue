<template>
  <div class="order_return_detail_statement">
    <h3 class="subject checkbox">
      {{ orderDate }}
      <span class="order_number">(주문번호 {{ orderId }})</span>
    </h3>

    <div class="order_list">
      <ul class="product_info">
        <template
          v-for="(cat, index) in orders.cats"
        >
          <li
            :key="index"
          >
            <div class="state_box">
              <p class="state">
                {{ cat.statusName }}
              </p>
            </div>
            <div class="box">
              <figure>
                <ns-img
                  :product-number="cat.goodsCd"
                  :width="144"
                  :height="144"
                  :alt="cat.catentryName"
                />
              </figure>
              <div class="field">
                <p class="title">
                  [{{ htmlDecode(cat.brandName) }}] {{ htmlDecode(cat.catentryName) }}
                </p>
                <p class="price">
                  <strong>{{ insertCommas(cat.price) }}</strong>원
                </p>
                <p class="option">
                  {{ cat.quantity }}개 / {{ htmlDecode(attrvalDesc[index]) }}
                </p>
                <dl
                  v-if="cat.subProducts && cat.subProducts.length > 0"
                  class="free_gift"
                >
                  <dt>사은품</dt>
                  <dd
                    v-for="(gift, giftIdx) in cat.subProducts"
                    :key="giftIdx"
                  >
                    {{ cat.subProducts.length === 1 ? '' : (giftIdx + 1) + '.' }} {{ htmlDecode(gift.name) }}
                  </dd>
                </dl>
              </div>
            </div>
          </li>
        </template>
      </ul>
    </div>
    <template
      v-if="refundInfo"
    >
      <h3 class="subject line">
        반품사유
      </h3>
      <div class="order_list">
        <ul class="product_info">
          <li>
            <div class="delivery_point">
              <p class="phone">
                {{ refundInfo.rsnDesc }}
              </p>
              <p class="delivery_msg">
                {{ refundInfo.rsnDtl }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </template>

    <template
      v-if="pickup"
    >
      <h3 class="subject line">
        수거지 정보
      </h3>
      <div class="order_list">
        <ul class="product_info">
          <li>
            <div class="delivery_point">
              <p class="name">
                {{ pickup.nickname }}
              </p>
              <div class="address">
                {{ pickup.dispAddressPlus }}
              </div>
              <p
                v-if="pickup.phone1"
                class="phone"
              >
                휴대폰: {{ pickup.phone1 }}
              </p>
              <p class="delivery_msg">
                {{ pickup.message }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </template>

    <h3 class="subject line">
      환불정보
    </h3>
    <div class="total_price">
      <dl class="total none">
        <dt>
          환불(예상)금액
        </dt>
        <dd>
          <strong>{{ insertCommas(totalPayms) }}</strong>원
        </dd>
      </dl>
      <dl
        v-if="orders.payms && orders.payms.length > 0"
        class="payment_option"
      >
        <template
          v-for="item in orders.payms"
        >
          <dt
            :key="item.paymentname"
          >
            {{ item.paymentname === 'NS페이 실시간계좌이체' ? 'NS페이 계좌' : item.paymentname.split(' ')[0] }}
          </dt>
          <dd
            :key="item.payAmt"
          >
            <template
              v-if="item.paymdtls && item.paymdtls.length > 0 && (item.paymentcode != '1400' && item.paymentcode != '1500')"
            >
              {{ item.paymdtls[0].relNm }}
            </template>
            <span><strong>{{ insertCommas(item.payAmt) }}</strong>원</span>
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
          {{ refundPickupCost }}
        </dd>
      </dl>
    </div>
    <div class="btn_group_block">
      <button
        type="button"
        class="btn"
        @click="onclickOrdersList"
      >
        <span>주문내역 조회</span>
      </button>
    </div>
  </div>
</template>

<script>
import loginUtil from '@utils/loginUtil'
import {
  htmlDecode,
  insertCommas
} from '@utils/commonutil/commonUtil'
import popupUtil from '@frameworks/popupUtil'
import NsImg from '@components/common/NsImg'
import orderReturnDetailStatementService from '@services/order/return/orderReturnDetailStatementService'

export default {
  name: 'OrderReturnDetailStatement',
  components: {
    NsImg
  },
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      orderId: '',
      orders: {},
      orderDate: '',
      attrvalDesc: [],
      totalPayms: 0,
      pickup: null,
      refundInfo: null,
      refundPickupCost: '무료'
    }
  },
  created () {
    this.orderId = this.param.ordersId

    this.getDetailData()
  },
  methods: {
    insertCommas,
    htmlDecode,
    getDetailData () {
      const param = {
        tasknm: 'RETURN',
        subTasknm: 'form',
        ordsid: this.orderId,
        counselorOrderCancel: 'refunddetail',
        channel: 'mobile',
        userId: loginUtil.userId()
      }

      const successHandling = data => {
        this.orders = data.msg.root.orders[0]
        this.orderDate = this.orders.timeplaced.replace(/-/gi, '.')

        if (this.orders.cats[0].pickup) {
          if (this.orders.cats[0].pickup.nickname || this.orders.cats[0].pickup.dispAddressPlus || this.orders.cats[0].pickup.phone1 || this.orders.cats[0].pickup.message) {
            this.pickup = this.orders.cats[0].pickup
          }
        }

        if (this.orders.refundInfo) {
          this.refundInfo = this.orders.refundInfo
        }

        for (let i = 0; i < this.orders.cats.length; i++) {
          this.orders.cats[i].catentryName = htmlDecode(this.orders.cats[i].catentryName)

          for (let j = 0; j < this.orders.cats[i].attrs.length; j++) {
            if (j === 0) {
              this.attrvalDesc[i] = this.orders.cats[i].attrs[j].attrvalDesc
            } else {
              this.attrvalDesc[i] += `, ${this.orders.cats[i].attrs[j].attrvalDesc}`
            }
          }
        }

        for (let i = 0; i < this.orders.payms.length; i++) {
          this.totalPayms = this.totalPayms + parseInt(this.orders.payms[i].payAmt, 10)
        }
      }

      orderReturnDetailStatementService.getDetailData(param, successHandling)
    },

    /**
     * 주문내역조회 버튼 클릭.
     * @returns {void}
     */
    onclickOrdersList () {
      let cmd = ''
      if (this.$route.path.includes('cancel-return-exchange')) {
        cmd = 'MypageOrderList'
      }
      this.$store.commit('popup/hide', { cmd })
    },

    /**
     * 주문상세 이동
     */
    onclickOrderDetailLink () {
      const param = {
        title: '주문상세내역',
        isShowSearch: true,
        isShowCart: true,
        ordersId: this.orderId,
        guestResultYn: 'N',
        logonType: 'normal',
        intPrdYn: 'N',
        footerShow: true,
        bottomShow: true
      }

      const callback = result => {
        console.log(result)
      }

      popupUtil.show('order/detail/MypageOrderDetail', param, callback)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/return/OrderReturnDetailStatement";
</style>
