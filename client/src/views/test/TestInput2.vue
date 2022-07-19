<template>
  <div>
    <h1>NS Input Test</h1>
    <br>
    <br>
    <pre>
    &lt;ns-input
      :params=""       //파라메터 객체 바인딩
      @input=""        //@는 지원이벤트
      @click=""
      @mouseover=""
      @mouseout=""
      @keypress=""
      @focus=""
      @blur=""
    /&gt;

    파라메터 객체 설정 값

    params1: {
      valeu='',         //binding 될 값 value
      iconClass='',     //Icon Class(ID : id , 이름 : user_name, ....)
      readonly='',      //readonly input의 배경색이 바뀌지 않음: true or false
      disabled='',      //disabled input의 배경색이 회색으로 변경: true or false
      maxlength=100,    //maxlength 최대 길이 Number타입 미사용 시 생략
      title='',         //타이틀 이름
      placeholder='',   //placeholder
      isLabel: true,    //라벨 사용여부  default true  : true or false
      labelKind='',     //라벨 종류  default label_icon  : label_icon or label_text
      isSuccess: false, //input box에 완료 체크 표시 default false  : true or false
      isError: false,   //에러났을때 default false  : true or false
      errorMessage: '', //에러메세지
      defaultKeyboard: 'korea' // 설정없으면 영문, korea설정시 한글 키보드
    }

    </pre>

    <br>
    <h2>샘플</h2>
    <br>
    <h4>기본형 모든 옵션 설정</h4>
    <br>
    <ns-input
      :params="params1"
      @click="processEvent"
      @keypress="processEvent"
      @mouseover="processEvent"
      @mouseout="processEvent"
      @focus="processEvent"
      @blur="processEvent"
    />
    <br>
    input 입력값 연동 : {{ params1.value }}
    <br>
    <br>
    <h4>라벨미사용</h4>
    <br>
    <ns-input
      :params="params2"
      @input="processEvent"
      @click="processEvent"
      @keypress="processEvent"
      @mouseover="processEvent"
      @mouseout="processEvent"
      @focus="processEvent"
      @blur="processEvent"
    />
    <br>
    input 입력값 연동 : {{ params2.value }}
    <br>
    <br>
    <br>
    <h4>라벨텍스트 타입</h4>
    <br>
    <ns-input
      :params="params3"
      @click="processEvent"
      @input="processEvent"
      @keypress="processEvent"
      @mouseover="processEvent"
      @mouseout="processEvent"
      @focus="processEvent"
      @blur="addCkeck"
    />
    <br>
    input 입력값 연동 : {{ params3.value }}
    <br>
    <br>
    <br>
    <h4>에러발생</h4>
    <br>
    <ns-input
      :params="params4"
      @blur="messageShow"
      @click="processEvent"
      @keypress="processEvent"
    />
    <br>
    input 입력값 연동 : {{ params4.value }}
    <br>
    <br>
    <br>
    <br>
    <h4>for문 사용해 반복 생성</h4>
    <br>
    <div v-for="(params,i) in arrParams" :key="i">
      <ns-input
        :params="params"
        @blur="messageShow"
        @click="processEvent"
        @keypress="processEvent"
      />
      <br>
      input 입력값 연동 :  {{ params }}
      <br>
      <br>
      <br>
    </div>

    <br>
    <br>
  </div>
</template>

<script>
import NsInput from '@components/common/NsInput'

export default {
  components: {
    NsInput
  },
  data () {
    return {
      params1: {
        value: '',
        iconClass: 'id',
        readonly: false,
        disabled: false,
        maxlength: 100,
        title: '',
        placeholder: '',
        isLabel: true,
        labelKind: 'label_icon',
        isSuccess: false,
        isError: false,
        errorMessage: '',
        type: 'text'
      },
      params2: {
        value: '',
        title: '이름',
        isLabel: false
      },
      params3: {
        value: '',
        iconClass: 'user_name',
        title: '이름',
        isLabel: true,
        labelKind: 'label_text',
        isSuccess: true
      },
      params4: {
        value: '',
        iconClass: 'user_name',
        title: '이름',
        isLabel: true,
        labelKind: 'label_icon',
        isError: false,
        errorMessage: ''
      },
      arrParams: []
    }
  },
  computed: {
  },
  created () {
    // 쿼리 전달된거 꺼내 쓰기
    console.log('create ====')

    this.arrParams.push({
      value: '',
      iconClass: 'id',
      readonly: false,
      disabled: false,
      maxlength: 100,
      title: '',
      placeholder: '',
      isLabel: true,
      labelKind: 'label_icon',
      isSuccess: false,
      isError: false,
      errorMessage: ''
    })
    this.arrParams.push({
      value: '',
      title: '이름',
      isLabel: false
    })
    this.arrParams.push({
      value: '',
      iconClass: 'user_name',
      title: '이름',
      isLabel: true,
      labelKind: 'label_text',
      isSuccess: true
    })
    this.arrParams.push({
      value: '',
      iconClass: 'user_name',
      title: '이름',
      isLabel: true,
      labelKind: 'label_icon',
      isError: false,
      errorMessage: ''
    })
    console.log(this.arrParams)
  },
  updated () {
  },
  methods: {
    processEvent (e) {
      // console.log('event : ', e)
      console.log(this.arrParams[3].value)
    },
    messageShow () {
      this.params4.isError = true
      this.params4.errorMessage = '입력 똑바로 하시오 !!'
    },
    clearCheck (e) {
    },
    addCkeck (e) {
      this.params3.isSuccess = true
    }
  }
}
</script>
