<script setup lang="ts">
import { CategoryEnum } from "~/types/enums"
const modelValue = defineModel<CategoryEnum[]>()
</script>

<template>
  <u-form-field label="Categories">
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
        value="c"
        size="sm"
      />
    </template>
    <u-select
      v-model="modelValue"
      multiple
      :items="CATEGORIES"
      :icon="ICONS.trophy"
      :selected-icon="ICONS.check"
      :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-300'
      }"
      class="w-full"
    />
  </u-form-field>
</template>
