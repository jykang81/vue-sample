<template>
  <div v-if="$store.state.preLoader.isShow" class="pre_loader">
    <div v-if="$store.state.preLoader.isBlocked" class="pre_loader_background" />
    <div class="pre_loader_blade" />
    <div class="pre_loader_blade" />
    <div class="pre_loader_blade" />
    <div class="pre_loader_blade" />
    <div class="pre_loader_blade" />
    <div class="pre_loader_blade" />
    <div class="pre_loader_blade" />
    <div class="pre_loader_blade" />
    <div class="pre_loader_blade" />
    <div class="pre_loader_blade" />
    <div class="pre_loader_blade" />
    <div class="pre_loader_blade" />
  </div>
</template>

<style lang="scss">
  @import "~@/assets/styles/components/frameworks/PreLoader";
</style>
