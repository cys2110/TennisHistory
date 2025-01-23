<script setup lang="ts">
import type { MonthNameEnum } from "~/types/enums"
const modelValue = defineModel<MonthNameEnum[]>()
</script>

<template>
  <u-form-field label="Months">
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
        value="m"
        size="sm"
      />
    </template>
    <u-select
      v-model="modelValue"
      multiple
      :items="MONTH_NAMES"
      :icon="ICONS['calendar-event']"
      :selected-icon="ICONS.check"
      :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-300'
      }"
      class="w-full"
    />
  </u-form-field>
</template>
