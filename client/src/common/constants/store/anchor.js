// contentsId 대한 정의된 상수
const ANCHOR_CONST = {
  FIRST_PARAMETERS: [
    'EZ_HOME_TOPA_ESPOT_CNTNTSLIDEEXTEND|ESPOT_CNTNTSLIDEEXTEND|1|10|0',
    'EZ_HOME_TOPD_ESPOT_CNTNTCIRCLESLIDE|ESPOT_CNTNTCIRCLESLIDE|1|15|0',
    'EZ_HOME_TOPE_ESPOT_CNTNTSLIDE15W|ESPOT_CNTNTSLIDE15W|1|10|0',
    'EZ_HOME_ANCHOR1A_ESPOT_CNTNTPROM|ESPOT_CNTNTPROM|1|9999|0',
    'EZ_HOME_ANCHOR1B_ESPOT_PRDWIDE|ESPOT_PRDWIDE|1|10|0'
  ],
  SECOND_PARAMETERS_EXTEND: {
    TYPE_FLAG: 'espot',
    TARGET_ESPOT_ID: 'EZ_HOME_ANCHOR4D_RCMDUSER_PRDRCMDUSER',
    ESPOT_INFO: 'EZ_HOME_ANCHOR4D_RCMDUSER_PRDRCMDUSER|RCMDUSER_PRDRCMDUSER|1|15|0' // 4D
  },
  ANCHOR_MENU_PARAMETERS: {
    COMMAND_NAME: 'NSMobHomeView',
    PARAMETERS: {
      TYPE_FLAG: 'espot',
      ESPOT_INFO: 'EZ_HOME_ANCHOR_ESPOT_SLIDE_TITLE|Content'
    }
  },
  PARAMETERS: {
    tv: 'EZ_HOME_ANCHOR2A_ESPOT_CNTNTPROM|ESPOT_CNTNTPROM|1|9999|0' + // 2A
        '$EZ_HOME_ANCHOR2B_ESPOT_PRDWIDE|ESPOT_PRDWIDE|1|10|0', // 2B
    happydeal: 'EZ_HOME_ANCHOR3A_ESPOT_CNTNTPROM|ESPOT_CNTNTPROM|1|9999|0' + // 3A
               '$EZ_HOME_ANCHOR3B_ESPOT_PRDWIDE|ESPOT_PRDWIDE|1|10|0', // 3B
    today: 'EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE|RCMDSEARCH_TEXTSLIDE|1|20|0' + // 4A
           '$EZ_HOME_ANCHOR4B_RCMDCLICK_PRDSLIDESQUARE25W|RCMDCLICK_PRDSLIDESQUARE25W|1|15|0' + // 4B
           '$EZ_HOME_ANCHOR4C_ESPOT_CNTNT4W|ESPOT_CNTNT4W|1|12|0', // 4C
    food: 'EZ_HOME_ANCHOR5A_ESPOT_CNTNTPRDLIST|ESPOT_CNTNTPRDLIST|1|3|0' + // 5A
          '$EZ_HOME_ANCHOR5B_ESPOT_CNTNTPRDLIST|ESPOT_CNTNTPRDLIST|1|3|0' + // 5B
          '$EZ_HOME_ANCHOR5C_ESPOT_CNTNTLIST|ESPOT_CNTNTLIST|1|3|0', // 5C
    beauty: 'EZ_HOME_ANCHOR6A_ESPOT_CNTNTPRDGRID4W|ESPOT_CNTNTPRDGRID4W|1|8|0' + // 6A
            '$EZ_HOME_ANCHOR6B_ESPOT_CNTNTPRDSLIDE|ESPOT_CNTNTPRDSLIDE|1|20|0' + // 6B
            '$EZ_HOME_ANCHOR6C_ESPOT_CNTNTLIST|ESPOT_CNTNTLIST|1|3|0', // 6C
    life: 'EZ_HOME_ANCHOR7A_ESPOT_CNTNTPRDLIST|ESPOT_CNTNTPRDLIST|1|3|0' + // 7A
          '$EZ_HOME_ANCHOR7B_ESPOT_CNTNTPRDSLIDE|ESPOT_CNTNTPRDSLIDE|1|20|0' + // 7B
          '$EZ_HOME_ANCHOR7C_ESPOT_CNTNTLIST|ESPOT_CNTNTLIST|1|3|0' // 7C
  },
  CHANNEL_TEXT: {
    TV: 'TV',
    SHOPPLUS: 'CTCOM'
  },
  BENEFIT_TEXT: {
    isDepartment: '백화점',
    isTvShopping: 'TV쇼핑',
    isTvShopPlus: 'TV쇼핑', // Shop+에서 요청사항에 의해 TV쇼핑으로 변경
    isHappyDeal: '해피딜',
    isShoppingBook: '쇼핑북',
    dlvrPrice: '무료배송',
    ifiValue: '무이자',
    padValue: '적립금'
  },
  MORE_VIEW_KOREA_TEXT: {
    more: '더보기'
  },
  CLICK_TARGET_LOWER_CASE: {
    Product: 'product',
    Category: 'category',
    External: 'external'
  }
}

export default ANCHOR_CONST