<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"

const { playerDetails, status, coaches, countries } = defineProps<{
  playerDetails: {
    title: string
    value: any
    description?: string
  }[]
  status: APIStatusType
  coaches: PlayerDetailsType["coaches"] | undefined
  countries: PlayerDetailsType["countries"] | undefined
}>()

const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const formattedData = computed(() => {
  if (playerDetails.length) {
    const newArray = [...playerDetails]
    if (coaches?.length) newArray.push({ title: coaches.length === 1 ? "Coach" : "Coaches", value: coaches })
    if (countries?.length) newArray.push({ title: "Previous Representations", value: countries })
    return newArray
  }
  return []
})

const columns: TableColumn<{ title: string; value: any; description?: string | null } | null>[] = [
  { accessorKey: "title", header: "" },
  { id: "value", meta: { class: { td: "font-semibold" } } }
]
</script>

<template>
  <u-table
    :data="formattedData"
    :columns
    class="max-h-200"
    :loading="['pending', 'idle'].includes(status)"
    sticky
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
    <template #empty> No details found for {{ name }} </template>

    <template #value-cell="{ row }">
      <div
        v-if="row.original?.title && ['Coach', 'Coaches'].includes(row.original.title)"
        class="flex flex-col gap-1 mx-auto w-fit"
      >
        <base-link
          v-for="coach in row.original.value"
          :key="coach.id"
          :id="coach.id"
          type="coach"
          class="mx-auto"
        >
          {{ coach.name ?? coach.id }}
        </base-link>
      </div>
      <div
        v-else-if="row.original?.title === 'Previous Representations'"
        class="flex flex-col gap-2 mx-auto w-fit"
      >
        <div
          v-for="country in row.original.value"
          :key="country.id"
          class="flex flex-col gap-1 mx-auto w-fit"
        >
          <div class="flex gap-2 items-center w-fit mx-auto">
            <base-link
              type="country"
              :country
            />
            <u-link
              class="hover-link w-fit"
              :to="{ name: 'country', params: { id: country.id } }"
            >
              {{ country.name }}
            </u-link>
          </div>
          <div>{{ country.dates }}</div>
        </div>
      </div>
      <div
        v-else
        class="flex flex-col gap-1 mx-auto w-fit"
      >
        <span>{{ row.original?.value }}</span>
        <span
          v-if="row.original?.description"
          class="font-medium text-xs"
          >{{ row.original.description }}</span
        >
      </div>
    </template>
  </u-table>
</template>
