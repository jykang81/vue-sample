<template>
  <div class="write_my_review">
    <section>
      <div class="product_info">
        <div class="box">
          <figure>
            <ns-img
              :product-number="productId"
              :width="144"
              :height="144"
              :alt="goodsName"
            />
          </figure>
          <div class="field">
            <p class="title">
              {{ goodsName }}
            </p>
            <p
              v-if="option"
              class="option"
            >
              {{ option }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section>
      <strong class="subject">
        이 상품을 평가해주세요
      </strong>
      <ul class="write_step">
        <li
          v-for="(cate, cateIdx) in category"
          :key="cateIdx"
        >
          <strong class="title">{{ cate.question }}</strong>
          <ul>
            <li
              v-for="(answer, answerIdx) in cate.answerList"
              :key="answerIdx"
            >
              <input
                v-if="cateIdx < 4"
                :id="'radio_write' + (cateIdx + 1) + '_' + (answerIdx + 1)"
                v-model="catePicked['item' + (cateIdx + 1)]"
                :value="((answerIdx + 1) * 2) - 1"
                type="radio"
                :name="'sort' + (cateIdx + 1)"
              >
              <input
                v-if="cateIdx >= 4"
                :id="'radio_write' + (cateIdx + 1) + '_' + (answerIdx + 1)"
                v-model="catePicked['item' + (cateIdx + 1)]"
                :value="30 - (answerIdx * 10)"
                type="radio"
                :name="'sort' + (cateIdx + 1)"
              >
              <label
                :for="'radio_write' + (cateIdx + 1) + '_' + (answerIdx + 1)"
              >
                {{ answer }}
              </label>
            </li>
          </ul>
        </li>
      </ul>
    </section>
    <section
      v-if="!isTextareaHide"
    >
      <strong class="subject">
        이 상품의 상품평을 작성해주세요.
      </strong>
      <div class="board_wrap">
        <div class="textarea placeholder_multiline">
          <label
            for="textarea"
            class="blind"
          >
            내용
          </label>
          <!-- placeholder 줄바꿈 trick -->
          <textarea
            id="textarea"
            v-model="reviewTextarea"
            @keyup="checkReviewLength"
          />
          <div v-if="!reviewTextarea" class="placeholder">
            작성하신 상품평은 다른 고객님에게 큰 도움이 됩니다. (최소 10자 ~ 최대 400자)
          </div>
          <p class="fix_num">
            <span class="txt">{{ reviewTextarea.length }}</span>/400
          </p>
        </div>
        <button
          v-if="isShowAddImage"
          v-show="pageType === 'write' && storedFiles.length < 5"
          type="button"
          class="btn_add"
          @click="openFileInput"
        >
          <i class="icons_photo" />
          <span>사진 첨부하기 (선택)</span>
        </button>
        <div
          v-if="isShowAddImage"
          v-show="pageType === 'write' && storedFiles.length > 0"
          class="img_upload"
        >
          <span class="file_upload">
            <label
              for="file"
              class="blind"
            >
              파일첨부
            </label>
            <input
              id="file"
              type="file"
              name="file"
              @change="onFileSelect"
            >
            <button
              v-show="storedFiles.length < 5"
              type="button"
              class="btn_upload"
              @click="openFileInput"
            >
              <span>파일첨부</span>
            </button>
          </span>
          <div class="img_slide">
            <ul>
              <template
                v-for="val in [1, 2, 3, 4, 5]"
              >
                <li
                  v-if="storedFiles[val - 1]"
                  :key="val"
                >
                  <figure>
                    <ns-img
                      :src="storedFiles[val - 1].src"
                      :alt="'첨부 이미지' + (val - 1)"
                    />
                  </figure>
                  <button
                    type="button"
                    class="btn_delete"
                    @click="removeImage(val - 1)"
                  >
                    <span>삭제</span>
                  </button>
                </li>
                <li
                  v-if="!storedFiles[val - 1]"
                  :key="val"
                >
                  <span class="nodata">
                    <i class="icons_photo" />
                  </span>
                </li>
              </template>
            </ul>
          </div>
          <span class="fix_num"><strong class="txt">{{ storedFiles.length }}</strong> / 5</span>
        </div>

        <div
          v-if="!!writedPlist && writedPlist.length > 0"
          class="img_upload"
        >
          <div class="img_slide">
            <ul>
              <template
                v-for="val in [1, 2, 3, 4, 5]"
              >
                <li
                  v-if="writedPlist[val - 1]"
                  :key="val"
                >
                  <figure>
                    <ns-img
                      :src="CONST.NS_IMAGE_CUST_SRV + '/' + writedPlist[val - 1].filePath"
                      :alt="'첨부 이미지' + (val - 1)"
                    />
                  </figure>
                  <button
                    type="button"
                    class="btn_delete"
                    @click="removePlistImage(writedPlist[val - 1])"
                  >
                    <span>삭제</span>
                  </button>
                </li>
                <li
                  v-if="!writedPlist[val - 1]"
                  :key="val"
                >
                  <span class="nodata">
                    <i class="icons_photo" />
                  </span>
                </li>
              </template>
            </ul>
          </div>
          <span class="fix_num"><strong class="txt">{{ writedPlist.length }}</strong> / 5</span>
        </div>
      </div>
    </section>
    <div class="btn_group">
      <a
        class="btn_cancel"
        @click="cancelWrite"
      >
        <span>취소</span>
      </a>
      <!-- 버튼 활성화 일 때, in_active 제거 -->
      <a
        class="btn_register"
        :class="{ in_active : !isReady }"
        @click="regReview"
      >
        <span>등록하기</span>
      </a>
    </div>
    <div class="collapse_wrap">
      <dl>
        <dt :class="toggleClass ? 'active' : ''">
          <span class="title">이용안내</span>
          <button
            type="button"
            class="btn collapse"
            @click="onCollapse()"
          >
            펼치기/접기
          </button>
        </dt>
        <dd>
          <ul class="txt_list">
            <li>- 일반/건강식품, 의료기기 상품은 관련 법규에 의거하여 개인의 주관적인 의견을 작성할 수 있는 상품평을 게시하지 않고 있습니다.</li>
            <li>- NSmall은 게시자가 게시물을 작성 및 게시할 수 있도록 공간만을 제공할 뿐이며 게시자가 관련 법을 위반하여 게시물을 게재하여 발생하는 분쟁에 대한 민사/형사/행정상 법적 책임은 게시자에 있고 NSmall은 어떠한 책임도 부담하지 않습니다.</li>
            <li>- 상품평에 어긋나는 내용이나 욕설, 광고 글 등록 시 사전협의 없이 삭제할 수 있습니다.</li>
            <li>- 상품에 대한 문의는 고객센터를 이용해 주시기 바랍니다.</li>
            <li>- 이미지는 최대 5개까지 등록 가능하며, 이미지 개수에 상관없이 한번만 톨이 지급됩니다.</li>
            <li>- 각 항목별 평가를 종합하여 총 별점으로 환산됩니다.</li>
          </ul>
        </dd>
      </dl>
    </div>

    <div style="display:none;">
      <form id="sendFileForm" name="sendFileForm" method="post" enctype="multipart/form-data">
        <input type="hidden" name="viewName" value="NReview">
        <input id="cmdType" type="hidden" name="cmdType" value="114">
        <input id="reviewSeq" type="hidden" name="reviewSeq">
        <input id="reviewCnt" type="hidden" name="reviewCnt" value="0">
        <input id="fileForm" type="hidden" name="fileForm">
        <input id="frmFlag" type="hidden" name="frmFlag" value="Y">
      </form>
    </div>
  </div>
</template>

<script>
import {
  isOsApp
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import toastUtil from '@frameworks/toastUtil'
import loginUtil from '@utils/loginUtil'
import productMyReviewMixin from '@/mixins/product/review/productMyReviewMixin'
import CONST from '@constants/framework/framework'
import NsImg from '@components/common/NsImg'
import writeMyReviewService from '@services/product/review/writeMyReviewService'

export default {
  name: 'WriteMyReview',
  components: {
    NsImg
  },
  mixins: [
    productMyReviewMixin
  ],
  data () {
    return {
      pageType: '',
      toggleClass: false,
      productId: '',
      catGb: '',
      goodsName: '',
      quantity: '',
      option: '',
      danCatentryId: '',
      ordersId: '',
      goodgrdSeq: '',
      photoYN: '',
      category: [],
      catePicked: {
        item1: 0, // 5 : 좋다, 3 : 보통, 1 : 나쁘다
        item2: 0, // 5 : 좋다, 3 : 보통, 1 : 나쁘다
        item3: 0, // 5 : 좋다, 3 : 보통, 1 : 나쁘다
        item4: 0, // 5 : 좋다, 3 : 보통, 1 : 나쁘다
        item5: 0, // 10 : 딱 맞다, 20 : 정 사이즈보다 크다, 30 : 정 사이즈보다 작다
        item6: 0 // 10 : 화면과 같다, 20 : 화면보다 밝다, 30 : 화면보다 어둡다
      },
      beforeModify: {
        item1: 5,
        item2: 5,
        item3: 5,
        item4: 5,
        item5: 10,
        item6: 10
      },
      isTextareaHide: true,
      reviewTextarea: '',
      storedFiles: [],
      uploadedIdx: 0,
      isShowAddImage: false, // 이미지 등록 노출 여부. 현재는 무조건 false 나중에 앱 기능 개발 시 분기 추가 필요
      writedPlist: [],
      removePlistSeq: []
    }
  },
  computed: {
    /**
     * 등록하기 버튼 활성화
     * @returns {boolean}
     */
    isReady () {
      let isReady = true

      // 라디오 버튼 값이 모두 있는지
      for (let i = 0; i < this.category.length; i++) {
        if (!this.catePicked[`item${i + 1}`]) {
          isReady = false
        }
      }

      // textarea에 입력된 값이 있는지
      if (!this.isTextareaHide) {
        if (this.reviewTextarea.trim().length < 10) {
          isReady = false
        }
      }

      return isReady
    },
    CONST () {
      return CONST
    }
  },
  created () {
    // 라우터에 따른 페이지 타입 설정
    if (this.$route.name === 'writeMyReview') {
      this.pageType = 'write'
    } else if (this.$route.name === 'modifyMyReview') {
      this.pageType = 'modify'
    }

    // 라우터에서 받은 정보를 기반으로 페이지에 필요한 값 설정
    this.productId = this.$route.params.id
    this.catGb = this.$route.query.catGb
    this.goodsName = this.$route.query.goodsName
    this.option = this.$route.query.option
    this.danCatentryId = this.$route.query.dan_catentry_id
    this.ordersId = this.$route.query.orders_id
    this.goodgrdSeq = this.$route.query.goodgrdSeq
    this.photoYN = this.$route.query.photoYN

    // 상품 유형에 따른 카테고리 설정
    this.category = this.getCategoriesInfo(this.catGb)

    // 답변 리스트 순서 정렬 (UI를 표현하기 위한 순서)
    this.sortAnswerList()

    // 상품 유형에 따른 상품평 텍스트 입력 가능 여부 설정
    if (this.catGb === '10' || this.catGb === '20' || this.catGb === '40') {
      this.isTextareaHide = true
    } else {
      this.isTextareaHide = false
    }

    // 페이지 타입이 수정일 경우 기존 입력된 정보 요청
    if (this.pageType === 'modify') {
      this.getWirtedReview()
    }

    // 앱인 경우 사진 등록 여부 true 설정
    if (isOsApp()) { // APP
      this.isShowAddImage = true
    }
  },
  methods: {
    /**
     * 이용안내 펼치기/접기
     */
    onCollapse () {
      const collapseWrap = document.querySelector('.collapse_wrap dd')
      const height = collapseWrap.scrollHeight
      if (!this.toggleClass) {
        collapseWrap.style.height = `${height}px`
      } else {
        collapseWrap.style.height = 0
      }
      this.toggleClass = !this.toggleClass
    },

    /**
     * 취소
     */
    cancelWrite () {
      const okCallback = () => {
        this.$router.go(-1)
      }

      // 버튼 순서 변경에 따른 okay <-> cancel 스왑
      messageUtil.confirm('입력하신 상품평은 저장되지 않습니다.<br/>정말 취소하시겠습니까?', null, okCallback, '취소', '확인')
    },

    /**
     * 등록하기 클릭 시 타입에 따라 분기
     * @returns {void|Boolean}
     */
    regReview () {
      const comment = this.reviewTextarea?.trim()

      if (!this.isReady) {
        return false
      }

      if (!this.isTextareaHide && comment === '') {
        messageUtil.alert('상품평을 작성해 주세요.')
        return false
      }

      if (!this.isTextareaHide && comment.length < 10) {
        messageUtil.alert('상품평은 최소 10자 이상 작성해 주세요.')
        return false
      }

      if (!this.isTextareaHide && comment.length > 400) {
        this.checkReviewLength()
        return false
      }

      if (this.pageType === 'write') {
        this.writeReview()
      } else if (this.pageType === 'modify') {
        this.modifyReview()
      }
    },

    /**
     * 상품평 작성하기
     */
    writeReview () {
      const comment = this.reviewTextarea?.trim()

      const param = {
        cmdType: 105,
        postField1: this.productId,
        postField2: loginUtil.userId(),
        postField4: this.catGb,
        goodEvalScore1: this.catePicked.item1,
        goodEvalScore2: this.catePicked.item2,
        goodEvalScore3: this.catePicked.item3,
        goodEvalScore4: this.catePicked.item4,
        postField11: comment?.substring(0, 50), // 상품평 제목
        postField12: comment, // 상품평
        postField14: 'N', // 구매 옵션 노출여부
        postField15: 'N', // 나이, 성별 노출 여부
        postField3: this.ordersId, // ordersId
        postField17: (this.storedFiles.length === 0) ? 'N' : 'Y', // 파일첨부 여부
        postField18: this.danCatentryId // dan_catId
      }

      if (this.catGb === '30') {
        param.postField9 = this.catePicked.item5
        param.postField10 = this.catePicked.item6
      }

      const successHandling = data => {
        const processResult = data.processResult

        if (processResult !== undefined && processResult != null && processResult > 0) {
          this.$el.querySelector('#reviewSeq').value = processResult

          if (this.storedFiles.length > 0) {
            // 등록할 이미지가 있으면
            this.execUploadFiles()
          } else {
            // 상품평 등록 완료 시
            toastUtil.show('상품평을 등록하였습니다.')
            this.$router.go(-1)
          }
        } else {
          toastUtil.show('상품평을 등록하지 못했습니다.')
        }
      }

      writeMyReviewService.writeReview(param, successHandling)
    },

    /**
     * 상품평 수정하기
     * @returns {void}
     */
    modifyReview () {
      const comment = this.reviewTextarea?.trim()

      const param = {
        cmdType: 110,
        postField19: this.goodgrdSeq,
        postField1: this.productId,
        postField2: loginUtil.userId(),
        postField4: this.catGb,
        goodEvalScore1: this.catePicked.item1,
        goodEvalScore2: this.catePicked.item2,
        goodEvalScore3: this.catePicked.item3,
        goodEvalScore4: this.catePicked.item4,
        orgEvalScore1: this.beforeModify.item1,
        orgEvalScore2: this.beforeModify.item2,
        orgEvalScore3: this.beforeModify.item3,
        orgEvalScore4: this.beforeModify.item4,
        postField11: comment?.substring(0, 50), // 상품평 제목
        postField12: comment, // 상품평
        postField14: 'N', // 구매 옵션 노출여부
        postField15: 'N', // 나이, 성별 노출 여부
        postField3: this.ordersId, // ordersId
        postField17: this.photoYN, // 파일첨부 여부
        postField18: this.danCatentryId // dan_catId
      }

      if (this.catGb === '30') {
        param.postField9 = this.catePicked.item5
        param.postField10 = this.catePicked.item6

        param.orgServiceInfo1 = this.beforeModify.item5
        param.orgServiceInfo2 = this.beforeModify.item6
      }

      // 삭제할 이미지가 있을 경우
      if (this.removePlistSeq.length > 0) {
        param.deleteFileSeq = this.removePlistSeq.join(',')
      }

      const successHandling = data => {
        const result = data.msg.root.result

        if (result.code === 'S') {
          toastUtil.show('상품평을 수정하였습니다.')
          this.$router.go(-1)
        }
      }

      writeMyReviewService.modifyReview(param, successHandling)
    },

    /**
     * 파일 input 창 열기
     * @returns {void|Boolean}
     */
    openFileInput () {
      if (this.storedFiles.length >= 5) {
        messageUtil.alert('이미지는 최대 5장까지 첨부할 수 있습니다.')
        return false
      }

      this.$el.querySelector('#file').click()
    },

    /**
     * 이미지 파일 선택 시 미리보기
     * @param {object} e 이벤트 객체
     * @returns {void|Boolean}
     */
    onFileSelect (e) {
      const files = e.target.files || e.dataTransfer.files
      const reader = new FileReader()

      if (files.length > 0) {
        for (const key in files) {
          if (typeof files[key] === 'object') {
            const file = files[key]

            if (!file.type.match(/image.*/)) {
              messageUtil.alert('이미지 파일이 아닙니다.')
              return false
            }

            reader.addEventListener('load', () => {
              this.storedFiles.push({ file, src: reader.result })
              this.$el.querySelector('#file').value = ''
            }, false)

            reader.readAsDataURL(file)
          }
        }
      }
    },

    /**
     * 이미지 파일 삭제
     * @param {number} index 삭제할 이미지 파일 인덱스
     */
    removeImage (index) {
      this.storedFiles.splice(index, 1)
    },

    /**
     * 이미지 등록
     * @returns {void|boolean}
     */
    execUploadFiles () {
      // 업로드 완료한 개수와 저장된 파일 개수가 같은 경우 = 모든 파일을 다 업로드 한 경우
      if (this.uploadedIdx === this.storedFiles.length) {
        toastUtil.show('상품평을 등록하였습니다.')
        this.$router.go(-1) // 상품평 목록으로 이동
        return false
      }

      this.$el.querySelector('#reviewCnt').value = this.uploadedIdx

      const fileObj = this.storedFiles[this.uploadedIdx]
      this.$el.querySelector('#fileForm').value = fileObj.file.name

      const fileData = new FormData(this.$el.querySelector('#sendFileForm'))
      fileData.append('inputUpload', this.storedFiles[0].file)

      writeMyReviewService.execUploadFiles({
        method: 'post',
        url: `${CONST.API_URL}/NSAjaxCustomerReview`,
        data: fileData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(
        result => {
          this.uploadedIdx++

          if (result.processResult === 1) {
            // 업로드 개수만큼 실행
            this.execUploadFiles()
          } else {
            // 사진 모두 등록 완료 시 뒤로
            toastUtil.show('상품평을 등록하였습니다.')
            this.$router.go(-1)
          }
        }
      ).catch(() => {
        toastUtil.show('사진을 등록하지 못했습니다.')
        this.$router.go(-1)
      })
    },

    /**
     * 수정일 경우 기존 작성된 리뷰 가져오기
     */
    getWirtedReview () {
      const param = {
        cmdType: '130',
        catentryId: this.productId,
        dan_catId: this.danCatentryId,
        goodgrdSeq: this.goodgrdSeq,
        ordersId: this.ordersId,
        partNumber: this.productId,
        photoYN: this.photoYN
      }

      const successHandling = data => {
        if (data.returnValue && data.returnValue.contents) {
          const contents = data.returnValue.contents

          // 변경 전 점수 저장. 수정 요청 시 필요
          this.beforeModify.item1 = contents.score1
          this.beforeModify.item2 = contents.score2
          this.beforeModify.item3 = contents.score3
          this.beforeModify.item4 = contents.score4

          if (this.catGb === '30') {
            this.beforeModify.item5 = contents.service_info1
            this.beforeModify.item6 = contents.service_info2
          }

          // 화면에 렌더링할 데이터
          this.catePicked.item1 = this.scoreChange(contents.score1)
          this.catePicked.item2 = this.scoreChange(contents.score2)
          this.catePicked.item3 = this.scoreChange(contents.score3)
          this.catePicked.item4 = this.scoreChange(contents.score4)

          if (this.catGb === '30') {
            this.catePicked.item5 = contents.service_info1
            this.catePicked.item6 = contents.service_info2
          }

          this.writedPlist = data.returnValue.pList
          // this.reviewTextarea = htmlDecode(contents.text)
          //
          this.reviewTextarea = contents.text
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
        }
      }

      writeMyReviewService.getWirtedReview(param, successHandling)
    },

    /**
     * 각 항목 점수를 모바일에서 보여줄 수 있는 형태로 변환
     * @param {number} num 상품평 각 항목 점수
     * @returns {number} score
     */
    scoreChange (num) {
      let score = parseInt(num, 10)

      if (score < 2) {
        score = 1
      } else if (score > 3) {
        score = 5
      } else {
        score = 3
      }

      return score
    },

    /**
     * 답변 리스트 순서 정렬
     */
    sortAnswerList () {
      for (let i = 0; i < this.category.length; i++) {
        this.category[i].answerList = this.category[i].answerList.reverse()
      }
    },

    /**
     * 리뷰 글자수 체크
     */
    checkReviewLength () {
      const len = 400

      // 모바일에서는 focusout 되어야함 textarea v-model 업데이트가 됨..... 그래서 강제로 값 할당
      this.reviewTextarea = this.$el.querySelector('#textarea').value

      if (this.reviewTextarea.length > len) {
        messageUtil.alert('상품평은 최대 400자까지 작성해 주세요.', () => {
          this.reviewTextarea = this.reviewTextarea.substr(0, len)
        })
      }
    },

    /**
     * 수정하기 시 이미지 삭제
     * @param {object} file 삭제할 파일 객체
     */
    removePlistImage (file) {
      this.removePlistSeq.push(file.fileSeq)
      this.writedPlist = this.writedPlist.filter(item => item.fileSeq !== file.fileSeq)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/product/review/WriteMyReview";
</style>
