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
import {
  isNull,
  extend
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import cookieUtil from '@frameworks/cookieUtil'
import messageUtil from '@frameworks/messageUtil'
import bizUtil from '@utils/bizUtil'
import uiUtil from '@utils/uiUtil'

export default {
  name: 'TopPageLayoutSevenSlotView',
  props: {
    slotGlobalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      totalOrgan: {
        tv: null,
        shopPlus: null,
        rcmdUser: null
      },
      object: {
        callback: this.callNSMobileGetEspotData
      },
      espotList: [],
      espotExtendList: {},
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
  created () {
    this.callNSMobileGetEspotData()
  },
  mounted () {
    this.initParamObject()
    uiUtil.bindInfiniteScroll(this, this.object)
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
     * NSMobileGetEspotData 호출
     * @param {String} callDiv
     * @returns {void|boolean}
     */
    async callNSMobileGetEspotData (callDiv, sectionId) {
      this.slotGlobalVal.callDiv = callDiv
      if (this.slotGlobalVal.pageCallYn === 'N' && isNull(callDiv)) {
        return false
      }

      let tmpCatalogId = ''
      let tmpTopCategoryId = ''
      let tmpSubCategoryId = isNull(this.slotGlobalVal.subCategoryId) ? '' : this.slotGlobalVal.subCategoryId
      let tmpContinueEspotId = ''
      let tmpThemeCategoryId = ''
      let tmpTargetCategoryId = ''
      let tmpListPageIdx = this.slotGlobalVal.pageCallYn === 'Y' && !isNull(this.slotGlobalVal.listPageIdx) ? this.slotGlobalVal.listPageIdx : 1

      if (isNull(callDiv)) {
        // 초기로딩 or 페이징 시
        if (isNull(this.slotGlobalVal.topCategoryId)) {
          this.slotGlobalVal.topCategoryId = String(this.$route.params.categoryId)
        }
        tmpCatalogId = this.slotGlobalVal.topCategoryId
        tmpTopCategoryId = this.slotGlobalVal.topCategoryId

        // SubCategoryId
        if (!isNull(this.slotGlobalVal.espotData)) {
          // const tmpSubIdx2 = 0
          // for (let tmpSubIdx = 0; tmpSubIdx < this.slotGlobalVal.espotData.espotList.length; tmpSubIdx++) {
          //   const slotName = Object.keys(this.slotGlobalVal.espotData.espotList[tmpSubIdx])[0].split('_')[4]
          //   if (slotName === 'THEMECATE' || slotName === 'THEMECATESLIDE') {
          //     tmpSubCategoryId = Object.keys(this.slotGlobalVal.espotData.espotList[tmpSubIdx2])[0].split('_')[1]
          //   }
          // }

          // thema or themaSlide 슬롯 내 페이징 시
          if (this.slotGlobalVal.param.categoryDiv === 'thema' || this.slotGlobalVal.param.categoryDiv === 'themaSlide') {
            tmpSubCategoryId = isNull(this.slotGlobalVal.param.espotId) ? tmpSubCategoryId : this.slotGlobalVal.param.espotId.split('_')[0]
          }
        }

        // 다음 페이지가 있는 경우
        if (this.slotGlobalVal.pageCallYn === 'Y' && !isNull(this.slotGlobalVal.continueEspotId)) {
          tmpContinueEspotId = this.slotGlobalVal.continueEspotId
          tmpThemeCategoryId = this.slotGlobalVal.themaCategoryId
          if (tmpListPageIdx === 1) {
            tmpThemeCategoryId = ''
          }
        }
        // thema or themaSlide 슬롯 내 페이징 시
        if (this.slotGlobalVal.param.categoryDiv === 'thema' || this.slotGlobalVal.param.categoryDiv === 'themaSlide') {
          tmpTargetCategoryId = this.slotGlobalVal.targetCategoryId
          tmpThemeCategoryId = this.slotGlobalVal.param.categoryId
        }
      } else {
        if (callDiv === 'sub') {
          this.slotGlobalVal.clickThemaSeq = []
          this.slotGlobalVal.clickThemaCategoryNm = []
        }

        // 메뉴 클릭 시
        if (this.slotGlobalVal.param.categoryDiv === 'sub') {
          // subcate 클릭 시
          tmpListPageIdx = 1
          tmpCatalogId = this.slotGlobalVal.topCategoryId
          tmpTopCategoryId = this.slotGlobalVal.topCategoryId
          tmpSubCategoryId = this.slotGlobalVal.param.categoryId
        } else if (this.slotGlobalVal.param.categoryDiv === 'thema' || this.slotGlobalVal.param.categoryDiv === 'themaSlide') {
          // themacate or themacateslide 클릭 시
          tmpCatalogId = this.slotGlobalVal.topCategoryId
          tmpTopCategoryId = this.slotGlobalVal.topCategoryId
          tmpSubCategoryId = this.slotGlobalVal.param.espotId.split('_')[0]
          tmpThemeCategoryId = this.slotGlobalVal.param.categoryId
          tmpTargetCategoryId = ''
          if (this.slotGlobalVal.param.categoryDiv === 'themaSlide') {
            tmpTargetCategoryId = tmpThemeCategoryId
          }
        }
        tmpContinueEspotId = this.slotGlobalVal.param.espotId
      }

      // subCategoryId를 url에 직접 적용한 경우를 위한 처리
      // tmpSubCategoryId = isNull(this.$route.params.subCategoryId) ? tmpSubCategoryId : this.$route.params.subCategoryId
      tmpSubCategoryId = isNull(this.$route.query.gotoSub) ? tmpSubCategoryId : this.$route.query.gotoSub

      const param = {
        layoutAppGubun: 'HUB', // 앱 구분 ( HUB, NFOOD, SHOP )
        catalogId: tmpCatalogId,
        topCategoryId: tmpTopCategoryId, // 카테고리 ID
        subCategoryId: tmpSubCategoryId,
        themeCategoryId: tmpThemeCategoryId,
        targetCategoryId: tmpTargetCategoryId,
        continueEspotId: tmpContinueEspotId,
        listPageIdx: tmpListPageIdx,
        pageSize: 20
      }

      const successHandling = async data => {
        if (isNull(data.msg)) {
          if (!isNull(data.authMsg)) {
            // 잘못된 url 접근입니다.
            if (data.authMsg.authCode === '400') {
              messageUtil.alert(data.authMsg.message, () => {
                bizUtil.gotoMain()
              })
            }
          } else if (!isNull(data.ESPOT_ERROR_MSG)) {
            messageUtil.alert(data.ESPOT_ERROR_MSG.resultMsg, () => {
              bizUtil.gotoMain()
            })
          }

          return false
        }

        this.slotGlobalVal.espotData = data.msg

        // 기존 선택된 thema 슬롯 section id 가 없는 경우 처음으로 조회되는 thema 슬롯 section id
        if (isNull(this.slotGlobalVal.beforeSectionId)) {
          for (let i = 0; i < this.slotGlobalVal.espotData.espotList.length; i++) {
            const espotKey = Object.keys(this.slotGlobalVal.espotData.espotList[i])[0]
            if (espotKey.split('_')[4] === 'THEMECATE' || espotKey.split('_')[4] === 'THEMECATESLIDE') {
              this.slotGlobalVal.beforeSectionId = espotKey.split('_')[2].substr(espotKey.split('_')[2].indexOf('SLOT'), espotKey.split('_')[2].length)
              break
            }
          }
        }
        // 선택된 thema 슬롯 section id
        this.slotGlobalVal.themaSectionId = isNull(sectionId) ? this.slotGlobalVal.beforeSectionId : sectionId
        // thema 슬롯 category id list
        for (let d = 0; d < this.slotGlobalVal.espotData.espotList.length; d++) {
          const espotKey = Object.keys(this.slotGlobalVal.espotData.espotList[d])[0]
          const tmpSectionId = espotKey.split('_')[2].substr(espotKey.split('_')[2].indexOf('SLOT'), espotKey.split('_')[2].length)
          const slotName = espotKey.split('_')[4]
          if (slotName === 'THEMECATE' || slotName === 'THEMECATESLIDE') {
            this.slotGlobalVal.beforeThemeCategoryId[tmpSectionId] = this.slotGlobalVal.espotData.espotList[d][espotKey][0].categoryId
          }
        }
        // 직전에 선택된 thema category id 가 있는 경우
        if (!isNull(this.slotGlobalVal.tmpThemaCategoryId[this.slotGlobalVal.themaSectionId])) {
          this.slotGlobalVal.beforeThemeCategoryId[this.slotGlobalVal.themaSectionId] = this.slotGlobalVal.tmpThemaCategoryId[this.slotGlobalVal.themaSectionId]
        }

        this.slotGlobalVal.tmpThemaCategoryId[this.slotGlobalVal.themaSectionId] = tmpThemeCategoryId
        this.slotGlobalVal.pageCallYn = data.msg.pageCallYn // 페이징 처리 여부
        this.slotGlobalVal.continueEspotId = data.msg.continueEspotId // 페이징 처리시 다음 조회 될 espot ID
        this.slotGlobalVal.listPageIdx = data.msg.listPageIdx // 페이징 처리시 다음 조회 될 index
        this.slotGlobalVal.topCategoryId = data.topCategoryId[0]
        this.slotGlobalVal.subCategoryId = isNull(data.subCategoryId) ? (isNull(data.msg.continueEspotId) ? '' : data.msg.continueEspotId.split('_')[0]) : data.subCategoryId[0]
        this.slotGlobalVal.targetCategoryId = data.msg.targetCategoryId

        // subcate seq
        if (isNull(callDiv)) {
          for (let subSeq = 0; subSeq < data.msg.espotList.length; subSeq++) {
            if (Object.keys(data.msg.espotList[subSeq])[0].split('_')[4] === 'SUBCATE') {
              this.slotGlobalVal.subcateSeq = data.msg.espotList[subSeq][Object.keys(data.msg.espotList[subSeq])[0]][0].seq
              this.slotGlobalVal.subcateName = data.msg.espotList[subSeq][Object.keys(data.msg.espotList[subSeq])[0]][0].categoryName
              this.slotGlobalVal.clickSubCategoryName = data.msg.espotList[subSeq][Object.keys(data.msg.espotList[subSeq])[0]][0].categoryName
            }
          }
        } else {
          this.slotGlobalVal.subcateSeq = this.slotGlobalVal.param.subSeq
          this.slotGlobalVal.subcateName = this.slotGlobalVal.param.subCategoryName
          this.slotGlobalVal.clickSubCategoryName = this.slotGlobalVal.param.subCategoryName
        }

        // temacate seq
        for (let temaSeq = 0; temaSeq < data.msg.espotList.length; temaSeq++) {
          const themaObjKey = Object.keys(data.msg.espotList[temaSeq])[0].split('_')[2].substr(Object.keys(data.msg.espotList[temaSeq])[0].split('_')[2].indexOf('SLOT'), Object.keys(data.msg.espotList[temaSeq])[0].split('_')[2].length)

          if (Object.keys(data.msg.espotList[temaSeq])[0].split('_')[4] === 'THEMECATE' || Object.keys(data.msg.espotList[temaSeq])[0].split('_')[4] === 'THEMECATESLIDE') {
            if (isNull(this.slotGlobalVal.clickThemaSeq[themaObjKey])) {
              this.slotGlobalVal.clickThemaSeq[themaObjKey] = data.msg.espotList[temaSeq][Object.keys(data.msg.espotList[temaSeq])[0]][0].seq
              this.slotGlobalVal.clickThemaCategoryNm[themaObjKey] = data.msg.espotList[temaSeq][Object.keys(data.msg.espotList[temaSeq])[0]][0].categoryName
            } else {
              if (themaObjKey === sectionId) {
                this.slotGlobalVal.clickThemaSeq[sectionId] = this.slotGlobalVal.param.themaSeq
                this.slotGlobalVal.clickThemaCategoryNm[sectionId] = this.slotGlobalVal.param.categoryName
              }
            }
          }
        }

        const tmpEspotList = []
        const tmpEspotExtendList = {}

        if (this.espotList.length === 0) {
          // 초기로딩인 경우
          this.slotGlobalVal.currentTab = 0

          this.espotList = data.msg.espotList
          this.espotExtendList = data.msg.espotExtendList

          for (let k = 0; k < data.msg.espotList.length; k++) {
            if (Object.keys(data.msg.espotList[k])[0].split('_')[4] === 'SUBCATE') {
              this.slotGlobalVal.subcateSeq = data.msg.espotList[k][Object.keys(data.msg.espotList[k])[0]][0].seq
              this.slotGlobalVal.subcateName = data.msg.espotList[k][Object.keys(data.msg.espotList[k])[0]][0].categoryName
            }
          }
        } else {
          // 기존 조회된 내역이 있는 경우
          for (let k = 0; k < data.msg.espotList.length; k++) {
            if (isNull(callDiv)) {
              // 페이징시
              let addFlg = true
              for (let q = 0; q < this.espotList.length; q++) {
                if (Object.keys(this.espotList[q])[0] === Object.keys(data.msg.espotList[k])[0]) {
                  if (!isNull(tmpListPageIdx) && Number(tmpListPageIdx) > 1) {
                    for (let z = 0; z < data.msg.espotList[k][Object.keys(data.msg.espotList[k])[0]].length; z++) {
                      this.espotList[q][Object.keys(this.espotList[q])[0]].push(data.msg.espotList[k][Object.keys(data.msg.espotList[k])[0]][z])
                      this.espotExtendList[Object.keys(data.msg.espotList[k])[0]] = data.msg.espotExtendList[Object.keys(data.msg.espotList[k])[0]]
                    }
                  }
                  addFlg = false
                }
              }

              if (addFlg) {
                this.espotList.push(data.msg.espotList[k])
                this.espotExtendList[Object.keys(data.msg.espotList[k])[0]] = data.msg.espotExtendList[Object.keys(data.msg.espotList[k])[0]]
              }
            } else {
              // subcate를 클릭 한 경우
              if (this.slotGlobalVal.param.categoryDiv === 'sub') {
                if (k === 0) {
                  for (let j = 0; j < this.espotList.length; j++) {
                    // NSSlotShopCmd 호출 시 continueEspotId와 espotList의 espotId가 같은 경우 tmpEspotList에 담는다
                    if (Object.keys(this.espotList[j])[0].substring(1, Object.keys(this.espotList[j])[0].length) === tmpContinueEspotId) {
                      tmpEspotList.push(this.espotList[j])
                      tmpEspotExtendList[Object.keys(this.espotList[j])[0]] = this.espotExtendList[Object.keys(this.espotList[j])[0]]
                    }
                  }
                  this.espotList = tmpEspotList
                  this.espotExtendList = tmpEspotExtendList
                }
                this.espotList[this.espotList.length] = data.msg.espotList[k]
                this.espotExtendList[Object.keys(data.msg.espotList[k])[0]] = data.msg.espotExtendList[Object.keys(data.msg.espotList[k])[0]]
              }
            }
          }
        }

        // thema 메뉴 클릭한 경우
        if ((this.slotGlobalVal.param.categoryDiv === 'thema' || this.slotGlobalVal.param.categoryDiv === 'themaSlide') && !isNull(callDiv)) {
          // 직전 클릭한 테마메뉴 관련 슬롯데이터를 espotList에서 제거
          const tmpEspot = []
          for (let i = 0; i < this.espotList.length; i++) {
            const slotName = Object.keys(this.espotList[i])[0].split('_')[4]
            if (Object.keys(this.espotList[i])[0].split('_')[1] === this.slotGlobalVal.beforeThemeCategoryId[this.slotGlobalVal.themaSectionId] && slotName !== 'THEMECATE' && slotName !== 'THEMECATESLIDE') {
              this.espotExtendList[Object.keys(this.espotList[i])[0]] = null
              tmpEspot.push(null)
            } else {
              tmpEspot.push(this.espotList[i])
            }
          }
          this.espotList = []
          for (let w = 0; w < tmpEspot.length; w++) {
            if (!isNull(tmpEspot[w])) {
              this.espotList.push(tmpEspot[w])
            }
          }

          // 새로 조회된 data.msg.espotList를 espotList에 반영
          for (let q = 0; q < this.espotList.length; q++) {
            for (let j = 0; j < data.msg.espotList.length; j++) {
              if (Object.keys(this.espotList[q])[0].split('_')[2] === Object.keys(data.msg.espotList[j])[0].split('_')[2]) {
                this.espotList[q] = data.msg.espotList[j]
                this.espotExtendList[Object.keys(this.espotList[q])[0]] = data.msg.espotExtendList[Object.keys(data.msg.espotList[j])[0]]
              }
            }
          }

          // 새로 조회된 data.msg.espotList를 espotList에 추가
          for (let k = 0; k < data.msg.espotList.length; k++) {
            let dataPushFlg = true
            let pushEspotData = null
            let pushExtendData = null
            for (let z = 0; z < this.espotList.length; z++) {
              pushEspotData = data.msg.espotList[k]
              pushExtendData = data.msg.espotExtendList[Object.keys(data.msg.espotList[k])[0]]
              if (Object.keys(data.msg.espotList[k])[0] === Object.keys(this.espotList[z])[0]) {
                dataPushFlg = false
              }
            }

            if (dataPushFlg) {
              this.espotList.push(pushEspotData)
              this.espotExtendList[Object.keys(this.espotList[this.espotList.length - 1])[0]] = pushExtendData
            }
          }
        }

        // themacate 클릭 한 경우
        if (callDiv === 'thema') {
          this.slotGlobalVal.beforeSectionId = this.slotGlobalVal.themaSectionId
        }

        let callNSFixedShopNoCacheCmdFlg = false
        let callNSSlotShopNoCacheCmdFlg = false
        let espotFullName = ''
        let categoryId = ''
        let extendParams = null

        // 편성정보 or 추천상품 슬롯이 존재하는지 여부
        for (let i = 0; i < this.espotList.length; i++) {
          const espotName = Object.keys(this.espotList[i])[0].substr(Object.keys(this.espotList[i])[0].indexOf(Object.keys(this.espotList[i])[0].split('_')[4])) // espot HTML 페이지명

          if (espotName === 'BROADTV' || espotName === 'BROAD') {
            callNSFixedShopNoCacheCmdFlg = true
          }
          if (espotName === 'PRDRCMDUSER') {
            callNSSlotShopNoCacheCmdFlg = true

            espotFullName = Object.keys(this.espotList[i])[0].substring(1, Object.keys(this.espotList[i])[0].length)
            categoryId = Object.keys(this.espotList[i])[0].split('_')[1] // 카테고리 ID
            extendParams = {
              rbPcid: cookieUtil.getCookie('RB_PCID') || '',
              userId: loginUtil.custNum()
            }
          }
        }

        // 편성정보 슬롯이 존재하는 경우
        if (callNSFixedShopNoCacheCmdFlg) {
          this.callNSFixedShopNoCacheCmd(data => {
            if (!isNull(data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo.TotalOrgan)) {
              if (data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo.TotalOrgan.length > 0) {
                this.totalOrgan.tv = data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo.TotalOrgan[0]
                this.totalOrgan.tv.multiFlg = data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo.TotalOrgan.length + Number(data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo.RelatedPrdtSize)
              }
            }
            if (!isNull(data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[1]._SHOPPLUS[0].TotalOrgan)) {
              if (data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[1]._SHOPPLUS[0].TotalOrgan.length > 0) {
                this.totalOrgan.shopPlus = data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[1]._SHOPPLUS[0].TotalOrgan[0]
                this.totalOrgan.shopPlus.multiFlg = data.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[1]._SHOPPLUS[0].TotalOrgan.length
              }
            }

            if (!callNSSlotShopNoCacheCmdFlg) {
              this.validateEspot()
            }
          })
        }

        // 추천상품 슬롯이 존재하는 경우
        if (callNSSlotShopNoCacheCmdFlg) {
          this.callNSSlotShopNoCacheCmd(espotFullName, categoryId, extendParams, data => {
            this.totalOrgan.rcmdUser = data.msg[0][`_${espotFullName}`]

            this.validateEspot()
          })
        }

        // 편성정보, 추천상품 슬롯이 존재하지 않는 경우
        if (!callNSFixedShopNoCacheCmdFlg && !callNSSlotShopNoCacheCmdFlg) {
          this.validateEspot()
        }
      }

      await this.$nsaxios.post('NSSlotShopCmd', param, successHandling)
    },
    /**
     * NSFixedShopNoCacheCmd 호출
     * @param {Function} callback - NSFixedShopNoCacheCmd 조회 후 호출될 callback 함수
     */
    async callNSFixedShopNoCacheCmd (callBack) {
      const param = {
        typeFlag: 'espot',
        espotInfo: 'EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE|BROADALL_BROADBOXSLIDE|1|999|0',
        gubun: 'TV|SHOPPLUS',
        targetEspotId: 'EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE'
      }

      await this.$nsaxios.post('NSFixedShopNoCacheCmd', param, callBack)
    },
    /**
     * NSSlotShopNoCacheCmd 호출
     * @param {String} espotFullName - espot명
     * @param {String} categoryid - 카테고리 ID
     * @param {Object} extendParams - NSSlotShopNoCacheCmd API 호출시 넘겨줄 param
     * @param {Function} callback - NSSlotShopNoCacheCmd 조회 후 호출될 callback 함수
     */
    async callNSSlotShopNoCacheCmd (espotFullName, categoryid, extendParams, callBack) {
      const param = extend(extendParams, {
        targetEspotId: espotFullName,
        categoryId: categoryid
      })

      await this.$nsaxios.post('NSSlotShopNoCacheCmd', param, callBack)
    },
    /**
     * import espot 체크
     */
    validateEspot () {
      for (let idx = 0; idx < this.sectionId.length; idx++) {
        let espotListIdx = 0
        let slotNm = ''
        let newSlotNm = ''

        for (let j = 0; j < this.espotList.length; j++) {
          const splitFullNm = Object.keys(this.espotList[j])[0].split('_')
          const slotStr = splitFullNm[2] // 슬롯 위치

          if (this.sectionId[idx] === slotStr.substr(slotStr.indexOf('SLOT'))) {
            espotListIdx = j
            slotNm = slotStr.substr(slotStr.indexOf('SLOT')) // 슬롯명
          }
        }

        for (let k = 0; k < this.slotGlobalVal.espotData.espotList.length; k++) {
          const splitFullNm = Object.keys(this.slotGlobalVal.espotData.espotList[k])[0].split('_')
          const slotStr = splitFullNm[2] // 슬롯 위치

          if (this.sectionId[idx] === slotStr.substr(slotStr.indexOf('SLOT'))) {
            newSlotNm = slotStr.substr(slotStr.indexOf('SLOT')) // 슬롯명
          }
        }

        if (isNull(slotNm)) {
          this.espotName[idx] = ''
          this.espotFullName[idx] = ''
          this.importComponent[idx] = ''

          this.$forceUpdate()
        }

        if (this.sectionId[idx] === slotNm) {
          if (!isNull(newSlotNm) || (!isNull(newSlotNm) && !isNull(this.slotGlobalVal.callDiv))) {
            const espotKey = Object.keys(this.espotList[espotListIdx])[0]

            this.espotData[this.sectionId[idx]] = this.espotList[espotListIdx][espotKey]
            this.espotExtendData[this.sectionId[idx]] = this.espotExtendList[espotKey]

            this.setComponent(espotKey, idx)
          }
        }
      }
    },
    /**
     * import espot
     */
    setComponent (espotKey, importComponentIdx) {
      const splitFullNm = espotKey.split('_')
      const espotNm = espotKey.substr(espotKey.indexOf(splitFullNm[4])) // espot HTML 페이지명

      if (espotNm === 'PRDSLIDESQUARE25W') {
        this.espotName[importComponentIdx] = espotKey.substr(espotKey.indexOf(splitFullNm[3]))
      } else {
        this.espotName[importComponentIdx] = espotNm
      }
      this.espotFullName[importComponentIdx] = espotKey

      // 동적으로 import 하면 안된다 그래서...
      if (espotNm === 'SUBCATE') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/Subcate" */ '@/components/store/slot/cate/Subcate'))
      } else if (espotNm === 'THEMECATE') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/Themacate" */ '@/components/store/slot/cate/Themacate'))
      } else if (espotNm === 'THEMECATESLIDE') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/ThemaCateSlide" */ '@/components/store/slot/cate/ThemaCateSlide'))
      } else if (espotNm === 'CNTNT') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/Cntnt" */ '@/components/store/slot/cntnt/Cntnt'))
      } else if (espotNm === 'CNTNT4W') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/Cntnt4w" */ '@/components/store/slot/cntnt/Cntnt4w'))
      } else if (espotNm === 'CNTNTSLIDE15W') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntSlide15w" */ '@/components/store/slot/cntnt/CntntSlide15w'))
      } else if (espotNm === 'CNTNTCIRCLESLIDE') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntCircleSlide" */ '@/components/store/slot/cntnt/CntntCircleSlide'))
      } else if (espotNm === 'CNTNTLIST') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntList" */ '@/components/store/slot/cntnt/CntntList'))
      } else if (espotNm === 'CNTNTTEXT') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntText" */ '@/components/store/slot/cntnt/CntntText'))
      } else if (espotNm === 'CNTNTPROM') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntProm" */ '@/components/store/slot/cntnt/CntntProm'))
      } else if (espotNm === 'CNTNTPRDLIST') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntPrdList" */ '@/components/store/slot/cntnt/CntntPrdList'))
      } else if (espotNm === 'CNTNTPRDGRID4W') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntPrdGrid4w" */ '@/components/store/slot/cntnt/CntntPrdGrid4w'))
      } else if (espotNm === 'CNTNTPRDSLIDE') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/CntntPrdSlide" */ '@/components/store/slot/cntnt/CntntPrdSlide'))
      } else if (espotNm === 'PRDGRID') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/PrdGrid" */ '@/components/store/slot/prd/PrdGrid'))
      } else if (espotNm === 'PRDSLIDESQUARE25W' || espotNm === 'PRDRCMDUSER') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/PrdSlideSquare25w" */ '@/components/store/slot/prd/PrdSlideSquare25w'))
      } else if (espotNm === 'PRDWIDE') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/PrdWide" */ '@/components/store/slot/prd/PrdWide'))
      } else if (espotNm === 'PRDSLIDE15W') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/PrdSlide15w" */ '@/components/store/slot/prd/PrdSlide15w'))
      } else if (espotNm === 'PRDLIST') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/PrdList" */ '@/components/store/slot/prd/PrdList'))
      } else if (espotNm === 'PRDGRID4W') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/PrdGrid4w" */ '@/components/store/slot/prd/PrdGrid4w'))
      } else if (espotNm === 'BROADTV') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/Broad" */ '@/components/store/slot/broad/Broad'))
      } else if (espotNm === 'BROAD') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/BroadTv" */ '@/components/store/slot/broad/BroadTv'))
      } else if (espotNm === 'TEXTSLIDE') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/TextSlide" */ '@/components/store/slot/text/TextSlide'))
      } else if (espotNm === 'PRDLARGE') {
        this.$set(this.importComponent, importComponentIdx, () => import(/* webpackChunkName: "TopPageLayoutSevenSlotView/TextSlide" */ '@/components/store/slot/prd/PrdLarge'))
      }
    },
    /**
     * 무한 스크롤용 객체 초기화
     */
    initParamObject () {
      // this.isCallMypageMainRealLoding = false

      this.object.callback = this.callNSMobileGetEspotData
      this.object.isEnable = true
      this.object.interval = 500
      this.object.triggerHeightPercent = 90
    }
  }
}
</script>
