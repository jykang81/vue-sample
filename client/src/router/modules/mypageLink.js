
// mypage 링크 정의
const mypageLink = {
  path: '/mypage', // url 정의. 반드시 유니크 해야한다.
  name: '', // 링크명 정의 반드시 유니크 해야한다.
  children: [ // 자식 페이지가 있을때 사용 설정은 위와 같다. 자식 페이지가 있을 경우 무조건 레이아웃 컴포넌트 정의 필요
    // 마이페이지 회원
    {
      path: '',
      name: 'mypageMain',
      component: () => import(/* webpackChunkName: "mypageMain" */ '@/views/mypage/MypageMain'),
      meta: { title: '마이페이지', layout: 'LayoutLnb', depth: '마이페이지>메인페이지' }
    }
  ]
}

export default mypageLink
