<script setup lang="ts">
import { UButton, UIcon, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()
const skip = ref(0)
const selectedLetter = defineModel<string>()
const nameSort = ref<SortType | undefined>()
const citySort = ref<SortType | undefined>()
const countrySort = ref<SortType | undefined>()

type APIResponseType = {
  count: number
  venues: VenueInterface[]
}

const venues = ref<VenueInterface[]>([])

const { data, status, execute } = await useFetch<APIResponseType>("/api/venues/table", {
  query: { letter: selectedLetter, skip, nameSort, citySort, countrySort },
  default: () => ({ count: 0, venues: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (venues.value = [...venues.value, ...(response._data.venues || [])])
})

execute()

// Reset skip and countries when the selected letter or sort options change
watch([nameSort, selectedLetter, citySort, countrySort], () => {
  skip.value = 0
  venues.value = []
})

const columns: TableColumn<VenueInterface>[] = [
  {
    id: "expand",
    cell: ({ row }) => {
      if (row.getIsGrouped())
        return h(UButton, {
          color: "neutral",
          variant: "link",
          icon: row.getIsExpanded() ? appIcons.minus : appIcons.plus,
          onClick: () => row.toggleExpanded(),
          class: "-mx-2.5 font-semibold text-(--ui-text)"
        })
    }
  },
  {
    id: "country",
    accessorKey: "country.name",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Country",
        icon:
          countrySort.value ?
            countrySort.value === "ASC" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => {
          citySort.value = undefined
          nameSort.value = undefined
          countrySort.value = countrySort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => {
      const country = row.original.country
      if (row.getIsGrouped() && row.depth === 0) {
        return h(
          ULink,
          {
            to: {
              name: "country",
              params: { id: country.id, name: encodeName(country.name) }
            }
          },
          () =>
            h("div", { class: "flex items-center gap-2 w-fit mx-auto" }, [
              h(UIcon, {
                name: getFlagCode(country),
                class: "text-xl"
              }),
              h("span", { class: "hover-link" }, country.name)
            ])
        )
      }
    }
  },
  {
    id: "city",
    accessorKey: "city",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "City",
        icon:
          citySort.value ?
            citySort.value === "ASC" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => {
          countrySort.value = undefined
          nameSort.value = undefined
          citySort.value = citySort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        if (row.depth === 0) {
          const directRows = row.getLeafRows() ?? []
          let cities: string[] = []
          for (const r of directRows) {
            if (!cities.includes(r.original.city)) {
              cities.push(r.original.city)
            }
          }
          return `${cities.length} ${cities.length === 1 ? "city" : "cities"}`
        } else if (row.depth === 1) {
          return row.original.city
        }
      }
    }
  },
  {
    accessorKey: "name",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Venue",
        icon:
          nameSort.value ?
            nameSort.value === "ASC" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => {
          citySort.value = undefined
          countrySort.value = undefined
          nameSort.value = nameSort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return `${row.getValue("name")} ${row.getValue("name") === 1 ? "venue" : "venues"}`
      } else {
        return h(
          ULink,
          {
            to: {
              name: "venue",
              params: { id: encodeName(row.original.id) }
            },
            class: "hover-link"
          },
          () => row.original.name ?? row.original.city
        )
      }
    },
    aggregationFn: "count"
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})

const table = useTemplateRef<ComponentPublicInstance>("table")

onMounted(() => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      skip.value += 40
    },
    {
      distance: 200,
      canLoadMore: () => {
        return status.value !== "pending" && data.value?.count > venues.value.length
      }
    }
  )
})
</script>

<template>
  <u-table
    ref="table"
    :data="venues"
    :columns
    class="max-h-200 min-w-2/3 md:min-w-1/2 lg:min-w-1/4 mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    :grouping="['country', 'city']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'min-w-full xl:min-w-2/3 mx-auto max-h-200',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
    empty="No venues found"
  />
</template>
