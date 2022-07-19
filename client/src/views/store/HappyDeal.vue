<template>
  <div class="happy_deal" :class="isNative?'native_padding':''">
    <section class="sub_categories icon" name="_EZ_HAPPYDEAL_CATE">
      <swiper
        ref="happydealCategories"
        :options="happydealCategories"
        :class="isNative?'native_top':''"
      >
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          class="swiper-slide"
          :class="getCategoryCssClass(tab.class, tab.routeTo)"
          @click="categoryClickWithLogging(tab.routeTo, tab.title)"
        >
          <a>
            {{ getCutBytes(tab.title, 9) }}
          </a>
        </div>
      </swiper>
    </section>
    <happy-deal-today v-if="isApiCalled && currentTab === 'today'" />
    <happy-deal-week v-if="isApiCalled && currentTab === 'week'" />
    <happy-deal-category
      v-if="isApiCalled && currentTab !== 'today' && currentTab !== 'week'"
      :category-id="currentTab"
      :clksrc="`해피딜_${tabs[currentTabIndex].title}_상품목록`"
    />
  </div>
</template>

<script>
import {
  isOsApp,
  getCutBytes
} from '@utils/commonutil/commonUtil'
import HappyDealToday from '@/views/store/HappyDealToday'
import HappyDealWeek from '@/views/store/HappyDealWeek'
import HappyDealCategory from '@/views/store/HappyDealCategory'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import happydealService from '@services/store/happyDealService'

export default {
  name: 'HappyDeal',
  components: {
    HappyDealToday,
    HappyDealWeek,
    HappyDealCategory
  },
  data () {
    return {
      currentTab: '', // 현재 탭 컨텐츠 ID
      happydealCategories: { // swiper 설정
        slidesPerView: 'auto' // 동시에 보여줄 슬라이드 갯수
      },
      tabs: [], // 해피딜 카테고리
      isApiCalled: false, // API 호출 완료 여부
      isNative: false, // WEB / APP 여부
      firstTab: null // 첫번째 카테고리 탭
    }
  },
  computed: {
    swiperHappydealCategories () {
      return this.$refs.happydealCategories.$swiper
    },
    currentTabIndex () {
      let index = this.tabs.findIndex(tab => tab.category === this.currentTab)
      if (index === -1) {
        index = 0
      }
      return index
    }
  },
  watch: {
    // 동일 컴포넌트 인스턴스가 재사용될 때 라이프 사이클 훅이 호출되지 않아서, 라우터 이동을 감지하기 위해 사용
    '$route' (to, from) {
      if (to.name === 'happyDeal') {
        this.setCurrentTab()
      }
    }
  },
  created () {
    // 마케팅 스크립트 적용 부분
    // Airbridge
    marketingUtil.airbridgeLogger.send({
      event: marketingUtil.airbridgeLogger.EVENT.ITEM_SHOP, // 편성매장 - 해피딜
      data: {
        action: '편집매장',
        label: '편집매장 조회',
        categoryNm: 'happydeal'
      }
    })
    // 편집하위 매장 - 해피딜인 경우 '오늘특가'가 default
    marketingUtil.airbridgeLogger.send({
      event: marketingUtil.airbridgeLogger.EVENT.ITEM_SHOP, // 편성매장 - 해피딜
      data: {
        action: '편집매장 > 하위매장',
        label: '편집매장 조회',
        categoryNm: '오늘특가'
      }
    })

    if (isOsApp()) {
      this.isNative = true
    }
    this.getCategory().then(() => {
      this.setCurrentTab()
    })
  },
  activated () {
    this.initCategoryUi()
  },
  updated () {
    this.initCategoryUi()
  },
  methods: {
    getCutBytes,
    /**
     * 카테고리 영역 CSS 클래스 반환
     * @param {String} tabClass Tab의 아이콘 클래스명
     * @param {String} routeTo Tab으로 이동할 라우트명
     */
    getCategoryCssClass (tabClass, routeTo) {
      const currentRoute = this.$route.fullPath
      const isEnteredThroughGNB = !currentRoute.includes('category')
      const routeToCategory = routeTo.split('category=')[1]
      let activeClass = currentRoute === routeTo ? 'active' : ''
      if (isEnteredThroughGNB && routeToCategory && this.firstTab === routeToCategory) {
        activeClass = 'active'
      }
      return `${tabClass} ${activeClass}`
    },
    /**
     * 카테고리 탭 클릭
     * @param {String} routeTo 이동할 라우트명
     * @param {String} title 카테고리명
     */
    categoryClickWithLogging (routeTo, title) {
      const currentRoute = this.$route.fullPath
      // 카테고리 메뉴 영역 이동하지 않고 같은 메뉴 재선택할 경우 스크롤 상단으로 이동
      if (currentRoute === routeTo) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      } else {
        this.$router.push(routeTo)
      }
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_해피딜',
          eventAction: '카테고리영역',
          eventLabel: title,
          params: {
            t1: null
          }
        }
      })
      // Airbridge
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.ITEM_SHOP, // 편성매장 - 해피딜
        data: {
          action: '편집매장 > 하위매장',
          label: '편집매장 조회',
          categoryNm: title
        }
      })
    },
    /**
     * 현재 탭 설정
     *
     */
    setCurrentTab () {
      this.currentTab = this.$route.query.category || this.firstTab // 'today'인 경우는 오늘특가
    },
    /**
     * 해피딜 카테고리 조회
     *
     * @returns {Promise} promise
     */
    getCategory () {
      const successHandling = response => {
        this.isApiCalled = true
        const categories = response.msg.espotList[0]._EZ_HAPPYDEAL_CATE
        const firstTabClickCode = categories[0].clickCode
        this.firstTab = firstTabClickCode || categories[0].marketingText.split('|')[0]
        this.tabs = categories.map(tab => {
          const splited = tab.marketingText.split('|')
          const clickCode = tab.clickCode
          let category = ''
          let routeTo = ''

          // 매장운영툴의 URL 설정 방식에 따라 아래 부분의 코드가 바뀌어야 함
          if (clickCode) {
            category = clickCode
            routeTo = `${this.$route.path}?category=${clickCode}`
          } else {
            category = splited[0]
            routeTo = tab.mdUrl
          }

          return {
            class: splited[0],
            title: splited[1],
            category,
            routeTo
          }
        })
      }

      const param = {
        espotInfo: 'EZ_HAPPYDEAL_CATE|ESPOT_CNTNT|1|9999|0'
      }

      return happydealService.getCategory(param, successHandling)
    },
    /**
     * 카테고리 UI 초기화
     *
     */
    initCategoryUi () {
      // 활성화 탭 가운데 정렬
      this.swiperHappydealCategories.slideTo(this.currentTabIndex - 2, 100)

      // 카테고리 아이콘 노출
      this.$root.$el.classList.remove('hide')
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/store/HappyDeal";
</style>
