<script setup lang="ts">
import { CalendarDate } from "@internationalized/date"

const {
  ui: { icons }
} = useAppConfig()
const { match } = defineProps<{ match: MatchInterface }>()
const { viewMode } = useDefaults()
const { mid, eid, year, id, name } = useRoute().params as { mid: string; eid: string; year: string; id: string; name: string }

const { tour, draw, type } = destructureMid(mid)

const calendarDate = computed(() => {
  if (match.date) {
    const { year, month, day } = match.date
    return new CalendarDate(year, month, day)
  } else {
    const {
      start_date: { year: startYear, month: startMonth, day: startDay },
      end_date: { year: endYear, month: endMonth, day: endDay }
    } = match
    return { start: new CalendarDate(startYear, startMonth, startDay), end: new CalendarDate(endYear, endMonth, endDay) }
  }
})
const duration = computed(() => {
  if (match.duration) {
    const { hours, minutes, seconds } = match.duration
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  return "00:00:00"
})
</script>

<template>
  <div v-if="viewMode === 'list'">
    <table class="mx-auto">
      <tbody>
        <tr>
          <th>Surface</th>
          <td>
            <u-link
              :to="{ name: 'surface', params: { id: kebabCase(match.surface.id) } }"
              class="hover-link"
            >
              {{ match.surface.id }}
            </u-link>
          </td>
          <th>{{ match.date ? "Date" : "Dates" }}</th>
          <td>
            {{
              match.date ?
                useDateFormat(getDate(match.date), "dddd DD MMMM, YYYY")
              : dateTimeFormat.formatRange(getDate(match.start_date), getDate(match.end_date))
            }}
          </td>
        </tr>
        <tr>
          <th>Duration</th>
          <td>{{ duration }}</td>
          <th>{{ type === "Singles" ? "Player 1" : "Team 1" }}</th>
          <td class="flex flex-col">
            <player-link
              v-for="player in match.p1"
              :key="player.id"
              :player
            />
          </td>
        </tr>
        <tr>
          <th>Court</th>
          <td>{{ match.court ?? "—" }}</td>
          <th>{{ type === "Singles" ? "Player 2" : "Team 2" }}</th>
          <td class="flex flex-col">
            <player-link
              v-for="player in match.p2"
              :key="player.id"
              :player
            />
          </td>
        </tr>
        <tr>
          <th>Umpire</th>
          <td>
            <u-link
              v-if="match.umpire"
              :to="{ name: 'umpire', params: { id: kebabCase(match.umpire) } }"
              class="hover-link"
            >
              {{ match.umpire }}
            </u-link>
            <template v-else>—</template>
          </td>
          <th>Score</th>
          <td>
            <match-score-item
              :labels="[type, draw, tour]"
              :sets="match.sets"
              :id="parseInt(eid)"
              :year="parseInt(year)"
              :match_no="match.match_no"
              :tournament="{ id: parseInt(id), name, tours: [tour as TourType] }"
              :incomplete="match.p1_incomplete || match.p2_incomplete"
              :stats="false"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div
    v-else-if="match"
    class="flex flex-col md:flex-row flex-wrap gap-8 max-w-full mx-auto"
  >
    <div
      class="border-2 p-5 rounded-xl flex flex-row justify-between max-w-fit h-fit m-auto gap-8 text-xs md:text-sm"
      :class="`border-${getTourColour([tour as TourType])}`"
    >
      <table>
        <tbody>
          <tr>
            <th>Surface</th>
            <td>
              <u-link
                :to="{ name: 'surface', params: { id: kebabCase(match.surface.id) } }"
                class="hover-link"
              >
                {{ match.surface.id }}
              </u-link>
            </td>
          </tr>
          <tr v-if="match.duration">
            <th>Duration</th>
            <td>{{ duration }}</td>
          </tr>
          <tr v-if="match.court">
            <th>Court</th>
            <td>{{ match.court }}</td>
          </tr>
          <tr v-if="match.umpire">
            <th>Umpire</th>
            <td>
              <u-link
                v-if="match.umpire"
                :to="{ name: 'umpire', params: { id: kebabCase(match.umpire) } }"
                class="hover-link"
              >
                {{ match.umpire }}
              </u-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!--Score box-->
    <div
      class="flex-1 border-2 p-5 rounded-xl flex justify-between h-fit my-auto text-xs md:text-sm md:order-last md:min-w-fit lg:min-w-0"
      :class="`border-${getTourColour([tour as TourType])}`"
    >
      <!--Players-->
      <div class="flex flex-col gap-5 min-h-full justify-evenly">
        <div class="flex flex-wrap items-center gap-2">
          <template
            v-for="(player, index) in match.p1"
            :key="player.id"
          >
            <u-separator
              v-if="index === 1"
              orientation="vertical"
              class="h-4"
            />
            <player-link :player />
            <small v-if="player.rank || player.rank === 0">[{{ player.rank }}]</small>
          </template>
          <small>
            {{
              draw === "Qualifying" ?
                match.p1[0]?.q_seed && match.p1[0].q_status ? `(${match.p1[0].q_seed} ${match.p1[0].q_status})`
                : match.p1[0]?.q_seed || match.p1[0]?.q_status ? `(${match.p1[0]?.q_seed ?? match.p1[0].q_status})`
                : ""
              : draw === "Main" ?
                match.p1[0]?.seed && match.p1[0].status ? `(${match.p1[0].seed} ${match.p1[0].status})`
                : match.p1[0]?.seed || match.p1[0]?.status ? `(${match.p1[0]?.seed ?? match.p1[0].status})`
                : ""
              : ""
            }}
          </small>
          <div class="flex items-center">
            <u-icon
              v-if="match.p1_winner"
              :name="icons.success"
              class="text-success text-lg"
            />
            <u-badge
              v-else-if="match.p1_incomplete"
              color="error"
              :label="`${match.p1_incomplete}.`"
            />
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <template
            v-for="(player, index) in match.p2"
            :key="player.id"
          >
            <u-separator
              v-if="index === 1"
              orientation="vertical"
              class="h-4"
            />
            <player-link :player />
            <small v-if="player.rank || player.rank === 0">[{{ player.rank }}]</small>
          </template>
          <small>
            {{
              draw === "Qualifying" ?
                match.p2[0]?.q_seed && match.p2[0].q_status ? `(${match.p2[0].q_seed} ${match.p2[0].q_status})`
                : match.p2[0]?.q_seed || match.p2[0]?.q_status ? `(${match.p2[0]?.q_seed ?? match.p2[0].q_status})`
                : ""
              : draw === "Main" ?
                match.p2[0]?.seed && match.p2[0].status ? `(${match.p2[0].seed} ${match.p2[0].status})`
                : match.p2[0]?.seed || match.p2[0]?.status ? `(${match.p2[0]?.seed ?? match.p2[0].status})`
                : ""
              : ""
            }}
          </small>
          <div class="flex items-center">
            <u-icon
              v-if="!match.p1_winner"
              :name="icons.success"
              class="text-success text-lg"
            />
            <u-badge
              v-else-if="match.p2_incomplete"
              color="error"
              :label="`${match.p2_incomplete}.`"
            />
          </div>
        </div>
      </div>

      <!--Scores-->
      <div class="flex flex-col gap-5 min-h-full justify-evenly">
        <div
          v-for="(x, index) in match.sets"
          :key="`p-${index}`"
          :class="`grid grid-cols-5 gap-1`"
        >
          <div v-if="match.sets[index] && match.sets[index].length < 5" />
          <div v-if="match.sets[index] && match.sets[index].length < 4" />
          <template
            v-for="(s, idx) in x"
            :key="`p-${index}-${idx}`"
          >
            <!--prettier-ignore-->
            <span class="text-center" :class="{ 'font-semibold': s > (match.sets?.[index === 0 ? 1 : 0]?.[idx] ?? 0) && (match.sets?.[index === 0 ? 1 : 0]?.[idx] !== undefined) }">{{ s[0] }}<sup v-if="isDefined(s[1])">{{ s[1] }}</sup></span>
          </template>
        </div>
      </div>
    </div>

    <!--Date-->
    <div
      class="border-2 p-5 rounded-xl text-xs sm:text-sm max-w-fit m-auto lg:order-last"
      :class="`border-${getTourColour([tour as TourType])}`"
    >
      <u-calendar
        :range="match.date ? false : true"
        v-model="calendarDate"
        disabled
        :month-controls="false"
        :year-controls="false"
        :fixed-weeks="false"
        size="xs"
        :color="getTourColour([tour as TourType])"
      />
    </div>
  </div>
  <error-message
    v-else
    message="No match details available"
  />
</template>

<style scoped>
@reference "../../assets/css/main.css";

td {
  @apply py-2 px-5 text-sm;
}

th {
  @apply text-sm text-muted text-left;
}
</style>
