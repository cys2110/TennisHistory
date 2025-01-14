<script setup lang="ts"></script>

<template>
  <div class="my-10">
    <div v-if="$slots.breadcrumbs">
      <slot name="breadcrumbs" />
    </div>
    <div class="flex gap-5 items-center">
      <div class="text-4xl text-slate-600 dark:text-slate-300">
        <slot name="heading" />
      </div>
      <div v-if="$slots.subheading" class="text-slate-400">
        <slot name="subheading" />
      </div>
    </div>
    <div v-if="$slots.actions" class="my-5">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped></style>
