<script setup lang="ts">
defineProps<{
  environments?: EnvironmentType[]
  surfaces?: SurfaceType[]
}>()
const modelValue = defineModel<SurfaceType[]>()
const environment = defineModel<EnvironmentType[]>("environment")
</script>

<template>
  <u-checkbox-group
    legend="Environment"
    v-model="environment"
    :items="environments ?? ENVIRONMENTS"
    orientation="vertical"
    :ui="{ item: 'ml-3' }"
    class="my-2"
  />
  <u-checkbox-group
    legend="Surfaces"
    v-model="modelValue"
    :items="surfaces ?? SURFACES"
    orientation="vertical"
    :ui="{ item: 'ml-3', root: 'my-2' }"
    class="my-2"
  />
</template>
