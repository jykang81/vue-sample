<template>
  <header class="app_header sub_page">
    <!-- 상품상세 헤더의 interaction 요구사항의 이유로 헤더 두 개를 사용 -->
    <div
      v-for="(header, index) in headerClass"
      :key="index"
      class="header"
      :class="headerClass[index]"
      :style="headerStyle[index]"
    >
      <button
        type="button"
        class="back_btn"
        @click="goBack"
      >
        뒤로가기
      </button>
      <div class="search_wrap">
        <div class="search_inner">
          <button
            type="button"
            class="search_input"
            @click="searchFullLayer"
          >
            검색
          </button>
        </div>
      </div>
      <div class="right_wrap">
        <button
          type="button"
          class="icons home"
          @click="gotoMain"
        >
          <span>홈</span>
        </button>
        <button
          type="button"
          class="icons cart cart_count"
          @click="gotoCartList"
        >
          <span>장바구니</span>
          <span v-show="cartIconCount" class="count">{{ cartIconCount }}</span>
        </button>
      </div>
    </div>
  </header>
</template>
<script>
import { mapState } from 'vuex'

import routerUtil from '@frameworks/routerUtil'
import bizUtil from '@utils/bizUtil'
import {
  isOsApp
} from '@utils/commonutil/commonUtil'
import nativeUtil from '@frameworks/nativeUtil'

export default {
  name: 'AppHeaderProduct',
  data () {
    return {
      headerNonOverStyle: {
        opacity: 1
      },
      headerOverStyle: {
        opacity: 0
      }
    }
  },
  computed: {
    ...mapState('cart', ['cartIconCount']),
    headerClass () {
      return [{
        non_over: true
      }, {
        over: true
      }]
    },
    headerStyle () {
      return [this.headerNonOverStyle, this.headerOverStyle]
    }
  },
  created () {
    // 우상단 장바구니 아이콘 수량 세팅
    bizUtil.getCartCount()

    window.addEventListener('scroll', this.updateScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.updateScroll)
  },
  mounted () {
    if (isOsApp()) { // APP
      nativeUtil.setBackBtnYn('Y')
    }
  },
  methods: {
    /**
     * 검색 레이어 호출.
     * @param {void}
     * @returns {void}
     */
    searchFullLayer () {
      bizUtil.openSearchLayer()
    },
    /**
     * 장바구니 이동.
     * @param {void}
     * @returns {void}
     */
    gotoCartList () {
      this.$router.push({ name: 'cartList' })
    },
    /**
     * 상품상세 상단 헤더 interaction (스크롤 업/다운 시 투명도 조절)
     *
     */
    updateScroll () {
      if (window.pageYOffset > 0) {
        const range = 250
        let background = window.pageYOffset / range
        if (background > 1) {
          background = 1
        }
        this.headerNonOverStyle.opacity = 0
        this.headerOverStyle.display = 'flex'
        this.headerOverStyle.opacity = background
      } else if (window.pageYOffset === 0) {
        this.headerNonOverStyle.opacity = 1
        this.headerOverStyle.display = 'none'
        this.headerOverStyle.opacity = 0
      }
    },
    /**
     * 메인으로 이동
     *
     */
    gotoMain () {
      bizUtil.gotoMain()
    },
    /**
     * 이전 페이지로 이동
     *
     */
    goBack () {
      if (isOsApp() && this.$route.params.backflag === 'home') { // native 이면
        nativeUtil.closeWebView()
      } else {
        routerUtil.back()
      }
    }
  }
}
</script>
