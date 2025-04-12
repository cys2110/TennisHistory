<script setup lang="ts">
defineProps<{ country: CountryInterface }>()
</script>

<template>
  <u-link :to="{ name: 'country', params: { id: country.id } }">
    <u-icon
      v-if="country.alpha2"
      :name="`flag:${country.alpha2}-4x3`"
    />
  </u-link>
</template>
