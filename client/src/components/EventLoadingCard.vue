<script setup lang="ts">
import { Card, Skeleton } from 'primevue'
</script>

<template>
  <Card>
    <template #header>
      <Skeleton width="100%" height="7rem" class="rounded-b-none" />
    </template>
    <template #title>
      <Skeleton width="15rem" height="1rem" />
    </template>
    <template #subtitle>
      <Skeleton width="10rem" height="0.75rem" />
    </template>
    <template #content>
      <div class="flex gap-3 items-center">
        <Skeleton shape="circle" size="2rem" />
        <div class="flex flex-col gap-2">
          <Skeleton width="5rem" height="0.5rem" />
          <Skeleton width="5rem" height="0.5rem" />
        </div>
      </div>
    </template>
    <template #footer></template>
  </Card>
</template>

<style scoped></style>
