<template>
  <!-- 상품와이드 - 혜택형 1.5 슬라이드 슬롯 -->
  <section :id="espotName" class="prd_slide_15w">
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
    <swiper
      ref="exhibition"
      :options="exhibition"
      class="product_wide"
    >
      <swiper-slide
        v-for="(grid, gridIdx) in gridList"
        :key="gridIdx"
      >
        <div
          class="slide_wide"
          @click="bizUtil.gotoProductDetail(
            grid.partnumber,
            {slotStoreName: slotGlobalVal.cateName}
          )"
        >
          <figure>
            <ns-img
              :src="grid.espotImgUrl"
              :product-number="grid.catentryId"
              :alt="htmlDecode(grid.itncatentrynm)"
              :is-adult="grid.adultItemFlag"
              type="WIDE"
              replace="CROP"
            />
            <!-- <p
              v-if="!isNull(grid.PROMOTION)"
              class="sticker"
            >
              <ns-img
                :src="grid.PROMOTION"
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
            </ul> -->
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
      </swiper-slide>
    </swiper>
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
  htmlDecode,
  getCutBytes
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'

export default {
  name: 'PrdSlide15w',
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
      exhibition: {
        slidesPerView: 'auto',
        spaceBetween: 16
      },
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
    insertCommas,
    isNull,
    htmlDecode,
    getCutBytes,
    /**
     * espot 그리기
     */
    espotDraw () {
      this.gridList = this.espotData[this.getId]
      this.gridExtendData = this.espotExtendData[this.getId]

      // for (let i = 0; i < this.gridList.length; i++) {
      //   for (let j = 0; j < this.gridList[i].badge.length; j++) {
      //     if (!isNull(this.gridList[i].badge[j].PROMOTION)) {
      //       this.gridList[i].PROMOTION = this.gridList[i].badge[j].PROMOTION
      //     }
      //     if (!isNull(this.gridList[i].badge[j].BENEFIT1)) {
      //       this.gridList[i].BENEFIT1 = this.gridList[i].badge[j].BENEFIT1
      //     }
      //     if (!isNull(this.gridList[i].badge[j].BENEFIT2)) {
      //       this.gridList[i].BENEFIT2 = this.gridList[i].badge[j].BENEFIT2
      //     }
      //   }
      // }

      this.mainTitle = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.mainTitle
      this.subTitle = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.subTitle
      this.imgTitle = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.imgUrl
      this.clickTarget = isNull(this.gridExtendData.titleContent) ? '' : this.gridExtendData.titleContent.clickTarget
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/prd/PrdSlide15w";
</style>
