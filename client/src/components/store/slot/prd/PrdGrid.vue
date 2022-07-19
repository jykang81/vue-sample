<template>
  <!-- 상품 2단 그리드형 -->
  <section :id="espotName" class="prd_grid">
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
    <div class="product_list grid">
      <div
        v-for="(grid, gridIdx) in gridList"
        :key="gridIdx"
        class="list"
      >
          <div
            class="product_info"
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
                :width="366"
                :height="366"
                :alt="htmlDecode(grid.itncatentrynm)"
                :is-adult="grid.adultItemFlag"
              />
            </figure>
            <div class="field">
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
      </div>
    </div>
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
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'
import { mapGetters } from 'vuex'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'PrdGrid',
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
      gridExtendData: {},
      mainTitle: '',
      subTitle: '',
      imgTitle: '',
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
    /**
      * 상품 클릭
      * @param {number} index 순서
      * @param {string} productname 상품명
      * @param {string} partNumber 상품번호
      * @param {string} catename 스토어네임
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

      this.mainTitle = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.mainTitle
      this.subTitle = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.subTitle
      this.imgTitle = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.imgUrl
      this.clickTarget = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.clickTarget
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/prd/PrdGrid";
</style>
