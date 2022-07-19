<template>
  <div>
    <tree-item
      v-for="(item, index) in treeData"
      :key="index"
      class="item"
      :item="item"
    />
  </div>
</template>

<script>
import TreeItem from '@/components/test/TreeItem'

export default {
  components: {
    TreeItem
  },
  data () {
    return {
      treeData: this.$router.options.routes
    }
  }
}
</script>

<style>

</style>
