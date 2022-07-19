<template>
  <div class="order_complete_message">
    <template v-if="isDeposit()">
      <div class="msg_box">
        <h2 class="subject">
          <span class="red">{{ displayInfo.deposit.date }}까지</span> 입금해 주세요.
        </h2>
        <p class="msg">
          기한 내 입금되지 않으면 주문이 자동 취소됩니다.
        </p>
        <p class="msg lg">
          (주문번호: {{ globalVal.messageInfo.ordersId }})
        </p>
      </div>
      <dl class="bank_info">
        <dt>{{ displayInfo.deposit.name }}</dt>
        <dd>예금주: (주)엔에스쇼핑</dd>
        <dd><strong>{{ displayInfo.deposit.amt }}</strong>원</dd>
        <dd class="account">
          <span>
            입금계좌: {{ displayInfo.deposit.accNum }}
          </span>
          <button
            v-clipboard:copy="displayInfo.deposit.accNum"
            v-clipboard:success="clipboardSuccessHandler"
            type="button"
            class="btn"
          >
            <span>복사</span>
          </button>
        </dd>
      </dl>
    </template>
    <template v-else>
      <div class="msg_box">
        <h2 class="subject">
          주문이 완료되었습니다.
        </h2>
        <p class="msg lg">
          (주문번호: {{ globalVal.messageInfo.ordersId }})
        </p>
      </div>
    </template>
    <ul v-show="!isNull(globalVal.lineBannerInfo) && globalVal.lineBannerInfo.length > 0" class="order_banner_list">
      <li v-for="(lineBannerInfo, index) in globalVal.lineBannerInfo" :key="index">
        <a @click="bizUtil.espotClickEvent(lineBannerInfo.clickTarget, lineBannerInfo.contentsId, lineBannerInfo.clickCode, lineBannerInfo.espotId, lineBannerInfo.mdUrl)">
          <ns-img :src="lineBannerInfo.imgUrl" />
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import {
  getDateWithDayFormat
} from '@frameworks/dateutil/dateUtil'
import {
  insertCommas,
  isNull
} from '@utils/commonutil/commonUtil'
import toastUtil from '@frameworks/toastUtil'
import bizUtil from '@utils/bizUtil'
import addCartMixin from '@/mixins/order/cart/addCartMixin'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import NsImg from '@components/common/NsImg'
Vue.use(VueClipboard)

export default {
  components: {
    NsImg
  },
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
      paymentItem: null,
      displayInfo: {
        deposit: {
          name: '', // 입금은행
          accNum: '', // 입금계좌번호
          amt: '0', // 입금하실 금액
          date: '' // 입금마감일
        }
      }
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    }
  },
  created () {
    this.paymentItem = this.globalVal.paymentInfo.paymentList[0]

    if (this.isDeposit()) {
      this.setDeposit()
    } else {
      const length = this.globalVal.messageInfo.deliveryList.length
      if (length > 0) {
        for (let i = 0; i < length; i++) {
          const lengthItems = this.globalVal.messageInfo.deliveryList[i].ITEMS.length
          for (let j = 0; j < lengthItems; j++) {
            const item = this.globalVal.messageInfo.deliveryList[i].ITEMS[j]
            this.addCartItems.push({
              DISP_TYPE_CD: item.DISP_TYPE_CD,
              QUANTITY: item.QUANTITY === '0' ? '1' : item.QUANTITY,
              CATENTRY_ID: item.CATENTRY_ID,
              busChnId: item.busChnId,
              goodsCd: item.partNumber
            })
          }
        }
        this.callbackAddCartItems = data => {
          toastUtil.show('장바구니에 상품이 담겼습니다.')
        }
      }
    }
  },
  methods: {
    isNull,
    /**
     * 무통장입금 여부
     * @returns {void}
     */
    isDeposit () {
      return PAY_TYPE_CONST.isDepositWithoutBankbook(this.paymentItem.payType)
    },
    /**
     * 무통장입금
     * @returns {void}
     */
    setDeposit () {
      this.displayInfo.deposit.amt = insertCommas(this.paymentItem.payAmt)
      this.displayInfo.deposit.name = this.paymentItem.DP_bankName.replace(/ /g, '')
      this.displayInfo.deposit.accNum = isNull(this.paymentItem.DP_depositAccountNo) ? '' : this.paymentItem.DP_depositAccountNo.replace(/-/g, '')
      this.displayInfo.deposit.date = getDateWithDayFormat(this.paymentItem.DP_payDate.replace(/-/g, ''))
    },
    /**
     * 장바구니 담기
     * @returns {void}
     */
    onclickAddCart () {
      const length = this.globalVal.detailInfo.productList.length
      if (!isNull(this.globalVal.detailInfo.productList)) {
        for (let i = 0; i < length; i++) {
          // 제품_상품 유형
          let tvProduct = ''
          if (this.globalVal.detailInfo.productList[i].buschnId === 'INT') {
            tvProduct = 'e상품'
          } else {
            tvProduct = 'eTV'
          }
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
            data: {
              step: marketingUtil.ga360Logger.ECOMMERCE_STEP_03,
              params: [
                {
                  id: String(this.globalVal.detailInfo.productList[i].GOODSPARTNUMBER),
                  name: this.globalVal.detailInfo.productList[i].PRODUCT_NAME,
                  brand: this.globalVal.detailInfo.productList[i].BRAND_KOR_NM,
                  dimension16: tvProduct
                }
              ],
              subparams: {
                t1: '주문완료',
                t2: '장바구니담기',
                t3: this.globalVal.detailInfo.productList[i].PRODUCT_NAME
              }
            }
          })
        }
      }
      this.addCart()
    },
    /**
     * 클립보드 복사 성공시 처리
     * @returns {void}
     */
    clipboardSuccessHandler () {
      toastUtil.show('계좌번호가 복사되었습니다.')
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/complete/OrderCompleteMessage";
</style>
