<template>
  <div v-show="globalVal.showDetailArea && !globalVal.isOrderComplete" class="order_cancel_product">
    <div v-show="globalVal.showCancelInformArea" class="delivery_search_guide">
      <span>주문상품의 전체 주문취소만 가능합니다.</span>
    </div>
    <h3 class="subject" :class="globalVal.showCancelInformArea ? 'mt32' : ''">
      주문내역
    </h3>
    <div class="order_list">
      <ul class="product_info">
        <li>
          <strong class="order_num">주문번호 <span>{{ globalVal.textOrdersId }}</span></strong>
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
              <ns-price
                :dc-price="catInfo.price"
                :buschn-id="catInfo.buschnId"
                :disp-type-cd="catInfo.dispTypeCd"
              />
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
  </div>
</template>

<script>
import {
  insertCommas,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'

export default {
  name: 'OrderCancelProduct',
  components: {
    NsImg,
    NsPrice
  },
  props: {
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      catList: []
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    }
  },
  created () {
    this.init()
  },
  methods: {
    htmlDecode,
    /**
     * 초기화 (ASIS: setOrdersInfo)
     * 주문 정보를 출력 (이전 페이지에서 넘어온 주문 상품정보를 출력)
     * @returns {void}
     */
    init () {
      const data = this.globalVal.orderDataInfo[0]
      this.globalVal.textOrdersId = data.ordersId

      // 상품정보 출력
      this.catList = []
      if (data.cats && data.cats.length > 0) {
        for (let i = 0; i < data.cats.length; i++) {
          const item = data.cats[i]
          const addItem = {
            goodsCd: item.goodsCd,
            name: (item.brandName && item.brandName !== '미정의' ? `[${item.brandName}]` : '') + item.catentryName,
            catentryName: item.catentryName,
            price: insertCommas(item.price),
            quantity: insertCommas(item.quantity),
            totalproduct: insertCommas(item.totalproduct),
            buschnId: item.buschnId,
            dispTypeCd: item.dispTypeCd,
            attrs: [],
            showGift: false,
            gifts: []
          }

          if (item.attrs && item.attrs.length > 0) {
            for (let j = 0; j < item.attrs.length; j++) {
              addItem.attrs.push(item.attrs[j].attrvalDesc)
            }
          }

          if (item.subProducts && item.subProducts.length > 0) {
            for (let k = 0; k < item.subProducts.length; k++) {
              const subProductItem = item.subProducts[k]
              if (subProductItem.partgubun === 'GIFT') {
                if (subProductItem.attrs.length > 0) {
                  addItem.gifts.push({ name: subProductItem.name, attrs: [] })
                  for (let l = 0; l < subProductItem.attrs.length; l++) {
                    addItem.gifts[k].attrs.push({ value: subProductItem.attrs[l].value })
                  }
                } else {
                  addItem.gifts.push({ name: subProductItem.name, attrs: [{ value: '' }] })
                }
                addItem.showGift = addItem.gifts.length > 0
              }
            }
          }

          this.catList.push(addItem)
        }

        this.globalVal.showCancelInformArea = this.catList.length > 1 || this.catList[0].quantity > 1
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/cancel/OrderCancelProduct";
</style>
