<template>
  <div class="chat_counseling_main">
    <div class="tabs">
      <router-link
        v-for="(category, index) in categories"
        :key="index"
        tag="a"
        :to="category.path"
        class="tab"
        exact-active-class="active"
        event=""
        @click.native.prevent="goCategoryPath(category.path)"
      >
        <span>
          {{ category.displayName }}
        </span>
      </router-link>
    </div>
    <div class="tab_content">
      <chat-counseling-request v-if="$route.name === 'chatCounselingRequest'" />
      <chat-counseling-history v-if="$route.name === 'chatCounselingHistory'" />
    </div>
  </div>
</template>

<script>
import ChatCounselingRequest from '@/views/custcenter/ChatCounselingRequest'
import ChatCounselingHistory from '@/views/custcenter/ChatCounselingHistory'

export default {
  name: 'ChatCounselingMain',
  components: {
    ChatCounselingRequest,
    ChatCounselingHistory
  },
  data () {
    return {
      categories: [ // 채팅상담 카테고리
        {
          path: {
            name: 'chatCounselingRequest'
          },
          displayName: '채팅상담'
        },
        {
          path: {
            name: 'chatCounselingHistory'
          },
          displayName: '상담내역'
        }
      ]
    }
  },
  /**
   * 하림특가매장 클릭
   * @param {String} path - 경로
   */
  methods: {
    goCategoryPath (path) {
      this.$router.replace(path).catch(() => {
        // 같은 경로 이동 오류 방어
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/custcenter/ChatCounselingMain";
</style>
