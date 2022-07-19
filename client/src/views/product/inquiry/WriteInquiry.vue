<template>
  <div class="write_inquiry">
    <div v-if="isProductDataReadied"
         class="product_item"
    >
      <router-link to="" @click.native.prevent.capture="">
        <figure>
          <ns-img
            :product-number="globalVal.partNumber"
            :width="144"
            :height="144"
            :alt="htmlDecode(globalVal.productInfo.productName)"
            :is-adult="globalVal.productInfo.adultItemFlag"
          />
        </figure>
        <p class="title">
          {{ htmlDecode(globalVal.productInfo.productName) }}
        </p>
      </router-link>
    </div>
    <div class="board_box">
      <div class="textarea placeholder_multiline">
        <label
          for="textarea"
          class="blind"
        >
          내용
        </label>
        <textarea
          :value="inqueryText"
          maxlength="200"
          @input="typing"
        />
        <div v-if="!inqueryText" class="placeholder">
          개인정보 보호를 위해 고객님의 주민번호, 전화번호 등 개인정보는 절대 입력하지 않도록 주의하시기 바랍니다. 상품문의 취지에 어긋나는 글은 삭제될 수 있는 점 양해해 주시기 바랍니다.
        </div>
        <p class="fix_num">
          <span class="txt">{{ inqueryTextLength }}</span>/200
        </p>
      </div>
      <div class="checkbox_wrap">
        <label>
          <input
            v-model="isSmsAgreeChecked"
            type="checkbox"
            class="checkbox square"
          >
          <span class="check_label">SMS 답변알림 받기</span>
        </label>
        <label>
          <input
            v-model="isPrivateChecked"
            type="checkbox"
            class="checkbox square"
          >
          <span class="check_label">비공개</span>
        </label>
      </div>
      <button
        type="button"
        class="btn_inquiry"
        :class="activateButton ? '' : 'in_active'"
        :disabled="!activateButton"
        @click="registerInquiry"
      >
        <span>문의하기</span>
      </button>
    </div>
    <div class="customer_box">
      <p class="copy">
        배송/반품/환불 문의는 고객센터 > 1:1 문의하기를 이용해 주세요.
      </p>
      <router-link
        to=""
        class="btn_counsel"
        @click.native="gotoOneToOneInquiry"
      >
        <span>고객센터 1:1문의하기</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import popupUtil from '@frameworks/popupUtil'
import loginUtil from '@utils/loginUtil'
import $store from '@/vuex'
import { mapState } from 'vuex'
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'
import NsImg from '@components/common/NsImg'
import COMM_CONST from '@/common/constants/framework/constants'
import { PRODUCT_CONST } from '@/common/constants/product/product'
import writeInquiryService from '@services/product/writeInquiryService'
import productDetailService from '@services/product/productDetailService'

export default {
  name: 'WriteInquiry',
  components: {
    NsImg
  },
  data () {
    return {
      isProductDataReadied: false,
      isSmsAgreeChecked: false, // SMS 답변 수신동의 동의 여부
      isPrivateChecked: false, // 비공개 여부
      inqueryText: '', // 길이 체크용
      globalVal: {}
    }
  },
  computed: {
    ...mapState('login', ['loginParam']),
    /**
     * 상품상세정보조회 API 호출을 위한 파라미터
     * @returns {Object}
     */
    productDetailParams () {
      return {
        partNumber: this.globalVal.partNumber,
        cocd: COMM_CONST.getCocd(), // 외부유입경로 코드(제휴사코드)
        imgSizeType: PRODUCT_CONST.PRODUCT_DETAIL_IMAGE_SIZE
      }
    },
    /**
     * 텍스트 길이
     * @returns {Number}
     */
    inqueryTextLength () {
      return this.inqueryText.length
    },
    /**
     * 버튼 활성화 여부
     * @returns {Boolean}
     */
    activateButton () {
      return !!this.inqueryText
    }
  },
  created () {
    this.init()
  },
  methods: {
    htmlDecode,
    /**
     * 초기화
     *
     */
    async init () {
      if (this.$route.params?.globalVal?.productInfo) {
        this.globalVal = this.$route.params.globalVal
      } else {
        this.globalVal.partNumber = this.$route.params.partNumber
        const productDetailData = await productDetailService.getProductDetail(this.productDetailParams)
        const { info } = productDetailData.msg.goods[0]
        this.$set(this.globalVal, 'productInfo', info)
      }
      this.isProductDataReadied = true
    },
    /*
     * 1대1 문의하기 작성 페이지로 이동
     */
    gotoOneToOneInquiry () {
      const globalVal = this.globalVal
      $store.commit('login/setLoginParam', { globalVal })
      this.$router.push('/custcenter/board-inquiry/inquire')
    },
    /**
     * 길이 체크 위한 메서드
     *
     * @param {object} e event object
     */
    typing (e) {
      this.inqueryText = e.target.value
    },
    /**
     * 상품문의 등록
     * 제목은 내용 중 50byte 잘라서 처리
     * usersOptDispYN : 고객연령대 노출여부
     *
     */
    registerInquiry () {
      const successHandling = () => {
        popupUtil.close()
      }

      const registParams = {
        cmdType: '102',
        questionType: '99',
        usersOptDispYN: 'N',
        partNumber: this.globalVal.partNumber,
        usersId: loginUtil.userId(),
        recvPhone: loginUtil.telNo(),
        smsRcvYn: this.isSmsAgreeChecked ? 'Y' : 'N',
        isPrivate: this.isPrivateChecked ? '1' : '0',
        subject: this.inqueryText.substring(0, 50),
        ctnt: this.inqueryText
      }

      writeInquiryService.registerInquiry(registParams, successHandling)
    }
  }

}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/product/inquiry/WriteInquiry";
</style>
