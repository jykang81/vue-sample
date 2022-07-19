
// 결제
const paymentLink = {
  path: '/payment',
  redirect: { name: 'storeHome' },
  children: [
    // 결제처리 결과 성공
    {
      path: 'success',
      name: 'orderSheetPaymentReturn',
      component: () => import(/* webpackChunkName: "orderSheetPaymentReturn" */ '@/views/order/OrderPaymentReturn'),
      meta: { layout: 'LayoutEmpty', depth: '결제>결제성공' }
    },
    // 결제처리 결과 실패
    {
      path: 'error',
      name: 'orderSheetPaymentReturnError',
      component: () => import(/* webpackChunkName: "orderSheetPaymentReturnError" */ '@/views/order/OrderPaymentReturnError'),
      meta: { layout: 'LayoutEmpty', depth: '결제>결제실패' }
    },
    // NS페이 결제처리 결과 성공
    {
      path: 'simple/nspay/success',
      name: 'orderSheetNspayReturn',
      component: () => import(/* webpackChunkName: "orderSheetNspayReturn" */ '@/views/order/OrderNspayReturn'),
      meta: { layout: 'LayoutEmpty', depth: '결제>간편결제>NS페이' }
    },
    // NS페이 결제처리 결과 실패
    {
      path: 'simple/nspay/error',
      name: 'orderSheetNspayReturnError',
      component: () => import(/* webpackChunkName: "orderSheetNspayReturnError" */ '@/views/order/OrderNspayReturnError'),
      meta: { layout: 'LayoutEmpty', depth: '결제>간편결제>NS페이' }
    }
  ],
  meta: { hideTopButton: true }
}

export default paymentLink
