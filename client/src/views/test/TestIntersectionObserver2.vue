<template>
  <div>
    <div
      v-for="(item, index) in arr"
      :key="item"
    >
      <div id="test" />
      <div
        ref="box"
        class="box1"
        :data-idx="index"
      >
        <div class="vertical">
          Welcome to <strong>The {{ item }} !</strong>
        </div>
      </div>
    </div>
    <div id="test" />
  </div>
</template>

<script>

export default {
  data () {
    return {
      arr: ['box1', 'box2', 'box3', 'box4', 'box5'],
      visiblePlayerList: new Set(),
      visiblePlayerIndex: 99
    }
  },
  mounted () {
    this.createObserver()
  },
  methods: {
    /**
     * IntersectionObserver를 생성한다
     * @returns {void}
     */
    createObserver () {
      const boxs = this.$refs.box

      const options = {
        root: null,
        rootMargin: '0px',
        threshold: this.buildThresholdList(),
        delay: 3000
      }

      const observer = new IntersectionObserver(this.handleIntersect, options)
      for (let i = 0; i < boxs.length; i++) {
        observer.observe(boxs[i])
      }
    },
    /**
     * Threshold 배열을 생성한다
     * @returns {Array} Threshold 리스트
     */
    buildThresholdList () {
      const thresholds = []
      const numSteps = 100

      for (let i = 1.0; i <= numSteps; i++) {
        const ratio = i / numSteps
        thresholds.push(ratio)
      }

      thresholds.push(0)
      return thresholds
    },
    /**
     * IntersectionObserver 핸들러
     * @returns {void}
     */
    handleIntersect (entries, observer) {
      const MAX_RATIO = 1
      entries.forEach(entry => {
        if (entry.intersectionRatio === MAX_RATIO) {
          const targetEntry = entry.target
          this.visiblePlayerList.add(targetEntry)
          this.handleIntersect2()
          targetEntry.style.backgroundColor = 'red'
        } else {
          const targetEntry = entry.target
          this.visiblePlayerList.delete(targetEntry)
          this.handleIntersect2()
          targetEntry.style.backgroundColor = 'blue'
        }
      })
    },

    handleIntersect2 () {
      let visiblePlayerIndex = this.visiblePlayerIndex
      // 현재 보이는 player가 1개면
      if (this.visiblePlayerList.size === 1) {
        // player를 대체해줌
        this.visiblePlayerList.forEach(function (value) {
          if (value.dataset.idx !== visiblePlayerIndex) {
            visiblePlayerIndex = value.dataset.idx
          }
        })
      // 현재 보이는 player가 1개보다 많으면
      } else if (this.visiblePlayerList.size > 1) {
        let min = visiblePlayerIndex
        // 가장 최상위의 player를 탐색
        this.visiblePlayerList.forEach(function (value) {
          if (value.dataset.idx < min) {
            min = value.dataset.idx
          }
        })
        visiblePlayerIndex = min
      }
      this.visiblePlayerIndex = visiblePlayerIndex
      // TODO: visiblePlayerIndex에 해당하는 플레이어를 실행하고 나머지는 멈춤
    }
  }
}
</script>

<style lang="scss">
  .box1 {
    background-color: rgba(40, 40, 190, 255);
    border: 4px solid rgb(20, 20, 120);
    transition: background-color 1s, border 1s;
    width: 350px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  #test {
    width: 350px;
    height: 200px;
  }

  .vertical {
    color: white;
     font: 32px;
  }

  .extra {
    width: 350px;
    height: 350px;
    margin-top: 10px;
    border: 4px solid rgb(20, 20, 120);
    text-align: center;
    padding: 20px;
  }
</style>
