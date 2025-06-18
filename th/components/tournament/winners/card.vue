<script setup lang="ts">
const { event } = defineProps<{ event: TournamentWinnerType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
const tours = inject<TourType[]>("tours", [])
const keys: (keyof Pick<TournamentWinnerType, "ms" | "ls" | "md" | "ld">)[] = ["ms", "md", "ls", "ld"]

const countryWinner = computed(() => {
  if (event.country) {
    const score = event.country.score.split("-").map((s: string) => Number(s))
    return {
      winner: score[0] > score[1] ? event.country.c1 : event.country.c2,
      loser: score[0] > score[1] ? event.country.c2 : event.country.c1
    }
  }
})
</script>

<template>
  <u-card
    :ui="{ header: 'text-xl font-semibold' }"
    variant="subtle"
  >
    <template #header>{{ event.year }}</template>
    <div
      v-if="!COUNTRY_DRAWS.includes(route.params.id as string)"
      class="grid grid-cols-1 md:grid-cols-2 gap-5"
      :class="{ 'lg:grid-cols-4': tours.length === 2 }"
    >
      <template
        v-for="key in keys"
        :key="key"
      >
        <u-page-card
          v-if="event[key]"
          highlight
          :highlight-color="
            key.startsWith('m') ?
              tours.includes('ATP') ?
                'atp'
              : 'men'
            : tours.includes('WTA') ? 'wta'
            : 'women'
          "
          :title="key.endsWith('s') ? 'Singles' : 'Doubles'"
          :ui="{ body: 'w-full', description: 'flex flex-col gap-5 text-center mt-5' }"
        >
          <template #description>
            <!--Display for singles v. doubles-->
            <player-link
              v-if="key.endsWith('s') && typeof event[key] === 'object' && typeof event[key].winner === 'object'"
              :player="event[key].winner as TournamentWinnerPlayerType"
              class="mx-auto"
            />
            <div
              v-else-if="typeof event[key] === 'object' && Array.isArray(event[key].winner)"
              class="flex flex-wrap items-center gap-2 mx-auto"
            >
              <div
                v-for="(player, index) in event[key].winner as TournamentWinnerPlayerType[]"
                :key="player.id"
                class="flex items-center gap-2 mx-auto"
              >
                <player-link :player="player" />
                {{ index === 0 ? "/" : "" }}
              </div>
            </div>

            <!--Check if final was played-->
            <div>{{ typeof event[key] === "object" ? "d." : event[key] }}</div>

            <player-link
              v-if="key.endsWith('s') && typeof event[key] === 'object' && typeof event[key].winner === 'object'"
              :player="event[key].loser as TournamentWinnerPlayerType"
              class="mx-auto"
            />
            <div
              v-else-if="typeof event[key] === 'object' && Array.isArray(event[key].winner)"
              class="flex flex-wrap items-center gap-2 mx-auto"
            >
              <div
                v-for="(player, index) in event[key].loser as TournamentWinnerPlayerType[]"
                :key="player.id"
                class="flex items-center gap-2 mx-auto"
              >
                <player-link :player="player" />
                {{ index === 0 ? "/" : "" }}
              </div>
            </div>
            <match-score-item
              :sets="(event[key] as any).sets"
              :tbs="(event[key] as any).tbs"
              :tournament="{ name: route.params.name as string, id: Number(route.params.id as string) }"
              :year="event.year.toString()"
              :id="event.id"
              :match_no="1"
              :incomplete="(event[key] as any).incomplete"
              :tour="key.startsWith('m') ? 'ATP' : 'WTA'"
              :type="key.endsWith('s') ? 'Singles' : 'Doubles'"
              class="mx-auto"
              round="Final"
            />
          </template>
        </u-page-card>
      </template>
    </div>
    <!--Country draw results-->
    <div
      v-else
      class="flex flex-col gap-3 text-center"
    >
      <country-link
        v-if="countryWinner?.winner"
        :country="countryWinner?.winner"
        class="mx-auto"
      />
      <div>d.</div>
      <country-link
        v-if="countryWinner?.loser"
        :country="countryWinner?.loser"
        class="mx-auto"
      />
      {{ event.country?.score }}
    </div>
    <template #footer>
      <event-buttons
        class="mx-auto"
        :tournament="{ name: route.params.name as string, id: Number(route.params.id as string) }"
        :year="event.year"
        :id="event.id"
        size="md"
      />
    </template>
  </u-card>
</template>
