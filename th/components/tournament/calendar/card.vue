<script setup lang="ts">
const { event } = defineProps<{ event: EventCardType }>()
const { icons } = useAppConfig()
</script>

<template>
  <u-page-card
    highlight
    :highlight-color="getTourColours(event.tours).cardColour"
    reverse
    :ui="{
      root: 'h-full',
      description: 'text-sm flex flex-col gap-1',
      wrapper: 'order-last flex flex-col items-start',
      body: 'flex-1'
    }"
  >
    <!--Need 'order-last' class for smaller screens and 'h-full' to make all cards the same height-->

    <!--Surface-->
    <u-link
      v-if="event.surface"
      :to="{ name: 'surface', params: { id: encodeName(event.surface.id) } }"
    >
      <nuxt-img
        :src="`/surfaces/${event.surface.surface}.jpg`"
        :alt="event.surface.id"
        class="opacity-75 rounded-lg"
      />
    </u-link>
    <nuxt-img
      v-else
      src="/surfaces/Court.png"
      :alt="event.surface"
      class="opacity-75 rounded-lg"
    />

    <!--Country-->
    <template #leading>
      <u-link
        v-if="event.venues.length"
        :to="{ name: 'country', params: { id: event.venues[0].country.id, name: encodeName(event.venues[0].country.name) } }"
      >
        <u-icon
          :name="getFlagCode(event.venues[0].country)"
          class="text-xl"
        />
      </u-link>
      <u-icon
        v-else
        :name="icons.countries"
      />
    </template>

    <!--Tournament-->
    <template #title>
      <u-link
        :to="{ name: 'tournament', params: { id: event.tournament.id, name: encodeName(event.tournament.name) } }"
        class="hover-link"
      >
        {{ event.tournament.name }}
      </u-link>
    </template>

    <template #description>
      <!--Sponsor name-->
      <div v-if="event.name">{{ event.name }}</div>

      <!--Category-->
      <u-link
        v-if="event.category"
        :to="{ name: 'category', params: { id: encodeName(event.category) } }"
        :class="getTourColours(event.tours).hoverClass"
        class="w-fit"
      >
        {{ event.category }}
      </u-link>
      <div
        v-else
        class="flex flex-wrap items-center gap-1"
      >
        <u-link
          :class="atpClass"
          :to="{ name: 'category', params: { id: encodeName(event.atp_category!) } }"
          >{{ event.atp_category }}</u-link
        >
        <u-separator
          class="h-4"
          orientation="vertical"
        />
        <u-link
          :class="wtaClass"
          :to="{ name: 'category', params: { id: encodeName(event.wta_category!) } }"
        >
          {{ event.wta_category }}
        </u-link>
      </div>

      <!--Dates-->
      <div v-if="event.dates">{{ event.dates }}</div>
      <div
        v-else
        class="flex flex-wrap items-center gap-1"
      >
        <span class="text-atp">{{ event.atp_dates }}</span>
        <u-separator
          class="h-4"
          orientation="vertical"
        />
        <span class="text-wta">{{ event.wta_dates }}</span>
      </div>

      <!--Venues-->
      <div
        v-if="event.venues.length"
        class="flex flex-wrap gap-1"
      >
        <div
          v-for="(venue, index) in event.venues"
          :key="venue.id"
          class="flex flex-wrap gap-1 items-center"
        >
          <u-link :to="{ name: 'venue', params: { id: encodeName(venue.id) } }">
            {{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}
          </u-link>
          <u-separator
            v-if="index < event.venues.length - 1"
            class="h-4"
            orientation="vertical"
          />
        </div>
      </div>
      <div v-else>Various locations</div>
    </template>

    <!--Navigate to event pages-->
    <template #footer>
      <event-buttons
        :tournament="event.tournament"
        :year="event.year"
        :id="event.id"
        :start_date="event.start_date"
      />
    </template>
  </u-page-card>
</template>
