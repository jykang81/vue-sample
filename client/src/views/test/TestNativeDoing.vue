<template>
  <div>
    <section>
      <p>Native 화면 작업중입니다.</p>
      <div class="trigger" @click="trigger">
        click me
      </div>
      <input
        id="file"
        ref="fileInput"
        type="file"
        name="file"
      >
    </section>
  </div>
</template>

<script>
// import router from '@/router'
import bizUtil from '@utils/bizUtil'
export default {
  props: {
    paramData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      espotData: ''
    }
  },
  created () {
    const { target, contentsId, clickCode, espotId, mdUrl, catalogId, clksrc } = this.paramData
    bizUtil.espotClickEvent(target, contentsId, clickCode, espotId, mdUrl, catalogId, clksrc)
    /*
    router.replace({
      name: 'lnbCategory',
      params: {
        categoryNumber: '25013764'
      }
    })
    */
  },
  methods: {
    trigger () {
      this.$refs.fileInput.click()
    }
  }
}
</script>
<style>
  .trigger {
    padding: 10px;
    border: 1px solid red;
    margin-bottom: 16px;
  }
</style>
