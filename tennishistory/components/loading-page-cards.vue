<template>
  <u-page-grid>
    <u-page-card
      v-for="i in new Array(3)"
      :key="i"
    >
      <template #title>
        <u-skeleton class="h-5 w-48" />
      </template>
      <template #description>
        <u-skeleton class="h-4 w-32" />
      </template>
    </u-page-card>
  </u-page-grid>
</template>
