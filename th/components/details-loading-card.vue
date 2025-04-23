<template>
  <u-page-card
    highlight
    :ui="{ footer: 'text-sm text-(--ui-text-dimmed) pt-2 pb-0 self-start mt-0' }"
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
