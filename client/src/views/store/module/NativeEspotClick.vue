<script>
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
  }
}
</script>
