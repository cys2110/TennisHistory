<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const route = useRoute()
const toast = useToast()

const { data: seeds, status } = await useFetch<EventSeedType[]>("/api/eventSeeds", {
  query: { eid: route.params.eid },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})

const columns: TableColumn<EventSeedType>[] = [
  { accessorKey: "seed", header: "Seed" },
  { accessorKey: "country", header: "" },
  { id: "id", header: "" },
  { accessorKey: "last", header: "Player" },
  { accessorKey: "rank", header: "Rank" }
]
</script>

<template>
  <u-container v-if="seeds">
    <div class="flex justify-between items-center">
      <div>Seeds</div>
      <u-modal>
        <u-button :icon="ICONS['bar-chart']" />
        <template #content>
          <seeds-chart :seeds />
        </template>
      </u-modal>
    </div>
    <!--TODO: skeleton loader-->
    <u-table
      :data="seeds"
      :columns
    >
      <template #country-cell="{ row }">
        <flag-icon :country="row.original.country" />
      </template>

      <template #id-cell="{ row }">
        <player-avatar
          :id="row.original.id"
          :name="row.original.name"
        />
      </template>

      <!--TODO: Sorting-->
      <template #last-cell="{ row }">
        <nuxt-link
          class="hover-link"
          :to="{ name: 'player', params: { name: useChangeCase(row.original.name, 'kebabCase').value, id: row.original.id } }"
        >
          {{ row.original.name }}
        </nuxt-link>
      </template>
    </u-table>
  </u-container>
  <error-message
    v-else
    :icon="ICONS['no-info']"
  >
    No prize money or points awarded
  </error-message>
</template>
