<script setup lang="ts">
const toast = useToast()
const eid = useRouteParams<string>("eid")
const formatName = useFormatName()
const checked = ref(false)

// API call
const { data: entries } = await useFetch<EventEntryType[]>("/api/eventEntries", {
  query: { eid },
  onResponseError: () => {
    toast.add({
      title: "Error fetching event entries",
      icon: ICONS.error
    })
  }
})
</script>

<template>
  <u-container
    v-if="entries"
    class="border-3 border-violet-400 rounded-xl p-4"
  >
    <div class="flex justify-between items-center my-2">
      <div class="text-slate-500 dark:text-slate-400 font-bold text-xl">Entries</div>
      <u-switch
        v-model="checked"
        :checked-icon="ICONS.cards"
        :unchecked-icon="ICONS.table"
        color="secondary"
        size="lg"
      />
    </div>

    <entries-cards
      v-if="checked"
      :entries
    />

    <entries-table
      v-else
      :entries
    />
  </u-container>
  <error-message
    v-else
    :icon="ICONS['no-info']"
    :title="`No entries available for ${formatName.capitaliseName.value}`"
  />
</template>
