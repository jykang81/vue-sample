<template>
  <div class="slot_store">
    <div id="slotStore_content">
      <component
        :is="slotGlobalVal.importComponent"
        :slot-global-val="slotGlobalVal"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlotStore',
  data () {
    return {
      slotGlobalVal: {
        importComponent: '',
        param: {
          categoryDiv: '',
          espotId: ''
        },
        clickThemaSeq: {},
        clickThemaCategoryNm: {},
        beforeThemeCategoryId: {},
        callDiv: ''
      }
    }
  },
  watch: {
    '$route' (newVal, oldVal) {
      // 슬롯매장 간 이동 시 slotGlobalVal 초기화
      this.slotGlobalVal = {
        importComponent: '',
        param: {
          categoryDiv: '',
          espotId: ''
        },
        clickThemaSeq: {},
        clickThemaCategoryNm: {},
        beforeThemeCategoryId: {}
      }
      this.callNSmobilePLCategoryInfo()
    }
  },
  created () {
    this.callNSmobilePLCategoryInfo()
  },
  methods: {
    /**
     * NSmobilePLCategoryInfo 호출
     */
    async callNSmobilePLCategoryInfo () {
      const param = {
        layoutAppGubun: 'HUB'
      }

      const successHandling = data => {
        for (let i = 0; i < data.msg.length; i++) {
          if (data.msg[i].categoryId === String(this.$route.params.categoryId)) {
            this.slotGlobalVal.layoutViewName = data.msg[i].layoutViewName
            this.slotGlobalVal.catalogId = data.msg[i].catalogId
            this.slotGlobalVal.categoryId = data.msg[i].categoryId
            this.slotGlobalVal.topCategoryId = data.msg[i].categoryId
            this.slotGlobalVal.cateName = data.msg[i].cateName
            this.slotGlobalVal.mslotNickName = data.msg[i].mslotNickName
          }
        }

        this.slotGlobalVal.pageCallYn = ''
        this.slotGlobalVal.continueEspotId = ''
        this.slotGlobalVal.subCategoryId = ''
        this.slotGlobalVal.themaCategoryId = ''
        this.slotGlobalVal.tmpThemaCategoryId = []
        this.slotGlobalVal.clickSubCategoryName = ''
        this.slotGlobalVal.clickThemaCategoryName = ''
        this.importEspot()
        this.$store.commit('appHeaderDefault/setPageTitle', this.slotGlobalVal.cateName) // 헤더 타이틀 업데이트
      }

      await this.$nsaxios.post('NSSlotPLCategoryInfoCmd', param, successHandling)
    },
    /**
     * 컴포넌트 임포트
     */
    importEspot () {
      // 동적으로 import 하면 안된다 그래서...
      if (this.slotGlobalVal.layoutViewName === 'TopPageLayoutSevenSlotView') {
        this.slotGlobalVal.importComponent = () => import(/* webpackChunkName: "SlotStore/TopPageLayoutSevenSlotView" */ '@/components/store/slot/TopPageLayoutSevenSlotView')
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/store/SlotStore";
</style>
