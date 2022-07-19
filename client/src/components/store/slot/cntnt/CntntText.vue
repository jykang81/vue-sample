<template>
  <!-- 더보기 슬롯 -->
  <section :id="espotName" class="cntnt_text">
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
      <figure @click="bizUtil.espotClickEvent(bannerExtendData.titleContent.clickTarget, bannerExtendData.titleContent.contentsId, bannerExtendData.titleContent.clickCode, bannerExtendData.titleContent.espotId, bannerExtendData.titleContent.mdUrl)">
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
    <div
      v-for="(banner, bannerIdx) in bannerList"
      :key="bannerIdx"
      class="btn_total_view"
    >
      <button type="button" @click="bizUtil.espotClickEvent(banner.clickTarget, banner.contentsId, banner.clickCode, banner.espotId, banner.mdUrl)">
        {{ htmlDecode(banner.marketingText) }}
        <i />
      </button>
    </div>
  </section>
</template>

<script>
import bizUtil from '@utils/bizUtil'
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import NsImg from '@components/common/NsImg'

export default {
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
      bannerList: [],
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
    isNull,
    htmlDecode,
    /**
     * espot 그리기
     */
    espotDraw () {
      this.bannerList = this.espotData[this.getId]
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
  @import "~@/assets/styles/components/store/slot/cntnt/CntntText";
</style>
