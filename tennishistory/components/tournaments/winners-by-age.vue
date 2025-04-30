<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.name as string))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

// API calls
const { data: ages, status } = await useFetch<WinnersByAgeInterface[]>(
  "/api/tournaments/winner-ages",
  {
    query: { id: route.params.id },
    default: () => [],
    onResponseError: ({ error }) => {
      toast.add({
        title: `Error fetching winners by age for ${name.value}`,
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
    title="Winners by Age"
    :icon="ICONS.calendar"
  >
    <template #right>
      <ClientOnly>
        <u-switch
          v-if="mdAndUp"
          v-model="checked"
          :label="checked ? 'Chart' : 'Table'"
          :checked-icon="ICONS.polarChart"
          :unchecked-icon="ICONS.table"
        />
      </ClientOnly>
    </template>
    <div v-if="ages.length || ['pending', 'idle'].includes(status)">
      <winners-by-age-chart
        v-if="checked && ages.length"
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
      :title="`No winners by country found for ${name}`"
    />
  </dashboard-subpanel>
</template>
