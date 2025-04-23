<script setup lang="ts">
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

// API call
const { data: pm, status } = await useFetch<HistoricalPMInterface[]>("/api/tournament-historical-pm", { query: { id } })
</script>

<template>
  <dashboard-subpanel
    title="Historical Prize Money"
    :icon="ICONS.awards"
  >
    <template #right>
      <u-switch
        v-if="mdAndUp"
        v-model="checked"
        :label="checked ? 'Chart' : 'Table'"
        :checked-icon="ICONS.areaChart"
        :unchecked-icon="ICONS.table"
      />
    </template>
    <div v-if="pm || status === 'pending'">
      <tournament-historical-pm-chart
        v-if="checked && pm"
        :pm
      />
      <tournament-historical-pm-table
        v-else
        :pm
        :status
      />
    </div>
    <error-message
      v-else
      :icon="ICONS.noAwards"
      :status
      :title="`No prize money found for ${name}`"
      :error="`Error fetching prize money for ${name}`"
    />
  </dashboard-subpanel>
</template>
