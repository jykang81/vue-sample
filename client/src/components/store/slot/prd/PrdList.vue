<template>
  <!-- 상품리스트 슬롯 -->
  <section :id="espotName" class="prd_list">
    <div
      v-show="!isNull(mainTitle) || !isNull(subTitle) || !isNull(imgTitle)"
      class="title_tag border_bold"
    >
      <p
        v-show="!isNull(mainTitle)"
        class="title"
      >
        {{ htmlDecode(mainTitle) }}
      </p>
      <figure
        @click="bizUtil.espotClickEvent(
          gridExtendData.titleContent.clickTarget,
          gridExtendData.titleContent.contentsId,
          gridExtendData.titleContent.clickCode,
          gridExtendData.titleContent.espotId,
          gridExtendData.titleContent.mdUrl
        )"
      >
        <ns-img
          v-show="isNull(mainTitle) && !isNull(imgTitle)"
          :src="imgTitle"
          alt="타이틀 이미지"
        />
      </figure>
      <p
        v-show="!isNull(subTitle)"
        class="tag"
      >
        {{ htmlDecode(subTitle) }}
      </p>
    </div>
    <!-- 장바구니형 -->
    <ul
      v-if="prdAddBtn === 'BASKET'"
      class="promotion_list"
      :class="!isNull(clickTarget) ? 'has_total_view' : ''"
    >
      <li
        v-for="(grid, gridIdx) in gridList"
        :key="gridIdx"
      >
        <div
          class="product_box"
          @click="bizUtil.gotoProductDetail(
            grid.partnumber,
            {slotStoreName: slotGlobalVal.cateName}
          )"
        >
          <figure>
            <ns-img
              :product-number="grid.partnumber"
              :width="144"
              :height="144"
              :alt="htmlDecode(grid.itncatentrynm)"
              :is-adult="grid.adultItemFlag"
            />
          </figure>
          <div class="price_title">
            <ns-price
              :dc-price="grid.dcPrice"
              :dc-rate="grid.dcRate"
              :price="grid.price"
              :mm-rntal-prc="grid.mmRntalPrc"
              :prc-wave-disp="grid.prcWaveDisp"
              :buschn-id="grid.buschnId"
              :disp-type-cd="grid.dispTypeCd"
            />
            <p class="title">
              {{ htmlDecode(grid.itncatentrynm) }}
            </p>
          </div>
        </div>
        <div class="button_box">
          <button
            type="button"
            class="cart"
            @click="addToCart(grid.partnumber, grid.dispTypeCd, grid.buschnId, null, grid.catentryId, null)"
          >
            장바구니담기
          </button>
        </div>
      </li>
    </ul>
    <!-- 기본형 -->
    <ul
      v-else
      class="promotion_list"
      :class="!isNull(clickTarget) ? 'has_total_view' : ''"
    >
      <li
        v-for="(grid, gridIdx) in gridList"
        :key="gridIdx"
      >
        <div
          class="product_box"
          @click="bizUtil.gotoProductDetail(
            grid.partnumber,
            {slotStoreName: slotGlobalVal.cateName}
          )"
        >
          <figure>
            <ns-img
              :product-number="grid.partnumber"
              :width="144"
              :height="144"
              :alt="htmlDecode(grid.itncatentrynm)"
              :is-adult="grid.adultItemFlag"
            />
          </figure>
          <div class="price_title">
            <ns-price
              :dc-price="grid.dcPrice"
              :dc-rate="grid.dcRate"
              :price="grid.price"
              :mm-rntal-prc="grid.mmRntalPrc"
              :prc-wave-disp="grid.prcWaveDisp"
              :buschn-id="grid.buschnId"
              :disp-type-cd="grid.dispTypeCd"
            />
            <p class="title">
              {{ htmlDecode(grid.itncatentrynm) }}
            </p>
          </div>
        </div>
      </li>
    </ul>
    <div
      v-show="!isNull(clickTarget)"
      class="btn_total_view"
    >
      <button type="button" @click="bizUtil.espotClickEvent(gridExtendData.titleContent.clickTarget, gridExtendData.titleContent.contentsId, gridExtendData.titleContent.clickCode, gridExtendData.titleContent.espotId, gridExtendData.titleContent.mdUrl)">
        더보기
        <i />
      </button>
    </div>
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

export default {
  name: 'PrdList',
  components: {
    NsImg,
    NsPrice
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
      gridList: [],
      gridExtendData: {},
      mainTitle: '',
      subTitle: '',
      imgTitle: '',
      prdAddBtn: '',
      clickTarget: ''
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
    insertCommas,
    isNull,
    htmlDecode,
    /**
     * espot 그리기
     */
    espotDraw () {
      if (this.espotData[this.getId].length > 5) {
        for (let i = 0; i < 5; i++) {
          this.gridList.push(this.espotData[this.getId][i])
        }
      } else {
        this.gridList = this.espotData[this.getId]
      }
      this.gridExtendData = this.espotExtendData[this.getId]

      this.mainTitle = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.mainTitle
      this.subTitle = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.subTitle
      this.imgTitle = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.imgUrl
      this.prdAddBtn = isNull(this.gridExtendData.css.prdAddBtn) ? '' : this.gridExtendData.css.prdAddBtn
      this.clickTarget = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.clickTarget
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/prd/PrdList";
</style>
