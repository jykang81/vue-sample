<template>
  <div>
    컴포넌트간 데이터 전달 테스트 - 콘솔창 확인
    <br>

    파라메터 출력을 화면에 넣은 이유 : 화면이 바뀌지 않으면 updated가 호출 되지 않음
    <br>
    parameter String: {{ componentName }}
    <br>
    parameter Object: {{ parameters }}

    <br>
    <button @click="changeProp">
      부모 데이터변경 - Object, String
    </button>

    <br>
    <br>

    <TestData1
      :prop-component-name="componentName"
      :prop-parameter="parameters"
      @close="popClose"
    />

    <br>

    <TestData2
      :prop-component-name="componentName"
      :prop-parameter="parameters"
      @close="popClose"
    />
  </div>
</template>

<script>
import TestData1 from '@/views/test/TestData1'
import TestData2 from '@/views/test/TestData2'

export default {
  components: {
    TestData1,
    TestData2
  },
  data () {
    return {
      // 컴포넌트 String parameter
      componentName: 'componentName',
      // 컴포넌트 Object parameter
      parameters: {
        param1: 'param1',
        param2: 'param2',
        param3: 'param3',
        param4 () {
          console.log('call param4 : this.componentName : ', this.componentName)
        }
      }
    }
  },
  computed: {
  },
  created () {
  },
  updated () {
    // 콘솔에 호출된 거 모니터링 용
    console.log('parent updated ====')
    console.log('propParameter : ', this.parameters)
  },
  methods: {
    // callback 함수
    popClose (result) {
      console.log('popClose call callback : ', result)
    },
    // 바인딩된 변수 변경 테스트 함수
    changeProp () {
      this.componentName = 'rrrrr2'
      this.parameters.param1 = 'rrrrr2'
    }
  }
}
</script>
