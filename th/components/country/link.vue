<script setup lang="ts">
defineProps<{ country: CountryInterface; iconOnly?: boolean }>()
</script>

<template>
  <u-link
    :to="{ name: 'country', params: { id: country.id, name: encodeName(country.name) } }"
    class="flex items-center gap-2"
  >
    <u-icon
      :name="getFlagCode(country)"
      class="text-xl"
    />
    <span
      v-if="!iconOnly"
      class="hover-link"
      >{{ country.name }}</span
    >
  </u-link>
</template>
