<script setup lang="ts">
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const checked = ref(false)
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")

// API call
const { data: scores, status } = await useFetch<GamesSetsLostInterface[]>("/api/tournament-scores-stats", { query: { id } })
</script>

<template>
  <dashboard-subpanel
    title="Winners by Games and Sets Lost"
    :icon="ICONS.scores"
  >
    <template #right>
      <u-switch
        v-if="mdAndUp"
        v-model="checked"
        :label="checked ? 'Chart' : 'Table'"
        :checked-icon="ICONS.scatterChart"
        :unchecked-icon="ICONS.table"
      />
    </template>
    <div v-if="scores || status === 'pending'">
      <games-sets-lost-chart
        v-if="checked && scores"
        :scores
      />
      <games-sets-lost-table
        v-else
        :scores
        :status
      />
    </div>
    <error-message
      v-else
      :icon="ICONS.noScores"
      :status
      :title="`No score stats found for ${name}`"
      :error="`Error fetching score stats for ${name}`"
    />
  </dashboard-subpanel>
</template>
