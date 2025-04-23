<script setup lang="ts">
const buttons = ["Details", "Results", "Draw"]
</script>

<template>
  <u-card :ui="{ root: 'flex flex-col', footer: 'justify-center mt-auto', body: 'flex-1' }">
    <template #header>
      <u-skeleton class="h-7 w-60 rounded-lg" />
    </template>

    <u-collapsible>
      <u-button
        color="neutral"
        block
        :trailing-icon="ICONS.chevronDown"
        size="xs"
      >
        <u-skeleton class="h-7 w-60 rounded-lg" />
      </u-button>
    </u-collapsible>

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
  </u-card>
</template>
