import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수
import AppAside from '@components/layouts/items/AppAside'
import loginUtil from '@utils/loginUtil'
import flushPromises from 'flush-promises'
import { assert } from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'
import nsaxios from '@frameworks/axiosUtil'
import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'
import {
  lnbBenefitNoMemberResponse,
  lnbBenefitGeneralMemberResponse
  // lnbBenefitHarimMemberResponse
} from '@unit/components/layouts/items/mock/LnbBenefitResponse'
import getCompanyGroupListResponse from '@unit/components/layouts/items/mock/GetCompanyGroupList'

const { location } = window

describe('AppAside', () => {
  const USER_NAME = '테스트 사용자'
  const STAFF_INFO_NAME = '임직원'
  let localVue
  let options
  let wrapper
  let vm
  let mock

  before(() => {
    Vue.prototype.$nsaxios = nsaxios
    Vue.use(Vue2TouchEvents)
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    options = {
      localVue,
      store,
      router
    }

    loginUtil.login({
      userName: USER_NAME,
      staffInfo: true,
      staffInfoName: STAFF_INFO_NAME
    })

    wrapper = shallowMount(AppAside, options)
    vm = wrapper.vm

    delete window.location
    window.location = {
      href: ''
    }
  })

  afterEach(() => {
    window.location = location
    mock.reset()
    wrapper.destroy()
  })

  describe('created', () => {
    it('snb 상태 값이 바뀌면 snb 정보가 갱신된다.', async () => {
      /** 카테고리 조회 mocking */
      const lnbShopURL = `${CONST.API_URL}/LnbShop`
      const mockLnbShopResponse = {
        pageSize: ['1'],
        msg: {
          root: {
            _MOB_LNB_SEASON: [
              {
                espotType: 'MarketingContent',
                espotId: '386453',
                contentMimeType: 'image',
                imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/TEST_IMG/lnb_season_01.png',
                espotTitle: '',
                marketingText: '',
                contentsId: '578652',
                clickCode: '1583588',
                espotTitleImgPath: '',
                mdUrl: 'CategoryDisplay?identifier=1583588&amp;categoryId=1583588&amp;catalogId=14051&amp;storeId=13001',
                clickTarget: 'Category',
                espotTitleText: '',
                espotTitleMimeType: ''
              },
              {
                espotType: 'MarketingContent',
                espotId: '386453',
                contentMimeType: 'image',
                imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/TEST_IMG/lnb_season_02.png',
                espotTitle: '',
                marketingText: '',
                contentsId: '578653',
                clickCode: '1586584',
                espotTitleImgPath: '',
                mdUrl: 'CategoryDisplay?identifier=1586584&amp;categoryId=1586584&amp;catalogId=14051&amp;storeId=13001',
                clickTarget: 'Category',
                espotTitleText: '',
                espotTitleMimeType: ''
              },
              {
                espotType: 'MarketingContent',
                espotId: '386453',
                contentMimeType: 'image',
                imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/TEST_IMG/lnb_season_03.png',
                espotTitle: '',
                marketingText: '',
                contentsId: '578654',
                clickCode: '1587684',
                espotTitleImgPath: '',
                mdUrl: 'CategoryDisplay?identifier=1587684&amp;categoryId=1587684&amp;catalogId=14051&amp;storeId=13001',
                clickTarget: 'Category',
                espotTitleText: '',
                espotTitleMimeType: ''
              },
              {
                espotType: 'MarketingContent',
                espotId: '386453',
                contentMimeType: 'image',
                imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/TEST_IMG/lnb_season_04.png',
                espotTitle: '',
                marketingText: '',
                contentsId: '578655',
                clickCode: '-8201',
                espotTitleImgPath: '',
                mdUrl: 'CategoryDisplay?identifier=-8201&amp;categoryId=-8201&amp;catalogId=14051&amp;storeId=13001',
                clickTarget: 'Category',
                espotTitleText: '',
                espotTitleMimeType: ''
              }
            ],
            _MOB_LNB_THEMESHOP: [
              {
                espotType: 'MarketingContent',
                espotId: '386454',
                contentMimeType: 'image',
                imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/TEST_IMG/lnb_theme_01.png',
                espotTitle: '',
                marketingText: '',
                contentsId: '578657',
                clickCode: '20087',
                espotTitleImgPath: '',
                mdUrl: 'CategoryDisplay?identifier=20087&amp;categoryId=20087&amp;catalogId=14051&amp;storeId=13001',
                clickTarget: 'Category',
                espotTitleText: '',
                espotTitleMimeType: ''
              },
              {
                espotType: 'MarketingContent',
                espotId: '386454',
                contentMimeType: 'image',
                imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/TEST_IMG/lnb_theme_02.png',
                espotTitle: '',
                marketingText: '',
                contentsId: '578658',
                clickCode: '20772',
                espotTitleImgPath: '',
                mdUrl: 'CategoryDisplay?identifier=20772&amp;categoryId=20772&amp;catalogId=14051&amp;storeId=13001',
                clickTarget: 'Category',
                espotTitleText: '',
                espotTitleMimeType: ''
              },
              {
                espotType: 'MarketingContent',
                espotId: '386454',
                contentMimeType: 'image',
                imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/TEST_IMG/lnb_theme_03.png',
                espotTitle: '',
                marketingText: '',
                contentsId: '578659',
                clickCode: '301501',
                espotTitleImgPath: '',
                mdUrl: 'CategoryDisplay?identifier=301501&amp;categoryId=301501&amp;catalogId=14051&amp;storeId=13001',
                clickTarget: 'Category',
                espotTitleText: '',
                espotTitleMimeType: ''
              }
            ],
            CategoryList: [
              {
                tcateNm: 'FOOD &amp; HEALTH',
                lcateUrl: '',
                catalogId: '97001',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_1583566.png'
                }],
                lcateId: '1583566',
                mcateList: [
                  {
                    mcateId: '1583608',
                    mcateNm: '간편/즉석요리'
                  },
                  {
                    mcateId: '1583609',
                    mcateNm: '과자/간식'
                  },
                  {
                    mcateId: '1583610',
                    mcateNm: '김치/반찬'
                  },
                  {
                    mcateId: '1583611',
                    mcateNm: '라면/면/스프'
                  },
                  {
                    mcateId: '1583612',
                    mcateNm: '조미료/소스/장류'
                  },
                  {
                    mcateId: '1583613',
                    mcateNm: '커피/생수/음료'
                  },
                  {
                    mcateId: '1583614',
                    mcateNm: '탕/국/찌개'
                  }
                ],
                lcateNm: '가공식품',
                tcateId: '1583595'
              },
              {
                tcateNm: 'FOOD &amp; HEALTH',
                lcateUrl: '',
                catalogId: '97001',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_1583578.png'
                }],
                lcateId: '1583578',
                mcateList: [
                  {
                    mcateId: '1583615',
                    mcateNm: '건강기능'
                  },
                  {
                    mcateId: '1583616',
                    mcateNm: '다이어트/이너뷰티'
                  },
                  {
                    mcateId: '1583617',
                    mcateNm: '전통건강'
                  },
                  {
                    mcateId: '1583618',
                    mcateNm: '홍삼'
                  }
                ],
                lcateNm: '건강식품',
                tcateId: '1583595'
              },
              {
                tcateNm: 'FOOD &amp; HEALTH',
                lcateUrl: '',
                catalogId: '97001',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_1583577.png'
                }],
                lcateId: '1583577',
                mcateList: [
                  {
                    mcateId: '1583619',
                    mcateNm: '농산'
                  },
                  {
                    mcateId: '1583620',
                    mcateNm: '수산'
                  },
                  {
                    mcateId: '1583621',
                    mcateNm: '축산'
                  }
                ],
                lcateNm: '농수축/신선식품',
                tcateId: '1583595'
              },
              {
                tcateNm: 'HOME &amp; LIFESTYLE',
                lcateUrl: '',
                catalogId: '97001',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_1583567.png'
                }],
                lcateId: '1583567',
                mcateList: [
                  {
                    mcateId: '1583588',
                    mcateNm: '침실가구'
                  },
                  {
                    mcateId: '1583591',
                    mcateNm: '거실가구'
                  },
                  {
                    mcateId: '1583589',
                    mcateNm: '주방가구'
                  },
                  {
                    mcateId: '1583590',
                    mcateNm: '수납가구'
                  },
                  {
                    mcateId: '1583592',
                    mcateNm: '학생/사무용가구'
                  },
                  {
                    mcateId: '1583593',
                    mcateNm: '아동가구'
                  },
                  {
                    mcateId: '1588746',
                    mcateNm: '시공/DIY'
                  },
                  {
                    mcateId: '1588759',
                    mcateNm: '침구/커튼/카페트'
                  },
                  {
                    mcateId: '1588764',
                    mcateNm: '홈인테리어'
                  },
                  {
                    mcateId: '1588788',
                    mcateNm: '꽃/원예'
                  }
                ],
                lcateNm: '가구/인테리어',
                tcateId: '1583596'
              },
              {
                tcateNm: 'HOME &amp; LIFESTYLE',
                lcateUrl: '',
                catalogId: '97001',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_1583565.png'
                }],
                lcateId: '1583565',
                mcateList: [
                  {
                    mcateId: '1583579',
                    mcateNm: 'TV/냉장고/세탁기'
                  },
                  {
                    mcateId: '1583582',
                    mcateNm: '계절가전'
                  },
                  {
                    mcateId: '1583583',
                    mcateNm: '노트북/PC/태블릿/주변기기'
                  },
                  {
                    mcateId: '1583587',
                    mcateNm: '블랙박스/자동차'
                  },
                  {
                    mcateId: '1583581',
                    mcateNm: '생활가전'
                  },
                  {
                    mcateId: '1583585',
                    mcateNm: '영상/음향가전'
                  },
                  {
                    mcateId: '1595054',
                    mcateNm: '조리/가열기기'
                  },
                  {
                    mcateId: '1583580',
                    mcateNm: '주방가전'
                  },
                  {
                    mcateId: '1583586',
                    mcateNm: '카메라/캠코더/드론/게임기'
                  },
                  {
                    mcateId: '1583584',
                    mcateNm: '휴대폰/엑세사리'
                  }
                ],
                lcateNm: '가전/디지털',
                tcateId: '1583596'
              },
              {
                tcateNm: 'HOME &amp; LIFESTYLE',
                lcateUrl: '',
                catalogId: '97001',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_1583569.png'
                }],
                lcateId: '1583569',
                mcateList: [
                  {
                    mcateId: '1583626',
                    mcateNm: '펫용품'
                  },
                  {
                    mcateId: '1583627',
                    mcateNm: '펫푸드'
                  }
                ],
                lcateNm: '반려동물',
                tcateId: '1583596'
              },
              {
                tcateNm: 'HOME &amp; LIFESTYLE',
                lcateUrl: '',
                catalogId: '97001',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_1583571.png'
                }],
                lcateId: '1583571',
                mcateList: [
                  {
                    mcateId: '1583628',
                    mcateNm: '골프의류/용품'
                  },
                  {
                    mcateId: '1583629',
                    mcateNm: '등산/캠핑/낚시/자전거'
                  },
                  {
                    mcateId: '1583630',
                    mcateNm: '스포츠의류/슈즈/잡화'
                  },
                  {
                    mcateId: '1583631',
                    mcateNm: '자동차용품'
                  },
                  {
                    mcateId: '1583632',
                    mcateNm: '헬스/요가/수영/스키'
                  }
                ],
                lcateNm: '스포츠/레저',
                tcateId: '1583596'
              },
              {
                tcateNm: 'HOME &amp; LIFESTYLE',
                lcateUrl: '',
                catalogId: '97001',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_1583572.png'
                }],
                lcateId: '1583572',
                mcateList: [
                  {
                    mcateId: '1583633',
                    mcateNm: '렌탈'
                  },
                  {
                    mcateId: '1583634',
                    mcateNm: '여행'
                  },
                  {
                    mcateId: '1583635',
                    mcateNm: '하나투어'
                  }
                ],
                lcateNm: '여행/렌탈',
                tcateId: '1583596'
              },
              {
                tcateNm: 'HOME &amp; LIFESTYLE',
                lcateUrl: '',
                catalogId: '97001',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_1583573.png'
                }],
                lcateId: '1583573',
                mcateList: [
                  {
                    mcateId: '1583637',
                    mcateNm: '기저귀/물티슈'
                  },
                  {
                    mcateId: '1583638',
                    mcateNm: '아동도서/정기구독'
                  },
                  {
                    mcateId: '1583640',
                    mcateNm: '완구/교구'
                  },
                  {
                    mcateId: '1583639',
                    mcateNm: '유아의류/잡화'
                  },
                  {
                    mcateId: '1583636',
                    mcateNm: '출산/발육'
                  }
                ],
                lcateNm: '유아동',
                tcateId: '1583596'
              },
              {
                tcateNm: 'HOME &amp; LIFESTYLE',
                lcateUrl: '',
                catalogId: '97001',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_1583575.png'
                }],
                lcateId: '1583575',
                mcateList: [
                  {
                    mcateId: '1583641',
                    mcateNm: '건강/안마/실버'
                  },
                  {
                    mcateId: '1583642',
                    mcateNm: '생활잡화'
                  },
                  {
                    mcateId: '1583643',
                    mcateNm: '세제/욕실/위생'
                  },
                  {
                    mcateId: '1583644',
                    mcateNm: '세탁/청소용품'
                  },
                  {
                    mcateId: '1583645',
                    mcateNm: '수납/정리용품'
                  },
                  {
                    mcateId: '1583646',
                    mcateNm: '주방용품/식기'
                  },
                  {
                    mcateId: '1583647',
                    mcateNm: '팬시/문구/악기/취미'
                  }
                ],
                lcateNm: '주방/생활/건강',
                tcateId: '1583596'
              },
              {
                tcateNm: 'FASHION &amp; BEAUTY',
                lcateUrl: '',
                catalogId: '97001',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_1583570.png'
                }],
                lcateId: '1583570',
                mcateList: [
                  {
                    mcateId: '1583597',
                    mcateNm: '이미용 기기'
                  },
                  {
                    mcateId: '1583599',
                    mcateNm: '헤어/바디'
                  },
                  {
                    mcateId: '1583598',
                    mcateNm: '화장품/향수'
                  }
                ],
                lcateNm: '뷰티',
                tcateId: '1583594'
              },
              {
                tcateNm: 'FASHION &amp; BEAUTY',
                lcateUrl: '',
                catalogId: '97001',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_1583574.png'
                }],
                lcateId: '1583574',
                mcateList: [
                  {
                    mcateId: '1583603',
                    mcateNm: '가방/패션잡화'
                  },
                  {
                    mcateId: '1583600',
                    mcateNm: '수입명품'
                  },
                  {
                    mcateId: '1583601',
                    mcateNm: '쥬얼리/시계'
                  },
                  {
                    mcateId: '1583602',
                    mcateNm: '패션슈즈'
                  }
                ],
                lcateNm: '잡화/슈즈/쥬얼리',
                tcateId: '1583594'
              },
              {
                tcateNm: 'FASHION &amp; BEAUTY',
                lcateUrl: '',
                catalogId: '97001',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_1583576.png'
                }],
                lcateId: '1583576',
                mcateList: [
                  {
                    mcateId: '1583605',
                    mcateNm: '여성의류'
                  },
                  {
                    mcateId: '1583604',
                    mcateNm: '남성의류'
                  },
                  {
                    mcateId: '1583607',
                    mcateNm: '캐주얼/유니섹스'
                  },
                  {
                    mcateId: '1583606',
                    mcateNm: '언더웨어'
                  }
                ],
                lcateNm: '패션의류',
                tcateId: '1583594'
              },
              {
                tcateNm: '백화점',
                lcateUrl: '',
                catalogId: '23651',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_cate14.png'
                }],
                lcateId: '23651',
                mcateList: [
                  {
                    mcateId: '301501',
                    mcateNm: '갤러리아백화점'
                  },
                  {
                    mcateId: '581054',
                    mcateNm: '패션플러스'
                  }
                ],
                lcateNm: '백화점/패션관',
                tcateId: '23651'
              },
              {
                tcateNm: '',
                lcateUrl: '1357054',
                catalogId: '99999',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_cate15.png'
                }],
                lcateId: '1357054',
                mcateList: [],
                lcateNm: 'TV베스트',
                tcateId: '99999'
              },
              {
                tcateNm: '쇼핑북메인',
                lcateUrl: '',
                catalogId: '18651',
                lcateBannerList: [{
                  lbannerImg: 'images/common/snb/@icon_cate16.png'
                }],
                lcateId: '89301',
                mcateList: [
                  {
                    mcateId: '1613059',
                    mcateNm: '엔에스엔에스'
                  },
                  {
                    mcateId: '20091',
                    mcateNm: '식품'
                  },
                  {
                    mcateId: '20089',
                    mcateNm: '건강식품'
                  },
                  {
                    mcateId: '20092',
                    mcateNm: '패션/잡화/슈즈'
                  },
                  {
                    mcateId: '20093',
                    mcateNm: '화장품/미용/헤어'
                  },
                  {
                    mcateId: '20087',
                    mcateNm: '가구/주방/리빙'
                  },
                  {
                    mcateId: '20088',
                    mcateNm: '가전/디지털'
                  }
                ],
                lcateNm: '쇼핑북',
                tcateId: '89301'
              }
            ]
          }
        },
        catalogId: ['14051'],
        userId: [''],
        langId: ['-9'],
        pageId: ['1'],
        accptPath: ['500'],
        accptPathCd: ['500'],
        storeId: ['13001']
      }

      mock
        .onPost(lnbShopURL)
        .reply(200, mockLnbShopResponse)

      /** 추천 브랜드 조회 mocking */
      const recommandBrandsURL = `${CONST.API_URL}/NSMobileHomeView`
      const mockRecommandBrandsResponse = {
        msg: {
          _EASY_LNB_RCMD_BRAND: [
            {
              espotType: 'MarketingContent',
              espotId: '420453',
              contentMimeType: 'image',
              imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/easy/0115_icon_menu_03.jpg',
              espotTitle: '',
              marketingText: '하림',
              contentsId: '614652',
              clickCode: '',
              espotTitleImgPath: '',
              mdUrl: 'http://www.harim.com/main/index.jsp',
              clickTarget: 'External',
              espotTitleText: '',
              espotTitleMimeType: ''
            },
            {
              espotType: 'MarketingContent',
              espotId: '420453',
              contentMimeType: 'image',
              imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/easy/0115_icon_menu_06.jpg',
              espotTitle: '',
              marketingText: 'NIKE',
              contentsId: '614653',
              clickCode: '',
              espotTitleImgPath: '',
              mdUrl: 'https://www.nike.com/kr/ko_kr/',
              clickTarget: 'External',
              espotTitleText: '',
              espotTitleMimeType: ''
            },
            {
              espotType: 'MarketingContent',
              espotId: '420453',
              contentMimeType: 'image',
              imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/easy/0115_icon_menu_02.jpg',
              espotTitle: '',
              marketingText: '동아ST',
              contentsId: '614654',
              clickCode: '',
              espotTitleImgPath: '',
              mdUrl: 'http://www.donga-st.com/Main.da',
              clickTarget: 'External',
              espotTitleText: '',
              espotTitleMimeType: ''
            }
          ]
        },
        catalogId: ['14051'],
        viewTaskName: 'NSAjaxActionResponse',
        espotInfo: ['EASY_LNB_RCMD_BRAND|Content'],
        userId: [''],
        typeFlag: ['espot'],
        langId: ['-9'],
        accptPath: ['500'],
        accptPathCd: ['500'],
        storeId: ['13001']
      }

      mock
        .onPost(recommandBrandsURL)
        .reply(200, mockRecommandBrandsResponse)

      vm.toggleSnb(false)
      vm.toggleSnb(true)

      await flushPromises()
    })
  })

  describe('updated', () => {
    it('컴포넌트가 업데이트 될 때 회원정보가 데이터에 반영된다.', () => {
      vm.$forceUpdate()
    })
  })

  describe('isCompanyHarim', () => {
    it('하림 임직원 여부를 반환한다', async () => {
      const getCompanyGroupListURL = `${CONST.API_URL}/GetCompanyGroupList`
      mock
        .onPost(getCompanyGroupListURL)
        .reply(200, getCompanyGroupListResponse)

      await vm.isCompanyHarim()
      await flushPromises()
    })
  })

  describe('isCompanyNS', () => {
    it('NS 임직원 여부를 반환한다', () => {
      const nonNs = vm.isCompanyNS()
      assert.equal(nonNs, false)
    })
  })

  describe('handleLogout', () => {
    it('로그아웃 확인', async () => {
      await vm.handleLogout()

      await flushPromises()
    })
  })

  describe('getMyBenefit', () => {
    const lnbBenefitURL = `${CONST.API_URL}/LnbBenefit`

    it('비회원의 혜택 정보를 조회한다', async () => {
      mock
        .onPost(lnbBenefitURL)
        .reply(200, lnbBenefitNoMemberResponse)

      await vm.getMyBenefit()
      await flushPromises()
    })

    it('일반회원의 혜택 정보를 조회한다', async () => {
      mock
        .onPost(lnbBenefitURL)
        .reply(200, lnbBenefitGeneralMemberResponse)

      await vm.getMyBenefit()
      await flushPromises()
    })

    // it('하림회원의 혜택 정보를 조회한다', async () => {
    //   mock
    //     .onPost(lnbBenefitURL)
    //     .reply(200, lnbBenefitHarimMemberResponse)

    //   await vm.getMyBenefit()
    //   await flushPromises()
    // })
  })

  describe('goMidCateStore', () => {
    it('카테고리 매장 페이지로 이동한다', () => {
      const mockCateogryId = '1000'
      vm.goMidCateStore(mockCateogryId)
    })
  })

  describe('goMyPageMain', () => {
    it('마이페이지로 이동한다', () => {
      vm.goMyPageMain()
    })
  })
})
