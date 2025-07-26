<script setup lang="ts">
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
    label: "Lucky Losers / Alternates / Wild Cards",
    value: "statuses",
    description: "Who have won the tournament"
  },
  {
    label: "Lowest Ranked Player",
    value: "lowest-ranked",
    description: "To reach the later rounds"
  },
  { label: "Most Matches Played", value: "most-matches" },
  { label: "Most 5 Set Wins", value: "5-set-wins" },
  { label: "Comebacks from 2 sets to love", value: "comebacks" }
]
</script>

<template>
  <dashboard-subpanel :title="options.find(o => o.value === selection)?.label || 'Tournament Numbers'">
    <template #right>
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
    </template>

    <tournament-pm v-if="selection === 'pm'" />
    <tournament-finalists v-if="selection === 'finalists'" />
    <tournament-country-winners v-if="selection === 'country'" />
    <tournament-age v-if="selection === 'age'" />
    <tournament-games-sets v-if="selection === 'games-sets-lost'" />
    <tournament-seeds v-if="selection === 'seeds'" />
    <tournament-statuses v-if="selection === 'statuses'" />
    <tournament-rank v-if="selection === 'lowest-ranked'" />
    <tournament-most-matches v-if="selection === 'most-matches'" />
    <tournament-set5 v-if="selection === '5-set-wins'" />
    <tournament-comebacks v-if="selection === 'comebacks'" />
  </dashboard-subpanel>
</template>
