<script setup lang="ts">
useHead({ title: "Tournaments" })
useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Tournaments",
  description: "A collection of tennis tournaments"
}))

const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const selectedLetter = ref<string | undefined>()

// API call
const { data, status } = await useFetch<TournamentInterface[]>("/api/tournaments", {
  key: "tournaments",
  default: () => [],
  server: false
})

const tournaments = computed(() => {
  if (data.value && selectedLetter.value) {
    return data.value.filter(tournament => tournament.name.startsWith(selectedLetter.value!))
  }
  return data.value
})

const toc = computed(() => [
  {
    id: "tournaments",
    label: "Tournments",
    items: tournaments.value.map(tournament => ({
      label: tournament.name,
      to: `#tournament-${tournament.id}`
    }))
  }
])

const eventCounts = computed(() => ({
  Total: tournaments.value.length,
  ATP: tournaments.value.filter(tournament => tournament.tours?.includes("ATP")).length,
  WTA: tournaments.value.filter(tournament => tournament.tours?.includes("WTA")).length,
  "ITF (M)": tournaments.value.filter(tournament => tournament.tours?.includes("ITF (M)")).length,
  "ITF (W)": tournaments.value.filter(tournament => tournament.tours?.includes("ITF (W)")).length
}))
</script>

<template>
  <u-container>
    <u-page>
      <template #left>
        <u-page-aside>
          <filter-letters v-model="selectedLetter" />
        </u-page-aside>
      </template>

      <template #right>
        <u-page-aside>
          <div class="flex flex-col gap-1 my-5 text-sm font-semibold">
            <div
              v-for="([label, count], index) in Object.entries(eventCounts)"
              :key="label"
              :class="{ [`text-${tourColourMapping[index]}`]: index > 0 }"
            >
              {{ label }}: {{ count }}
            </div>
          </div>
          <u-command-palette
            v-if="data.length"
            placeholder="Search tournaments"
            :groups="toc"
            :loading="status === 'pending'"
            :fuse="{ resultLimit: 1000 }"
            :ui="{ content: 'max-h-200 2xl:max-h-190' }"
          />
        </u-page-aside>
      </template>

      <u-page-header title="Tournaments">
        <template
          #links
          v-if="mdAndDown"
        >
          <u-slideover
            title="Filter by Letter"
            class="ml-auto"
          >
            <u-button :icon="icons.filter" />

            <template #body>
              <filter-letters v-model="selectedLetter" />
            </template>
          </u-slideover>

          <u-popover>
            <u-button :icon="icons.toc" />
            <template #content>
              <u-command-palette
                v-if="data.length"
                placeholder="Search tournaments"
                :groups="toc"
                :loading="status === 'pending'"
                :fuse="{ resultLimit: 1000 }"
                :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
              />
            </template>
          </u-popover>
        </template>
      </u-page-header>

      <u-page-body>
        <u-page-columns v-if="tournaments.length || ['idle', 'pending'].includes(status)">
          <div
            v-if="tournaments.length"
            v-for="tournament in tournaments"
            :key="tournament.id"
            :id="`tournament-${tournament.id}`"
            class="scroll-mt-[calc(var(--ui-header-height)+2rem)]"
          >
            <u-page-card
              :title="tournament.name"
              :to="{ name: 'tournament', params: { id: tournament.id, name: kebabCase(tournament.name) } }"
              highlight
              :highlight-color="getTourColour(tournament.tours!)"
              :ui="{ leading: 'flex flex-wrap items-center gap-1' }"
            >
              <template #leading>
                <u-badge
                  v-for="tour in tournament.tours"
                  :key="tour"
                  :color="getTourColour(tour)"
                  :label="tour"
                />
              </template>
              <template #description>
                <span v-if="tournament.established">{{ tournament.established }}</span>
                <span v-if="tournament.established && !tournament.abolished"> - present</span>
                <span v-else-if="tournament.abolished && tournament.established !== tournament.abolished"> - {{ tournament.abolished }}</span>
              </template>
            </u-page-card>
          </div>

          <loading-base
            v-else
            v-for="_ in 6"
            :key="_"
          />
        </u-page-columns>

        <error-message
          v-else
          message="No tournaments found"
          :icon="icons.noTournament"
        />
      </u-page-body>
    </u-page>
  </u-container>
</template>
