<template>
  <!-- 배너 프로모션형 슬롯 -->
  <section :id="espotName" class="cntnt_prd_list">
    <div
      class="category_top"
      @click="bizUtil.espotClickEvent(
        bannerObj.clickTarget,
        bannerObj.contentsId,
        bannerObj.clickCode,
        bannerObj.espotId,
        bannerObj.mdUrl
      )"
    >
      <figure>
        <ns-img
          :src="bannerObj.imgUrl"
          :product-number="bannerObj.clickCode"
          alt="상품이미지"
          type="WIDE"
          replace="SQUARE"
        />
      </figure>
      <p class="title_main">
        {{ htmlDecode(bannerObj.mainTitle) }}
      </p>
      <p class="title_sub">
        {{ htmlDecode(bannerObj.subTitle) }}
      </p>
    </div>
    <!-- 상품형 슬롯영역 -->
    <!-- 장바구니형 -->
    <ul
      v-if="prdAddBtn === 'BASKET'"
      class="promotion_list"
    >
      <li
        v-for="(bannerPrd, prdIdx) in bannerPrdList"
        :key="prdIdx"
      >
        <div
          class="product_box"
          @click="bizUtil.gotoProductDetail(
            bannerPrd.partnumber,
            {slotStoreName: slotGlobalVal.cateName}
          )"
        >
          <figure>
            <ns-img
              :product-number="bannerPrd.partnumber"
              :width="144"
              :height="144"
              :alt="htmlDecode(bannerPrd.itncatentrynm)"
              :is-adult="bannerPrd.adultItemFlag"
            />
          </figure>
          <div class="price_title">
            <ns-price
              :dc-price="bannerPrd.dcPrice"
              :dc-rate="bannerPrd.dcRate"
              :price="bannerPrd.price"
              :mm-rntal-prc="bannerPrd.mmRntalPrc"
              :prc-wave-disp="bannerPrd.prcWaveDisp"
              :buschn-id="bannerPrd.buschnId"
              :disp-type-cd="bannerPrd.dispTypeCd"
            />
            <p class="title">
              {{ htmlDecode(bannerPrd.itncatentrynm) }}
            </p>
          </div>
        </div>
        <div class="button_box">
          <button
            type="button"
            class="cart"
            @click="clickAddCart(bannerPrd)"
          >
            장바구니담기
          </button>
        </div>
      </li>
      <!-- 바로구매 레이어 컴포넌트 -->
      <right-order-option
        v-if="!isNull(partNumber)"
        :key="partNumber"
        :shows-layer="layer"
        :global-val="{partNumber: partNumber, getProductInfoFlag: true}"
        @layerClose="layerClose()"
      />
    </ul>
    <!-- 기본형 -->
    <ul
      v-else
      class="promotion_list"
    >
      <li
        v-for="(bannerPrd, prdIdx) in bannerPrdList"
        :key="prdIdx"
      >
        <div
          class="product_box"
          @click="bizUtil.gotoProductDetail(
            bannerPrd.partnumber,
            {slotStoreName: slotGlobalVal.cateName}
          )"
        >
          <figure>
            <ns-img
              :product-number="bannerPrd.partnumber"
              :width="144"
              :height="144"
              :alt="htmlDecode(bannerPrd.itncatentrynm)"
              :is-adult="bannerPrd.adultItemFlag"
            />
          </figure>
          <div class="price_title">
            <ns-price
              :dc-price="bannerPrd.dcPrice"
              :dc-rate="bannerPrd.dcRate"
              :price="bannerPrd.price"
              :mm-rntal-prc="bannerPrd.mmRntalPrc"
              :prc-wave-disp="bannerPrd.prcWaveDisp"
              :buschn-id="bannerPrd.buschnId"
              :disp-type-cd="bannerPrd.dispTypeCd"
            />
            <p class="title">
              {{ htmlDecode(bannerPrd.itncatentrynm) }}
            </p>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import {
  insertCommas,
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import storeMixProductAddCartMixin from '@/mixins/store/cart/storeMixProductAddCartMixin'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import RightOrderOption from '@/components/product/RightOrderOption'

export default {
  name: 'CntntPrdList',
  components: {
    NsImg,
    NsPrice,
    RightOrderOption
  },
  mixins: [
    storeMixProductAddCartMixin,
    storeProductTypeMixin
  ],
  props: {
    espotName: {
      type: String,
      required: true
    },
    slotGlobalVal: {
      type: Object,
      required: true
    },
    espotData: {
      type: Object,
      required: true
    },
    espotExtendData: {
      type: Object,
      required: true
    },
    totalOrgan: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      bannerObj: {},
      bannerPrdList: [],
      bannerExtendData: {},
      prdAddBtn: '',
      mainTitle: '',
      subTitle: '',
      imgTitle: '',
      clickTarget: '',
      partNumber: '',
      layer: false,
      globalVal: {
        mInputParams: {
          invoke: {
          }
        }
      }
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    },
    getId () {
      let result = ''
      if (this.$el.parentNode !== null) {
        result = this.$el.parentNode.id
      }
      return result
    }
  },
  mounted () {
    this.espotDraw()
  },
  methods: {
    isNull,
    insertCommas,
    htmlDecode,
    /**
     * espot 그리기
     */
    espotDraw () {
      this.bannerObj = this.espotData[this.getId][0].banner
      if (this.espotData[this.getId][0].prdList.length > 3) {
        for (let i = 0; i < 3; i++) {
          this.bannerPrdList.push(this.espotData[this.getId][0].prdList[i])
        }
      } else {
        this.bannerPrdList = this.espotData[this.getId][0].prdList
      }
      this.bannerExtendData = this.espotExtendData[this.getId]

      this.prdAddBtn = isNull(this.bannerExtendData.css) ? '' : this.bannerExtendData.css.prdAddBtn

      this.mainTitle = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.mainTitle
      this.subTitle = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.subTitle
      this.imgTitle = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.imgUrl

      this.clickTarget = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.clickTarget
    },
    /**
     * 바로주문 열기
     */
    slotLayerOpen (partNumber) {
      this.partNumber = partNumber
      this.layer = true
    },
    /**
     * 바로주문 닫기
     */
    layerClose () {
      this.layer = false
    },
    /**
     * 장바구니 담기
     */
    clickAddCart (prd) {
      this.isSlotFlag = true
      this.addToCart(prd.partnumber, prd.dispTypeCd, prd.buschnId, null, prd.catentryId, null)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/cntnt/CntntPrdList";
</style>
