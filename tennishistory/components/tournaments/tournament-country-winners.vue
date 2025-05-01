<script setup lang="ts">
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)
</script>

<template>
  <dashboard-subpanel
    title="Countries by No. of Winners"
    :icon="ICONS.countries"
  >
    <template #right>
      <ClientOnly>
        <u-switch
          v-if="mdAndUp"
          v-model="checked"
          :label="checked ? 'Chart' : 'Table'"
          :checked-icon="ICONS.lineChart"
          :unchecked-icon="ICONS.table"
        />
      </ClientOnly>
    </template>
    <tournament-country-winners-chart v-if="checked" />
    <tournament-country-winners-table v-else />
  </dashboard-subpanel>
</template>
