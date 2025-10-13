<script setup lang="ts">
useHead({
  titleTemplate: title => `${title} | TennisHistory`,
  htmlAttrs: { class: "scroll-smooth" }
})

const route = useRoute()
const { viewMode } = useViewMode()
provideSSRWidth(1024)

const layout = computed(() => {
  if (route.path.startsWith("/admin")) {
    return "layout-admin"
  }
  return get(viewMode)
})
</script>

<template>
  <u-app
    :tooltip="{ delayDuration: 100 }"
    :toaster="{ position: 'bottom-center' }"
  >
    <nuxt-loading-indicator color="repeating-linear-gradient(to right,#ddd6fe 0%,#8b5cf6 50%,#5b21b6 100%)" />

    <nuxt-layout :name="layout">
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
