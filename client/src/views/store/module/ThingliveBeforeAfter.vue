<template>
  <section
    v-if="!isEmpty(responseData) && beforeAfterProd.length > 0"
    class="thinglive_before_after"
    :name="espotKeyName"
  >
    <div class="title_tag">
      <p class="title">
        <span :class="`label ${type}`">{{ type === 'prev' ? '이전' : '다음' }}</span>{{ type === 'prev' ? '이전' : '다음' }}방송 안내
      </p>
    </div>
    <product-list
      v-if="beforeAfterProd"
      :parent-info="type"
      :product-list="beforeAfterProd"
      :product-more-btn="true"
      :right-order-btn="false"
    />
  </section>
</template>

<script>
import thingliveMixin from '@/mixins/media/thingliveMixin'
import ProductList from '@/components/media/ProductList'
import {
  isEmpty
} from '@utils/commonutil/commonUtil'

export default {
  components: {
    ProductList
  },
  mixins: [
    thingliveMixin
  ],
  props: {
    responseData: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    espotKeyName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 이전/다음 방송 상품 목록
      beforeAfterProd: [],
      parentInfo: ''
    }
  },
  watch: {
    responseData () {
      this.setThingliveBeforeAfter()
    }
  },
  methods: {
    isEmpty,
    /**
     * 이전/다음 방송 상품 데이터 세팅
     * @returns {void}
     */
    setThingliveBeforeAfter () {
      this.setProdArea(this.beforeAfterProd, this.responseData._vod_main_product, 'main')
      this.setProdArea(this.beforeAfterProd, this.responseData._vod_relation_product, 'rel')
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/store/module/ThingliveBeforeAfter";
</style>
