<template>
  <!-- 테마매장 타이틀 슬롯 -->
  <section :id="espotName" class="themacate">
    <div
      v-show="!isNull(mainTitle) || !isNull(subTitle) || !isNull(imgTitle)"
      class="title_tag border_bold"
    >
      <p
        v-show="!isNull(mainTitle)"
        class="title"
      >
        {{ htmlDecode(mainTitle) }}
      </p>
      <figure @click="bizUtil.espotClickEvent(categoryExtendData.titleContent.clickTarget, categoryExtendData.titleContent.contentsId, categoryExtendData.titleContent.clickCode, categoryExtendData.titleContent.espotId, categoryExtendData.titleContent.mdUrl)">
        <ns-img
          v-show="isNull(mainTitle) && !isNull(imgTitle)"
          :src="imgTitle"
          alt="타이틀 이미지"
        />
      </figure>
      <p
        v-show="!isNull(subTitle)"
        class="tag"
      >
        {{ htmlDecode(subTitle) }}
      </p>
    </div>
    <div
      v-if="categoryList.length > 1"
      class="category_small_box"
    >
      <!-- three 추가시 그리드 3단 -->
      <ul id="categorySmall" :class="isClassName">
        <li
          v-for="(category, categoryIdx) in categoryList"
          :key="categoryIdx"
          :class="[slotGlobalVal.clickThemaSeq[getId] === category.seq ? 'active' : '']"
        >
          <button
            type="button"
            @click="clickClassActive(categoryIdx, category.categoryName)"
          >
            {{ htmlDecode(category.categoryName) }}
          </button>
        </li>
      </ul>
      <!-- 상단 고정 테마매장 -->
      <div
        :class="isClassName2"
      >
        <p
          class="category_title"
          @click="onCollapseCategory($event)"
        >
          {{ htmlDecode(clickCategoryNm) }}
        </p>
        <!-- three 추가시 그리드 3단 -->
        <ul :class="isClassName">
          <li
            v-for="(category2, categoryIdx2) in categoryList"
            :key="categoryIdx2"
            :class="[slotGlobalVal.clickThemaSeq[getId] === category2.seq ? 'active' : '']"
          >
            <button
              type="button"
              @click="clickClassActive(categoryIdx2, category2.categoryName)"
            >
              {{ htmlDecode(category2.categoryName) }}
            </button>
          </li>
        </ul>
      </div>
      <div
        class="dimmed_all"
        @click="categoryClose()"
      />
    </div>
  </section>
</template>

<script>
import NsImg from '@components/common/NsImg'
import {
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import uiUtil from '@utils/uiUtil'
import { mapGetters } from 'vuex'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  name: 'Themacate',
  components: {
    NsImg
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
  },
  data () {
    return {
      categorySmallBottom: 0,
      scrollTop: 0,
      categoryList: [],
      clickCategoryNm: '',
      categoryExtendData: {},
      isClassName: '',
      isClassName2: '',
      mainTitle: '',
      subTitle: '',
      imgTitle: ''
    }
  },
  computed: {
    getId () {
      let result = ''
      if (this.$el.parentNode !== null) {
        result = this.$el.parentNode.id
      }
      return result
    },
    ...mapGetters('home', [
      'getDisplayName'
    ])
  },
  mounted () {
    // 스크롤시 상단고정 테마매장 노출
    window.addEventListener('scroll', () => {
      this.scrollTop = document.querySelector('html').scrollTop
      if (!isNull(document.querySelector(`.category_small_${this.getId}`))) {
        this.categorySmallBottom = window.pageYOffset + document.querySelector(`.category_small_${this.getId}`).getBoundingClientRect().bottom - 96
      }

      if (!isNull(document.querySelector(`.category_box_${this.getId}`))) {
        if (this.scrollTop < this.categorySmallBottom) {
          let addHideFlg = true
          for (let i = 0; i < document.querySelector(`.category_box_${this.getId}`).classList.length; i++) {
            if (document.querySelector(`.category_box_${this.getId}`).classList[i] === 'active') {
              addHideFlg = false
            }
          }

          if (addHideFlg) {
            document.querySelector(`.category_box_${this.getId}`).classList.add('hide')
          }
        } else {
          document.querySelector(`.category_box_${this.getId}`).classList.remove('hide')
        }
      }
    })

    this.espotDraw()
  },
  updated () {
    this.scrollTop = document.querySelector('html').scrollTop
    if (!isNull(document.querySelector(`.category_small_${this.getId}`))) {
      this.categorySmallBottom = window.pageYOffset + document.querySelector(`.category_small_${this.getId}`).getBoundingClientRect().bottom - 96
    }
  },
  methods: {
    isNull,
    htmlDecode,
    /**
     * 상단고정 테마매장 토글
     * @param {object} event
     */
    onCollapseCategory (event) {
      uiUtil.toggleScroll()
      event.srcElement.parentElement.classList.toggle('active')
      document.querySelector('.dimmed_all').classList.toggle('active')
      document.querySelector('.navigation').style.zIndex = 80
      document.querySelector('.tv_live_box').style.zIndex = 80
    },
    /**
     * dimmed 클릭시 상단고정 테마매장 닫기
     */
    categoryClose () {
      uiUtil.enableScroll()
      document.querySelectorAll(`.category_box_${this.getId}`).forEach(element => {
        element.classList.remove('active')
      })
      document.querySelector('.dimmed_all').classList.remove('active')
      document.querySelector('.navigation').style.zIndex = 270
      document.querySelector('.tv_live_box').style.zIndex = 300
    },
    /**
     * espot 그리기
     */
    espotDraw () {
      this.categoryList = this.espotData[this.getId]
      this.categoryExtendData = this.espotExtendData[this.getId]

      this.mainTitle = isNull(this.categoryExtendData.titleContent) ? '' : this.categoryExtendData.titleContent.mainTitle
      this.subTitle = isNull(this.categoryExtendData.titleContent) ? '' : this.categoryExtendData.titleContent.subTitle
      this.imgTitle = isNull(this.categoryExtendData.titleContent) ? '' : this.categoryExtendData.titleContent.imgUrl

      if (isNull(this.categoryExtendData.css)) {
        this.isClassName = `category_small category_small_${this.getId}`
      } else {
        if (this.categoryExtendData.css.columnStyle === 'GRID2W') {
          this.isClassName = `category_small category_small_${this.getId}`
        } else {
          this.isClassName = `category_small category_small_${this.getId} three`
        }
      }
      this.isClassName2 = `category_box category_box_${this.getId} hide`

      if (isNull(this.slotGlobalVal.themaCategoryId)) {
        this.slotGlobalVal.themaCategoryId = this.slotGlobalVal.subCategoryId === 'N' ? '' : this.slotGlobalVal.subCategoryId
      } else {
        this.slotGlobalVal.themaCategoryId = this.slotGlobalVal.continueEspotId.split('_')[0]
      }

      this.clickCategoryNm = this.slotGlobalVal.clickThemaCategoryNm[this.getId]
      this.slotGlobalVal.clickThemaCategoryName = this.clickCategoryNm
    },
    /**
     * 메뉴 클릭 시
     * @param {Number} categoryIdx
     * @param {String} categoryName
     */
    clickClassActive (categoryIdx, categoryName) {
      this.slotGlobalVal.clickThemaCategoryName = categoryName

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: `MOBILE_${this.getDisplayName}`,
          eventAction: `${this.getDisplayName}_카테고리명`,
          eventLabel: `${this.getDisplayName}_${categoryName}`,
          params: {
            t1: null
          }
        }
      })
      this.slotGlobalVal.listPageIdx = 1
      this.updateActiveSubcategory(categoryIdx)
      this.replaceSlot(categoryIdx)
      uiUtil.enableScroll()

      setTimeout(() => {
        const categorySmallTop = document.querySelector(`.category_small_${this.getId}`).getBoundingClientRect().top
        const headerHeight = isNull(document.querySelector('.app_category')) ? document.querySelector('.app_header').getBoundingClientRect().height : document.querySelector('.app_category').getBoundingClientRect().height
        window.scrollTo(0, Math.round(window.pageYOffset + categorySmallTop - headerHeight))

        setTimeout(() => {
          let hideFlg = false
          for (let i = 0; i < document.querySelector('#app').classList.length; i++) {
            if (document.querySelector('#app').classList[i] === 'hide') {
              hideFlg = true
            }
          }

          if (!hideFlg) {
            document.querySelector('#app').classList.add('hide')
          }
        }, 10)

        setTimeout(() => {
          const categoryBoxAll = document.querySelectorAll('.category_box')
          for (let i = 0; i < categoryBoxAll.length; i++) {
            if (categoryBoxAll[i].classList.value.indexOf('hide') === -1) {
              const sectionName = categoryBoxAll[i].classList[1]
              document.querySelector(`.${sectionName}`).classList.value = `category_box ${sectionName} hide`
              this.categoryClose()
            }
          }

          const themaCateSlideAll = document.querySelectorAll('.thema_cate_slide')
          for (let i = 0; i < themaCateSlideAll.length; i++) {
            if (themaCateSlideAll[i].classList.value.indexOf('hide') === -1) {
              const sectionName = themaCateSlideAll[i].classList.value.substr(themaCateSlideAll[i].classList.value.indexOf('SLOT'), themaCateSlideAll[i].classList.value.length)
              document.querySelector(`.thema_cate_slide_${sectionName}2`).classList.value = `thema_cate_slide thema_cate_slide_${sectionName}2 fixed hide`
            }
          }
        }, 500)
      }, 500)
    },
    /**
     * 클릭seq 변경
     * @param {Number} categoryIdx
     */
    updateActiveSubcategory (categoryIdx) {
      this.slotGlobalVal.clickThemaSeq[this.getId] = this.categoryList[categoryIdx].seq
      this.slotGlobalVal.clickThemaCategoryNm[this.getId] = this.categoryList[categoryIdx].categoryName

      if (isNull(this.slotGlobalVal.clickThemaCategoryNm[this.getId])) {
        this.clickCategoryNm = this.categoryList[0].categoryName
      } else {
        this.clickCategoryNm = this.slotGlobalVal.clickThemaCategoryNm[this.getId]
      }
    },
    /**
     * callNSMobileGetEspotData 부모함수 호출
     * @param {Number} categoryIdx
     */
    replaceSlot (categoryIdx) {
      this.slotGlobalVal.param = {
        categoryDiv: 'thema',
        clickSlotId: this.getId,
        catalogId: this.categoryList[categoryIdx].catalogId,
        categoryId: this.categoryList[categoryIdx].categoryId,
        categoryLevel: this.categoryList[categoryIdx].categoryLevel,
        categoryName: this.categoryList[categoryIdx].categoryName,
        espotId: this.categoryList[categoryIdx].espotId,
        imgUrl: this.categoryList[categoryIdx].imgUrl,
        subSeq: this.slotGlobalVal.subcateSeq,
        themaSeq: this.categoryList[categoryIdx].seq,
        subCategoryName: this.slotGlobalVal.subcateName
      }
      this.$emit('callNSMobileGetEspotData', 'thema', this.getId)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/store/slot/cate/Themacate";
</style>
