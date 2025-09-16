<script setup lang="ts">
const {
  params: { eid, year }
} = useRoute("event")
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const tours = useState<TourType[]>("tours")
const tournamentName = useState<string>("tournament-name")

// API call
const { data: seeds, status } = await useFetch<SeedInterface[]>("/api/events/seeds", {
  key: `event-seeds-${eid}`,
  query: { id: eid },
  default: () => [],
  server: false
})

const brokenOutSeeds = computed(() => {
  const data = []
  for (const tour of tours.value) {
    const singlesMain = seeds.value.filter(s => s.tour === tour && s.type === "Singles" && s.draw === "Main")
    const singlesQual = seeds.value.filter(s => s.tour === tour && s.type === "Singles" && s.draw === "Qualifying")
    const doublesMain = seeds.value.filter(s => s.tour === tour && s.type === "Doubles" && s.draw === "Main")
    const doublesQual = seeds.value.filter(s => s.tour === tour && s.type === "Doubles" && s.draw === "Qualifying")

    if (singlesMain.length)
      data.push({
        tour,
        type: "Singles",
        draw: "Main",
        seeds: singlesMain
      })
    if (singlesQual.length)
      data.push({
        tour,
        type: "Singles",
        draw: "Qualifying",
        seeds: singlesQual
      })
    if (doublesMain.length)
      data.push({
        tour,
        type: "Doubles",
        draw: "Main",
        seeds: doublesMain
      })
    if (doublesQual.length)
      data.push({
        tour,
        type: "Doubles",
        draw: "Qualifying",
        seeds: doublesQual
      })
  }
  return data
})
</script>

<template>
  <dashboard-subpanel
    id="seeds"
    title="Seeds"
    :icon="icons.seeds"
  >
    <template #right>
      <event-seeds-chart
        v-if="seeds.length && mdAndUp"
        :seeds
      />
    </template>

    <u-page-columns
      v-if="seeds.length || ['idle', 'pending'].includes(status)"
      class="lg:columns-2"
    >
      <u-card
        v-if="seeds.length"
        v-for="seedGroup in brokenOutSeeds"
        :key="`${seedGroup.tour}-${seedGroup.draw}-${seedGroup.type}`"
        :ui="{
          root: `ring-${getTourColour(seedGroup.tour)}`,
          header: 'flex items-center justify-between'
        }"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <u-badge
              :label="seedGroup.tour"
              :color="getTourColour([seedGroup.tour])"
            />
            <u-badge
              :label="seedGroup.type"
              :color="getMatchTypeColour(seedGroup.type as MatchType)"
            />
            <u-badge
              :label="seedGroup.draw"
              :color="seedGroup.draw === 'Main' ? 'main' : 'qualifying'"
            />
          </div>
        </template>

        <table class="w-full text-center text-sm [&>tbody>tr>td]:p-1 [&>thead>tr>th]:p-1">
          <thead>
            <tr>
              <th>Seed</th>
              <th class="text-left">Player(s)</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="seed in seedGroup.seeds"
              :key="`${seed.draw}-${seed.type}-${seed.tour}-${seed.seed}`"
            >
              <th>{{ seed.seed }}</th>
              <td>
                <div class="flex flex-col gap-1">
                  <player-link
                    v-for="player in seed.team"
                    :key="player.id"
                    :player="player"
                  />
                </div>
              </td>
              <td>{{ seed.rank ?? "—" }}</td>
            </tr>
          </tbody>
        </table>

        <!-- <div class="flex items-center justify-between">
          <player-link
            v-for="player in seed.team"
            :key="player.id"
            :player
          />
        </div> -->
      </u-card>

      <loading-base
        v-else
        v-for="n in 4"
        :key="n"
      />
    </u-page-columns>
    <error-message
      v-else
      :icon="icons.noPeople"
      :message="`No seeds in ${tournamentName} ${year}`"
    />
  </dashboard-subpanel>
</template>
