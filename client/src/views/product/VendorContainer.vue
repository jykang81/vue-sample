<template>
  <section
    v-if="guideDataList"
    class="vendor_container"
    :class="isExpanded"
  >
    <div class="product_img">
      <pinch-zoom :properties="pinchZoomOptions">
        <div
          v-for="guideData in guideDataList"
          :key="guideData"
          @click="linkview"
          v-html="guideData"
        />
      </pinch-zoom>
    </div>
    <button
      v-if="guideDataList && showMoreButton"
      type="button"
      class="btn collapse"
      @click="showMore"
    >
      <span>상세정보</span>
    </button>
  </section>
</template>

<script>
import Vue from 'vue'
import PinchZoom from 'vue-pinch-zoom'
import {
  htmlDecode,
  isNull,
  isOsApp
} from '@utils/commonutil/commonUtil'

Vue.component('pinch-zoom', PinchZoom)

export default {
  props: {
    globalVal: {
      type: Object,
      required: true
    }

  },
  data () {
    return {
      showMoreButton: false,
      isExpanded: { // 상세정보 펼침 여부
        active: false,
        default: false
      },
      pinchZoomOptions: {
        doubleTap: false, // 더블 탭 기능 끄기
        listeners: 'auto', // 데스크탑 zoom 기능 방지
        minScale: 1 // 최소화 크기 제한
      }
    }
  },
  computed: {
    /**
     * 상세정보
     *
     * @returns {Array|null}
     */
    guideDataList () {
      const returnData = []
      for (const item of this.globalVal.guideDataList) {
        if (item.specsInputVal) {
          if (item.specsInputVal.toUpperCase().includes('IMG')) {
            returnData.push(htmlDecode(item.specsInputVal))
          }
        }
      }
      return returnData?.length ? returnData : null
    }
  },
  mounted () {
    setTimeout(() => {
      if (document.querySelector('.product_img')?.clientHeight >= 1000) {
        this.showMoreButton = true
        this.isExpanded.default = true
      }
    }, 300)
  },
  methods: {
    /**
     * 더보기
     *
     */
    async showMore () {
      const beforeOffsetY = window.pageYOffset

      // 상품 기술서 토글
      this.isExpanded.active = !this.isExpanded.active

      // 상품 기술서 UI 갱신이 완료되기를 기다림
      await this.$nextTick()

      if (this.isExpanded.active) {
        window.scrollTo(0, beforeOffsetY)
      } else {
        const imgContainer = document.querySelector('.vendor_container')
        const imgContainerOffsetTop = isNull(imgContainer) ? 0 : imgContainer.offsetTop
        const imgHeight = document.querySelector('.product_img')?.clientHeight || 0
        const afterOffsetY = imgContainerOffsetTop + imgHeight - (document.querySelector('.app_header')?.clientHeight || 0) - 120 // bottom 120
        window.scrollTo(0, afterOffsetY)
      }
    },
    /**
     * App 내 새창 열기
     *
     * @param {Object} e 클릭 이벤트
     */
    linkview (e) {
      // 앱 내에서 앵커 클릭 시
      if (e.target.href && isOsApp()) {
        // TODO : App 새창 열기, 구현 후 href 이동 막기 사용 필요
        // Ns.Native.linkView(2, addr)

        // href 이동막기
        // e.preventDefault()
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/product/VendorContainer";
</style>
