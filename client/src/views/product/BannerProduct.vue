<template>
  <section v-if="headCopyList" class="banner_product">
    <div v-for="(headCopy,index) in (headCopyList) "
         :key="headCopy"
         class="banner_product_wrap"
         @click="bannerClickLogging(index)"
         v-html="headCopy"
    />
  </section>
</template>

<script>
import {
  htmlDecode,
  isOsApp
} from '@utils/commonutil/commonUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import loginUtil from '@/common/utils/loginUtil'
import $store from '@/vuex'
import router from '@/router'

export default {
  props: {
    globalVal: {
      type: Object,
      required: true
    }
  },
  computed: {
    /**
     * 헤드카피
     * @returns {Array|null}
     */
    headCopyList () {
      const returnHeadCopyList = []
      if (this.globalVal.productInfo?.headCopyList) {
        for (const item of this.globalVal.productInfo.headCopyList) {
          if (item.dispgb === '0') {
            returnHeadCopyList.push(htmlDecode(item.headCopyDesc.replace(/&lt;P&gt;&amp;nbsp;&lt;\/P&gt;/gi, '')))
          }
        }
      }
      return returnHeadCopyList?.length > 0 ? returnHeadCopyList : null
    }
  },
  updated () {
    if (this.headCopyList) {
      const targetList = document.querySelectorAll('.banner_product_wrap a')
      for (const targetElement of targetList) {
        targetElement.classList.add('link_more')
      }
    }
  },
  mounted () {
    const targetList = document.querySelectorAll('.banner_product_wrap img')
    for (const targetElement of targetList) {
      targetElement.style.width = '100%'
    }
  },
  methods: {
    /**
     * 배너 클릭 시
     */
    bannerClickLogging (index) {
      // 로그인 안됐을경우 로그인 후 이동할 페이지 저장
      if (isOsApp() && !loginUtil.isLoggedIn()) {
        $store.commit('login/setReturnRoute', router.currentRoute)
      }
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction: '베너',
          eventLabel: `${this.globalVal.productInfo.headCopyList[index].headName}_${this.globalVal.productInfo.productName}`,
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
  @import "~@/assets/styles/views/product/BannerProduct";
</style>
