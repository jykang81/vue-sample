<template>
  <div class="cust_center_home">
    <div class="search_wrap">
      <router-link to="/custcenter/faq/search" class="search_input" @click.native="searchInputLogging">
        <span>궁금하신 사항을 입력해주세요</span>
      </router-link>
    </div>
    <ul class="faq_categoies">
      <li
        v-for="cate in categoies"
        :key="cate.id"
      >
        <router-link
          :to="{ path: '/custcenter/faq', query: { id: cate.id }}"
          class="btn"
          @click.native="categoryClickLogging(cate.name)"
        >
          {{ cate.name }}
        </router-link>
      </li>
    </ul>
    <h3 class="subject">
      도움이 필요하신가요?
    </h3>
    <div class="btn_group">
      <a
        class="btn_link"
        @click="moveChatCounseling"
      >
        <span>채팅상담/내역</span>
      </a>
      <router-link to="/custcenter/board-inquiry/inquire" class="btn_link" @click.native="inquiryClickLogging">
        <span>1:1 문의하기</span>
      </router-link>
    </div>
    <div class="center_guide">
      <span class="guide_inner">
        <a href="tel:1800-0770" @click="telClickLogging">
          전화상담 1800-0770
        </a>
        <p class="time">
          운영시간 : 평일 09:00 ~ 18:00
        </p>
      </span>
    </div>
  </div>
</template>

<script>
import {
  getNowTime
} from '@frameworks/dateutil/dateUtil'
import messageUtil from '@frameworks/messageUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  data () {
    return {
      categoies: [
        { id: '01', name: '교환/반품/AS' },
        { id: '02', name: '주문/취소/변경' },
        { id: '03', name: '결제/환불' },
        { id: '05', name: '적립금/톨' },
        { id: '09', name: '회원가입/수정/탈퇴' }
      ]
    }
  },
  methods: {
    /**
     * 검색 input 클릭
     */
    searchInputLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_고객센터',
          eventAction: '검색',
          eventLabel: '홈_검색',
          params: {
            t1: null
          }
        }
      })
    },

    /**
     * 카테고리 버튼 클릭
     * @param {String} cateName 카테고리이름
     */
    categoryClickLogging (cateName) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_고객센터',
          eventAction: 'FAQ_카테고리',
          eventLabel: `홈_${cateName}`,
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 채팅상담 페이지로 이동
     */
    moveChatCounseling () {
      const nowTime = parseInt(getNowTime(), 10)

      if (nowTime < 90000 || nowTime > 180000) {
        messageUtil.confirm('채팅상담 가능시간은 09:00~18:00입니다. \n1:1 문의를 이용하시겠습니까?', () => {
          this.$router.push('/custcenter/board-inquiry/inquire')
        })
      } else {
        this.$router.push({ name: 'chatCounselingRequest' })
      }
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_고객센터',
          eventAction: '채팅상담/내역',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 1:1문의하기 클릭
     */
    inquiryClickLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_고객센터',
          eventAction: '1:1문의하기',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 전화상담 클릭
     */
    telClickLogging () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_고객센터',
          eventAction: '전화상담',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/custcenter/CustCenterHome";
</style>
