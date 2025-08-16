<script setup lang="ts">
const { awards } = defineProps<{ awards: RoundInterface[]; status: APIStatusType }>()
const {
  params: { year }
} = useRoute()
const { icons } = useAppConfig()

const tournament = inject<TournamentInterface>("tournament")

const groupedAwards = computed(() => {
  const grouped = []
  const usedTours = new Set<string>()

  for (const award of awards) {
    if (!usedTours.has(award.tour)) {
      const singlesAwards = awards.filter(a => a.tour === award.tour && a.type === "Singles")
      const doublesAwards = awards.filter(a => a.tour === award.tour && a.type === "Doubles")

      grouped.push({
        tour: award.tour,
        singles: singlesAwards,
        doubles: doublesAwards
      })

      usedTours.add(award.tour)
    }
  }

  return grouped
})
</script>

<template>
  <div
    v-if="awards.length || status === 'pending'"
    class="grid grid-cols-1 lg:grid-cols-2 gap-5"
  >
    <u-card
      v-if="groupedAwards.length"
      v-for="group in groupedAwards"
      :key="group.tour"
      :class="`ring-${getTourColor([group.tour])}`"
    >
      <template
        #header
        v-if="groupedAwards.length > 1"
      >
        <u-badge
          :label="group.tour.replace('Men', 'ITF (M)').replace('Women', 'ITF (W)')"
          :color="getTourColor([group.tour])"
          size="lg"
        />
      </template>
      <table class="mx-auto">
        <thead class="[&>tr>th]:px-2 text-center text-muted">
          <tr>
            <th></th>
            <th colspan="2">Singles</th>
            <th colspan="2">Doubles</th>
          </tr>
          <tr>
            <th>Round</th>
            <th>Prize Money</th>
            <th>Points</th>
            <th>Prize Money</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody class="[&>tr>td]:px-2 text-center">
          <tr
            v-for="(award, index) in group.singles.length > group.doubles.length ? group.singles : group.doubles"
            :key="index"
          >
            <td class="text-muted">{{ award.round }}</td>
            <td>{{
              award.currency && isDefined(award.pm) ? award.pm.toLocaleString("en-GB", { style: "currency", currency: award.currency }) : "—"
            }}</td>
            <td>{{ isDefined(award.points) ? award.points : "—" }}</td>
            <td>
              {{
                award.currency && isDefined(group.doubles[index]) && isDefined(group.doubles[index].pm) ?
                  group.doubles[index].pm.toLocaleString("en-GB", { style: "currency", currency: award.currency })
                : "—"
              }}
            </td>
            <td>{{ isDefined(group.doubles[index]?.points) ? group.doubles[index].points : "—" }}</td>
          </tr>
        </tbody>
      </table>
    </u-card>
    <loading-base
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </div>
  <error-message
    v-else
    :message="`No awards found for ${tournament?.name} ${year}`"
    :icon="icons.noAwards"
  />
</template>
