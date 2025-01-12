<script setup lang="ts">
import type { Countries } from '@/types/enums'
import { COUNTRY_CODES } from '@/utils/countryCodes'

const props = defineProps<{ country: Countries }>()
const code = COUNTRY_CODES[props.country] ?? false
</script>

<template>
  <span v-if="code" :class="`fi fi-${code}`" class="border border-slate-500 rounded" />
</template>
