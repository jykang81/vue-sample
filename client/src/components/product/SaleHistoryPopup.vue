<template>
  <div class="contents">
    <p class="title">
      할인내역
    </p>
    <div class="content">
      <div class="main_content">
        <p class="hero_copy">
          총 할인금액 : -{{ param.msg }}원
        </p>
      </div>
      <div class="sub_content">
        <p>
          고객님이 보유한 할인쿠폰, 적립금, 상품권, 청구할인카드등을 사용하여 추가할인이 가능합니다.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    param: {
      type: Object,
      required: true
    }
  }
}
</script>
