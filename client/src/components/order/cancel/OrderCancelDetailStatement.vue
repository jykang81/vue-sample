<template>
  <div class="order_cancel_detail_statement">
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
                <a @click="bizUtil.gotoProductDetail(cat.goodsCd, {
                  popupId: popupId
                })"
                >
                  <ns-img
                    :product-number="cat.goodsCd"
                    :width="144"
                    :height="144"
                    :alt="cat.catentryName"
                  />
                </a>
              </figure>
              <div class="field">
                <p class="title">
                  [{{ htmlDecode(cat.brandName) }}] {{ htmlDecode(cat.catentryName) }}
                </p>
                <ns-price
                  :dc-price="cat.price"
                  :buschn-id="cat.buschnId"
                  :disp-type-cd="cat.dispTypeCd"
                />
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
        v-if="orders.canPayms && orders.canPayms.length > 0"
        class="payment_option"
      >
        <template
          v-for="item in orders.canPayms"
        >
          <dt
            :key="item.paymentname"
          >
            {{ item.paymentname === 'NS페이 실시간계좌이체' ? 'NS페이 계좌' : item.paymentname }}
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
import bizUtil from '@utils/bizUtil'
import CONST from '@constants/framework/framework'
import nslog from '@frameworks/logUtil'
import errorUtil from '@frameworks/errorUtil'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import orderCancelDetailStatementService from '@services/order/cancel/orderCancelDetailStatementService'

export default {
  name: 'OrderCancelDetailStatement',
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
      orderId: '',
      orders: {},
      orderDate: '',
      attrvalDesc: [],
      totalPayms: 0,
      guestType: 'g', // 비회원
      popupId: '' // 팝업 ID. #popup-1
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    }
  },
  created () {
    this.orderId = this.param.ordersId

    // 마케팅 스크립트를 위한 부분 (GA 360)
    this.popupId = this.$route.hash

    this.getDetailData()
  },
  methods: {
    insertCommas,
    htmlDecode,
    getDetailData () {
      const param = {
        ordsid: this.orderId,
        channel: 'mobile',
        vwtyp: !loginUtil.checkLogonStatus() ? this.guestType : '', // 비회원일 경우 g
        userId: loginUtil.userId()
      }

      const successHandling = data => {
        // Log Case: NO_PRODUCT_DETAIL
        if (!Object.keys(data).includes('msg')) {
          nslog.sendRecord(CONST.LOG.TYPE.ERROR, {
            type: CONST.LOG.MESSAGE.RESPONSE.WCSERROR,
            message: CONST.LOG.MESSAGE.ORDER.CANCEL.NO_PRODUCT_DETAIL,
            trace: data,
            status: '500',
            page: errorUtil.getCurrentURL(),
            view: errorUtil.getComponentName()
          })
        }

        this.orders = data.msg.root.orders[0]
        this.orderDate = this.orders.timeplaced.replace(/-/gi, '.')

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

        for (let i = 0; i < this.orders.canPayms.length; i++) {
          const maymsItem = this.orders.canPayms[i]

          maymsItem.paymentname = maymsItem.paymentname.split(' ')[0]

          if (maymsItem.paymentname === '무통장') {
            maymsItem.paymentname = '무통장입금'
          }

          this.totalPayms = this.totalPayms + parseInt(maymsItem.payAmt, 10)
        }
      }

      orderCancelDetailStatementService.getDetailData(param, successHandling)
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
  @import "~@/assets/styles/components/order/cancel/OrderCancelDetailStatement";
</style>
