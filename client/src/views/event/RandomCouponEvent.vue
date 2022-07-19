<template>
  <div class="event_wrap" v-html="eventHtml" />
</template>

<script>
import COMMON_CONST from '@constants/common/common'
import {
  htmlDecode,
  isNull
} from '@utils/commonutil/commonUtil'
import bizUtil from '@utils/bizUtil'

export default {
  data () {
    return {
      // interval 함수 ID
      intervalId: null,
      // v-html에 추가될 HTML 코드
      eventHtml: ''
    }
  },
  watch: {
    /**
     * HTML이 변경될 경우 이미지 반복 기능을 다시 셋팅해준다
     * @returns {void}
     */
    eventHtml () {
      this.$nextTick(function () {
        // 이미지를 순차적으로 반복 노출 시켜주는 함수
        this.setRepeatImg()
      })
    }
  },
  created () {
    // rtnMsg
    // 축하합니다. 1,000원 쿠폰이 발급되었습니다.
    // 축하합니다. 500원 쿠폰이 발급되었습니다.
    // 축하합니다. 300원 쿠폰이 발급되었습니다.
    // 이벤트에 당첨되지 않았습니다. 다음기회에 다시 응모하세요.
    // 고객님은 이미 신청하셨습니다.&lt;br&gt;내일도 꼭 신청해주세요.

    // 이벤트 HTML 받아오기 API 호출
    this.getEventHtml()
  },
  mounted () {
    // 쇼핑히스토리 저장
    this.setShoppingHistory()
  },
  destroyed () {
    // interval 이벤트 종료
    clearTimeout(this.intervalId)
  },
  methods: {
    /**
     * 쇼핑히스토리 저장
     * @returns {void}
     */
    setShoppingHistory () {
      const historyObj = {
        pageParams: this.$route.params,
        offerIdfr: this.$route.params.offerId,
        offerNm: this.$route.meta.title,
        eventPageId: this.$route.name,
        hisGubun: COMMON_CONST.HISTORY_GUBUN.EVENT
      }
      bizUtil.setRecentlyViewedProducts(historyObj)
    },
    /**
     * 이벤트 HTML 받아오기 API 호출
     * @returns {void}
     */
    getEventHtml () {
      const param = {
        offerIdfr: this.$route.params.offerId,
        cmdType: 102,
        winConfirmYn: 'N'
      }

      const successHandling = response => {
        this.eventHtml = htmlDecode(response.msg.eventDetail.dweditcont)
      }

      this.$nsaxios.post('NSAjaxMTimesEventCmd', param, successHandling)
    },
    /**
     * 이미지를 순차적으로 반복 노출 시켜주는 함수
     * @returns {void}
     */
    setRepeatImg () {
      const randomImg = document.querySelector('#repeatImg') // 이미지를 노출할 부모 엘리먼트
      // 이미지를 반복할 영역이 있으면,
      if (!isNull(randomImg)) {
        const imgTotalCount = randomImg.childElementCount // 자식 엘리먼트의 이미지 개수
        let currentImgIdx = 0 // 노출할 자식 엘리먼트 인덱스

        // interval 이벤트 시작
        const intervalTime = 1000
        this.intervalId = setInterval(() => {
          // 이미지를 하나만 노출하고 나머지는 숨김
          for (let i = 0; i < imgTotalCount; i++) {
            randomImg.children[i].hidden = (i !== currentImgIdx)
          }
          // currentImgIdx를 0부터 이미지 수 만큼 반복시킴
          currentImgIdx = (currentImgIdx + 1) % imgTotalCount
        }, intervalTime)
      }
    }
  }
}
</script>
