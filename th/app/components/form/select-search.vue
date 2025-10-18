<script setup lang="ts">
const { type } = defineProps<{ placeholder: string; type: string; block?: boolean; icon?: string; size?: "md"; multiple?: boolean }>()
const {
  ui: { icons }
} = useAppConfig()

const searchTerm = ref("")
const modelValue = defineModel<SelectOptionsType[] | SelectOptionsType>()

const { data, status } = await useFetch(`/api/${type.toLowerCase()}/search`, {
  query: { search: searchTerm },
  default: () => []
})
</script>

<template>
  <u-select-menu
    v-model="modelValue"
    v-model:search-term="searchTerm"
    :multiple
    :items="data"
    :loading="status === 'pending'"
    :placeholder
    label-key="label"
    :variant="block ? undefined : 'none'"
    :class="{ 'w-fit max-w-50': !block }"
    :icon
    :size
  >
    <template #content-bottom>
      <u-field-group>
        <u-button
          label="Clear"
          size="xs"
          @click="Array.isArray(modelValue) ? (modelValue = []) : (modelValue = undefined)"
          :icon="icons.close"
          block
          class="rounded-t-none"
        />
      </u-field-group>
    </template>
  </u-select-menu>
</template>
