<script setup lang="ts">
defineProps<{ country: { id: string; alpha2: string | null; name: string } }>()
</script>

<template>
  <u-icon
    v-if="country.alpha2"
    :name="`flag:${country.alpha2}-4x3`"
  />
</template>
