// 사이트 소개 링크
const siteInfoLinks = {
  path: '/common/footer/site-info',
  name: 'siteInfoRoot',
  children: [
    {
      path: 'terms-of-use',
      name: 'termsOfUse',
      redirect: { name: 'termsNamall' },
      meta: { depth: '공통>footer>사이트 정보>이용약관' }
    },
    {
      path: 'terms-of-use/nsmall',
      name: 'termsNamall',
      component: () => import(/* webpackChunkName: "termsNamall" */ '@/views/common/footer/siteinfo/termsofuse/TermsNsmall'),
      meta: { title: '이용약관', layout: 'LayoutLnb', depth: '공통>Nsmall 이용약관' }
    },
    {
      path: 'terms-of-use/tv-and-sb',
      name: 'termsTvAndSb',
      component: () => import(/* webpackChunkName: "termsTvAndSb" */ '@/views/common/footer/siteinfo/termsofuse/TermsTvAndSb'),
      meta: { title: '이용약관', layout: 'LayoutLnb', depth: '공통>TV홈쇼핑 및 쇼핑북 이용약관' }
    },
    {
      path: 'privacy-policy',
      name: 'privacyPolicy',
      component: () => import(/* webpackChunkName: "privacyPolicy" */ '@/views/common/footer/siteinfo/PrivacyPolicy'),
      meta: { title: '개인정보처리방침', layout: 'LayoutLnb', depth: '공통>개인정보처리방침' }
    },
    {
      path: 'youth-policy',
      name: 'youthPolicy',
      component: () => import(/* webpackChunkName: "youthPolicy" */ '@/views/common/footer/siteinfo/YouthPolicy'),
      meta: { title: '청소년 보호정책 ', layout: 'LayoutLnb', depth: '공통>청소년보호정책' }
    },
    {
      path: 'consignment',
      name: 'consignment',
      component: () => import(/* webpackChunkName: "consignment" */ '@/views/common/footer/siteinfo/CooperativeCompanies'),
      meta: { title: '개인정보처리위탁 ', layout: 'LayoutLnb', depth: '공통>개인정보 처리 위탁' }
    },
    {
      path: 'guarantee',
      name: 'guarantee',
      component: () => import(/* webpackChunkName: "guarantee" */ '@/views/common/footer/siteinfo/LoanGuarantee'),
      meta: { title: '우리은행 채무지급보증 안내', layout: 'LayoutHeaderDefault', depth: '공통>우리은행 채무지급보증 안내' }
    }
  ]
}

// 최근본상품 링크
const shoppingHistoryLink = {
  path: '/common',
  children: [
    {
      path: 'shopping-history',
      name: 'shoppingHistory',
      component: () => import(/* webpackChunkName: "shoppingHistory" */ '@/views/common/ShoppingHistory'),
      meta: { title: '최근 본 상품', layout: 'LayoutLnbNonFooter', hideTopButton: true, depth: '마이페이지>기타활동>최근본상품' }
    }
  ]
}

// 상품구성정보 링크
const infoLink = {
  path: '/common',
  children: [
    {
      path: 'product-composition-info/:partNumber',
      name: 'productCompositionInfo',
      component: () => import(/* webpackChunkName: "productCompositionInfo" */ '@/views/common/ProductCompositionInfo'),
      meta: { title: '상품구성정보', layout: 'LayoutEmpty', hideTopButton: true, depth: '상품구성정보' }
    }
  ]
}

export { siteInfoLinks, shoppingHistoryLink, infoLink }
