<template>
  <div />
</template>
<script>
import popupUtil from '@frameworks/popupUtil'

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
  mounted () {
    const params = {
      identify: this.paramData.identify,
      goodId: this.paramData.goodId,
      startdtm: this.paramData.startdtm,
      enddtm: this.paramData.enddtm,
      nsTalkOnlyFlag: this.paramData.nsTalkOnlyFlag,
      nativeYn: 'Y'
    }

    popupUtil.show('store/HomeBridge', params, null, false)
  }
}
</script>
