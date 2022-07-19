import COMMON_CONST from '@constants/common/common'
import {
  calcDate,
  getDateParse
} from '@frameworks/dateutil/dateUtil'

const FIXED_DATE = calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss')
const FIXED_DATE_MINUS_ONE = calcDate('', 0, 0, 0, -1, 'yyyy-MM-dd HH:mm:ss')
const ONE_DAY_BEFORE = new Intl.DateTimeFormat('kr-KR', {
  timzone: 'Asia/Seoul',
  month: 'long',
  day: '2-digit',
  weekday: 'short'
}).format(getDateParse(FIXED_DATE_MINUS_ONE))

const shoppingHistoryLocalStorage = [
  {
    adultItemFlag: 'N',
    catentryId: 21821675,
    hisGubun: COMMON_CONST.HISTORY_GUBUN.PRODUCT,
    partNumber: '21821675',
    productName: '[무료배송][토리버치] 베스트 가방/지갑 43종 택1_31149790 001',
    realIndex: 8,
    salePrice: 48900,
    settime: FIXED_DATE_MINUS_ONE
  },
  {
    adultItemFlag: 'N',
    catentryId: 21821675,
    hisGubun: COMMON_CONST.HISTORY_GUBUN.PRODUCT,
    partNumber: '21821675',
    productName: '[무료배송][토리버치] 베스트 가방/지갑 43종 택1_31149790 001',
    realIndex: 7,
    salePrice: 48900,
    settime: FIXED_DATE
  },
  {
    adultItemFlag: 'N',
    catentryId: 25393763,
    hisGubun: COMMON_CONST.HISTORY_GUBUN.PRODUCT,
    partNumber: '25393763',
    productName: '[NS Shop+]몽크로스 리버시블 항공점퍼+베스트',
    realIndex: 6,
    salePrice: 38800,
    settime: FIXED_DATE
  },
  {
    categoryId: '1583674',
    categoryName1: 'FOOD &amp; HEALTH',
    categoryName2: '건강/다이어트식품',
    categoryName3: '건강기능',
    categoryName4: '간건강',
    categoryName5: '기타',
    hisGubun: COMMON_CONST.HISTORY_GUBUN.CATEGORY,
    realIndex: 5,
    settime: FIXED_DATE
  },
  {
    categoryId: '1583673',
    categoryName1: 'FOOD &amp; HEALTH',
    categoryName2: '건강/다이어트식품',
    categoryName3: '건강기능',
    categoryName4: '간건강',
    categoryName5: '숙취해소',
    hisGubun: COMMON_CONST.HISTORY_GUBUN.CATEGORY,
    realIndex: 4,
    settime: FIXED_DATE
  },
  {
    categoryId: '1583651',
    categoryName1: 'FOOD &amp; HEALTH',
    categoryName2: '건강/다이어트식품',
    categoryName3: '건강기능',
    categoryName4: '간건강',
    categoryName5: null,
    hisGubun: COMMON_CONST.HISTORY_GUBUN.CATEGORY,
    realIndex: 3,
    settime: FIXED_DATE
  },
  {
    categoryId: '1583615',
    categoryName1: 'FOOD &amp; HEALTH',
    categoryName2: '건강/다이어트식품',
    categoryName3: '건강기능',
    categoryName4: null,
    categoryName5: null,
    hisGubun: COMMON_CONST.HISTORY_GUBUN.CATEGORY,
    realIndex: 2,
    settime: FIXED_DATE
  },
  {
    categoryId: '1583608',
    categoryName1: 'FOOD &amp; HEALTH',
    categoryName2: '가공식품',
    categoryName3: '간편/즉석요리',
    categoryName4: null,
    categoryName5: null,
    hisGubun: COMMON_CONST.HISTORY_GUBUN.CATEGORY,
    realIndex: 1,
    settime: FIXED_DATE
  },
  {
    adultItemFlag: 'N',
    catentryId: 26030598,
    hisGubun: COMMON_CONST.HISTORY_GUBUN.PRODUCT,
    partNumber: '26030598',
    productName: '[TV]비비고 왕교자 만두세트 총 15봉(왕교자 9봉+김치왕교자 2봉+한섬만두 2봉+수교자 2봉)',
    realIndex: 0,
    salePrice: 32720,
    settime: FIXED_DATE
  }
]

const shoppingHistoryInput = [
  {
    adultItemFlag: 'N',
    catentryId: 26030598,
    hisGubun: COMMON_CONST.HISTORY_GUBUN.PRODUCT,
    partNumber: '26030598',
    productName: '[TV]비비고 왕교자 만두세트 총 15봉(왕교자 9봉+김치왕교자 2봉+한섬만두 2봉+수교자 2봉)',
    salePrice: 32720,
    settime: FIXED_DATE
  },
  {
    categoryId: '1583608',
    categoryName1: 'FOOD &amp; HEALTH',
    categoryName2: '가공식품',
    categoryName3: '간편/즉석요리',
    categoryName4: null,
    categoryName5: null,
    hisGubun: COMMON_CONST.HISTORY_GUBUN.CATEGORY,
    settime: FIXED_DATE
  },
  {
    categoryId: '1583615',
    categoryName1: 'FOOD &amp; HEALTH',
    categoryName2: '건강/다이어트식품',
    categoryName3: '건강기능',
    categoryName4: null,
    categoryName5: null,
    hisGubun: COMMON_CONST.HISTORY_GUBUN.CATEGORY,
    settime: FIXED_DATE
  },
  {
    categoryId: '1583651',
    categoryName1: 'FOOD &amp; HEALTH',
    categoryName2: '건강/다이어트식품',
    categoryName3: '건강기능',
    categoryName4: '간건강',
    categoryName5: null,
    hisGubun: COMMON_CONST.HISTORY_GUBUN.CATEGORY,
    settime: FIXED_DATE
  },
  {
    categoryId: '1583673',
    categoryName1: 'FOOD &amp; HEALTH',
    categoryName2: '건강/다이어트식품',
    categoryName3: '건강기능',
    categoryName4: '간건강',
    categoryName5: '숙취해소',
    hisGubun: COMMON_CONST.HISTORY_GUBUN.CATEGORY,
    settime: FIXED_DATE
  },
  {
    categoryId: '1583674',
    categoryName1: 'FOOD &amp; HEALTH',
    categoryName2: '건강/다이어트식품',
    categoryName3: '건강기능',
    categoryName4: '간건강',
    categoryName5: '기타',
    hisGubun: COMMON_CONST.HISTORY_GUBUN.CATEGORY,
    settime: FIXED_DATE
  },
  {
    adultItemFlag: 'N',
    catentryId: 25393763,
    hisGubun: COMMON_CONST.HISTORY_GUBUN.PRODUCT,
    partNumber: '25393763',
    productName: '[NS Shop+]몽크로스 리버시블 항공점퍼+베스트',
    salePrice: 38800,
    settime: FIXED_DATE
  },
  {
    adultItemFlag: 'N',
    catentryId: 21821675,
    hisGubun: COMMON_CONST.HISTORY_GUBUN.PRODUCT,
    partNumber: '21821675',
    productName: '[무료배송][토리버치] 베스트 가방/지갑 43종 택1_31149790 001',
    salePrice: 48900,
    settime: FIXED_DATE
  },
  {
    adultItemFlag: 'N',
    catentryId: 21821675,
    hisGubun: COMMON_CONST.HISTORY_GUBUN.PRODUCT,
    partNumber: '21821675',
    productName: '[무료배송][토리버치] 베스트 가방/지갑 43종 택1_31149790 001',
    salePrice: 48900,
    settime: FIXED_DATE_MINUS_ONE
  }
]

const ParsedLocalHistory = {
  오늘: [
    {
      catentryId: '21821675',
      isProduct: true,
      jjimFlag: true,
      prdImgUrlOrCatTitleName: '//product-image.dev-nsmall.com/itemimg/5/21/675/21821675_B.jpg',
      realIndex: 7,
      salePrice: '48,900',
      subTextName: {
        sub1: '[무료배송][토리버치] 베스트 가방/지갑 43종 택1_31149790 001',
        sub2: ''
      }
    },
    {
      catentryId: '25393763',
      isProduct: true,
      jjimFlag: false,
      prdImgUrlOrCatTitleName: '//product-image.dev-nsmall.com/itemimg/3/25/763/25393763_B.jpg',
      realIndex: 6,
      salePrice: '38,800',
      subTextName: {
        sub1: '[NS Shop+]몽크로스 리버시블 항공점퍼+베스트',
        sub2: ''
      }
    },
    {
      catentryId: 'undefined',
      isProduct: false,
      jjimFlag: false,
      prdImgUrlOrCatTitleName: '카테고리',
      realIndex: 5,
      salePrice: '0',
      subTextName: {
        sub1: '기타',
        sub2: '간건강 > 건강기능'
      }
    },
    {
      catentryId: 'undefined',
      isProduct: false,
      jjimFlag: false,
      prdImgUrlOrCatTitleName: '카테고리',
      realIndex: 4,
      salePrice: '0',
      subTextName: {
        sub1: '숙취해소',
        sub2: '간건강 > 건강기능'
      }
    },
    {
      catentryId: 'undefined',
      isProduct: false,
      jjimFlag: false,
      prdImgUrlOrCatTitleName: '카테고리',
      realIndex: 3,
      salePrice: '0',
      subTextName: {
        sub1: '간건강',
        sub2: '건강기능 > 건강/다이어트식품'
      }
    },
    {
      catentryId: 'undefined',
      isProduct: false,
      jjimFlag: false,
      prdImgUrlOrCatTitleName: '카테고리',
      realIndex: 2,
      salePrice: '0',
      subTextName: {
        sub1: '건강기능',
        sub2: '건강/다이어트식품'
      }
    },
    {
      catentryId: 'undefined',
      isProduct: false,
      jjimFlag: false,
      prdImgUrlOrCatTitleName: '카테고리',
      realIndex: 1,
      salePrice: '0',
      subTextName: {
        sub1: '간편/즉석요리',
        sub2: '가공식품'
      }
    },
    {
      catentryId: '26030598',
      isProduct: true,
      jjimFlag: true,
      prdImgUrlOrCatTitleName: '//product-image.dev-nsmall.com/itemimg/8/26/598/26030598_B.jpg',
      realIndex: 0,
      salePrice: '32,720',
      subTextName: {
        sub1: '[TV]비비고 왕교자 만두세트 총 15봉(왕교자 9봉+김치왕교자 2봉+한섬만두 2봉+수교자 2봉)',
        sub2: ''
      }
    }
  ],
  [ONE_DAY_BEFORE]: [
    {
      catentryId: '21821675',
      isProduct: true,
      jjimFlag: true,
      prdImgUrlOrCatTitleName: '//product-image.dev-nsmall.com/itemimg/5/21/675/21821675_B.jpg',
      realIndex: 8,
      salePrice: '48,900',
      subTextName: {
        sub1: '[무료배송][토리버치] 베스트 가방/지갑 43종 택1_31149790 001',
        sub2: ''
      }
    }
  ]
}

export { shoppingHistoryLocalStorage, shoppingHistoryInput, ParsedLocalHistory }
