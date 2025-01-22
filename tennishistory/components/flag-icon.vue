<script setup lang="ts">
import type { CountriesEnum } from "~/types/enums"
defineProps<{ country: CountriesEnum }>()
</script>

<template>
  <u-icon
    v-if="COUNTRY_CODES[country]"
    :name="`flag:${COUNTRY_CODES[country]}-4x3`"
  />
  <component
    v-else
    :is="country"
  />
</template>
