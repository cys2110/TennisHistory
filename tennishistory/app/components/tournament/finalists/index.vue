<script setup lang="ts">
const {
  params: { id }
} = useRoute("tournament")
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const tournamentName = inject<string>("tournamentName", "")

// API call
const { data: finalists, status } = await useFetch<TournamentFinalistType[]>("/api/tournaments/finalists", {
  key: `tournament-finalists-${id}`,
  query: { id },
  default: () => [],
  server: false
})
</script>

<template>
  <client-only>
    <teleport to="#dashboard-right">
      <tournament-finalists-chart
        v-if="mdAndUp && finalists.length"
        :finalists
      />
    </teleport>
  </client-only>
  <u-page-grid
    v-if="finalists.length || ['idle', 'pending'].includes(status)"
    class="lg:grid-cols-2"
  >
    <u-card
      v-if="finalists.length"
      v-for="finalist in finalists"
      :key="finalist.player.id"
      :class="`ring-${getTourColour([finalist.player.tour])}`"
    >
      <template #header>
        <div class="flex justify-between items-center font-semibold">
          <player-link :player="finalist.player" />
          <u-badge
            :label="finalist.player.tour"
            :color="getTourColour([finalist.player.tour])"
          />
        </div>
      </template>

      <table class="text-sm text-center w-full">
        <thead>
          <tr>
            <th />
            <th>Titles</th>
            <th>Runner-up</th>
            <th>Win %</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Singles</th>
            <td>{{ finalist.singles_wins }}</td>
            <td>{{ finalist.singles_losses }}</td>
            <td
              >{{
                finalist.singles_wins + finalist.singles_losses ?
                  percentage(finalist.singles_wins, finalist.singles_wins + finalist.singles_losses)
                : 0
              }}%</td
            >
          </tr>
          <tr>
            <th>Doubles</th>
            <td>{{ finalist.doubles_wins }}</td>
            <td>{{ finalist.doubles_losses }}</td>
            <td
              >{{
                finalist.doubles_wins + finalist.doubles_losses ?
                  percentage(finalist.doubles_wins, finalist.doubles_wins + finalist.doubles_losses)
                : 0
              }}%</td
            >
          </tr>
        </tbody>
      </table>
    </u-card>
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.noTournament"
    :message="`No finalists found for ${tournamentName}`"
  />
</template>
