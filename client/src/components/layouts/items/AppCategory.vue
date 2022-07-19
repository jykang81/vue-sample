<template>
  <div id="wrapper" class="app_category">
    <div id="scroller" class="category_container">
      <ul class="category_wrapper">
        <li
          v-for="(category, index) in categories" :key="index"
          class="category_slide"
          :class="category.gnbClassNew"
        >
          <button
            class="cat"
            :class="currentCategoryIndex === index ? 'current' : ''"
            @click="categoryClickLogging(category.displayName, category.path)"
          >
            {{ category.displayName }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import IScroll from 'iscroll'
import {
  isNull
} from '@utils/commonutil/commonUtil'
import { mapMutations } from 'vuex'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import htmlDecode from '@/common/utils/commonutil/htmlDecode'
import CONST from '@/common/constants/framework/framework'
import appCategoryService from '@services/layouts/items/appCategoryService'

export default {
  name: 'AppCategory',
  data () {
    return {
      categories: [],
      slider: null,
      currentCategoryIndex: -1,
      plCategoryInfo: false
    }
  },
  watch: {
    '$route' (to) {
      this.currentCategoryIndex = this.getCateogryIndexMatchWithPath()
      this.centerCurrentCategory() // category slide 정렬
    }
  },
  async mounted () {
    await this.callGnbInfomation()

    this.slider = new IScroll('#wrapper', {
      scrollX: true,
      scrollY: false,
      disablePointer: true, // mobile 스크롤 버그 대응
      disableMouse: false, // pc 환경 스크롤 허용
      disableTouch: false // mobile 환경 스크롤 허용
    })

    this.currentCategoryIndex = this.getCateogryIndexMatchWithPath()
    this.centerCurrentCategory()
  },
  methods: {
    ...mapMutations(
      'layouts', ['setGnbApiFlag']
    ),
    ...mapMutations(
      'home', ['setDisplayName']
    ),
    /**
     * 매장명클릭
     * @param {String} displayName 카테고리명
     * @param {String} path 카테고리 클릭 URL
     * @returns {void}
     */
    categoryClickLogging (displayName, path) {
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_공통영역',
          eventAction: '매장이동',
          eventLabel: displayName,
          params: {
            t1: null
          }
        }
      })
      if (!isNull(path) && path.startsWith('/store/slot/')) {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_PAGE,
          data: {
            category: '',
            initFlag: true,
            subparams: {
              t1: 'GNB',
              t2: displayName,
              t3: '',
              t4: ''
            }
          }
        })
      }
      // Airbridge
      if (displayName === '홈') {
        marketingUtil.airbridgeLogger.send({
          event: marketingUtil.airbridgeLogger.EVENT.HOME_VIEW, // 홈 화면 조회
          data: {
            action: '홈 클릭',
            label: '홈화면조회'
          }
        })
      }
      this.makeRouteWithPath(displayName, path)
    },
    /**
     * 현재 주소에 따른 카테고리 index 반환
     *
     * @returns {number} 카테고리 index
     */
    getCateogryIndexMatchWithPath () {
      const currentPath = this.$route.path

      let currentCategoryIndex = -1

      this.categories.forEach((category, index) => {
        if (currentPath.includes(category.path)) {
          currentCategoryIndex = index
        }
      })

      return currentCategoryIndex
    },
    /**
     * GNB 정보 조회
     * @returns {Promise}
     */
    async callGnbInfomation () {
      const plData = await appCategoryService.setPLCategoryInfo()
      const plDataMsg = !isNull(plData) && !isNull(plData.msg) ? plData.msg : false
      const plDataArray = []
      if (plDataMsg) {
        plDataMsg.forEach(element => {
          plDataArray.push(element.categoryId)
        })
      }
      this.plCategoryInfo = plDataArray.length ? plDataArray : false
      const apiData = await appCategoryService.fetchGNBInfomation()

      if (!isNull(apiData)) {
        this.categories = []
      }
      if (isNull(apiData) || isNull(apiData.msg) || isNull(apiData.msg._EZ_GNB)) {
        return false
      }
      const devUrl = CONST.MOBILE_HOST
      const bkUrl = CONST.MOBILE_HOST
      const gnbList = []

      apiData.msg._EZ_GNB.forEach((element, index) => {
        const devChecker = element.mdUrl.toString().indexOf(devUrl) > -1
        const bkChecker = element.mdUrl.toString().indexOf(bkUrl) > -1
        let splitString = ''

        if (devChecker) {
          splitString = devUrl
        } else if (bkChecker) {
          splitString = bkUrl
        }

        const gnbFullString = htmlDecode(element.espotContentText)
        const gnbNewChecker = gnbFullString.indexOf('|') > -1
        const gnbName = gnbNewChecker ? gnbFullString.split('|')[0] : gnbFullString
        const gnbClassNew = gnbNewChecker ? gnbFullString.split('|')[1] : ''

        if (this.categoryIdValidator(element.espotContentText, element.mdUrl)) {
          gnbList.push({
            path: (splitString !== '') ? element.mdUrl.toString().split(splitString)[1] : element.mdUrl,
            displayName: gnbName,
            gnbClassNew
          })
        }
      })

      this.categories = gnbList
      this.setGnbApiFlag(true)
    },
    /**
     * 활성 카테고리 가운데 정렬
     */
    centerCurrentCategory () {
      const wrapper = document.querySelector('#wrapper')

      if (!wrapper) {
        return
      }

      const widthOfWrapper = wrapper.clientWidth
      const centerOffset = widthOfWrapper / 2

      const categorySlides = document.querySelectorAll('.category_slide')

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
    },
    /**
     * 전체 슬라이드 폭 구하기
     * @param {NodeList} slides 슬라이드 리스트
     * @returns {Number} 전체 슬라이드 폭
     */
    getSumOfSlidesWidth (slides) {
      return Array.prototype.reduce.call(slides, (prev, current) => {
        return prev + current.clientWidth
      }, 0)
    },
    /**
     * @param {String} displayName - GNB 매장의 매장명.
     * @param {String} path - GNB 매장 url
     */
    makeRouteWithPath (displayName, path) {
      this.setDisplayName(displayName)
      const target = 'slot/'
      if (path.includes(target)) {
        const categoryId = path.substring(path.indexOf(target) + target.length)
        this.$router.push({
          name: 'slotStore',
          params: {
            categoryId,
            displayName
          }
        })
      } else {
        this.$router.push(path)
      }
    },
    /**
     * 카테고리 id 유효성 검사 - 슬롯 매장일 경우, mc에서 입력한 매장코드와 api상의 매장코드가 일치하는게 있는지 검사)
     * @param {String} espotContentText - displayName
     * @param {String} mdUrl - path
     * @returns {bool}
     */
    categoryIdValidator (espotContentText, mdUrl) {
      if (isNull(espotContentText) || isNull(mdUrl)) { return false }

      const splitFilter = '/store/slot/'
      if (!isNull(this.plCategoryInfo) && this.plCategoryInfo.length && mdUrl.indexOf(splitFilter) > -1) { // 슬롯매장일 경우,
        const categoryId = mdUrl.split(splitFilter)[1]
        const checker = this.plCategoryInfo.includes(categoryId)
        return checker
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/layouts/items/AppCategory";
</style>
