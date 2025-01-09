<script setup lang="ts">
import type { CheckboxValueType } from 'element-plus'

const props = defineProps<{ label: string; options: { label: string; value: string }[] }>()
const mode = useColorMode()

const modelValue = defineModel<string[]>()
const indeterminate = ref(false)
const checkAll = ref(true)

watchArray(modelValue, (newValue) => {
  if (newValue.length === 0) {
    checkAll.value = false
    indeterminate.value = false
  } else if (newValue.length === props.options.length) {
    checkAll.value = true
    indeterminate.value = false
  } else {
    checkAll.value = false
    indeterminate.value = true
  }
})

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false
  if (val) {
    modelValue.value = props.options.map((_) => _.value)
  } else {
    modelValue.value = []
  }
}
</script>

<template>
  <!--TODO: styling-->
  <el-config-provider>
    <el-select v-model="modelValue" :label multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3" size="small" style="--el-border-color: #16a34a">
      <template #header>
        <el-checkbox v-model="checkAll" :indeterminate="indeterminate" @change="handleCheckAll"> All </el-checkbox>
      </template>
      <el-option v-for="option in options" :key="option.label" :label="option.label" :value="option.value" />
    </el-select>
  </el-config-provider>
</template>

<style>
.el-select__wrapper {
  @apply !bg-transparent !py-2 !px-4;
}
</style>
