const lnbBenefitNoMemberResponse = {
  msg: {
    root: {
      NoticeList: [],
      _GNB_CARD_CONTENTS: [{
        espotType: 'MarketingContent',
        espotId: '150466',
        contentMimeType: 'image',
        imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/banner/common/2015/07/d0707_free_GNB_CARD_CONTENTS.png',
        espotTitle: '',
        marketingText: 'MOBILE:삼성|5|%&lt;br/&gt;',
        contentsId: '219671',
        clickCode: '-8201',
        espotTitleImgPath: '',
        mdUrl: 'CategoryDisplay?identifier=-8201&amp;categoryId=-8201&amp;catalogId=14051&amp;storeId=13001',
        clickTarget: 'Category',
        espotTitleText: '',
        espotTitleMimeType: ''
      }]
    }
  },
  catalogId: ['14051'],
  userId: [''],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001']
}

const lnbBenefitGeneralMemberResponse = {
  msg: {
    root: {
      BenefitInfo: {
        giftCard: '0',
        saveMoney: '0',
        couponCnt: 0,
        balance: '0',
        tolPoint: '0'
      },
      GradeInfo: {
        currentGrd: 'R10',
        memberGubun: 'K',
        currentGrdName: '패밀리',
        staffInfo: '',
        isEmpMbr: 'N'
      },
      NoticeList: [],
      _GNB_CARD_CONTENTS: [{
        espotType: 'MarketingContent',
        espotId: '150466',
        contentMimeType: 'image',
        imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/banner/common/2015/07/d0707_free_GNB_CARD_CONTENTS.png',
        espotTitle: '',
        marketingText: 'MOBILE:삼성|5|%&lt;br/&gt;',
        contentsId: '219671',
        clickCode: '-8201',
        espotTitleImgPath: '',
        mdUrl: 'CategoryDisplay?identifier=-8201&amp;categoryId=-8201&amp;catalogId=14051&amp;storeId=13001',
        clickTarget: 'Category',
        espotTitleText: '',
        espotTitleMimeType: ''
      }]
    }
  },
  catalogId: ['14051'],
  userId: ['111832279'],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001']
}

const lnbBenefitHarimMemberResponse = {
  msg: {
    root: {
      BenefitInfo: {
        giftCard: '0',
        saveMoney: '0',
        couponCnt: 0,
        balance: '0',
        tolPoint: '0'
      },
      GradeInfo: {
        currentGrd: 'R10',
        memberGubun: 'K',
        currentGrdName: '패밀리',
        staffInfo: {
          expiredDate: {
            month: 5,
            _classname: 'java.sql.Date',
            class: 'java.sql.Date',
            _type: 'JavaClass',
            timezoneOffset: -540,
            day: 3,
            time: 1654009200000,
            year: 122,
            date: 1,
            seconds: null,
            minutes: null,
            hours: null
          },
          _classname: 'com.ns.commerce.staff.bean.StaffInfoBean',
          userId: '111453107',
          class: 'com.ns.commerce.staff.bean.StaffInfoBean',
          companyGroupMail: 'kwonhyukwoo_harim@nsmall.com',
          _type: 'JavaClass',
          nsEmpTopCategoryId: null,
          companyGroupCode: 'HARIMGROUP'
        },
        isEmpMbr: 'Y'
      },
      NoticeList: [],
      _GNB_CARD_CONTENTS: [{
        espotType: 'MarketingContent',
        espotId: '150466',
        contentMimeType: 'image',
        imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/banner/common/2015/07/d0707_free_GNB_CARD_CONTENTS.png',
        espotTitle: '',
        marketingText: 'MOBILE:삼성|5|%&lt;br/&gt;',
        contentsId: '219671',
        clickCode: '-8201',
        espotTitleImgPath: '',
        mdUrl: 'CategoryDisplay?identifier=-8201&amp;categoryId=-8201&amp;catalogId=14051&amp;storeId=13001',
        clickTarget: 'Category',
        espotTitleText: '',
        espotTitleMimeType: ''
      }]
    }
  },
  catalogId: ['14051'],
  userId: ['111453107'],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001']
}

export { lnbBenefitNoMemberResponse, lnbBenefitGeneralMemberResponse, lnbBenefitHarimMemberResponse }
