<template>
  <div id="topPageLayoutSevenSlotView_Content">
    <section
      v-for="(section, sectionIdx) in sectionId"
      :id="section"
      :key="sectionIdx"
      :name="espotFullName[sectionIdx]"
    >
      <component
        :is="importComponent[sectionIdx]"
        :slot-global-val="slotGlobalVal"
        :espot-data="espotData"
        :espot-extend-data="espotExtendData"
        :total-organ="totalOrgan"
        :espot-name="espotName[sectionIdx]"
        :get-id="section"
        @callNSMobileGetEspotData="callNSMobileGetEspotData"
      />
    </section>
  </div>
</template>

<script>
export default {
  name: 'TopPageLayoutSevenSlotView',
  props: {
    slotGlobalVal: {
      type: Object,
      required: true
    },
    totalOrgan: {
      type: Object,
      required: true
    },
    espotList: {
      type: Array,
      required: true
    },
    espotExtendList: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      sectionId: ['SLOTA', 'SLOTB', 'SLOTC', 'SLOTD', 'SLOTE',
        'SLOTF', 'SLOTG', 'SLOTH', 'SLOTI', 'SLOTJ',
        'SLOTK', 'SLOTL', 'SLOTM', 'SLOTN', 'SLOTO',
        'SLOTP', 'SLOTQ', 'SLOTR', 'SLOTS', 'SLOTT',
        'SLOTU', 'SLOTV', 'SLOTW', 'SLOTX', 'SLOTY',
        'SLOTZ'
      ],
      importComponent: new Array(26),
      espotData: {
        SLOTA: null,
        SLOTB: null,
        SLOTC: null,
        SLOTD: null,
        SLOTE: null,
        SLOTF: null,
        SLOTG: null,
        SLOTH: null,
        SLOTI: null,
        SLOTJ: null,
        SLOTK: null,
        SLOTL: null,
        SLOTM: null,
        SLOTN: null,
        SLOTO: null,
        SLOTP: null,
        SLOTQ: null,
        SLOTR: null,
        SLOTS: null,
        SLOTT: null,
        SLOTU: null,
        SLOTV: null,
        SLOTW: null,
        SLOTX: null,
        SLOTY: null,
        SLOTZ: null
      },
      espotExtendData: {
        SLOTA: null,
        SLOTB: null,
        SLOTC: null,
        SLOTD: null,
        SLOTE: null,
        SLOTF: null,
        SLOTG: null,
        SLOTH: null,
        SLOTI: null,
        SLOTJ: null,
        SLOTK: null,
        SLOTL: null,
        SLOTM: null,
        SLOTN: null,
        SLOTO: null,
        SLOTP: null,
        SLOTQ: null,
        SLOTR: null,
        SLOTS: null,
        SLOTT: null,
        SLOTU: null,
        SLOTV: null,
        SLOTW: null,
        SLOTX: null,
        SLOTY: null,
        SLOTZ: null
      },
      espotName: new Array(26),
      espotFullName: new Array(26)
    }
  },
  watch: {
    espotList () {
      console.log('watch espotList =======================================================>>>>>>>>>>>>>>>>>')
      this.validateEspot()
    },
    'slotGlobalVal.param.categoryId' (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.importComponent = new Array(26)
      }
    }
  },
  created () {
    this.validateEspot()
  },
  updated () {
    /*
      Themacate SLOT에서 스크롤 시 카테고리 영역을 고정하기 위한 높이 계산
      다른 SLOT의 높이와 연계해서 계산해야 하므로 부모 컴포넌트인 TopPageLayoutSevenSlotView에서 계산한다.
      다른 SLOT이 동적으로 import 될 때마다 updated hook은 여러 번 호출될 수 있다.
    */
    const categorySmallEl = document.getElementById('categorySmall')
    if (categorySmallEl) {
      // Themacate.vue SLOT에 emit을 호출
      this.$root.$emit('update:categorySmallBottom', categorySmallEl.getBoundingClientRect().bottom - 96)
    }
  },
  methods: {
    /**
     * import espot 체크
     */
    validateEspot () {
      for (let i = 0; i < this.espotList.length; i++) {
        const splitFullNm = Object.keys(this.espotList[i])[0].split('_')
        // const categoryId = splitFullNm[1] // 카테고리 ID
        const slotStr = splitFullNm[2] // 슬롯 위치
        const slotNm = slotStr.substr(slotStr.indexOf('SLOT')) // 슬롯명
        const espotNm = Object.keys(this.espotList[i])[0].substr(Object.keys(this.espotList[i])[0].indexOf(splitFullNm[4])) // espot HTML 페이지명
        let importComponentIdx = 0

        for (let j = 0; j < this.sectionId.length; j++) {
          if (slotNm === this.sectionId[j]) {
            this.espotData[this.sectionId[j]] = this.espotList[i][Object.keys(this.espotList[i])[0]]
            this.espotExtendData[this.sectionId[j]] = this.espotExtendList[Object.keys(this.espotList[i])[0]]

            importComponentIdx = j
          }
        }

        if (espotNm === 'PRDSLIDESQUARE25W') {
          this.espotName[importComponentIdx] = Object.keys(this.espotList[i])[0].substr(Object.keys(this.espotList[i])[0].indexOf(splitFullNm[3]))
        } else {
          this.espotName[importComponentIdx] = espotNm
        }
        this.espotFullName[importComponentIdx] = Object.keys(this.espotList[i])[0]
        // 동적으로 import 하면 안된다 그래서...
        if (espotNm === 'SUBCATE' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/Subcate" */ '@/components/store/slot/cate/Subcate'))
        } else if (espotNm === 'THEMECATE' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/Themacate" */ '@/components/store/slot/cate/Themacate'))
        } else if (espotNm === 'THEMECATESLIDE' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/ThemaCateSlide" */ '@/components/store/slot/cate/ThemaCateSlide'))
        } else if (espotNm === 'CNTNT' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/Cntnt" */ '@/components/store/slot/cntnt/Cntnt'))
        } else if (espotNm === 'CNTNT4W' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/Cntnt4w" */ '@/components/store/slot/cntnt/Cntnt4w'))
        } else if (espotNm === 'CNTNTSLIDE15W' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntSlide15w" */ '@/components/store/slot/cntnt/CntntSlide15w'))
        } else if (espotNm === 'CNTNTCIRCLESLIDE' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntCircleSlide" */ '@/components/store/slot/cntnt/CntntCircleSlide'))
        } else if (espotNm === 'CNTNTLIST' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntList" */ '@/components/store/slot/cntnt/CntntList'))
        } else if (espotNm === 'CNTNTTEXT' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntText" */ '@/components/store/slot/cntnt/CntntText'))
        } else if (espotNm === 'CNTNTPROM' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntProm" */ '@/components/store/slot/cntnt/CntntProm'))
        } else if (espotNm === 'CNTNTPRDLIST' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntPrdList" */ '@/components/store/slot/cntnt/CntntPrdList'))
        } else if (espotNm === 'CNTNTPRDGRID4W' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntPrdGrid4w" */ '@/components/store/slot/cntnt/CntntPrdGrid4w'))
        } else if (espotNm === 'CNTNTPRDSLIDE' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntPrdSlide" */ '@/components/store/slot/cntnt/CntntPrdSlide'))
        } else if (espotNm === 'PRDGRID' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/PrdGrid" */ '@/components/store/slot/prd/PrdGrid'))
        } else if ((espotNm === 'PRDSLIDESQUARE25W' || espotNm === 'PRDRCMDUSER') && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/PrdSlideSquare25w" */ '@/components/store/slot/prd/PrdSlideSquare25w'))
        } else if (espotNm === 'PRDWIDE' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/PrdWide" */ '@/components/store/slot/prd/PrdWide'))
        } else if (espotNm === 'PRDSLIDE15W' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/PrdSlide15w" */ '@/components/store/slot/prd/PrdSlide15w'))
        } else if (espotNm === 'PRDLIST' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/PrdList" */ '@/components/store/slot/prd/PrdList'))
        } else if (espotNm === 'PRDGRID4W' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/PrdGrid4w" */ '@/components/store/slot/prd/PrdGrid4w'))
        } else if (espotNm === 'BROADTV' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/Broad" */ '@/components/store/slot/broad/Broad'))
        } else if (espotNm === 'BROAD' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/BroadTv" */ '@/components/store/slot/broad/BroadTv'))
        } else if (espotNm === 'TEXTSLIDE' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/TextSlide" */ '@/components/store/slot/text/TextSlide'))
        } else if (espotNm === 'PRDLARGE' && !this.importComponent[importComponentIdx]) {
          this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/TextSlide" */ '@/components/store/slot/prd/PrdLarge'))
        }
      }
    },
    /**
     * callNSMobileGetEspotData 부모 함수 호출
     * @param {Object} param
     */
    callNSMobileGetEspotData (param, sectionId) {
      this.$emit('callNSMobileGetEspotData', param, sectionId)
    }
  }
}
</script>
