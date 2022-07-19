<template>
  <div :class="wrapClass">
    <component :is="appHeaderMain" v-if="layoutConfig.appHeaderMain" type="main" />
    <app-header-default v-if="layoutConfig.appHeaderDefault" />
    <component :is="appHeaderProduct" v-if="layoutConfig.appHeaderProduct" type="product" />
    <component :is="appHeaderSub" v-if="layoutConfig.appHeaderSub" type="sub" />
    <component :is="appSearchHeader" v-if="layoutConfig.appSearchHeader" type="search" />
    <component :is="appCategory" v-if="layoutConfig.appCategory" />
    <div class="app_container" :class="containerClass">
      <keep-alive :include="keepAliveComponents.join(',')">
        <router-view />
      </keep-alive>
    </div>
    <component :is="appFooter" v-if="layoutConfig.appFooter" :class="footerClass" />
    <component :is="appBottomNavi" v-if="layoutConfig.appBottomNavi" />
    <component :is="appTopButton" v-if="!hideTopButton" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import {
  isOsApp,
  isNull
} from '@utils/commonutil/commonUtil'
import CONST from '@constants/framework/framework'
import externalUtil from '@utils/externalUtil'
// import nativeUtil from '@/common/frameworks/nativeUtil'
import AppHeaderDefault from '@components/layouts/items/AppHeaderMain'
// import AppHeaderDefault from '@components/layouts/items/AppHeaderDefault'

export default {
  name: 'BaseLayout',
  components: {
    AppHeaderDefault // AppHeaderDefault 컴포넌트에 헤더 타이틀을 비동기로 설정하는 경우가 있어서 비동기 컴포넌트 사용하지 않음
  },
  data () {
    return {
      layoutName: '', // 레이아웃 이름
      keepAliveComponents: [ // keep-alive 적용 컴포넌트 (각 컴포넌트에 name 속성 정의 필요)
        'StoreHome',
        'SearchResult',
        'HappyDeal',
        'IdFindCertification',
        'IdFindComplete',
        'IdFindEmail',
        'IdFindPhone',
        'PasswordFind',
        'PasswordChange',
        'ThingliveMain',
        'ParticipationWinner',
        'ParticipationWinnerSearch',
        'LnbCategory',
        'MemberShipVipLounge',
        'MemberComplete',
        'MemberAgreeMarketing'
      ],
      appHeaderMain: '',
      appHeaderProduct: '',
      appHeaderSub: '',
      appSearchHeader: '',
      appCategory: '',
      appFooter: '',
      appBottomNavi: '',
      appTopButton: () => import(/* webpackChunkName: "AppTopButton" */ '@components/layouts/items/AppTopButton'),
      containerClass: ''
    }
  },
  computed: {
    ...mapState('layouts', ['bottomNavi']),

    /**
     * 레이아웃 구성
     *
     * @return {object} 레이아웃 구성
     */
    layoutConfig () {
      const layout = {
        appHeaderMain: false,
        appHeaderDefault: false,
        appHeaderProduct: false,
        appHeaderSub: false,
        appSearchHeader: false,
        appCategory: false,
        appFooter: false,
        appBottomNavi: false
      }
      switch (this.layoutName) {
        case 'LayoutEmpty' :
          break
        case 'LayoutBottomNavi' :
          layout.appBottomNavi = true
          break
        case 'LayoutSearchLnb' :
          layout.appSearchHeader = true
          layout.appBottomNavi = true
          break
        case 'LayoutSearchResult' :
          layout.appSearchHeader = true
          layout.appFooter = true
          layout.appBottomNavi = true
          break
        case 'LayoutPageNonFooter' :
          layout.appHeaderSub = true
          break
        case 'LayoutPage' :
          layout.appHeaderSub = true
          layout.appFooter = true
          break
        case 'LayoutPageLnb' :
          layout.appHeaderSub = true
          layout.appFooter = true
          layout.appBottomNavi = true
          break
        case 'LayoutProduct' :
          layout.appHeaderProduct = true
          layout.appFooter = true
          break
        case 'LayoutHeaderDefault' :
          layout.appHeaderDefault = true
          break
        case 'LayoutLnbNonFooter' :
          layout.appHeaderDefault = true
          layout.appBottomNavi = true
          break
        case 'LayoutLnb' :
          layout.appHeaderDefault = true
          layout.appFooter = true
          layout.appBottomNavi = true
          break
        case 'LayoutDefault' :
          layout.appHeaderMain = true
          layout.appCategory = true
          layout.appFooter = true
          layout.appBottomNavi = true
          break
        default :
      }

      if (isOsApp()) {
        // appBottomNavi 노출 여부를 Vuex Store 에 저장함
        this.$store.commit('layouts/toggleBottomNavi', false)
      } else {
        // appBottomNavi 노출 여부를 Vuex Store 에 저장함
        this.$store.commit('layouts/toggleBottomNavi', layout.appBottomNavi)
      }

      return layout
    },
    /**
     * wrapper DIV class
     *
     * @return {object} wrapper DIV class
     */
    wrapClass () {
      return {
        wrap: !isOsApp() // Web일때만 wrap class 설정
      }
    },
    /**
     * footer class
     *
     * @return {object} footer class
     */
    footerClass () {
      return {
        bottom_height: this.layoutName === 'LayoutProduct' || this.appBottomNavi // 상품상세 페이지이거나 AppBottomNavi가 있을때만
      }
    },
    /**
     * 탑버튼 숨김 여부
     *
     * @return {Boolean} 탑버튼 숨김 여부
     */
    hideTopButton () {
      return this.$route.matched.some(route => route.meta.hideTopButton === true)
    }

  },
  watch: {
    // 동일 컴포넌트 인스턴스가 재사용될 때 라이프 사이클 훅이 호출되지 않아서, 라우터 이동을 감지하기 위해 사용
    '$route' (to) {
      this.setLayoutName()
    },
    'layoutConfig' (layout) {
      if (layout.appHeaderMain && isNull(this.appHeaderMain)) {
        this.appHeaderMain = () => import(/* webpackChunkName: "AppHeaderMain" */ '@components/layouts/items/AppHeaderMain')
      }

      if (layout.appHeaderProduct && isNull(this.appHeaderProduct)) {
        this.appHeaderProduct = () => import(/* webpackChunkName: "AppHeaderMain" */ '@components/layouts/items/AppHeaderMain')
      }

      if (layout.appHeaderSub && isNull(this.appHeaderSub)) {
        this.appHeaderSub = () => import(/* webpackChunkName: "AppHeaderMain" */ '@components/layouts/items/AppHeaderMain')
      }

      if (layout.appSearchHeader && isNull(this.appSearchHeader)) {
        this.appSearchHeader = () => import(/* webpackChunkName: "AppHeaderMain" */ '@components/layouts/items/AppHeaderMain')
      }

      if (layout.appCategory && isNull(this.appCategory)) {
        this.appCategory = () => import(/* webpackChunkName: "AppCategory" */ '@components/layouts/items/AppCategory')
      }

      if (layout.appFooter && isNull(this.appFooter)) {
        this.appFooter = () => import(/* webpackChunkName: "AppFooter" */ '@components/layouts/items/AppFooter')
      }

      if (layout.appBottomNavi && isNull(this.appBottomNavi)) {
        this.appBottomNavi = () => import(/* webpackChunkName: "AppBottomNavi" */ '@components/layouts/items/AppBottomNavi')
      }
    }
  },
  created () {
    this.setLayoutName()

    // GA 360 파라미터 설정
    externalUtil.setGA360Values(this.$route.query)
  },
  methods: {
    setLayoutName () {
      // 레이아웃 이름에 정의된 레이아웃 구조 설정. 슬롯매장은 GNB 메뉴에 존재하는 슬롯매장인지 판별
      if (this.$route.name && this.$route.name.startsWith('slotStore')) {
        const params = {
          typeFlag: 'espot',
          espotInfo: 'EZ_GNB|Menu'
        }
        this.$nsaxios.post('NSMobHomeView', params).then(result => {
          // GNB 메뉴에 존재하지 않는 슬롯 매장은 LayoutLnb 레이아웃을 사용
          const gnbList = result.msg._EZ_GNB
          const fullUrl = CONST.MOBILE_HOST + this.$route.path
          if (!gnbList.some(gnb => fullUrl.includes(gnb.mdUrl))) {
            this.layoutName = 'LayoutLnb'
            this.containerClass = 'has_layout_lnb'
          } else {
            if (this.$route.meta) {
              this.layoutName = this.$route.meta.layout
            }
            this.containerClass = ''
          }
        })
      } else {
        if (this.$route.meta) {
          this.layoutName = this.$route.meta.layout
        }
        this.containerClass = ''
      }
    }
  }
}
</script>
