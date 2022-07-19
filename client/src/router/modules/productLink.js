
// 상품 링크 정의
const productLink = {
  path: '/product',
  children: [
    {
      path: '/',
      name: 'noProduct',
      meta: { depth: '상품' }
    },
    {
      path: ':number',
      name: 'productDetail',
      component: () => import(/* webpackChunkName: "productDetail" */ '@/views/product/ProductDetail'),
      meta: { layout: 'LayoutProduct', depth: '상품>상품상세' }
    },
    // 배송교환반품 페이지
    {
      path: 'shipping-exchange-return',
      name: 'shippingExchangeReturnInfo',
      component: () => import(/* webpackChunkName: "shippingExchangeReturnInfo" */ '@/views/product/ShippingExchangeReturnInfo'),
      meta: { title: '배송/교환/반품안내', layout: 'LayoutPage', depth: '상품>상품정보>배송/교환/반품안내' }
    },
    // 묶음배송상품 페이지
    {
      path: 'bundle-delivery/:partNumber',
      name: 'bundleList',
      component: () => import(/* webpackChunkName: "bundleList" */ '@/views/product/BundleList'),
      meta: { title: '배송비 절약매장 상품', layout: 'LayoutLnb', depth: '상품>상품정보>배송비 절약매장 상품' }
    },
    // 마이페이지 > 상품평 관리
    {
      path: 'review/management/:type',
      name: 'managementMyReview',
      component: () => import(/* webpackChunkName: "managementMyReview" */ '@/views/product/review/ManagementMyReview'),
      meta: { title: '상품평 관리', requiresAuth: true, layout: 'LayoutLnb', depth: '마이페이지>기타활동>상품평관리' }
    },
    // 마이페이지 > 상품평 관리 > 상품평 작성
    {
      path: 'review/write/:id',
      name: 'writeMyReview',
      component: () => import(/* webpackChunkName: "writeMyReview" */ '@/views/product/review/WriteMyReview'),
      meta: { title: '상품평 작성', requiresAuth: true, layout: 'LayoutPageNonFooter', depth: '마이페이지>기타활동>상품평추가', hideTopButton: true }
    },
    // 마이페이지 > 상품평 관리 > 상품평 수정
    {
      path: 'review/modify/:id',
      name: 'modifyMyReview',
      component: () => import(/* webpackChunkName: "modifyMyReview" */ '@/views/product/review/WriteMyReview'),
      meta: { title: '상품평 수정', requiresAuth: true, layout: 'LayoutPageNonFooter', depth: '마이페이지>기타활동>상품평수정', hideTopButton: true }
    },
    // 상품상세 > 상품평 목록
    {
      path: 'review-list/:partNumber',
      name: 'reviewList',
      component: () => import(/* webpackChunkName: "reviewList" */ '@/views/product/review/ReviewList'),
      meta: { title: '상품평', layout: 'LayoutPageNonFooter', depth: '상품>상품평>상품평 목록' }
    },
    // 상품문의 목록
    {
      path: 'inquiry-list/:partNumber',
      name: 'inquiryList',
      component: () => import(/* webpackChunkName: "inquiryList" */ '@/views/product/info/InquiryList'),
      meta: { title: '상품문의', layout: 'LayoutPageNonFooter', depth: '상품>상품문의 목록' }
    },
    // 상품문의 작성
    {
      path: 'inquiry-write/:partNumber',
      name: 'writeInquiry',
      component: () => import(/* webpackChunkName: "writeInquiry" */ '@/views/product/inquiry/WriteInquiry'),
      meta: { title: '상품문의', layout: 'LayoutPageNonFooter', depth: '상품>상품문의 목록>상품문의 작성' }
    }
  ]
}

export default productLink
