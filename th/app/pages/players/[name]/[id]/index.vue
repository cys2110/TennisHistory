<script setup lang="ts">
definePageMeta({ name: "player" })
const {
  params: { id }
} = useRoute("player")
const playerYears = useState<string[]>("player-years")
const playerTour = useState<TourType>("player-tour")
const playerName = useState<string>("player-name")
const currentYear = new Date().getFullYear()

// Determine whether player is still active on tour
const activeYears = computed(() => {
  let active = false
  let numberOfYears = 0
  let activeYears = ""
  if (playerYears.value.length > 0) {
    const lastYear = playerYears.value[playerYears.value.length - 1]
    active = Number(lastYear) === new Date().getFullYear()
    numberOfYears = Number(lastYear) - Number(playerYears.value[0]) + 1
    activeYears = `${playerYears.value[0]}${
      playerYears.value.length > 1 ? ` — ${active ? "present" : playerYears.value[playerYears.value.length - 1]}` : ""
    }`
  }
  return { active, numberOfYears, activeYears }
})

// API call
const { data: player, status } = await useFetch<PlayerInterface>("/api/players/details", {
  key: `player-${id}`,
  query: { id },
  server: false
})
</script>

<template>
  <player-wrapper v-slot="{ country }">
    <u-page-header
      :title="playerName"
      :description="`Years Active: ${activeYears.activeYears} (${activeYears.numberOfYears} ${activeYears.numberOfYears === 1 ? 'year' : 'years'})`"
    >
      <template #headline>
        <country-link :country />
        <u-badge
          :color="activeYears.active ? 'active' : 'inactive'"
          :label="activeYears.active ? 'Active' : 'Inactive'"
        />
        <u-badge
          :color="getTourColour([playerTour])"
          :label="playerTour"
        />
      </template>
    </u-page-header>

    <div
      v-if="player"
      class="flex justify-evenly"
    >
      <div>
        <table>
          <tbody class="[&>tr>td]:!border-y [&>tr>td]:!border-muted [&>tr>th]:!border-y [&>tr>th]:!border-muted [&>tr>td]:!py-2">
            <tr>
              <th>Career Prize Money</th>
              <td>{{ player.pm?.toLocaleString("en-US", { style: "currency", currency: "USD" }) }}</td>
            </tr>
            <tr>
              <th>Age</th>
              <td>
                <div>{{ player.age ? `${player.age} years` : "Unknown" }}</div>
                <div>{{
                  player.dod && player.dob ? `${dateTimeFormat.formatRange(getDate(player.dob), getDate(player.dod))}`
                  : player.dob ? dateTimeFormat.format(getDate(player.dob))
                  : undefined
                }}</div>
              </td>
            </tr>
            <tr>
              <th>Height</th>
              <td>
                <div>{{ player.height ? `${player.height} cm` : "Unknown" }}</div>
                <div>{{ player.height ? convertToFt(player.height) : undefined }}</div>
              </td>
            </tr>
            <tr>
              <th>Plays</th>
              <td>{{ isDefined(player.rh) ? handedness(player.rh) : "Unknown" }}</td>
            </tr>
            <tr>
              <th>Backhand</th>
              <td>{{ player.bh ? `${player.bh}-Handed` : "Unknown" }}</td>
            </tr>
            <tr v-if="player.turned_pro || player.retired">
              <th>{{
                player.turned_pro && player.retired ? "Turned pro"
                : player.turned_pro ? "Turned pro"
                : "Retired"
              }}</th>
              <td>
                <div>{{ player.turned_pro ? player.turned_pro : "Unknown" }}</div>
                <div>{{
                  player.turned_pro && player.retired ? `${player.retired - player.turned_pro} years`
                  : player.turned_pro && activeYears.active ? `${currentYear - player.turned_pro} years`
                  : undefined
                }}</div>
              </td>
            </tr>
            <tr v-if="player.hof">
              <th>Hall of Fame Induction</th>
              <td>{{ player.hof }}</td>
            </tr>
            <tr v-if="player.coaches?.length">
              <th>{{ player.coaches.length === 1 ? "Coach" : "Coaches" }}</th>
              <td class="flex flex-col">
                <div
                  v-for="coach in player.coaches"
                  :key="coach.id"
                  class="flex flex-col gap-0"
                >
                  <u-link
                    :to="{ name: 'coach', params: { id: kebabCase(coach.id) } }"
                    class="hover-link font-semibold w-fit mx-auto"
                  >
                    {{ coach.first_name ? `${coach.first_name} ${coach.last_name}` : coach.id }}
                  </u-link>
                  <span class="text-sm text-dimmed">({{ coach.dates.join(", ") }})</span>
                </div>
              </td>
            </tr>
            <tr v-if="player.countries.length">
              <th>{{ player.countries.length === 1 ? "Previous Representation" : "Previous Representations" }}</th>
              <td class="flex flex-col">
                <div
                  v-for="country in player.countries"
                  :key="country.id"
                  class="my-2"
                >
                  <country-link
                    :country
                    :icon-only="false"
                    class="text-sm font-semibold mx-auto w-fit"
                  />
                  <span
                    v-if="country.start_date && country.end_date"
                    class="text-sm text-dimmed"
                  >
                    {{ dateTimeFormat.formatRange(getDate(country.start_date), getDate(country.end_date)) }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th :colspan="2"></th>
              <th>Singles</th>
              <th>Doubles</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th
                :rowspan="3"
                class="rotate-270"
              >
                Ranking
              </th>
              <th>Current</th>
              <td>{{ player.current_singles || "—" }}</td>
              <td>{{ player.current_doubles || "—" }}</td>
            </tr>
            <tr>
              <th>Career High</th>
              <td>{{ player.ch_singles || "—" }}</td>
              <td>{{ player.ch_doubles || "—" }}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{{ player.singles_ch_date ? useDateFormat(getDate(player.singles_ch_date), "DD MMM YYYY") : "—" }}</td>
              <td>{{ player.doubles_ch_date ? useDateFormat(getDate(player.doubles_ch_date), "DD MMM YYYY") : "—" }}</td>
            </tr>
            <tr
              v-for="(level, index) in player.titles"
              :key="`title-${level.level}`"
            >
              <th
                v-if="index === 0"
                :rowspan="player.titles.length"
                class="rotate-270"
              >
                Titles
              </th>
              <th>{{ level.level }}</th>
              <td>{{ level.singles }}</td>
              <td>{{ level.doubles }}</td>
            </tr>
            <tr
              v-for="(level, index) in player.wl"
              :key="`title-${level.level}`"
            >
              <th
                v-if="index === 0"
                :rowspan="player.wl!.length"
                class="rotate-270"
              >
                Win-Loss (M)
              </th>
              <th>{{ level.level }}</th>
              <td>{{ level.singles.wins }}-{{ level.singles.losses }}</td>
              <td>{{ level.doubles.wins }}-{{ level.doubles.losses }}</td>
            </tr>
            <tr
              v-for="(level, index) in player.wl"
              :key="`title-${level.level}`"
            >
              <th
                v-if="index === 0"
                :rowspan="player.wl!.length"
                class="rotate-270"
              >
                Win-Loss (Q)
              </th>
              <th>{{ level.level }}</th>
              <td>{{ level.singles.q_wins }}-{{ level.singles.q_losses }}</td>
              <td>{{ level.doubles.q_wins }}-{{ level.doubles.q_losses }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th
                :colspan="2"
                class="uppercase"
                >Most Frequent H2H</th
              >
            </tr>
            <tr>
              <th class="!text-left !pl-5">Player</th>
              <th>Win-Loss</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="h2h in player.h2h"
              :key="h2h.opponent.id"
            >
              <td><player-link :player="h2h.opponent" /></td>
              <td>{{ h2h.wins }}-{{ h2h.matches - h2h.wins }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </player-wrapper>
</template>

<style scoped>
@reference "../../../../assets/css/main.css";

td {
  @apply py-1 px-5 text-sm text-center;
}

th {
  @apply text-sm text-muted;
}
</style>
