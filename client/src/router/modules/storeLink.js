import { gotoAppMarket } from '@utils/commonutil/commonUtil'

// 매장 링크
const storeLink = {
  path: '/',
  redirect: { name: 'storeHome' },
  children: [
    {
      path: 'store',
      redirect: { name: 'storeHome' },
      meta: { depth: '매장' }
    },
    {
      path: 'store/home',
      name: 'storeHome',
      component: () => import(/* webpackChunkName: "storeHome" */ '@/views/store/StoreHome'),
      meta: { title: '홈', layout: 'LayoutDefault', depth: 'GNB>홈' },
      beforeEnter: (to, from, next) => {
        // email, SMS 에서 앱전용 혜택 받기 클릭 시
        if (to.redirectedFrom === '/sendSMSView') {
          gotoAppMarket()
        }
        next()
      }
    },
    {
      path: 'store/theme/happydeal',
      name: 'happyDeal',
      component: () => import(/* webpackChunkName: "happyDeal" */ '@/views/store/HappyDeal'),
      meta: { layout: 'LayoutDefault', depth: 'GNB>해피딜' }
    },
    {
      path: 'store/slot/:categoryId',
      name: 'slotStore',
      children: [
        {
          path: ':subCategoryId',
          name: 'slotStoreSub',
          component: () => import(/* webpackChunkName: "slotStore" */ '@/views/store/SlotStore'),
          meta: { title: '', layout: 'LayoutDefault', depth: 'GNB>편성매장' }
        }
      ],
      component: () => import(/* webpackChunkName: "slotStore" */ '@/views/store/SlotStore'),
      meta: { title: '', layout: 'LayoutDefault', depth: 'GNB>편성매장' }
    },
    {
      path: 'store/media/tv-shopping',
      name: 'tvShopping',
      component: () => import(/* webpackChunkName: "tvShopping" */ '@/views/store/TvShopping'),
      meta: { title: 'TV쇼핑', layout: 'LayoutDefault', depth: 'GNB>TV쇼핑' }
    },
    {
      path: 'store/media/shopplus',
      name: 'shopPlus',
      component: () => import(/* webpackChunkName: "shopPlus" */ '@/views/store/ShopPlus'),
      meta: { title: 'Shop+', layout: 'LayoutDefault', depth: 'GNB>TV·Shop+' }
    },
    {
      path: 'store/media/thinglive',
      name: 'thinglive',
      component: () => import(/* webpackChunkName: "thinglive" */ '@/views/store/ThingliveMain'),
      meta: { title: '띵라이브', layout: 'LayoutLnb', depth: '띵라이브>메인' }
    },
    {
      path: 'store/cate/:categoryNumber',
      name: 'lnbCategory',
      component: () => import(/* webpackChunkName: "lnbCategory" */ '@/views/store/LnbCategory'),
      meta: { layout: 'LayoutLnb', depth: '매장>카테고리매장' }
    },
    {
      path: ':categoryId(\\d+)', // 숫자로만 구성된 URL
      name: 'shortUrl',
      component: () => import(/* webpackChunkName: "shortUrl" */ '@/views/store/ShortUrl'),
      meta: { layout: 'LayoutEmpty' }
    }
  ]
}

export default storeLink
