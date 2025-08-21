<script setup lang="ts">
const { event } = defineProps<{ event: EventInterface }>()
const { icons } = useAppConfig()

const tours = ["atp", "wta", "men", "women"]

const dateKeys = computed(() => tours.filter(tour => event[`${tour}_start_date` as keyof EventInterface]))

const categoryKeys = computed(() => tours.filter(tour => event[`${tour}_category` as keyof EventInterface]))

const drawKeys = computed(() =>
  tours.filter(tour => event[`${tour}_draw_s` as keyof EventInterface] || event[`${tour}_draw_d` as keyof EventInterface])
)

const eventStartDate = computed(() => {
  if (event.start_date) return event.start_date as DateType

  const eventDates = dateKeys.value
    .map(key => event[`${key}_start_date` as keyof EventInterface] as DateType)
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      if (a.month !== b.month) return a.month - b.month
      return a.day - b.day
    })

  return eventDates[0]
})
</script>

<template>
  <u-card :ui="{ root: `ring-${getTourColour(event.tours)}`, body: 'text-xs', footer: 'flex justify-center' }">
    <!--Tournament name-->
    <template #header>
      <u-link
        :to="{ name: 'tournament', params: { id: event.tournament.id, name: kebabCase(event.tournament.name) } }"
        class="hover-link font-semibold"
      >
        {{ event.tournament.name }}
      </u-link>
    </template>

    <div class="flex gap-2 items-center my-auto">
      <!--Dates-->
      <div
        v-if="event.start_date && event.end_date"
        class="max-w-15"
      >
        {{ shortDateFormat.formatRange(getDate(event.start_date), getDate(event.end_date)) }}
      </div>
      <div
        v-else
        class="flex flex-col gap-1 max-w-15"
      >
        <span
          v-for="tour in dateKeys"
          :key="tour"
          :class="`${tour}-link`"
        >
          {{
            shortDateFormat.formatRange(
              getDate(event[`${tour}_start_date` as keyof EventInterface]! as DateType),
              getDate(event[`${tour}_end_date` as keyof EventInterface]! as DateType)
            )
          }}
        </span>
      </div>

      <div class="flex-1 flex flex-col gap-1">
        <!--Category-->
        <div v-if="event.category">
          <u-link
            :to="{ name: 'category', params: { id: kebabCase(event.category) } }"
            class="hover-link"
          >
            {{ event.category }}
          </u-link>
        </div>
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

        <!--Venue-->
        <div
          v-if="event.venues?.length"
          class="flex flex-wrap items-center gap-1"
        >
          <span>{{ event.venues.map(v => v.city).join(" | ") }}</span>
          <u-icon :name="getFlagCode(event.venues[0]?.country!)" />
        </div>
        <div v-else>Various</div>
      </div>

      <div class="flex flex-col gap-2">
        <!--Surface-->
        <div class="flex gap-1 items-center">
          <u-icon :name="icons.court" />
          <u-link
            v-if="event.surface"
            :to="{ name: 'surface', params: { id: kebabCase(event.surface.id) } }"
            class="hover-link"
          >
            {{ event.surface.surface }}
          </u-link>
          <div v-else>Various</div>
        </div>

        <!--Draws-->
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
              :key="`singles-${tour}`"
            >
              <u-separator
                v-if="index > 0 && event[`${tour}_draw_s` as keyof EventInterface]"
                class="h-4"
                orientation="vertical"
              />
              <span :class="`text-${tour}`">
                {{ SHORT_ROUNDS[event[`${tour}_draw_s` as keyof EventInterface] as keyof typeof SHORT_ROUNDS] }}
              </span>
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
              :key="`doubles-${tour}`"
            >
              <u-separator
                v-if="index > 0 && event[`${tour}_draw_d` as keyof EventInterface]"
                class="h-4"
                orientation="vertical"
              />
              <span :class="`text-${tour}`">
                {{ SHORT_ROUNDS[event[`${tour}_draw_d` as keyof EventInterface] as keyof typeof SHORT_ROUNDS] }}
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!--Navigate to event-->
    <template #footer>
      <event-buttons
        :tournament="event.tournament"
        :year="event.year"
        :id="event.id"
        :start_date="eventStartDate"
      />
    </template>
  </u-card>
</template>
