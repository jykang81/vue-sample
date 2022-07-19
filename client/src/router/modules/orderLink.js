
// 주문
const orderLink = {
  path: '/order',
  redirect: { name: 'storeHome' },
  children: [
    // 주문서
    {
      path: 'sheet',
      name: 'orderSheet',
      component: () => import(/* webpackChunkName: "orderSheet" */ '@/views/order/sheet/OrderSheet'),
      meta: { title: '주문/결제', layout: 'LayoutPageNonFooter', depth: '주문/결제>주문서작성/결제', hideTopButton: true }
    },
    // 주문완료
    {
      path: 'sheet/complete',
      name: 'orderComplete',
      component: () => import(/* webpackChunkName: "orderComplete" */ '@/views/order/complete/OrderComplete'),
      meta: { title: '주문완료', layout: 'LayoutLnb', depth: '주문/결제>주문완료', hideTopButton: true }
    },
    // 주문/배송조회
    {
      path: 'list',
      name: 'mypageOrderList',
      component: () => import(/* webpackChunkName: "mypageOrderList" */ '@/views/order/list/MypageOrderList'),
      meta: { title: '주문/배송조회', requiresAuth: true, layout: 'LayoutLnb', depth: '마이페이지>주문/배송조회' }
    },
    // 취소/반품/교환내역
    {
      path: 'list/cancel-return-exchange',
      name: 'mypageCancelReturnExchangeList',
      component: () => import(/* webpackChunkName: "mypageCancelReturnExchangeList" */ '@/views/order/list/MypageOrderList'),
      meta: { title: '취소/반품/교환내역', requiresAuth: true, layout: 'LayoutLnb', depth: '주문>취소/반품/교환내역' }
    },
    // 장바구니
    {
      path: 'cart',
      name: 'cartList',
      component: () => import(/* webpackChunkName: "cartList" */ '@/views/order/cart/CartList'),
      meta: { title: '장바구니', layout: 'LayoutPageNonFooter', depth: '주문>장바구니', hideTopButton: true }
    },
    // 상담신청 주문서
    {
      path: 'consult',
      name: 'orderConsultSheet',
      component: () => import(/* webpackChunkName: "orderConsultSheet" */ '@/views/order/consult/OrderConsultSheet'),
      meta: { title: '상담신청', layout: 'LayoutPageLnb', depth: '주문>상담신청', hideTopButton: true }
    },
    // 상담신청 주문완료
    {
      path: 'consult/complete',
      name: 'orderConsultComplete',
      component: () => import(/* webpackChunkName: "orderConsultComplete" */ '@/views/order/complete/OrderConsultComplete'),
      meta: { title: '상담신청완료', layout: 'LayoutLnb', depth: '주문>상담신청>신청완료', hideTopButton: true }
    },
    // 현금영수증발급
    {
      path: 'document/cash-receipt',
      name: 'cashReceipt',
      component: () => import(/* webpackChunkName: "cashReceipt" */ '@/views/order/document/CashReceipt'),
      meta: { title: '현금영수증 발급', requiresAuth: true, layout: 'LayoutLnb', depth: '마이페이지>기타활동>현금영수증발급' }
    }
  ]
}

export default orderLink
