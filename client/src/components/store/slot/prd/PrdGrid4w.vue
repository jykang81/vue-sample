<template>
  <!-- 상품 4단 그리드형 슬롯 -->
  <section class="prd_grid_4w">
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
      <figure @click="bizUtil.espotClickEvent(gridExtendData.titleContent.clickTarget, gridExtendData.titleContent.contentsId, gridExtendData.titleContent.clickCode, gridExtendData.titleContent.espotId, gridExtendData.titleContent.mdUrl)">
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
    <ul class="promotion_grid">
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
              :product-number="grid.catentryId"
              :width="180"
              :height="180"
              :alt="htmlDecode(grid.itncatentrynm)"
              :is-adult="grid.adultItemFlag"
            />
          </figure>
          <ns-price
            :dc-price="grid.dcPrice"
            :mm-rntal-prc="grid.mmRntalPrc"
            :prc-wave-disp="grid.prcWaveDisp"
            :buschn-id="grid.buschnId"
            :disp-type-cd="grid.dispTypeCd"
          />
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
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import {
  isNull,
  htmlDecode,
  insertCommas
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'

export default {
  name: 'PrdGrid4w',
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
    }
  },
  mounted () {
    this.espotDraw()
  },
  methods: {
    isNull,
    htmlDecode,
    insertCommas,
    /**
     * espot 그리기
     */
    espotDraw () {
      if (this.espotData[this.getId].length > 12) {
        for (let i = 0; i < 12; i++) {
          this.gridList.push(this.espotData[this.getId][i])
        }
      } else {
        this.gridList = this.espotData[this.getId]
      }
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
  @import "~@/assets/styles/components/store/slot/prd/PrdGrid4w";
</style>
