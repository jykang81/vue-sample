<template>
  <div>
    컴포넌트간 데이터 전달 테스트 - 서브 컴포넌트2(TestData.vue가 호출)
    <br>
    파라메터 출력을 화면에 넣은 이유 : 화면이 바뀌지 않으면 updated가 호출 되지 않음
    <br>
    parameter String: {{ propComponentName }}
    <br>
    parameter Object: {{ propParameter }}

    <br>
    <button @click="changeProp">
      자식 데이터변경 - Object
    </button>
    <br>
    <button @click="changeProp2">
      자식 데이터변경 - String
    </button>
    <br>
  </div>
</template>

<script>
export default {
  props: {
    propComponentName: {
      type: String,
      required: true
    },
    propParameter: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
    console.log('create ====')
    console.log('propComponentName : ', this.propComponentName)
    console.log('propParameter : ', this.propParameter)
    console.log('propParameter.param4() : ', this.propParameter.param4())
  },
  updated () {
    console.log('updated ====')
    console.log('propComponentName : ', this.propComponentName)
    console.log('propParameter : ', this.propParameter)
    console.log('propParameter.param4() : ', this.propParameter.param4())
  },
  methods: {
    changeProp () {
      this.propParameter.param1 = 'tttt2'
    },
    changeProp2 () {
      // object 타입의 파라메터가 아닌 다른 파라메터는 자식에서 수정 불가
      this.propComponentName = 'tttt2'
    }
  }
}
</script>
