<script setup lang="ts">
import { SurfaceEnum } from "~/types/enums"
const modelValue = defineModel<SurfaceEnum[]>()
</script>

<template>
  <u-form-field label="Surfaces">
    <template #hint>
      <u-kbd
        value="meta"
        size="sm"
      />
      <u-kbd
        value="shift"
        size="sm"
      />
      <u-kbd
        value="s"
        size="sm"
      />
    </template>
    <u-select
      v-model="modelValue"
      multiple
      :items="SURFACES"
      :icon="ICONS.court"
      :selected-icon="ICONS.check"
      class="w-full"
    />
  </u-form-field>
</template>
