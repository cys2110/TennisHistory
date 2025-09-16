<script setup lang="ts">
const {
  params: { eid, year }
} = useRoute("event")
const { icons } = useAppConfig()
const tours = useState<TourType[]>("tours")
const tournamentName = useState<string>("tournament-name")

// API call
const { data: entries, status } = await useFetch<EntryInterface[]>("/api/events/player-entries", {
  key: `event-player-entries-${eid}`,
  query: { id: eid },
  default: () => [],
  server: false
})

const consolidatedResults = computed(() => {
  const allPlayers = useArrayUnique(entries.value.map(entry => entry.id))
  const data = []

  for (const player of allPlayers.value) {
    const playerEntries = entries.value.filter(entry => entry.id === player)
    const singles = playerEntries.filter(entry => entry.type === "Singles")
    const doubles = playerEntries.filter(entry => entry.type === "Doubles")

    data.push({
      id: player,
      first_name: playerEntries[0]?.first_name || "",
      last_name: playerEntries[0]?.last_name || "",
      country: playerEntries[0]?.country || "",
      tour: playerEntries[0]?.tour || "",
      singles: {
        draw: singles?.map(s => s.draw) || [],
        seed: singles?.[0]?.seed || null,
        q_seed: singles?.[0]?.q_seed || null,
        status: singles?.[0]?.status || null,
        q_status: singles?.[0]?.q_status || null,
        rank: singles?.[0]?.rank || null
      },
      doubles: {
        draw: doubles.map(d => d.draw) || [],
        seed: doubles?.[0]?.seed || null,
        q_seed: doubles?.[0]?.q_seed || null,
        status: doubles?.[0]?.status || null,
        q_status: doubles?.[0]?.q_status || null,
        rank: doubles?.[0]?.rank || null
      }
    })
  }

  return data
})
</script>

<template>
  <u-page-columns
    v-if="entries.length || ['idle', 'pending'].includes(status)"
    class="lg:columns-2"
  >
    <u-page-card
      v-if="entries.length"
      v-for="entry in consolidatedResults"
      :key="entry.id"
      highlight
      :highlight-color="getTourColour(entry.tour as TourType)"
      :to="{ name: 'player', params: { id: entry.id, name: kebabCase(`${entry.first_name}-${entry.last_name}`) } }"
      :title="`${entry.first_name} ${entry.last_name}`"
    >
      <template #leading>
        <div class="flex items-center gap-2">
          <u-icon
            :name="getFlagCode(entry.country as CountryInterface)"
            class="text-2xl"
          />
          <u-badge
            :label="entry.tour"
            :color="getTourColour(entry.tour as TourType)"
          />
        </div>
      </template>

      <template #description>
        <div class="flex flex-col gap-3 mt-3">
          <div
            v-if="entry.singles.draw.length"
            class="flex flex-col gap-1"
          >
            <div class="flex items-center gap-2">
              <u-badge
                label="Singles"
                color="singles"
              />
              <u-badge
                v-for="draw in entry.singles.draw"
                :key="`Singles-${draw}`"
                :label="draw"
                :color="draw === 'Main' ? 'main' : 'qualifying'"
              />
            </div>
            <div class="flex items-center text-sm ml-2">
              <div v-if="entry.singles.seed || entry.singles.q_seed">
                Seed: {{ entry.singles.q_seed ? `Q-${entry.singles.q_seed}` : entry.singles.seed }} | &nbsp;
              </div>
              <div v-if="entry.singles.status || entry.singles.q_status">
                <span v-if="entry.singles.status">{{ entry.singles.status }}</span>
                <u-separator
                  v-if="entry.singles.status && entry.singles.q_status"
                  class="h-4"
                  orientation="vertical"
                />
                <span v-if="entry.singles.q_status">Q-{{ entry.singles.q_status }}</span>
                |&nbsp;
              </div>
              <div>Rank: {{ entry.singles.rank ?? 0 }}</div>
            </div>
          </div>
          <div
            v-if="entry.doubles.draw.length"
            class="flex flex-col gap-1"
          >
            <div class="flex items-center gap-2">
              <u-badge
                label="Doubles"
                color="doubles"
              />
              <u-badge
                v-for="draw in entry.doubles.draw"
                :key="`Doubles-${draw}`"
                :label="draw"
                :color="draw === 'Main' ? 'main' : 'qualifying'"
              />
            </div>
            <div class="flex items-center text-sm ml-2">
              <div v-if="entry.doubles.seed || entry.doubles.q_seed">
                Seed: {{ entry.doubles.q_seed ? `Q-${entry.doubles.q_seed}` : entry.doubles.seed }} | &nbsp;
              </div>
              <div v-if="entry.doubles.status || entry.doubles.q_status">
                <span v-if="entry.doubles.status">{{ entry.doubles.status }}</span>
                <u-separator
                  v-if="entry.doubles.status && entry.doubles.q_status"
                  class="h-4"
                  orientation="vertical"
                />
                <span v-if="entry.doubles.q_status">Q-{{ entry.doubles.q_status }}</span>
                |&nbsp;
              </div>
              <div>Rank: {{ entry.doubles.rank ?? 0 }}</div>
            </div>
          </div>
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
