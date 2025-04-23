<script setup lang="ts">
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

// API call
const { data: finalists, status } = await useFetch<TournamentFinalistsInterface[]>("/api/tournament-finalists", { query: { id } })
</script>

<template>
  <dashboard-subpanel
    title="Players by No. of Finals"
    :icon="ICONS.upcoming"
  >
    <template #right>
      <u-switch
        v-if="mdAndUp"
        v-model="checked"
        :label="checked ? 'Chart' : 'Table'"
        :checked-icon="ICONS.barChart"
        :unchecked-icon="ICONS.table"
      />
    </template>
    <div v-if="finalists || status === 'pending'">
      <tournament-finalists-chart
        v-if="checked && finalists"
        :finalists
      />
      <tournament-finalists-table
        v-else
        :finalists
        :status
      />
    </div>
    <error-message
      v-else
      :icon="ICONS.noPlayer"
      :status
      :title="`No finalists found for ${name}`"
      :error="`Error fetching finalists for ${name}`"
    />
  </dashboard-subpanel>
</template>
