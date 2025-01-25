<script setup lang="ts">
useHead({ titleTemplate: pageTitle => (pageTitle ? `${pageTitle} | TennisHistory` : "TennisHistory") })
</script>

<template>
  <u-app
    :tooltip="{ delayDuration: 100 }"
    :toaster="{ position: 'top-center' }"
  >
    <nuxt-loading-indicator color="repeating-linear-gradient(to right,#c4b5fd 0%,#8b5cf6 50%,#6d28d9 100%)" />
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </u-app>
</template>

<style>
.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

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
