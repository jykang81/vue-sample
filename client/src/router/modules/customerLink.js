import nsaxios from '@frameworks/axiosUtil'
import loginUtil from '@utils/loginUtil'
import {
  isNull
} from '@utils/commonutil/commonUtil'

// 고객관련 링크정의
const customerLink = {
  path: '/customer', // url 정의. 반드시 유니크 해야한다.
  name: 'customerRoot', // 링크명 정의 반드시 유니크 해야한다.
  redirect: { name: 'storeHome' }, // 리다이렉트가 필요할때 사용
  children: [ // 자식 페이지가 있을때 사용 설정은 위와 같다. 자식 페이지가 있을 경우 무조건 레이아웃 컴포넌트 정의 필요
    // 설정
    {
      path: 'setting',
      name: 'mypageSetting',
      component: () => import(/* webpackChunkName: "mypageSetting" */ '@/views/customer/MypageSetting'),
      meta: { title: '설정', layout: 'LayoutPageLnb', depth: '공통>설정', hideTopButton: true }
    },
    // 로그인 > 휴면회원안내
    {
      path: 'rest/become',
      name: 'restBecome',
      component: () => import(/* webpackChunkName: "restBecome" */ '@/views/customer/rest/RestBecome'),
      meta: { title: '로그인', forbidsLoginUser: true, layout: 'LayoutPage', depth: '고객>로그인>휴면아이디안내', hideTopButton: true }
    },
    // 휴대폰인증(단독페이지)
    {
      path: 'rest/phone-auth-return',
      name: 'phoneAuthReturn',
      component: () => import(/* webpackChunkName: "phoneAuthReturn" */ '@/views/customer/rest/phoneAuthReturn'),
      meta: { title: '로그인', forbidsLoginUser: true, layout: 'LayoutPage', depth: '고객>로그인>휴면아이디안내', hideTopButton: true }
    }
  ]
}

// login 링크 정의
const loginLink = {
  path: '/customer/login', // url 정의. 반드시 유니크 해야한다.
  name: '', // 링크명 정의 반드시 유니크 해야한다.
  children: [ // 자식 페이지가 있을때 사용 설정은 위와 같다. 자식 페이지가 있을 경우 무조건 레이아웃 컴포넌트 정의 필요
    {
      path: 'regular-member',
      name: 'memberLogin',
      component: () => import(/* webpackChunkName: "memberLogin" */ '@/views/customer/login/Login'),
      meta: { title: '로그인', forbidsLoginUser: true, layout: 'LayoutPageNonFooter', depth: '로그인>로그인메인' }
    },
    {
      path: 'non-member',
      name: 'nonMemberLogin',
      component: () => import(/* webpackChunkName: "nonMemberLogin" */ '@/views/customer/login/LoginNoneMember'),
      meta: { title: '비회원 주문조회', forbidsLoginUser: true, layout: 'LayoutPage', depth: '로그인>비회원주문조회' }
    }
  ],
  meta: { hideTopButton: true }
}

// 간편로그인 링크 정의
const simpleLink = {
  path: '/customer/login/simple', // url 정의. 반드시 유니크 해야한다.
  redirect: { name: 'storeHome' }, // 리다이렉트가 필요할때 사용
  children: [ // 자식 페이지가 있을때 사용 설정은 위와 같다. 자식 페이지가 있을 경우 무조건 레이아웃 컴포넌트 정의 필요
    {
      path: 'payco',
      name: 'paycoLinkReturn',
      component: () => import(/* webpackChunkName: "paycoLinkReturn" */ '@/views/customer/login/simple/PaycoPopupLinkReturn'),
      meta: { layout: 'LayoutEmpty', depth: '고객>로그인>간편로그인>페이코' }
    },
    {
      path: 'naver',
      name: 'naverLinkReturn',
      component: () => import(/* webpackChunkName: "naverLinkReturn" */ '@/views/customer/login/simple/NaverPopupLinkReturn'),
      meta: { layout: 'LayoutEmpty', depth: '고객>로그인>간편로그인>네이버' }
    },
    {
      path: 'kakao',
      name: 'kakaoLinkReturn',
      component: () => import(/* webpackChunkName: "kakaoLinkReturn" */ '@/views/customer/login/simple/KakaoPopupLinkReturn'),
      meta: { layout: 'LayoutEmpty', depth: '고객>로그인>간편로그인>카카오' }
    },
    {
      path: '',
      name: 'simpleLogin',
      component: () => import(/* webpackChunkName: "simpleLogin" */ '@/views/customer/login/simple/JoinSimpleLogin'),
      meta: { title: '아이디 연결', layout: 'LayoutPageNonFooter', depth: '고객>로그인>간편로그인' }
    }
  ],
  meta: { hideTopButton: true }
}

// login ID/비밀번호 찾기 정의
const memberFindLink = {
  path: '/customer/login', // url 정의. 반드시 유니크 해야한다.
  redirect: { name: 'storeHome' }, // 리다이렉트가 필요할때 사용
  children: [ // 자식 페이지가 있을때 사용 설정은 위와 같다. 자식 페이지가 있을 경우 무조건 레이아웃 컴포넌트 정의 필요
    {
      path: 'find-id/phone',
      name: 'authPhone',
      component: () => import(/* webpackChunkName: "authPhone" */ '@/views/customer/login/IdFindPhone'),
      meta: { title: '아이디 찾기', layout: 'LayoutLnb', pageKey: 'ID', depth: '로그인>아이디 찾기>휴대폰인증' }
    },
    {
      path: 'find-id/email',
      name: 'authEmail',
      component: () => import(/* webpackChunkName: "authEmail" */ '@/views/customer/login/IdFindEmail'),
      meta: { title: '아이디 찾기', layout: 'LayoutLnb', pageKey: 'ID', depth: '로그인>아이디 찾기>이메일인증' }
    },
    {
      path: 'find-id/select-method',
      name: 'findUserId',
      component: () => import(/* webpackChunkName: "findUserId" */ '@/views/customer/login/IdFindCertification'),
      meta: { title: '아이디 찾기', layout: 'LayoutLnb', pageKey: 'ID', depth: '로그인>아이디 찾기' }
    },
    {
      path: 'find-id/complete',
      name: 'idFindComplete',
      component: () => import(/* webpackChunkName: "idFindComplete" */ '@/views/customer/login/IdFindComplete'),
      meta: { title: '아이디 찾기', layout: 'LayoutLnb', depth: '로그인>아이디 찾기>아이디 찾기 결과' }
    },
    {
      path: 'find-pw/input-id',
      name: 'checkId',
      component: () => import(/* webpackChunkName: "checkId" */ '@/views/customer/login/PasswordFind'),
      meta: { title: '비밀번호 찾기', layout: 'LayoutLnb', pageKey: 'PASS', depth: '로그인>비밀번호 찾기>비밀번호 찾기' }
    },
    {
      path: 'find-pw/select-method',
      name: 'certifiedSelect',
      component: () => import(/* webpackChunkName: "certifiedSelect" */ '@/views/customer/login/IdFindCertification'),
      meta: { title: '비밀번호 찾기', layout: 'LayoutLnb', pageKey: 'PASS', depth: '로그인>비밀번호찾기>인증방법선택' }
    },
    {
      path: 'find-pw/phone',
      name: 'authPassPhone',
      component: () => import(/* webpackChunkName: "authPassPhone" */ '@/views/customer/login/IdFindPhone'),
      meta: { title: '비밀번호 찾기', layout: 'LayoutLnb', pageKey: 'PASS', depth: '로그인>비밀번호 찾기>휴대폰 인증' }
    },
    {
      path: 'find-pw/email',
      name: 'authPassEmail',
      component: () => import(/* webpackChunkName: "authPassEmail" */ '@/views/customer/login/IdFindEmail'),
      meta: { title: '비밀번호 찾기', layout: 'LayoutLnb', pageKey: 'PASS', depth: '로그인>비밀번호 찾기>이메일 인증' }
    },
    {
      path: 'find-pw/complete',
      name: 'passComplete',
      component: () => import(/* webpackChunkName: "passComplete" */ '@/views/customer/login/PasswordChange'),
      meta: { title: '비밀번호 변경', layout: 'LayoutLnb', depth: '로그인>비밀번호찾기>찾기결과' }
    },
    {
      path: 'password-change-request',
      name: 'passwordChange3th',
      component: () => import(/* webpackChunkName: "passwordChange3th" */ '@/views/customer/login/PasswordChange3th'),
      meta: { title: '비밀번호 변경', layout: 'LayoutLnb', depth: '로그인>비밀번호 찾기>비밀번호변경_주기적' }
    }
  ],
  meta: { hideTopButton: true }
}

// 회원가입 링크 정의
const memberJoinLink = {
  path: '/customer/join', // url 정의. 반드시 유니크 해야한다.
  name: '', // 링크명 정의 반드시 유니크 해야한다.
  children: [ // 자식 페이지가 있을때 사용 설정은 위와 같다. 자식 페이지가 있을 경우 무조건 레이아웃 컴포넌트 정의 필요
    {
      path: '',
      name: 'memberJoinSelect',
      component: () => import(/* webpackChunkName: "memberJoinSelect" */ '@/views/customer/join/MemberJoinSelect'),
      meta: { title: '회원가입', layout: 'LayoutPageNonFooter', depth: '고객>회원가입' }
    },
    {
      path: 'regular-member',
      name: 'memberJoin',
      component: () => import(/* webpackChunkName: "memberJoin" */ '@/views/customer/join/MemberJoin'),
      meta: { title: '회원가입', layout: 'LayoutPageNonFooter', depth: '로그인>회원가입>일반회원가입>정보입력' }
    },
    {
      path: 'complete',
      name: 'memberComplete',
      component: () => import(/* webpackChunkName: "memberComplete" */ '@/views/customer/join/MemberComplete'),
      meta: { title: '회원가입 완료', layout: 'LayoutPageLnb', depth: '로그인>회원가입>일반회원가입>가입완료' }
    },
    {
      path: 'advertisement',
      name: 'memberAgreeMarketing',
      component: () => import(/* webpackChunkName: "memberAgreeMarketing" */ '@/views/customer/join/MemberAgreeMarketing'),
      meta: { title: '마케팅 수신동의', requiresAuth: true, layout: 'LayoutPage', depth: '고객>회원가입>광고성정보수신관리' }
    },
    {
      path: 'simple',
      name: 'simpleJoin',
      component: () => import(/* webpackChunkName: "simpleJoin" */ '@/views/customer/join/JoinSimple'),
      meta: { title: '회원가입', layout: 'LayoutPageNonFooter', depth: '고객>회원가입>간편회원가입' }
    },
    {
      path: 'associate-member/facebook',
      name: 'facebookJoin',
      component: () => import(/* webpackChunkName: "facebookJoin" */ '@/views/customer/join/JoinSimpleFacebook'),
      meta: { title: '회원가입', layout: 'LayoutPageNonFooter', depth: '고객>회원가입>간편회원가입>페이스북' }
    },
    {
      path: 'associate-member/facebook/complete',
      name: 'facebookJoinComplete',
      component: () => import(/* webpackChunkName: "facebookJoinComplete" */ '@/views/customer/join/JoinSimpleFacebookComplete'),
      meta: { title: '회원가입', layout: 'LayoutPageNonFooter', depth: '고객>회원가입>간편회원가입>페이스북' }
    }
  ],
  meta: { hideTopButton: true }
}

// 마이페이지 회원정보 설정 정의
const memberSettingLink = {
  path: '/customer/info', // url 정의. 반드시 유니크 해야한다.
  redirect: { name: 'storeHome' }, // 리다이렉트가 필요할때 사용
  children: [ // 자식 페이지가 있을때 사용 설정은 위와 같다. 자식 페이지가 있을 경우 무조건 레이아웃 컴포넌트 정의 필요
    {
      path: 'check-pw',
      name: 'memberModifyIntro',
      component: () => import(/* webpackChunkName: "MemberModifyIntro" */ '@/views/customer/info/MemberModifyIntro'),
      meta: { title: '회원정보수정', requiresAuth: true, layout: 'LayoutLnbNonFooter', depth: '고객>내정보관리>회원정보변경비밀번호확인', hideTopButton: true }
    },
    {
      path: 'modify',
      name: 'memberModify',
      component: () => import(/* webpackChunkName: "memberModify" */ '@/views/customer/info/MemberModify'),
      meta: { title: '회원정보수정', requiresAuth: true, requiresPasswordAuth: true, layout: 'LayoutPage', depth: '마이페이지>개인정보>회원정보수정', hideTopButton: true }
    },
    // 나의 혜택
    {
      path: 'benefit/:type',
      name: 'mypageBenefit',
      component: () => import(/* webpackChunkName: "mypageBenefit" */ '@/views/customer/benefit/MypageBenefit'),
      meta: { title: '나의 혜택', requiresAuth: true, layout: 'LayoutLnb', depth: '마이페이지>기타활동>상품권등록' }
    },
    // 내정보관리
    {
      path: '',
      name: 'myInfoAdmin',
      component: () => import(/* webpackChunkName: "myInfoAdmin" */ '@/views/customer/info/MyInfoAdmin'),
      meta: { title: '내정보관리', layout: 'LayoutPageLnb', depth: '고객>내정보관리', hideTopButton: true }
    },
    // 찜목록
    {
      path: 'wish-list',
      name: 'wishList',
      component: () => import(/* webpackChunkName: "wishList" */ '@/views/customer/info/wishList/MyWishList'),
      meta: { title: '찜', requiresAuth: true, layout: 'LayoutLnb', depth: '마이페이지>기타활동>찜한상품' }
    },
    // 멤버십
    {
      path: 'membership/grade/inquiry',
      name: 'myMembership',
      component: () => import(/* webpackChunkName: "myMembership" */ '@/views/customer/Membership'),
      meta: { title: 'NS 멤버십', requiresAuth: true, layout: 'LayoutLnb', depth: '마이페이지>기타활동>멤버십' }
    },
    // 멤버십 > vip라운지
    {
      path: 'membership/viplounge',
      name: 'viplounge',
      component: () => import(/* webpackChunkName: "viplounge" */ '@/views/customer/MemberShipVipLounge'),
      meta: { title: 'NS 멤버십', requiresAuth: true, layout: 'LayoutLnb', depth: '고객>NS멤버십>VIP라운지' }
    },
    {
      path: 'adult-certification',
      name: 'adultCertify',
      component: () => import(/* webpackChunkName: "adultCertify" */ '@/components/customer/info/OrderNoMemberCertify'),
      meta: { title: '성인인증', layout: 'LayoutLnb', depth: '고객>내정보관리>본인인증', hideTopButton: true }
    },
    {
      path: 'identification',
      name: 'identity',
      component: () => import(/* webpackChunkName: "identity" */ '@/components/customer/info/OrderNoMemberCertify'),
      meta: { title: '본인인증', layout: 'LayoutLnb', depth: '고객>내정보관리>본인인증', hideTopButton: true }
    },
    {
      path: 'return-auth',
      name: 'returnAuth',
      component: () => import(/* webpackChunkName: "returnAuth" */ '@/views/customer/info/ReturnAuth'),
      meta: { layout: 'LayoutBottomNavi', depth: '고객>내정보관리>본인인증', hideTopButton: true }
    }
  ]
}

// NS Pay 설정 화면 링크 정의
const customerNspayLink = {
  path: '/customer/info/nspay', // url 정의. 반드시 유니크 해야한다.
  redirect: { name: 'nSPayManagement' }, // 리다이렉트가 필요할때 사용
  children: [ // 자식 페이지가 있을때 사용 설정은 위와 같다. 자식 페이지가 있을 경우 무조건 레이아웃 컴포넌트 정의 필요
    {
      path: 'intro',
      name: 'nSPayIntro',
      component: () => import(/* webpackChunkName: "NSPayIntro" */ '@/views/customer/nspay/NSPayIntro'),
      meta: { title: 'NS페이 관리', requiresAuth: true, layout: 'LayoutLnb', depth: '고객>내정보관리>NS페이/원터치결제>소개' }
    },
    {
      path: 'management',
      name: 'nSPayManagement',
      component: () => import(/* webpackChunkName: "NSPayManagement" */ '@/views/customer/nspay/NSPayManagement'),
      beforeEnter: (to, from, next) => {
        // 결제수단 등록 후에 들어왔을 경우는 바로 진입
        if (from.name === 'nSPayRegister') {
          next()
        } else {
          // 결제수단 등록 페이지 외에 진입 시, 결제수단 존재 확인
          const param = {
            cmdType: 'payInfoAll',
            userId: loginUtil.userId()
          }
          nsaxios.post('AjaxNSWPay', param, response => {
            // 등록된 NS페이가 없을 경우
            if (isNull(response.payInfo)) {
              next({ name: 'nSPayIntro' })
            // 등록된 NS페이가 있을 경우
            } else {
              next()
            }
          })
        }
      },
      meta: { title: 'NS페이 관리', requiresAuth: true, layout: 'LayoutLnb', depth: '마이페이지>기타활동>NS페이관리' }
    },
    {
      path: 'method/management',
      name: 'nSPayList',
      component: () => import(/* webpackChunkName: "NSPayList" */ '@/views/customer/nspay/NSPayList'),
      meta: { title: '결제수단 관리', requiresAuth: true, layout: 'LayoutLnb', depth: '마이페이지>기타활동>NS페이관리>결제수단관리' }
    },
    {
      path: 'method/register',
      name: 'nSPayRegister',
      component: () => import(/* webpackChunkName: "NSPayRegister" */ '@/views/customer/nspay/NSPayRegister'),
      meta: { title: '결제수단 등록', requiresAuth: true, layout: 'LayoutLnb', depth: '마이페이지>기타활동>NS페이관리>결제수단등록' }
    }
  ],
  meta: { hideTopButton: true }
}

// 임직원 화면 링크 정의
const employeeLink = {
  path: '/customer/employee', // url 정의. 반드시 유니크 해야한다.
  redirect: { name: 'nSPayManagement' }, // 리다이렉트가 필요할때 사용
  children: [ // 자식 페이지가 있을때 사용 설정은 위와 같다. 자식 페이지가 있을 경우 무조건 레이아웃 컴포넌트 정의 필요
    // 그룹사 임직원 인증
    {
      path: 'verification/email',
      name: 'employeeVerificationEmail',
      component: () => import(/* webpackChunkName: "employeeVerificationEmail" */ '@/views/customer/employee/EmployeeVerificationEmail'),
      meta: { title: '그룹사 임직원 인증', requiresAuth: true, layout: 'LayoutLnb', depth: '마이페이지>기타활동>그룹사 임직원신청' }
    },
    // 그룹사 임직원 인증 후 결과페이지
    {
      path: 'verification/complete',
      name: 'employeeVerificationEmailComplete',
      component: () => import(/* webpackChunkName: "employeeVerificationEmailComplete" */ '@/views/customer/employee/EmployeeVerificationEmailComplete'),
      meta: { title: '그룹사 임직원 인증', requiresAuth: true, layout: 'LayoutLnb', depth: '고객>임직원회원>임직원확인>인증완료' }
    }
  ],
  meta: { hideTopButton: true }
}

export { loginLink, memberFindLink, simpleLink, memberJoinLink, memberSettingLink, customerNspayLink, employeeLink }
export default customerLink
