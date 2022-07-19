<template>
  <!-- 앵커: 오늘 추천 -->
  <section class="anchor_today">
    <div id="today">
      <!-- 4A: 실시간 인기검색어 영역 -->
      <section
        v-if="
          !isNull(espotData.espotList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE) &&
            !isNull(espotData.espotExtendList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE)
        "
        name="_EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE"
      >
        <div
          class="title_tag"
        >
          <p class="title">
            실시간 인기검색어
          </p>
          <p
            v-if="
              !isNull(espotData) &&
                !isNull(espotData.espotExtendList) &&
                !isNull(espotData.espotExtendList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE) &&
                !isNull(espotData.espotExtendList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE.titleContent) &&
                !isNull(espotData.espotExtendList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE.titleContent.marketingText)
            "
            class="tag"
          >
            {{ getMarketingText(espotData.espotExtendList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE.titleContent.marketingText) }}
          </p>
        </div>
        <swiper
          ref="searchSwiper"
          :options="searchSwiper"
          class="search_main_swiper"
        >
          <template v-if="!isNull(espotData.espotList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE) && espotData.espotList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE.length > 5">
            <swiper-slide
              v-for="(parentValue, parentIndex) in devideNumber"
              :key="`parent_${parentIndex}`"
            >
              <ol>
                <li
                  v-for="(childValue, childIndex) in setChildSlideSplice(espotData.espotList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE, parentIndex)"
                  :key="`child_${childIndex}`"
                  :class="setUpDownNewSameClass(childValue.PROGRESS, childValue.PREV_RANK)"
                  @click="keywordClicked(childValue.KEYWORD)"
                >
                  <p class="number">
                    {{ childValue.RANKING }}
                  </p>
                  <p class="word">
                    {{ childValue.KEYWORD }}
                  </p>
                </li>
              </ol>
            </swiper-slide>
          </template>
          <swiper-slide v-else-if="!isNull(espotData.espotList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE) && espotData.espotList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE.length">
            <ol>
              <li
                v-for="(value, index) in espotData.espotList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE"
                :key="index"
                :class="setUpDownNewSameClass(value.PROGRESS, value.PREV_RANK)"
                @click="keywordClicked(value.KEYWORD)"
              >
                <p class="number">
                  {{ value.RANKING }}
                </p>
                <p class="word">
                  {{ value.KEYWORD }}
                </p>
              </li>
            </ol>
          </swiper-slide>
        </swiper>
      </section>
      <!-- // 4A: 실시간 인기검색어 영역 -->

      <!-- 4B: 지금 고객님이 많이 보는 상품 영역 -->
      <section
        v-if="!isNull(B4contents) && !isNull(B4products)"
        name="_EZ_HOME_ANCHOR4B_RCMDCLICK_PRDSLIDESQUARE25W"
      >
        <div
          class="title_tag"
        >
          <p class="title">
            지금 고객님이 많이 보는 상품
          </p>
          <p
            v-show="hasMarketingText(B4contents.titleContent)"
            class="tag"
          >
            {{ getMarketingText(B4contents.titleContent.marketingText) }}
          </p>
        </div>
        <swiper
          ref="swiperList"
          :options="swiperList"
          class="swiper_product"
        >
          <swiper-slide
            v-for="(value, index) in B4products"
            :key="`${index}`"
          >
            <router-link
              :to="{ name: 'productDetail', params: { number: value.partnumber, clksrc: '메인_오늘추천_상품' }}"
              aria-label="상품"
              @click.native="productDetailLogging(value.partnumber, 'commonProduct')"
            >
              <figure>
                <ns-img
                  :product-number="value.partnumber"
                  :width="320"
                  :height="320"
                  :alt="value.itncatentrynm"
                  :is-adult="value.adultItemFlag"
                />
              </figure>
              <ns-price
                :dc-price="value.dcPrice"
                :mm-rntal-prc="value.mmRntalPrc"
                :prc-wave-disp="value.prcWaveDisp"
                :buschn-id="value.buschnId"
                :disp-type-cd="value.dispTypeCd"
              />
              <p class="title">
                {{ getHtmlDecode(value.itncatentrynm) }}
              </p>
            </router-link>
          </swiper-slide>
        </swiper>
      </section>
      <!-- // 4B: 지금 고객님이 많이 보는 상품 영역 -->

      <!-- 4C: 고객님이 많이 찾는 매장 영역 -->
      <section
        v-if="!isNull(C4contents) && !isNull(C4products)"
        name="_EZ_HOME_ANCHOR4C_ESPOT_CNTNT4W"
      >
        <div
          v-if="hasExtendList(C4contents.titleContent)"
          class="title_tag"
        >
          <template v-if="hasBrTag(C4contents.titleContent.marketingText)">
            <p class="title">
              {{ brTagSplit(C4contents.titleContent.marketingText, 'title') }}
            </p>
            <p class="tag">
              {{ brTagSplit(C4contents.titleContent.marketingText, 'tag') }}
            </p>
          </template>
          <p v-else class="title">
            {{ brTagSplit(C4contents.titleContent.marketingText, 'title') }}
          </p>
        </div>
        <ul
          v-if="C4products.length"
          class="banner_grid"
        >
          <template
            v-for="(value, index) in C4products"
          >
            <li
              v-if="index < 12"
              :key="`${index}`"
              aria-label="배너"
              @click="bannerCommonClickEvent(
                value.clickTarget,
                value.contentsId,
                value.clickCode,
                value.espotId,
                value.mdUrl,
                null,
                '메인_인기매장',
                isNull(value.marketingText) ? value.contentName : value.marketingText
              )"
            >
              <figure>
                <ns-img
                  :src="value.imgUrl"
                  :alt="value.marketingText"
                />
              </figure>
              <p>
                {{ getCutBytes(getHtmlDecode(value.marketingText)) }}
              </p>
            </li>
          </template>
        </ul>
        <!-- 더보기 영역 -->
        <!-- <div v-if="checkMoreView(C4contents)" class="btn_total_view">
          <button
            type="button"
            @click="bannerCommonClickEvent(
              C4contents.titleContent.clickTarget,
              C4contents.titleContent.contentsId,
              C4contents.titleContent.clickCode,
              C4contents.titleContent.espotId,
              C4contents.titleContent.mdUrl
            )"
          >
            {{ getHtmlDecode('더보기') }}
            <i />
          </button>
        </div> -->
        <!-- // 더보기 영역 -->
      </section>
      <!-- // 4C: 고객님이 많이 찾는 매장 영역 -->

      <!-- 4D: 좋아할 만한 상품 영역 -->
      <template v-if="isD4ApiCallFlag && !isNull(D4contents) && !isNull(D4products)">
        <div
          class="title_tag"
        >
          <p class="title">
            {{ getUserName() }}님이 좋아할 만한 상품
          </p>
          <p
            v-show="hasMarketingText(D4contents.titleContent)"
            class="tag"
          >
            {{ getMarketingText(D4contents.titleContent.marketingText) }}
          </p>
        </div>
        <swiper
          ref="swiperList"
          :options="swiperList"
          class="swiper_product"
        >
          <swiper-slide
            v-for="(value, index) in D4products"
            :key="`${index}`"
          >
            <router-link
              :to="{ name: 'productDetail', params: { number: value.partnumber, clksrc: '메인_오늘추천_상품' }}"
              aria-label="상품"
              @click.native="productDetailLogging(value.partnumber, 'recomProduct')"
            >
              <figure>
                <ns-img
                  :product-number="value.partnumber"
                  :width="320"
                  :height="320"
                  :alt="value.itncatentrynm"
                  :is-adult="value.adultItemFlag"
                />
              </figure>
              <ns-price
                :dc-price="value.dcPrice"
                :mm-rntal-prc="value.mmRntalPrc"
                :prc-wave-disp="value.prcWaveDisp"
                :buschn-id="value.buschnId"
                :disp-type-cd="value.dispTypeCd"
              />
              <p class="title">
                {{ getHtmlDecode(value.itncatentrynm) }}
              </p>
            </router-link>
          </swiper-slide>
        </swiper>
      </template>
      <!-- // 4D: 좋아할 만한 상품 영역 -->
    </div>
  </section>
</template>

<script>
import {
  insertCommas,
  isNull
} from '@utils/commonutil/commonUtil'
import anchorMixin from '@/mixins/store/home/anchorMixin'
import storeProductTypeMixin from '@/mixins/store/storeProductTypeMixin'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import loginUtil from '@utils/loginUtil'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import ANCHOR_CONST from '@/common/constants/store/anchor'
import storeHomeService from '@services/store/storeHomeService'

export default {
  name: 'AnchorToday',
  components: {
    NsImg,
    NsPrice
  },
  mixins: [
    anchorMixin,
    storeProductTypeMixin
  ],
  props: {
    espotData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      searchSwiper: {
        slidesPerView: 'auto',
        spaceBetween: 16,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination'
        }
      },
      swiperList: {
        slidesPerView: 'auto',
        spaceBetween: 8
      },
      searchKeyword: '',
      devideNumber: this.devideKeywordSlide(),
      B4contents: this.espotData.espotExtendList._EZ_HOME_ANCHOR4B_RCMDCLICK_PRDSLIDESQUARE25W,
      B4products: this.espotData.espotList._EZ_HOME_ANCHOR4B_RCMDCLICK_PRDSLIDESQUARE25W,
      C4contents: this.espotData.espotExtendList._EZ_HOME_ANCHOR4C_ESPOT_CNTNT4W,
      C4products: this.espotData.espotList._EZ_HOME_ANCHOR4C_ESPOT_CNTNT4W,
      D4contents: false,
      D4products: false,
      isD4ApiCallFlag: false
    }
  },
  created () {
    this.getEspotDataNoCache({
      typeFlag: ANCHOR_CONST.SECOND_PARAMETERS_EXTEND.TYPE_FLAG,
      rbPcid: 0,
      userId: loginUtil.userId(),
      targetEspotId: ANCHOR_CONST.SECOND_PARAMETERS_EXTEND.TARGET_ESPOT_ID,
      espotInfo: ANCHOR_CONST.SECOND_PARAMETERS_EXTEND.ESPOT_INFO
    }).then(() => {
      this.isD4ApiCallFlag = true
    })
  },
  methods: {
    isNull,
    insertCommas,
    /**
     * ESPOT 정보 조회
     * @param {object} param (필수) ESPOT 정보 조회 파라미터
     * @returns {Promise} Promise
     */
    getEspotDataNoCache (param) {
      return storeHomeService.getEspotDataNoCache(param, response => {
        const D4productChecker =
          !isNull(response.msg) &&
          response.msg.length &&
          !isNull(response.msg[0]._EZ_HOME_ANCHOR4D_RCMDUSER_PRDRCMDUSER) &&
          response.msg[0]._EZ_HOME_ANCHOR4D_RCMDUSER_PRDRCMDUSER.length
        if (D4productChecker) {
          this.D4products = response.msg[0]._EZ_HOME_ANCHOR4D_RCMDUSER_PRDRCMDUSER
        }

        const D4contentsChecker =
          !isNull(response.msg) &&
          response.msg.length &&
          !isNull(response.msg[1].espotExtendList) &&
          !isNull(response.msg[1].espotExtendList._EZ_HOME_ANCHOR4D_RCMDUSER_PRDRCMDUSER)
        if (D4contentsChecker) {
          this.D4contents = response.msg[1].espotExtendList._EZ_HOME_ANCHOR4D_RCMDUSER_PRDRCMDUSER
        }
      })
    },
    /**
     * 상품상세 클릭
     * @param {String} partNumber 상품번호
     * @param {String} text 상품구분
     */
    productDetailLogging (partNumber, text) {
      let eventAction = ''
      let eventLabel = ''
      if (text === 'commonProduct') {
        eventAction = '많이보는상품'
        eventLabel = `많이보는상품_${partNumber}`
      } else if (text === 'recomProduct') {
        eventAction = '추천상품'
        eventLabel = `추천상품_${partNumber}`
      }
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_메인',
          eventAction,
          eventLabel,
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 인기 검색어 개별 항목 클릭시 검색결과 페이지로 이동.
     * @param {String} keyword - 인기 검색어 키워드.
     */
    keywordClicked (keyword) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_메인',
          eventAction: '인기검색어',
          eventLabel: keyword,
          params: {
            t1: null
          }
        }
      })
      this.searchKeyword = keyword
      this.searchSubmit()
    },
    /**
     * 파라메터 셋팅 후 검색결과 페이지로 이동.
     */
    searchSubmit () {
      const promotionText = ''
      const searchKeyword = this.searchKeyword
      const goingInvok = {
        path: `/search/result/${searchKeyword}`,
        params: {
          searchTerm: searchKeyword,
          promotionText,
          layerMoveFlag: true // 검색결과 페이지에서 경로 식별하기 위한 flag.
        }
      }
      this.$store.commit('search/setSearchWordInfo', goingInvok.params)
      this.$router.push(goingInvok)
    },
    /**
     * API 응답 값에 따라서 up, down, new, same 스트링 반환.
     * @param {String} progress
     * @returns {String}
     */
    setUpDownNewSameClass (progress, prevRank) {
      let returnString = ''
      switch (progress) {
        case 'UP':
          returnString = 'up'
          break
        case 'DOWN':
          returnString = 'down'
          break
        case 'SAME':
          returnString = 'same'
          break
        case 'NEW':
          returnString = 'new'
          break
        default:
          returnString = ''
          break
      }
      if (Number(prevRank) === 0) { returnString = 'new' }
      return returnString
    },
    /**
     * 인기 검색어 슬라이드를 몇개까지 생성할 것인지 판단 후 숫자 반환.
     * @returns {Number}
     */
    devideKeywordSlide () {
      const keywordListLength = this.espotData.espotList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE.length
      const devideValue = Math.ceil(keywordListLength / 5)
      return devideValue
    },
    /**
     * 나뉘어진 슬라이드를 위해 5건씩 리스트 잘라서 반환.
     * @param {Array} list
     * @param {Number} parentIndex
     * @returns {Array}
     */
    setChildSlideSplice (list, parentIndex) {
      const max = (parentIndex + 1) * 5
      const min = max - 5
      return list.slice(min, max)
    },
    /**
     * 공통함수의 유저 이름 반환.
     * @returns {String}
     */
    getUserName () {
      let userName = '고객'
      if (!isNull(loginUtil.userName())) { userName = loginUtil.userName() }
      return userName
    }
  }
}
</script>

<style lang="scss">
    @import "~@/assets/styles/views/store/module/AnchorToday";
</style>
