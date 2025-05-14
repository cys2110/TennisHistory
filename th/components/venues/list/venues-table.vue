<script setup lang="ts">
import { BaseLink, UButton, UIcon } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

type CountryType = {
  country: CountryInterface
  cities: {
    city: string
    venues: Pick<VenueInterface, "id" | "name">[]
  }[]
}

const { venues, count, status } = defineProps<{
  venues: CountryType[]
  status: APIStatusType
  count: number
}>()
const appConfig = useAppConfig()

const formattedVenues = computed(() => {
  const newArray: { country: CountryInterface; city: string; name: string | null; id: string }[] = []
  venues.forEach(country => {
    country.cities.forEach(city => {
      city.venues.forEach(venue => {
        newArray.push({
          country: country.country,
          city: city.city,
          name: venue.name,
          id: venue.id
        })
      })
    })
  })
  return newArray
})

const skip = defineModel<number>({ default: 0 })
const sort = defineModel<"ASC" | "DESC">("sort", { default: "ASC" })

const table = useTemplateRef<ComponentPublicInstance>("table")

onMounted(async () => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      skip.value += 25
    },
    {
      distance: 150,
      canLoadMore: () => status !== "pending" && venues.length < count
    }
  )
})

const getCityCount = (name: string) => {
  const country = venues.find(c => c.country.name === name)
  if (country) {
    return country.cities.length
  }
}

const getNullVenues = (countryName: string, cityName: string) => {
  const country = venues.find(c => c.country.name === countryName)
  const city = country?.cities.find(c => c.city === cityName)
  if (city?.venues.filter(v => v.name === null).length) {
    return true
  }
  return false
}

const columns: TableColumn<{ country: CountryInterface; city: string; name: string | null; id: string }>[] = [
  {
    id: "expand",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return h(UButton, {
          variant: "link",
          color: "neutral",
          icon: row.getIsExpanded() ? appConfig.ui.icons.minus : appConfig.ui.icons.plus,
          onClick: () => row.toggleExpanded()
        })
      }
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
        icon: sort.value ? (sort.value === "ASC" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => {
          sort.value = sort?.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.depth === 0) {
        const country = row.original.country
        return h(
          "div",
          {
            class: "flex items-center gap-2 mx-auto w-fit"
          },
          [
            h(UIcon, {
              name: country.alpha2 ? `flag:${country.alpha2}-4x3` : `flags:${country.id}`
            }),
            h(
              BaseLink,
              {
                type: "country",
                id: country.id
              },
              () => country.name
            )
          ]
        )
      }
    }
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => {
      if (row.getIsGrouped() && row.depth === 1) {
        if (getNullVenues(row.original.country.name, row.original.city)) {
          return h(
            BaseLink,
            {
              type: "venue",
              id: row.original.city
            },
            () => row.original.city
          )
        }
        return row.original.city
      } else if (row.getIsGrouped() && row.depth === 0) {
        const count = getCityCount(row.original.country.name)
        return `${count} ${count === 1 ? "city" : "cities"}`
      }
    },
    aggregationFn: "uniqueCount"
  },
  {
    accessorKey: "name",
    header: "Venue",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return `${row.getValue("name")} venues`
      } else {
        return h(
          BaseLink,
          {
            type: "venue",
            id: row.original.id
          },
          () => row.original.name
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
</script>

<template>
  <u-table
    ref="table"
    :data="formattedVenues"
    :columns
    class="max-h-200"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    :grouping="['country', 'city']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'min-w-full',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex w-full gap-8"
      >
        <u-skeleton class="h-4 w-full rounded-lg" />
      </div>
    </template>
    <template #empty> No venues found </template>
  </u-table>
</template>
