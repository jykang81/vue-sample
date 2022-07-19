<template>
  <div class="ns_pay_intro">
    <h3>
      쉽고 빠른 결제<br>
      <span>NS페이</span>
    </h3>
    <p class="intro_img">
      <img
        src="~@/assets/images/mypage/icons_nspay_intro.png"
        alt="NS페이 소개 이미지"
      >
    </p>
    <div class="btn_nspay">
      <button
        type="button"
        class="btn"
        @click="$router.push('/customer/info/nspay/method/register')"
      >
        <span>NS페이 등록하기</span>
      </button>
    </div>
    <div class="introduce">
      <p class="title">
        NS페이 소개
      </p>
      <dl>
        <dt><span>01.</span> 편리한 결제</dt>
        <dd>신용/체크카드, 계좌를 하나의 비밀번호로 쉽고 편리하게 이용하세요.</dd>
        <dt><span>02.</span> 안전한 결제</dt>
        <dd>본인인증을 통해 설정한 비밀번호로 안전한 결제를 제공합니다.</dd>
        <dt><span>03.</span> 원터치 결제</dt>
        <dd>한번만 등록하면 비밀번호 입력없이 원터치로 빠르게 이용할 수 있습니다.</dd>
      </dl>
      <p class="guide">
        * 안전한 결제를 위해 추가 확인이 필요한 경우 비밀번호를 요구할 수 있습니다.
      </p>
    </div>
  </div>
</template>

<style lang="scss">
  @import "~@/assets/styles/views/customer/nspay/NSPayIntro";
</style>
