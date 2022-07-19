<template>
  <div class="slot_store">
    <div id="slotStore_content">
      <component
        :is="slotGlobalVal.importComponent"
        :slot-global-val="slotGlobalVal"
        :total-organ="totalOrgan"
        :espot-list="espotList"
        :espot-extend-list="espotExtendList"
        @callNSMobileGetEspotData="callNSMobileGetEspotData"
      />
    </div>
  </div>
</template>

<script>
import {
  isNull,
  extend
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import cookieUtil from '@frameworks/cookieUtil'
import uiUtil from '@utils/uiUtil'
import messageUtil from '@frameworks/messageUtil'
import bizUtil from '@utils/bizUtil'

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
        beforeThemeCategoryId: {}
      },
      totalOrgan: {
        tv: null,
        shopPlus: null,
        rcmdUser: null
      },
      object: {
        callback: this.callNSMobileGetEspotData
      },
      espotList: [],
      espotExtendList: {}
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
      this.espotList = []
      this.callNSmobilePLCategoryInfo()
    }
  },
  created () {
    this.callNSmobilePLCategoryInfo()
  },
  mounted () {
    this.initParamObject()
    uiUtil.bindInfiniteScroll(this, this.object)
  },
  methods: {
    isNull,
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

        this.espotList = []
        this.slotGlobalVal.pageCallYn = ''
        this.slotGlobalVal.continueEspotId = ''
        this.slotGlobalVal.subCategoryId = ''
        this.slotGlobalVal.themaCategoryId = ''
        this.slotGlobalVal.tmpThemaCategoryId = []
        this.slotGlobalVal.clickSubCategoryName = ''
        this.slotGlobalVal.clickThemaCategoryName = ''
        this.callNSMobileGetEspotData(null)
        this.$store.commit('appHeaderDefault/setPageTitle', this.slotGlobalVal.cateName) // 헤더 타이틀 업데이트
      }

      await this.$nsaxios.post('NSSlotPLCategoryInfoCmd', param, successHandling)
    },
    /**
     * NSMobileGetEspotData 호출
     * @param {String} callDiv
     * @returns {void|boolean}
     */
    async callNSMobileGetEspotData (callDiv, sectionId) {
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
        // 메뉴 클릭 시
        if (this.slotGlobalVal.param.categoryDiv === 'sub') {
          // subcate 클릭 시
          tmpListPageIdx = 1
          tmpCatalogId = this.slotGlobalVal.topCategoryId
          tmpTopCategoryId = this.slotGlobalVal.topCategoryId
          tmpSubCategoryId = this.slotGlobalVal.param.categoryId
          this.slotGlobalVal.clickThemaSeq = []
          this.slotGlobalVal.clickThemaCategoryNm = []
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
      tmpSubCategoryId = isNull(this.$route.query.gotoSub) ? tmpSubCategoryId : this.$route.query.gotoSub
      // tmpSubCategoryId = isNull(this.$route.params.subCategoryId) ? tmpSubCategoryId : this.$route.params.subCategoryId

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
              this.importEspot()
            }
          })
        }

        // 추천상품 슬롯이 존재하는 경우
        if (callNSSlotShopNoCacheCmdFlg) {
          this.callNSSlotShopNoCacheCmd(espotFullName, categoryId, extendParams, data => {
            this.totalOrgan.rcmdUser = data.msg[0][`_${espotFullName}`]

            this.importEspot()
          })
        }

        // 편성정보, 추천상품 슬롯이 존재하지 않는 경우
        if (!callNSFixedShopNoCacheCmdFlg && !callNSSlotShopNoCacheCmdFlg) {
          this.importEspot()
        }

        // if (!isNull(sectionId) && !isNull(callDiv)) {
        //   this.$nextTick(() => {
        //     for (let i = 0; i < this.espotList.length; i++) {
        //       if (Object.keys(this.espotList[i])[0].split('_')[4] === 'THEMECATE') {
        //         const tmpThemaSectionId = Object.keys(this.espotList[i])[0].split('_')[2]
        //         const themaSectionId = tmpThemaSectionId.substr(tmpThemaSectionId.indexOf('SLOT'), tmpThemaSectionId.length)
        //         document.querySelector(`.category_box_${themaSectionId}`).classList.value = `category_box category_box_${themaSectionId} hide`
        //         document.querySelector('.dimmed_all').classList.remove('active')
        //       }
        //     }
        //   })
        // }
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
     * 컴포넌트 임포트
     */
    importEspot () {
      // 동적으로 import 하면 안된다 그래서...
      if (this.slotGlobalVal.layoutViewName === 'TopPageLayoutSevenSlotView' && !this.slotGlobalVal.importComponent) {
        this.slotGlobalVal.importComponent = () => import(/* webpackChunkName: "SlotStore/TopPageLayoutSevenSlotView" */ '@/components/store/slot/TopPageLayoutSevenSlotView')
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

<style lang="scss">
  @import "~@/assets/styles/views/store/SlotStore";
</style>
