<script setup lang="ts">
import { UPageGrid, UPageList } from "#components"

const {
  params: { id, name }
} = useRoute("tournament")
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", capitalCase(name as string))

// API call
const { data: events, status } = await useFetch<TournamentWinnerEventType[]>("/api/tournaments/winners", {
  key: `tournament-winners-${id}`,
  query: { id },
  default: () => []
})

// TOC
const toc = computed(() => [
  {
    id: "events",
    label: "Events",
    items: events.value.map(event => ({
      label: event.year.toString(),
      to: `#event-${event.id}`
    }))
  }
])
</script>

<template>
  <client-only>
    <teleport to="#page-right">
      <div class="font-semibold my-5">Events: {{ events.length }}</div>
      <u-command-palette
        v-if="events.length"
        placeholder="Search events"
        :groups="toc"
        :loading="status === 'pending'"
        :fuse="{ resultLimit: 1000 }"
        :ui="{ content: 'max-h-200 2xl:max-h-190' }"
      />
    </teleport>
  </client-only>
  <component
    :is="tours.length === 1 || COUNTRY_DRAWS.includes(id as string) ? UPageGrid : UPageList"
    v-if="events.length || status === 'pending'"
    class="gap-5"
    :class="{ 'md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2': tours.length === 1 && !COUNTRY_DRAWS.includes(id as string) }"
  >
    <div
      v-if="events.length"
      v-for="event in events"
      :key="event.id"
      :id="`event-${event.id}`"
      class="scroll-mt-[calc(var(--ui-header-height)+2rem)]"
    >
      <u-card
        variant="subtle"
        :ui="{ header: 'text-lg font-semibold' }"
      >
        <template #header>{{ event.year }}</template>

        <div
          :class="{ 'grid grid-cols-2 gap-4': !COUNTRY_DRAWS.includes(id as string) }"
          class="text-sm"
        >
          <template
            v-for="final in event.finals"
            :key="`${event.id}-${final.tour}-${final.type}`"
          >
            <div
              v-if="final.loser"
              class="flex flex-col gap-1 items-center justify-center"
              :class="`ring ring-${getTourColour(final.tour)} rounded-lg py-3`"
            >
              <!-- Winner -->
              <div>
                <div
                  v-if="Array.isArray(final.winner)"
                  class="flex flex-col items-center"
                >
                  <player-link
                    v-for="player in final.winner"
                    :key="`${event.id}-${final.tour}-${final.type}-${player.id}`"
                    :player="player"
                  />
                </div>
                <div v-else-if="typeof final.winner === 'string'">
                  {{ final.winner }}
                </div>
                <country-link
                  v-else
                  :country="final.winner"
                  :icon-only="false"
                />
              </div>
              <div v-if="final.loser">d.</div>
              <!-- Loser -->
              <div v-if="final.loser">
                <div
                  v-if="Array.isArray(final.loser)"
                  class="flex flex-col items-center"
                >
                  <player-link
                    v-for="player in final.loser"
                    :key="`${event.id}-${final.tour}-${final.type}-${player.id}`"
                    :player="player"
                  />
                </div>
                <country-link
                  v-else
                  :country="final.loser"
                  :icon-only="false"
                />
              </div>
              <!-- Score -->
              <div v-if="final.score">{{ final.score }}</div>
              <match-score-item
                v-else-if="final.loser"
                :tour="final.tour"
                :type="final.type"
                :sets="final.sets"
                :id="event.id"
                :year="event.year"
                :match_no="1"
                :stats="final.stats"
                :tournament="{ name: name as string, id: Number(id) }"
                :incomplete="final.incomplete"
              />
            </div>
          </template>
        </div>

        <template #footer>
          <div class="w-fit mx-auto">
            <event-buttons
              :tournament="{ name: name as string, id: Number(id) }"
              :year="event.year"
              :id="event.id"
            />
          </div>
        </template>
      </u-card>
    </div>

    <loading-tournament-winners
      v-else
      v-for="_ in 6"
      :key="_"
    />
  </component>
  <error-message
    v-else
    :message="`${tournamentName} has not had any winners`"
    :icon="icons.noTournament"
  />
</template>
