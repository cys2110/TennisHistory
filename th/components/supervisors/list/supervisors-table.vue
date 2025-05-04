<script setup lang="ts">
import { BaseLink, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"

defineProps<{ breadcrumbs: BreadcrumbType[] }>()
const appConfig = useAppConfig()
const toast = useToast()

const skip = ref(0)
const sort = ref<"ASC" | "DESC">("ASC")
const supervisors = ref<{ id: string; last_name: string }[]>([]) // Initialise supervisors for infinite scroll table

// API call
const { data, status, execute } = await useFetch<SupervisorsAPIResponseType>(
  "/api/supervisors/list",
  {
    query: { skip, sort },
    default: () => ({ count: 0, supervisors: [] }),
    lazy: true,
    immediate: false,
    onResponse: ({ response }) => {
      // Concatenate supervisors for infinite scroll table
      supervisors.value = [...supervisors.value, ...(response._data.supervisors || [])]
    },
    onResponseError: ({ error }) => {
      toast.add({
        title: "Error fetching supervisors",
        description: error?.message,
        icon: appConfig.ui.icons.error,
        color: "error"
      })
      showError(error!)
    }
  }
)

const columns: TableColumn<{ id: string; last_name: string }>[] = [
  {
    accessorKey: "last_name",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Supervisors",
        icon: isSorted === "asc" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown,
        onClick: () => {
          supervisors.value = []
          sort.value = sort?.value === "ASC" ? "DESC" : "ASC"
        },
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      return h(BaseLink, {
        label: row.original.id,
        type: "supervisor",
        id: row.original.id
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
        canLoadMore: () => status.value !== "pending" || supervisors.value.length < data.value.count
      }
    )
  } else {
    console.warn("Table element not ready for infinite scroll")
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
          :data="supervisors"
          :columns="hydrated ? columns : []"
          class="max-h-175 w-fit mx-auto"
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
                <u-skeleton class="h-4 w-full rounded-lg" />
              </div>
            </div>
          </template>
          <template #empty> No supervisors found </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
