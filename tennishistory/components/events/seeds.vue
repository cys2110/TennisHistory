<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.name as string))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

// API call
const { data: seeds, status } = await useFetch<SeedType[]>("/api/events/seeds", {
  query: { eid: route.params.eid },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching seeds for ${name.value} ${route.params.year}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <dashboard-subpanel
    title="Seeds"
    :icon="ICONS.seeds"
    :class="checked ? 'w-full' : '!w-fit'"
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

    <seeds-chart
      v-if="seeds && checked"
      :seeds
    />

    <seeds-table
      v-else-if="seeds || ['pending', 'idle'].includes(status)"
      :seeds
      :status
    />

    <error-message
      v-else
      :title="`No seeds found for ${name} ${route.params.year}`"
    />
  </dashboard-subpanel>
</template>
