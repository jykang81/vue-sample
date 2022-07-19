<template>
  <div>
    <div class="header">
      <h1>상품 구성 정보</h1>
    </div>
    <ul class="push_tabs">
      <li class="violet" />
      <li class="green" />
      <li class="orange" />
    </ul>
    <div class="contents">
      <div class="component_area">
        <h3 class="icon mark">
          구성품을 확인하세요
        </h3>
        <div id="confirmcontents" class="scroll mark_txt" />
      </div>
      <div class="add_area">
        <h3 class="icon add">
          추가 구성품
        </h3>
        <div id="addconfirmcontents" class="scroll add_txt" />
      </div>
    </div>
    <div class="logo">
      <span>NS홈쇼핑</span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * 초기화
     * 페이지가 열릴때 기본적으로 실행되어야 할 작업들 정의
     */
    async init () {
      // 파라미터 세팅 partNumber
      // getContent()
      // this.globalVal.partNumber = `${this.$route.params.number}`

      // const { qaListData } = await this.getProductDetail()
    }
  }
}
</script>
