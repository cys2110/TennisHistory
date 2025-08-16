<script setup lang="ts">
defineProps<{
  players: EntryInterface[]
  status: APIStatusType
}>()
const {
  params: { id, name }
} = useRoute()
const { icons } = useAppConfig()
const tournamentName = inject<string>("tournamentName", "")
</script>

<template>
  <u-page-grid
    class="xl:grid-cols-4 2xl:grid-cols-5"
    v-if="players.length || status === 'pending'"
  >
    <u-card
      v-if="players.length"
      v-for="(team, index) in players"
      :key="index"
      :ui="{
        root: `ring-${getTourColor([team.tour])}`,
        header: 'flex items-center justify-between',
        footer: 'mx-auto w-fit'
      }"
    >
      <template #header>
        <player-link
          v-for="player in team.players"
          :key="player.id + index"
          :player
          class="font-semibold"
        />

        <u-link
          :to="{ name: 'event', params: { id, name, year: team.year, eid: team.eid } }"
          class="hover-link font-semibold"
        >
          {{ team.year }}
        </u-link>
      </template>

      <div class="flex items-center gap-2 justify-center">
        <u-badge
          :label="team.tour"
          :color="getTourColor([team.tour])"
        />
        <u-badge
          :label="team.type"
          :color="team.type === 'Singles' ? 'singles' : 'doubles'"
        />
        <u-badge
          :label="team.status"
          color="primary"
        />
      </div>
    </u-card>

    <loading-player
      v-else
      v-for="_ in 4"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.noTournament"
    :message="`No qualifiers, lucky losers, alternates or wild cards have won ${tournamentName}`"
  />
</template>
