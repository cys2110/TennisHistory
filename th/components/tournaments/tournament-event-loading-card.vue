<script setup lang="ts">
const buttons = ["Details", "Results", "Draw"]
</script>

<template>
  <u-page-card
    reverse
    highlight
    :ui="{ description: 'flex flex-col gap-4' }"
  >
    <template #title>
      <u-skeleton class="h-7 w-20 rounded-lg mb-5" />
    </template>
    <template #description>
      <u-skeleton class="h-5 w-40 rounded-lg mx-auto" />
      <div class="text-sm text-center">d.</div>
      <u-skeleton class="h-5 w-40 rounded-lg mx-auto" />
      <u-skeleton class="h-5 w-20 rounded-lg mx-auto" />
    </template>
    <template #footer>
      <div class="flex gap-0">
        <u-skeleton
          v-for="button in buttons"
          :key="button"
          class="h-8 w-20 text-secondary-700 dark:text-secondary-500 ring-secondary-600 bg-secondary-600/10 dark:bg-secondary-400/10 font-medium text-xs md:text-sm text-center py-1.5 rounded-none"
        >
          {{ button }}
        </u-skeleton>
      </div>
    </template>
  </u-page-card>
</template>
