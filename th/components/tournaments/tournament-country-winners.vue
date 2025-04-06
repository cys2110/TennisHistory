<script setup lang="ts">
defineProps<{ checked: boolean }>()
</script>

<template>
  <dashboard-subpanel
    title="Countries by No. of Winners"
    :icon="ICONS.countries"
  >
    <tournament-country-winners-table v-if="checked" />
    <tournament-country-winners-chart v-else />
  </dashboard-subpanel>
</template>
