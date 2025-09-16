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
const { data: awards, status } = await useFetch<RoundInterface[]>("/api/events/awards", {
  key: `event-awards-${eid}`,
  query: { id: eid },
  default: () => [],
  server: false
})

const brokenOutAwards = computed(() => {
  const data = []
  for (const tour of tours.value) {
    const singles = awards.value.filter(a => a.tour === tour && a.type === "Singles")
    const doubles = awards.value.filter(a => a.tour === tour && a.type === "Doubles")

    if (singles.length) {
      data.push({
        tour,
        type: "Singles",
        awards: singles
      })
    }

    if (doubles.length) {
      data.push({
        tour,
        type: "Doubles",
        awards: doubles
      })
    }
  }
  return data
})
</script>

<template>
  <dashboard-subpanel
    id="awards"
    title="Awards"
    :icon="icons.awards"
  >
    <template #right>
      <event-awards-chart
        v-if="awards.length && mdAndUp"
        :awards
      />
    </template>

    <u-page-columns
      v-if="awards.length || ['idle', 'pending'].includes(status)"
      class="lg:columns-2"
    >
      <u-card
        v-if="awards.length"
        v-for="awardGroup in brokenOutAwards"
        :key="`${awardGroup.tour}-${awardGroup.type}`"
        :class="`ring-${getTourColour(awardGroup.tour)}`"
      >
        <template #header>
          <div class="flex items-center gap-2">
            <u-badge
              :label="awardGroup.tour"
              :color="getTourColour(awardGroup.tour)"
            />
            <u-badge
              :label="awardGroup.type"
              :color="getMatchTypeColour(awardGroup.type as MatchType)"
            />
          </div>
        </template>
        <table class="w-full text-sm text-center">
          <thead class="[&>tr>th]:px-1 text-muted">
            <tr>
              <th>Round</th>
              <th>Prize Money</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody class="[&>tr>td]:p-1 text-center">
            <tr
              v-for="award in awardGroup.awards"
              :key="award.round"
            >
              <td class="text-muted">{{ award.round }}</td>
              <td>{{
                award.currency && isDefined(award.pm) ? award.pm.toLocaleString("en-GB", { style: "currency", currency: award.currency }) : "—"
              }}</td>
              <td>{{ isDefined(award.points) ? award.points : "—" }}</td>
            </tr>
          </tbody>
        </table>
      </u-card>
      <loading-base
        v-else
        v-for="_ in 10"
        :key="_"
      />
    </u-page-columns>
    <error-message
      v-else
      :message="`No awards found for ${tournamentName} ${year}`"
      :icon="icons.noAwards"
    />
  </dashboard-subpanel>
</template>
