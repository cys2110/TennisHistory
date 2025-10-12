<script setup>
defineProps(["placeholder"])

const {
  params: { id }
} = useRoute("event")
const modelValue = defineModel()
const {
  ui: { icons }
} = useAppConfig()

const { data: entries, status } = await useFetch("/api/entries/get", {
  query: { id },
  default: () => [],
  transform: data =>
    get(useArrayUnique(data, (a, b) => a.id === b.id)).map(entry => ({
      id: entry.fid,
      label: entry.first_name ? `${entry.first_name} ${entry.last_name}` : entry.id
    }))
})
</script>

<template>
  <u-select-menu
    v-model="modelValue"
    :items="entries"
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
