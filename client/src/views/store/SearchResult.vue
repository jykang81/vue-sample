<template>
  <div class="search_result">
    <div class="search_fixed" :class="getHasKeyword(relateSearchWord.length)">
      <!-- 연관키워드 -->
      <dl v-show="relateSearchWord.length && searchProductList.length && !filterSearchYn && sortCriteria === 'weight'" class="relation_keyword">
        <dt>연관</dt>
        <dd>
          <ul>
            <li
              v-for="(value, index) in relateSearchWord"
              :key="`relateSearch${index}`"
            >
              <a href="#none" @click="searchExecute(value, index)">{{ value }}</a>
            </li>
          </ul>
        </dd>
      </dl>
      <!-- 검색결과 메뉴 -->
      <div v-if="searchProductList.length" class="search_result_top">
        <div class="left_box">
          <p class="total">
            전체 <strong>{{ getInsertCommas(totalCount) }}</strong>개
          </p>
          <p
            class="btn_list_gird"
            :class="listGridClass ? 'grid' : ''"
          >
            <button
              type="button"
              @click="listGrid"
            >
              그리드/리스트
            </button>
          </p>
        </div>
        <div class="right_box">
          <p class="recommend">
            <button
              type="button"
              @click="nsRecommandAccordion()"
            >
              {{ getSortLabel(sortCriteria) }}
            </button>
          </p>
          <!-- 필터 적용시 class="active" 적용 -->
          <p
            class="btn_filter"
            :class="(filterSearchYn || sortCriteria !== 'weight') ? 'active' : ''"
          >
            <button
              type="button"
              @click="filter"
            >
              <i />
              필터
            </button>
          </p>
        </div>
      </div>
      <!-- 간편 필터 -->
      <ul v-show="searchProductList.length" class="shop_checklist">
        <!-- 혜택 정보 -->
        <li
          v-for="(value, index) in hasBenefitLabels"
          v-show="value === 'hasFreeDeliverYn'"
          :key="`checkbox1_${index}`"
          :class="getFilterChecked(value) ? 'active' : ''"
        >
          <input
            :id="`checkbox1_${index + 1}`"
            :ref="value"
            :key="value"
            type="checkbox"
            name="forInputRecheckFromBack"
            :checked="getFilterChecked(value)"
            @click="benefitFilterClicked(value, 'Y', 'subFilter')"
          >
          <label :for="`checkbox1_${index + 1}`">{{ getBenefitLabel(value) }}</label>
        </li>
        <!-- 전문 매장 -->
        <li
          v-for="(value, index) in hasStoreTypeLabels"
          v-show="value === 'channelTvShoppingCnt' || value === 'channelHappyDealCnt'"
          :key="`checkbox2_${index}`"
          :class="getFilterChecked(value) ? 'active' : ''"
        >
          <input
            :id="`checkbox2_${index + 1}`"
            :ref="value"
            :key="value"
            type="checkbox"
            name="forInputRecheckFromBack"
            :checked="getFilterChecked(value)"
            @click="storeTypeFilterClicked(value, 'Y', 'subFilter')"
          >
          <label :for="`checkbox2_${index + 1}`">{{ getStoreTypeLabel(value) }}</label>
        </li>
        <!-- 정렬 -->
        <li id="_lowPrice" name="sort_wrapper" @click="setSortCriteria('lowPrice', 'subFilter')">
          <label for="_lowPrice">{{ getSortLabel('lowPrice') }}</label>
        </li>
        <li id="_topPrice" name="sort_wrapper" @click="setSortCriteria('topPrice', 'subFilter')">
          <label for="_topPrice">{{ getSortLabel('topPrice') }}</label>
        </li>
        <li id="_best" name="sort_wrapper" @click="setSortCriteria('best', 'subFilter')">
          <label for="_best">{{ getSortLabel('best') }}</label>
        </li>
        <li id="_eval" name="sort_wrapper" @click="setSortCriteria('eval', 'subFilter')">
          <label for="_eval">{{ getSortLabel('eval') }}</label>
        </li>
      </ul>
    </div>

    <!-- 검색결과 목록 -->
    <div
      v-if="searchProductList.length"
      class="product_list"
      :class="listGridClass ? 'grid' : ''"
    >
      <div :class="searchProductList.length > 0 && planList.length > 0 ? 'has_banner' : ''">
        <template
          v-for="(value, index) in searchProductList"
        >
          <!-- 실시간 인기상품 존재시, 17번째 항목에 실시간상품 + 기존 검색결과 상품 동시 렌더링-->
          <template v-if="isRealTimeLengthBiggerThan16(index)">
            <div :key="`biggerThan${index}`" class="popular_list">
              <h3 class="title_swiper">
                실시간 인기상품
              </h3>
              <swiper
                ref="swiperList"
                :options="swiperList"
                class="swiper_product"
              >
                <swiper-slide
                  v-for="(realTimeValue, realTimeIndex) in realTimeSearchData"
                  :key="`biggerSwiper${realTimeIndex}`"
                >
                  <router-link
                    to="productDetail"
                    event=""
                    @click.native.prevent="realTimeDataLogging(realTimeIndex, realTimeValue, { name: 'productDetail', params: { number: realTimeValue.partNumber, clksrc: '검색_검색결과', clkvlu: searchTerm }})"
                  >
                    <figure>
                      <ns-img
                        :src="realTimeValue.imageUrl"
                        :alt="realTimeValue.catentryNm"
                      />
                      <p v-show="realTimeValue.brdctYn === 'Y' && realTimeValue.onAirFlag !== 'O'" class="copy_livebuy">
                        방송중 구매가능
                      </p>
                    </figure>
                    <ns-price
                      :dc-price="realTimeValue.salePrice"
                      :mm-rntal-prc="realTimeValue.mmRntalPrc"
                      :prc-wave-disp="realTimeValue.prcWaveDisp"
                      :buschn-id="realTimeValue.busChnId"
                      :disp-type-cd="realTimeValue.dispTypeCd"
                    />
                    <p class="title">
                      {{ realTimeValue.catentryNm }}
                    </p>
                  </router-link>
                </swiper-slide>
              </swiper>
            </div>
            <div :key="`realTimeAfter${index}`" class="list">
              <router-link
                to="productDetail"
                event=""
                @click.native.prevent="searchResultLogging(value, { name: 'productDetail', params: { number: value.partNumber, clksrc: '검색_검색결과', clkvlu: searchTerm }})"
              >
                <div class="product_info">
                  <figure>
                    <ns-img
                      :src="value.imageUrl"
                      :alt="value.prdInfo.catentryNm"
                    />
                    <p v-show="value.brdctYn === 'Y' && value.onAirFlag !== 'O'" class="copy_livebuy">
                      방송중 구매가능
                    </p>
                  </figure>
                  <div class="price_title">
                    <ns-price
                      :dc-price="value.prdInfo.salePrice"
                      :dc-rate="value.prdInfo.saleRate"
                      :price="value.prdInfo.oriPrice"
                      :mm-rntal-prc="value.prdInfo.mmRntalPrc"
                      :prc-wave-disp="value.prdInfo.prcWaveDisp"
                      :buschn-id="value.prdInfo.busChnId"
                      :disp-type-cd="value.prdInfo.dispTypeCd"
                    />
                    <p class="title">
                      {{ value.prdInfo.catentryNm }}
                    </p>
                  </div>
                </div>
              </router-link>
              <div class="product_bottom">
                <ul class="benefit">
                  <li v-if="value.mediaType.mediaType1 !== ''" :class="value.mediaType.mediaType1.class">
                    {{ value.mediaType.mediaType1.viewNm }}
                  </li>
                  <li v-if="value.mediaType.mediaType2 !== ''" :class="value.mediaType.mediaType2.class">
                    {{ value.mediaType.mediaType2.viewNm }}
                  </li>
                  <template v-if="value.benefitInfo.benefitText.length > 0">
                    <li
                      v-for="(benefitValue, benefitIndex) in value.benefitInfo.benefitText"
                      :key="`smallerSearchInner${benefitIndex}`"
                    >
                      {{ benefitValue }}
                    </li>
                  </template>
                </ul>
                <div class="star_box">
                  <div v-if="!isNull(value.reviewInfo.joinCnt) && value.reviewInfo.joinCnt > 0" class="star_wrap">
                    <span class="rating_star">
                      <span class="star" />
                      <span
                        class="rating"
                        :style="getScore(value.reviewInfo.score)"
                      />
                    </span>
                    <span class="count">({{ getJoinCnt(value.reviewInfo.joinCnt) }})</span>
                  </div>
                </div>
                <p class="wish">
                  <span
                    v-if="value.ordCntAndWishInfo.ordCnt > 0"
                  >
                    {{ getOrderCount(value.ordCntAndWishInfo.ordCnt) }}
                  </span>
                  <span v-else />
                  <button
                    type="button"
                    class="button_wish"
                  >
                    <i
                      :key="wishKey"
                      class="icons_wish"
                      :class="isWish(value.ordCntAndWishInfo.wishProduct)"
                      @click="bizUtil.wishToggle($event, value.partNumber, value)"
                    />
                  </button>
                </p>
              </div>
            </div>
          </template>
          <template v-else>
            <div :key="`samllerSearch${index}`" class="list">
              <router-link
                to="productDetail"
                event=""
                @click.native.prevent="searchResultLogging(value, { name: 'productDetail', params: { number: value.partNumber, clksrc: '검색_검색결과', clkvlu: searchTerm }})"
              >
                <div class="product_info">
                  <figure>
                    <ns-img
                      :src="value.imageUrl"
                      :alt="value.prdInfo.catentryNm"
                    />
                    <p v-show="value.brdctYn === 'Y' && value.onAirFlag !== 'O'" class="copy_livebuy">
                      방송중 구매가능
                    </p>
                  </figure>
                  <div class="price_title">
                    <ns-price
                      :dc-price="value.prdInfo.salePrice"
                      :dc-rate="value.prdInfo.saleRate"
                      :price="value.prdInfo.oriPrice"
                      :mm-rntal-prc="value.prdInfo.mmRntalPrc"
                      :prc-wave-disp="value.prdInfo.prcWaveDisp"
                      :buschn-id="value.prdInfo.busChnId"
                      :disp-type-cd="value.prdInfo.dispTypeCd"
                    />
                    <p class="title">
                      {{ value.prdInfo.catentryNm }}
                    </p>
                  </div>
                </div>
              </router-link>
              <div class="product_bottom">
                <ul class="benefit">
                  <li v-if="value.mediaType.mediaType1 !== ''" :class="value.mediaType.mediaType1.class">
                    {{ value.mediaType.mediaType1.viewNm }}
                  </li>
                  <li v-if="value.mediaType.mediaType2 !== ''" :class="value.mediaType.mediaType2.class">
                    {{ value.mediaType.mediaType2.viewNm }}
                  </li>
                  <template v-if="value.benefitInfo.benefitText.length > 0">
                    <li
                      v-for="(benefitValue, benefitIndex) in value.benefitInfo.benefitText"
                      :key="`smallerSearchInner${benefitIndex}`"
                    >
                      {{ benefitValue }}
                    </li>
                  </template>
                </ul>
                <div class="star_box">
                  <div v-if="!isNull(value.reviewInfo.joinCnt) && value.reviewInfo.joinCnt > 0" class="star_wrap">
                    <span class="rating_star">
                      <span class="star" />
                      <span
                        class="rating"
                        :style="getScore(value.reviewInfo.score)"
                      />
                    </span>
                    <span class="count">({{ getJoinCnt(value.reviewInfo.joinCnt) }})</span>
                  </div>
                </div>
                <p class="wish">
                  <span
                    v-if="value.ordCntAndWishInfo.ordCnt > 0"
                  >
                    {{ getOrderCount(value.ordCntAndWishInfo.ordCnt) }}
                  </span>
                  <span v-else />
                  <button
                    type="button"
                    class="button_wish"
                  >
                    <i
                      :key="wishKey"
                      class="icons_wish"
                      :class="isWish(value.ordCntAndWishInfo.wishProduct)"
                      @click="bizUtil.wishToggle($event, value.partNumber, value)"
                    />
                  </button>
                </p>
              </div>
            </div>
            <search-result-banner
              v-if="searchProductList.length < 6 && index === searchProductList.length - 1 && planList.length > 0"
              :key="`banner_${index}`"
              :plan-list="planList"
              :data-length="planList.length"
            />
            <search-result-banner
              v-else-if="searchProductList.length > 5 && index === 5 && planList.length > 0"
              :key="`banner_${index}`"
              :plan-list="planList"
              :data-length="planList.length"
            />
          </template>
        </template>

        <div v-if="isRealTimeLengthSmallerThan16()" class="popular_list border_none">
          <h3 class="title_swiper">
            실시간 인기상품
          </h3>
          <swiper
            ref="swiperList"
            :options="swiperList"
            class="swiper_product"
          >
            <swiper-slide
              v-for="(value, index) in realTimeSearchData"
              :key="`smallerSwiper${index}`"
            >
              <router-link
                to="productDetail"
                event=""
                @click.native.prevent="realTimeDataLogging(index, value, { name: 'productDetail', params: { number: value.partNumber, clksrc: '검색_검색결과', clkvlu: searchTerm }})"
              >
                <figure>
                  <ns-img
                    :src="value.imageUrl"
                    :alt="value.catentryNm"
                  />
                  <p v-show="value.brdctYn === 'Y' && value.onAirFlag !== 'O'" class="copy_livebuy">
                    방송중 구매가능
                  </p>
                </figure>
                <ns-price
                  :dc-price="value.salePrice"
                  :mm-rntal-prc="value.mmRntalPrc"
                  :prc-wave-disp="value.prcWaveDisp"
                  :buschn-id="value.busChnId"
                  :disp-type-cd="value.dispTypeCd"
                />
                <p class="title">
                  {{ value.catentryNm }}
                </p>
              </router-link>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>
    <!-- 검색 결과 없을때 -->
    <div v-else-if="searchCallbackFlag && searchProductList.length === 0" class="search_result_empty">
      <p class="guide">
        <strong>‘{{ searchTerm }}’</strong>에 대한 아래와 같은 조건값과 일치하는 검색 결과가 없습니다
      </p>
      <div v-show="filterSearchYn === 'active' || filterSearchYn" :key="filterSearchYn">
        <p class="filter_value">
          {{ getFilterCheckLable() }}
          <!-- 무료배송 / 프라다 / 20만원 이상 / 나이키 -->
        </p>
        <p>
          <button
            type="button"
            class="btn"
            @click="resetFilter"
          >
            <span>모든 필터 초기화</span>
          </button>
        </p>
      </div>
    </div>
    <!-- 필터 -->
    <aside
      :class="filterLayout ? 'active' : ''"
      class="filter"
    >
      <div class="filter_wrapper">
        <div class="filter_title">
          <p>필터</p>
          <p class="refresh">
            <button
              type="button"
              @click="resetFilter"
            >
              재설정
            </button>
          </p>
        </div>
        <ul v-if="hasBenefitLabels.length" class="filter_list big">
          <li
            v-for="(value, index) in hasBenefitLabels"
            :key="`${index}`"
          >
            <input
              :id="`checkbox1_${index + 1}`"
              :ref="value"
              type="checkbox"
              name="forInputRecheckFromBack"
              :checked="getFilterChecked(value)"
              @click="benefitFilterClicked(value)"
            >
            <label :for="`checkbox1_${index + 1}`">{{ getBenefitLabel(value) }}</label>
          </li>
        </ul>
        <ul v-if="hasStoreTypeLabels.length" class="filter_list big">
          <li
            v-for="(value, index) in hasStoreTypeLabels"
            :key="`${index}`"
          >
            <input
              :id="`checkbox2_${index + 1}`"
              :ref="value"
              type="checkbox"
              name="forInputRecheckFromBack"
              :checked="getFilterChecked(value)"
              @click="storeTypeFilterClicked(value)"
            >
            <label :for="`checkbox2_${index + 1}`">{{ getStoreTypeLabel(value) }}</label>
          </li>
        </ul>
        <!-- 정렬 -->
        <!-- 해당 input checked가 있을때 class="selected" 적용 -->
        <div
          class="title_box selected"
          :class="sort ? 'active ' : ''"
          @click="accordion(1)"
        >
          <p class="title">
            정렬
          </p>
          <p class="content">
            {{ getSortLabel(sortCriteria) }}
          </p>
        </div>
        <ul
          v-show="sort"
          class="filter_list"
        >
          <li>
            <input
              id="weight"
              type="radio"
              name="sort"
              checked
              @click="setSortCriteria('weight')"
            >
            <label for="weight">{{ getSortLabel('weight') }}</label>
          </li>
          <li>
            <input
              id="best"
              type="radio"
              name="sort"
              @click="setSortCriteria('best')"
            >
            <label for="best">{{ getSortLabel('best') }}</label>
          </li>
          <li>
            <input
              id="lowPrice"
              type="radio"
              name="sort"
              @click="setSortCriteria('lowPrice')"
            >
            <label for="lowPrice">{{ getSortLabel('lowPrice') }}</label>
          </li>
          <li>
            <input
              id="topPrice"
              type="radio"
              name="sort"
              @click="setSortCriteria('topPrice')"
            >
            <label for="topPrice">{{ getSortLabel('topPrice') }}</label>
          </li>
          <li>
            <input
              id="comment"
              type="radio"
              name="sort"
              @click="setSortCriteria('comment')"
            >
            <label for="comment">{{ getSortLabel('comment') }}</label>
          </li>
          <li>
            <input
              id="eval"
              type="radio"
              name="sort"
              @click="setSortCriteria('eval')"
            >
            <label for="eval">{{ getSortLabel('eval') }}</label>
          </li>
        </ul>
        <div
          ref="categorySelected"
          class="title_box"
          @click="accordion(2)"
        >
          <p class="title">
            카테고리
          </p>
          <p class="content">
            <template v-if="cate3NameView.length">
              {{ getTransCateLabel(cate3NameView) }}
            </template>
          </p>
        </div>
        <ul
          v-if="cateRootList.length"
          v-show="category"
          class="category_list"
        >
          <li
            v-for="(value, index) in cateRootList"
            :key="index"
          >
            <!-- 하위 카테고리 체크시 class="active" 추가 -->
            <p @click="categoryAccordion">
              {{ Object.keys(value).toString() }} ({{ value[Object.keys(value)].cateCount }})
            </p>
            <ul v-if="value[Object.keys(value)].lowCate.length">
              <li
                v-for="(lowValue, lowIndex) in value[Object.keys(value)].lowCate"
                :key="lowIndex"
              >
                <input
                  :id="`checkbox3_${index + 1}_${lowIndex + 1}`"
                  :ref="`${Object.keys(value).toString()}_${Object.keys(lowValue)[0].toString()}`"
                  type="checkbox"
                  name="forInputRecheckFromBack"
                  :checked="getFilterChecked(Object.keys(lowValue)[0].toString())"
                  @click="categoryFilterClicked(Object.keys(value).toString(), Object.keys(lowValue)[0].toString(), Object.values(lowValue)[1].toString(), lowValue)"
                >
                <label :for="`checkbox3_${index + 1}_${lowIndex + 1}`">
                  {{ Object.keys(lowValue)[0].toString() }} ({{ Object.values(lowValue)[0].toString() }})
                </label>
              </li>
            </ul>
          </li>
        </ul>
        <!-- 브랜드 -->
        <!-- 해당 input checked가 있을때 class="selected" 적용 -->
        <div
          ref="brandSelected"
          class="title_box"
          @click="accordion(3)"
        >
          <p class="title">
            브랜드
          </p>
          <p class="content">
            <template v-if="brandName.length">
              {{ getTransCateLabel(brandName) }}
            </template>
          </p>
        </div>
        <ul
          v-if="brandSortCntList.length"
          v-show="brand"
          class="filter_list"
        >
          <li
            v-for="(value, index) in brandSortCntList"
            :key="`${index}`"
          >
            <input
              :id="`checkbox4_${index + 1}`"
              :ref="value.brandName"
              type="checkbox"
              name="forInputRecheckFromBack"
              :checked="getFilterChecked(value.brandName)"
              @click="brandFilterClicked(value.brandName)"
            >
            <label :for="`checkbox4_${index + 1}`">{{ value.brandName }} ({{ value.brandCount }})</label>
          </li>
        </ul>
        <!-- 가격대 -->
        <!-- 해당 input checked가 있을때 class="selected" 적용 -->
        <div
          class="title_box selected"
          :class="price ? 'active' : ''"
          @click="accordion(4)"
        >
          <p class="title">
            가격대
          </p>
          <p class="content">
            {{ clickedPriceText }}
          </p>
        </div>
        <ul
          v-show="price"
          class="filter_list"
        >
          <li>
            <input
              id="radio2_1"
              ref="defaultPrice"
              type="radio"
              name="price"
              checked
              @click="priceSubmit('', '')"
            >
            <label for="radio2_1">전체</label>
          </li>
          <template v-if="priceList.length === 1 && OnlyEndPriceFlag === false">
            <li>
              <input
                id="radio2_2"
                type="radio"
                name="price"
                @click="priceSubmit(DEFAULT_PRICESTART, priceList[0])"
              >
              <label for="radio2_2">{{ priceList[0] }}원 이하</label>
            </li>
          </template>
          <template v-else-if="priceList.length > 1 && OnlyEndPriceFlag === false">
            <li>
              <input
                id="radio2_2"
                type="radio"
                name="price"
                @click="priceSubmit(DEFAULT_PRICESTART, priceList[0])"
              >
              <label for="radio2_2">{{ priceList[0] }}원 이하</label>
            </li>
            <li>
              <input
                id="radio2_3"
                type="radio"
                name="price"
                @click="priceSubmit(priceList[0], priceList[1])"
              >
              <label for="radio2_3">{{ priceList[0] }}원 ~ {{ priceList[1] }}원</label>
            </li>
            <li>
              <input
                id="radio2_4"
                type="radio"
                name="price"
                @click="priceSubmit(priceList[1], priceList[2])"
              >
              <label for="radio2_4">{{ priceList[1] }}원 ~ {{ priceList[2] }}원</label>
            </li>
            <li>
              <input
                id="radio2_5"
                type="radio"
                name="price"
                @click="priceSubmit(priceList[2], priceList[3])"
              >
              <label for="radio2_5">{{ priceList[2] }}원 ~ {{ priceList[3] }}원</label>
            </li>
            <li>
              <input
                id="radio2_6"
                type="radio"
                name="price"
                @click="priceSubmit(priceList[4], DEFAULT_PRICEEND)"
              >
              <label for="radio2_6">{{ priceList[4] }}원 이상</label>
            </li>
          </template>
          <template v-else-if="priceList.length === 1 && OnlyEndPriceFlag">
            <li>
              <input
                id="radio2_2"
                type="radio"
                name="price"
                @click="priceSubmit(DEFAULT_PRICESTART, priceList[0])"
              >
              <label for="radio2_2">{{ priceList[0] }}원 이하</label>
            </li>
          </template>
        </ul>
        <p class="button_ok">
          <button
            type="button"
            @click="filterOk"
          >
            확인
          </button>
        </p>
      </div>
      <div
        class="dimmed_all"
        @click="filter"
      />
    </aside>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex' // mapState, mapGetters, mapMutations
import externalUtil from '@/common/utils/externalUtil'
import SEARCH_CONST from '@/common/constants/search/search'
import bizUtil from '@utils/bizUtil'
import uiUtil from '@utils/uiUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import routerUtil from '@frameworks/routerUtil'
import {
  isNull,
  getImageUrl,
  insertCommas,
  moneyUnformat,
  htmlDecode,
  isOsApp
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import NsImg from '@components/common/NsImg'
import NsPrice from '@components/common/NsPrice'
import nativeUtil from '@/common/frameworks/nativeUtil'
import storeFormlessMixin from '@/mixins/store/storeFormlessMixin'
import router from '@/router'
import localStorageUtil from '@/common/frameworks/localStorageUtil'
import {
  calcDate
} from '@frameworks/dateutil/dateUtil'
import SearchResultBanner from '@/views/store/module/SearchResultBanner'

export default {
  name: 'SearchResult',
  components: {
    NsImg,
    NsPrice,
    SearchResultBanner
  },
  mixins: [
    storeFormlessMixin
  ],
  data () {
    return {
      filterClass: '', // 필터 열기/닫기 제어 변수.
      filterLayout: '', // 필터값 유무여부에 따라 UI 변경.
      listGridClass: true, // 리스트형 또는 그리드형 UI 제어 목적.
      sort: '', // 정렬.
      category: '', // 카테고리.
      brand: '', // 브랜드.
      price: '', // 가격.
      score: '', // 상품평점.
      swiperList: {
        slidesPerView: 'auto',
        spaceBetween: 8
      }, // 스와이퍼 옵션 객체.

      pushFullEventFlag: false, // 무한 스크롤 이벤트 사용중인지 아닌지 여부
      totalCount: 0, // 총 카운트
      pageSize: 30, // 상품 목록 갯수
      pageIdx: 1, // 현재 페이지
      totalPage: 1, // 서버에서 내려주는 건수의 총합을 담는 변수.

      /* 필터 영역 시작 */
      filterSearchYn: false, // 필터 검색인지 일반검색인지 판단.
      freeDeliverYn: '', // 검색조건 - 무료 배송 여부
      interestFreeYn: '', // 검색조건 - 무이자 여부
      saveYn: '', // 검색조건 - 적립 여부

      filterType: [], // 검색조건 - 매체 필터 ("" : 전체, 1 : TV 쇼핑 , 2 : 해피딜, 3 : TV Shop+, 4 : 백화점)

      cate3Name: [], // 검색조건 - 카테고리 리스트

      brandName: [], // 검색조건 - 브랜드 리스트
      brandSortNmList: [], // 브랜드 리스트 (가나다순 정렬 된 리스트) > 화면 노출용 데이터
      brandSortCntList: [], // 브랜드 리스트 (상품수순 정렬 된 리스트) > 화면 노출용 데이터

      priceStart: '', // 검색조건 - 최소가격
      priceEnd: '', // 검색조건 - 최대가격

      starForSort: '', // API 수정 필요?

      lspYn: '', // 검색조건 - 일시불할인 여부
      sortCriteria: 'weight', // 정렬조건 - sort 가중치

      researchTerm: '', // 검색조건 - 결과 내 재검색어
      /* 필터 영역 끝 */
      cate3NameView: [], // 선택된 카테고리 텍스트로 보여주기위한 객체.
      isBack: false, // 뒤로가기 체크용 flag

      DEFAULT_PRICESTART: '0', // 최저가 기본값.
      DEFAULT_PRICEEND: '100000000', // 최고가 기본값.

      checkClick: false, // 클릭 여부.
      isShowWeight: false, // 가중치 정보 노출 유무(운영반영시에는 노출할 필요가 없으므로 false로 변경처리)
      relateSearchWord: [], // 연관 검색어 리스트.
      searchProductList: [], // 검색 결과 상품 리스트.
      benefitTextList: [], // 혜택 정보.
      planList: [], // 연관 기획전 상품리스트
      realTimeSearchData: [], // 실시간 인기 상품 리스트.
      searchCallbackFlag: false, // 상품조회 메소드의 콜백처리 완료여부 플래그
      hasBenefitLabels: [], // ui - 혜택 한글 텍스트.
      hasStoreTypeLabels: [], // ui - 전문매장 한글 텍스트.
      checkedFilterElement: [], // ui상의 보여주기 위한 필터 체크박스들의 공통 제어를 위한 배열객체. (실제 데이터와 무관)
      cateRootList: [], // 필터 - 최상위 카테고리 데이터 및 카운트 및 하위 카테고리 데이터 및 카운트
      priceList: [], // 셋팅된 가격정보 리스트.
      priceListLength: 0, // 셋팅된 가격정보 리스트 길이.
      clickedPriceText: '가격 전체', // 선택된 가격필터 항목
      benefitFilterFlag: false, // 필터 - 혜택 정보 유무
      storeTypeFilterFlag: false, // 필터 - 전문매장 정보 유무
      priceFilterFlag: false, // 가격정보 유무
      OnlyEndPriceFlag: false, // 가격 항목이 하나만 존재하는지 여부.
      categoryFilterFlag: false, // 카테고리 필터 유무.
      setBrandFinishFlag: false, // 브랜드 셋팅 완료 유무.
      listForInputRecheckFromBack: [], // 필터중에 체크된 항목들. (뒤로가기 했을시, 다시 체크해주기위함.)
      object: { // 무한스크롤 설정을 위한 옵션 객체.
        callback: this.pagePulling
      },
      didCreated: false, // created 훅의 완료여부 플래그
      pagePullingFlag: false, // 쓰로틀링 제어 플래그
      clickCheckBoxFlag: false, // 체크박스 클릭이벤트 여부
      // tvTable 태그 라벨 유무. (true --> created 훅에 tv쇼핑 필터를 걸어준다.)
      selectedEasySort: '',
      searchingFlag: false, // 검색 api 중복 호출 방지.
      wishKey: 0 // 찜 정보 갱신이 안되는 이슈때문에 키로 제어하기 위한 키
    }
  },
  computed: {
    /**
     * vuex search.js - getters 사용.
     */
    ...mapGetters('search', [
      'getSearchWordInfo',
      'getTvTableStatus',
      'getKeywordType'
    ]),
    /**
     * 공통함수의 bizUtil 반환.
     * @returns {Object}
     */
    bizUtil () {
      return bizUtil
    },
    /**
     * 선택된 필터 체크후 bool 반환.
     * @param {String} param(필수)
     * @returns {false 또는 void}
     */
    getFilterChecked () {
      return param => {
        const checkedList = this.checkedFilterElement
        let checker = false
        checkedList.forEach(element => {
          if (element === param) {
            checker = true
          }
        })
        return checker
      }
    }
  },
  watch: {
    '$route' (to, from) {
      if (this.$route.name !== 'searchResult') { return false }
      if (this.getTvTableStatus) { // vuex에서 tv shopping 값 체크.
        const filterChecker = this.filterType.indexOf(SEARCH_CONST.MATCH_TO_FILTER_TYPE.channelTvShoppingCnt)
        if (filterChecker === -1) {
          this.filterType.push(SEARCH_CONST.MATCH_TO_FILTER_TYPE.channelTvShoppingCnt) // 실제 필터데이터 셋팅
          const checker = this.checkedFilterElement.indexOf('channelTvShoppingCnt')
          if (checker === -1) { this.checkedFilterElement.push('channelTvShoppingCnt') } // ui상 보여주기용 체크박스를 위한 데이터셋 셋팅
        }
      } else {
        let idx = this.filterType.indexOf(SEARCH_CONST.MATCH_TO_FILTER_TYPE.channelTvShoppingCnt)
        if (idx > -1) {
          this.filterType.splice(idx, 1) // 실제 필터데이터 해제
        }
        idx = this.checkedFilterElement.indexOf('channelTvShoppingCnt')
        if (idx > -1) {
          this.checkedFilterElement.splice(idx, 1) // ui상 보여주기용 체크박스를 위한 데이터셋 해제
        }
      }
      const fromPathName = from.name
      const fromWord = from.params.searchword
      const fromHash = from.hash

      const toPathName = to.name
      const toWord = to.params.searchword
      const toHash = to.hash

      const refer = this.$router.currentRoute.meta.refer // 이전페이지 라우팅 name
      if (refer === 'tvScheduleTableBase') { // 편성표에서 검색으로 왔을때 라벨 필터 미작동 대응.
        this.getTotalSearchInfo()
      } else if (fromPathName === toPathName && fromWord !== toWord) { // 검색어 변경시 Api 재조회.
        this.setSearchWordInfo({ searchTerm: toWord })
      } else if (fromPathName === toPathName && fromWord === toWord) { // 뒤로가기 버그 대응.
        this.filterSearchYn = false
        this.getTotalSearchInfo()
        if (fromPathName !== toPathName) { return false }
        if ((fromPathName === toPathName) && (fromHash !== toHash)) { return false }
        routerUtil.back()
      }

      /** 성인상품 --> 로그인 --> 상품상세 --> 로그아웃(홈) --> 같은 상품검색 --> 19금 이미지 풀려있는 이슈 대응. */
      const productList = this.searchProductList
      productList.forEach((element, index) => {
        element.imageUrl = getImageUrl(element.partNumber, 366, 366, element.adultItemFlag)
      })
      this.searchProductList = productList
      ++this.wishKey

      const recomProductList = this.realTimeSearchData
      recomProductList.forEach((element, index) => {
        element.imageUrl = getImageUrl(element.partNumber, 366, 366, element.adultItemFlag)
      })
      this.realTimeSearchData = recomProductList
    },
    searchCallbackFlag: {
      handler (newFlag) {
        if (newFlag) {
          setTimeout(() => { this.setHeaderClass() }, 500)
        }
      }
    }
  },
  /**
   * created 라이프사이클
   */
  created () {
    if (isOsApp()) {
      localStorageUtil.setSearchWord({ keyword: this.$route.params.searchword, date: calcDate('', 0, 0, 0, 0, 'MM.dd') })
    }
    let params = {}
    if (!isNull(this.getSearchWordInfo.searchTerm)) {
      params = {
        searchTerm: this.getSearchWordInfo.searchTerm,
        promotionText: this.getSearchWordInfo.promotionText
      }
    } else {
      params = {
        searchTerm: this.$route.params.searchword,
        promotionText: this.$route.params.promotionText
      }
    }
    this.init(params)
    if (this.getTvTableStatus) { // TV 편성표 매장에서 TV쇼핑 태그 라벨을 달고 왔을경우
      this.filterType.push(SEARCH_CONST.MATCH_TO_FILTER_TYPE.channelTvShoppingCnt) // 실제 필터데이터 셋팅
      this.checkedFilterElement.push('channelTvShoppingCnt') // ui상 보여주기용 체크박스를 위한 데이터셋 셋팅
      this.filterSearchYn = 'active'
    } else {
      let idx = this.filterType.indexOf(SEARCH_CONST.MATCH_TO_FILTER_TYPE.channelTvShoppingCnt)
      if (idx > -1) {
        this.filterType.splice(idx, 1) // 실제 필터데이터 해제
      }
      idx = this.checkedFilterElement.indexOf('channelTvShoppingCnt')
      if (idx > -1) {
        this.checkedFilterElement.splice(idx, 1) // ui상 보여주기용 체크박스를 위한 데이터셋 해제
      }
    }
    // Vuex - state.searchTerm (검색어)객체 변경 감지.
    this.$store.watch(() => this.getSearchWordInfo.searchTerm, newSearchTerm => {
      params = {
        searchTerm: newSearchTerm,
        promotionText: this.getSearchWordInfo.promotionText
      }
      this.benefitFilterFlag = false
      this.storeTypeFilterFlag = false
      this.setPushFullEventFlag(false)
      this.setSearchInfo()
      this.setOnlyInitInfo(params)
      this.$refs.defaultPrice.checked = true
      this.clickCheckBoxFlag = false
      this.resetFilter()
    })
    this.didCreated = true
  },
  mounted () {
    if (isOsApp()) { // APP
      nativeUtil.setBackBtnYn('Y')
    }
    this.initParamObject()
    uiUtil.setInfiniteScroll(this, this.object)
  },
  updated () {
    // 전문매장, 혜택 높이 정렬
    if (this.totalCount > 0) {
      const vm = this
      const productList = document.querySelectorAll('.product_list .list')
      productList.forEach(function (element, index) {
        if (index % 2 === 0) {
          const benefit = element.querySelector('.benefit')
          const nextElement = benefit.closest('.list').nextElementSibling
          if (nextElement) {
            const nextBenefit = nextElement.querySelector('.benefit')
            if (isNull(benefit) || isNull(nextBenefit)) { return false }
            const benefitHeight = benefit.clientHeight
            const nextBenefitHeight = nextBenefit.clientHeight
            if (vm.listGridClass) {
              if (benefitHeight > nextBenefitHeight) {
                nextBenefit.style.height = `${benefitHeight}px`
              } else if (benefitHeight < nextBenefitHeight) {
                benefit.style.height = `${nextBenefitHeight}px`
              }
            } else {
              benefit.style.height = 'auto'
              nextBenefit.style.height = 'auto'
            }
          }
        }
      })
    }
  },
  activated () {
    this.initParamObject()
    uiUtil.setInfiniteScroll(this, this.object)
  },
  methods: {
    isNull,
    /**
     * mutations(setter) 사용 선언부.
     * @param {String, Array} 'search', ['setSearchWordInfo', 'setTvTableStatus', 'setSearchProductAdultStat']
     */
    ...mapMutations('search', [
      'setSearchWordInfo',
      'setTvTableStatus',
      'setSearchProductAdultStat'
    ]),
    /**
      * 실시간 인기상품 클릭
      * @param {number} index 순서
      * @param {Object} productInfo - 상품정보
      * @param {Object} routingInfo - 라우터 정보(이동할 경로 및 파라메터)
      */
    realTimeDataLogging (index, productInfo, routingInfo) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_검색결과',
          eventAction: '추천영역',
          eventLabel: index + 1,
          params: {
            t1: null
          }
        }
      })
      const adultItemFlag = !isNull(productInfo.adultItemFlag) ? productInfo.adultItemFlag === 'Y' : false
      this.setSearchProductAdultStat(adultItemFlag) // vuex 연동. - 성인상품일 경우 로그인 완료 후 검색결과 페이지로 replace 시키기 위함.
      this.$router.push(routingInfo)
    },
    /**
     * 연관 검색어가 있으면 has_keyword 클래스 반환.
     * @param {Number} 연관 검색어 유무.
     * @returns {String}
     */
    getHasKeyword (relateWordLength) {
      if (relateWordLength > 0) { return 'has_keyword' }
    },
    /**
     * UI - 리스트 그리드 토글
     */
    listGrid () {
      if (this.listGridClass) {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction: '서브메뉴',
            eventLabel: '리스트형',
            params: {
              t1: null
            }
          }
        })
      } else {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction: '서브메뉴',
            eventLabel: '이미지형',
            params: {
              t1: null
            }
          }
        })
      }
      this.listGridClass = !this.listGridClass
    },
    /**
     * UI - 필터 레이어 열기/닫기
     */
    filter () {
      this.filterClass = !this.filterClass
      this.filterLayout = !this.filterLayout
      if (this.filterClass) {
        uiUtil.disableScroll()
        if (isOsApp()) {
          nativeUtil.setRoutePath('/modal')
        }
      } else {
        uiUtil.enableScroll()
        if (isOsApp()) {
          nativeUtil.setRoutePath(router.history.current.path)
        }
      }
    },
    /**
     * UI - 필터 확인버튼클릭
     */
    filterOk () {
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_검색결과',
          eventAction: '필터',
          eventLabel: '필터적용',
          params: {
            t1: null
          }
        }
      })
      this.filterClass = !this.filterClass
      this.filterLayout = !this.filterLayout
      if (this.filterClass) {
        uiUtil.disableScroll()
      } else {
        uiUtil.enableScroll()
      }
    },
    /**
     * UI - 필터 레이어 열기/닫기
     * @param {Number} event - 이벤트
     */
    accordion (event) {
      if (event === 1) {
        this.sort = !this.sort
      } else if (event === 2) {
        this.category = !this.category
        this.brandAndCateClassSet('categorySelected')
      } else if (event === 3) {
        this.brand = !this.brand
        this.brandAndCateClassSet('brandSelected')
      } else if (event === 4) {
        this.price = !this.price
      } else if (event === 5) {
        this.score = !this.score
      }
    },
    /**
     * UI - active sorting
     */
    nsRecommandAccordion () {
      this.sort = 'active'
      this.filter()
    },
    /**
     * UI - 브랜드 및 카테고리 선택(클릭)에 따라 하단영역 Show or Hide.
     * @param {String} param - 타겟 엘리먼트
     */
    brandAndCateClassSet (param) {
      if (this.$refs[param].classList.contains('active')) {
        this.$refs[param].classList.remove('active')
      } else {
        this.$refs[param].classList.add('active')
      }
    },
    /**
     * UI - 카테고리 중분류 토글.
     * @param {Object} event - 이벤트
     */
    categoryAccordion (event) {
      const nextUl = event.srcElement.nextElementSibling
      if (nextUl) {
        nextUl.classList.toggle('active')
      }
    },
    /**
     * 초기화 메소드.
     * @param {Object} params - 검색결과, 프로모션 텍스트 정보
     */
    init (params) {
      if (!isNull(params.searchTerm)) {
        this.searchTerm = params.searchTerm
      }

      if (!isNull(params.promotionText)) {
        this.promotionText = params.promotionText
      }

      if (!isNull(params.keywordType)) {
        this.keywordType = params.keywordType
      }
      this.onLoad()
    },
    /**
     * 검색어, 프로모션 텍스트, 검색어 타입 셋팅.
     * @param {Object} params - 검색어 관련 파라메터 객체.
     */
    setOnlyInitInfo (params) {
      if (!isNull(params.searchTerm)) {
        this.searchTerm = params.searchTerm
      }

      if (!isNull(params.promotionText)) {
        this.promotionText = params.promotionText
      }

      if (!isNull(params.keywordType)) {
        this.keywordType = params.keywordType
      }
    },
    /**
     * 페이지가 로딩된 후 기본적으로 처리해야 할 작업들을 정의한다.
     */
    onLoad () {
      this.getTotalSearchInfo() // 통합 검색 조회
    },
    /**
     * 필터나 다른 검색어일 경우 페이징 정보 초기화.
     * @returns {Promise}
     */
    pageInfoInitial () {
      return new Promise(resolve => {
        this.searchCallbackFlag = false
        if (this.pushFullEventFlag === false) { // 무한 스크롤 이벤트가 아닐때 검색 결과 리스트 및 파라메터 초기화.
          // this.searchProductList = []
          this.pageIdx = 1
          this.totalPage = 1
          this.totalCount = 0
        } else {
          this.pageIdx += 1 // 무한스크롤 이벤트일때 현재 페이지 파라메터 증가.
        }
        resolve(true)
      })
    },
    /**
     * 검색 결과 조회.
     */
    getTotalSearchInfo () {
      if (!this.searchingFlag) {
        this.searchingFlag = true
        this.pageInfoInitial().then(resolvedData => {
          if (resolvedData) {
            this.setSearchInfo().then(resolvedInnerData => {
              this.$nsaxios.post(
                'NSSearchMobileWrapper',
                resolvedInnerData,
                this.getTotalSearchInfoCallback,
                this.commonErrorHandler
              )
            })
          }
        })
      }
    },
    /**
     * getTotalSearchInfo 의 콜백 메또드.
     * @param {Object} data - 검색결과 데이터
     */
    getTotalSearchInfoCallback (data) {
      if (data && data.msg.root) { // 바로가기 정보 체크
        // 검색어에 관련된 바로가기 링크가 존재하는 경우 해당 URL로 이동 처리
        // if (!isNull(data.msg.root.RedirectUrl)) {
        //   if (data.msg.root.RedirectUrl.indexOf(process.env.VUE_APP_MOBILE_HOST) > -1) { // 내부 URL
        //     const redirectUrl = data.msg.root.RedirectUrl.replace(process.env.VUE_APP_MOBILE_HOST, '')
        //     router.push({ path: redirectUrl })
        //   } else { // 외부 URL
        //     window.open(data.msg.root.RedirectUrl, 'searchResult', 'status=1,toolbar=1,location=1,menubar=1,directories=1,resizable=1,scrollbars=1')
        //   }
        //   return
        // }
        //
        if (data.msg.root.filterSearchYn === 'Y') { // 조건 검색 여부
          this.filterSearchYn = true
        } else {
          this.filterSearchYn = false
        }
        const totalCount = !isNull(data.msg.root.TotalCount) ? data.msg.root.TotalCount : 0
        this.totalCount = totalCount
        if (totalCount === 0) {
          this.searchProductList = []
          this.setSearchFixedPaddingTop()
        }
        if (totalCount !== 0) {
          this.totalPage = Math.ceil(this.totalCount / this.pageSize)
          this.setAddOption(data) // 필터 초기 셋팅부
          this.makeProductListArea(data) // 상품정보 셋팅.
        } else {
          this.totalPage = 1
        }
      }
      this.searchCallbackFlag = true
      this.pagePullingFlag = false
      this.searchingFlag = false
    },

    /**
     * 상품정보 셋팅 메소드.
     * @param {Object} data(필수) - 검색결과 데이터.
     * @returns {void 또는 false}
     */
    makeProductListArea (data) {
      const productList = data.msg.root.ProductList
      const weightList = data.msg.root.weightList
      const vm = this
      try {
        if (this.pushFullEventFlag === false) {
          // this.searchProductList = []
          this.makeRelateSearchWordArea(data)
        }
        const objDrawData = productList
        const airbridgeProductList = [] // Airbridge 로그 정보
        const recobellProductList = [] // Recobell(EIGENE) 로그 정보
        const hsmoaProductList = [] // 홈쇼핑 모아 로그 정보
        const productArray = []

        let gaResultFlag = false
        objDrawData.forEach((element, i) => {
          gaResultFlag = true

          // 상품 정보 생성
          const productObject = this.makeProductItem(objDrawData[i], weightList[i], null, true)
          if (productObject) { productArray.push(productObject) }

          // Airbridge
          airbridgeProductList.push({
            productID: element.partNumber, // 제품 ID
            name: element.itncatentrynm, // 제품명
            price: Number(String(element.priceofferprice).replaceAll(',', '')), // 가격. pricedcprice:할인가
            currency: 'KRW',
            position: i + 1
          })
          // Recobell (EIGENE)
          if (i < 5) {
            recobellProductList.push({
              id: element.partNumber, // 제품 ID
              name: element.itncatentrynm, // 제품명
              price: element.priceofferprice // 가격. pricedcprice:할인가
            })
          }
          // 홈쇼핑 모아
          hsmoaProductList.push(element.partNumber)
        })

        // 마케팅 스크립트 적용 부분
        // Airbridge
        marketingUtil.airbridgeLogger.send({
          event: marketingUtil.airbridgeLogger.EVENT.SEARCH_RESULT_VIEW, // 검색결과 조회
          data: {
            query: this.searchTerm,
            products: airbridgeProductList,
            customAttributes: {
              categoryNm: '',
              gradeNm: loginUtil.getUserInfo('gradeNm')
            },
            action: '검색결과 조회',
            label: '검색결과 조회'
          }
        })
        // Recobell (EIGENE)
        marketingUtil.recobellLogger.send({
          data: {
            category: marketingUtil.CATEGORY_ADD_SEARCH,
            action: recobellProductList,
            searchTerm: this.searchTerm
          }
        })
        // 홈쇼핑 모아
        marketingUtil.hsmoaLogger.send({
          data: {
            from_hsmoa: false,
            action: hsmoaProductList,
            category: 'list'
          }
        })
        const keywordType = this.getKeywordType
        let searchType = ''
        if (keywordType === 'recentKeyword') {
          searchType = '최근 검색어'
        } else if (keywordType === 'popularKeyword') {
          searchType = '인기 검색어'
        } else {
          searchType = '직접 입력'
        }
        // GA 360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_PAGE,
          data: {
            category: marketingUtil.CATEGORY_ADD_SEARCH,
            action: gaResultFlag ? 'O' : 'X', // 검색결과 존재: O, 없으면: X
            searchType,
            searchTerm: this.searchTerm
          }
        })
        if (this.pageIdx === 1) { // 첫 로딩일때만
          this.searchProductList = productArray
          vm.makePlanListArea(data) // 연관 기획전 정보 셋팅.
          vm.makeRecommPrdListArea(data) // 실시간 인기 검색상품 정보 셋팅.
        } else {
          const newArray = this.searchProductList.concat(productArray)
          this.searchProductList = newArray
        }
        this.checkClick = true
      } catch (e) {
        console.error(e)
      }
    },
    /**
     * 개별 상품 정보 셋팅
     * @param {Object} prdItemInfo - 상품 개별정보
     * @param {Array} weightList - 가중치 목록
     * @param {null} null
     * @param {true} wishShowYn - 해당 상품의 찜여부
     * @returns {Object} dataSet
     */
    makeProductItem (prdItemInfo, weightList, func, wishShowYn) {
      if (!prdItemInfo) {
        return ''
      }
      const dataSet = {}
      // 이미지 영역 셋팅 imgAreaHtml
      dataSet.imageUrl = getImageUrl(prdItemInfo.partNumber, 366, 366, prdItemInfo.adultItemFlag)
      dataSet.partNumber = prdItemInfo.partNumber
      dataSet.brdctYn = prdItemInfo.brdctYn
      dataSet.adultItemFlag = prdItemInfo.adultItemFlag
      dataSet.onAirFlag = prdItemInfo.onAirFlag

      // 매체 타입 영역 셋팅 mediaTypeAreaHtml
      let mediaType1 = ''
      let mediaType2 = ''
      if (prdItemInfo.isTvShopping === 'Y') {
        mediaType1 = SEARCH_CONST.MEDIA_TYPE.IS_TV_SHOPPING
      } else if (prdItemInfo.isTvShopPlus === 'Y') {
        mediaType1 = SEARCH_CONST.MEDIA_TYPE.IS_TV_SHOPPLUS // isTvShopPlus
      } else {
        mediaType1 = ''
      }
      if (prdItemInfo.isHappyDeal === 'Y') {
        mediaType2 = SEARCH_CONST.MEDIA_TYPE.IS_HAPPYDEAL // isHappyDeal
      } else {
        mediaType2 = ''
      }
      dataSet.mediaType = { mediaType1, mediaType2 }
      // 상품명 , 가격정보 셋팅 prdInfoArea
      const prcWaveDisp = prdItemInfo.prcWaveDisp || ''
      const catentryNm = this.getHtmlDecode(prdItemInfo.itncatentrynm) // 상품명
      const oriPrice = prdItemInfo.priceofferprice // 판매가
      const salePrice = prdItemInfo.pricedcprice // 할인가
      const mmRntalPrc = prdItemInfo.mmRntalPrc // 검색결과 내에 렌탈상품 가격표기 개선
      const saleRate = prdItemInfo.saleRate // 할인율
      const dispTypeCd = prdItemInfo.dispTypeCd // 전시타입 코드
      const busChnId = prdItemInfo.busChnId
      const brdctYn = prdItemInfo.brdctYn
      const onAirFlag = prdItemInfo.onAirFlag

      dataSet.prdInfo = {
        prcWaveDisp,
        catentryNm,
        oriPrice,
        salePrice,
        mmRntalPrc,
        saleRate,
        dispTypeCd,
        busChnId,
        brdctYn,
        onAirFlag
      }

      // 혜택 정보 셋팅 benefitArea
      this.benefitTextList = []
      let benefitText = ''
      if (prdItemInfo.dlvrPrice === 0 && !this.checkFormlessProduct(dispTypeCd)) {
        benefitText = '무료배송'
        this.benefitTextList.push(benefitText)
      }
      if (prdItemInfo.ifiValue > 0) {
        benefitText = '무이자'
        this.benefitTextList.push(benefitText)
      }
      if (prdItemInfo.padValue !== 0) {
        benefitText = '적립금'
        this.benefitTextList.push(benefitText)
      }
      dataSet.benefitInfo = {
        benefitText: this.benefitTextList
      }

      // 상품평 정보 셋팅 reviewArea
      const joinCnt = prdItemInfo.join_cnt // 상품평 count
      const score = prdItemInfo.score // 상품평 평균 score
      dataSet.reviewInfo = {
        joinCnt,
        score
      }
      // 주문 수량(해당 상품의 총 구매량), 찜 정보 셋팅 ordCntAndWishArea
      let ordCnt = ''
      if (prdItemInfo.orderItemCount) {
        ordCnt = prdItemInfo.orderItemCount
      }
      // 찜 영역
      let isWishCheck = ''
      if (wishShowYn) {
        isWishCheck = prdItemInfo.wishProduct ? 'checked' : ''
      }
      const wishProduct = prdItemInfo.wishProduct
      const wishCatentryId = prdItemInfo.catentryId
      const wishCatName = prdItemInfo.catName
      const wishCatentryNmWish = prdItemInfo.catentryNm
      const wishImageUrl = dataSet.imageUrl
      const wishOriPrice = prdItemInfo.oriPrice
      const wishBusChnId = prdItemInfo.busChnId

      dataSet.ordCntAndWishInfo = {
        ordCnt,
        isWishCheck,
        wishProduct,
        catentryId: wishCatentryId,
        catName: wishCatName,
        catentryNm: wishCatentryNmWish,
        imageUrl: wishImageUrl,
        oriPrice: wishOriPrice,
        busChnId: wishBusChnId
      }
      return dataSet
    },
    /**
     * 상품평 카운트.
     * @param {Number} param - 상품평수
     * @returns {String 또는 Number} *, numberParam
     */
    getJoinCnt (param) {
      const numberParam = Number(param)
      if (numberParam > 9999) {
        return '+9,999'
      } else {
        return insertCommas(numberParam)
      }
    },
    /**
     * 상품 평점.
     * @param {Number} param - 0~100 의 숫자로 구성되어 있다.
     * @returns {String}
     */
    getScore (param) {
      return `width: ${param}%;`
    },
    /**
     * 주문 수량.
     * @param {Number} param - 주문수량
     * @returns {String}
     */
    getOrderCount (param) {
      const numberParam = param
      if (numberParam > 9999999) {
        return '9,999,999개 구매'
      } else if (numberParam <= 0) {
        return '0개 구매'
      } else {
        return `${insertCommas(numberParam)}개 구매`
      }
    },
    /**
     * 연관 검색어
     * @param {Object} data - 검색결과 데이터.
     */
    makeRelateSearchWordArea (data) {
      const resultList = data.msg.root.RecomList
      const setRelateWordList = []
      if (resultList && resultList.length > 0) {
        for (let i = 0; i < resultList.length; i++) {
          setRelateWordList.push(resultList[i])
          if (i === 7) { // 8개 까지만 셋팅.
            break
          }
        }
      }
      this.relateSearchWord = setRelateWordList
      this.setSearchFixedPaddingTop()
    },
    /**
     * 검색 실행.
     * @param {String} searchTerm - 검색어
     * @param {Number} index - 순서
     */
    searchExecute (searchTerm, index) {
      const goingInvok = {
        path: `/search/result/${searchTerm}`,
        params: {
          searchTerm
        }
      }
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_검색결과',
          eventAction: '검색필드',
          eventLabel: `연관검색_${index}`,
          params: {
            t1: null
          }
        }
      })
      this.setSearchWordInfo(goingInvok.params)
      this.$router.replace(goingInvok)
    },
    /**
     * 연관 기획전 데이터 셋팅.
     * @param {Object} data - 검색결과 데이터
     * @returns {void || bool}
     */
    makePlanListArea (data) {
      this.planList = []
      const planList = []
      const planItems = data.msg.root.PlanList
      if (planItems && planItems.length > 0) {
        const nCount = planItems.length

        if (nCount === 0) {
          return false
        }

        for (let i = 0; i < nCount; i++) {
          const protocol = 'https:'
          const imgUrl = protocol + planItems[i].imgUrl
          const catalogId = externalUtil.getBroadCastParam(`?${htmlDecode(planItems[i].mdUrl).split('?')[1]}`).catalogId
          const contentsId = planItems[i].contentsId
          const planId = planItems[i].planId
          const mdUrl = planItems[i].mdUrl
          planList.push(
            {
              imgUrl,
              catalogId,
              contentsId,
              planId,
              mdUrl
            }
          )
        }
        this.planList = planList
      }
    },
    /**
     * 실시간 인기 검색 상품 ( 레코벨 추천 데이터 )
     * @param {Object} data - 검색결과 데이터
     */
    makeRecommPrdListArea (data) {
      const vm = this
      const realTimeSearchData = []
      const realTimeFavoriteList = data.msg.root.realTimeFavoriteList
      if (realTimeFavoriteList && realTimeFavoriteList.length > 0) {
        for (let i = 0; realTimeFavoriteList.length > i; i++) {
          const prdItemInfo = realTimeFavoriteList[i]
          const partNumber = prdItemInfo.partNumber
          const imageUrl = getImageUrl(partNumber, 296, 296, prdItemInfo.adultItemFlag)
          const prcWaveDisp = prdItemInfo.prcWaveDisp || ''
          const catentryNm = this.getHtmlDecode(prdItemInfo.itncatentrynm) // 상품명
          const salePrice = prdItemInfo.pricedcprice // 할인가
          const dispTypeCd = prdItemInfo.dispTypeCd
          const busChnId = prdItemInfo.busChnId
          const mmRntalPrc = prdItemInfo.mmRntalPrc
          const brdctYn = prdItemInfo.brdctYn
          const onAirFlag = prdItemInfo.onAirFlag
          const adultItemFlag = prdItemInfo.adultItemFlag
          // 상품 상세 페이지 이동 이벤트
          const tmpMultiCd = prdItemInfo.multiCd || null

          realTimeSearchData.push(
            {
              prdItemInfo,
              catentryNm,
              partNumber,
              imageUrl,
              salePrice,
              mmRntalPrc,
              prcWaveDisp,
              dispTypeCd,
              busChnId,
              tmpMultiCd,
              brdctYn,
              onAirFlag,
              adultItemFlag
            }
          )
        }
      }
      vm.realTimeSearchData = realTimeSearchData
    },
    /**
     * 검색결과가 16건보다 적은가에 대한 체크후 bool 반환.
     * 반환된 bool값에 따라, 렌더링 영역이 달라짐.
     * @returns {bool}
     */
    isRealTimeLengthSmallerThan16 () {
      let checker = this.searchProductList.length <= 16
      if (checker) {
        checker = this.realTimeSearchData.length > 0
        if (checker) {
          return true
        }
      }
      return false
    },
    /**
     * 검색결과가 16건보다 많은가에 대한 체크후 bool 반환.
     * 반환된 bool값에 따라, 렌더링 영역이 달라짐.
     * @param {bool} index - 루프 인덱스
     * @returns {bool}
     */
    isRealTimeLengthBiggerThan16 (index) {
      return this.searchProductList.length > 16 && index === 16 && this.realTimeSearchData.length > 0
    },
    /**
     * 찜여부에 따른 UI 분기를 위한 class 반환.
     * @param {bool} param - 찜 상태 bool값
     * @returns {String}
     */
    isWish (param) {
      return param ? 'on' : ''
    },
    /**
     * 부가 정보 ui 셋팅.
     * @param {Object} data - 검색결과 데이터
     */
    setAddOption (data) {
      if (this.clickCheckBoxFlag === false) { // 필터를 클릭한게 아니라면 필터 목록 체크박스 재생성.
        this.hasBenefitList(data) // 배송/혜택 정보 셋팅
        this.hasStoreTypeList(data) // 매체타입 필터 정보 셋팅
        this.setCateList(data) // 조건검색 카테고리 정보 셋팅
        this.setBrandList(data) // 조건검색 브랜드 정보 셋팅
        this.setProductPrice(data) // 최소 최대가 가격 정보 셋팅
        this.clickCheckBoxFlag = false
      }
    },
    /**
     * 검색어 및 필터 데이터 셋팅.
     * @returns {Promise}
     */
    setSearchInfo () {
      return new Promise(resolve => {
        const invoke = {
          searchType: 'search',
          appType: 'MOBILE',
          filterType: this.filterType ? this.filterType.join(',') : this.filterType, // filterType: this.filterType ? this.filterType : this.filterType.join(','),
          searchTerm: this.searchTerm,
          researchTerm: this.researchTerm,
          currentPage: this.pageIdx,
          pageSize: this.pageSize,
          sortCriteria: this.sortCriteria,
          priceStart: this.priceStart,
          priceEnd: this.priceEnd,
          cate3Name: this.cate3Name ? this.cate3Name.join(',') : [],
          brandName: this.brandName ? this.brandName.join(',') : [],
          freeDeliverYn: this.freeDeliverYn ? this.freeDeliverYn : '',
          interestFreeYn: this.interestFreeYn ? this.interestFreeYn : '',
          saveYn: this.saveYn ? this.saveYn : '',
          lspYn: this.lspYn ? this.lspYn : '',
          priceFilterFlag: this.priceFilterFlag,
          categoryFilterFlag: this.categoryFilterFlag,
          setBrandFinishFlag: this.setBrandFinishFlag,
          benefitFilterFlag: this.benefitFilterFlag,
          storeTypeFilterFlag: this.storeTypeFilterFlag,
          hasBenefitLabels: this.hasBenefitLabels,
          hasStoreTypeLabels: this.hasStoreTypeLabels,
          checkedFilterElement: this.checkedFilterElement,
          priceList: this.priceList,
          listForInputRecheckFromBack: this.listForInputRecheckFromBack
        }
        resolve(invoke)
      })
    },
    /**
     * 검색어 셋팅 및 필터 초기화.
     */
    resetFilter () {
      this.filterType = []
      this.researchTerm = ''
      this.pageIdx = 1
      this.pageSize = 30
      this.sortCriteria = 'weight'
      this.priceStart = ''
      this.priceEnd = ''
      this.clickedPriceText = '가격 전체'
      this.cate3Name = []
      this.brandName = []
      this.brandSortNmList = []
      this.brandSortCntList = []
      this.freeDeliverYn = ''
      this.interestFreeYn = ''
      this.saveYn = ''
      this.lspYn = ''
      this.starForSort = ''
      this.cate3NameView = []
      this.benefitFilterFlag = false
      this.priceFilterFlag = false
      this.categoryFilterFlag = false
      this.setBrandFinishFlag = false
      this.storeTypeFilterFlag = false
      this.$refs.defaultPrice.checked = true
      this.$refs.categorySelected.classList.remove('selected')
      this.$refs.brandSelected.classList.remove('selected')
      document.querySelectorAll('li[name=sort_wrapper]').forEach(element => {
        element.classList.remove('active')
      })
      document.querySelectorAll('input[name=sort]').forEach(element => {
        element.checked = false
      })
      if (!isNull(document.getElementById('weight').checked)) {
        document.getElementById('weight').checked = true
      }

      this.setTvTableStatus(false)

      try {
        this.getTotalSearchInfo()
        this.checkedFilterElement.forEach(element => {
          if (!isNull(this.$refs[element][0].checked)) { this.$refs[element][0].checked = false }
        })
        this.checkedFilterElement = []
      } catch (e) {
      }
    },
    /**
     * 필터 내 혜택 노출 여부
     * @param {Object} data - 검색결과 데이터
     */
    hasBenefitList (data) {
      if (this.benefitFilterFlag) { return }
      const benefitYn = data.msg.root.benefitYn
      if (isNull(benefitYn)) { return false }
      this.hasBenefitLabels = Object.keys(benefitYn).filter(key => benefitYn[key] === 'Y' && key !== 'hasLspYn')
      this.benefitFilterFlag = true
    },
    /**
     * 혜택 한글이름 찾아주는 메소드.
     * @param {String} param - 혜택정보 영어
     * @returns {String}
     */
    getBenefitLabel (param) {
      return SEARCH_CONST.BENEFIT_LABEL[param]
    },
    /**
     * 페이징 정보 초기화 메소드.
     * @returns {Promise}
     */
    resetPageingInfo () {
      return new Promise(resolve => {
        this.pushFullEventFlag = false
        // this.searchProductList = []
        this.pageIdx = 1
        this.totalPage = 1
        this.totalCount = 0
        resolve(true)
      })
    },

    /**
     * 혜택 필터 클릭시 메소드.
     * @param {String} param - check box
     * @param {String} newFilterYn - 간편 필터(신규기능) 여부
     * @param {String} flag - 간편필터 / 필터 구분자
     */
    benefitFilterClicked (param, newFilterYn = 'N', flag) {
      const filterValueGA = this.getBenefitLabel(param)
      this.clickCheckBoxFlag = true
      const checked = newFilterYn === 'Y' ? this.$refs[param][0].checked : this.$refs[param][1].checked

      let eventAction = ''
      if (flag === 'subFilter') {
        eventAction = '서브메뉴'
      } else {
        eventAction = '필터'
      }
      if (checked) {
        // 마케팅 스크립트 적용 부분
        // GA 360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction,
            eventLabel: `선택_배송/혜택_${filterValueGA}`,
            params: {
              t1: null
            }
          }
        })

        this[SEARCH_CONST.MATCH_TO_BENEFIT_STATEDATA[param]] = 'Y'
        this.$nextTick(() => {
          this.checkedFilterElement.push(param)
        })
      } else {
        // 마케팅 스크립트 적용 부분
        // GA 360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction,
            eventLabel: `해제_배송/혜택_${filterValueGA}`,
            params: {
              t1: null
            }
          }
        })
        this[SEARCH_CONST.MATCH_TO_BENEFIT_STATEDATA[param]] = ''
        const idx = this.checkedFilterElement.indexOf(param)
        if (idx > -1) {
          this.$nextTick(() => {
            this.checkedFilterElement.splice(idx, 1)
          })
        }
      }
      const tempArray = this.checkedFilterElement
      this.checkedFilterElement = tempArray
      this.resetPageingInfo().then(resolvedData => {
        if (resolvedData) { this.getTotalSearchInfo() }
      })
    },
    /**
     * 전문매장 필터 셋팅
     * @param {Object} data - 검색결과 데이터
     */
    hasStoreTypeList (data) {
      /*
      TV쇼핑 : channelTvShoppingCnt
      샵플러스 : channelTvShopPlusCnt
      백화점몰 : channelDepartmentCnt
      쇼핑북 : channelSbCnt
      해피딜 : channelHappyDealCnt
      */
      if (this.storeTypeFilterFlag) { return }
      const hasStoreTypeLabels = []
      const channelCount = data.msg.root.channelCount

      const channelTvShoppingCnt = channelCount.channelTvShoppingCnt + channelCount.channelTvShopPlusCnt
      const channelHappyDealCnt = channelCount.channelHappyDealCnt
      const channelSbCnt = channelCount.channelSbCnt
      const channelDepartmentCnt = channelCount.channelDepartmentCnt

      if (channelTvShoppingCnt > 0) { hasStoreTypeLabels.push('channelTvShoppingCnt') }
      if (channelHappyDealCnt > 0) { hasStoreTypeLabels.push('channelHappyDealCnt') }
      if (channelSbCnt > 0) { hasStoreTypeLabels.push('channelSbCnt') }
      if (channelDepartmentCnt > 0) { hasStoreTypeLabels.push('channelDepartmentCnt') }
      this.hasStoreTypeLabels = hasStoreTypeLabels
      this.storeTypeFilterFlag = true
    },
    /**
     * 전문매장 한글이름 찾아주는 메소드.
     * @param {String} param - 전문매장 영어이름
     * @returns {String}
     */
    getStoreTypeLabel (param) {
      return SEARCH_CONST.STORE_TYPE_LABEL[param]
    },
    /**
     * 전문매장 필터 클릭시 메소드.
     * @param {String} param - check box
     * @param {String} newFilterYn - 간편 필터(신규기능) 여부.
     * @param {String} flag - 간편필터 / 필터 구분자
     */
    storeTypeFilterClicked (param, newFilterYn = 'N', flag) {
      this.clickCheckBoxFlag = true
      const checked = newFilterYn === 'Y' ? this.$refs[param][0].checked : this.$refs[param][1].checked

      let eventAction = ''
      if (flag === 'subFilter') {
        eventAction = '서브메뉴'
        if (checked) {
          // 마케팅 스크립트 적용 부분
          // GA 360
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_검색결과',
              eventAction,
              eventLabel: `선택_${SEARCH_CONST.STORE_TYPE_LABEL[param]}`,
              params: {
                t1: null
              }
            }
          })
          this.filterType.push(SEARCH_CONST.MATCH_TO_FILTER_TYPE[param]) // 실제 필터데이터 셋팅
          this.$nextTick(() => {
            this.checkedFilterElement.push(param) // ui상 보여주기용 체크박스를 위한 데이터셋 셋팅
          })
        } else {
        // 마케팅 스크립트 적용 부분
          // GA 360
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_검색결과',
              eventAction,
              eventLabel: `해제_${SEARCH_CONST.STORE_TYPE_LABEL[param]}`,
              params: {
                t1: null
              }
            }
          })
          let idx = this.filterType.indexOf(SEARCH_CONST.MATCH_TO_FILTER_TYPE[param])
          if (idx > -1) {
            this.filterType.splice(idx, 1) // 실제 필터데이터 해제
          }
          idx = this.checkedFilterElement.indexOf(param)
          if (idx > -1) {
            this.$nextTick(() => {
              this.checkedFilterElement.splice(idx, 1) // ui상 보여주기용 체크박스를 위한 데이터셋 해제
            })
          }
        }
      } else {
        eventAction = '필터'
        if (checked) {
          // 마케팅 스크립트 적용 부분
          // GA 360
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_검색결과',
              eventAction,
              eventLabel: `전문매장_${SEARCH_CONST.STORE_TYPE_LABEL[param]}`,
              params: {
                t1: null
              }
            }
          })
          this.filterType.push(SEARCH_CONST.MATCH_TO_FILTER_TYPE[param]) // 실제 필터데이터 셋팅
          this.$nextTick(() => {
            this.checkedFilterElement.push(param) // ui상 보여주기용 체크박스를 위한 데이터셋 셋팅
          })
        } else {
        // 마케팅 스크립트 적용 부분
          // GA 360
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_검색결과',
              eventAction,
              eventLabel: `전문매장_${SEARCH_CONST.STORE_TYPE_LABEL[param]}`,
              params: {
                t1: null
              }
            }
          })
          let idx = this.filterType.indexOf(SEARCH_CONST.MATCH_TO_FILTER_TYPE[param])
          if (idx > -1) {
            this.filterType.splice(idx, 1) // 실제 필터데이터 해제
          }
          idx = this.checkedFilterElement.indexOf(param)
          if (idx > -1) {
            this.$nextTick(() => {
              this.checkedFilterElement.splice(idx, 1) // ui상 보여주기용 체크박스를 위한 데이터셋 해제
            })
          }
        }
      }
      const tempArray = this.checkedFilterElement
      this.checkedFilterElement = tempArray
      let checker = false
      this.checkedFilterElement.indexOf('channelTvShoppingCnt') > -1 ? checker = false : checker = true
      this.setTvTableStatus(checker)
      this.resetPageingInfo()
      this.getTotalSearchInfo()
    },
    /**
     * 필터 - 카테고리 및 하위항목 데이터 구성.
     * @param {Object} data - 검색결과 데이터
     * @returns {void || bool}
     */
    setCateList (data) {
      const cate2List = data.msg.root.cate2List
      const cate3List = data.msg.root.cate3List

      if (!cate2List || cate2List.length <= 0) {
        return false
      }

      const cateRootList = []
      for (let i = 0; i < cate2List.length; i++) {
        const cate2ObjectSet = {}
        const cate2Cnt = cate2List[i].cateCount
        const cate2Name = cate2List[i].cateName.split('$|')
        const viewCate2Nm = cate2Name.splice(cate2Name.length - 1, 1)
        cate2ObjectSet[viewCate2Nm] = {}
        cate2ObjectSet[viewCate2Nm].cateCount = insertCommas(cate2Cnt)
        cate2ObjectSet[viewCate2Nm].lowCate = []
        cateRootList.push(cate2ObjectSet)
        for (let j = 0; j < cate3List.length; j++) {
          const cate3Cnt = cate3List[j].cateCount
          const cate3Name = cate3List[j].cateName
          const splitCate3Name = cate3Name.split('$|')
          const viewCate3Nm = splitCate3Name.splice(splitCate3Name.length - 1, 1)
          const upperCate3Nm = splitCate3Name.join('$|')

          if (cate2List[i].cateName === upperCate3Nm) {
            cateRootList[i][viewCate2Nm].lowCate.push(
              { [viewCate3Nm]: cate3Cnt, cate3Name: [cate3Name] }
            )
          }
        }
      }
      this.cateRootList = cateRootList
      this.categoryFilterFlag = true
    },
    /**
     * 카테고리 필터 클릭시 메소드.
     * @param {String} rootName - 카테고리 최상위 이름.
     * @param {String} viewName - UI 데이터
     * @param {String} paramName - 서버에 넘길 파라메터
     */
    categoryFilterClicked (rootName, viewName, paramName, lowValue) {
      this.clickCheckBoxFlag = true
      const cateViewName = `${rootName}_${viewName}`
      const cateParamName = paramName.replace(/amp;/gi, '')
      const checked = this.$refs[cateViewName][0].checked
      if (checked) {
        // 마케팅 스크립트 적용 부분
        // GA 360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction: '필터',
            eventLabel: `선택_${cateViewName}`,
            params: {
              t1: null
            }
          }
        })
        this.cate3Name.push(cateParamName) // 실제 필터데이터 셋팅
        this.cate3NameView.push(viewName) // ui상 보여주기용 체크박스를 위한 데이터셋 셋팅
        this.checkedFilterElement.push(cateViewName)
      } else {
        // 마케팅 스크립트 적용 부분
        // GA 360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction: '필터',
            eventLabel: `해제_${cateViewName}`,
            params: {
              t1: null
            }
          }
        })
        let idx = this.cate3Name.indexOf(cateParamName)
        if (idx > -1) {
          this.cate3Name.splice(idx, 1) // 실제 필터데이터 해제
        }
        idx = this.cate3NameView.indexOf(viewName)
        if (idx > -1) {
          this.cate3NameView.splice(idx, 1) // ui상 보여주기용 체크박스를 위한 데이터셋 해제
        }
        idx = this.checkedFilterElement.indexOf(cateViewName)
        if (idx > -1) {
          this.checkedFilterElement.splice(idx, 1) // ui상 보여주기용 체크박스를 위한 데이터셋 해제
        }
      }
      if (this.cate3NameView.length) {
        this.$refs.categorySelected.classList.add('selected')
      } else {
        this.$refs.categorySelected.classList.remove('selected')
      }
      this.resetPageingInfo()
      this.setSearchInfo().then(() => {
        this.getTotalSearchInfo()
      })
    },
    /**
     * 카테고리 배열을 스트링문자열로 풀어서 하나의 변수를 반환.
     * @param {Array} paramArray - 카테고리 배열
     * @returns {String}
     */
    getTransCateLabel (paramArray) {
      let returnString = ''
      paramArray.forEach((element, index) => {
        if (index === 0) {
          returnString = element
        } else {
          returnString += `, ${element}`
        }
      })
      return returnString
    },
    /**
     * 브랜드 이름 배열과, 해당 브랜드의 count 배열 할당.
     * @param {Object} data(필수)
     * @returns {void 또는 false}
     */
    setBrandList (data) {
      if (data && (data.msg.root.brandSortCntList.length > 0 || data.msg.root.brandSortNmList.length > 0)) {
        this.brandSortCntList = data.msg.root.brandSortCntList
        this.brandSortNmList = data.msg.root.brandSortNmList
        this.setBrandFinishFlag = true
      } else if (this.brandSortCntList.length <= 0 && this.brandSortNmList.length <= 0) {
        return false
      }
    },
    /**
     * 브랜드 필터 클릭시 메소드.
     * @param {String} param(필수)
     */
    brandFilterClicked (param) {
      this.clickCheckBoxFlag = true
      const checked = this.$refs[param][0].checked
      if (checked) {
        // 마케팅 스크립트 적용 부분
      // GA 360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction: '필터',
            eventLabel: `선택_${param}`,
            params: {
              t1: null
            }
          }
        })
        this.brandName.push(param)
        this.checkedFilterElement.push(param)
      } else {
        // 마케팅 스크립트 적용 부분
        // GA 360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction: '필터',
            eventLabel: `해제_${param}`,
            params: {
              t1: null
            }
          }
        })
        let idx = this.checkedFilterElement.indexOf(param)
        if (idx > -1) {
          this.checkedFilterElement.splice(idx, 1)
        }
        idx = this.brandName.indexOf(param)
        if (idx > -1) {
          this.brandName.splice(idx, 1)
        }
      }
      if (this.brandName.length) {
        this.$refs.brandSelected.classList.add('selected')
      } else {
        this.$refs.brandSelected.classList.remove('selected')
      }
      this.resetPageingInfo()
      this.getTotalSearchInfo()
    },
    /**
     * 최저가, 최고가 셋팅.
     * @param {Object} data(필수)
     */
    setProductPrice (data) {
      if (this.priceFilterFlag) {
        return false
      }
      this.priceList = []
      let priceList = []
      let priceListLength = 0
      const priceStart = Number(data.msg.root.priceStart)
      let priceEnd = Number(data.msg.root.priceEnd)

      if (priceEnd >= 5000000) { // 최고가가 500만원 이상일 경우 500을 기준
        priceEnd = 5000000
      }
      if (priceStart <= 10000) { // 1만원 이하의 상품이 있을시, 최저가 1만원 셋팅.
        priceList.push(insertCommas('10000'))
      } else { // 1만원 이하의 상품이 없을 경우 : 올림으로 올려서 진행
        const length = priceStart.toString().length
        const substring = priceStart.toString().substring(0, length - 5)
        const roundingUp = `${Number(priceStart.toString().charAt(length - 5)) + 1}0000`
        const lowPriceSet = substring + roundingUp
        priceList.push(insertCommas(lowPriceSet))
      }
      if (priceStart === priceEnd) {

      } else if ((priceEnd - priceStart) < 500) { // 최저가 최고가의 차이가 500 미만일때 최고가이하로 한항목만 표시.
        priceList = []
        priceList.push(insertCommas(priceEnd))
        this.OnlyEndPriceFlag = true
      } else {
        const priceAverage = Number(priceEnd / 5)
        let length = priceAverage.toString().length
        let substring = priceAverage.toString().substring(0, length - 2)
        const average = `${substring}00`

        priceList.push(insertCommas(Number(moneyUnformat(priceList[0])) + Number(average)))
        priceList.push(insertCommas(Number(moneyUnformat(priceList[1])) + Number(average)))
        priceList.push(insertCommas(Number(moneyUnformat(priceList[2])) + Number(average)))
        if (priceEnd >= 5000000) {
          priceList.push(insertCommas(priceEnd))
        } else {
          length = priceEnd.toString().length
          substring = priceEnd.toString().substring(0, length - 5)
          const roundingUp = `${Number(priceEnd.toString().charAt(length - 5)) - 1}0000`
          const topPriceSet = substring + roundingUp
          priceList.push(insertCommas(topPriceSet))
        }
      }
      priceListLength = priceList.length
      this.priceList = priceList
      this.priceListLength = priceListLength
    },
    /**
     * 셋팅된 가격대를 클릭했을때의 동작.
     * @param {String} min - 최소가격
     * @param {String} max - 최대가격
     */
    priceSubmit (min, max) {
      this.clickCheckBoxFlag = true
      this.priceFilterFlag = true
      if (min === '' && max === '') {
      // 마케팅 스크립트 적용 부분
      // GA 360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction: '필터',
            eventLabel: '가격 전체',
            params: {
              t1: null
            }
          }
        })
        this.clickedPriceText = '가격 전체'
      } else {
        // 마케팅 스크립트 적용 부분
        // GA 360
        if (min === '0') {
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_검색결과',
              eventAction: '필터',
              eventLabel: `가격대_${max}` + '원 이하',
              params: {
                t1: null
              }
            }
          })
        } else {
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_검색결과',
              eventAction: '필터',
              eventLabel: `가격대_${min}` + '원~' + `${max}` + '원',
              params: {
                t1: null
              }
            }
          })
        }
        this.clickedPriceText = `${min}원 ~ ${max}원`
      }

      const unCommaMinPrice = moneyUnformat(min)
      const unCommaMaxPrice = moneyUnformat(max)
      this.priceStart = unCommaMinPrice
      this.priceEnd = unCommaMaxPrice
      this.resetPageingInfo()
      this.getTotalSearchInfo()
    },
    /**
     * 셋팅된 정렬을 클릭했을때의 동작.
     * @param {String} param - 필터 종류
     * @param {String} flag - 간편필터 / 필터 구분자
     */
    setSortCriteria (param, flag) {
      /* sortCriteria 값 명세.
        NS추천: weight
        판매량순: best
        낮은가격순: lowPrice
        높은가격순: topPrice
        상품평순: comment
        별점순: eval
      */
      let activeToNonActive = false // 자주 찾는 필터 활성 --> 비활성 여부.
      document.querySelectorAll('li[name=sort_wrapper]').forEach(element => {
        if (element.classList.contains('active')) {
          if (`${element.id}` === `_${param}`) {
            activeToNonActive = true
          }
        }
        element.classList.remove('active')
      })
      document.querySelectorAll('input[name=sort]').forEach(element => {
        element.checked = false
      })
      if (!activeToNonActive) { // 자주 찾는 필터 비활성 --> 활성 상태일때 일치하는 필터 UI 표시.
        let checker = !isNull(document.querySelectorAll(`#${param}`)[0])
        if (checker) {
          document.querySelectorAll(`#${param}`)[0].checked = true
        }
        checker = !isNull(document.querySelector(`#_${param}`))
        if (checker) {
          document.querySelector(`#_${param}`).classList.add('active')
        }
      } else { // 자주 찾는 필터 활성 --> 비활성 상태일때 필터만 기본값 체크 (자주찾는 필터에는 NS추천이 없음.)
        if (flag === 'subFilter') {
          document.querySelectorAll('#weight')[0].checked = true
        } else {
          document.querySelectorAll(`#${param}`)[0].checked = true
        }
      }
      // 마케팅 스크립트 적용 부분
      // GA 360
      let eventAction = ''
      if (flag === 'subFilter') {
        eventAction = '서브메뉴'
      } else {
        eventAction = '필터'
      }
      if (param === 'weight') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction,
            eventLabel: 'NS추천',
            params: {
              t1: null
            }
          }
        })
      } else if (param === 'best') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction,
            eventLabel: '판매량순',
            params: {
              t1: null
            }
          }
        })
      } else if (param === 'lowPrice') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction,
            eventLabel: '낮은가격순',
            params: {
              t1: null
            }
          }
        })
      } else if (param === 'topPrice') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction,
            eventLabel: '높은가격순',
            params: {
              t1: null
            }
          }
        })
      } else if (param === 'comment') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction,
            eventLabel: '상품평순',
            params: {
              t1: null
            }
          }
        })
      } else if (param === 'eval') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_검색결과',
            eventAction,
            eventLabel: '별점순',
            params: {
              t1: null
            }
          }
        })
      }
      if (activeToNonActive && flag === 'subFilter') {
        this.sortCriteria = 'weight'
      } else {
        this.sortCriteria = param
      }
      this.resetPageingInfo()
      this.getTotalSearchInfo()
      this.selectedEasySort = param
    },
    /**
     * 정렬의 한글값을 반환.
     * @param {String} param(필수)
     * @returns {String}
     */
    getSortLabel (param) {
      return SEARCH_CONST.SORT_LABEL_LIST[param]
    },
    /**
     * 검색결과 없을때 선택된 필터들을 텍스트로 보여줌.
     * @returns {String}
     */
    getFilterCheckLable () {
      let text = ''
      this.checkedFilterElement.forEach(element => {
        if (SEARCH_CONST.BENEFIT_LABEL[element]) {
          if (text === '') {
            text += SEARCH_CONST.BENEFIT_LABEL[element]
          } else {
            text += ` / ${SEARCH_CONST.BENEFIT_LABEL[element]}`
          }
        }
        if (SEARCH_CONST.STORE_TYPE_LABEL[element]) {
          if (text === '') {
            text += SEARCH_CONST.STORE_TYPE_LABEL[element]
          } else {
            text += ` / ${SEARCH_CONST.STORE_TYPE_LABEL[element]}`
          }
        }
      })
      if (this.clickedPriceText !== '가격 전체') {
        if (text === '') {
          text += this.clickedPriceText
        } else {
          text += ` / ${this.clickedPriceText}`
        }
      }
      this.cate3NameView.forEach(element => {
        if (text === '') {
          text += element
        } else {
          text += ` / ${element}`
        }
      })
      this.brandName.forEach(element => {
        if (text === '') {
          text += element
        } else {
          text += ` / ${element}`
        }
      })
      return text
    },
    /**
     * 특정 문자 치환하는 메소드 호출 - &amp;, &gt; 등등...
     * @param {String} string(필수)
     * @returns {String}
     */
    getHtmlDecode (string) {
      return htmlDecode(string)
    },
    /**
     * 무한 스크롤용 객체 초기화.
     */
    initParamObject () {
      this.object.callback = this.pagePulling
      this.object.isEnable = true
      this.object.interval = 2000
      this.object.options = {
        rootMargin: '100% 0px'
      }
    },
    /**
     * 무한 스크롤용 객체 초기화.
     * @param {bool} param
     */
    setPushFullEventFlag (param) {
      this.pushFullEventFlag = param
    },
    /**
     * 무한 스크롤용 콜백 동작 설정.
     * @returns {false 또는 void}
     */
    pagePulling () {
      if (this.pagePullingFlag) { return false }
      this.pagePullingFlag = true
      if (this.pageIdx < this.totalPage) {
        this.setPushFullEventFlag(true)
        this.clickCheckBoxFlag = true
        this.getTotalSearchInfo()
      } else {
        this.setPushFullEventFlag(false)
      }
    },

    /**
     * 검색결과 클릭
     * @param {String} productInfo 상품정보
     * @param {Object} routingInfo - 이동해야할 라우터의 정보(경로 및 파라메터)
     */
    searchResultLogging (productInfo, routingInfo) {
      const data = productInfo.prdInfo

      // 제품_상품 유형
      let tvProduct = ''
      if (data.busChnId === 'INT') {
        tvProduct = 'e상품'
      } else {
        tvProduct = 'eTV'
      }

      // E-commerce
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
        data: {
          step: marketingUtil.ga360Logger.ECOMMERCE_STEP_11,
          params: [
            {
              id: String(productInfo.partnumber),
              name: data.catentryNm,
              dimension16: tvProduct
            }
          ],
          subparams: {
            t1: '검색',
            t2: '검색결과',
            product_list: '검색_검색결과'
          }
        }
      })
      const adultItemFlag = !isNull(productInfo.adultItemFlag) ? productInfo.adultItemFlag === 'Y' : false
      this.setSearchProductAdultStat(adultItemFlag) // vuex 연동. - 성인상품일 경우 로그인 완료 후 검색결과 페이지로 replace 시키기 위함.
      this.$router.push(routingInfo)
    },
    /**
     * 숫자에 3자리마다 콤마 추가하는 공통함수 호출
     * @param {Number} param 변환할 타겟
     * @returns {String}
     */
    getInsertCommas (param) {
      return insertCommas(param)
    },
    /**
     * 검색결과 헤더 영역 높이 조절.
     */
    setSearchFixedPaddingTop () {
      this.$nextTick(() => { // setTimeout 500 second
        // 상단 고정 ui 높이값만큼 paddingTop 간격 조정
        const checker =
          !isNull(document.querySelector('.search_fixed')) &&
          !isNull(document.querySelector('.search_fixed').scrollHeight)
        const searchFixedHeight = checker ? document.querySelector('.search_fixed').scrollHeight : 0
        document.querySelector('.search_result').style.paddingTop = `${searchFixedHeight}px`
      })
    },
    /**
     * 검색 결과 유무에 따른 UI 분기처리.
     */
    setHeaderClass () {
      this.$nextTick(() => {
        const totalCount = this.totalCount
        const searchPageClass = document.querySelector('.search_page')
        const classListCheck =
          !isNull(searchPageClass) &&
          !isNull(searchPageClass.classList)
        const borderNoneCheck =
          classListCheck &&
          searchPageClass.classList.contains('border_none')
        if (totalCount === 0) {
          if (borderNoneCheck) {
            searchPageClass.classList.remove('border_none')
          }
        } else {
          if (!borderNoneCheck) {
            searchPageClass.classList.add('border_none')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/store/SearchResult";
</style>
