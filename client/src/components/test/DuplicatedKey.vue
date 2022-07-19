<template>
  <div>
    <h1>v-for key 예제</h1>
    <pre>
      v-for 구문에서 같은 부모를 둔 자식 엘리먼트는 <strong>고유한 키 값</strong>을 바인딩해야합니다.
      중복된 키는 렌더링 또는 업데이트 시에 에러를 야기할 수 있습니다.
      또한 key 값은 number 또는 string 타입이어야 합니다.

      예시1) 조합형 키
      &lt;ul&gt;
          &lt;li v-for="(fruit, index) in fruits" :key="`fruit-${index}`">&lt;/li&gt;
      &lt;/ul&gt;

      예시2) 고유 키
      &lt;ul&gt;
          &lt;li v-for="{name, price, id} in fruits" :key="id">&lt;/li&gt;
      &lt;/ul&gt;
    </pre>

    <h2 class="duplicated">
      Bad Case
      중복 key 사용
    </h2>
    <ul>
      <li
        v-for="(fruit, index) in fruits"
        :key="index"
        class="duplicated"
      >
        {{ fruit.name }}
        {{ 'key: ' + index }}
      </li>
      <li
        v-for="(beverage, index) in beverages"
        :key="index"
        class="duplicated"
      >
        {{ beverage.name }}
        {{ 'key: ' + index }}
      </li>
    </ul>

    <h2 class="good">
      good case
      고유 key 사용
    </h2>
    <ul>
      <li
        v-for="{name, id} in fruits"
        :key="id"
        class="good"
      >
        {{ name }}
        {{ 'key: ' + id }}
      </li>
      <li
        v-for="{name, id} in beverages"
        :key="id"
        class="good"
      >
        {{ name }}
        {{ 'key: ' + id }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fruits: [
        {
          name: '망고',
          id: 'f-001'
        },
        {
          name: '딸기',
          id: 'f-002'
        },
        {
          name: '바나나',
          id: 'f-003'
        }
      ],
      beverages: [
        {
          name: '쌍화차',
          id: 'b-001'
        },
        {
          name: '아메리카노',
          id: 'b-002'
        },
        {
          name: '주스',
          id: 'b-003'
        }
      ]
    }
  }
}
</script>

<style>
.duplicated {
  color: red;
}

.good {
  font-weight: bold;
}

button {
  display: block;
}

</style>
