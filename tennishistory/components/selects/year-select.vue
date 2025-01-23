<script setup lang="ts">
defineProps<{ items: string[] }>()
const modelValue = defineModel<string[]>()
</script>

<template>
  <u-form-field label="Years">
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
        value="y"
        size="sm"
      />
    </template>
    <u-select
      v-model="modelValue"
      multiple
      :items
      :icon="ICONS.calendar"
      class="w-full"
    />
  </u-form-field>
</template>
