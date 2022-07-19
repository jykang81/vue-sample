<template>
  <div v-if="show" class="popup_container">
    <div
      class="dimmed_all"
      @click="$emit('close')"
      @mousewheel="$emit('close')"
      @touchmove="$emit('close')"
    />
    <div
      class="popup"
      @mousewheel="$emit('close')"
      @touchmove="$emit('close')"
    >
      <div class="contents tooltip">
        <p v-if="$slots.title" class="title">
          <slot name="title" />
        </p>
        <div class="content">
          <slot name="content" />
        </div>
      </div>
      <div class="button">
        <button type="button" class="btn close" @click="$emit('close')">
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    }
  }
}
</script>
