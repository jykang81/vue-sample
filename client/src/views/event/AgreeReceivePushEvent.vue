<template>
  <div class="event">
    <div
      v-html="eventHtml"
    />
  </div>
</template>

<script>
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'

export default {
  data () {
    return {
      offerId: '',
      eventHtml: '' // v-html에 추가될 HTML 코드
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * 초기화
     * 페이지가 열릴때 기본적으로 실행되어야 할 작업들 정의
     */
    async init () {
      this.setRouteParams()
      this.setEventHtml(await this.getEventHtml())
    },
    /**
     * 이전 페이지에서 넘어온 파라미터들 세팅
     */
    setRouteParams () {
      this.offerId = this.$route.params.offerId
    },
    /**
     * 이벤트 HTML 받아오기 API 호출을 위한 파라미터
     * @returns {Object}
     */
    eventHtmlParams () {
      return {
        offerIdfr: this.offerId,
        cmdType: 102,
        winConfirmYn: 'N'
      }
    },
    /**
     * 이벤트 HTML 받아오기 API 호출
     * @returns { Object }
     */
    async getEventHtml () {
      return await this.$nsaxios.post('NSAjaxMTimesEventCmd', this.eventHtmlParams())
    },
    /**
     * 이벤트 HTML set
     * @param {Object} eventData 이벤트 데이터
     */
    setEventHtml (eventData) {
      this.eventHtml = htmlDecode(eventData.msg.eventDetail.dweditcont)
    }

  }
}

</script>

<style lang="scss">
  .event {
    padding: 1.6rem;

    img {
      width: 100%;
    }
  }

</style>
