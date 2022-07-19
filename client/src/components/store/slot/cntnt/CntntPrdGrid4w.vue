<template>
  <!-- 배너 프로모션형 슬롯 -->
  <section :id="espotName" class="cntnt_prd_grid_4w">
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
    <ul class="promotion_grid">
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
          <ns-price
            :dc-price="bannerPrd.dcPrice"
            :mm-rntal-prc="bannerPrd.mmRntalPrc"
            :prc-wave-disp="bannerPrd.prcWaveDisp"
            :buschn-id="bannerPrd.buschnId"
            :disp-type-cd="bannerPrd.dispTypeCd"
          />
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import bizUtil from '@utils/bizUtil'
import {
  isNull,
  insertCommas,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'

export default {
  name: 'CntntPrdGrid4w',
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
      bannerObj: {},
      bannerPrdList: [],
      bannerExtendData: {},
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
    insertCommas,
    htmlDecode,
    isNull,
    /**
     * espot 그리기
     */
    espotDraw () {
      this.bannerObj = this.espotData[this.getId][0].banner
      if (this.espotData[this.getId][0].prdList.length > 8) {
        for (let i = 0; i < 8; i++) {
          this.bannerPrdList.push(this.espotData[this.getId][0].prdList[i])
        }
      } else {
        this.bannerPrdList = this.espotData[this.getId][0].prdList
      }
      this.bannerExtendData = this.espotExtendData[this.getId]

      this.mainTitle = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.mainTitle
      this.subTitle = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.subTitle
      this.imgTitle = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.imgUrl

      this.clickTarget = isNull(this.bannerExtendData.titleContent) ? '' : this.bannerExtendData.titleContent.clickTarget
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/cntnt/CntntPrdGrid4w";
</style>
