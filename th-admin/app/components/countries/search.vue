<script setup lang="ts">
defineProps<{ placeholder: string }>()
const searchTerm = ref("")
const modelValue = defineModel<string>()
const {
  ui: { icons }
} = useAppConfig()

const { data: countries, status } = await useFetch("/api/countries/search", {
  query: { search: searchTerm },
  default: () => []
})
</script>

<template>
  <u-select-menu
    v-model="modelValue"
    v-model:search-term="searchTerm"
    :items="countries"
    :loading="status === 'pending'"
    :placeholder="`Select ${placeholder}`"
    value-key="id"
    label-key="label"
  >
    <template #content-bottom>
      <u-button
        label="Clear"
        size="xs"
        @click="modelValue = undefined"
        :icon="icons.close"
        block
      />
    </template>
  </u-select-menu>
</template>
