<template>
  <img
    :src="imageSrc"
    :alt="imageAlt"
    @error="getNoImageUrl"
    @click="$emit('click')"
  >
</template>

<script>
import CONST from '@constants/framework/framework'
import { getImageUrl, htmlDecode } from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import ADULT_WIDE from '@/assets/images/common/img_adult_wide.png'
import ADULT_SQUARE from '@/assets/images/common/img_adult_square.png'
import NO_IMAGE_SQUARE from '@/assets/images/common/img_noImage_square.png'
import NO_IMAGE_WIDE from '@/assets/images/common/img_noImage_wide.png'

export default {
  name: 'NsImg',
  props: {
    alt: { // 대체 텍스트
      type: String,
      required: false,
      default: () => ''
    },
    width: { // 이미지 넓이 (type === 'WIDE' 일때는 입력하지 않음)
      type: Number,
      required: false,
      default: () => 0
    },
    height: { // 이미지 높이 (type === 'WIDE' 일때는 입력하지 않음)
      type: Number,
      required: false,
      default: () => 0
    },
    src: { // 이미지 URL (1순위 : 상품번호가 있어도 이미지 URL이 우선)
      type: String,
      required: false,
      default: () => ''
    },
    productNumber: { // 상품번호 (2순위 : 이미지 URL가 없을 때 대체 이미지 생성용으로 사용)
      type: String,
      required: false,
      default: () => ''
    },
    isAdult: { // 성인상품 여부
      type: String,
      required: false,
      default: () => 'N'
    },
    type: { // 이미지 타입 : WIDE | SQUARE
      type: String,
      required: false,
      default: () => 'SQUARE'
    },
    replace: { // 와이드형 대체 이미지 리사이즈 타입 (type === 'SQUARE' 일때는 입력하지 않음) : SQUARE | CROP (SQUARE: 와이드 이미지 없을 때 정방형 상품 이미지 생성, CROP: 와이드 이미지 없을 때 크롭된 와이드 이미지 생성)
      type: String,
      required: false,
      default: () => ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
    /**
     * 이미지 URL
     *
     * @returns {string} 이미지 URL
     */
    imageSrc () {
      // 성인상품 체크
      if (this.isAdult === 'Y' && loginUtil.adultAuthYN() !== 'Y') {
        return this.type === 'WIDE' ? ADULT_WIDE : ADULT_SQUARE
      }

      if (this.src) {
        const replacedSrc = this.src.replace('http://', 'https://')
        if (this.type === 'WIDE') {
          // 이미지 타입이 WIDE일 때 src가 제작 이미지(도메인이 image.nsmall.com)면 그대로 보여주고, 아니면 X6 이미지를 보여줌
          return replacedSrc.includes('image.nsmall.com') ? replacedSrc : this.wideImageUrl
        } else {
          return replacedSrc
        }
      } else {
        if (this.productNumber) {
          // 이미지 타입이 WIDE이면 X6이미지를, SQUARE면 정사각 이미지를 생성해서 보여줌
          return this.type === 'WIDE' ? this.wideImageUrl : getImageUrl(this.productNumber, this.width, this.height, this.isAdult)
        } else {
          return this.type === 'WIDE' ? NO_IMAGE_WIDE : NO_IMAGE_SQUARE
        }
      }
    },
    /**
     * 디코딩된 대체 텍스트
     *
     * @returns {string} 디코딩된 대체 텍스트
     */
    imageAlt () {
      return htmlDecode(this.alt)
    },
    /**
     * WIDE 이미지
     *
     */
    wideImageUrl () {
      const len = this.productNumber.length
      const depth1 = this.productNumber.substring(len - 1, len)
      const depth2 = this.productNumber.substring(0, 2)
      const depth3 = this.productNumber.substring(len - 3, len)
      return [CONST.NS_IMAGE_PRODUCT, depth1, depth2, depth3, `${this.productNumber}_X6.jpg`].join('/')
    }
  },
  methods: {
    /**
     * 에러 이미지
     *
     */
    getNoImageUrl (e) {
      if (this.type === 'WIDE') {
        const errCnt = e.target.getAttribute('errCnt') || 0 // @error 로 이미지 대체된 횟수
        if (this.replace === 'SQUARE') {
          if (errCnt === 0) { // 500x500 정방형으로 대체
            e.target.src = getImageUrl(this.productNumber, 500, 500, this.isAdult)
            e.target.setAttribute('errCnt', 1)
          } else {
            e.target.src = NO_IMAGE_WIDE
            e.target.setAttribute('errCnt', 2)
          }
        } else if (this.replace === 'CROP') {
          if (errCnt === 0) { // 600x300 와이드형으로 대체
            e.target.src = getImageUrl(this.productNumber, 600, 300, this.isAdult, 'crop')
            e.target.setAttribute('errCnt', 1)
          } else {
            e.target.src = NO_IMAGE_WIDE
          }
        } else {
          e.target.src = NO_IMAGE_WIDE
        }
      } else {
        e.target.src = NO_IMAGE_SQUARE
      }
    }
  }
}
</script>
