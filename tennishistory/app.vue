<script setup lang="ts">
useHead({ titleTemplate: "%s %separator %subPage %separator TennisHistory", htmlAttrs: { class: "scroll-smooth" } })
</script>

<template>
  <u-app
    :tooltip="{ delayDuration: 100 }"
    :toaster="{ position: 'top-center' }"
  >
    <nuxt-loading-indicator color="repeating-linear-gradient(to right,#86efac 0%,#16a34a 50%,#14532d 100%)" />
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </u-app>
</template>

<style>
.layout-enter-active,
.layout-leave-active,
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
  transform: translateX(-100%);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
