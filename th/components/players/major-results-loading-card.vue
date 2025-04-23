<template>
  <u-page-card
    highlight
    :ui="{ description: 'flex flex-col gap-1' }"
  >
    <template #title>
      <u-skeleton class="h-7 w-60 rounded-lg" />
    </template>

    <template #description>
      <u-skeleton
        v-for="_ in 3"
        class="h-4 w-20 rounded-lg"
      />
    </template>
  </u-page-card>
</template>
