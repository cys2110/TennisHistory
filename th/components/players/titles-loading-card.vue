<script setup lang="ts">
const buttons = ["Details", "Results", "Draw"]
</script>

<template>
  <u-page-card
    highlight
    class="w-full"
    :ui="{ description: 'flex flex-col gap-2 mt-5' }"
  >
    <template #title>
      <u-skeleton class="h-7 w-60 rounded-lg" />
    </template>
    <template #description>
      <u-skeleton
        v-for="_ in 2"
        :key="_"
        class="h-4 w-40 rounded-lg"
      />
    </template>
    <template #footer>
      <div class="flex gap-0">
        <u-skeleton
          v-for="button in buttons"
          :key="button"
          class="h-8 w-20 rounded-l-lg rounded-r-none text-secondary-700 dark:text-secondary-500 ring-secondary-600 bg-secondary-600/10 dark:bg-secondary-400/10 font-medium text-xs md:text-sm text-center py-1.5"
        >
          {{ button }}
        </u-skeleton>
      </div>
    </template>
  </u-page-card>
</template>
