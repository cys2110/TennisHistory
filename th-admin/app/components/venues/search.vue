<script setup lang="ts">
defineProps<{ placeholder: string }>()
const searchTerm = ref("")
const modelValue = defineModel<string[]>()
const {
  ui: { icons }
} = useAppConfig()

const { data: venues, status } = await useFetch("/api/venues/search", {
  query: { search: searchTerm },
  default: () => []
})
</script>

<template>
  <u-select-menu
    v-model="modelValue"
    v-model:search-term="searchTerm"
    multiple
    :items="venues"
    :loading="status === 'pending'"
    :placeholder="`Select ${placeholder}`"
  >
    <template #content-bottom>
      <u-field-group>
        <venues-create />
        <u-button
          label="Clear"
          size="xs"
          @click="modelValue = undefined"
          :icon="icons.close"
          block
        />
      </u-field-group>
    </template>
  </u-select-menu>
</template>
