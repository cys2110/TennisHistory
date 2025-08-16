<script setup lang="ts">
const modelValue = defineModel<SurfaceType[]>()
const environment = defineModel<EnvironmentType[]>("environment")
</script>

<template>
  <u-checkbox-group
    legend="Environment"
    v-model="environment"
    :items="ENVIRONMENTS"
    orientation="horizontal"
  />
  <u-checkbox-group
    legend="Surfaces"
    v-model="modelValue"
    :items="SURFACES"
    orientation="horizontal"
  />
</template>
