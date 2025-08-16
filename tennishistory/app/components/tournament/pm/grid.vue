<script setup lang="ts">
const { rounds } = defineProps<{
  rounds: TournamentPmType[]
  status: APIStatusType
}>()
const {
  params: { id, name }
} = useRoute()
const { icons } = useAppConfig()
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

const groupedRounds = computed(() => {
  const years = []
  const usedYears = new Set<number>()

  for (const round of rounds) {
    if (!usedYears.has(round.year)) {
      const yearRounds = rounds.filter(r => r.year === round.year)

      const tourRounds = []

      for (const tour of tours) {
        const tourSinglesRounds = yearRounds.filter(
          r => r.tour === (tour.replace("Men", "ITF (M)").replace("Women", "ITF (W)") as TourType) && r.type === "Singles"
        )
        const tourDoublesRounds = yearRounds.filter(
          r => r.tour === (tour.replace("Men", "ITF (M)").replace("Women", "ITF (W)") as TourType) && r.type === "Doubles"
        )

        tourRounds.push({
          tour,
          singles: tourSinglesRounds,
          doubles: tourDoublesRounds
        })
      }

      years.push({
        id: round.id,
        year: round.year,
        rounds: tourRounds
      })

      usedYears.add(round.year)
    }
  }

  return years.sort((a, b) => b.year - a.year)
})
</script>

<template>
  <u-page-grid
    v-if="groupedRounds.length || status === 'pending'"
    class="md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2"
  >
    <u-card
      v-if="groupedRounds.length"
      v-for="round in groupedRounds"
      :key="round.id"
      :ui="{
        root: `ring-${getTourColor(tours)}`,
        footer: 'mx-auto w-fit'
      }"
    >
      <template #header>
        <u-link
          :to="{ name: 'event', params: { id, name, eid: round.id, year: round.year } }"
          class="hover-link font-semibold"
        >
          {{ round.year }}
        </u-link>
      </template>

      <div class="text-sm">
        <dashboard-subpanel
          v-for="tour in round.rounds"
          :key="tour.tour"
        >
          <template #title>
            <u-badge
              :label="tour.tour"
              :color="getTourColor([tour.tour])"
            />
          </template>

          <div class="text-center text-sm">
            <div class="grid grid-cols-5 text-muted">
              <div></div>
              <div class="col-span-2">Singles</div>
              <div class="col-span-2">Doubles</div>
            </div>
            <div class="grid grid-cols-5 text-muted">
              <div></div>
              <div>Prize Money</div>
              <div>Points</div>
              <div>Prize Money</div>
              <div>Points</div>
            </div>
            <div
              v-for="(x, index) in tour.singles.length > tour.doubles.length ? tour.singles : tour.doubles"
              :key="index"
              class="grid grid-cols-5"
            >
              <div class="text-muted">{{ x.round }}</div>
              <div class="font-semibold">{{
                isDefined(x.pm) && x.currency ? x.pm.toLocaleString("en-GB", { style: "currency", currency: x.currency }) : "—"
              }}</div>
              <div class="font-semibold">{{ isDefined(x.points) ? x.points.toLocaleString() : "—" }}</div>
              <div class="font-semibold">{{
                isDefined(tour.doubles[index]?.pm) && tour.doubles[index]?.currency ?
                  tour.doubles[index].pm.toLocaleString("en-GB", { style: "currency", currency: tour.doubles[index].currency })
                : "—"
              }}</div>
              <div class="font-semibold">{{ isDefined(tour.doubles[index]?.points) ? tour.doubles[index].points.toLocaleString() : "—" }}</div>
            </div>
          </div>
        </dashboard-subpanel>
      </div>
    </u-card>

    <loading-base
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.noAwards"
    :message="`No prize money found for ${tournamentName}`"
  />
</template>
