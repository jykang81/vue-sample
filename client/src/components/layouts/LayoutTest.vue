<template>
  <div>
    <router-link
      id="a-test-home"
      to="/test"
    >
      테스트 홈 (pageTitle :  {{ pageTitle }})
    </router-link>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'LayoutTest',
  components: {
  },
  data () {
    return {
      pageTitle: ''
    }
  },
  watch: {
    '$route' (to, from) {
      // console.log(to, from)
      if (to.meta !== null) {
        // console.log(to.meta.title)
        this.pageTitle = to.meta.title
      }
    }
  },
  created () {
    if (this.$route.meta !== null) {
      this.pageTitle = this.$route.meta.title
    }
  }
/*
  beforeRouteEnter (to, from, next) {
    console.log(to, from)
    next(vm => {
      if (to.meta !== null) {
        vm.pageTitle = to.meta.title
      }
    })
  }
 */
}
</script>

<style lang="scss">
  #a-test-home {
    display: block;
    text-align: center;
    margin: 10px
  }

  /deep/ input[type="checkbox"] {
    width: 20px;
    height: 20px;
    border: 1px solid gray;

    &:checked {
      background: red;
    }
  }
</style>
