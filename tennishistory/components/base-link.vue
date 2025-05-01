<script setup lang="ts">
defineProps<{ id: string; type: string }>()
</script>

<template>
  <u-link
    class="hover-link w-fit"
    :to="{ name: type, params: { id: encodeName(id) } }"
  >
    <template v-if="$slots.default">
      <slot />
    </template>
    <template v-else>
      {{ id }}
    </template>
  </u-link>
</template>
