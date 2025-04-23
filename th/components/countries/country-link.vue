<script setup lang="ts">
defineProps<{ country: CountryInterface }>()
</script>

<template>
  <u-link :to="{ name: 'country', params: { id: country.id } }">
    <u-icon :name="country.alpha2 ? `flag:${country.alpha2}-4x3` : `flags:${country.id}`" />
  </u-link>
</template>
