<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"

const { eventDetails, status } = defineProps<{
  eventDetails: {
    id: string
    title: string
    value: any
  }[]
  status: APIStatusType
}>()

const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const columns: TableColumn<{ title: string; value: any; id: string }>[] = [
  {
    accessorKey: "title",
    header: ""
  },
  {
    id: "value",
    meta: { class: { td: "font-semibold" } }
  }
]
</script>

<template>
  <u-table
    :data="eventDetails"
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
        v-if="row.original.id === 'supervisors'"
        class="flex flex-col gap-1 mx-auto w-fit"
      >
        <base-link
          v-if="row.original.value.length"
          v-for="supervisor in row.original.value"
          :key="supervisor"
          :id="supervisor"
          type="supervisor"
          class="mx-auto"
        />
        <template v-else>—</template>
      </div>
      <div
        v-else-if="row.original?.id === 'venues'"
        class="flex flex-col gap-2 mx-auto w-fit"
      >
        <div
          v-for="venue in row.original.value"
          :key="venue.id"
          class="flex items-center gap-2 mx-auto w-fit"
        >
          <base-link
            type="venue"
            :id="venue.id"
            >{{ venue.name }}</base-link
          >
          <base-link
            type="country"
            :country="venue.country"
          />
        </div>
      </div>
      <div v-else-if="['Category', 'Surface'].includes(row.original.title)">
        <base-link
          :type="row.original.title.toLowerCase()"
          :id="row.original.title === 'Category' ? row.original.value : row.original.value.id"
        />
      </div>
      <div v-else>
        {{ row.original?.value }}
      </div>
    </template>
  </u-table>
</template>
