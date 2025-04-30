<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.name as string))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

// API call
const { data: pm, status } = await useFetch<HistoricalPMInterface[]>(
  "/api/tournaments/historical-pm",
  {
    query: { id: route.params.id },
    default: () => [],
    onResponseError: ({ error }) => {
      toast.add({
        title: `Error fetching prize money for ${name.value}`,
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
    title="Historical Prize Money"
    :icon="ICONS.awards"
  >
    <template #right>
      <ClientOnly>
        <u-switch
          v-if="mdAndUp"
          v-model="checked"
          :label="checked ? 'Chart' : 'Table'"
          :checked-icon="ICONS.areaChart"
          :unchecked-icon="ICONS.table"
        />
      </ClientOnly>
    </template>
    <div v-if="pm.length || ['pending', 'idle'].includes(status)">
      <tournament-historical-pm-chart
        v-if="checked && pm.length"
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
      :title="`No prize money found for ${name}`"
    />
  </dashboard-subpanel>
</template>
