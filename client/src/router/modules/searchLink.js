
// 검색 링크 정의
const searchLink = {
  path: '/search', // url 정의. 반드시 유니크 해야한다.
  name: 'searchRoot', // 링크명 정의 반드시 유니크 해야한다.
  // redirect: '/', // 리다이렉트가 필요할때 사용
  children: [ // 자식 페이지가 있을때 사용 설정은 위와 같다. 자식 페이지가 있을 경우 무조건 레이아웃 컴포넌트 정의 필요
    {
      path: 'result/:searchword',
      name: 'searchResult',
      component: () => import(/* webpackChunkName: "searchResult" */ '@/views/store/SearchResult'),
      // alias: 'search-page/searching',
      meta: { title: '검색결과', requiresAuth: false, layout: 'LayoutSearchResult', depth: '검색>검색결과표시' } // LayoutDefault
    }
  ]
}

export default searchLink
