<template>
  <!-- 테마매장 타이틀 슬라이드형 슬롯 -->
  <section v-if="categoryList.length > 1" :id="espotName">
    <div id="slotThemaCategoryWrapper" :class="isClassName">
      <div id="slotThemaCategoryScroller" class="category_container">
        <ul id="slotThemaCategorySlideWrapper" class="category_wrapper">
          <li
            v-for="(category, categoryIdx) in categoryList"
            :key="categoryIdx"
            class="category_slide"
            :class="[slotGlobalVal.clickThemaSeq[getId] === category.seq ? 'current' : '']"
          >
            <button type="button" class="cat" @click="clickClassActive(categoryIdx)">
              {{ htmlDecode(category.categoryName) }}
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div id="slotThemaCategoryWrapper" :class="isClassName2">
      <div id="slotThemaCategoryScroller" class="category_container">
        <ul id="slotThemaCategorySlideWrapper" class="category_wrapper">
          <li
            v-for="(category, categoryIdx) in categoryList"
            :key="categoryIdx"
            class="category_slide"
            :class="[slotGlobalVal.clickThemaSeq[getId] === category.seq ? 'current' : '']"
          >
            <button type="button" class="cat" @click="clickClassActive(categoryIdx)">
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
      slider: null,
      categoryList: [],
      isClassName: '',
      isClassName2: '',
      categorySmallBottom: 0
    }
  },
  computed: {
    getId () {
      let result = ''
      if (this.$el.parentNode !== null) {
        result = this.$el.parentNode.id
      }
      return result
    }
  },
  mounted () {
    // 스크롤시 상단고정 테마매장 노출
    window.addEventListener('scroll', () => {
      this.scrollTop = document.querySelector('html').scrollTop
      if (!isNull(document.querySelector(`.thema_cate_slide_${this.getId}`))) {
        this.categorySmallBottom = window.pageYOffset + document.querySelector(`.thema_cate_slide_${this.getId}`).getBoundingClientRect().bottom - 96
      }

      if (!isNull(document.querySelector(`.thema_cate_slide_${this.getId}2`))) {
        if (this.scrollTop < this.categorySmallBottom) {
          document.querySelector(`.thema_cate_slide_${this.getId}2`).classList.add('hide')
        } else {
          document.querySelector(`.thema_cate_slide_${this.getId}2`).classList.remove('hide')
        }
      }
    })

    this.espotDraw()

    this.$nextTick(() => {
      this.slider = new IScroll('#slotThemaCategoryWrapper', {
        scrollX: true,
        scrollY: false,
        disablePointer: true, // mobile 스크롤 버그 대응
        disableMouse: false, // pc 환경 스크롤 허용
        disableTouch: false // mobile 환경 스크롤 허용
      })

      this.centerCurrentCategory()
    })
  },
  updated () {
    this.scrollTop = document.querySelector('html').scrollTop
    if (!isNull(document.querySelector(`.thema_cate_slide_${this.getId}`))) {
      this.categorySmallBottom = window.pageYOffset + document.querySelector(`.thema_cate_slide_${this.getId}`).getBoundingClientRect().bottom - 96
    }
  },
  methods: {
    htmlDecode,
    /**
     * espot 그리기
     */
    espotDraw () {
      this.categoryList = this.espotData[this.getId]

      this.isClassName = `thema_cate_slide thema_cate_slide_${this.getId}`
      this.isClassName2 = `thema_cate_slide thema_cate_slide_${this.getId}2 fixed hide`

      if (isNull(this.slotGlobalVal.themaCategoryId)) {
        this.slotGlobalVal.themaCategoryId = this.slotGlobalVal.subCategoryId === 'N' ? '' : this.slotGlobalVal.subCategoryId
      } else {
        this.slotGlobalVal.themaCategoryId = this.slotGlobalVal.continueEspotId.split('_')[0]
      }
    },
    /**
     * 메뉴 클릭 시
     * @param {Number} categoryIdx
     */
    clickClassActive (categoryIdx) {
      this.slotGlobalVal.listPageIdx = 1
      this.updateActiveSubcategory(categoryIdx)
      this.replaceSlot(categoryIdx)

      setTimeout(() => {
        const categorySmallTop = document.querySelector(`.thema_cate_slide_${this.getId}`).getBoundingClientRect().top
        const headerHeight = isNull(document.querySelector('.app_category')) ? document.querySelector('.app_header').getBoundingClientRect().height : document.querySelector('.app_category').getBoundingClientRect().height
        window.scrollTo(0, Math.round(window.pageYOffset + categorySmallTop - headerHeight))

        setTimeout(() => {
          let hideFlg = false
          for (let i = 0; i < document.querySelector('#app').classList.length; i++) {
            if (document.querySelector('#app').classList[i] === 'hide') {
              hideFlg = true
            }
          }

          if (!hideFlg) {
            document.querySelector('#app').classList.add('hide')
          }
        }, 10)

        setTimeout(() => {
          const categoryBoxAll = document.querySelectorAll('.category_box')
          for (let i = 0; i < categoryBoxAll.length; i++) {
            if (categoryBoxAll[i].classList.value.indexOf('hide') === -1) {
              const sectionName = categoryBoxAll[i].classList.value.substr(categoryBoxAll[i].classList.value.indexOf('SLOT'), categoryBoxAll[i].classList.value.length)
              document.querySelector(`.category_box_${sectionName}`).classList.value = `category_box category_box_${sectionName} hide`
            }
          }

          const themaCateSlideAll = document.querySelectorAll('.thema_cate_slide')
          for (let i = 0; i < themaCateSlideAll.length; i++) {
            if (themaCateSlideAll[i].classList.value.indexOf('hide') === -1) {
              const sectionName = themaCateSlideAll[i].classList.value.substr(themaCateSlideAll[i].classList.value.indexOf('SLOT'), themaCateSlideAll[i].classList.value.length)
              document.querySelector(`.thema_cate_slide_${sectionName}2`).classList.value = `thema_cate_slide thema_cate_slide_${sectionName}2 fixed hide`
            }
          }
        }, 500)
      }, 500)
    },
    /**
     * 클릭seq 변경
     * @param {Number} categoryIdx
     */
    updateActiveSubcategory (categoryIdx) {
      this.slotGlobalVal.clickThemaSeq[this.getId] = this.categoryList[categoryIdx].seq
      this.slotGlobalVal.clickThemaCategoryNm[this.getId] = this.categoryList[categoryIdx].categoryName

      this.$forceUpdate()
    },
    /**
     * callNSMobileGetEspotData 부모함수 호출
     * @param {Number} categoryIdx
     */
    replaceSlot (categoryIdx) {
      this.slotGlobalVal.param = {
        categoryDiv: 'themaSlide',
        clickSlotId: this.getId,
        catalogId: this.categoryList[categoryIdx].catalogId,
        categoryId: this.categoryList[categoryIdx].categoryId,
        categoryLevel: this.categoryList[categoryIdx].categoryLevel,
        categoryName: this.categoryList[categoryIdx].categoryName,
        espotId: this.categoryList[categoryIdx].espotId,
        imgUrl: this.categoryList[categoryIdx].imgUrl,
        subSeq: this.slotGlobalVal.subcateSeq,
        themaSeq: this.categoryList[categoryIdx].seq,
        subCategoryName: this.slotGlobalVal.subcateName
      }
      this.$emit('callNSMobileGetEspotData', 'thema', this.getId)
    },
    /**
     * 활성 카테고리 가운데 정렬
     */
    centerCurrentCategory () {
      const wrapper = document.querySelector('#slotThemaCategoryWrapper')

      if (!wrapper) {
        return
      }

      const widthOfWrapper = wrapper.clientWidth
      const centerOffset = widthOfWrapper / 2

      const categorySlides = document.getElementById('slotThemaCategorySlideWrapper').childNodes

      if (!categorySlides) {
        return
      }

      const sumOfSlidesWidth = this.getSumOfSlidesWidth(categorySlides)

      const currentCategoryIndex = this.getCateogryIndexMatchWithPath()
      const currentCategory = categorySlides[currentCategoryIndex]
      const leftOffsetOfCurrentCategory = this.getSlideLeftOffset(categorySlides, currentCategoryIndex)

      const gapBetweenCenterAndLeft = centerOffset - leftOffsetOfCurrentCategory

      const revisedOffset = !isNull(currentCategory)
        ? gapBetweenCenterAndLeft - (currentCategory.clientWidth / 2)
        : 0

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
      const currentPath = this.slotGlobalVal.clickThemaSeq[this.getId]

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
          const style = slide.currentStyle || window.getComputedStyle(slide)
          const marginRgihtOfSlide = Number(style.marginRight.replace('px', ''))
          leftOffset += slide.clientWidth + marginRgihtOfSlide
        }
      })

      let leftPaddingOfWrapper = 0
      const slideWrapper = document.querySelector('#slotThemaCategorySlideWrapper')
      if (slideWrapper) {
        const styleOfSlideWrapper = window.getComputedStyle(slideWrapper) || slideWrapper.currentStyle
        leftPaddingOfWrapper = Number(styleOfSlideWrapper.paddingLeft.replace('px', ''))
      }

      leftOffset += leftPaddingOfWrapper

      return leftOffset
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/cate/ThemaCateSlide";
</style>
