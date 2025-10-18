<script setup lang="ts">
const { type } = defineProps<{ type: string }>()
const modelValue = defineModel<SelectOptionsType[]>()

const searchTerm = ref("")

const { data, status } = await useFetch(`/api/${type.toLowerCase()}/search`, {
  query: { search: searchTerm },
  default: () => []
})

const groups = computed(() => [
  {
    id: "results",
    label: get(searchTerm) ? `${type} matching ${get(searchTerm)}` : type,
    items:
      get(data).map(item => ({
        ...item,
        onSelect: () => {
          const exists = get(modelValue)?.find(i => i.id === item.id)
          if (exists) {
            set(modelValue, get(modelValue)?.filter(i => i.id !== item.id) || [])
          } else {
            set(modelValue, [...(get(modelValue) || []), item])
          }
        }
      })) || []
  }
])
</script>

<template>
  <u-command-palette
    v-model:search-term="searchTerm"
    :loading="status === 'pending'"
    :groups
    :fuse="{ resultLimit: 22 }"
    :placeholder="`Search ${type.toLowerCase()}`"
  />
</template>
