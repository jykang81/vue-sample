<template>
  <div>
    <h1 ref="target" style="height: 100vh">
      infinite scroll
    </h1>
    <template v-for="(item, index) in list">
      <ol :key="index" style="margin: 5px">
        <li>
          {{ item.name }}
        </li>
        <li>
          {{ item.age }}
        </li>
      </ol>
    </template>
  </div>
</template>

<script>
import uiUtil from '@utils/uiUtil'

export default {
  data () {
    return {
      object: {
        callback: this.loadMore
      },
      list: []
    }
  },
  mounted () {
    this.initParamObject()

    uiUtil.bindInfiniteScroll(this, this.object)
  },
  methods: {
    /**
     * 가상 데이터 추가 로드
     */
    loadMore () {
      const mockData = [
        {
          name: '이름: 손지성',
          age: '나이: 30'
        },
        {
          name: '이름: 박흥민',
          age: '나이: 31'
        },
        {
          name: '이름: 차상철',
          age: '나이: 32'
        },
        {
          name: '이름: 유천수',
          age: '나이: 33'
        }
      ]

      this.list = this.list.concat(mockData)
    },
    /**
     * 무한 스크롤용 객체 초기화
     */
    initParamObject () {
      this.object.callback = this.loadMore
      this.object.isEnable = true
      this.object.interval = 500
      // this.object.eventTarget = this.$refs.target
      this.object.triggerHeightPercent = 100
    }
  }
}
</script>

<style>
  body {
    height: 100vh;
  }
</style>
