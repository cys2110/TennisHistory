<script setup lang="ts">
const {
  params: { eid, year }
} = useRoute("event")
const { icons } = useAppConfig()
const tournamentName = useState<string>("tournament-name")
const tours = useState<TourType[]>("tours")

// API call
const { data: event, status } = await useFetch<EventInterface>("/api/events/details", {
  key: `event-details-${eid}`,
  query: { id: eid },
  server: false,
  lazy: false
})
</script>

<template>
  <dashboard-subpanel
    id="details"
    title="Details"
    :icon="icons.overview"
  >
    <u-page-columns v-if="event">
      <details-card
        v-if="event.sponsor_name"
        title="Sponsor Name"
        :value="event.sponsor_name"
        :tour="tours"
      />

      <details-card
        v-if="useArraySome(event.categories, c => isDefined(c))"
        title="Category"
        :tour="tours"
      >
        <div class="flex flex-col gap-1 items-center">
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
        </div>
      </details-card>

      <details-card
        title="Dates"
        :tour="tours"
      >
        <template
          v-for="(date, index) in event.dates"
          :key="`date-${index}`"
        >
          <div
            v-if="date[0] && date[1]"
            :class="`text-${tourColourMapping[index]}`"
          >
            {{ dateTimeFormat.formatRange(getDate(date[0]), getDate(date[1])) }}
          </div>
        </template>
      </details-card>

      <details-card
        v-if="event.surface"
        title="Surface"
        :tour="tours"
      >
        <u-link
          class="hover-link default-link"
          :to="{ name: 'surface', params: { id: kebabCase(event.surface.id) } }"
        >
          {{ event.surface.id }}
        </u-link>
      </details-card>

      <details-card
        v-if="event.venues.length"
        :title="event.venues.length === 1 ? 'Venue' : 'Venues'"
        :tour="tours"
      >
        <template #icon>
          <country-link :country="event.venues[0]!.country" />
        </template>

        <div class="flex flex-col">
          <u-link
            v-for="venue in event.venues"
            :key="venue.id"
            class="hover-link default-link w-fit mx-auto"
            :to="{ name: 'venue', params: { id: kebabCase(venue.id) } }"
          >
            {{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}
          </u-link>
        </div>
      </details-card>

      <details-card
        v-if="event.supervisors.length"
        :title="event.supervisors.length === 1 ? 'Supervisor' : 'Supervisors'"
        :tour="tours"
      >
        <div class="flex flex-col">
          <u-link
            v-for="supervisor in event.supervisors"
            :key="supervisor.id"
            class="hover-link default-link w-fit mx-auto"
            :to="{ name: 'supervisor', params: { id: kebabCase(supervisor.id) } }"
          >
            {{ supervisor.id }}
          </u-link>
        </div>
      </details-card>

      <details-card
        v-if="useArraySome(event.pm, p => isDefined(p))"
        title="Prize Money"
        :tour="tours"
      >
        <div class="flex flex-col">
          <template
            v-for="(pm, index) in event.pm"
            :key="`pm-${index}`"
          >
            <div
              v-if="pm"
              :class="`text-${tourColourMapping[index]}`"
            >
              {{ pm.toLocaleString("en-GB", { style: "currency", currency: event.currencies[index] }) }}
            </div>
          </template>
        </div>
      </details-card>

      <details-card
        v-if="useArraySome(event.tfc, p => isDefined(p))"
        title="Total Financial Commitment"
        :tour="tours"
      >
        <div class="flex flex-col">
          <template
            v-for="(tfc, index) in event.tfc"
            :key="`tfc-${index}`"
          >
            <div
              v-if="tfc"
              :class="`text-${tourColourMapping[index]}`"
            >
              {{ tfc.toLocaleString("en-GB", { style: "currency", currency: event.currencies[index] }) }}
            </div>
          </template>
        </div>
      </details-card>
    </u-page-columns>
    <u-page-columns v-else-if="['idle', 'pending'].includes(status)">
      <loading-base
        v-for="_ in 10"
        :key="_"
      />
    </u-page-columns>
    <error-message
      v-else
      :message="`No details found for ${tournamentName} ${year}`"
    />
  </dashboard-subpanel>
</template>
