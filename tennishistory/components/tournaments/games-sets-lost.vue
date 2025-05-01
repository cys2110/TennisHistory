<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const name = computed(() => decodeName(route.params.name as string))

const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

// API call
const { data: scores, status } = await useFetch<GamesSetsLostInterface[]>(
  "/api/tournaments/scores-stats",
  {
    query: { id: route.params.id },
    default: () => [],
    onResponseError: ({ error }) => {
      toast.add({
        title: `Error fetching score stats for ${name}`,
        description: error?.message,
        icon: appConfig.ui.icons.error,
        color: "error"
      })
      showError(error!)
    }
  }
)
</script>

<template>
  <dashboard-subpanel
    title="Winners by Games and Sets Lost"
    :icon="ICONS.scores"
  >
    <template #right>
      <ClientOnly>
        <u-switch
          v-if="mdAndUp"
          v-model="checked"
          :label="checked ? 'Chart' : 'Table'"
          :checked-icon="ICONS.scatterChart"
          :unchecked-icon="ICONS.table"
        />
      </ClientOnly>
    </template>
    <div v-if="scores || ['pending', 'idle'].includes(status)">
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
      :title="`No score stats found for ${name}`"
    />
  </dashboard-subpanel>
</template>
