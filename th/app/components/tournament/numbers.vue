<script setup lang="ts">
import {
  TournamentAge,
  TournamentCountry,
  TournamentFinalists,
  TournamentLowestRank,
  TournamentPm,
  TournamentScoresStats,
  TournamentSeeds,
  TournamentStatuses
} from "#components"

const { icons } = useAppConfig()

const selection = ref("pm")

const options = [
  { label: "Historical Prize Money", value: "pm" },
  { label: "Finalists", value: "finalists" },
  { label: "Winners by Country", value: "country" },
  { label: "Winners By Age", value: "age" },
  { label: "Winners By Games and Sets Lost", value: "games-sets-lost" },
  {
    label: "Seeds",
    value: "seeds",
    description: "Years when the top seeds reached the later rounds"
  },
  {
    label: "Qualifiers / Lucky Losers / Alternates / Wild Cards",
    value: "statuses",
    description: "Who have won the tournament"
  },
  {
    label: "Lowest Ranked Player",
    value: "lowest-ranked",
    description: "To reach the later rounds"
  }
]

const getStat = () => {
  switch (selection.value) {
    case "age":
      return {
        label: "Winners By Age",
        icon: icons.calendar,
        component: TournamentAge
      }
    case "country":
      return {
        label: "Countries by No. of Winners",
        icon: icons.countries,
        component: TournamentCountry
      }
    case "finalists":
      return {
        label: "Players by Number of Finals Played",
        icon: icons.tournament,
        component: TournamentFinalists
      }
    case "games-sets-lost":
      return {
        label: "Winners by Sets and Games Lost",
        icon: icons.scores,
        component: TournamentScoresStats
      }
    case "lowest-ranked":
      return {
        label: "Lowest Ranked Player to Reach Later Rounds",
        icon: icons.sortNumberDown,
        component: TournamentLowestRank
      }
    case "pm":
      return {
        label: "Historical Prize Money",
        icon: icons.awards,
        component: TournamentPm
      }
    case "seeds":
      return {
        label: "Years when the top seeds won and reach the final, semifinals or quarterfinals",
        icon: icons.seeds,
        component: TournamentSeeds
      }
    case "statuses":
      return {
        label: "Qualifiers / Lucky Losers / Alternates / Wild Cards Winners",
        icon: icons.one,
        component: TournamentStatuses
      }
    default:
      null
  }
}
</script>

<template>
  <dashboard-subpanel
    :title="getStat()?.label || 'Tournament Numbers'"
    :icon="getStat()?.icon"
    class="max-h-190"
  >
    <template #right>
      <div class="flex items-center gap-2">
        <div id="chart-container" />
        <u-drawer>
          <u-button
            label="Select stat"
            :icon="icons.filter"
          />
          <template #body>
            <u-radio-group
              v-model="selection"
              :items="options"
              variant="card"
              class="w-fit mx-auto"
            />
          </template>
        </u-drawer>
      </div>
    </template>

    <component
      :is="getStat()?.component"
      v-if="selection"
    />
  </dashboard-subpanel>
</template>
