<script setup lang="ts">
const modelValue = defineModel<MonthNameEnum[]>()
</script>

<template>
  <u-form-field
    label="Months"
    size="sm"
  >
    <template #hint>
      <div class="hidden lg:flex items-center gap-1">
        <u-kbd value="meta" />
        <u-kbd value="shift" />
        <u-kbd value="m" />
      </div>
    </template>

    <u-select
      v-model="modelValue"
      multiple
      :items="variables.MONTH_NAMES"
      :icon="ICONS['calendar-event']"
      class="w-full"
      variant="none"
    />
  </u-form-field>
</template>
