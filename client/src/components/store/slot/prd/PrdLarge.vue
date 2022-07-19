<template>
  <!-- 상품와이드 슬롯 -->
  <section :id="espotName" class="prd_large">
    <div
      v-show="!isNull(mainTitle) || !isNull(subTitle) || !isNull(imgTitle)"
      class="title_tag border_bold total_view"
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
      <div
        v-show="!isNull(clickTarget)"
        class="btn_total_view"
      >
        <button type="button" @click="bizUtil.espotClickEvent(gridExtendData.titleContent.clickTarget, gridExtendData.titleContent.contentsId, gridExtendData.titleContent.clickCode, gridExtendData.titleContent.espotId, gridExtendData.titleContent.mdUrl)">
          더보기
          <i />
        </button>
      </div>
    </div>
    <ul
      v-if="isNull(prdAddBtn)"
      class="product_wide"
    >
      <li
        v-for="(grid, gridIdx) in gridList"
        :key="gridIdx"
        class="large"
      >
        <div
          class="wide_item"
          @click="productDetailLogging(
            gridIdx,
            grid.itncatentrynm,
            grid.partnumber,
            {slotStoreName: slotGlobalVal.cateName}
          )"
        >
          <figure>
            <ns-img
              :product-number="grid.partnumber"
              :alt="htmlDecode(grid.itncatentrynm)"
              :is-adult="grid.adultItemFlag"
              :width="200"
              :height="200"
              type="SQUARE"
            />
            <p
              v-if="!isNull(extendBadge) || !isNull(grid.PROMOTION)"
              class="sticker"
            >
              <ns-img
                :src="isNull(extendBadge) ? grid.PROMOTION : extendBadge"
                alt="스티커"
              />
            </p>
            <ul class="benefit">
              <li v-if="!isNull(grid.BENEFIT1)">
                {{ getCutBytes(grid.BENEFIT1, 12) }}
              </li>
              <li v-if="!isNull(grid.BENEFIT2)">
                {{ getCutBytes(grid.BENEFIT2, 12) }}
              </li>
            </ul>
          </figure>
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
        <div v-if="isBenefitExistForSlot(grid, ordQtyHide)" class="benefit_button center">
          <ul class="benefit">
            <li
              v-if="grid.buschnId === ANCHOR_CONST.CHANNEL_TEXT.TV"
              class="tv"
            >
              {{ ANCHOR_CONST.BENEFIT_TEXT.isTvShopping }}
            </li>
            <li
              v-if="grid.buschnId === ANCHOR_CONST.CHANNEL_TEXT.SHOPPLUS"
              class="tv"
            >
              {{ ANCHOR_CONST.BENEFIT_TEXT.isTvShopPlus }}
            </li>
            <li
              v-if="grid.isFlashSale === 'Y'"
              class="happydeal"
            >
              {{ ANCHOR_CONST.BENEFIT_TEXT.isHappyDeal }}
            </li>
            <li v-if="grid.dlvrFreeYn === 'Y' && !isConsultantRequiredProduct(grid)">
              무료배송
            </li>
            <li v-if="grid.promIfiVal > 0">
              무이자
            </li>
            <li v-if="grid.promPadYn === 'Y'">
              적립금
            </li>
          </ul>
          <p
            v-if="ordQtyHide !== 'Y' && grid.orderQty > 0"
            class="count"
          >
            {{ getOrderCount(grid.orderQty) }}
          </p>
        </div>
        <p class="broadcast_time">
          {{ grid.onAirTime }}
        </p>
      </li>
    </ul>
  </section>
</template>

<script>
import {
  insertCommas,
  isNull,
  htmlDecode,
  getCutBytes
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import ANCHOR_CONST from '@/common/constants/store/anchor'
import { mapGetters } from 'vuex'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'PrdLarge',
  components: {
    NsImg,
    NsPrice
  },
  mixins: [
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
      gridExtendData: [],
      layer: false,
      prdAddBtn: '',
      ordQtyHide: '',
      mainTitle: '',
      subTitle: '',
      imgTitle: '',
      clickTarget: '',
      partNumber: '',
      globalVal: {
        mInputParams: {
          invoke: {
          }
        }
      },
      extendBadge: ''
    }
  },
  computed: {
    ANCHOR_CONST () {
      return ANCHOR_CONST
    },
    bizUtil () {
      return bizUtil
    },
    getId () {
      let result = ''
      if (this.$el.parentNode !== null) {
        result = this.$el.parentNode.id
      }
      return result
    },
    ...mapGetters('home', [
      'getDisplayName'
    ])
  },
  mounted () {
    this.espotDraw()
  },
  methods: {
    insertCommas,
    isNull,
    htmlDecode,
    getCutBytes,
    /**
      * 상품 상세 클릭
      * @param {number} index 순서
      * @param {string} productname 상품명
      * @param {string} partNumber 상품번호
      * @param {string} cateName 스토어네임
      */
    productDetailLogging (index, productname, partnumber, cateName) {
      // 마케팅 스크립트 적용 부분
      // GA360
      let subCate = ''
      let themaCate = ''
      let eventLabel = ''
      let action = ''
      if (!isNull(this.slotGlobalVal.clickSubCategoryName)) {
        subCate = this.slotGlobalVal.clickSubCategoryName
        if (!isNull(this.slotGlobalVal.clickThemaCategoryName)) {
          themaCate = this.slotGlobalVal.clickThemaCategoryName
          eventLabel = `${subCate}_${themaCate}_${productname}`
        } else {
          eventLabel = `${subCate}_${productname}`
        }
      } else {
        if (!isNull(this.slotGlobalVal.clickThemaCategoryName)) {
          themaCate = this.slotGlobalVal.clickThemaCategoryName
          eventLabel = `${subCate}_${themaCate}_${productname}`
        } else {
          eventLabel = productname
        }
      }
      if (!isNull(this.slotGlobalVal.themaSectionId)) {
        action = `${this.slotGlobalVal.themaSectionId}_${this.espotName}`
      } else {
        action = this.espotName
      }

      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: `MOBILE_${this.getDisplayName}`,
          eventAction: action,
          eventLabel,
          params: {
            t1: null
          }
        }
      })
      bizUtil.gotoProductDetail(partnumber, cateName)
    },
    /**
     * espot 그리기
     */
    espotDraw () {
      this.gridList = this.espotData[this.getId]
      this.gridExtendData = this.espotExtendData[this.getId]

      for (let i = 0; i < this.gridList.length; i++) {
        for (let j = 0; j < this.gridList[i].badge.length; j++) {
          if (!isNull(this.gridList[i].badge[j].PROMOTION)) {
            this.gridList[i].PROMOTION = this.gridList[i].badge[j].PROMOTION
          }
          if (!isNull(this.gridList[i].badge[j].BENEFIT1)) {
            this.gridList[i].BENEFIT1 = this.gridList[i].badge[j].BENEFIT1
          }
          if (!isNull(this.gridList[i].badge[j].BENEFIT2)) {
            this.gridList[i].BENEFIT2 = this.gridList[i].badge[j].BENEFIT2
          }
        }
      }

      this.ordQtyHide = isNull(this.gridExtendData.css.ordQtyHide) ? '' : this.gridExtendData.css.ordQtyHide
      this.prdAddBtn = isNull(this.gridExtendData.css.prdAddBtn) ? '' : this.gridExtendData.css.prdAddBtn

      this.mainTitle = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.mainTitle
      this.subTitle = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.subTitle
      this.imgTitle = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.imgUrl
      this.clickTarget = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.clickTarget
      this.extendBadge = this.gridExtendData.badge
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/prd/PrdLarge";
</style>
