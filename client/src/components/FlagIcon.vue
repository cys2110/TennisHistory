<script setup lang="ts">
const props = defineProps<{ country: string; size?: string }>()

const getCountryCode = () => {
  const key = Object.keys(COUNTRY_CODES).find((key) => COUNTRY_CODES[key as keyof typeof COUNTRY_CODES] === props.country)
  return key || false
}
</script>

<template>
  <span :class="`fi fi-${getCountryCode()}`" class="border border-slate-500 rounded" />
</template>
