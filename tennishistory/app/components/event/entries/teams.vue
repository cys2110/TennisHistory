<script setup lang="ts">
const {
  params: { eid, year }
} = useRoute("event")
const { icons } = useAppConfig()
const tours = useState<TourType[]>("tours")
const tournamentName = useState<string>("tournament-name")

// API call
const { data: entries, status } = await useFetch<EntryInterface[]>("/api/events/team-entries", {
  key: `event-team-entries-${eid}`,
  query: { id: eid },
  default: () => [],
  server: false
})
</script>

<template>
  <u-page-columns
    v-if="entries.length || ['idle', 'pending'].includes(status)"
    class="lg:columns-2"
  >
    <u-page-card
      v-if="entries.length"
      v-for="(entry, index) in entries"
      :key="index"
      highlight
      :highlight-color="getTourColour([entry.tour])"
    >
      <template #leading>
        <div class="flex items-center gap-2">
          <u-badge
            :label="entry.tour"
            :color="getTourColour(entry.tour)"
          />
          <u-badge
            :label="entry.type"
            :color="getMatchTypeColour(entry.type)"
          />
          <u-badge
            :label="entry.draw"
            :color="entry.draw === 'Main' ? 'main' : 'qualifying'"
          />
        </div>
      </template>

      <template #title>
        <div class="flex flex-wrap items-center gap-2">
          <player-link :player="entry.players[0]!" /> [{{ entry.players[0]!.rank }}]
          <u-separator
            v-if="entry.players[1]"
            orientation="vertical"
            class="h-4"
          />
          <player-link
            v-if="entry.players[1]"
            :player="entry.players[1]"
          />
          <template v-if="entry.players[1]">[{{ entry.players[1]!.rank }}]</template>
        </div>
      </template>

      <template #description>
        <div class="flex items-center gap-2 mt-3">
          <u-badge
            v-if="entry.seed || entry.q_seed"
            :label="`Seed: ${entry.seed ?? `Q-${entry.q_seed}`}`"
            color="success"
          />
          <u-badge
            v-if="entry.status"
            :label="STATUSES[entry.status as keyof typeof STATUSES].longName"
            color="warning"
          />
          <u-badge
            v-if="entry.q_status"
            :label="`Q-${STATUSES[entry.q_status as keyof typeof STATUSES].longName}`"
            color="info"
          />
        </div>
      </template>
    </u-page-card>

    <loading-player
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-columns>
  <error-message
    v-else
    :message="`No entries found for ${tournamentName} ${year}`"
    :icon="icons.noPlayer"
  />
</template>
