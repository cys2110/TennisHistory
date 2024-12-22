<script setup lang="ts">
import { RouterView } from 'vue-router'

// TODO: Light mode design
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-100 dark:bg-zinc-900">
    <Header />
    <div class="flex-1 py-16 w-11/12 md:w-3/4 2xl:w-2/3 mx-auto ">
      <RouterView :key="$route.fullPath" />
    </div>
    <ScrollTop />
    <Footer class="bg-violet-800 pt-5" />
  </div>
</template>