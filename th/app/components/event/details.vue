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
const { data: event, status } = await useFetch<EventInterface>("/api/events/details", {
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
        <tbody>
          <tr v-if="event?.sponsor_name || event?.atp_sponsor_name || event?.wta_sponsor_name">
            <th>Sponsor Name</th>
            <td class="flex flex-col gap-1">
              <template
                v-for="(sponsorName, index) in [event.sponsor_name, event.atp_sponsor_name, event.wta_sponsor_name]"
                :key="`sponsorName-${index}`"
              >
                <div
                  v-if="sponsorName"
                  :class="`text-${tourColourMapping[index]}`"
                >
                  {{ sponsorName }}
                </div>
              </template>
            </td>
          </tr>
          <tr v-if="useArraySome(event?.categories, (category: CategoryType | undefined) => isDefined(category))">
            <th>Category</th>
            <td class="flex flex-col gap-1">
              <template
                v-for="(category, index) in event.categories"
                :key="category"
              >
                <u-link
                  v-if="category"
                  :to="{ name: 'category', params: { id: kebabCase(category) } }"
                  class="hover-link w-fit"
                  :class="`${tourColourMapping[index]}-link`"
                >
                  {{ category }}
                </u-link>
              </template>
            </td>
          </tr>
          <tr>
            <th>Dates</th>
            <td class="flex flex-col gap-1">
              <template
                v-for="(date, index) in event.dates"
                :key="`date-${index}`"
              >
                <div
                  v-if="useArrayEvery(date, (d: DateType | undefined) => isDefined(d)).value"
                  :class="`text-${tourColourMapping[index]}`"
                >
                  {{ dateTimeFormat.formatRange(getDate(date[0]!), getDate(date[1]!)) }}
                </div>
              </template>
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
          <tr v-if="useArraySome(event?.pm, (p: number | undefined) => isDefined(p))">
            <th>Prize Money</th>
            <td class="flex flex-col gap-1">
              <template
                v-for="(p, index) in event.pm"
                :key="`pm-${index}`"
              >
                <div
                  v-if="isDefined(p)"
                  :class="`text-${tourColourMapping[index]}`"
                >
                  {{ p.toLocaleString("en-GB", { style: "currency", currency: event.currencies[index] }) }}
                </div>
              </template>
            </td>
          </tr>
          <tr v-if="useArraySome(event?.tfc, (p: number | undefined) => isDefined(p))">
            <th>Total Financial Commitment</th>
            <td class="flex flex-col gap-1">
              <template
                v-for="(p, index) in event.tfc"
                :key="`tfc-${index}`"
              >
                <div
                  v-if="isDefined(p)"
                  :class="`text-${tourColourMapping[index]}`"
                >
                  {{ p.toLocaleString("en-GB", { style: "currency", currency: event.currencies[index] }) }}
                </div>
              </template>
            </td>
          </tr>
          <tr>
            <th>Draws</th>
            <td class="flex flex-col gap-1">
              <template
                v-for="(draw, index) in event.draws"
                :key="`draw-${index}`"
              >
                <div
                  v-if="useArrayEvery(draw, (d: string | null) => isDefined(d)).value"
                  :class="`text-${tourColourMapping[index]}`"
                  class="flex items-center gap-2"
                >
                  <u-icon
                    v-if="draw[0]"
                    :name="icons.person"
                    class="size-4"
                  />
                  <span v-if="draw[0]">{{ draw[0] }}</span>
                  <span v-if="draw.length === 2"> | </span>
                  <u-icon
                    v-if="draw[1]"
                    :name="icons.people"
                    class="size-5"
                  />
                  <span v-if="draw[1]">{{ draw[1] }}</span>
                </div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </client-only>
  </dashboard-subpanel>
</template>

<style scoped>
@reference "../../assets/css/main.css";

tr {
  @apply border-y border-muted;
}

td {
  @apply p-2 text-sm;
}

th {
  @apply text-sm text-muted;
}
</style>
