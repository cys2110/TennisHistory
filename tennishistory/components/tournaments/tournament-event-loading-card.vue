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
      <u-skeleton
        class="h-8 w-60 rounded-lg ring-secondary-600 bg-secondary-600/10 dark:bg-secondary-400/10"
      />
    </template>
  </u-page-card>
</template>
