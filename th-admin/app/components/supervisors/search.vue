<script setup lang="ts">
defineProps<{ placeholder: string }>()
const searchTerm = ref("")
const modelValue = defineModel<string[]>()
const {
  ui: { icons }
} = useAppConfig()

const { data: supervisors, status } = await useFetch("/api/supervisors/search", {
  query: { search: searchTerm },
  default: () => []
})
</script>

<template>
  <u-select-menu
    v-model="modelValue"
    v-model:search-term="searchTerm"
    multiple
    :items="supervisors"
    :loading="status === 'pending'"
    :placeholder="`Select ${placeholder}`"
  >
    <template #content-bottom>
      <u-field-group>
        <create-person type="Supervisor" />
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
