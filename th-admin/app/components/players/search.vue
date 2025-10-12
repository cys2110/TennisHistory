<script setup lang="ts">
defineProps<{ placeholder: string }>()
const searchTerm = ref("")
const modelValue = defineModel<string>()
const {
  ui: { icons }
} = useAppConfig()

const { data: players, status } = await useFetch("/api/players/search", {
  query: { search: searchTerm },
  default: () => []
})
</script>

<template>
  <u-select-menu
    v-model="modelValue"
    v-model:search-term="searchTerm"
    :items="players"
    :loading="status === 'pending'"
    :placeholder="`Select ${placeholder}`"
    value-key="id"
    label-key="label"
  >
    <template #content-bottom>
      <u-field-group>
        <players-create block />
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
