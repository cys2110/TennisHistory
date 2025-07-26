<script setup lang="ts">
import { CalendarDate } from "@internationalized/date"
import type { TableColumn } from "@nuxt/ui"
const { event } = defineProps<{ event: EventInterface; status: APIStatusType }>()
const tours = inject<TourType[]>("tours", [])
const { params } = useRoute()
const { year } = params as { year: string }

// TODO: Update for men/women
type EventDetailsType = { id: string; title: string; value: any; atp?: string; wta?: string }

const eventDetails = computed(() => {
  if (event) {
    return [
      {
        id: "name",
        title: "Sponsor Name",
        value: event.sponsor_name ?? "—"
      },
      { id: "category", title: "Category", value: event.category ?? event.atp_category ?? event.wta_category },
      {
        id: "surface",
        title: "Surface",
        value: event.surface
      },
      {
        id: "venues",
        title: event.venues?.length === 1 ? "Venue" : "Venues",
        value: event.venues
      },
      {
        id: "supervisors",
        title: event.supervisors?.length === 1 ? "Supervisor" : "Supervisors",
        value: event.supervisors
      },
      {
        id: "pm",
        title: "Prize Money",
        value: event.currency && event.pm ? `${CURRENCIES[event.currency]}${event.pm}` : undefined,
        atp: `${CURRENCIES[event.atp_currency!]}${event.atp_pm}`
      },
      {
        id: "tfc",
        title: "Total Financial Commitment",
        value: event.currency && event.tfc ? `${CURRENCIES[event.currency]}${event.tfc}` : undefined,
        atp: `${CURRENCIES[event.atp_currency!]}${event.atp_tfc}`,
        wta: `${CURRENCIES[event.wta_currency!]}${event.wta_tfc}`
      }
    ] as EventDetailsType[]
  }
  return []
})

const columns: TableColumn<EventDetailsType>[] = [
  {
    accessorKey: "title",
    header: ""
  },
  {
    id: "value",
    meta: { class: { td: "font-semibold" } }
  }
]

const calendarDate = computed(() => {
  let jointDate
  let atpDate
  let wtaDate
  if (event.start_date && event.end_date) {
    const {
      start_date: { year: startYear, month: startMonth, day: startDay },
      end_date: { year: endYear, month: endMonth, day: endDay }
    } = event
    jointDate = {
      start: new CalendarDate(startYear, startMonth, startDay),
      end: new CalendarDate(endYear, endMonth, endDay)
    }
  }
  if (event.atp_start_date && event.atp_end_date) {
    const {
      atp_start_date: { year: atpStartYear, month: atpStartMonth, day: atpStartDay },
      atp_end_date: { year: atpEndYear, month: atpEndMonth, day: atpEndDay }
    } = event
    atpDate = {
      start: new CalendarDate(atpStartYear, atpStartMonth, atpStartDay),
      end: new CalendarDate(atpEndYear, atpEndMonth, atpEndDay)
    }
  }
  if (event.wta_start_date && event.wta_end_date) {
    const {
      wta_start_date: { year: wtaStartYear, month: wtaStartMonth, day: wtaStartDay },
      wta_end_date: { year: wtaEndYear, month: wtaEndMonth, day: wtaEndDay }
    } = event
    wtaDate = {
      start: new CalendarDate(wtaStartYear, wtaStartMonth, wtaStartDay),
      end: new CalendarDate(wtaEndYear, wtaEndMonth, wtaEndDay)
    }
  }
  return {
    joint: jointDate,
    atp: atpDate,
    wta: wtaDate
  }
})
</script>

<template>
  <div class="flex gap-8 justify-evenly">
    <u-table
      :data="eventDetails"
      :columns
      :loading="status === 'pending'"
      :empty="`No details found for ${event.tournament.name} ${year}`"
      class="my-auto"
    >
      <template #value-cell="{ row }">
        <div
          v-if="row.original.id === 'supervisors'"
          class="flex flex-col gap-1 mx-auto w-fit"
        >
          <u-link
            v-if="row.original.value?.length"
            v-for="supervisor in row.original.value"
            :key="supervisor"
            :to="{ name: 'supervisor', params: { id: kebabCase(supervisor) } }"
            class="hover-link"
          >
            {{ supervisor }}
          </u-link>
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
            <u-link
              :to="{ name: 'venue', params: { id: kebabCase(venue.id) } }"
              class="hover-link"
            >
              {{ venue.name }}
            </u-link>
            <country-link :country="venue.country" />
          </div>
        </div>
        <template v-else-if="['Category', 'Surface'].includes(row.original.title)">
          <u-link
            v-if="row.original.value"
            :to="{ name: row.original.title.toLowerCase(), params: { id: kebabCase(row.original.value.id || row.original.value) } }"
            :id="row.original.title === 'Category' ? row.original.value : row.original.value.id"
            :class="row.original.title === 'Category' ? getTourColor(tours) : 'hover-link'"
          >
            {{ row.original.value.id ?? row.original.value }}
          </u-link>
          <div
            v-else
            class="flex flex-col items-center"
          >
            <u-link
              :to="{ name: row.original.title.toLowerCase(), params: { id: kebabCase(row.original.atp!) } }"
              class="atp-link"
            >
              {{ row.original.atp }}
            </u-link>
            <u-link
              :to="{ name: row.original.title.toLowerCase(), params: { id: kebabCase(row.original.wta!) } }"
              class="wta-link"
            >
              {{ row.original.wta }}
            </u-link>
          </div>
        </template>
        <div
          v-else
          class="flex flex-col items-center"
        >
          <span :class="{ 'text-atp': !row.original.value }">{{ row.original.value ?? row.original.atp }}</span>
          <span
            v-if="!row.original.value"
            class="text-wta"
            >{{ row.original.wta }}</span
          >
        </div>
      </template>
    </u-table>
    <u-calendar
      v-if="event.start_date"
      v-model="calendarDate.joint"
      :color="getTourColor(tours)"
      range
      disabled
      class="my-auto"
    />
    <template v-else>
      <u-calendar
        v-model="calendarDate.atp"
        range
        color="atp"
        size="xs"
        disabled
        class="my-auto"
      />
      <u-calendar
        v-model="calendarDate.wta"
        range
        color="wta"
        size="xs"
        disabled
        class="my-auto"
      />
    </template>
  </div>
</template>
