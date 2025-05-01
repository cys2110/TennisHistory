<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.name as string))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

// API call
const { data: finalists, status } = await useFetch<TournamentFinalistsInterface[]>(
  "/api/tournaments/finalists",
  {
    query: { id: route.params.id },
    default: () => [],
    onResponseError: ({ error }) => {
      toast.add({
        title: `Error fetching finalists for ${name.value}`,
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
    title="Players by No. of Finals"
    :icon="ICONS.upcoming"
  >
    <template #right>
      <ClientOnly>
        <u-switch
          v-if="mdAndUp"
          v-model="checked"
          :label="checked ? 'Chart' : 'Table'"
          :checked-icon="ICONS.barChart"
          :unchecked-icon="ICONS.table"
        />
      </ClientOnly>
    </template>
    <div v-if="finalists.length || ['pending', 'idle'].includes(status)">
      <tournament-finalists-chart
        v-if="checked && finalists.length"
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
      :title="`No finalists found for ${name}`"
    />
  </dashboard-subpanel>
</template>
