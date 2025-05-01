<template>
  <u-page-card
    highlight
    :ui="{ footer: 'pt-2 pb-0 self-start' }"
  >
    <template #title>
      <u-skeleton class="h-7 w-30 rounded-lg" />
    </template>
    <template #description>
      <u-skeleton class="h-4 w-40 rounded-lg" />
    </template>
    <template #footer>
      <u-skeleton class="h-3 w-40 rounded-lg" />
    </template>
  </u-page-card>
</template>
