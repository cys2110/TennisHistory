<script setup lang="ts">
defineProps<{ checked: boolean }>()
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const formatName = useFormatName()
const toast = useToast()

// API call
const { data: entries } = await useFetch<EntryTableType[]>("/api/event-entries", {
  query: { eid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching entries for ${formatName.capitaliseName.value} ${year.value}`,
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
        :name="ICONS.people"
        class="text-(--ui-text-highlighted)"
      />
      <h1 class="flex items-center gap-1.5 font-semibold text-(--ui-text-highlighted)">Entries</h1>
    </div>

    <entries-table
      v-if="checked && entries && entries.length > 0"
      :entries
    />
    <entries-cards
      v-else-if="entries && entries.length > 0"
      :entries
    />
    <error-message
      v-else
      :icon="ICONS['no-people']"
      :title="`No entries found for ${formatName.capitaliseName.value} ${year}`"
    />
  </div>
</template>
