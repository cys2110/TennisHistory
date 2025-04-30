<template>
  <u-page-card
    highlight
    orientation="horizontal"
    reverse
  >
    <u-skeleton class="h-24 w-24 rounded-full border border-neutral-400 dark:border-neutral-700" />
    <template #leading> <u-skeleton class="h-6 w-9 rounded-lg" /></template>

    <template #title>
      <u-skeleton class="h-7 w-25 rounded-lg" />
    </template>

    <template #description>
      <u-skeleton class="h-4 w-15 rounded-lg" />
    </template>
  </u-page-card>
</template>
