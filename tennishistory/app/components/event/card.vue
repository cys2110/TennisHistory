<script setup lang="ts">
const { event } = defineProps<{ event: EventInterface }>()

const eventStartDate = computed(() => {
  if (event.dates[0]?.[0]) return event.dates[0][0] as DateType

  const startDates = event.dates.filter(date => date[0]).map(date => date[0])

  return useSorted(startDates, (a, b) => {
    if (a!.year !== b!.year) return a!.year - b!.year
    if (a!.month !== b!.month) return a!.month - b!.month
    return a!.day - b!.day
  }).value[0]
})
</script>

<template>
  <div
    :id="`event-${event.id}`"
    class="scroll-mt-[calc(var(--ui-header-height)+2rem)] my-3"
  >
    <u-card :class="`ring-${getTourColour(event.tours)}`">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <u-link
              :to="{ name: 'tournament', params: { id: event.tournament.id, name: kebabCase(event.tournament.name) } }"
              class="hover-link default-link font-semibold"
            >
              {{ event.tournament.name }}
            </u-link>
            <div
              v-if="event.sponsor_name"
              class="text-sm"
            >
              {{ event.sponsor_name }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <coloured-badge
              v-for="tour in event.tours"
              :key="tour"
              :label="tour"
              size="lg"
            />
          </div>
        </div>
      </template>

      <div class="flex justify-evenly gap-2 text-sm">
        <div>
          <div class="mb-3">
            <div class="font-semibold mb-2">Categories</div>
            <template
              v-for="(category, index) in event.categories"
              :key="`category-${index}`"
            >
              <div
                v-if="category"
                class="ml-3"
                :class="`text-${tourColourMapping[index]}`"
              >
                {{ category }}
              </div>
            </template>
          </div>

          <div class="mb-3">
            <div class="font-semibold mb-2">Dates</div>
            <template
              v-for="(dates, index) in event.dates"
              :key="`date-${index}`"
            >
              <div
                v-if="dates[0] && dates[1]"
                class="ml-3"
                :class="`text-${tourColourMapping[index]}`"
              >
                {{ dateTimeFormat.formatRange(getDate(dates[0]), getDate(dates[1])) }}
              </div>
            </template>
          </div>

          <div>
            <div class="font-semibold mb-2">Surface</div>
            <div class="ml-3 flex items-center gap-2">
              <u-avatar
                :src="`/surfaces/${event.surface?.surface ?? 'Court'}.${event.surface ? 'jpg' : 'png'}`"
                size="xs"
              />
              {{ event.surface.id }}
            </div>
          </div>
        </div>
        <div>
          <div class="mb-3">
            <div class="font-semibold mb-2">Venue{{ event.venues?.length === 1 ? "" : "s" }}</div>
            <div
              v-if="event.venues?.length"
              v-for="venue in event.venues"
              :key="venue.id"
              class="ml-3 flex items-center gap-2"
            >
              {{ venue.name ? `${venue.name}, ${venue.city}` : venue.city }}
              <country-link
                :country="venue.country"
                icon-only
              />
            </div>
          </div>

          <div>
            <div class="font-semibold mb-2">Draws</div>
            <template
              v-for="(draws, index) in event.draws"
              :key="`draws-${index}`"
            >
              <div
                v-if="(draws[0] || draws[1]) && index > 0"
                class="ml-3 flex items-center"
                :class="`text-${tourColourMapping[index]}`"
              >
                <div
                  v-if="draws[0]"
                  class="flex items-center gap-2"
                >
                  <u-icon :name="ICONS.person" />
                  {{ draws[0] }}
                </div>
                <u-separator
                  v-if="draws[0] && draws[1]"
                  orientation="vertical"
                  class="h-3.5 mx-2"
                />
                <div
                  v-if="draws[1]"
                  class="flex items-center gap-2"
                >
                  <u-icon :name="ICONS.people" />
                  {{ draws[1] }}
                </div>
              </div>
            </template>
          </div>
        </div>
        <div v-if="event.supervisors?.length">
          <div class="font-semibold mb-2">Supervisor{{ event.supervisors?.length === 1 ? "" : "s" }}</div>
          <div
            v-for="supervisor in event.supervisors"
            :key="supervisor.id"
            class="ml-3"
          >
            {{ supervisor.id }}
          </div>
        </div>
        <div v-if="event.umpires?.length">
          <div class="font-semibold mb-2"> Umpire{{ event.umpires?.length === 1 ? "" : "s" }} </div>
          <div
            v-for="umpire in event.umpires"
            :key="umpire.id"
            class="ml-3"
          >
            {{ umpire.id }}
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-center">
          <event-buttons
            :tournament="event.tournament"
            :year="event.year"
            :id="event.id"
            :start_date="eventStartDate"
          />
        </div>
      </template>
    </u-card>
  </div>
</template>
