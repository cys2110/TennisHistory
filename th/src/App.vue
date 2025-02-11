<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useHead } from '@unhead/vue'

useHead({
  titleTemplate: '%s %separator %page %separator TennisHistory',
  templateParams: { separator: '|', page: null },
})
</script>

<template>
  <div>
    <div class="fixed top-0 z-50 bg-violet-700 w-full p-5 text-slate-300">
      <div>TennisHistory</div>
    </div>
    <main class="mt-24 mx-5">
      <RouterView />
    </main>
  </div>
</template>
