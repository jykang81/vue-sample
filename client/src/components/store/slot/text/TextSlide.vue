<template>
  <!-- 검색어 베스트 -->
  <section :id="espotName" class="text_slide">
    <div v-show="!isNull(mainTitle) || !isNull(subTitle)" class="title_tag border_bold">
      <p class="title">
        {{ htmlDecode(mainTitle) }}
      </p>
      <p class="tag">
        {{ htmlDecode(subTitle) }}
      </p>
    </div>
    <swiper
      ref="searchSwiper"
      :options="searchSwiper"
      class="search_main_swiper"
    >
      <swiper-slide
        v-for="(textSlide, textSlideIdx) in textSlideList"
        :key="textSlideIdx"
      >
        <ol
          v-for="(text, textIdx) in textSlide"
          :key="textIdx"
        >
          <li
            :class="text.RANKING - text.PREV_RANK === 0 ? '' : (text.RANKING - text.PREV_RANK < 0 ? 'up' : 'down')"
            @click="clickOpenSearchPop(textIdx, htmlDecode(text.KEYWORD))"
          >
            <p class="number">
              {{ (textSlideIdx * 5) + textIdx + 1 }}
            </p>
            <p class="word">
              {{ htmlDecode(text.KEYWORD) }}
            </p>
          </li>
        </ol>
      </swiper-slide>
    </swiper>
    <div
      v-show="!isNull(clickTarget)"
      class="btn_total_view"
    >
      <button type="button" @click="bizUtil.espotClickEvent(textSlideExtendData.titleContent.clickTarget, textSlideExtendData.titleContent.contentsId, textSlideExtendData.titleContent.clickCode, textSlideExtendData.titleContent.espotId, textSlideExtendData.titleContent.mdUrl)">
        더보기
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

export default {
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
      searchSwiper: {
        slidesPerView: 'auto',
        spaceBetween: 16,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination'
        }
      },
      textSlideList: [],
      textSlideExtendData: {},
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
      let idx = 0
      let k = 1
      let tmptextSlideList = []
      for (let i = 0; i < this.espotData[this.getId].length; i++) {
        if (i < 20) {
          tmptextSlideList.push(this.espotData[this.getId][i])
          if (k % 5 === 0) {
            this.textSlideList[idx] = tmptextSlideList
            tmptextSlideList = []
            idx++
          }
          k++
        }
      }
      if (tmptextSlideList.length > 0) {
        this.textSlideList[idx] = tmptextSlideList
      }
      this.textSlideExtendData = this.espotExtendData[this.getId]

      this.mainTitle = isNull(this.textSlideExtendData.titleContent) ? '' : this.textSlideExtendData.titleContent.mainTitle
      this.subTitle = isNull(this.textSlideExtendData.titleContent) ? '' : this.textSlideExtendData.titleContent.subTitle
      this.imgTitle = isNull(this.textSlideExtendData.titleContent) ? '' : this.textSlideExtendData.titleContent.imgUrl
      this.clickTarget = isNull(this.textSlideExtendData.titleContent) ? '' : this.textSlideExtendData.titleContent.clickTarget
    },
    /**
     * 검색 팝업창 오픈
     * textIdx
     * @returns {void}
     */
    clickOpenSearchPop (textIdx, keyword) {
      const goingInvok = {
        path: `/search/result/${keyword}`,
        params: {
          searchTerm: keyword,
          promotionText: '',
          tvTableFlag: false, // TV 편성표에서 진입시 전문매장 타입 필터 유무.
          keywordIdentify: 'popularKeyword', // 키워드 구분자 (최근검색어 or 인기검색어)
          keywordIndex: textIdx
        }
      }

      this.$store.commit('search/setSearchWordInfo', goingInvok.params)
      this.$router.push(goingInvok)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/text/TextSlide";
</style>
