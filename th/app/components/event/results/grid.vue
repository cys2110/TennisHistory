<script setup lang="ts">
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const { id, year, name, eid } = useRoute().params as { id: string; year: string; name: string; eid: string }
defineProps<{
  tournament: TournamentInterface
}>()

const tourType = defineModel<TourType>("tour")
const matchType = defineModel<MatchType>("match")

type ResultsType = {
  title: RoundType
  matches: MatchInterface[]
}

// API call
const { data: results } = await useFetch<ResultsType[]>("/api/events/results", {
  key: `results-grid-${eid}-${tourType}-${matchType}`,
  query: { id: eid, tour: tourType, type: matchType },
  default: () => []
})

const constructMatchNo = (match_no: number, draw: DrawType) => {
  const genderPrefix =
    tourType.value === "WTA" ? "l"
    : tourType.value === "ATP" ? "g"
    : tourType.value === "Men" ? "m"
    : "w"
  const typePrefix = matchType.value === "Singles" ? "s" : "d"
  const drawTypePrefix = draw === "Main" ? "m" : "q"
  const suffix =
    match_no < 10 ? `00${match_no}`
    : match_no < 100 ? `0${match_no}`
    : match_no
  return `${drawTypePrefix}${genderPrefix}${typePrefix}${suffix}`
}
</script>

<template>
  <u-stepper
    v-if="results.length"
    :items="results"
    :linear="false"
  >
    <template #indicator="{ item }">
      {{ SHORT_ROUNDS[item.title] }}
    </template>

    <template #content="{ item }">
      <u-page-grid>
        <u-card
          v-for="match in item.matches"
          :key="`${item.title}-${match.match_no}`"
          :ui="{
            root: `ring-${getTourColour([tourType!])}`,
            header: 'text-sm',
            footer: 'flex justify-center'
          }"
        >
          <template #header>
            <div class="flex flex-col">
              <div class="flex justify-between">
                <span v-if="match.date">{{ useDateFormat(getDate(match.date), "dddd DD MMMM, YYYY") }}</span>
                <span class="justify-self-end">{{
                  match.duration ?
                    `${match.duration.hours.toString().padStart(2, "0")}:${match.duration.minutes.toString().padStart(2, "0")}:${match.duration.seconds.toString().padStart(2, "0")}`
                  : "00:00:00"
                }}</span>
              </div>
              <div class="flex justify-between">
                <div v-if="match.court">{{ match.court }}</div>
                <u-link
                  v-if="match.umpire"
                  class="justify-self-end hover-link w-fit"
                  :to="{ name: 'umpire', params: { id: kebabCase(match.umpire) } }"
                >
                  {{ match.umpire }}
                </u-link>
              </div>
            </div>
          </template>

          <div class="grid grid-rows-2 grid-flow-col gap-4">
            <div class="flex items-center gap-2 col-span-3">
              <div class="flex flex-col">
                <player-link
                  v-for="player in match.winners.players"
                  :key="`${item.title}-${player.id}`"
                  :player
                />
              </div>
              <div v-if="item.title.includes('Qualifying')">
                <small v-if="match.winners.players[0] && (match.winners.players[0].q_seed || match.winners.players[0].q_status)">
                  ({{
                    match.winners.players[0].q_seed && match.winners.players[0].q_status ?
                      `${match.winners.players[0].q_seed} ${match.winners.players[0].q_status}`
                    : (match.winners.players[0].q_seed ?? match.winners.players[0].q_status)
                  }})
                </small>
              </div>
              <div v-else>
                <small v-if="match.winners.players[0] && (match.winners.players[0].seed || match.winners.players[0].status)">
                  ({{
                    match.winners.players[0].seed && match.winners.players[0].status ?
                      `${match.winners.players[0].seed} ${match.winners.players[0].status}`
                    : (match.winners.players[0].seed ?? match.winners.players[0].status)
                  }})
                </small>
              </div>
            </div>
            <div class="flex items-center gap-2 col-span-3">
              <div class="flex flex-col">
                <player-link
                  v-for="player in match.losers.players"
                  :key="`${item.title}-${player.id}`"
                  :player
                />
              </div>
              <div v-if="item.title.includes('Qualifying')">
                <small v-if="match.losers.players[0] && (match.losers.players[0].q_seed || match.losers.players[0].q_status)">
                  ({{
                    match.losers.players[0].q_seed && match.losers.players[0].q_status ?
                      `${match.losers.players[0].q_seed} ${match.losers.players[0].q_status}`
                    : (match.losers.players[0].q_seed ?? match.losers.players[0].q_status)
                  }})
                </small>
              </div>
              <div v-else>
                <small v-if="match.losers.players[0] && (match.losers.players[0].seed || match.losers.players[0].status)">
                  ({{
                    match.losers.players[0].seed && match.losers.players[0].status ?
                      `${match.losers.players[0].seed} ${match.losers.players[0].status}`
                    : (match.losers.players[0].seed ?? match.losers.players[0].status)
                  }})
                </small>
              </div>
            </div>
            <div class="flex items-center">
              <u-icon
                :name="uIcons.success"
                class="text-success text-lg mt-1"
              />
            </div>
            <div />
            <div class="flex items-center gap-1 justify-end">
              <div
                v-for="(set, index) in match.winners.sets"
                :key="`winner-set-${index}`"
              >
                {{ set[0] }}<sup v-if="set[1]">{{ set[1] }}</sup>
              </div>
            </div>
            <div class="flex items-center gap-1 justify-end">
              <div
                v-for="(set, index) in match.losers.sets"
                :key="`winner-set-${index}`"
              >
                {{ set[0] }}<sup v-if="set[1]">{{ set[1] }}</sup>
              </div>
            </div>
            <div v-if="match.incomplete" />
            <u-badge
              v-if="match.incomplete"
              :label="`${match.incomplete}.`"
              color="error"
            />
          </div>

          <template #footer>
            <u-button-group size="sm">
              <u-button
                label="Stats"
                :icon="icons.stats"
                :disabled="!match.stats"
                :to="{
                  name: 'match',
                  params: {
                    name,
                    id,
                    year,
                    eid,
                    mid: constructMatchNo(match.match_no, item.title.includes('Qualifying') ? 'Qualifying' : 'Main')
                  }
                }"
              />
              <u-button
                v-if="match.winners.players[0] && match.losers.players[0]"
                label="H2H"
                :icons="icons.h2h"
                :disabled="matchType === 'Doubles'"
                :to="{
                  name: 'h2h-players',
                  params: {
                    p1Name: kebabCase(match.winners.players[0].first_name + ' ' + match.winners.players[0].last_name),
                    p2Name: kebabCase(match.losers.players[0].first_name + ' ' + match.losers.players[0].last_name),
                    p1Id: match.winners.players[0].id,
                    p2Id: match.losers.players[0].id
                  }
                }"
              />
            </u-button-group>
          </template>
        </u-card>
      </u-page-grid>
    </template>
  </u-stepper>

  <error-message
    v-else
    :message="`No results found for ${tournament.name} ${year}`"
  />
</template>
