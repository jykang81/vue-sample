import ANCHOR_CONST from '@/common/constants/store/anchor'
import bizUtil from '@utils/bizUtil'
import {
  isNull,
  htmlDecode,
  getBytes,
  getCutBytes,
  insertCommas
} from '@utils/commonutil/commonUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import uiUtil from '@utils/uiUtil'
import storeFormlessMixin from '@/mixins/store/storeFormlessMixin'
import consultationMixin from '@/mixins/product/consultationMixin'
import { PRODUCT_CONST } from '@/common/constants/product/product'

/**
 * Home and Anchor Espot Mixin
 */
const anchorMixin = {
  mixins: [
    storeFormlessMixin,
    consultationMixin
  ],
  data () {
    return {
      bannerAllView: false
    }
  },
  methods: {
    isNull,
    /**
     * 클릭 타겟값이 external 이면 true, 아니면 false 반환.
     * @param {String} clickTarget - Category, Product, External
     * @returns {bool}
     */
    bannerCommonExternalUrlCheck (clickTarget) {
      let checker = false
      const targetLowerCase = ANCHOR_CONST.CLICK_TARGET_LOWER_CASE[clickTarget]
      if (targetLowerCase === 'external') {
        checker = true
      }
      return checker
    },
    /**
     * espot 배너 클릭 이벤트 공통함수 호출.
     *
     * @param {string} target 이동할 타겟 구분(Product, Category, Internal, External)
     * @param {string} contentsId 컨텐츠 ID
     * @param {string} clickCode 이동할 상품코드 또는 카테고리코드
     * @param {string} espotId ESPOT ID
     * @param {string} mdUrl 이동할 md URL
     * @param {string} [catalogId] 카탈로그 ID
     * @param {String} [clksrc] - 전자상거래코드
     * @param {string} bannerTitle 배너명
     */
    bannerCommonClickEvent (target, contentsId, clickCode, espotId, mdUrl, catalogId, clksrc, bannerTitle) {
      // 마케팅 스크립트 적용 부분
      // GA360
      if (clksrc === '메인_상단배너') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_메인',
            eventAction: '상단띠배너',
            eventLabel: bannerTitle,
            params: {
              t1: null
            }
          }
        })
        // E-commerce
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
            params: [
              {
                id: String(clickCode),
                name: bannerTitle
              }
            ],
            subparams: {
              t1: '메인',
              t2: '상단배너',
              product_list: clksrc
            }
          }
        })
      }
      if (clksrc === '메인_중간배너') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_메인',
            eventAction: '기획전배너',
            eventLabel: bannerTitle,
            params: {
              t1: null
            }
          }
        })
        // E-commerce
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
            params: [
              {
                id: String(clickCode),
                name: bannerTitle
              }
            ],
            subparams: {
              t1: '메인',
              t2: '중간배너',
              product_list: clksrc
            }
          }
        })
      }
      if (clksrc === '버튼배너') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_메인',
            eventAction: '버튼배너',
            eventLabel: bannerTitle,
            params: {
              t1: null
            }
          }
        })
      }
      if (clksrc === '메인_지금인기_배너') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_메인',
            eventAction: 'Tab_배너',
            eventLabel: `지금인기_${bannerTitle}`,
            params: {
              t1: null
            }
          }
        })
        // ecommerce
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
            params: [
              {
                id: String(clickCode)
              }
            ],
            subparams: {
              t1: '메인',
              t2: '지금인기',
              t3: '배너',
              product_list: clksrc
            }
          }
        })
      }
      if (clksrc === '메인_TV추천_배너') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_메인',
            eventAction: 'Tab_배너',
            eventLabel: `TV추천_${bannerTitle}`,
            params: {
              t1: null
            }
          }
        })
        // ecommerce
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
            params: [
              {
                id: String(clickCode)
              }
            ],
            subparams: {
              t1: '메인',
              t2: 'TV추천',
              t3: '배너',
              product_list: clksrc
            }
          }
        })
      }
      if (clksrc === '메인_해피딜_배너') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_메인',
            eventAction: 'Tab_배너',
            eventLabel: `해피딜_${bannerTitle}`,
            params: {
              t1: null
            }
          }
        })
        // ecommerce
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
            params: [
              {
                id: String(clickCode)
              }
            ],
            subparams: {
              t1: '메인',
              t2: '해피딜',
              t3: '배너',
              product_list: clksrc
            }
          }
        })
      }
      if (clksrc === '메인_푸드/건강_배너') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_메인',
            eventAction: 'Tab_배너',
            eventLabel: `푸드/건강_${bannerTitle}`,
            params: {
              t1: null
            }
          }
        })
        // ecommerce
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
            params: [
              {
                id: String(clickCode)
              }
            ],
            subparams: {
              t1: '메인',
              t2: '푸드/건강',
              t3: '배너',
              product_list: clksrc
            }
          }
        })
      }
      if (clksrc === '메인_뷰티/패션_배너') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_메인',
            eventAction: 'Tab_배너',
            eventLabel: `뷰티/패션_${bannerTitle}`,
            params: {
              t1: null
            }
          }
        })
        // ecommerce
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
            params: [
              {
                id: String(clickCode)
              }
            ],
            subparams: {
              t1: '메인',
              t2: '뷰티/패션',
              t3: '배너',
              product_list: clksrc
            }
          }
        })
      }
      if (clksrc === '메인_생활/가전_배너') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_메인',
            eventAction: 'Tab_배너',
            eventLabel: `생활/가전_${bannerTitle}`,
            params: {
              t1: null
            }
          }
        })
        // ecommerce
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
            params: [
              {
                id: String(clickCode)
              }
            ],
            subparams: {
              t1: '메인',
              t2: '생활/가전',
              t3: '배너',
              product_list: clksrc
            }
          }
        })
      }
      if (clksrc === '메인_인기매장') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_메인',
            eventAction: '인기매장',
            eventLabel: bannerTitle,
            params: {
              t1: null
            }
          }
        })
      }
      if (clksrc === '메인_중간띠배너') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_TV쇼핑',
            eventAction: '중간띠배너',
            eventLabel: bannerTitle,
            params: {
              t1: null
            }
          }
        })
      }
      if (this.bannerAllView) { this.bannerAllViewClose() }
      if (isNull(target)) {
        return false
      } else {
        bizUtil.espotClickEvent(target, contentsId, clickCode, espotId, mdUrl, catalogId, clksrc)
      }
    },
    /**
     * 상품형 확장 데이터 - 더보기 버튼의 유효성 검사.
     * @param {Object} object - espotExtendList 의 특정 속성
     * @returns {bool}
     */
    checkMoreView (object) {
      return !isNull(object) && Object.keys(object.titleContent).length && !isNull(object.titleContent.mdUrl)
    },
    /**
     * 특정 문자 치환하는 메소드 호출 - &amp;, &gt; 등등...
     * @param {String} string - 치환대상
     * @returns {String}
     */
    getHtmlDecode (string) {
      return htmlDecode(string)
    },
    /**
     * 메인타이틀, 서브타이틀 등의 컨텐츠성 데이터 유무.
     * @returns {bool}
     */
    hasEspotExtendList () {
      return this.espotExtendList && Object.keys(this.espotExtendList.titleContent).length > 0
    },
    /**
     * 문자열 바이트 반환.
     * @param {String} targetString - 대상 문자열
     * @returns {String}
     */
    getBytes (targetString) {
      return getBytes(targetString)
    },
    /**
     * 문자열 12바이트 컷트.
     * @param {String} targetString - 대상 문자열
     * @returns {String}
     */
    getCutBytes (targetString) {
      return getCutBytes(targetString, 12)
    },
    /**
     * 12바이트 이하인지 아닌지 판단후 bool 반환.
     * @param {String} targetString - 대상 문자열
     * @returns {bool}
     */
    is12ByteLow (targetString) {
      return Number(getBytes(htmlDecode(targetString))) <= 12
    },
    /**
     * 공통함수 isNull 호출.
     * @param {*} param - 널 체크 타겟
     * @returns {bool}
     */
    getIsNull (param) {
      return isNull(param)
    },
    /**
     * 컴마 넣어준는 공통메소드 호출
     * @param {String} string - 대상 문자열
     * @returns {String}
     */
    getInsertCommas (string) {
      return insertCommas(string)
    },
    /**
     * 채널정보 체크후 반환. (없을경우 0개)
     * @param {Object} param - TV, CTCOM, 해피딜 혜택정보 Object
     * @returns {Array} array
     */
    getChannelInfo (param) {
      const array = []
      if (param.buschnId === ANCHOR_CONST.CHANNEL_TEXT.TV) { array.push(ANCHOR_CONST.BENEFIT_TEXT.isTvShopping) }
      if (param.buschnId === ANCHOR_CONST.CHANNEL_TEXT.SHOPPLUS) { array.push(ANCHOR_CONST.BENEFIT_TEXT.isTvShopPlus) }
      if (param.isFlashSale === 'Y') { array.push(ANCHOR_CONST.BENEFIT_TEXT.isHappyDeal) }
      return array
    },
    /**
     * 채널정보에 해당하는 CSS Class 반환
     * @param {Object} channel - 채널 정보
     * @returns {String} - 채널에 해당하는 CSS Class
     */
    getChannelStyle (channel) {
      let className = ''
      if ([ANCHOR_CONST.BENEFIT_TEXT.isTvShopping, ANCHOR_CONST.BENEFIT_TEXT.isTvShopPlus].includes(channel)) {
        className = 'tv'
      } else if (channel === ANCHOR_CONST.BENEFIT_TEXT.isHappyDeal) {
        className = 'happydeal'
      } else {
        className = ''
      }
      return className
    },
    /**
     * 혜택정보 0~3개 생성후 반환. (없을경우 0개)
     * @param {Object} param - 혜택정보
     * @returns {Array} array
     */
    getBenefitInfo (param) {
      const formlessChecker = !isNull(param.dispTypeCd) ? this.checkFormlessProduct(param.dispTypeCd) : false
      const array = []
      if (param.dlvrFreeYn === 'Y' && !formlessChecker) { array.push(ANCHOR_CONST.BENEFIT_TEXT.dlvrPrice) }
      if (Number(param.promIfiVal) > 0) { array.push(ANCHOR_CONST.BENEFIT_TEXT.ifiValue) }
      if (param.promPadYn === 'Y') { array.push(ANCHOR_CONST.BENEFIT_TEXT.padValue) }
      return array
    },
    /**
     * AnchorToday 컴포넌트에서 서브 타이틀 유무 여부 반환.
     * @param {Object} titleContent - espotExtendList 의 해당앵커 속성값
     * @returns {bool}
     */
    hasMarketingText (titleContent) {
      return !isNull(titleContent) && !isNull(titleContent.marketingText)
    },
    /**
     * AnchorToday 컴포넌트에서 서브 타이틀 가공후 반환.
     * @param {String} marketingText - marketingText 속성
     * @returns {String}
     */
    getMarketingText (marketingText) {
      const marketingTextDecode = htmlDecode(marketingText)
      let result = marketingTextDecode
      if (!isNull(marketingTextDecode)) {
        result = marketingTextDecode.replace('<br/>', ' ')
      }
      return result
    },
    /**
     * 컨텐츠형 또는 상품형 espot 확장 데이터 유무 반환.
     * @param {Object} espotExtentListChildNode - espot 확장 데이터
     * @returns {bool}
     */
    hasExtendList (espotExtentListChildNode) {
      return Object.keys(espotExtentListChildNode).length > 0
    },
    /**
     * 특정값을 검사하여 br 태그 유무에 따라 bool 반환.
     * @param {Object} param - 메인 타이틀 + 태그
     * @returns {bool}
     */
    hasBrTag (param) {
      if (isNull(param)) { return false }
      const brTagIndex = String(param).indexOf('br/') > -1
      return brTagIndex
    },
    /**
     * 특정값을 검사하여 br 태그를 기준으로 태그부분만 나눠준다.
     * @param {String} param - 검사 대상 문자열
     * @param {String} identify - 타이틀인지 태그인지에 판단후에 해당 값만 반환.
     * @returns {String}
     */
    brTagSplit (param, identify) {
      let returnString = ''
      if (identify === 'title') {
        returnString = htmlDecode(param).split('<br/>')[0]
      } else if (identify === 'tag') {
        returnString = htmlDecode(param).split('<br/>')[1]
      }
      return returnString
    },
    /**
     * 오브젝트 와 상품코드 null 체크후 bool 반환.
     * @param {Object} value - 상품 데이터
     * @returns {bool}
     */
    isNotNullProductDetail (value) {
      return !isNull(value) && !isNull(value.partnumber)
    },
    /**
     * 상품에 쓰레기값만 남아있는경우 영역을 숨기기 위한 메소드.
     * @param {Object} value - 상품 데이터
     * @returns {String}
     */
    setClassNameHasSlideData (value) {
      const checker = this.isNotNullProductDetail(value)
      if (checker) {
        return ''
      } else {
        return 'display_none'
      }
    },
    /**
     * 상품 상세 페이지로 이동
     *
     * @param {string} partNumber 상품번호
     * @param {Object} [params={}] params
     */
    gotoProductDetail (partNumber, params) {
      bizUtil.gotoProductDetail(partNumber, params)
    },
    /**
     * 앵커 1,2,3번에서만 쓰이는 기능 - 와이드형 기본형인지, 바로구매형인지, 바로장바구니형인지 판단.
     *
     * @param {Object} param - 유효성 검사 타겟
     * @returns {bool || String}
     */
    hasBuyOrCartButton (param) {
      let checker = !isNull(param) && Object.keys(param).length > 0
      if (checker) { checker = Object.keys(param.css).length > 0 }
      if (checker) { checker = !isNull(param.css.prdAddBtn) }
      if (checker) {
        return param.css.prdAddBtn
      } else {
        return checker
      }
    },
    /**
     * 앵커 1,2,3번에서만 쓰이는 기능 - 와이드형 상품에서 구매수량을 노출, 미노출 여부 확인
     *
     * @param {Object} param - 유효성 검사 타겟
     * @returns {bool || String}
     */
    isOrdQtyHide (param) {
      let checker = !isNull(param) && Object.keys(param).length > 0
      if (checker) { checker = Object.keys(param.css).length > 0 }
      if (checker) { checker = !isNull(param.css.ordQtyHide) }
      if (checker) { checker = param.css.ordQtyHide === 'Y' }
      return checker
    },
    /**
     * 컨텐츠형의 경우 상품코드가 없으므로 imgUrl 링크에서 강제 추출.
     * @param {String} param - 추출 대상 타겟 url
     * @returns {String}
     */
    getPartNumberFromImgUrl (param) {
      const splitUrl = param.split('/')[param.split('/').length - 1]
      const partNumber = splitUrl.split('_')[0]
      try {
        Number(partNumber)
        return partNumber
      } catch (e) {
        return null
      }
    },
    /**
     * br태그가 있는 경우 모두 없앤후 반환.
     * @param {String} param - 치환 타겟 대상
     * @returns {String}
     */
    brTagReplaceAll (param) {
      const result = param.replace(/(<br>|<br\/>|<br \/>)/g, '')
      return result
    },
    /**
     * 배너 전체보기 열기.
     */
    bannerAllViewOpen () {
      uiUtil.disableScroll()
      this.bannerAllView = true
    },
    /**
     * 배너 전체보기 닫기.
     */
    bannerAllViewClose () {
      uiUtil.enableScroll()
      this.bannerAllView = false
    },
    /**
     * 뱃지 정보 렌더링을 위한 index 반환.
     * @param {Array} badge - 뱃지 배열.
     * @param {String} label - 뱃지 속성값.
     * @returns {Number}
     */
    getBadgeInfo (badge, label) {
      badge.forEach((element, index) => {
        if (!isNull(badge[index][label])) {
          return index
        } else {
          return false
        }
      })
    },
    /**
     * 무형상품 체크 - 무형상품이면 true 아니면 false 반환.
     * @param {String} dispCd - 전시 타입 코드
     * @returns {bool}
     */
    checkIntangiblePrd (dispCd) {
      const intangiblePrd = [
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_TRAVEL,
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_INSURANCE,
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL,
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_FUNERAL,
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_ADVERTISEMENT,
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_PHONE
      ]

      return intangiblePrd.includes(dispCd)
    },
    /**
     * 방송 날짜, 시간 텍스트에 #이 있는경우 제외하고 보여줌.
     * @param {String} onAirTime - 방송 날짜, 시간 텍스트
     * @returns {String}
     */
    hashToSpace (onAirTime) {
      return onAirTime.replace('#', ' ')
    }
  }
}

export default anchorMixin
