<script setup lang="ts">
import { UButton, UIcon, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
const { icons } = useAppConfig()
const skip = ref(0)
const selectedLetter = defineModel<string>()
const sort = ref<SortType | undefined>()

const countries = ref<APICountriesResponseType["countries"]>([])

const { data, status, execute } = await useFetch<APICountriesResponseType>("/api/countries", {
  query: { letter: selectedLetter, skip, sort },
  default: () => ({ count: 0, countries: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => (countries.value = [...countries.value, ...(response._data.countries || [])])
})

execute()

// Reset skip and countries when the selected letter or sort options change
watch([sort, selectedLetter], () => {
  skip.value = 0
  countries.value = []
})

const columns: TableColumn<CountryInterface>[] = [
  {
    accessorKey: "country.name",
    header: () =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Country",
        icon:
          sort.value ?
            sort.value === "ASC" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => {
          sort.value = sort.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-default"
      }),
    cell: ({ row }) => {
      const country = row.original
      return h(
        ULink,
        {
          to: {
            name: "country",
            params: { id: country.id, name: encodeName(country.name) }
          }
        },
        () =>
          h(
            "div",
            {
              class: "flex items-center gap-2 w-fit mx-auto"
            },
            [
              h(UIcon, {
                name: getFlagCode(country),
                class: "text-xl"
              }),
              h("span", { class: "hover-link w-fit" }, country.name)
            ]
          )
      )
    }
  }
]

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
        return status.value !== "pending" && data.value?.count > countries.value.length
      }
    }
  )
})
</script>

<template>
  <u-table
    ref="table"
    :data="countries"
    :columns
    class="max-h-200 min-w-2/3 md:min-w-1/2 lg:min-w-1/4 mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    empty="No countries found"
  />
</template>
