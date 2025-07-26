<script setup lang="ts">
const { event } = defineProps<{ event: EventInterface }>()
const { icons } = useAppConfig()
const { name } = useRoute()

const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric"
})

const tours = ["atp", "wta", "men", "women"]

const dateKeys = computed(() => tours.filter(tour => event[`${tour}_start_date` as keyof EventInterface]))

const categoryKeys = computed(() => tours.filter(tour => event[`${tour}_category` as keyof EventInterface]))

const drawKeys = computed(() =>
  tours.filter(tour => event[`${tour}_draw_s` as keyof EventInterface] || event[`${tour}_draw_d` as keyof EventInterface])
)

const eventStartDate = computed(() => {
  if (event.start_date) {
    return event.start_date
  }
  const sortedDateKeys = dateKeys.value
    .map(key => {
      const date = event[`${key}_start_date` as keyof EventInterface]
      const dateString = `${(date as DateType).year}-${(date as DateType).month}-${(date as DateType).day}`
      return dateString
    })
    .sort((a, b) => {
      return a.localeCompare(b)
    })
  return sortedDateKeys[0]
})
</script>

<template>
  <u-page-card
    highlight
    :highlight-color="getTourColor(event.tours)"
    reverse
    :ui="{
      root: 'h-full',
      description: 'text-sm flex flex-col gap-1',
      wrapper: 'order-last flex flex-col items-start',
      body: 'flex-1 w-full',
      footer: 'mx-auto'
    }"
  >
    <!--Need 'order-last' class for smaller screens and 'h-full' to make all cards the same height-->

    <!--Surface-->
    <u-link
      v-if="event.surface && name !== 'surface'"
      :to="{ name: 'surface', params: { id: kebabCase(event.surface.id) } }"
    >
      <nuxt-img
        :src="`/surfaces/${event.surface.surface}.jpg`"
        :alt="event.surface.id"
        class="opacity-75 rounded-lg"
      />
    </u-link>
    <nuxt-img
      v-else
      :src="`/surfaces/${event.surface?.surface ?? 'Court'}.${event.surface ? 'jpg' : 'png'}`"
      :alt="event.surface?.surface ?? 'Various'"
      class="opacity-55 rounded-lg"
    />

    <!--Country-->
    <template #leading>
      <country-link
        v-if="event.venues.length"
        :country="event.venues?.[0]?.country!"
      />
      <u-icon
        v-else
        :name="icons.countries"
      />
    </template>

    <!--Tournament-->
    <template #title>
      <u-link
        :to="{ name: 'tournament', params: { id: event.tournament.id, name: kebabCase(event.tournament.name) } }"
        class="hover-link"
      >
        {{ event.tournament.name }}
      </u-link>
    </template>

    <template #description>
      <!--Sponsor name-->
      <div v-if="event.sponsor_name">{{ event.sponsor_name }}</div>

      <!--Category-->
      <u-link
        v-if="event.category"
        class="w-fit hover-link"
        :to="{ name: 'category', params: { id: kebabCase(event.category) } }"
      >
        {{ event.category }}
      </u-link>
      <div
        v-else
        class="flex flex-wrap items-center gap-1"
      >
        <template
          v-for="(tour, index) in categoryKeys"
          :key="`category-${tour}`"
        >
          <u-separator
            v-if="index > 0"
            class="h-4"
            orientation="vertical"
          />
          <u-link
            :to="{ name: 'category', params: { id: kebabCase(event[`${tour}_category` as keyof EventInterface]! as string) } }"
            :class="`${tour}-link`"
          >
            {{ event[`${tour}_category` as keyof EventInterface] }}
          </u-link>
        </template>
      </div>

      <!--Dates-->
      <div class="flex flex-wrap items-center gap-1">
        <div v-if="event.start_date && event.end_date">{{ dateTimeFormat.formatRange(getDate(event.start_date), getDate(event.end_date)) }}</div>
        <div
          v-else
          class="flex flex-wrap items-center gap-1"
        >
          <template
            v-for="(tour, index) in dateKeys"
            :key="tour"
          >
            <u-separator
              v-if="index > 0"
              class="h-4"
              orientation="vertical"
            />
            <span :class="`text-${tour}`">{{
              dateTimeFormat.formatRange(
                getDate(event[`${tour}_start_date` as keyof EventInterface] as DateType),
                getDate(event[`${tour}_end_date` as keyof EventInterface] as DateType)
              )
            }}</span>
          </template>
        </div>
      </div>

      <!--Venues-->
      <div v-if="event.venues?.length">
        <div
          v-for="(venue, index) in event.venues"
          :key="venue.id"
          class="flex flex-wrap gap-1 items-center"
        >
          <u-link
            :to="{ name: 'venue', params: { id: kebabCase(venue.id) } }"
            class="hover-link"
          >
            {{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}
          </u-link>
          <u-separator
            v-if="index < event.venues.length - 1"
            class="h-4"
            orientation="vertical"
          />
        </div>
      </div>

      <!--Draws-->
      <div class="flex items-center justify-between gap-2 w-full text-xs">
        <div class="flex gap-1 items-center">
          <u-icon :name="icons.person" />
          <div class="flex flex-wrap gap-1 items-center">
            <u-icon
              v-if="event.draw_type"
              :name="icons.countries"
            />
            <template
              v-else
              v-for="(tour, index) in drawKeys"
              :key="`draw-${tour}`"
            >
              <u-separator
                v-if="index > 0 && drawKeys.length > 1"
                class="h-4"
                orientation="vertical"
              />
              <span :class="`text-${tour}`">{{ SHORT_ROUNDS[event[`${tour}_draw_s` as keyof EventInterface] as keyof typeof SHORT_ROUNDS] }}</span>
            </template>
          </div>
        </div>

        <div class="flex gap-1 items-center">
          <u-icon :name="icons.people" />
          <div class="flex flex-wrap gap-1 items-center">
            <u-icon
              v-if="event.draw_type"
              :name="icons.countries"
            />
            <template
              v-else
              v-for="(tour, index) in drawKeys"
              :key="`draw-${tour}`"
            >
              <u-separator
                v-if="index > 0 && drawKeys.length > 1"
                class="h-4"
                orientation="vertical"
              />
              <span :class="`text-${tour}`">{{ SHORT_ROUNDS[event[`${tour}_draw_d` as keyof EventInterface] as keyof typeof SHORT_ROUNDS] }}</span>
            </template>
          </div>
        </div>
      </div>
    </template>

    <!--Navigate to event pages-->
    <template #footer>
      <event-buttons
        :tournament="event.tournament"
        :year="event.year"
        :id="event.id"
        :start_date="eventStartDate as DateType"
      />
    </template>
  </u-page-card>
</template>
