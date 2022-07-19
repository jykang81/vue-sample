<template>
  <div class="order_sheet_guest_agree">
    <div class="contents">
      <p class="title">
        비회원 개인정보 수집 및 이용 동의
      </p>
      <div class="agree_frame">
        <dl>
          <dt>1. 개인정보 수집 항목</dt>
          <dd>
            주문자 정보(이름, 휴대폰번호, 이메일주소, 비밀번호)<br>
            수령인 정보(이름, 휴대폰번호, 배송지)<br>
            신용카드, 아이핀CI, 접속IP
          </dd>
          <dt>2. 개인정보 수집 목적 및 보유기간</dt>
          <dd>
            ① 구매계약이행, 대금결제, 정상이용 또는 민원처리 등<br>
            가. 콘텐츠제공, 본인식별, 구매계약, 대금결제, 상품배송, 주문/배송정보 안내, 청구서 등 발송, 금융거래 본인인증 등<br>
            나. 부정이용방지, 비인가사용 방지, 민원처리(불만처리 등), 구매 관련 중요내용 통지 등<br>
            ② 보유기간<br>
            가. 계약 또는 청약철회 등에 관한 기록: 5년<br>
            나. 대금결제 및 재화 등의 공급에 관한 기록: 5년<br>
            다. 소비자의 불만 또는 분쟁처리에 관한 기록: 3년
          </dd>
          <dd>3. NS는 비회원의 개인정보를 상기 목적 이외로 이용하지 아니 합니다.</dd>
          <dd>4. NS는 계약 및 서비스 이행을 위해 수집한 개인정보를 외부의 전문업체에 위탁하여 처리합니다(개인정보처리방침참조).</dd>
        </dl>
      </div>
    </div>
    <div class="button">
      <button
        type="button"
        class="btn gray"
        @click="onclickClose"
      >
        닫기
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    /**
     * 닫기
     * @returns {void}
     */
    onclickClose () {
      this.$store.commit('popup/hideWithoutBack')
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/sheet/OrderSheetGuestAgree";
</style>
