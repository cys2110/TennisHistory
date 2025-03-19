<script setup lang="ts">
const modelValue = defineModel<SurfaceEnum[]>()
</script>

<template>
  <u-form-field label="Surfaces">
    <template #hint>
      <u-kbd value="meta" />
      <u-kbd value="shift" />
      <u-kbd value="s" />
    </template>

    <u-select
      v-model="modelValue"
      multiple
      :items="SURFACES"
      :icon="ICONS.court"
      class="w-full"
      variant="none"
    />
  </u-form-field>
</template>
