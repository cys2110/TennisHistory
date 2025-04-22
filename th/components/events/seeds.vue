<script setup lang="ts">
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

// API call
const { data: seeds, status } = await useFetch<SeedType[]>("/api/event-seeds", { query: { eid } })
</script>

<template>
  <dashboard-subpanel
    title="Seeds"
    :icon="ICONS.seeds"
    :class="checked ? 'w-full' : '!w-fit'"
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
    <seeds-chart
      v-if="seeds && checked"
      :seeds
    />

    <seeds-table
      v-else-if="seeds || status === 'pending'"
      :seeds
      :status
    />

    <error-message
      v-else
      :icon="ICONS.noInfo"
      :title="`No seeds found for ${name} ${year}`"
      :status
      :error="`Error fetching seeds for ${name} ${year}`"
    />
  </dashboard-subpanel>
</template>
