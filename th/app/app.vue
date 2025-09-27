<script setup lang="ts">
useHead({
  titleTemplate: title => `${title} | TennisHistory`,
  htmlAttrs: { class: "scroll-smooth" }
})
</script>

<template>
  <u-app
    :tooltip="{ delayDuration: 100 }"
    :toaster="{ position: 'bottom-center' }"
  >
    <nuxt-loading-indicator color="repeating-linear-gradient(to right,#ddd6fe 0%,#8b5cf6 50%,#5b21b6 100%)" />

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
