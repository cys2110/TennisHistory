<script setup lang="ts">
import { UPageGrid, UPageList } from "#components"

const { viewMode } = useDefaults()
const {
  // @ts-ignore
  params: { id }
} = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

// API call
const { data: events, status } = await useFetch<TournamentWinnerEventType[]>("/api/tournaments/winners", {
  key: `tournament-winners-${id}`,
  query: { id },
  default: () => []
})

const { icons } = useAppConfig()
const tours = inject<TourType[]>("tours", [])
const name = inject<string>("tournamentName", "")

// TOC
const toc = computed(() => [
  {
    id: "events",
    items: events.value.map(event => ({
      label: event.year,
      to: `#event-${event.id}`
    }))
  }
])
</script>

<template>
  <div>
    <tournament-winners-table
      v-if="viewMode === 'list'"
      :events
      :status
    />

    <component
      :is="tours.length === 1 || COUNTRY_DRAWS.includes(id) ? UPageGrid : UPageList"
      v-else-if="events.length || status === 'pending'"
      :class="{ 'gap-5 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2': tours.length === 1 }"
      class="p-5 scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent overflow-y-auto scroll-smooth max-h-200"
    >
      <client-only>
        <teleport to="#navbar-right">
          <u-popover>
            <u-button
              :size="mdAndDown ? 'xs' : 'sm'"
              :icon="icons.toc"
            />
            <template #content>
              <!--@vue-ignore-->
              <u-command-palette
                placeholder="Search events"
                :groups="toc"
                :loading="status === 'pending'"
                :fuse="{ resultLimit: 200 }"
                :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
              />
            </template>
          </u-popover>
        </teleport>

        <teleport to="#dashboard-footer">
          <div class="font-semibold p-5 border-t border-muted">Total: {{ events.length }}</div>
        </teleport>
      </client-only>

      <div
        v-if="events.length"
        v-for="event in events"
        :key="event.id"
        :id="`event-${event.id}`"
      >
        <tournament-winners-card :event />
      </div>
      <loading-event
        v-else
        v-for="_ in 10"
        :key="_"
      />
    </component>

    <error-message
      v-else
      :icon="icons.noTournament"
      :message="`No events found for ${name}`"
    />
  </div>
</template>
