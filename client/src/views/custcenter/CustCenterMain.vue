<template>
  <div class="cust_center_main">
    <div class="tabs">
      <router-link
        v-for="(category, index) in categories"
        :key="index"
        tag="a"
        :to="category.path"
        class="tab"
        :class="($route.path === category.path || $route.path === category.path + '/') ? 'active' : ''"
        replace
        @click.native="categoryPathLogging(category.displayName)"
      >
        <span>
          {{ category.displayName }}
        </span>
      </router-link>
    </div>
    <div class="tab_content">
      <cust-center-home v-if="$route.name === 'custCenterMain'" />
      <cust-center-faq v-if="$route.name === 'custCenterFaq'" />
      <cust-center-board-inquiry v-if="$route.name === 'custCenterBoardInquiry'" />
      <cust-center-notice v-if="$route.name === 'custCenterNotice'" />
    </div>
  </div>
</template>

<script>
import custCenterHome from '@/views/custcenter/CustCenterHome'
import custCenterFaq from '@/views/custcenter/CustCenterFaq'
import custCenterBoardInquiry from '@/views/custcenter/CustCenterBoardInquiry'
import custCenterNotice from '@/views/custcenter/CustCenterNotice'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  components: {
    custCenterHome,
    custCenterFaq,
    custCenterBoardInquiry,
    custCenterNotice
  },
  data () {
    return {
      categories: [
        {
          path: '/custcenter',
          displayName: '홈'
        },
        {
          path: '/custcenter/faq',
          displayName: 'FAQ'
        },
        {
          path: '/custcenter/board-inquiry/history',
          displayName: '문의내역'
        },
        {
          path: '/custcenter/notice',
          displayName: '공지사항'
        }
      ]
    }
  },
  methods: {
    /**
     * 카테고리명 클릭
     */
    categoryPathLogging (category) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_고객센터',
          eventAction: 'Tab_메뉴',
          eventLabel: category,
          params: {
            t1: null
          }
        }
      })
    }
  }

}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/custcenter/CustCenterMain";
</style>
