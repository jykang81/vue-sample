<template>
  <div>
    <button
      class="btn"
      @click="bindInnerIO"
    >
      내부 영역 이벤트 바인딩
    </button>
    <button
      class="btn"
      @click="unbindInnerIO"
    >
      내부 영역 이벤트 언바인딩
    </button>
    <div id="innerScrollArea" ref="innerScrollArea">
      <p
        v-for="(item, idx) in items"
        :key="idx"
      >
        {{ item }}
      </p>
      <div ref="helper" />
    </div>
    <div
      id="items"
    >
      <p
        v-for="(item, idx) in items"
        :key="idx"
      >
        {{ item }}
      </p>
    </div>
  </div>
</template>

<script>
import uiUtil from '@utils/uiUtil'

export default {
  data () {
    return {
      items: [],
      outerParam: {
        callback: this.loadItems
      },
      innerParam: {
        callback: this.loadItems,
        conditionCallback: this.checkLoadable
      },
      ioInner: null,
      ioOuter: null,
      isProgress: false
    }
  },
  mounted () {
    this.loadItems()
    this.ioOuter = uiUtil.setInfiniteScroll(this, this.outerParam)
  },
  methods: {
    /**
     * 아이템 조회
     */
    async loadItems () {
      console.log('스크롤..')
      const count = 20
      const itemCount = this.items.length
      const toBeItemCount = this.items.length + count

      /** 중복 호출 방지 */
      if (this.isProgress) {
        return
      }

      /** 호출 금지 상태 */
      this.isProgress = true

      /** 비동기 통신 mocking */
      const networkLatency = 500
      await new Promise(resolve => setTimeout(resolve, networkLatency))

      for (let index = itemCount; index < toBeItemCount; index++) {
        const itemText = `#${index + 1}`
        this.items.push(itemText)
      }

      /** 호출 허용 상태 */
      this.isProgress = false
    },
    /**
     * 아이템 초과 적재 방지용 함수
     *
     */
    checkLoadable () {
      if (this.items.length === 200) {
        console.log('200개 초과 로드 방지')

        return false
      }

      return true
    },
    /**
     * 내부영역 intersection observer 매개변수 객체 초기화
     */
    setInnerParam () {
      this.innerParam.targetElement = this.$refs.helper // helper element 기준, 콜백 실행
    },
    /**
     * 내부영역 intersection observer 바인딩
     */
    bindInnerIO () {
      /** 중복 바인딩 방지 */
      if (this.ioInner) {
        return
      }

      this.setInnerParam()
      this.ioInner = uiUtil.setInfiniteScroll(this, this.innerParam)
    },
    /**
     * 내부영역 intersection observer 언바인딩
     */
    unbindInnerIO () {
      /** 언바인딩 오류 방지 */
      if (!this.ioInner) {
        return
      }

      this.ioInner.disconnect()

      this.ioInner = null
    }
  }
}
</script>

<style lang="scss">
#innerScrollArea {
  width: 40vw;
  margin: 20px auto;
  border: 1px solid red;
  max-height: 50vh;
  overflow: scroll;
}
</style>
