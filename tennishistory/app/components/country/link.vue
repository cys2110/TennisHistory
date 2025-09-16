<script setup lang="ts">
const { iconOnly = true } = defineProps<{ country: CountryInterface; iconOnly?: boolean }>()
</script>

<template>
  <u-link
    :to="{ name: 'country', params: { id: country.id, name: kebabCase(country.name) } }"
    class="w-fit flex items-center gap-2"
  >
    <u-icon
      :name="getFlagCode(country)"
      class="text-xl"
    />
    <span
      v-if="!iconOnly"
      class="hover-link default-link w-fit"
    >
      {{ country.name }}
    </span>
  </u-link>
</template>
