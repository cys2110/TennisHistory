<script setup lang="ts">
useHead({
  titleTemplate: "%s %separator %subPage %separator TennisHistory",
  htmlAttrs: { class: "scroll-smooth" }
})
</script>

<template>
  <u-app
    :tooltip="{ delayDuration: 100 }"
    :toaster="{ position: 'top-center' }"
  >
    <nuxt-loading-indicator color="repeating-linear-gradient(to right,#99f6e4 0%,#14b8a6 50%,#0f766e 100%)" />
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </u-app>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
