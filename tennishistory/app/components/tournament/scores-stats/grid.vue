<script setup lang="ts">
defineProps<{
  winners: TournamentScoreStatsType[]
  status: APIStatusType
}>()
const { icons } = useAppConfig()
const {
  params: { id, name }
} = useRoute()
const tournamentName = inject<string>("tournamentName", "")
</script>

<template>
  <u-page-grid v-if="winners.length || status === 'pending'">
    <u-card
      v-if="winners.length"
      v-for="winner in winners"
      :key="`${winner.year}-${winner.tour}-${winner.type}`"
      :ui="{
        root: `ring-${getTourColor([winner.tour])} 2xl:grid-cols-4 flex flex-col`,
        body: 'flex-1 text-sm text-center',
        footer: 'flex justify-center'
      }"
    >
      <template #header>
        <div class="flex justify-between font-semibold text-sm">
          <div class="flex flex-col">
            <player-link
              v-for="player in winner.team"
              :key="player.id"
              :player
            />
          </div>
          <div class="flex items-center gap-2">
            <u-badge
              :label="winner.tour"
              :color="getTourColor([winner.tour])"
            />
            <u-badge
              :label="winner.type"
              :color="winner.type === 'Singles' ? 'singles' : 'doubles'"
            />
          </div>
        </div>
      </template>

      <div class="flex flex-col">
        <div class="grid grid-cols-3">
          <div />
          <div>Sets</div>
          <div>Games</div>
        </div>
        <div class="grid grid-cols-3">
          <div>Won</div>
          <div class="font-semibold">{{ winner.sets_won }}</div>
          <div class="font-semibold">{{ winner.games_won }}</div>
        </div>
        <div class="grid grid-cols-3">
          <div>Lost</div>
          <div class="font-semibold">{{ winner.sets_lost }}</div>
          <div class="font-semibold">{{ winner.games_lost }}</div>
        </div>
        <div class="grid grid-cols-3">
          <div>Percentage</div>
          <div class="font-semibold"
            >{{ winner.sets_won + winner.sets_lost ? percentage(winner.sets_won, winner.sets_won + winner.sets_lost) : 0 }}%</div
          >
          <div class="font-semibold"
            >{{ winner.games_won + winner.games_lost ? percentage(winner.games_won, winner.games_won + winner.games_lost) : 0 }}%</div
          >
        </div>
      </div>

      <template #footer>
        <event-buttons
          :tournament="{ id: Number(id) as number, name: name as string, tours: [winner.tour] }"
          :year="winner.year"
          :id="winner.id"
        />
      </template>
    </u-card>

    <loading-base
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :message="`No winners found for ${tournamentName}`"
    :icon="icons.noTournament"
  />
</template>
