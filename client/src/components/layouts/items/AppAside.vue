<template>
  <aside
    class="app_aside"
    :class="activeSnb ? 'active' : ''"
  >
    <div
      class="aside_wrapper"
      :class="asideWrapperClass"
    >
      <div class="user_control">
        <!-- 로그인 -->
        <template v-if="isLoggedIn">
          <div class="user_if">
            <strong class="name" @click="goMyPageMain"><span>{{ userName }}</span>님</strong>
            <span v-if="staffInfoName" class="unit">{{ staffInfoName }}</span>
          </div>
          <div class="user_btn">
            <button
              type="button"
              class="btn_setting"
              @click="gotoSetting"
            >
              환경 설정
            </button>
            <button
              v-if="isOsApp()"
              type="button"
              class="btn_alert"
              @click="alertSetting"
            >
              쇼핑 알림
              <span v-if="totalCnt > 0" class="count">{{ totalCnt }}</span>
            </button>
          </div>
        </template>
        <!-- 비로그인 -->
        <template v-else>
          <div class="user_if">
            <button
              type="button"
              class="user_login"
              @click="gotoLogin"
            >
              로그인 해주세요
            </button>
          </div>
          <div class="user_btn">
            <button
              type="button"
              class="btn_setting"
              @click="gotoSetting"
            >
              환경 설정
            </button>
            <button
              v-if="isOsApp()"
              type="button"
              class="btn_alert"
              @click="alertSetting"
            >
              쇼핑 알림
              <span v-if="totalCnt > 0" class="count">{{ totalCnt }}</span>
            </button>
          </div>
        </template>
      </div>
      <div class="snb_contents_wrap">
        <div v-if="cateList.length" class="section_cate">
          <ul
            v-for="(value, index) in cateList"
            :key="`${index}`"
            class="wrap_cate"
          >
            <li :class="`cate_itmes cate_itmes${index} ${isBlindCheck(value.lcateId)}`">
              <div
                class="title"
                @click="dropDownMenuOpen(index, value.lcateNm)"
              >
                <span class="icon">
                  <img
                    v-if="!isNull(value.lbannerImg)"
                    :src="require(`@/assets/images/common/snb/${getAssetImage(value.lbannerImg)}`)"
                    :alt="value.lcateNm"
                  >
                  <img
                    v-else
                    src="~@/assets/images/common/img_noImage_square.png"
                    :alt="value.lcateNm"
                  >
                </span>
                {{ value.lcateNm }}
              </div>
              <ul
                class="wrap_midcate"
              >
                <li
                  v-for="(mcateValue, mcateIndex) in value.mcateList"
                  :key="mcateIndex"
                >
                  <button
                    type="button"
                    @click="goMidCateStore(mcateValue.mcateId, mcateIndex, mcateValue.mcateNm)"
                  >
                    {{ mcateValue.mcateNm }}
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div v-if="recommandBrandList.length > 0" class="section_brand">
          <strong class="title">추천 브랜드</strong>
          <swiper
            ref="brandSwiper"
            :options="brandSwiper"
            class="img_slide"
          >
            <swiper-slide
              v-for="(value, index) in recommandBrandList.slice(0, 15)"
              :key="`${index}`"
            >
              <div
                aria-label="배너 목록"
                class="item"
                @click="bannerCommonClickEvent(value.clickTarget, value.clickCode, value.mdUrl, index, htmlDecode(isNull(value.marketingText) ? value.contentName : value.marketingText), 'external', value.contentsId, value.espotId)"
              >
                <figure>
                  <ns-img
                    :src="value.imgUrl"
                    :alt="value.marketingText !== '' ? value.marketingText : '추천 브랜드'"
                    type="SQUARE"
                  />
                </figure>
                <span>
                  {{ htmlDecode(value.marketingText) }}
                </span>
              </div>
            </swiper-slide>
          </swiper>
        </div>
        <div class="section_link">
          <router-link v-show="hasNoticeList()" :to="{ name: 'custCenterNotice' }" event="" @click.native.prevent="noticeListLogging">
            <strong>공지사항</strong>
            <span>{{ noticeList.subject }}</span>
          </router-link>
          <router-link v-show="isEmpMbr && (isCompanyNS() || companyGroupFlag)" :to="`/store/slot/${getHarimStoreNumber}`" event="" @click.native.prevent="companyHarimLogging">
            <strong>하림특가매장</strong>
          </router-link>
          <router-link v-show="isEmpMbr && isCompanyNS() && !isNull(nsEmpTopCategoryId)" :to="`/store/slot/${nsEmpTopCategoryId}`" event="" @click.native.prevent="companyNSLogging">
            <strong>사내특가매장</strong>
          </router-link>
        </div>
        <div class="section_btn">
          <button v-if="!isLoggedIn" type="button" class="btn_login" @click="gotoLogin">
            <span>로그인</span>
          </button>
          <button v-if="isLoggedIn" type="button" class="btn_logout" @click="handleLogout">
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="!isOsApp()"
      class="dimmed_all"
      :class="{ active: showDimmed }"
      @click="toggleSnb(false)"
    />
  </aside>
</template>

<script>
import bizUtil from '@utils/bizUtil'
import {
  isOsApp,
  isNull,
  htmlDecode,
  viewType
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import nativeUtil from '@frameworks/nativeUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import CONST from '@constants/framework/framework'
import NATIVE_CONST from '@constants/framework/native'
import COMM_CONST from '@/common/constants/framework/constants'
import LNB_CONST from '@/common/constants/common/lnb'
import toastUtil from '@frameworks/toastUtil'
import { mapState, mapMutations } from 'vuex'
import ANCHOR_CONST from '@/common/constants/store/anchor'
import customerInputMixin from '@/mixins/customer/customerInputMixin'
import cipherUtil from '@frameworks/cipherUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import NsImg from '@components/common/NsImg'
import uiUtil from '@utils/uiUtil'
import messageUtil from '@frameworks/messageUtil'
import LOGIN_CONST from '@constants/customer/login'
import nsaxios from '@frameworks/axiosUtil'

export default {
  name: 'AppAside',
  components: {
    NsImg
  },
  mixins: [
    customerInputMixin
  ],
  props: {
    activeSnb: { // SNB 활성화 여부
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      showDimmed: false, // dimmed 노출 여부
      staffInfoName: '', // 임직원 뱃지
      userName: '', // 사용자명
      isLoggedIn: false, // 로그인 여부,
      dropDownMenu: '', // 2depth 메뉴
      cateList: [], // 카테고리 리스트
      noticeList: {}, // 공지사항
      isEmpMbr: false, // 임직원여부
      companyGroupCode: '', // 계열사 코드
      recommandBrandList: [], // 추천브랜드 리스트
      isAutoLoginCheck: false, // 자동로그인 체크여부
      totalCnt: 0,
      brandSwiper: {
        slidesPerView: 'auto',
        spaceBetween: 12
      },
      companyGroupFlag: false, // 하림 임직원 여부 플래그.
      nsEmpTopCategoryId: null // 사내특가매장 번호 (API 조회값.)
    }
  },
  computed: {
    ...mapState('layouts', ['isNativeCss']),
    /**
     * app 환경일 때 wrapper style class 반환
     * @returns {String}
     */
    asideWrapperClass () {
      return isOsApp() ? 'lnb_left' : ''
    },

    /**
     * 하림 특가의 매장코드 반환.
     * @returns {Number}
     */
    getHarimStoreNumber () {
      return CONST.CATEGORY_ID_HARIM
    },
    /**
     * 사내 특가의 매장코드 반환.
     * @returns {Number}
     */
    getEmployeeStoreNumber () {
      return CONST.CATEGORY_ID_EMPLOYEE
    }
  },
  watch: {
    'activeSnb' (isActive) {
      this.toggleSnb(isActive)

      if (isActive) {
        // GA 360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_공통영역',
            eventAction: '하단GNB',
            eventLabel: '카테고리',
            params: {
              t1: null
            }
          }
        })

        if (!this.cateList.length) {
          this.setLnbInfo()
        }

        uiUtil.disableScroll()
      } else {
        uiUtil.enableScroll()
      }
    },
    '$route' () {
      // 페이지 이동 시 SNB 닫음
      this.toggleSnb(false)
    }
  },
  created () {
    this.init()
  },
  mounted () {
    if (isOsApp()) { // APP
      // APP 실행시 자동 로그인 체크 위해 호출
      nativeUtil.isAppFirstLogin('callbackAppFirstLogin')

      // PUSH UUID 가져와서 콜백함수에서 스토리지에 저장
      if (isNull(localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.PUSH_UUID))) {
        nativeUtil.getPushUUID('callbackPushUUID')
      }
    }
  },
  beforeDestroy () {
    uiUtil.enableScroll()
  },
  updated () {
    if (!isOsApp()) { // WEB
      // 임직원 뱃지, 사용자명, 로그인 여부 업데이트
      this.staffInfoName = loginUtil.getUserInfo('staffInfoName')
      this.userName = loginUtil.userName()
      this.isLoggedIn = loginUtil.isLoggedIn()
    }
  },
  methods: {
    isOsApp,
    htmlDecode,
    isNull,
    ...mapMutations('layouts', ['setIsNativeCss']),
    /**
     * 공지사항 클릭
     */
    noticeListLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_LNB',
          eventAction: '공지사항',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })

      if (isOsApp()) { // APP
        nativeUtil.gotoURL('/custcenter/notice')
        nativeUtil.lnbHide()
      } else {
        this.$router.push({ name: 'custCenterNotice' }).catch(() => {
          // 같은 경로 이동 오류 방어
          this.toggleSnb(false)
        })
      }
    },
    /**
     * 하림특가매장 클릭
     */
    companyHarimLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_LNB',
          eventAction: '하림특가매장',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })

      if (isOsApp()) { // APP
        nativeUtil.gotoURL(`/store/slot/${this.getHarimStoreNumber}`)
        nativeUtil.lnbHide()
      } else {
        this.$router.push(`/store/slot/${this.getHarimStoreNumber}`).catch(() => {
          // 같은 경로 이동 오류 방어
          this.toggleSnb(false)
        })
      }
    },
    /**
     * 사내특가매장 클릭
     */
    companyNSLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_LNB',
          eventAction: '사내특가매장',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })

      if (isOsApp()) { // APP
        nativeUtil.gotoURL(`/store/slot/${this.getEmployeeStoreNumber}`)
        nativeUtil.lnbHide()
      } else {
        this.$router.push(`/store/slot/${this.getEmployeeStoreNumber}`).catch(() => {
          // 같은 경로 이동 오류 방어
          this.toggleSnb(false)
        })
      }
    },
    /**
     * 컴포넌트 초기화
     */
    init () {
      if (isOsApp()) { // APP
        window.callbackAppFirstLogin = this.callbackAppFirstLogin // 앱 로그인 체크 콜백함수(최초 한번만 로그인 위해 체크)
        window.callbackRequestCredentials = this.callbackRequestCredentials // 구글 스마트락에 사용자 정보 요청 콜백함수
        window.callbackPushUUID = this.callbackPushUUID // getPushUUID 콜백함수
        window.setSnbVisible = this.setSnbVisible // 좌측메뉴 보이게 처리
        window.getRecentViewedProducts = this.getRecentViewedProducts // 최근본 상품리스트
        window.showAlertCallback = this.showAlertCallback // showAlert 콜백 함수
        window.getCartCnt = this.getCartCnt // 장바구니 카운트 조회
        window.setAddCart = this.setAddCart // 장바구니 담기
        window.callbackShoppingAlarmCount = this.callbackShoppingAlarmCount // getShoppingAlarmCount 콜백함수
        window.callDummy = this.callDummy // Dummy 호출
        if (localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_YN) === 'N') {
          localStorageUtil.del('memberInfo') // 스토리지 값에 의한 로그인 방지 위해 삭제
          this.isLoggedIn = false
        }
        localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.LOGIN_REDIRECT_PATH)
        localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.SIMPLE_LOGIN_PATH)
      }
    },
    /**
     * 로그아웃
     */
    async handleLogout () {
      // 디자인 요구사항: 네 / 아니오 위치 변경
      // 요구사항 반영을 위해 ok <-> cancel 순서를 스위칭함
      if (isOsApp()) { // APP
        const params = {
          msg: '로그아웃 하시겠습니까?',
          ok: '네',
          cancel: '아니오'
        }
        nativeUtil.showAlert(JSON.stringify(params), 'showAlertCallback')
      } else {
        const cancelCallback = () => false

        messageUtil.confirm('로그아웃 하시겠습니까?', cancelCallback, async () => {
          const nowPath = this.$route.name
          await loginUtil.logout('/')
          if (nowPath === 'storeHome') { this.toggleSnb(false) }
          this.$store.commit('shoppingHistory/setIcon')
          toastUtil.show('로그아웃 되었습니다.')
          this.isEmpMbr = false
        }, '아니오', '네')
      }
    },
    /**
     * 대분류 카테고리 항목 클릭(탭)시, 드롭 다운되면서 중분류 카테고리 목록 보여줌.
     * @param {Number} itemIndex - 클릭(탭)한 요소 index.
     * @param {String} lcateNm - 클릭(탭)한 요소 카테고리명 : ga360
     * @returns {void}
     */
    dropDownMenuOpen (itemIndex, lcateNm) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_LNB',
          eventAction: '카테고리이동_1depth',
          eventLabel: lcateNm,
          params: {
            t1: null
          }
        }
      })
      const items = document.querySelectorAll('.cate_itmes')
      for (const node of items) {
        const isSelected = node.classList.contains(`cate_itmes${itemIndex}`)
        const isActive = node.classList.contains('active')
        if (isSelected && isActive) {
          node.classList.remove('active')
        } else if (isSelected) {
          node.classList.add('active')
        } else if (isActive) {
          node.classList.remove('active')
        }
      }
    },
    /**
     * LNB 정보 조회 및 셋팅.
     * @param {void}
     * @returns {void}
     */
    async setLnbInfo () {
      await this.getMyBenefit()
      await this.getLnbShop()
      await this.getRecommandBrands()
      await this.isCompanyHarim()
    },
    /**
     * LNB 임직원 정보 및 공지사항 데이터 조회.
     * @param {void}
     * @returns {Promise}
     */
    getMyBenefit () {
      return this.$nsaxios.post(
        'LnbBenefit',
        {},
        this.getMyBenefitCallback
      )
    },
    /**
     * getMyBenefit 콜백 메소드 - LNB 임직원 정보 및 공지사항 데이터 셋팅.
     * @param {Object} data
     * @returns {void}
     */
    getMyBenefitCallback (data) {
      if (data.msg.root.NoticeList.length) {
        this.noticeList = data.msg.root.NoticeList[0] // 공지사항
      }
      const gradeInfo = data.msg.root.GradeInfo
      if (isNull(gradeInfo)) {
        this.isEmpMbr = false
        this.companyGroupCode = ''
      } else {
        if (gradeInfo.isEmpMbr === 'Y') {
          this.isEmpMbr = true
          this.companyGroupCode = gradeInfo.staffInfo.companyGroupCode
          this.nsEmpTopCategoryId = gradeInfo.staffInfo.nsEmpTopCategoryId
        } else {
          this.isEmpMbr = false
          this.companyGroupCode = ''
          this.nsEmpTopCategoryId = null
        }
      }
    },
    /**
     * 공지사항 데이의 유무 반환.
     * @param {void}
     * @returns {bool}
     */
    hasNoticeList () {
      return Object.keys(this.noticeList).length > 0
    },
    /**
     * LNB 카테고리 정보 조회.
     * @param {void}
     * @returns {Promise}
     */
    getLnbShop () {
      const userId = (!isNull(loginUtil.userId())) ? loginUtil.userId() : ''
      const param = {
        userId,
        pageId: 1,
        pageSize: 1
      }
      return this.$nsaxios.post(
        'NSLnbShop',
        param,
        this.getLnbShopCallback
      )
    },
    /**
     * getLnbShop 콜백 메소드 - 응답 데이터 전달.
     * @param {Object} data
     * @returns {void}
     */
    getLnbShopCallback (data) {
      const categoryList = data.msg.root.CategoryList // 카테고리 리스트
      this.setLnbCategoryList(categoryList) // 쇼핑카테고리 설정
    },
    /**
     * 추천 브랜드 정보 조회.
     * @param {void}
     * @returns {Promise}
     */
    getRecommandBrands () {
      const param = {
        typeFlag: 'espot',
        espotInfo: 'EASY_LNB_RCMD_BRAND|Content'
      }
      return this.$nsaxios.post(
        'NSMobileHomeView',
        param,
        this.getRecommandBrandsCallback
      )
    },
    /**
     * getRecommandBrands 콜백 메소드 - 추천 브랜드 정보 셋팅.
     * @param {Object} data
     * @returns {void}
     */
    getRecommandBrandsCallback (data) {
      const checker =
        !isNull(data) &&
        !isNull(data.msg) &&
        data.msg._EASY_LNB_RCMD_BRAND.length > 0
      if (checker) {
        this.recommandBrandList = data.msg._EASY_LNB_RCMD_BRAND
      } else {
        this.recommandBrandList = []
      }
      if (isOsApp()) {
        this.getShoppingAlarmCount()
      }
    },
    /**
     * LNB 카테고리 정보 셋팅(대분류, 중분류)
     * @param {Object} categoryList
     * @returns {void}
     */
    setLnbCategoryList (categoryList) {
      const localStorageLcateId = localStorageUtil.get(COMM_CONST.STORAGE_KEY.LNB_LCATEID)
      let activeClass = ''
      const errorImg = '~@/assets/images/common/img_noImage_square.png'
      const cateList = []
      if (categoryList !== null && categoryList.length > 0) {
        categoryList.forEach((element, index) => {
          if (element.lcateNm !== 'eTV(가칭)') {
            // LNB의 쇼핑카테고리를 선택한게 있을 경우
            if (localStorageLcateId === element.lcateId) {
              activeClass = 'clicked'
            } else {
              activeClass = ''
            }
            const dataSet = {
              lcateId: element.lcateId,
              lcateUrl: element.lcateUrl,
              errorImg,
              lcateNm: element.lcateNm,
              lbannerImg: element.lcateBannerList.length ? element.lcateBannerList[0].lbannerImg : null,
              activeClass,
              catalogId: element.catalogId,
              mcateList: element.mcateList
            }
            cateList.push(dataSet)
          }
        })
        this.cateList = cateList
      }
    },
    /**
     * 중분류 카테고리 항목 클릭시 동작.
     * @param {String} mcateId - 중분류 마테고리 아이디
     * @param {Number} mcateIndex - 중분류 카테고리 인덱스 : ga360
     * @param {String} mcateNm - 중분류 카테고리명 : ga360
     * @returns {void}
     */
    goMidCateStore (mcateId, mcateIndex, mcateNm) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_LNB',
          eventAction: '카테고리이동_2depth',
          eventLabel: mcateNm,
          params: {
            t1: null
          }
        }
      })
      if (isOsApp()) { // APP
        nativeUtil.gotoURL(`/store/cate/${mcateId}`)
        nativeUtil.lnbHide()
      } else {
        this.$router.push(`/store/cate/${mcateId}`).catch(() => {
          // 같은 경로 이동 오류 방어
          this.toggleSnb(false)
        })
      }
    },
    /**
     * 로그온 상태일 경우, 이름 항목을 클릭(탭)시 동작.
     * @param {void}
     * @returns {void}
     */
    goMyPageMain () {
      if (isOsApp()) { // APP
        nativeUtil.gotoURL('/mypage')
        nativeUtil.lnbHide()
      } else {
        this.$router.push('/mypage').catch(() => {
          // 같은 경로 이동 오류 방어
          this.toggleSnb(false)
        })
      }
    },
    /**
     * 대분류 카테고리 항목중, 응답 데이터에는 존재하지만 사용되지 않는 경우 class 값으로 숨김처리.
     * @param {String} param
     * @returns {String}
     */
    isBlindCheck (param) {
      const lcateId = Number(param)
      if (lcateId === 1357054 || lcateId === 23651) { // TV베스트(1357054), 백화점/패션관(23651), 쇼핑북(89301) 배제
        return 'blind'
      } else {
        return ''
      }
    },
    /**
     * 하림 임직원 여부 체크.
     * @param {void}
     * @returns {bool}
     */
    async isCompanyHarim () {
      const commandName = 'GetCompanyGroupList'
      const parameters = {}
      const apiData = await this.$nsaxios.post(
        commandName,
        parameters,
        null
      )
      let companyGroupChecker = false
      let companyGroupList = []
      const companyGroupCode = this.companyGroupCode
      if (!isNull(apiData) && !isNull(apiData.companyGroupList) && !isNull(companyGroupCode)) {
        companyGroupList = apiData.companyGroupList
        companyGroupList.forEach((element, index) => {
          if (companyGroupList.comm_cd_val === companyGroupCode) {
            companyGroupChecker = true
          }
        })
      }
      this.companyGroupFlag = companyGroupChecker
    },
    /**
     * NS 임직원 여부 체크.
     * @param {void}
     * @returns {bool}
     */
    isCompanyNS () {
      return this.companyGroupCode === LNB_CONST.COMPANY_GROUP_CODE.NSMALL
    },
    /**
     * 클릭 이벤트 경로가 외부 사이트인지 NSMall 내부인지 체크.
     * @param {String} clickTarget
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
     * 클릭 이벤트의 유형에 따라 다른 경로로 이동. (상품상세, 카테고리매장, 외부사이트)
     * @param {String} clickTarget - Category, Product, External
     * @param {String} clickCode - partnumber, categoryId
     * @param {String} mdUrl - url
     * @param {Number} index - 루프 인덱스 : ga360
     * @param {String} brandName - 추천브랜드명 : ga360
     * @param {String} urlChecker - 외부, 내부 url에 따라 페이지 이동 분기.
     * @param {string} contentsId 컨텐츠 ID
     * @param {string} espotId ESPOT ID
     */
    bannerCommonClickEvent (clickTarget, clickCode, mdUrl, index, brandName, urlChecker, contentsId, espotId) {
      const label = `${index + 1}_${brandName}`
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_LNB',
          eventAction: '추천브랜드',
          eventLabel: label,
          params: {
            t1: null
          }
        }
      })
      const targetChecker = isNull(clickTarget)
      if (targetChecker) {
        if (isOsApp()) { // APP
          nativeUtil.goHome()
          nativeUtil.lnbHide()
        } else {
          return '/'
        }
      }
      let urlString = ''
      const targetLowerCase = ANCHOR_CONST.CLICK_TARGET_LOWER_CASE[clickTarget]
      if (targetLowerCase === 'product') {
        urlString = `/${targetLowerCase}/${clickCode}`
      } else if (targetLowerCase === 'category') {
        const categoryId = Number(clickCode)
        if (categoryId < 0) {
          const invoke = {
            p_espotid: espotId,
            p_bannerid: contentsId,
            catgroupId: categoryId,
            via: 'NSMALL'
          }
          this.$router.push({
            name: 'exhibitionDetail',
            query: invoke
          })
          return
        } else {
          urlString = `/store/cate/${clickCode}`
        }
      } else if (targetLowerCase === 'external') {
        urlString = `${mdUrl}`
      }
      if (isOsApp()) { // APP
        if (urlChecker === 'external') {
          if (urlString.indexOf('http') > -1) {
            nativeUtil.gotoFullURL(urlString)
          } else {
            nativeUtil.gotoURL(urlString)
          }
          nativeUtil.lnbHide()
        } else if (urlChecker === 'internal') {
          nativeUtil.gotoURL(urlString)
          nativeUtil.lnbHide()
        }
      } else {
        if (urlChecker === 'external') {
          window.location.href = urlString
        } else if (urlChecker === 'internal') {
          this.$router.push(urlString).catch(() => {
            // 같은 경로 이동 오류 방어
            this.toggleSnb(false)
          })
        }
      }
    },
    /**
     * 설정 페이지로 이동
     *
     * @param {void}
     * @returns {void}
     */
    gotoSetting () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_LNB',
          eventAction: '설정',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })
      if (isOsApp()) { // APP
        localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.LOGIN_TYPE, 'general') // Native 로그인을 위해 구분
        nativeUtil.gotoURL('/customer/setting')
        nativeUtil.lnbHide()
      } else {
        this.$router.push('/customer/setting').catch(() => {
          // 같은 경로 이동 오류 방어
          this.toggleSnb(false)
        })
      }
    },
    /**
     * 쇼핑알림 페이지로 이동
     *
     * @param {void}
     * @returns {void}
     */
    alertSetting () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_LNB',
          eventAction: '알림',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })
      if (isOsApp() && loginUtil.isLoggedIn()) { // APP
        localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.LOGIN_TYPE, 'general') // Native 로그인을 위해 구분
        nativeUtil.openPushHistoryWindow()
        nativeUtil.lnbHide()
      } else if (isOsApp()) {
        localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.LOGIN_TYPE, 'general') // Native 로그인을 위해 구분
        localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.LOGIN_REDIRECT_PATH, '/customer/push')
        window.returnRoute = { path: '/customer/push' }
        bizUtil.gotoLogin()
      }
    },
    /**
     * 로그인 페이지로 이동
     *
     * @param {void}
     * @returns {void}
     */
    gotoLogin () {
      if (isOsApp()) { // APP
        localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.LOGIN_TYPE, 'general') // Native 로그인을 위해 구분
      }
      bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER)
    },
    /**
     * APP Bridge callback 함수 ( 자동로그인을 위해 호출)
     * @param {String} firstLoginYn 최초로그인 여부
     * @returns {void}
     */
    callbackAppFirstLogin (firstLoginYn) {
      localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.LOGIN_REDIRECT_PATH)
      localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.SIMPLE_LOGIN_PATH)

      if (isOsApp() && firstLoginYn === 'Y') {
        localStorageUtil.del('memberInfo') // 스토리지 값에 의한 로그인 방지 위해 삭제
        nsaxios.post('Dummy', {})
        this.isLoggedIn = false
        this.setLnbInfo()
        /*
        // 간편로그인 정보
        const lsuEntFlag = localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.AUTO_ENT_FLAG)
        let entFlag = ''
        let entUserId = ''
        let entRefreshToken = ''
        let entName = ''
        let entEmail = ''
        if (!isNull(lsuEntFlag)) {
          const autoEntUserInfo = localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.AUTO_ENT_USER_INFO)
          entFlag = autoEntUserInfo.entFlag
          entUserId = autoEntUserInfo.entUserId
          entRefreshToken = autoEntUserInfo.refreshToken
          entName = autoEntUserInfo.entName
          entEmail = autoEntUserInfo.entEmail
        }
        */
        // Native 자동 로그인 처리(로그인 안되어 있고 쿠키의 자동로그인 값이 'Y' 이면)
        if (localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_YN) === 'Y') {
          const entFlag = localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.AUTO_ENT_FLAG)
          const entUserId = localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.AUTO_ENT_USER_ID)
          const entRefreshToken = localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.AUTO_ENT_REFRESH_TOKEN)
          // 자동로그인처리
          const param = {
            logonId: cipherUtil.decryptValue(localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_ID)),
            logonPassword: cipherUtil.decryptValue(localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.AUTO_LOGIN_PW)),
            logonType: COMM_CONST.LOGON_TYPE.NORMAL,
            entFlag,
            entUserId,
            refresh_token: entRefreshToken,
            isSSORequest: true,
            saveYn: 'N',
            autoYn: 'Y',
            isCaptChaYn: this.checkRecaptchaYn = this.checkRecaptcha()
          }
          if (!isNull(param.logonId) && !isNull(param.logonPassword)) {
            this.isAutoLoginCheck = true
            this.sendLogin(param)
          } else if (viewType() === 'android') {
          // 구글 스마트락에 사용자 정보 요청
            this.requestCredentials()
          }
        } else if (viewType() === 'android') {
          // 구글 스마트락 사용자 정보 요청
          this.requestCredentials()
        }
      } else {
        // 임직원 뱃지, 사용자명, 로그인 여부 업데이트
        this.staffInfoName = loginUtil.getUserInfo('staffInfoName')
        this.userName = loginUtil.userName()
        this.isLoggedIn = loginUtil.isLoggedIn()
      }
    },
    /**
     * 구글 스마트락 사용자 정보 요청
     *
     * @param {void}
     * @returns {void}
     */
    requestCredentials () {
      if (isOsApp()) { // APP
        // 구글 스마트락에 사용자 정보 요청
        nativeUtil.requestCredentials(JSON.stringify({
          logonId: '',
          logonPassword: '',
          logonType: COMM_CONST.LOGON_TYPE.NORMAL,
          isSSORequest: true,
          saveYn: 'N',
          autoYn: 'Y',
          isCaptChaYn: this.checkRecaptchaYn = this.checkRecaptcha(),
          isCredential: true,
          isSuccess: false
        }), 'callbackRequestCredentials')
      }
    },
    /**
     * 구글 스마트락 사용자 정보 요청 callback 함수
     * @param {String} callbackParams 콜백파라미터
     */
    callbackRequestCredentials (callbackParams) {
      const params = JSON.parse(callbackParams)

      // 자동 로그인 처리
      if (params.isSuccess) {
        this.isAutoLoginCheck = true
        this.sendLogin(params)
      }
    },
    /**
     * 추천 브랜드 클래스 반환.
     *
     * @param {Number} length - 추천 브랜드 건수
     * @returns {String}
     */
    isLength4Low (length) {
      if (Number(length) < 4) {
        return 'fixed'
      } else {
        return ''
      }
    },
    /**
     * SNB 토글
     */
    toggleSnb (isActive) {
      this.$emit('activeSnb', isActive)
      if (isActive) {
        this.showDimmed = true
      } else {
        setTimeout(() => {
          this.showDimmed = false
        }, 300)
      }
    },
    /**
     * getPushUUID callback 함수
     * @param {String} uuid PUSH UUID
     * @returns {void}
     */
    callbackPushUUID (uuid) {
      localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.PUSH_UUID, uuid)
    },
    /**
     * getShoppingAlarmCount 쇼핑알람 카운트
     * @param {void}
     * @returns {void}
     */
    async getShoppingAlarmCount () {
      nativeUtil.getShoppingAlarmCount('callbackShoppingAlarmCount')
    },
    /**
     * callbackShoppingAlarmCount callback 함수
     * @param {String} count 알람 카운트
     * @returns {void}
     */
    callbackShoppingAlarmCount (count) {
      this.totalCnt = count
    },
    /**
     * getRecentViewedProducts 최근본 상품 리스트(14일)
     * @param {void}
     * @returns {String} jsonString
     */
    getRecentViewedProducts () {
      const recentViewedProducts = bizUtil.getRecentlyViewedProducts()
      nativeUtil.setRecentViewedProducts(JSON.stringify(recentViewedProducts))
    },
    /**
     * Native 좌측메뉴 보이게 처리
     * @param {String} snbVisible
     * @returns {void}
     */
    setSnbVisible (snbVisible) {
      this.isLoggedIn = loginUtil.isLoggedIn()
      this.staffInfoName = loginUtil.getUserInfo('staffInfoName')
      this.userName = loginUtil.userName()
      if (!this.cateList.length) {
        this.setLnbInfo()
      }
      this.getShoppingAlarmCount()
      this.setIsNativeCss(true)
      this.toggleSnb(true)
      bizUtil.secessionMemberCheker().then(data => {
        if (data) {
          this.isLoggedIn = loginUtil.isLoggedIn()
        }
      })
    },
    /**
     * api에서 받아온 에셋 이미지 파일명 + 확장자만 추출.
     * @param {String} param - api에서 받아온 에셋 이미지 상대경로.
     * @returns {String}
     */
    getAssetImage (param) {
      const assetIndex = param.split('/').length - 1
      const assetFileName = param.split('/')[assetIndex]
      return assetFileName
    },
    /**
     * showAlert 콜백함수
     * @param {String} param  확인 여부 리턴 값
     * @returns {String}
     */
    showAlertCallback (param) {
      const logoutParam = param.replaceAll('\\', '')
      if (logoutParam.indexOf('Y') > -1) {
        loginUtil.logout().then(() => {
          nativeUtil.lnbHide() // 좌측메뉴 닫기
          if (viewType() === 'android') {
            nativeUtil.showToast('로그아웃 되었습니다.')
            nativeUtil.stopCredential() // 사용자 정보 요청 중단
          }
          window.location.reload()
          nativeUtil.goHome()
        })
      }
    },
    /**
     * getCartCnt 장바구니 카운트 조회
     * @param {void}}
     * @returns {void}
     */
    getCartCnt () {
      bizUtil.getNativeCartCount()
    },
    /**
     *  setAddCart 장바구니 담기
     * @param {String} jsonString
     * @returns {void}
     */
    setAddCart (jsonString) {
      bizUtil.setAddCart(JSON.parse(jsonString))
    },
    /**
     *  callDummy 호출
     * @param {void}
     * @returns {void}
     */
    callDummy () {
      // nsaxios.post('Dummy', {})
      this.setLnbInfo()
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/layouts/items/AppAside";
</style>
