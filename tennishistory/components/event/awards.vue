<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const route = useRoute()
const toast = useToast()

const { data: rounds, status } = await useFetch<EventAwardsType[]>("/api/eventAwards", {
  query: { eid: route.params.eid },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})

const columns: TableColumn<EventAwardsType>[] = [
  { accessorKey: "round", header: "Round" },
  { accessorKey: "points", header: "Points" },
  { accessorKey: "pm", header: "Prize Money" }
]
</script>

<template>
  <u-container v-if="rounds">
    <div class="flex justify-between items-center">
      <div>Awards</div>
      <u-modal>
        <u-button :icon="ICONS.scatter" />
        <template #content>
          <awards-chart :rounds />
        </template>
      </u-modal>
    </div>
    <!--TODO: skeleton loader-->
    <u-table
      :data="rounds"
      :columns
    >
      <template #pm-cell="{ row }">{{ CURRENCIES[row.original.currency] }}{{ row.original.pm }}</template>
    </u-table>
  </u-container>
  <error-message
    v-else
    :icon="ICONS['no-info']"
  >
    No prize money or points awarded
  </error-message>
</template>
