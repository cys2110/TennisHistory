<script setup lang="ts">
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

// API call
const { data, status } = await useFetch<EntryInfoType[]>("/api/event-entry-info", { query: { eid } })
</script>

<template>
  <dashboard-subpanel
    title="Entry Information"
    :icon="ICONS.treeDiagram"
    :class="checked ? 'w-full' : '!w-fit'"
  >
    <template #right>
      <!--Only allow chart view on medium+ screens-->
      <u-switch
        v-if="mdAndUp"
        v-model="checked"
        :label="checked ? 'Chart' : 'Table'"
        :checked-icon="ICONS.treeDiagram"
        :unchecked-icon="ICONS.table"
      />
    </template>

    <div v-if="data">
      <entry-info-chart
        v-if="checked"
        :data
      />
      <entry-info-table
        v-else
        :data
      />
    </div>

    <u-collapsible
      v-else-if="status === 'pending'"
      v-for="_ in 6"
      :key="_"
    >
      <u-button
        color="neutral"
        block
        :trailing-icon="ICONS.chevronDown"
        size="xs"
      >
        <u-skeleton class="h-7 w-60 rounded-lg" />
      </u-button>
    </u-collapsible>

    <error-message
      v-else
      :icon="ICONS.noChart"
      :title="`No entry information found for ${name} ${year}`"
      :status
      :error="`Error fetching entry information for ${name} ${year}`"
    />
  </dashboard-subpanel>
</template>
