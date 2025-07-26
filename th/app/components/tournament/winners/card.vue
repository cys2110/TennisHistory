<script setup lang="ts">
const { event } = defineProps<{ event: TournamentWinnerEventType }>()
const { params } = useRoute()
const { name, id } = params as { name: string; id: string }
const tours = inject<TourType[]>("tours", [])

const countryWinner = computed(() => {
  if (event.country) {
    const score = event.country.score.split("-").map((s: string) => Number(s))
    return {
      winner: score[0]! > score[1]! ? event.country.c1 : event.country.c2,
      loser: score[0]! > score[1]! ? event.country.c2 : event.country.c1
    }
  }
})
</script>

<template>
  <u-card
    :ui="{ header: 'text-lg font-semibold', root: 'my-5' }"
    variant="subtle"
  >
    <template #header>{{ event.year }}</template>
    <!--Country draw results-->
    <div
      v-if="event.country"
      class="flex flex-col gap-3 text-center"
    >
      <country-link
        v-if="countryWinner?.winner"
        :country="countryWinner?.winner"
        :icon-only="false"
        class="mx-auto"
      />
      <div>d.</div>
      <country-link
        v-if="countryWinner?.loser"
        :country="countryWinner?.loser"
        :icon-only="false"
        class="mx-auto"
      />
      {{ event.country?.score }}
    </div>
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 gap-3"
    >
      <!--Singles -->
      <div
        v-if="event.singles"
        class="text-sm grid grid-cols-1 gap-3"
        :class="{ 'md:grid-cols-2': tours.length > 1 }"
      >
        <div
          v-for="match in event.singles"
          :key="`singles-${match.tour}`"
          :class="`ring ring-${match.tour.toLowerCase()} rounded-lg py-3 flex flex-col gap-2 items-center justify-center`"
        >
          <div
            v-if="typeof match.winner === 'string'"
            class="my-auto"
          >
            {{ match.winner }}
          </div>
          <player-link :player="match.winner as PlayerInterface" />

          <div v-if="match.loser">d.</div>

          <player-link
            v-if="match.loser"
            :player="match.loser as PlayerInterface"
          />

          <match-score-item
            v-if="match.sets.length"
            :labels="match.labels"
            :sets="match.sets"
            :id="event.id"
            :year="event.year.toString()"
            :match_no="1"
            :stats="match.stats"
            :tournament="{ name, id: Number(id), tours }"
          />
        </div>
      </div>

      <!--Doubles-->
      <div
        v-if="event.doubles"
        class="text-sm grid grid-cols-1 gap-3"
        :class="{ 'md:grid-cols-2': tours.length > 1 }"
      >
        <div
          v-for="match in event.doubles"
          :key="`doubles-${match.tour}`"
          :class="`ring ring-${match.tour.toLowerCase()} rounded-lg py-3 flex flex-col gap-2 items-center`"
        >
          <div
            v-if="typeof match.winner === 'string'"
            class="my-auto"
          >
            {{ match.winner }}
          </div>
          <player-link
            v-else
            v-for="(player, index) in match.winner"
            :key="`winner-${index}`"
            :player="player"
          />

          <div v-if="match.loser">d.</div>

          <player-link
            v-if="match.loser"
            v-for="(player, index) in match.loser"
            :key="`loser-${index}`"
            :player="player"
          />

          <match-score-item
            v-if="match.sets?.length"
            :labels="match.labels"
            :sets="match.sets"
            :id="event.id"
            :year="event.year.toString()"
            :match_no="1"
            :stats="match.stats"
            :tournament="{ name, id: Number(id), tours }"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="mx-auto w-fit">
        <event-buttons
          :tournament="{ name, id: Number(id), tours }"
          :year="event.year"
          :id="event.id"
        />
      </div>
    </template>
  </u-card>
</template>
