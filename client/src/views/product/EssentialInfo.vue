<template>
  <section
    v-if="ftcGuideList || guideDataDetailList"
    class="essential_info"
  >
    <strong class="essential_info_title">상품정보</strong>
    <div
      class="table"
      :class="isOpenEssentialInfoToggle"
    >
      <table>
        <caption><span class="blind">필수표기정보</span></caption>
        <colgroup>
          <col style="width: 100px">
          <col>
        </colgroup>
        <tbody>
          <tr v-for="(ftcGuide,index) in ftcGuideList "
              v-show="showAllEssentialInfo? showAllEssentialInfo : index < showItemsLength"
              :key="index"
          >
            <th v-if="!ftcGuide.goodsSafeCertYN || ftcGuide.goodsSafeCertYN !== 'Y'"
                scope="row"
            >
              {{ htmlDecode(ftcGuide.goodsSpecsItemNm) }}
            </th>
            <td v-if="ftcGuide.goodsSafeCertYN && ftcGuide.goodsSafeCertYN === 'Y'" colspan="2">
              <div class="kc_row">
                <img v-if="ftcGuide.goodsSafeCertCd === '02' || ftcGuide.goodsSafeCertCd === '03'" src="~@/assets/images/common/icons_kcBlue.png" alt="KC마크">
                <img v-else src="~@/assets/images/common/icons_kcGold.png" alt="KC마크">
                <div class="kc_txt">
                  <p class="kc_info">
                    본상품은 국가통합인증(KC마크) 대상품목으로 국가통합인증(KC마크)를 필하였습니다.
                  </p>
                  <p v-if="ftcGuide.goodsSafeCertCd === '01'" class="kc_num">
                    안전인증 번호 : {{ htmlDecode(ftcGuide.specsInputVal) }}
                  </p>
                  <p v-else-if="ftcGuide.goodsSafeCertCd === '02'" class="kc_num">
                    안전확인 신고확인증 번호 : {{ htmlDecode(ftcGuide.specsInputVal) }}
                  </p>
                </div>
              </div>
            </td>
            <td v-else>
              {{ htmlDecode(ftcGuide.specsInputVal) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button
      v-if="ftcGuideList"
      type="button"
      class="btn collapse"
      @click="openEssentialInfoToggle()"
    >
      <span>필수표기정보</span>
    </button>
    <div v-if="guideDataDetailList" class="table line">
      <table>
        <caption><span class="blind">방송상품 정보항목</span></caption>
        <colgroup>
          <col style="width: 100px">
          <col>
        </colgroup>
        <tbody>
          <tr
            v-for="(guideDataDetail,index) in guideDataDetailList "
            :key="index"
          >
            <th scope="row">
              {{ htmlDecode(guideDataDetail.goodsSpecsItemNm) }}
            </th>
            <td> {{ htmlDecode(guideDataDetail.specsInputVal) }} </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import { PRODUCT_CONST } from '@/common/constants/product/product'

export default {
  props: {
    globalVal: {
      type: Object,
      required: true
    }

  },
  data () {
    return {
      showItemsLength: 0, // 필수 정보 접혔을때 보여줄 개수
      isOpenEssentialInfoToggle: '' // 상품정보 펼침 여부
    }
  },
  computed: {
    /**
     * 상품기술서
     * 원산지, 모델번호, 상품번호 데이터 순으로 위치
     * rmtrlpoo : 원료 원산지
     *
     * @returns {Array}
     */
    ftcGuideList () {
      if (!this.globalVal.ftcGuideList?.length) {
        return null
      }

      const front = []
      const back = this.globalVal.ftcGuideList
      const isFoodProduct = this.globalVal.productInfo.catGb === PRODUCT_CONST.CAT_GB.FOOD
      const isHealthFoodProduct = this.globalVal.productInfo.catGb === PRODUCT_CONST.CAT_GB.HEALTH_FOOD

      if (isFoodProduct || isHealthFoodProduct) {
        const origin = this.globalVal.productInfo.rmtrlpoo ? this.globalVal.productInfo.rmtrlpoo : '상세페이지 참조'
        front.push({ goodsSpecsItemNm: '원산지/원재료', specsInputVal: origin })
      }

      if (this.globalVal.productInfo.modelName) {
        front.push({ goodsSpecsItemNm: '모델번호', specsInputVal: this.globalVal.productInfo.modelName })
      }

      front.push({ goodsSpecsItemNm: '상품번호', specsInputVal: !isNull(this.globalVal.productInfo.multiCd) ? this.globalVal.productInfo.multiCd : this.globalVal.productInfo.partNumber })

      this.setShowItemsLength(front.length)
      return [...front, ...back]
    },
    /**
     * 상품상세 기술서( 텍스트 )
     *
     * @returns {Array}
     */
    guideDataDetailList () {
      try {
        return this.globalVal.guideDataDetailList.length
          ? this.globalVal.guideDataDetailList
          : null
      } catch (error) {
        return null
      }
    },
    /**
     * 필수표기정보 펼침 여부
     *
     * @returns {Boolean}
     */
    showAllEssentialInfo () {
      return this.isOpenEssentialInfoToggle === 'active'
    }

  },
  methods: {
    htmlDecode,
    /**
     * 노출할 필수표기정보 개수
     *
     * @param {Number} showLength 보여줄 개수
     */
    setShowItemsLength (showLength) {
      this.showItemsLength = showLength
    },
    /**
     * 필수표기정보 더보기/접기
     *
     */
    openEssentialInfoToggle () {
      const destination = document.querySelector('.essential_info')
      const pageHeader = document.querySelector('.app_header')
      const destinationOffsetTop = isNull(destination) ? 0 : destination.offsetTop
      const headerHeight = isNull(pageHeader) ? 0 : pageHeader.clientHeight

      if (this.isOpenEssentialInfoToggle === 'active') {
        this.isOpenEssentialInfoToggle = ''
        setTimeout(() => {
          window.scrollTo({
            top: destinationOffsetTop - headerHeight,
            left: 0
          })
        }, 0)
      } else {
        this.isOpenEssentialInfoToggle = 'active'
        setTimeout(() => {
          window.scrollTo({
            top: destinationOffsetTop - headerHeight,
            left: 0
          })
        }, 0)
      }
    }

  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/product/EssentialInfo";
</style>
