<script setup lang="ts">
const props = defineProps<{ items: string[] }>()
const modelValue = defineModel<string[]>()
const checked = ref<boolean | "indeterminate">("indeterminate")

watchArray(modelValue, newValue => {
  if (newValue.length === 0) {
    checked.value = false
  } else if (newValue.length === props.items.length) {
    checked.value = true
  } else {
    checked.value = "indeterminate"
  }
})

const handleCheckAll = () => {
  if (checked.value === true) {
    modelValue.value = props.items
  } else if (checked.value === false) {
    modelValue.value = []
  }
}
</script>

<template>
  <u-form-field label="Years">
    <u-checkbox
      v-model="checked"
      label="Select all"
      size="sm"
      @change="handleCheckAll"
    />
    <u-select
      v-model="modelValue"
      multiple
      :items
      :icon="ICONS.calendar"
      class="w-full"
    />
  </u-form-field>
</template>
