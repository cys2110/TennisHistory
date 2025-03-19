<script setup lang="ts">
defineProps<{ checked: boolean }>()
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const toast = useToast()
const formatName = useFormatName()

// API call
const { data } = await useFetch<EntryInfoType[]>("/api/event-entry-info", {
  query: { eid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching entry information for ${formatName.capitaliseName.value} ${year.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="h-(--ui-header-height) flex items-center border-b border-(--ui-border) px-4 sm:px-6 gap-2 mb-5">
      <u-icon
        :name="ICONS.tree"
        class="text-(--ui-text-highlighted)"
      />
      <h1 class="flex items-center gap-1.5 font-semibold text-(--ui-text-highlighted)">Entry Information</h1>
    </div>

    <entry-info-table
      v-if="data && checked"
      :data
    />

    <entry-info-chart
      v-else-if="data"
      :data
    />

    <error-message
      v-else
      :icon="ICONS['no-chart']"
      :title="`No entry information found for ${formatName.capitaliseName.value} ${year}`"
    />
  </div>
</template>
