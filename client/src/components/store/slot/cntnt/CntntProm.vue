<template>
  <!-- 배너 프로모션형 슬롯 -->
  <section :id="espotName" class="cntnt_prom">
    <div
      class="category_top"
      @click="bizUtil.espotClickEvent(
        bannerList.clickTarget,
        bannerList.contentsId,
        bannerList.clickCode,
        bannerList.espotId,
        bannerList.mdUrl
      )"
    >
      <figure>
        <ns-img
          :src="bannerList.imgUrl"
          :product-number="bannerList.clickCode"
          alt="배너이미지"
          type="WIDE"
          replace="SQUARE"
        />
      </figure>
      <p class="title_main">
        {{ htmlDecode(bannerList.mainTitle) }}
      </p>
      <p class="title_sub">
        {{ htmlDecode(bannerList.subTitle) }}
      </p>
    </div>
  </section>
</template>

<script>
import NsImg from '@components/common/NsImg'
import bizUtil from '@utils/bizUtil'
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'

export default {
  name: 'CntntProm',
  components: {
    NsImg
  },
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
      bannerList: []
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
    htmlDecode,
    /**
     * espot 그리기
     */
    espotDraw () {
      this.bannerList = this.espotData[this.getId][0]
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/cntnt/CntntProm";
</style>
