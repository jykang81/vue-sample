<template>
  <div class="cust_center_board_inquiry_write">
    <section class="inquiry">
      <ul class="list">
        <li>
          <strong class="subject">
            문의하실 상품을 선택하세요
          </strong>
          <button
            type="button"
            class="btn_select"
            @click="layer = true"
          >
            <span>상품 선택</span>
          </button>
          <div
            v-if="selectedProduct"
            class="select_product"
          >
            <router-link to="#">
              <figure>
                <ns-img
                  :product-number="selectedProduct.goodsCd"
                  :width="144"
                  :height="144"
                  :alt="selectedProduct.goodsName"
                />
              </figure>
              <p class="title">
                {{ selectedProduct.goodsName }}
              </p>
            </router-link>
            <button
              type="button"
              class="btn_delete"
              @click="deleteProduct()"
            >
              <span>삭제</span>
            </button>
          </div>
        </li>
        <li>
          <strong class="subject">
            원하시는 상담유형을 선택하세요
          </strong>
          <div class="select_wrap">
            <label class="select">
              <select
                v-model="bigGroupVal"
                @change="bigSelectGroup"
              >
                <option value="0">문의유형</option>
                <template
                  v-if="bigGroup.length > 0"
                >
                  <option
                    v-for="bigItem in bigGroup"
                    :key="bigItem.id"
                    :value="bigItem.id"
                  >
                    {{ bigItem.name }}
                  </option>
                </template>
              </select>
            </label>
            <label class="select">
              <select
                v-model="mediumGroupVal"
                :class="mediumGroup.length === 0 ? 'disabled' : ''"
                :disabled="mediumGroup.length === 0"
                @change="mediumSelectGroup"
              >
                <option value="0">선택해주세요</option>
                <template
                  v-if="mediumGroup.length > 0"
                >
                  <option
                    v-for="mediumItem in mediumGroup"
                    :key="mediumItem.id"
                    :value="mediumItem.id"
                  >
                    {{ mediumItem.name }}
                  </option>
                </template>
              </select>
            </label>
            <label class="select">
              <select
                v-model="smallGroupVal"
                :class="smallGroup.length === 0 ? 'disabled' : ''"
                :disabled="smallGroup.length === 0"
              >
                <option value="0">선택해주세요</option>
                <template
                  v-if="smallGroup.length > 0"
                >
                  <option
                    v-for="smallItem in smallGroup"
                    :key="smallItem.id"
                    :value="smallItem.id"
                  >
                    {{ smallItem.name }}
                  </option>
                </template>
              </select>
            </label>
          </div>
        </li>

        <li>
          <strong class="subject">
            문의내용
          </strong>
          <div class="board_box">
            <div class="input_field">
              <label
                for="label_title"
                class="blind"
              >
                제목
              </label>
              <span class="input_group">
                <input
                  id="label_title"
                  v-model="titleVal"
                  type="text"
                  title="제목"
                  class="form text"
                  placeholder="제목을 작성해주세요."
                  @keyup="onWrite('title')"
                >
              </span>
            </div>
            <div class="textarea">
              <label
                for="textarea"
                class="blind"
              >
                내용
              </label>
              <textarea
                id="textarea"
                v-model="textVal"
                placeholder="내용을 작성해주세요."
                @keyup="onWrite('text')"
              />
              <p class="fix_num">
                <span class="txt">{{ textVal.length }}</span>/200
              </p>
            </div>

            <template
              v-if="isShowAddImage"
            >
              <button
                v-if="!storedFiles"
                type="button"
                class="btn_add"
                @click="openFileInput"
              >
                <i class="icons_photo" />
                <span>사진 첨부하기 (선택)</span>
              </button>
              <p class="copy">
                이미지 파일만 첨부 가능합니다.(최대 1장)
              </p>
              <div
                v-if="storedFiles"
                class="img_slide"
              >
                <ul>
                  <li>
                    <figure>
                      <ns-img
                        :src="storedFiles.src"
                        alt="첨부 이미지"
                      />
                    </figure>
                    <button
                      type="button"
                      class="btn_delete"
                      @click="removeImage"
                    >
                      <span>삭제</span>
                    </button>
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </li>
        <li>
          <strong class="subject">
            답변알림
          </strong>
          <div class="input_field phone">
            <label
              for="label_phone"
              class="blind"
            >
              휴대전화
            </label>
            <span class="input_group">
              <input
                id="label_phone"
                v-model="userHpNo"
                type="number"
                pattern="\d*"
                title="휴대전화"
                placeholder="휴대폰 번호('-'없이 입력)"
                maxlength="11"
                class="form text"
              >
            </span>
          </div>
          <div class="checkbox_wrap">
            <label>
              <input
                v-model="isSmsNotice"
                type="checkbox"
                class="checkbox square"
              >
              <span class="check_label">SMS 답변알림 받기</span>
            </label>
          </div>
        </li>
      </ul>
      <button
        type="button"
        class="btn_inquiry"
        :class="{ in_active : !isReady }"
        @click="writeBoardInquiry"
      >
        <span>문의하기</span>
      </button>
      <div class="collapse_wrap">
        <dl :class="toggleClass ? 'active' : ''">
          <dt>
            <strong class="title">이용안내</strong>
            <button
              type="button"
              class="btn_collapse"
              @click="onCollapse()"
            >
              펼치기/접기
            </button>
          </dt>
          <dd>
            <ul class="msg_bullet_list">
              <li>문의하신 내용에 대한 답변은 마이페이지 > 고객센터 > 문의내역에서 확인하실 수 있습니다.</li>
              <li>'SMS 답변알림 받기' 를 선택하시면 답변 등록 시 SMS로 알림을 받으실 수 있습니다.</li>
              <li>고객님의 개인정보 노출을 막기 위하여 개인정보는 기록하지 않도록 주의하여 주십시오.</li>
              <li>상담시간은 09:00~18:00입니다.</li>
            </ul>
          </dd>
        </dl>
      </div>
    </section>

    <select-product-layer
      v-show="layer === true"
      @select-product="selectProduct"
      @close-select-product="layer = false"
    />

    <div class="send_file_form">
      <form id="sendFileForm" name="sendFileForm" method="post" enctype="multipart/form-data">
        <input id="accptPath" type="hidden" name="accptPath" value="">
        <input id="storeId" type="hidden" name="storeId" value="">
        <input id="langId" type="hidden" name="langId" value="">
        <input id="userId" type="hidden" name="userId" value="">
        <input id="title" type="hidden" name="title" value="">
        <input id="ctnt" type="hidden" name="ctnt" value="">
        <input id="emailAddr" type="hidden" name="emailAddr" value="">
        <input id="mobile1" type="hidden" name="mobile1" value="">
        <input id="mobile2" type="hidden" name="mobile2" value="">
        <input id="mobile3" type="hidden" name="mobile3" value="">
        <input id="boardClssfCd" type="hidden" name="boardClssfCd" value="">
        <input id="conf_gb" type="hidden" name="conf_gb" value="">
        <input id="csClssfNumL" type="hidden" name="csClssfNumL" value="">
        <input id="csClssfNumM" type="hidden" name="csClssfNumM" value="">
        <input id="csClssfNumS" type="hidden" name="csClssfNumS" value="">
        <input id="orderNum" type="hidden" name="orderNum" value="">
        <input id="orderSeq" type="hidden" name="orderSeq" value="">
        <input id="goodsCd" type="hidden" name="goodsCd" value="">
        <input id="goodsNm" type="hidden" name="goodsNm" value="">
        <input id="itemCd" type="hidden" name="itemCd" value="">
        <input id="itemNm" type="hidden" name="itemNm" value="">
        <input id="txtfile" type="hidden" name="txtfile" value="">
        <input id="mediaType" type="hidden" name="mediaType" value="">
        <label
          for="inputUpload"
          class="blind"
        >
          이미지첨부
        </label>
        <input
          id="inputUpload"
          type="file"
          name="inputUpload"
          accept="image/*"
          @change="onFileSelect"
        >
      </form>
    </div>
  </div>
</template>

<script>
import SelectProductLayer from '@components/custcenter/SelectProductLayer'
import loginUtil from '@utils/loginUtil'
import COMM_CONST from '@constants/framework/constants'
import {
  htmlEncode,
  isEmail,
  isHPNo,
  insertSeparatorPhoneNumber,
  isOsApp
} from '@utils/commonutil/commonUtil'
import routerUtil from '@frameworks/routerUtil'
import messageUtil from '@frameworks/messageUtil'
import toastUtil from '@frameworks/toastUtil'
import NsImg from '@components/common/NsImg'
import CONST from '@constants/framework/framework'
import uiUtil from '@utils/uiUtil'

export default {
  components: {
    SelectProductLayer,
    NsImg
  },
  data () {
    return {
      layer: false,
      toggleClass: true,
      selectedProduct: null,
      bigGroup: [],
      mediumGroup: [],
      smallGroup: [],
      bigGroupVal: '0',
      mediumGroupVal: '0',
      smallGroupVal: '0',
      titleVal: '',
      textVal: '',
      userEmail: '',
      userHpNo: '',
      isSmsNotice: true,
      isShowAddImage: false, // App일 경우 true, true일 경우 사진 첨부하기 활성화
      storedFiles: null
    }
  },
  computed: {
    /**
     * 문의하기에 필요한 데이터가 모두 세팅되었는지 판단
     * @returns {boolean}
     */
    isReady () {
      let isReady = true

      // 문의유형 (대/중/소)
      if (this.bigGroupVal === '0' || this.mediumGroupVal === '0' || this.smallGroupVal === '0') {
        isReady = false
      }

      // 제목, 내용, 이메일 주소
      if (this.titleVal.trim() === '' || this.textVal.trim() === '') {
        isReady = false
      }

      // 문의유형이 대분류 기준 배송/수거, 반품, 교환인 경우 문의상품 선택 필수
      if ((this.bigGroupVal === '2' || this.bigGroupVal === '4' || this.bigGroupVal === '5') && !this.selectedProduct) {
        isReady = false
      }

      // 휴대폰번호 : SMS 답변알림 받기 체크 시 필수
      if (this.isSmsNotice && this.userHpNo.trim() === '') {
        isReady = false
      }

      return isReady
    },

    /**
     * SMS 받기 설정 상태에 따라 confGb 값 리턴
     * SMS 받기 체크 시 11 / 미체크 시 10
     * @return {string}
     */
    confGb () {
      let congGb

      if (this.isSmsNotice) {
        congGb = '11'
      } else {
        congGb = '10'
      }

      return congGb
    }
  },
  watch: {
    layer (newVal) {
      if (newVal) {
        uiUtil.disableScroll()
      } else {
        uiUtil.enableScroll()
      }
    }
  },
  created () {
    if (isEmail(loginUtil.logonId())) {
      // 아이디가 이메일 형태인 경우 유저 메일을 아이디로 세팅
      this.userEmail = loginUtil.logonId()
    } else {
      // 아이디가 이메일 형태가 아닌 경우 이메일 정보 가져옴
      this.userEmail = loginUtil.email()
    }
    this.userHpNo = loginUtil.telNo().replace(/-/gi, '')
    this.getFooterInquirySelectMobile()

    if (isOsApp()) { // APP
      this.isShowAddImage = true
    }
  },
  methods: {
    /**
     * 문의 유형 대분류값 가져오기
     */
    getFooterInquirySelectMobile () {
      const param = {
        cmd_gubun: 'QC1'
      }

      this.$nsaxios.post('FooterInquirySelectMobileReal', param, this.setFooterInquirySelectMobile)
    },

    /**
     * 문의 유형에 노출할 옵션 값을 셋팅 (대분류, 중분류, 소분류)
     * @param {object} data 분류 카테고리 객체
     */
    setFooterInquirySelectMobile (data) {
      /** 대분류, 중분류, 소분류 값 */
      const bigGroup = data.msg.root[0].bigGroup
      const mediumGroup = data.msg.root[0].mediumGroup
      const smallGroup = data.msg.root[0].smallGroup

      if (bigGroup) {
        this.bigGroup = bigGroup
      }

      if (mediumGroup) {
        this.mediumGroup = mediumGroup
        this.mediumGroupVal = '0'
        this.smallGroup = []
        this.smallGroupVal = '0'
      }

      if (smallGroup) {
        this.smallGroup = smallGroup
        this.smallGroupVal = '0'
      }
    },

    /**
     * 대분류 선택 시 중분류 가져오기
     */
    bigSelectGroup () {
      const param = {
        cmd_gubun: 'QC1',
        largeCate_id: this.bigGroupVal
      }

      this.$nsaxios.post('FooterInquirySelectMobileReal', param, this.setFooterInquirySelectMobile)
    },

    /**
     * 중분류 선택 시 소분류 가져오기
     */
    mediumSelectGroup () {
      const param = {
        cmd_gubun: 'QC1',
        mediumCate_id: this.mediumGroupVal
      }

      this.$nsaxios.post('FooterInquirySelectMobileReal', param, this.setFooterInquirySelectMobile)
    },

    /**
     * 제목, 내용 작성 시 값 체크
     * @param {string} type 문자열 타입 (제목/내용)
     */
    onWrite (type) {
      let el
      let len

      if (type === 'title') {
        el = this.$el.querySelector('#label_title')
        len = 25
      } else if (type === 'text') {
        el = this.$el.querySelector('#textarea')
        len = 200
      }

      if (el) {
        if (el.value.length > len) {
          el.value = el.value.substring(0, len)
        }

        this[`${type}Val`] = el.value
      }
    },

    /**
     * 문의 글 등록하기
     *@returns {void|boolean}
     */
    writeBoardInquiry () {
      // 모든 입력폼이 채워지지 않은 경우
      if (!this.isReady) {
        return false
      }

      // 휴대폰 유효성 검증
      if (!this.validatePhone()) {
        return false
      }

      const fileData = new FormData(this.$el.querySelector('#sendFileForm'))
      fileData.set('accptPath', COMM_CONST.getAcceptPath())
      fileData.set('storeId', COMM_CONST.DEFAULT_PARAMS.storeId)
      fileData.set('langId', COMM_CONST.DEFAULT_PARAMS.langId)
      fileData.set('userId', loginUtil.userId())
      fileData.set('title', this.titleVal)
      this.textVal = this.textVal.replace(/\n/gi, ' \n') // 줄바꿈 시 마지막 글자가 제거되는 현상이 있어서 공백 추가
      fileData.set('ctnt', htmlEncode(this.textVal))
      fileData.set('emailAddr', this.userEmail)
      fileData.set('mediaType', '')
      fileData.set('mobile1', this.userHpNo.substring(0, 3))
      fileData.set('mobile2', this.userHpNo.substring(3, this.userHpNo.length - 4))
      fileData.set('mobile3', this.userHpNo.substring(this.userHpNo.length - 4, this.userHpNo.length))
      fileData.set('boardClssfCd', 'Q')
      fileData.set('conf_gb', this.confGb)
      fileData.set('csClssfNumL', this.bigGroupVal)
      fileData.set('csClssfNumM', this.mediumGroupVal)
      fileData.set('csClssfNumS', this.smallGroupVal)

      // 등록된 첨부 이미지가 있을 경우
      if (this.storedFiles) {
        fileData.set('txtfile', this.storedFiles.file.name)
      }

      // 선택된 상품이 있을 경우
      if (this.selectedProduct) {
        fileData.set('orderNum', this.selectedProduct.ordersId)
        fileData.set('orderSeq', this.selectedProduct.orderSeq)
        fileData.set('goodsCd', this.selectedProduct.goodsCd)
        fileData.set('goodsNm', this.selectedProduct.goodsName)
        fileData.set('itemNm', this.selectedProduct.goodsName)
      }

      this.$nsaxios.request({
        method: 'post',
        url: `${CONST.API_URL}/FooterInquiryMobileReal`,
        data: fileData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(
        data => {
          const success = data.msg.root.Result

          if (success === 0) {
            toastUtil.show('1:1문의가 등록되었습니다.')
            routerUtil.back()
          } else {
            messageUtil.alert('1:1문의신청에 실패 하였습니다.')
          }
        }
      ).catch(() => {
        messageUtil.alert('1:1문의신청에 실패 하였습니다.')
      })
    },

    /**
     * 이용안내 접기 펼치기
     */
    onCollapse () {
      this.toggleClass = !this.toggleClass
    },

    /**
     * 상담할 상품 선택
     *
     * @param {object} product 선택된 상품 정보
     */
    selectProduct (product) {
      this.selectedProduct = product
      this.layer = false
    },

    /**
     * 선택된 상품 삭제
     *
     */
    deleteProduct () {
      this.selectedProduct = null
    },

    /**
     * 파일 input 창 열기
     */
    openFileInput () {
      this.$el.querySelector('#inputUpload').click()
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
        const file = files[0]

        if (!file.type.match(/image.*/)) {
          messageUtil.alert('이미지 파일이 아닙니다.')
          return false
        }

        reader.addEventListener('load', () => {
          this.storedFiles = { file, src: reader.result }
        }, false)

        reader.readAsDataURL(file)
      }
    },

    /**
     * 첨부 이미지 미리보기 삭제하기
     */
    removeImage () {
      this.storedFiles = null
      this.$el.querySelector('#inputUpload').value = ''
    },
    /**
     * 휴대폰 유효성 검증
     * @returns {Boolean}
     */
    validatePhone () {
      if (this.confGb === '11') { // confGb === '11': SMS 받기
        if (this.userHpNo.length <= 9 ||
          this.userHpNo.length >= 12 ||
          !isHPNo(insertSeparatorPhoneNumber(this.userHpNo))
        ) {
          messageUtil.alert('휴대폰 정보를 정확하게 입력해 주세요.')
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/custcenter/CustCenterBoardInquiryWrite";
</style>
