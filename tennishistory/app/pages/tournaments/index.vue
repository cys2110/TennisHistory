<script setup lang="ts">
useHead({ title: "Tournaments" })

// API call
const { data: tournaments, status } = await useFetch<TournamentInterface[]>("/api/tournaments", {
  key: "tournaments",
  default: () => [],
  server: false
})
</script>

<template>
  <u-container>
    <u-page>
      <template #left>
        <u-page-aside></u-page-aside>
      </template>
      <template #right>
        <u-page-aside></u-page-aside>
      </template>

      <u-page-header title="Tournaments"></u-page-header>

      <u-page-body>
        <u-page-grid
          v-if="tournaments.length || ['idle', 'pending'].includes(status)"
          class="max-h-150 p-5"
        >
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
            >
              <template #leading>
                <coloured-badge
                  v-for="tour in tournament.tours"
                  :key="tour"
                  :label="tour"
                  class="mr-1"
                />
              </template>

              <template #description>
                <span v-if="tournament.established">{{ tournament.established }}</span>
                <span v-if="tournament.established && !tournament.abolished"> - present</span>
                <span v-else-if="tournament.abolished && tournament.established !== tournament.abolished"> - {{ tournament.abolished }}</span>
              </template>
            </u-page-card>
          </div>
        </u-page-grid>
        <error-message
          v-else
          message="No tournaments found"
          :icon="ICONS.noTournament"
        />
      </u-page-body>
    </u-page>
  </u-container>
</template>
