<script setup lang="ts">
import { SurfaceEnum } from "~/types/enums"
const modelValue = defineModel<SurfaceEnum[]>()
const checked = ref<boolean | "indeterminate">(true)

watchArray(modelValue, newValue => {
  if (newValue.length === 0) {
    checked.value = false
  } else if (newValue.length === SURFACES.length) {
    checked.value = true
  } else {
    checked.value = "indeterminate"
  }
})

const handleCheckAll = () => {
  if (checked.value === true) {
    modelValue.value = SURFACES
  } else if (checked.value === false) {
    modelValue.value = []
  }
}
</script>

<template>
  <u-form-field label="Surfaces">
    <u-checkbox
      v-model="checked"
      label="Select all"
      size="sm"
      @change="handleCheckAll"
    />
    <u-select
      v-model="modelValue"
      multiple
      :items="SURFACES"
      :icon="ICONS.court"
      :selected-icon="ICONS.check"
      :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-300'
      }"
      class="w-full"
    />
  </u-form-field>
</template>
