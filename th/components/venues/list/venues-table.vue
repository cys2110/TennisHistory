<script setup lang="ts">
import { BaseLink, CountryLink, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"

defineProps<{ breadcrumbs: BreadcrumbType[] }>()
const appConfig = useAppConfig()
const toast = useToast()

const skip = ref(0)
const nameSort = ref<"ASC" | "DESC" | undefined>()
const citySort = ref<"ASC" | "DESC" | undefined>()
const countrySort = ref<"ASC" | "DESC" | undefined>("ASC")
const venues = ref<VenueInterface[]>([]) // Initialise venues for infinite scroll table

// API call
const { data, status, execute } = await useFetch<{ count: number; venues: VenueInterface[] }>(
  "/api/venues/list",
  {
    query: { skip, nameSort, citySort, countrySort },
    default: () => ({ count: 0, venues: [] }),
    lazy: true,
    immediate: false,
    onResponse: ({ response }) => {
      // Concatenate venues for infinite scroll table
      venues.value = [...venues.value, ...(response._data.venues || [])]
    },
    onResponseError: ({ error }) => {
      toast.add({
        title: "Error fetching venues",
        description: error?.message,
        icon: appConfig.ui.icons.error,
        color: "error"
      })
      showError(error!)
    }
  }
)

const columns: TableColumn<VenueInterface>[] = [
  {
    accessorKey: "name",
    header: () => {
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Name",
        icon:
          nameSort.value === "ASC"
            ? ICONS.sortAlphaUp
            : nameSort.value === "DESC"
            ? ICONS.sortAlphaDown
            : ICONS.sortAlpha,
        onClick: () => {
          venues.value = []
          citySort.value = undefined
          countrySort.value = undefined
          nameSort.value = nameSort?.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      if (row.original.name) {
        return h(
          BaseLink,
          {
            type: "venue",
            id: row.original.id
          },
          () => row.original.name
        )
      } else {
        return "—"
      }
    }
  },
  {
    accessorKey: "city",
    header: () => {
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "City",
        icon:
          citySort.value === "ASC"
            ? ICONS.sortAlphaUp
            : citySort.value === "DESC"
            ? ICONS.sortAlphaDown
            : ICONS.sortAlpha,
        onClick: () => {
          venues.value = []
          nameSort.value = undefined
          countrySort.value = undefined
          citySort.value = citySort?.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      if (row.original.name) {
        return row.original.city
      } else {
        return h(BaseLink, {
          type: "venue",
          id: row.original.id
        })
      }
    }
  },
  {
    accessorKey: "country",
    header: () => {
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Country",
        icon:
          countrySort.value === "ASC"
            ? ICONS.sortAlphaUp
            : countrySort.value === "DESC"
            ? ICONS.sortAlphaDown
            : ICONS.sortAlpha,
        onClick: () => {
          venues.value = []
          nameSort.value = undefined
          citySort.value = undefined
          countrySort.value = countrySort?.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      return h(
        "div",
        {
          class: "flex items-center gap-2 mx-auto w-fit"
        },
        [
          h(CountryLink, {
            country: row.original.country
          }),
          h(
            BaseLink,
            {
              type: "country",
              id: row.original.country.id
            },
            () => row.original.country.name
          )
        ]
      )
    }
  }
]

execute()

const table = useTemplateRef<ComponentPublicInstance>("table")

const hydrated = ref(false)

onMounted(async () => {
  hydrated.value = true
  await nextTick()

  if (table.value?.$el) {
    useInfiniteScroll(
      table.value.$el,
      () => {
        skip.value += 25
      },
      {
        distance: 200,
        canLoadMore: () => status.value !== "pending" || venues.value.length < data.value.count
      }
    )
  }
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #title>
            <u-breadcrumb :items="breadcrumbs" />
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <u-table
          ref="table"
          :data="venues"
          :columns="hydrated ? columns : []"
          class="max-h-190 w-full"
          :loading="['pending', 'idle'].includes(status)"
          sticky
          :key="`${hydrated ? 'hydrated' : 'loading'}`"
        >
          <template #loading>
            <div class="flex flex-col gap-4">
              <div
                v-for="_ in 6"
                :key="_"
                class="flex gap-8"
              >
                <u-skeleton
                  v-for="_ in 3"
                  :key="_"
                  class="h-4 w-1/2 rounded-lg"
                />
              </div>
            </div>
          </template>
          <template #empty> No surfaces found </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
