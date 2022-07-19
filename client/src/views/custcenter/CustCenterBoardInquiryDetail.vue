<template>
  <div class="cust_center_board_inquiry_detail">
    <div
      v-if="goodsId"
      class="counsel_wrap"
    >
      <div class="item">
        <div class="product_info">
          <figure>
            <router-link
              :to="'/product/' + goodsId"
            >
              <ns-img
                :product-number="goodsId"
                :width="144"
                :height="144"
                :alt="goodName"
              />
            </router-link>
          </figure>
          <div class="subject">
            <div class="category">
              <strong class="sort">
                {{ typeText }}
              </strong>
              <span
                v-if="category !== ''"
                class="sort_detail"
              >
                {{ category }}
              </span>
              <span class="date">{{ uploadDate }}</span>
            </div>
            <router-link
              :to="'/product/' + goodsId"
              class="title"
            >
              {{ goodName }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="user_write">
      <p
        v-if="inquiryTitle !== ''"
        class="title"
      >
        {{ inquiryTitle }}
      </p>
      <div class="write">
        <p
          v-html="inquiryQuestion"
        />
        <ns-img
          v-if="fileUrl !== ''"
          :src="fileUrl"
          :alt="inquiryTitle"
          @click="openImageSlider"
        />
      </div>
    </div>

    <div class="ns_answer">
      <span
        class="state"
        :class="statusClassNm"
      >
        {{ statusNm }}
      </span>
      <p
        v-html="inquiryAnswer"
      />
    </div>
    <button
      v-if="pageType === 'product' || (pageType === 'board' && statusClassNm === 'standby')"
      type="button"
      class="btn_delete"
      @click="deleteInquiryConfirm"
    >
      <span>삭제</span>
    </button>
  </div>
</template>

<script>
import popupUtil from '@frameworks/popupUtil'
import loginUtil from '@utils/loginUtil'
import messageUtil from '@/common/frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'
import NsImg from '@components/common/NsImg'
import custCenterBoardInquiryDetailService from '@services/custcenter/custCenterBoardInquiryDetailService'

export default {
  components: {
    NsImg
  },
  data () {
    return {
      qnaId: '',
      pageType: '',
      photoList: [],
      goodsId: '',
      goodName: '',
      typeText: '',
      category: '',
      uploadDate: '',
      inquiryTitle: '',
      inquiryQuestion: '',
      fileUrl: '',
      statusClassNm: '',
      statusNm: '',
      inquiryAnswer: ''
    }
  },
  async created () {
    this.qnaId = this.$route.params.id
    this.pageType = this.$route.params.type

    if (this.pageType === 'product') {
      this.typeText = '상품문의'
      await this.getProductQnaDetail()
    } else if (this.pageType === 'board') {
      this.typeText = '1:1문의'
      await this.getBoardQnaDetail()
    }
  },
  methods: {
    /**
     * 상품문의 상세 가져오기
     */
    async getProductQnaDetail () {
      const param = {
        qnaId: this.qnaId
      }

      try {
        const data = await custCenterBoardInquiryDetailService.fetchProductQnaDetail(param)

        // 에러 검증
        const hasErrorOccured = data.msg?.isSuccess === 0
        if (hasErrorOccured) {
          messageUtil.error('시스템 오류가 발생했습니다.<br /> 확인을 누르면 이전 화면으로 이동합니다.', () => {
            this.$router.back()
          })

          return
        }

        // 빈 페이지 노출 방지
        if (data.msg.qna_id === 0) {
          this.$router.back()

          return
        }

        const msg = data.msg

        this.goodsId = msg.catentry_id.toString()
        this.goodName = this.getProductName(msg.brand_kor_nm, msg.catentry_nm)
        this.uploadDate = this.getDateString(msg.questiondate)
        this.inquiryQuestion = this.tagDecode(msg.question_content)
        this.statusNm = msg.status_nm
        this.statusClassNm = this.getStatusClassOnPrdInquiry(msg.status_nm)
        this.inquiryAnswer = this.tagDecode((msg.status_nm === '답변완료') ? msg.answer : '아직 답변이 없습니다.')
      } catch {
        this.$router.back()
      }
    },

    /**
     * 1:1 문의 상세 가져오기
     */
    async getBoardQnaDetail () {
      const param = {
        userId: loginUtil.userId(),
        seq: this.qnaId
      }

      try {
        const data = await custCenterBoardInquiryDetailService.fetchBoardQnaDetail(param)

        // 에러 검증
        const hasErrorOccured = data.msg?.isSuccess === 0
        if (hasErrorOccured) {
          messageUtil.error('시스템 오류가 발생했습니다.<br /> 확인을 누르면 이전 화면으로 이동합니다.', () => {
            this.$router.back()
          })

          return
        }

        // 빈 페이지 노출 방지
        if (data.msg.root.length === 0) {
          this.$router.back()

          return
        }

        const productInfo = data.msg.root[0].ProductInfo
        const answerInfo = data.msg.root[0].AnswerInfo

        this.goodsId = productInfo.goodsId
        this.goodName = this.getProductName(productInfo.brandName, productInfo.goodsName)
        this.category = answerInfo.category
        this.uploadDate = answerInfo.date
        this.inquiryTitle = this.tagDecode(answerInfo.title)
        this.inquiryQuestion = this.tagDecode(answerInfo.question)
        this.fileUrl = answerInfo.fileUrl
        this.photoList = [{ photoPath: answerInfo.fileUrl }]
        this.statusClassNm = this.getStatusOnBoardInquiry(answerInfo.flag).statusClassNm
        this.statusNm = this.getStatusOnBoardInquiry(answerInfo.flag).statusNm
        this.inquiryAnswer = this.tagDecode((answerInfo.flag === '300') ? answerInfo.answer : '아직 답변이 없습니다.')
      } catch {
        this.$router.back()
      }
    },

    /**
     * NSSR-31212 [ISMS]보안취약점 개선조치 요청의 건
     * 특수문자 코드 치환
     * ulTitle : <iframe> 등 태그는 미적용(텍스트로 노출), <br/> 태그는 적용
     * ulCtnt : <iframe> 등 태그는 미적용(텍스트로 노출), <br/> 태그는 적용
     * answer : 그대로 노출(기존 동일)
     * @param {string} str 변환할 문자열
     * @returns {string} 변환된 문자열
     */
    tagDecode (str) {
      return String(str).replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&#39;/g, '\'').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    },
    /**
     * 상품이름 생성
     * @param {string} brandName 브랜드 이름
     * @param {string} goodsName 상품 이름
     * @returns {string} [brandName]goodsName 형태의 상품 이름
     */
    getProductName (brandName, goodsName) {
      return (brandName && brandName !== '미정의' ? `[${brandName}]` : '') + goodsName
    },

    /**
     * 등록일자 생성
     * @param {string} questiondate 날짜 스트링
     * @returns {string} 2000.11.22 형태 날짜
     */
    getDateString (questiondate) {
      return `${questiondate.substr(0, 4)}.${questiondate.substr(4, 2)}.${questiondate.substr(6, 2)}`
    },

    /**
     * 상품문의 진행 상태 생성
     * @param {string} status 문의 상태 문자열
     * @returns {string} UI 표현에 필요한 클래스 이름
     */
    getStatusClassOnPrdInquiry (status) {
      let className = ''

      if (status === '답변대기') {
        className = 'standby'
      } else if (status === '처리중') {
        className = 'current'
      } else {
        className = 'complete'
      }

      return className
    },

    /**
     * 1:1 문의 진행 상태 생성
     * @param {string} flag 문의 상태 플래그 값
     * @return {object} UI 렌더링에 사용할 텍스트 및 클래스 명
     */
    getStatusOnBoardInquiry (flag) {
      let statusNm
      let statusClassNm

      if (flag === '100') {
        statusNm = '답변대기'
        statusClassNm = 'standby'
      } else if (flag === '200') {
        statusNm = '처리중'
        statusClassNm = 'current'
      } else {
        statusNm = '답변완료'
        statusClassNm = 'complete'
      }

      return {
        statusNm,
        statusClassNm
      }
    },

    /**
     * 문의 삭제 컨펌
     */
    deleteInquiryConfirm () {
      // 버튼 위치 반전을 위해 okay / cancel 위치를 바꾸어서 사용함
      messageUtil.confirm('삭제된 내용은 복구되지 않습니다.\n정말 삭제하시겠습니까?', null, this.deleteInquiry, '취소', '확인')
    },

    /**
     * 문의 삭제
     */
    deleteInquiry () {
      let param
      let apiName

      if (this.pageType === 'product') {
        param = {
          qna_id: this.qnaId
        }
        apiName = 'ItemQnaDeleteReal'
      } else if (this.pageType === 'board') {
        param = {
          userId: loginUtil.userId(),
          inquiry_id: this.qnaId
        }
        apiName = 'QnaDeleteReal'
      }

      const successHandling = data => {
        if (data.msg.isSuccess === 'S') {
          routerUtil.back()
        } else {
          messageUtil.confirm('문의내역을 삭제할 수 없습니다.')
        }
      }

      this.$nsaxios.post(apiName, param, successHandling)
    },

    /**
     * 이미지 확대보기 열기
     *
     */
    openImageSlider () {
      const param = {
        title: '상세이미지',
        titleAlign: 'center',
        isShowSearch: false,
        isShowCart: false,
        photoList: this.photoList,
        productName: this.inquiryTitle
      }
      popupUtil.show('product/ImageSliderLayer', param, null)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/custcenter/CustCenterBoardInquiryDetail";
</style>
