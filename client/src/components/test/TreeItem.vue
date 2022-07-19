<template>
  <div>
    <div
      :class="{bold: isFolder}"
      @click="toggle"
    >
      <strong>{{ (item.path).startsWith('/') ? item.path : '/' + item.path }}</strong><br>{{ item.meta }}
      <span v-if="isFolder"> [{{ isOpen ? '-' : '+' }}] </span>
    </div>
    <div v-show="isOpen" v-if="isFolder">
      <tree-item
        v-for="(child, index) in item.children"
        :key="index"
        class="item"
        :item="child"
        @make-folder="$emit('make-folder', $event)"
        @add-item="$emit('add-item', $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isOpen: true
    }
  },
  computed: {
    isFolder () {
      return this.item.children && this.item.children.length
    }
  },
  methods: {
    toggle () {
      if (this.isFolder) {
        this.isOpen = !this.isOpen
      }
    }
  }
}
</script>

<style scoped>
  .item {
    list-style: none;
    padding: 0px 0px 0px 50px;
    margin: 0px 0px 0px 20px;
    font-size: 15px;
    /* border: 1px solid gray; */
  }
</style>
