<script setup lang="ts">
import { UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"

defineProps<{ breadcrumbs: BreadcrumbType[] }>()
const appConfig = useAppConfig()
const toast = useToast()

const skip = ref(0)
const envSort = ref<"ASC" | "DESC" | undefined>()
const surfaceSort = ref<"ASC" | "DESC" | undefined>("ASC")
const surfaces = ref<SurfaceInterface[]>([]) // Initialise surfaces for infinite scroll table

// API call
const { data, status, execute } = await useFetch<SurfacesAPIResponseType>("/api/surfaces/list", {
  query: { skip, envSort, surfaceSort },
  default: () => ({ count: 0, surfaces: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => {
    // Concatenate surfaces for infinite scroll table
    surfaces.value = [...surfaces.value, ...(response._data.surfaces || [])]
  },
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching surfaces",
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

const columns: TableColumn<SurfaceInterface>[] = [
  {
    accessorKey: "environment",
    header: () => {
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Environment",
        icon:
          envSort.value === "ASC"
            ? ICONS.sortAlphaUp
            : envSort.value === "DESC"
            ? ICONS.sortAlphaDown
            : ICONS.sortAlpha,
        onClick: () => {
          surfaces.value = []
          surfaceSort.value = undefined
          envSort.value = envSort?.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    accessorKey: "surface",
    header: () => {
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Surface",
        icon: !surfaceSort.value
          ? ICONS.sortAlpha
          : surfaceSort.value === "ASC"
          ? ICONS.sortAlphaUp
          : ICONS.sortAlphaDown,
        onClick: () => {
          surfaces.value = []
          envSort.value = undefined
          surfaceSort.value = surfaceSort?.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    accessorKey: "navigation",
    header: "",
    cell: ({ row }) => {
      return h(UButton, {
        label: "Go to",
        icon: ICONS.court,
        to: { name: "surface", params: { id: encodeName(row.original.id) } },
        size: "sm"
      })
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
        canLoadMore: () => status.value !== "pending" || surfaces.value.length < data.value.count
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
          :data="surfaces"
          :columns="hydrated ? columns : []"
          class="max-h-200 min-w-2/3 md:min-w-1/2 lg:min-w-1/4 mx-auto"
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
                  v-for="_ in 2"
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
