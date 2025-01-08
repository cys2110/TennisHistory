<script setup lang="ts">
//
</script>

<template>
  <div class="title q-mb-xl">
    <div class="row justify-between items-center">
      <div class="text-h3">
        <slot name="heading" />
      </div>
      <div class="text-h6">
        <slot name="subheading" />
      </div>
    </div>
    <div>
      <slot name="toolbar" />
    </div>
  </div>
</template>

<style scoped>
.title {
  margin-top: 15%;
}
</style>
