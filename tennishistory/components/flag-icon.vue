<script setup lang="ts">
defineProps<{ country: CountryInterface }>()
</script>

<template>
  <u-icon
    v-if="country.alpha2"
    :name="`flag:${country.alpha2}-4x3`"
  />
</template>
