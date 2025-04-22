<script setup lang="ts">
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

// API calls
const { data: ages, status } = await useFetch<WinnersByAgeInterface[]>("/api/tournament-winner-ages", { query: { id } })
</script>

<template>
  <dashboard-subpanel
    title="Winners by Age"
    :icon="ICONS.calendar"
  >
    <template #right>
      <u-switch
        v-if="mdAndUp"
        v-model="checked"
        :label="checked ? 'Chart' : 'Table'"
        :checked-icon="ICONS.polarChart"
        :unchecked-icon="ICONS.table"
      />
    </template>
    <div v-if="ages || status === 'pending'">
      <winners-by-age-chart
        v-if="checked && ages"
        :ages
      />
      <winners-by-age-table
        v-else
        :ages
        :status
      />
    </div>
    <error-message
      v-else
      :icon="ICONS.noCountries"
      :status
      :title="`No winners by country found for ${name}`"
      :error="`Error fetching winners by country for ${name}`"
    />
  </dashboard-subpanel>
</template>
