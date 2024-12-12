<script setup lang="ts">
import { RouterView } from 'vue-router'

// TODO: Light mode design
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header class="bg-violet-800 sticky top-0 z-50 w-full flex items-center" />
    <div class="flex-1 py-16 w-3/4 mx-auto">
      <RouterView :key="$route.fullPath" />
    </div>
    <ScrollTop />
    <Footer class="bg-violet-800 pt-5" />
  </div>
</template>