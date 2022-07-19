<template>
  <ul
    ref="ul"
    class="scroll_picker"
    :style="{
      webkitTransition: `-webkit-transform ${transitionDuration / 1000 > 0.5 ? 0.5 : transitionDuration / 1000}s ease-out`,
      transition: `transform ${transitionDuration / 1000 > 0.5 ? 0.5 : transitionDuration / 1000}s ease-out`,
      webkitTransform: 'translate3d(0px, ' + currentTranslatedY + 'px, 0px)',
      transform: 'translate3d(0px, ' + currentTranslatedY + 'px, 0px)'
    }"
  >
    <li
      v-for="item in itemList"
      :key="item.id"
      v-touch:start="startHandler"
      :data-val="item.value"
      :class="item.selected ? 'selected' : ''"
    >
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>

<script>
const OPTION_HEIGHT = 48
const OPTION_HALF = OPTION_HEIGHT / 2
const OPTION_DOUBLE = OPTION_HEIGHT * 2
const OPTION_TRIPLE = OPTION_HEIGHT * 3

export default {
  name: 'ScrollPicker',
  props: {
    itemList: Array // item-list 캘린더 숫자 배열
  },
  data () {
    return {
      selectedIndex: 0, // 스크롤 선택 인덱스
      selectedValue: 1, // 스크롤 선택 값
      startPosY: 0, // 스크롤 시작 Y좌표
      currentPosY: 0, // 스크롤 현재 Y좌표
      startTime: 0, // 스크롤 시작 타임
      endTime: 0, // 스크롤 종료 타임
      lastTime: (new Date()).getTime(), // 스크롤 동작완료 시간
      transitionDuration: 0, // 스크롤 애니메이션 진행 속도
      lastPosY: 0, // 스크롤 최종 Y좌표
      lastV: 0, // 스크롤 최종값
      startTranslatedY: OPTION_HEIGHT, // 스크롤 시작 애니메이션 Y좌표
      currentTranslatedY: OPTION_HEIGHT, // 스크롤 현재 Y좌표
      isMouseDown: false, // 마우스 다운 여부
      totalHeight: OPTION_HEIGHT // 스크롤 모든 높이
    }
  },
  watch: {
    itemList: () => {
      this.totalHeight = this.itemList.length * OPTION_HEIGHT
    }
  },
  mounted () {
    this.initData()

    const canTouchable = 'ontouchstart' in window
    if (canTouchable) {
      this.bindTouchEvents()
    } else {
      this.bindMouseEvents()
    }
  },
  methods: {
    /**
     * 초기화
     */
    initData () {
      if (this.itemList.length > 0) {
        this.itemList.forEach((item, index) => {
          if (item.selected === true) {
            this.selectedValue = item.value
            this.selectedIndex = index
            return false
          }
          return true
        })
        this.startTranslatedY = OPTION_HEIGHT - (this.selectedIndex * OPTION_HEIGHT)
        this.currentTranslatedY = this.startTranslatedY
      } else {
        this.itemList = [{ value: 1, name: 'Please select..', selected: true }]
      }
      this.totalHeight = this.itemList.length * OPTION_HEIGHT
    },
    /**
     * 터치 이벤트 바인딩
     */
    bindTouchEvents () {
      const el = this.$refs.ul
      // bind events
      el.addEventListener('touchstart', e => {
        this.handleTouchStart(e)
      }, false)

      el.addEventListener('touchmove', e => {
        e.preventDefault() // prevent default scrolling event when touch moving
        this.lastV = (e.changedTouches[0].pageY - this.lastPosY) / ((new Date()).getTime() - this.lastTime)
        this.currentPosY = e.changedTouches[0].pageY
        this.currentTranslatedY = (this.startTranslatedY + this.currentPosY) - this.startPosY
        this.lastPosY = this.currentPosY
        this.lastTime = (new Date()).getTime()
      }, false)

      el.addEventListener('touchend', () => {
        this.moveProcess(50)
      }, false)
    },
    /**
     * 마우스 이벤트 바인딩
     */
    bindMouseEvents () {
      const el = this.$refs.ul

      const mouseDown = e => { // mouse down event
        this.isMouseDown = true
        this.startPosY = e.pageY
        this.currentPosY = this.startPosY
        this.startTime = (new Date()).getTime()
        this.startTranslatedY = this.currentTranslatedY
        el.addEventListener('mousemove', mouseMove)
        el.addEventListener('mouseup', mouseUp)
        el.addEventListener('mouseleave', mouseLeave)
        // console.log('mouseDown!');
      }

      const mouseMove = e => { // mouse move event
        if (this.isMouseDown) {
          e.preventDefault() // prevent default selecting event when mouse moving
          this.lastV = (e.pageY - this.lastPosY) / ((new Date()).getTime() - this.lastTime)
          this.currentPosY = e.pageY
          this.currentTranslatedY = (this.startTranslatedY + this.currentPosY) - this.startPosY
          this.lastPosY = this.currentPosY
          this.lastTime = (new Date()).getTime()
          this.haveClicked = false
        }
      }

      const mouseUp = () => { // mouse up event
        this.moveProcess(20)
        this.isMouseDown = false
        el.removeEventListener('mousemove', mouseMove)
        el.removeEventListener('mouseup', mouseUp)
        el.removeEventListener('mouseleave', mouseLeave)
      }

      const mouseLeave = () => { // mouse leave event
        if (this.isMouseDown) {
          mouseUp()
        }
      }
      const mouseWheel = e => { // mouse wheel event
        this.startTranslatedY = this.currentTranslatedY
        let currentTranslatedY = this.startTranslatedY + (e.deltaY * 0.5)
        const residue = currentTranslatedY % OPTION_HEIGHT
        if (Math.abs(residue) >= OPTION_HALF) {
          if (residue < 0) {
            currentTranslatedY += ((OPTION_HEIGHT + residue) * (-1))
          } else {
            currentTranslatedY += (OPTION_HEIGHT - residue)
          }
        } else {
          currentTranslatedY -= residue
        }
        if (currentTranslatedY >= OPTION_DOUBLE) {
          currentTranslatedY = OPTION_HEIGHT
        } else if (currentTranslatedY < (this.totalHeight - OPTION_TRIPLE) * (-1)) {
          currentTranslatedY = (this.totalHeight - OPTION_DOUBLE) * (-1)
        }
        this.transitionDuration = 0.2
        this.currentTranslatedY = currentTranslatedY
        const selectedIndex = Math.abs((currentTranslatedY - OPTION_HEIGHT) / (-1 * OPTION_HEIGHT))
        this.itemList[this.selectedIndex].selected = false
        this.selectedIndex = selectedIndex
        this.itemList[this.selectedIndex].selected = true
        this.selectedValue = this.itemList[this.selectedIndex].value
        this.startTranslatedY = 0
      }

      // bind events
      el.addEventListener('mousedown', mouseDown)
      el.addEventListener('wheel', mouseWheel)
    },
    /**
     * 마우스나 터치 이동 후 처리 로직
     * @param {Number} timeDifference 딜레이 타임
     */
    moveProcess (timeDifference) {
      if (timeDifference) {
        timeDifference = 50
      }
      this.endTime = (new Date()).getTime()

      if (Math.abs(this.currentPosY - this.startPosY) > 5 && this.endTime - this.startTime > timeDifference) {
        const v = this.lastV
        const s = v > 0 ? (0.5 * (v ** 2)) / 0.001 : (-0.5 * (v ** 2)) / 0.001
        const t = Math.abs(v) / 0.001

        let currentTranslatedY = this.currentTranslatedY
        currentTranslatedY += s
        const residue = currentTranslatedY % OPTION_HEIGHT
        if (Math.abs(residue) >= OPTION_HALF) {
          if (residue < 0) {
            currentTranslatedY += ((OPTION_HEIGHT + residue) * (-1))
          } else {
            currentTranslatedY += (OPTION_HEIGHT - residue)
          }
        } else {
          currentTranslatedY -= residue
        }
        if (currentTranslatedY >= OPTION_DOUBLE) {
          currentTranslatedY = OPTION_HEIGHT
        } else if (currentTranslatedY < (this.totalHeight - OPTION_TRIPLE) * (-1)) {
          currentTranslatedY = (this.totalHeight - OPTION_DOUBLE) * (-1)
        }
        const selectedIndex = Math.abs((currentTranslatedY - OPTION_HEIGHT) / (-OPTION_HEIGHT))
        this.transitionDuration = t
        this.currentTranslatedY = currentTranslatedY

        this.itemList[this.selectedIndex].selected = false
        this.selectedIndex = selectedIndex
        this.itemList[this.selectedIndex].selected = true
        this.selectedValue = this.itemList[this.selectedIndex].value
      }
      this.startPosY = 0
      this.currentPosY = 0
      this.startTranslatedY = 0
      this.startTime = 0
      this.endTime = 0
      this.lastPosY = 0
      this.lastV = 0
    },
    /**
     * iOS 대응용 touchstart 이벤트 처리 핸들러
     * @param {Event} event touchstart 이벤트
     */
    startHandler (event) {
      this.handleTouchStart(event)
    },
    /**
     * touchstart 이벤트 처리 핸들러
     * @param {Event} event touchstart 이벤트
     */
    handleTouchStart (event) {
      this.startPosY = event.changedTouches[0].pageY
      this.currentPosY = this.startPosY
      this.startTime = (new Date()).getTime()
      this.startTranslatedY = this.currentTranslatedY
      this.lastV = 0
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/common/ScrollPicker";
</style>
