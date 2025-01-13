<script setup lang="ts">
import { Card, Skeleton } from 'primevue'
</script>

<template>
  <Card>
    <template #title>
      <Skeleton width="3rem" height="1rem" />
    </template>
    <template #content>
      <div class="flex flex-col gap-3 items-center justify-center">
        <Skeleton width="5rem" height="0.5rem" />
        <div>d.</div>
        <Skeleton width="5rem" height="0.5rem" />
        <Skeleton width="5rem" height="0.5rem" />
      </div>
    </template>
    <template #footer>
      <div class="flex">
        <Skeleton width="2rem" height="0.5rem" class="rounded-r-none" />
        <Skeleton width="2rem" height="0.5rem" class="rounded-none" />
        <Skeleton width="2rem" height="0.5rem" class="rounded-l-none" />
      </div>
    </template>
  </Card>
</template>

<style scoped></style>
