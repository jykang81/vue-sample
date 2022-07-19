
// 기획전 상세 링크
const exhibitionLink = {
  path: '/exhibition',
  redirect: { name: 'storeHome' },
  children: [
    {
      path: 'detail',
      name: 'exhibitionDetail',
      component: () => import(/* webpackChunkName: "exhibitionDetail" */ '@/views/exhibition/ExhibitionDetail'),
      meta: { title: '기획전', layout: 'LayoutLnb', depth: '기획전>기획전상세' }
    }
  ]
}

export default exhibitionLink
