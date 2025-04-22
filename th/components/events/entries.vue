<script setup lang="ts">
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

// API call
const { data: entries, status } = await useFetch<EntryTableType[]>("/api/event-entries", { query: { eid } })
</script>

<template>
  <dashboard-subpanel
    title="Entries"
    :icon="ICONS.player"
  >
    <template #right>
      <!--Only allow chart view on medium+ screens-->
      <u-switch
        v-if="mdAndUp"
        v-model="checked"
        :label="checked ? 'Chart' : 'Table'"
        :checked-icon="ICONS.cards"
        :unchecked-icon="ICONS.table"
      />
    </template>
    <div v-if="(entries && entries.length > 0) || status === 'pending'">
      <entries-card
        v-if="checked"
        :entries
      />
      <entries-table
        v-else
        :entries
        :status
      />
    </div>
    <error-message
      v-else
      :icon="ICONS.noPeople"
      :title="`No entries found for ${name} ${year}`"
      :status
      :error="`Error fetching entries for ${name} ${year}`"
    />
  </dashboard-subpanel>
</template>
