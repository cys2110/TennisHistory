<script setup lang="ts">
const {
  params: { id, name }
} = useRoute("tournament")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

// API call
const { data: events, status } = await useFetch<TournamentLowestRankedType[]>("/api/tournaments/lowest-ranked", {
  key: `tournament-lowest-ranked-${id}`,
  query: { id },
  default: () => [],
  server: false
})

const groupedResults = computed<any[]>(() => {
  if (events.value.length) {
    const roundNames = ["Win", "Final", "Semifinals", "Quarterfinals"]
    const rounds: any[] = []

    roundNames.forEach(round => {
      const filtered = events.value.filter(event => event.round === round)
      const roundObject: any = {
        round,
        Singles: {
          ATP: filtered.find(event => event.type === "Singles" && event.tour === "ATP"),
          WTA: filtered.find(event => event.type === "Singles" && event.tour === "WTA"),
          "ITF (M)": filtered.find(event => event.type === "Singles" && event.tour === "ITF (M)"),
          "ITF (W)": filtered.find(event => event.type === "Singles" && event.tour === "ITF (W)")
        },
        Doubles: {
          ATP: filtered.find(event => event.type === "Doubles" && event.tour === "ATP"),
          WTA: filtered.find(event => event.type === "Doubles" && event.tour === "WTA"),
          "ITF (M)": filtered.find(event => event.type === "Doubles" && event.tour === "ITF (M)"),
          "ITF (W)": filtered.find(event => event.type === "Doubles" && event.tour === "ITF (W)")
        }
      }
      rounds.push(roundObject)
    })
    return rounds
  }
  return []
})
</script>

<template>
  <client-only>
    <teleport to="#dashboard-right">
      <tournament-lowest-rank-chart
        v-if="mdAndUp"
        :events
      />
    </teleport>
  </client-only>
  <u-page-grid
    v-if="groupedResults.length || ['idle', 'pending'].includes(status)"
    class="lg:grid-cols-2"
  >
    <u-card
      v-if="groupedResults.length"
      v-for="round in groupedResults"
      :key="round.round"
      :ui="{
        root: 'ring-primary',
        header: 'font-semibold'
      }"
    >
      <template #header>{{ round.round }}</template>

      <table class="w-full text-center [&>thead>tr>th]:text-muted text-sm [&>tbody>tr>td]:py-1">
        <thead>
          <tr>
            <th />
            <th>Singles</th>
            <th>Doubles</th>
          </tr>
        </thead>
        <tbody>
          <template
            v-for="tour in Object.keys(round.Singles)"
            :key="tour"
          >
            <tr v-if="round.Singles[tour as keyof typeof round.Singles] || round.Doubles[tour as keyof typeof round.Doubles]">
              <td>
                <u-badge
                  :label="tour"
                  :color="getTourColour(tour as TourType)"
                />
              </td>
              <td>{{ round.Singles[tour as keyof typeof round.Singles].rank }}</td>
              <td>{{ round.Doubles[tour as keyof typeof round.Doubles].rank }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </u-card>

    <loading-player
      v-else
      v-for="_ in 4"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.seeds"
    :message="`No players found for ${tournamentName}`"
  />
</template>
