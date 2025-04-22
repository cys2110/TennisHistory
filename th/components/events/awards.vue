<script setup lang="ts">
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

// API call
const { data: awards, status } = await useFetch<RoundInterface[]>("/api/event-awards", { query: { eid } })
</script>

<template>
  <dashboard-subpanel
    title="Awards"
    :icon="ICONS.awards"
    :class="checked ? 'w-full' : '!w-fit'"
  >
    <template #right>
      <!--Only allow chart view on medium+ screens-->
      <u-switch
        v-if="mdAndUp"
        v-model="checked"
        :label="checked ? 'Chart' : 'Table'"
        :checked-icon="ICONS.scatterChart"
        :unchecked-icon="ICONS.table"
      />
    </template>

    <awards-chart
      v-if="awards && checked"
      :awards
    />

    <awards-table
      v-else-if="awards || status === 'pending'"
      :awards
      :status
    />

    <error-message
      v-else
      :icon="ICONS.noAwards"
      :title="`No awards found for ${name} ${year}`"
      :status
      :error="`Error fetching awards for ${name} ${year}`"
    />
  </dashboard-subpanel>
</template>
