<template>
  <div>
    <br>
    <br>
    <h1>찜하기 / 찜취소 테스트</h1>
    <br>
    <br>
    <h3>성인상품 테스트 계정은 lsd268@naver.com/jin163725!로 테스트가능</h3>
    <br>
    <br>
    <div>
      <h4 @click="simpleCatentryIdAdd('23111813')">
        23111813 : 일반상품
      </h4>
      <h4 @click="simpleCatentryIdAdd('11325797')">
        11325797 : 성인상품
      </h4>
    </div>
    <br>
    <br>
    <ns-input
      :params="catentryIdParams"
    />
    <button
      type="button"
      class="button_wish"
    >
      <i
        class="icons_wish"
        @click="onClick($event)"
      />
    </button>
    <!-- 찜 취소 일 때 class on 삭제 -->
  </div>
</template>

<script>
import NsInput from '@components/common/NsInput'
import bizUtil from '@utils/bizUtil'

export default {
  components: {
    NsInput
  },
  data () {
    return {
      catentryIdParams: {
        value: '',
        iconClass: 'user_name',
        title: '상품번호',
        placeholder: '상품번호',
        maxlength: 12,
        isLabel: false,
        labelKind: 'blind',
        isSuccess: false,
        isError: false,
        errorMessage: ''
      }
    }
  },
  methods: {
    /**
     * 찜클릭 이벤트
     *
     * @returns {void}
     */
    async onClick (e) {
      const catentryId = this.catentryIdParams.value

      bizUtil.wishToggle(e, catentryId)
    },
    /**
     * 테스트상품 Input에 입력
     *
     * @param {string} catentryId 상품번호
     * @returns {void}
     */
    simpleCatentryIdAdd (catentryId) {
      this.catentryIdParams.value = catentryId
    }
  }
}
</script>
