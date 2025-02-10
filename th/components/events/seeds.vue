<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const toast = useToast()
const eid = useRouteParams<string>("eid")
const formatName = useFormatName()
const UButton = resolveComponent("u-button")
const UTooltip = resolveComponent("u-tooltip")

// API call
const { data: seeds } = await useFetch<EventSeedType[]>("/api/eventSeeds", {
  query: { eid },
  onResponseError: () => {
    toast.add({
      title: "Error fetching seeds",
      icon: ICONS.error
    })
  }
})

const columns: TableColumn<EventSeedType>[] = [
  {
    accessorKey: "withdrew"
  },
  {
    accessorKey: "seed",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Seed",
        icon:
          isSorted ?
            isSorted === "asc" ?
              ICONS["sort-number-up"]
            : ICONS["sort-number-down"]
          : ICONS["sort-number"],
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold"
      })
    },
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  },
  {
    accessorKey: "country",
    header: "",
    meta: { class: { th: "text-center", td: "text-center" } }
  },
  {
    accessorKey: "id",
    header: "",
    meta: { class: { th: "text-slate-400", td: "text-center" } }
  },
  { accessorKey: "name" },
  {
    accessorKey: "last",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Player",
        icon:
          isSorted ?
            isSorted === "asc" ?
              ICONS["sort-alpha-up"]
            : ICONS["sort-alpha-down"]
          : ICONS["sort-alpha"],
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold"
      })
    },
    meta: { class: { th: "text-slate-500 dark:text-slate-400", td: "text-slate-600 dark:text-slate-300" } }
  },
  {
    accessorKey: "rank2",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UTooltip, { text: "Rank at time of draw" }, () =>
        h(UButton, {
          color: "neutral",
          variant: "link",
          label: "Rank",
          icon:
            isSorted ?
              isSorted === "asc" ?
                ICONS["sort-number-up"]
              : ICONS["sort-number-down"]
            : ICONS["sort-number"],
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          class: "-mx-2.5 font-semibold"
        })
      )
    },
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  },
  {
    accessorKey: "rank1",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UTooltip, { text: "Rank at start of event" }, () =>
        h(UButton, {
          color: "neutral",
          variant: "link",
          label: "Rank",
          icon:
            isSorted ?
              isSorted === "asc" ?
                ICONS["sort-number-up"]
              : ICONS["sort-number-down"]
            : ICONS["sort-number"],
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          class: "-mx-2.5 font-semibold"
        })
      )
    },
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  }
]

const columnVisibility = ref({ name: false, withdrew: false })
</script>

<template>
  <u-container
    v-if="seeds"
    class="border-3 border-violet-400 rounded-xl p-4"
  >
    <div class="flex justify-between items-center my-2">
      <div class="text-slate-500 dark:text-slate-400 font-bold text-xl">Seeds</div>
      <u-modal
        fullscreen
        class="hidden md:flex"
        title="Seeds"
      >
        <u-button
          :icon="ICONS['bar-chart']"
          variant="subtle"
          color="secondary"
        />
        <template #body>
          <seeds-chart :seeds />
        </template>
      </u-modal>
    </div>

    <u-table
      :data="seeds"
      :columns
      :column-visibility
    >
      <template #seed-cell="{ row }">
        <span :class="{ 'line-through': row.getValue('withdrew') }">
          {{ row.getValue("seed") }}
        </span>
      </template>
      <template #country-cell="{ row }">
        <flag-icon :country="row.getValue('country')" />
      </template>

      <template #id-cell="{ row }">
        <u-avatar
          :src="`https://www.atptour.com/-/media/alias/player-headshot/${row.getValue('id')}`"
          size="sm"
        />
      </template>

      <template #last-cell="{ row }">
        <nuxt-link
          :to="{ name: 'player', params: { name: useChangeCase(row.getValue('name'), 'kebabCase').value, id: row.getValue('id') } }"
          class="hover-link"
          :class="{ 'line-through': row.getValue('withdrew') }"
        >
          {{ row.getValue("name") }}
        </nuxt-link>
      </template>

      <template #rank1-cell="{ row }">
        <span :class="{ 'line-through': row.getValue('withdrew') }">
          {{ row.getValue("rank1") ?? "—" }}
        </span>
      </template>

      <template #rank2-cell="{ row }">
        <span :class="{ 'line-through': row.getValue('withdrew') }">
          {{ row.getValue("rank2") ?? "—" }}
        </span>
      </template>
    </u-table>
  </u-container>
  <error-message
    v-else
    :icon="ICONS['no-info']"
    :title="`No seeds available for ${formatName.capitaliseName.value}`"
  />
</template>
