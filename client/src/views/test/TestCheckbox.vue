<template>
  <div>
    <h1>체크박스 샘플</h1>
    <br>
    <br>
    <h2>data 기반 체크박스 관리 & data 기반 inline css binding</h2>
    <input
      id="checkemployee"
      v-model="checkemployeeChecked"
      type="checkbox"
      style="width: 30px; height: 30px;"
    >
    <label for="checkemployee">임직원 할인여부</label>
    <div :style="checkemployeeChecked ? employeeStyledObj : ''">
      {{ checkemployeeChecked ? '임직원 할인가 적용됩니다' : '임직원이 아닙니다' }}
    </div>

    <br>
    <br>
    <h2>체크박스 데이터로 체크박스 외부제어</h2>
    <br>
    <input
      id="jack"
      v-model="checkedNames1"
      type="checkbox"
      value="Jack"
    >
    <label for="jack">Jack</label>
    <input
      id="john"
      v-model="checkedNames1"
      type="checkbox"
      value="John"
    >
    <label for="john">John</label>
    <input
      id="mike"
      v-model="checkedNames1"
      type="checkbox"
      value="Mike"
    >
    <label for="mike">Mike</label>

    <br>
    <span>체크한 이름: {{ checkedNames1 }}</span>

    <br>
    <h2>체크박스 전체 자동체크</h2>

    <br>
    <input
      id="checkAll"
      v-model="isCheckedNames2checkAll"
      type="checkbox"
      @click="checkedNames2CheckAll"
    ><label for="checkAll">전체 체크</label>
    <div
      v-for="user in users"
      :key="user.id"
    >
      <input
        :id="user.id"
        v-model="checkedNames2"
        type="checkbox"
        :value="user.name"
      >
      <label :for="user.id">{{ user.name }}</label>
    </div>
    <span>체크한 이름: {{ checkedNames2 }}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      checkemployeeChecked: false,
      employeeStyledObj: {
        color: 'blue',
        'font-weight': 800
      },
      users: [
        {
          id: '1',
          name: 'Shad Jast',
          email: 'pfeffer.matt@yahoo.com'
        },
        {
          id: '2',
          name: 'Duane Metz',
          email: 'mohammad.ferry@yahoo.com'
        },
        {
          id: '3',
          name: 'Myah Kris',
          email: 'evolkman@hotmail.com'
        },
        {
          id: '4',
          name: 'Dr. Kamron Wunsch',
          email: 'lenora95@leannon.com'
        }
      ],
      checkedNames1: [],
      checkedNames2: [],
      isCheckedNames2checkAll: false
    }
  },
  methods: {
    checkedNames2CheckAll () {
      this.checkedNames2checkAll = !this.checkedNames2checkAll
      this.checkedNames2 = []
      if (this.checkedNames2checkAll) { // Check all
        // 아래 3개가 전부 동일 기능
        /*
        for (let i = 0; i < this.users.length; i++) {
          this.checkedNames2.push(this.users[i].id)
        }
        for (let j in this.users) {
          this.checkedNames2.push(this.users[j].id)
        }
        */
        this.users.forEach(user => this.checkedNames2.push(user.name))
      }
    }
  }
}
</script>
