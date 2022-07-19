<template>
  <div>
    컴포넌트간 데이터 전달 테스트 - 서브 컴포넌트1(TestData.vue가 호출)
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
    <button @click="callParent">
      부모펑션호출
    </button>
    <br>
  </div>
</template>

<script>
export default {
  props: {
    // 컴포넌트 String parameter
    propComponentName: {
      type: String,
      required: true
    },
    // 컴포넌트 Object parameter
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
    // 콘솔에 호출된 거 모니터링 용
    console.log('create ====')
    console.log('propComponentName : ', this.propComponentName)
    console.log('propParameter : ', this.propParameter)
    console.log('propParameter.param4() : ', this.propParameter.param4())
  },
  updated () {
    // 콘솔에 호출된 거 모니터링 용
    console.log('updated ====')
    console.log('propComponentName : ', this.propComponentName)
    console.log('propParameter : ', this.propParameter)
    console.log('propParameter.param4() : ', this.propParameter.param4())
  },
  methods: {
    // 파라메터 변경확인을 위해
    changeProp () {
      this.propParameter.param1 = 'tttt1'
    },
    // 부모콜백 함수
    callParent () {
      const result = '자식의실행결과'
      this.$emit('close', result)
    }
  }
}
</script>
