<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.name as string))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

// API call
const { data: entries, status } = await useFetch<
  Omit<EntryInterface, "incomplete" | "rank2" | "reason">[]
>("/api/events/entries", {
  query: { eid: route.params.eid },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching entries for ${name.value}`,
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
    title="Entries"
    :icon="ICONS.player"
  >
    <template #right>
      <!--Only allow chart view on medium+ screens-->
      <ClientOnly>
        <u-switch
          v-if="mdAndUp"
          v-model="checked"
          :label="checked ? 'Chart' : 'Table'"
          :checked-icon="ICONS.cards"
          :unchecked-icon="ICONS.table"
        />
      </ClientOnly>
    </template>
    <div v-if="entries.length || ['pending', 'idle'].includes(status)">
      <u-page-grid
        v-if="checked && entries.length"
        class="my-5 xl:grid-cols-5 2xl:grid-cols-6"
      >
        <entries-card
          v-for="entry in entries"
          :key="entry.id"
          :entry
        />
      </u-page-grid>
      <entries-table
        v-else
        :entries
        :status
      />
    </div>
    <error-message
      v-else
      :icon="ICONS.noPeople"
      :title="`No entries found for ${name} ${route.params.year}`"
    />
  </dashboard-subpanel>
</template>
