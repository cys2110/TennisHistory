<script setup lang="ts">
const modelValue = defineModel<CategoryEnumType[]>()
</script>

<template>
  <u-form-field label="Categories">
    <template #hint>
      <u-kbd value="meta" />
      <u-kbd value="shift" />
      <u-kbd value="c" />
    </template>

    <u-select
      v-model="modelValue"
      multiple
      :items="CATEGORIES"
      :icon="ICONS.court"
      class="w-full"
      variant="none"
    />
  </u-form-field>
</template>
