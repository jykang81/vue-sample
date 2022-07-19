const MypageMainReal = {
  msg: {
    root: {
      BenefitInfo: {
        giftCard: '0',
        saveMoney: '8,985,090',
        couponCnt: 3,
        wishListCnt: 2,
        balance: '6,278,490',
        tolPoint: '10,000'
      },
      GradeInfo: {
        currentGrd: 'R2',
        memberGubun: 'K',
        currentGrdName: '실버',
        isEmpMbr: 'N'
      },
      StatusCnt: [
        {
          status: 'D',
          cnt: '1',
          statusName: '결제대기'
        },
        {
          status: 'M',
          cnt: '2',
          statusName: '결제완료'
        },
        {
          status: 'T',
          cnt: '3',
          statusName: '주문전달'
        },
        {
          status: 'I',
          cnt: '4',
          statusName: '상품준비중'
        },
        {
          status: 'O',
          cnt: '5',
          statusName: '배송중'
        },
        {
          status: 'S',
          cnt: '6',
          statusName: '배송완료'
        },
        {
          cnt: '3',
          status: 'X',
          statusName: '취소완료'
        }
      ]
    }
  }
}

const MypageMainRealFacebook = {
  msg: {
    root: {
      BenefitInfo: {
        giftCard: '0',
        saveMoney: '999,999,889',
        couponCnt: 2,
        wishListCnt: 1,
        balance: '999,999,779',
        tolPoint: '0'
      },
      GradeInfo: {
        currentGrd: 'R2',
        memberGubun: 'S',
        currentGrdName: '실버',
        isEmpMbr: 'N'
      },
      StatusCnt: []
    }
  },
  catalogId: ['14051'],
  userId: ['107535004'],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001'],
  isSuccessful: true
}

// 미작성 상품평 리스트 호출 API
const NotYetReviewedListReal = {
  msg: {
    root: {
      NotYetReviewedListReal: [
        {
          dan_attr_desc1: '',
          dan_attr_desc2: '',
          dan_attr_desc3: '',
          dan_attr_desc4: '',
          tot_cnt: 9,
          brandNM: '비비고',
          orderitems_id: 178056007,
          ord_price: 40900,
          max_dt: '2020.09.02',
          quantity: 1,
          ord_dt: '2020.03.04',
          dan_attr_val1: '',
          dan_catentry_id: 10185775741,
          dan_attr_val2: '',
          prt_catentry_id: 26030598,
          catGB: '10',
          dan_attr_val3: '',
          dan_attr_val4: '',
          imageURL: 'http://product-image.dev-nsmall.com/itemimg/8/26/598/26030598_C.jpg',
          orders_id: 300010778040,
          catentryNM: '[TV]비비고 왕교자 만두세트 총 15봉(왕교자 9봉+김치왕교자 2봉+한섬만두 2봉+수교자 2봉)',
          partnumber: '26030598'
        }
      ],
      totalCount: 9
    }
  },
  users_id: [
    '100286013'
  ],
  rowPerPage: [
    '1'
  ],
  catalogId: [
    '14051'
  ],
  userId: [
    '101928691'
  ],
  langId: [
    '-9'
  ],
  accptPath: [
    '500'
  ],
  accptPathCd: [
    '500'
  ],
  storeId: [
    '13001'
  ],
  isSuccessful: true
}

// 회원 등급 별 등급 아이콘 클래스 명
const gradeClassName = {
  R12: 'markloven',
  R1: 'diamond',
  R13: 'gold',
  R2: 'silver',
  R10: 'family'
}

export { MypageMainReal, MypageMainRealFacebook, NotYetReviewedListReal, gradeClassName }
