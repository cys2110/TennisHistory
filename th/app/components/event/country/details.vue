<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"

const {
  params: { eid, year }
} = useRoute("event")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const tournamentName = useState<string>("tournament-name")

// API call
const { data: event, status } = await useFetch<EventInterface>("/api/events/country-details", {
  key: `event-details-${eid}`,
  query: { id: eid },
  server: false,
  lazy: false
})

const columns: TableColumn<{ label: string; value: string }>[] = [
  { id: "label", header: "" },
  { id: "value", header: "" }
]
</script>

<template>
  <dashboard-subpanel
    id="details"
    title="Details"
    :icon="icons.overview"
  >
    <client-only>
      <u-table
        v-if="['pending', 'idle'].includes(status) || !event"
        :data="[]"
        :columns
        :loading="['pending', 'idle'].includes(status)"
        class="lg:max-w-1/3 mx-auto"
      >
        <template #loading>
          <u-icon
            :name="uIcons.loading"
            class="size-8"
          />
        </template>
        <template #empty>
          <div class="flex justify-center items-center w-full gap-2 text-error">
            <u-icon
              :name="uIcons.caution"
              class="text-base"
            />
            No details found for {{ tournamentName }} {{ year }}
          </div>
        </template>
      </u-table>
      <table
        v-else
        class="w-1/3 min-w-fit mx-auto"
      >
        <tbody class="[&>tr]:border-y [&>tr]:border-muted [&>tr>td]:p-2 [&>tr>td]:text-sm [&>tr>th]:text-sm [&>tr>th]:text-muted">
          <tr>
            <th>Dates</th>
            <td class="flex flex-col gap-1">
              {{ dateTimeFormat.formatRange(getDate(event.start_date), getDate(event.end_date)) }}
            </td>
          </tr>
          <tr v-if="event?.surface">
            <th>Surface</th>
            <td>
              <u-link
                :to="{ name: 'surface', params: { id: kebabCase(event.surface.id) } }"
                class="hover-link default-link w-fit"
              >
                {{ event.surface.id }}
              </u-link>
            </td>
          </tr>
          <tr v-if="event?.venues.length">
            <th>Venues</th>
            <td class="flex flex-col gap-1">
              <div
                v-for="venue in event.venues"
                :key="venue.id"
                class="flex items-center gap-2"
              >
                <u-link
                  :to="{ name: 'venue', params: { id: kebabCase(venue.id) } }"
                  class="hover-link default-link w-fit"
                >
                  {{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}
                </u-link>
                <country-link :country="venue.country" />
              </div>
            </td>
          </tr>
          <tr v-if="event?.supervisors.length">
            <th>Supervisors</th>
            <td class="flex flex-col gap-1">
              <u-link
                v-for="supervisor in event.supervisors"
                :key="supervisor.id"
                class="hover-link default-link w-fit"
                :to="{ name: 'supervisor', params: { id: kebabCase(supervisor.id) } }"
              >
                {{ supervisor.id }}
              </u-link>
            </td>
          </tr>
          <tr v-if="event.tfc">
            <th>Total Financial Commitment</th>
            <td class="flex flex-col gap-1">
              {{ event.tfc.toLocaleString("en-US", { style: "currency", currency: event.currency }) }}
            </td>
          </tr>
        </tbody>
      </table>
    </client-only>
  </dashboard-subpanel>
</template>
