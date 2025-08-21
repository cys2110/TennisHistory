<script setup lang="ts">
const { tours } = defineProps<{
  tours: TourType[]
  size?: "xs" | "sm" | "md" | "lg"
}>()
const modelValue = defineModel<TourType>()

onMounted(() => {
  modelValue.value = tours[0]
})
</script>

<template>
  <u-radio-group
    legend="Tour Type"
    v-model="modelValue"
    :items="tours"
    orientation="horizontal"
    :size="size ?? 'sm'"
  />
</template>
