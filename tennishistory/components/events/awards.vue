<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.name as string))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

// API call
const { data: awards, status } = await useFetch<RoundInterface[]>("/api/events/awards", {
  query: { eid: route.params.eid },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching awards for ${name.value}`,
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
    title="Awards"
    :icon="ICONS.awards"
    :class="checked ? 'w-full' : '!w-fit'"
  >
    <template #right>
      <!--Only allow chart view on medium+ screens-->
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

    <awards-chart
      v-if="awards && checked"
      :awards
    />

    <awards-table
      v-else-if="awards || ['pending', 'idle'].includes(status)"
      :awards
      :status
    />

    <error-message
      v-else
      :icon="ICONS.noAwards"
      :title="`No awards found for ${name} ${route.params.year}`"
    />
  </dashboard-subpanel>
</template>
