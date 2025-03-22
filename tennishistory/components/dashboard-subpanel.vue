<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="h-(--ui-header-height) flex items-center border-b border-(--ui-border) px-4 sm:px-6 gap-1.5 mb-5">
      <h1 class="flex items -center gap-1.5 font-semibold text-(--ui-text-highlighted)">{{ title }} </h1>
    </div>
    <slot />
  </div>
</template>
