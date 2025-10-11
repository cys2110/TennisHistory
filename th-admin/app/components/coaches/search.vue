<script setup lang="ts">
defineProps<{ placeholder: string }>()
const searchTerm = ref("")
const modelValue = defineModel<string>()
const {
  ui: { icons }
} = useAppConfig()

const { data: coaches, status } = await useFetch("/api/coaches/search", {
  query: { search: searchTerm },
  default: () => []
})
</script>

<template>
  <u-select-menu
    v-model="modelValue"
    v-model:search-term="searchTerm"
    :items="coaches"
    :loading="status === 'pending'"
    :placeholder="`Select ${placeholder}`"
    value-key="id"
    label-key="label"
  >
    <template #content-bottom>
      <u-field-group>
        <create-person type="Coach" />
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
