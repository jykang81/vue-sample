<template>
  <div>
    <h1>주소찾기 샘플</h1>
    <br>
    <br>
    <button @click="schAddr">
      <span>주소찾기</span>
    </button>
    <br>
    <br>
    <button @click="schAddr2">
      <span>주소찾기</span>
    </button>
    <br>
    <br>
    <button @click="schAddr3">
      <span>주소찾기</span>
    </button>
    <br>
    <br>
    <button @click="schAddr4">
      <span>주소찾기</span>
    </button>
    <br>
    <br>
    주소찾기 결과 : {{ resultAddress }}
    <br>
    <br>
  </div>
</template>

<script>
import popupUtil from '@frameworks/popupUtil'
import {
  showSafePostCodeWindows
} from '@utils/commonutil/commonUtil'

export default {
  components: {
  },
  data () {
    return {
      resultAddress: {}
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
  },
  updated () {
  },
  methods: {
    schAddr () {
      const callback = result => {
        console.log(result)
        this.resultAddress = result
      }
      popupUtil.show('common/SearchAddress', { title: '주소찾기', is1Dept: true }, callback)
    },
    schAddr2 () {
      const callback = result => {
        console.log(result)
        this.resultAddress = result
      }
      showSafePostCodeWindows(callback)
    },
    schAddr3 () {
      const callback = result => {
        console.log(result)
        this.resultAddress = result
      }
      showSafePostCodeWindows(callback, true)
    },
    schAddr4 () {
      const callback = result => {
        console.log(result)
        this.resultAddress = result
      }
      showSafePostCodeWindows(callback, false, '주소찾기', true)
    }
  }
}
</script>
