<template>
  <body>
    <div class="category_box" />
    <div class="category_small" />
    <div class="dimmed_all" />
    <div class="navigation" />
    <div class="tv_live_box" />

    <thema-cate-slide
      :espot-name="espotName"
      :slot-global-val="slotGlobalVal"
      :espot-data="espotData"
      :espot-extend-data="espotExtendData"
      :total-organ="totalOrgan"
    />
  </body>
</template>

<script>
import ThemaCateSlide from '@/components/store/slot/cate/ThemaCateSlide'

export default {
  components: {
    ThemaCateSlide
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
