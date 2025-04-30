<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const { index, status } = defineProps<{
  index: WLIndexInterface[] | null
  status: "pending" | "idle" | "error" | "success"
}>()
const appConfig = useAppConfig()

const formattedIndex = computed(() => {
  if (index) {
    return Object.values(
      index.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = {
            category: item.category,
            stats: []
          }
        }
        acc[item.category].stats.push(item)
        return acc
      }, {} as Record<CategoryEnum, { category: CategoryEnum; stats: WLIndexInterface[] }>)
    )
  }
  return []
})

const columns: TableColumn<WLIndexInterface>[] = [
  { accessorKey: "stat", header: "" },
  { accessorKey: "wins", header: "Wins" },
  { accessorKey: "losses", header: "Losses" },
  { accessorFn: row => row.titles ?? "—", header: "Titles" },
  { accessorKey: "value", header: "Index" }
]
</script>

<template>
  <u-collapsible
    v-for="(indice, index) in formattedIndex"
    :key="indice.category"
    :default-open="index === 0"
    class="w-full lg:w-1/2 mx-auto"
  >
    <u-button
      class="group my-2"
      :label="indice.category"
      color="neutral"
      :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
      block
      :trailing-icon="appConfig.ui.icons.chevronDown"
    />

    <template #content>
      <u-table
        :data="indice.stats || []"
        :columns
        sticky
        class="w-full mx-auto"
        :loading="['pending', 'idle'].includes(status)"
      >
        <template #empty>
          <div
            v-if="['pending', 'idle'].includes(status)"
            class="flex flex-col gap-4"
          >
            <div
              v-for="_ in 6"
              :key="_"
              class="flex gap-8"
            >
              <u-skeleton
                v-for="_ in 6"
                :key="_"
                class="h-4 w-full rounded-lg"
              />
            </div>
          </div>
          <template v-else>No index available</template>
        </template>
      </u-table>
    </template>
  </u-collapsible>
</template>
