<script setup lang="ts">
const buttons = ["Details", "Results", "Draw"]
</script>

<template>
  <u-card :ui="{ footer: 'flex flex-col md:flex-row items-center gap-2' }">
    <template #header>
      <div class="flex justify-between items-center mb-4">
        <u-skeleton class="h-7 w-40 rounded-lg" />
        <u-skeleton class="h-7 w-40 rounded-lg" />
      </div>
      <div class="flex justify-between items-center">
        <u-skeleton class="h-4 w-30 rounded-lg" />
        <u-skeleton class="h-4 w-30 rounded-lg" />
      </div>
    </template>

    <u-skeleton class="h-24 w-full rounded-lg" />

    <template #footer>
      <div class="flex gap-0 ml-auto">
        <u-skeleton
          v-for="button in buttons"
          :key="button"
          class="h-8 w-20 rounded-l-lg rounded-r-none text-secondary-700 dark:text-secondary-500 ring-secondary-600 bg-secondary-600/10 dark:bg-secondary-400/10 font-medium text-xs md:text-sm text-center py-1.5"
        >
          {{ button }}
        </u-skeleton>
      </div>
    </template>
  </u-card>
</template>
