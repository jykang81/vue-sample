<template>
  <!-- 하위매장 슬롯 -->
  <!-- icon 추가시 아이콘 이미지 적용 -->
  <section v-show="categoryList.length > 1" :id="espotName" class="sub_category_box">
    <div id="slotCategoryWrapper" class="sub_category">
      <div id="slotCategoryScroller" class="category_container">
        <ul id="slotCategorySlideWrapper" class="category_wrapper">
          <li
            v-for="(category, categoryIdx) in categoryList"
            :key="categoryIdx"
            class="category_slide"
            :class="[slotGlobalVal.subcateSeq === category.seq ? 'current' : '']"
          >
            <button type="button" class="cat" @click="clickClassActive(categoryIdx, category.categoryName)">
              {{ htmlDecode(category.categoryName) }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import IScroll from 'iscroll'
import {
  htmlDecode,
  isNull
} from '@utils/commonutil/commonUtil'
import { mapGetters } from 'vuex'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

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
      slider: null,
      categoryList: []
    }
  },
  computed: {
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
  watch: {
    'slotGlobalVal.param.subSeq' (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.slotGlobalVal.subcateSeq = newVal
        this.$forceUpdate()
      }
    }
  },
  mounted () {
    this.espotDraw()

    this.$nextTick(() => {
      this.slider = new IScroll('#slotCategoryWrapper', {
        scrollX: true,
        scrollY: false,
        disablePointer: true, // mobile 스크롤 버그 대응
        disableMouse: false, // pc 환경 스크롤 허용
        disableTouch: false // mobile 환경 스크롤 허용
      })

      this.centerCurrentCategory()
    })
  },
  methods: {
    htmlDecode,
    /**
     * espot 그리기
     */
    espotDraw () {
      this.categoryList = this.espotData[this.getId]

      if (!isNull(this.$route.query.gotoSub)) {
        for (let i = 0; i < this.categoryList.length; i++) {
          if (this.categoryList[i].categoryId === this.$route.query.gotoSub) {
            this.slotGlobalVal.subcateSeq = this.categoryList[i].seq
            this.slotGlobalVal.clickSubCategoryName = this.categoryList[i].categoryName
          }
        }
      }
    },
    /**
     * 메뉴 클릭 시
     * @param {Number} categoryIdx
     * @param {String} categoryName
     */
    clickClassActive (categoryIdx, categoryName) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: `MOBILE_${this.getDisplayName}`,
          eventAction: '하위매장_탭이동',
          eventLabel: `${categoryIdx + 1}_${categoryName}`,
          params: {
            t1: null
          }
        }
      })

      // this.$router.push({ name: 'slotStore', query: { gotoSub: this.categoryList[categoryIdx].categoryId } })
      this.$route.query.gotoSub = ''
      this.slotGlobalVal.currentTab = categoryIdx
      this.replaceSlot(categoryIdx)
    },
    /**
     * callNSMobileGetEspotData 부모함수 호출
     * @param {Number} categoryIdx
     */
    replaceSlot (categoryIdx) {
      this.slotGlobalVal.param = {
        categoryDiv: 'sub',
        clickSlotId: this.getId,
        catalogId: this.categoryList[categoryIdx].catalogId,
        categoryId: this.categoryList[categoryIdx].categoryId,
        categoryLevel: this.categoryList[categoryIdx].categoryLevel,
        categoryName: this.categoryList[categoryIdx].categoryName,
        espotId: this.categoryList[categoryIdx].espotId,
        imgUrl: this.categoryList[categoryIdx].imgUrl,
        subSeq: this.categoryList[categoryIdx].seq,
        themaSeq: 0,
        subCategoryName: this.categoryList[categoryIdx].categoryName
      }
      this.$emit('callNSMobileGetEspotData', 'sub')
    },
    /**
     * 활성 카테고리 가운데 정렬
     */
    centerCurrentCategory () {
      const wrapper = document.querySelector('#slotCategoryWrapper')

      if (!wrapper) {
        return
      }

      const widthOfWrapper = wrapper.clientWidth
      const centerOffset = widthOfWrapper / 2

      const categorySlides = document.getElementById('slotCategorySlideWrapper').childNodes

      if (!categorySlides) {
        return
      }

      const sumOfSlidesWidth = this.getSumOfSlidesWidth(categorySlides)

      const currentCategoryIndex = this.getCateogryIndexMatchWithPath()
      const currentCategory = categorySlides[currentCategoryIndex]
      const leftOffsetOfCurrentCategory = this.getSlideLeftOffset(categorySlides, currentCategoryIndex)

      const gapBetweenCenterAndLeft = centerOffset - leftOffsetOfCurrentCategory
      const revisedOffset = !isNull(currentCategory) ? gapBetweenCenterAndLeft - (currentCategory.clientWidth / 2) : 0

      const maxOffset = 0
      const minOffset = widthOfWrapper - sumOfSlidesWidth

      let translateX = 0
      if (revisedOffset > 0) {
        translateX = maxOffset
      } else if (revisedOffset < 0 && revisedOffset < minOffset) {
        translateX = minOffset
      } else {
        translateX = revisedOffset
      }

      this.slider.scrollTo(translateX, 0, 200)
    },
    /**
     * 전체 슬라이드 폭 구하기
     * @param {NodeList} slides 슬라이드 리스트
     * @returns {Number} 전체 슬라이드 폭
     */
    getSumOfSlidesWidth (slides) {
      return Array.prototype.reduce.call(slides, (prev, current) => {
        return prev + current.clientWidth + 1
      }, 0)
    },
    /**
     * 카테고리 index 반환
     *
     * @returns {number} 카테고리 index
     */
    getCateogryIndexMatchWithPath () {
      const currentPath = this.slotGlobalVal.subcateSeq

      let currentCategoryIndex = 0

      this.categoryList.forEach((category, index) => {
        if (category.seq === currentPath) {
          currentCategoryIndex = index
        }
      })

      return currentCategoryIndex
    },
    /**
     * 슬라이드 왼쪽 offset 구하기
     * @param {NodeList} slides 슬라이드 리스트
     * @param {Number} indexOfTargetSlide 타겟 슬라이드 인덱스
     * @returns {Number} 타겟 슬라이드의 왼쪽 offset
     */
    getSlideLeftOffset (slides, indexOfTargetSlide) {
      let leftOffset = 0

      slides.forEach((slide, index) => {
        if (index < indexOfTargetSlide) {
          leftOffset += slide.clientWidth
        }
      })

      return leftOffset
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/cate/Subcate";
</style>
