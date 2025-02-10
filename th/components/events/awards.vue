<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const toast = useToast()
const eid = useRouteParams<string>("eid")
const formatName = useFormatName()

// API call
const { data: awards } = await useFetch<EventAwardType[]>("/api/eventAwards", {
  query: { eid },
  onResponseError: () => {
    toast.add({
      title: "Error fetching awards",
      icon: ICONS.error
    })
  }
})

const columns: TableColumn<EventAwardType>[] = [
  {
    accessorKey: "round",
    header: "Round",
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  },
  {
    accessorFn: row => row.points ?? "—",
    header: "Points",
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  },
  {
    accessorFn: row => (row.currency && row.pm ? `${CURRENCIES[row.currency]}${row.pm}` : "—"),
    header: "Prize Money",
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  }
]
</script>

<template>
  <u-container
    v-if="awards"
    class="border-3 border-violet-400 rounded-xl p-4"
  >
    <div class="flex justify-between items-center my-2">
      <div class="text-slate-500 dark:text-slate-400 font-bold text-xl">Awards</div>
      <u-modal
        fullscreen
        class="hidden md:flex"
        title="Awards"
      >
        <u-button
          :icon="ICONS.scatter"
          variant="subtle"
          color="secondary"
        />
        <template #body>
          <awards-chart :awards />
        </template>
      </u-modal>
    </div>

    <u-table
      :data="awards"
      :columns
    />
  </u-container>
  <error-message
    v-else
    :icon="ICONS['no-info']"
    :title="`No awards available for ${formatName.capitaliseName.value}`"
  />
</template>
