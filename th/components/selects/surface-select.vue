<script setup lang="ts">
const modelValue = defineModel<SurfaceEnum[]>()
</script>

<template>
  <u-form-field
    label="Surfaces"
    size="sm"
  >
    <template #hint>
      <div class="hidden lg:flex items-center gap-1">
        <u-kbd value="meta" />
        <u-kbd value="shift" />
        <u-kbd value="s" />
      </div>
    </template>

    <u-select
      v-model="modelValue"
      multiple
      :items="variables.SURFACES"
      :icon="ICONS.court"
      class="w-full"
      variant="none"
    />
  </u-form-field>
</template>
