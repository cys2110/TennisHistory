<script setup>
defineProps(["placeholder"])
const searchTerm = ref("")
const modelValue = defineModel()
const {
  ui: { icons }
} = useAppConfig()

const { data: tournaments, status } = await useFetch("/api/tournaments/search", {
  query: { search: searchTerm },
  default: () => []
})
</script>

<template>
  <u-select-menu
    v-model="modelValue"
    v-model:search-term="searchTerm"
    :items="tournaments"
    :loading="status === 'pending'"
    :placeholder="`Select ${placeholder}`"
    value-key="id"
    label-key="label"
  >
    <template #content-bottom>
      <u-field-group>
        <tournaments-create block />
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
