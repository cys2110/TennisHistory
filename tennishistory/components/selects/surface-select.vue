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
      :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-300'
      }"
      class="w-full"
    />
  </u-form-field>
</template>
