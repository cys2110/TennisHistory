<script setup lang="ts">
defineProps<{ country: CountryInterface }>()
</script>

<template>
  <u-page-card
    :title="country.name"
    :to="{ name: 'country', params: { id: country.id } }"
    :icon="country.alpha2 ? `flag:${country.alpha2}-4x3` : `flags:${country.id}`"
    highlight
    :ui="{ container: 'justify-center items-center text-center', wrapper: 'flex flex-row items-center gap-2', leading: 'mb-0' }"
  />
</template>
