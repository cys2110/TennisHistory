<script setup lang="ts">
defineProps<{ placeholder: string }>()
const searchTerm = ref("")
const modelValue = defineModel<string>()
const {
  ui: { icons }
} = useAppConfig()

const { data: umpires, status } = await useFetch("/api/umpires/search", {
  query: { search: searchTerm },
  default: () => []
})
</script>

<template>
  <u-select-menu
    v-model="modelValue"
    v-model:search-term="searchTerm"
    :items="umpires"
    :loading="status === 'pending'"
    :placeholder="`Select ${placeholder}`"
  >
    <template #content-bottom>
      <u-field-group>
        <create-person type="Umpire" />
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
