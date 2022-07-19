<template>
  <header class="app_header sub_page">
    <div class="header">
      <button
        type="button"
        class="back_btn"
        @click="goBack"
      >
        뒤로가기
      </button>
      <h1 class="sub_title" :class="titleAlign" @click="refreshLnbCategory">
        {{ htmlDecode(title) }}
      </h1>
      <div v-if="isShowSearch" class="search_wrap">
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
      <div v-if="isShowCart" class="right_wrap">
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
import bizUtil from '@utils/bizUtil'
import popupUtil from '@frameworks/popupUtil'
import routerUtil from '@frameworks/routerUtil'
import {
  htmlDecode,
  isOsApp
} from '@utils/commonutil/commonUtil'
import nativeUtil from '@frameworks/nativeUtil'

export default {
  name: 'AppHeaderDefault',
  props: {
    // fullLayerPopup 용도
    popupObj: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      titleAlign: '',
      isShowSearch: true,
      isShowCart: true
    }
  },
  computed: {
    ...mapState('cart', ['cartIconCount']),
    ...mapState('appHeaderDefault', ['pageTitle']),
    isPopupHeader () {
      return this.popupObj !== null
    },
    title () {
      return this.isPopupHeader ? this.popupObj.param.title || this.pageTitle : this.pageTitle
    }
  },
  watch: {
    // 동일 컴포넌트 인스턴스가 재사용될 때 라이프 사이클 훅이 호출되지 않아서, 라우터 이동을 감지하기 위해 사용
    '$route' (to, from) {
      if (to?.meta?.title) {
        this.$store.commit('appHeaderDefault/setPageTitle', to.meta.title) // 헤더 타이틀 업데이트
      }
    }
  },
  created () {
    this.setCartCount()

    if (this.$route?.meta?.title) {
      this.$store.commit('appHeaderDefault/setPageTitle', this.$route.meta.title) // 헤더 타이틀 업데이트
    }

    this.initPopupHeader()
  },
  mounted () {
    if (isOsApp()) { // APP
      nativeUtil.setBackBtnYn('Y')
    }
  },
  methods: {
    htmlDecode,
    /**
     * 장바구니 이동.
     * @param {void}
     * @returns {void}
     */
    gotoCartList () {
      this.$router.push({ name: 'cartList' })
    },
    /**
     * title align 설정
     */
    setTitleAlign () {
      if (this.popupObj && this.popupObj.param.titleAlign) {
        this.titleAlign = this.popupObj.param.titleAlign
      }
    },
    /**
     * full layer popup title 설정
     */
    setFullLayerPopupTitle () {
      if (this.popupObj && this.popupObj.param.title) {
        this.$store.commit('appHeaderDefault/setPageTitle', this.popupObj.param.title)
      }
    },
    /**
     * 검색메뉴 보임/안보임
     */
    setIsShowSearch () {
      if (this.popupObj && this.popupObj.param.isShowSearch !== undefined) {
        this.isShowSearch = this.popupObj.param.isShowSearch
      }
    },
    /**
     * 장바구니메뉴 보임/안보임
     */
    setIsShowCart () {
      if (this.popupObj && this.popupObj.param.isShowCart !== undefined) {
        this.isShowCart = this.popupObj.param.isShowCart
      }
    },
    /**
     * Back
     */
    goBack () {
      // 결제창에서 뒤로가기 시 팝업 결제창 닫음
      if (this.hasCert() && this.areInOrderPage()) {
        popupUtil.closeAll()
      } else {
        if (isOsApp() && (this.$route.name === 'mypageMain' || this.$route.name === 'orderComplete')) {
          nativeUtil.closeWebView()
        } else if (isOsApp() && this.$route.params.backflag === 'home') {
          nativeUtil.goHome()
        } else {
          routerUtil.back()
        }
      }
    },
    /**
     * 검색 레이어 호출.
     * @param {void}
     * @returns {void}
     */
    searchFullLayer () {
      bizUtil.openSearchLayer()
    },
    /**
     * 주문 Cert 뷰 존재 여부
     * @returns {Boolean}
     */
    hasCert () {
      const certView = document.querySelector('#certView')
      return Boolean(certView)
    },
    /**
     * 현재 페이지가 주문 페이지인지 확인
     * @returns {Boolean}
     */
    areInOrderPage () {
      return location.pathname === '/order/sheet'
    },
    /**
     * 현재 페이지가 카테고리 매장이면, 타이틀 클릭이벤트 설정.
     */
    refreshLnbCategory () {
      const nowPath = location.pathname
      if (nowPath.indexOf('/store/cate/') > -1) {
        window.location.reload()
      }
    },
    /**
     * 팝업용 헤더 설정
     */
    initPopupHeader () {
      this.setTitleAlign()
      this.setIsShowSearch()
      this.setIsShowCart()
    },
    /**
     * 장바구니 수량 설정
     */
    setCartCount () {
      // 장바구니 미표시 header 제외
      if (this.isPopupHeader && !this.popupObj.isShowCart) {
        return
      }

      bizUtil.getCartCount()
    }
  }
}
</script>
