<template>
  <!DOCTYPE html>
  <html lang="ko">
    <head>
      <title>Dummy</title>
    </head>
    <body>
      <div class="category_box" />
      <div class="category_small" />
      <div class="category_small_" />
      <div class="dimmed_all" />
      <div class="navigation" />
      <div class="tv_live_box" />

      <themacate
        :espot-name="espotName"
        :slot-global-val="slotGlobalVal"
        :espot-data="espotData"
        :espot-extend-data="espotExtendData"
        :total-organ="totalOrgan"
      />
    </body>
  </html>
</template>

<script>
import Themacate from '@/components/store/slot/cate/Themacate'

export default {
  components: {
    Themacate
  },
  props: {
    espotName: {
      type: String,
      required: true
    },
    slotGlobalVal: {
      type: Object,
      required: true
    },
    espotData: {
      type: Object,
      required: true
    },
    espotExtendData: {
      type: Object,
      required: true
    },
    totalOrgan: {
      type: Object,
      required: true
    }
  }
}
</script>
