<template>
  <div>
    <h1>박준배 이거저거 테스트</h1>
    <br>
    <br>
    {{ insertCommas('123123123123') }}
    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    <div v-if="isShow">
      숨겨진콘텐츠
    </div>
    <br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    <div id="tt" @click="clickEvent">
      이거가 화면에 보여지면 숨겨진콘텐츠가 보임
    </div>
    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
  </div>
</template>

<script>
import popupUtil from '@frameworks/popupUtil'
import {
  insertCommas
} from '@utils/commonutil/commonUtil'

export default {
  components: {
  },
  data () {
    return {
      para: 'tt',
      isShow: false
    }
  },
  created () {
    // 쿼리 전달된거 꺼내 쓰기
    console.log('create ====')
    insertCommas('123123123123')
  },
  mounted () {
    /*
    console.log('mounted ====')
    console.log(this.para)
    const rt = this.para
    const is = this.isShow
    const scrollEventFunction = function (e) {
      // console.log(e)
      console.log(this)
      console.log(this.para)
      console.log(rt)

      const tt = document.querySelector('#tt')
      console.log(tt, tt.offsetTop)
      const objDiv = document.getElementById('tt')
      // console.log('objDiv.scrollTop, objDiv.scrollHeight : ', objDiv.scrollTop, objDiv.scrollHeight)
      // console.log('objDiv.offsetTop,window.pageYOffset : ', objDiv.offsetTop, window.pageYOffset)
      // console.log('document.documentElement.scrollTop, document.documentElement.scrollHeight : ', document.documentElement.scrollTop, document.documentElement.scrollHeight)
      // console.log('window.innerWidth, window.innerHeight : ', window.innerWidth, window.innerHeight)
      // console.log('(window.innerHeight + document.documentElement.scrollTop), document.documentElement.scrollHeight : ', (window.innerHeight + document.documentElement.scrollTop), document.documentElement.scrollHeight)

      const objPosition = objDiv.offsetTop - window.innerHeight
      // console.log(objPosition, document.documentElement.scrollTop)
      if (objPosition < document.documentElement.scrollTop && !is) {
        console.log('목표 보임')
        is = true
      }
    }
 */
    // window.addEventListener('scroll', scrollEventFunction)

    window.addEventListener('scroll', this.scrollEvent)
  },
  updated () {
    console.log('updated ====')
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollEvent)
  },
  methods: {
    insertCommas,
    getAddress (addressInfo) {
      console.log('testpak addressInfo : ', addressInfo)
    },
    scrollEvent () {
      // console.log(this.$el)

      // const tt = document.querySelector('#tt')
      // console.log(tt)

      const objDiv = document.getElementById('tt')
      // console.log(objDiv)
      const objPosition = objDiv.offsetTop - window.innerHeight

      // console.log(objPosition, document.documentElement.scrollTop)
      if (objPosition < document.documentElement.scrollTop && !this.isShow) {
        console.log('목표 보임')
        this.isShow = true
      }

      console.log(objPosition, document.documentElement.scrollTop, this.isShow)
      if (objPosition > document.documentElement.scrollTop) {
        console.log('목표 숨김')
        this.isShow = false
      }
    },
    clickEvent (e) {
      // console.log(e)
      // console.log(this.$el)
      console.log(this.$el.getElementById('tt'))
    },
    schAddr () {
      const callback = result => {
        console.log(result)
      }
      popupUtil.show('common/SearchAddress', { title: '주소찾기' }, callback)
    }
  }
}
</script>
