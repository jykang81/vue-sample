
// 마케팅 스크립트 링크 정의
const marketingLink = {
  path: '/marketing', // url 정의. 반드시 유니크 해야한다.
  // component: () => import(/* webpackChunkName: "storeHome" */ '@components/layouts/BaseLayout'), // 사용할 기본 레이아웃 컴포넌트 정의
  name: 'marketingScript', // 링크명 정의 반드시 유니크 해야한다.
  children: [ // 자식 페이지가 있을때 사용 설정은 위와 같다. 자식 페이지가 있을 경우 무조건 레이아웃 컴포넌트 정의 필요
    {
      path: 'native',
      name: 'app2Web',
      component: () => import(/* webpackChunkName: "app2Web" */ '@/views/marketing/App2Web'),
      meta: { title: 'APP2WEB', depth: '마케팅스크립트>APP2WEB' }
    }
  ]
}

export default marketingLink
