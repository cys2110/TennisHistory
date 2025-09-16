<script setup lang="ts">
const { active, status, player } = defineProps<{
  active: boolean
  status: APIStatusType
  player: PlayerInterface | undefined
}>()
const { icons } = useAppConfig()
const currentYear = new Date().getFullYear()
const playerName = useState<string>("player-name")
const tour = useState<TourType>("player-tour")
</script>

<template>
  <u-page-columns
    v-if="player"
    class="lg:columns-2 xl:columns-3"
  >
    <details-card
      title="Ranking"
      :tour
    >
      <table class="mx-auto">
        <thead>
          <tr>
            <th></th>
            <th>Singles</th>
            <th>Doubles</th>
          </tr>
        </thead>
        <tbody>
          <tr>
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
        </tbody>
      </table>
    </details-card>

    <details-card
      title="Titles"
      :tour
    >
      <table class="mx-auto">
        <thead>
          <tr>
            <th>Level</th>
            <th>Singles</th>
            <th>Doubles</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="level in player.titles"
            :key="`title-${level.level}`"
          >
            <td>{{ level.level }}</td>
            <td>{{ level.singles }}</td>
            <td>{{ level.doubles }}</td>
          </tr>
        </tbody>
      </table>
    </details-card>

    <details-card
      title="Win-Loss"
      :tour
    >
      <table class="mx-auto">
        <thead>
          <tr>
            <th></th>
            <th :colspan="2">SINGLES</th>
            <th :colspan="2">DOUBLES</th>
          </tr>
          <tr>
            <th>Level</th>
            <th>Main</th>
            <th>Qualifying</th>
            <th>Main</th>
            <th>Qualifying</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="level in player.wl"
            :key="`wl-${level}`"
          >
            <td>{{ level.level }}</td>
            <td>{{ level.singles.wins }}-{{ level.singles.losses }}</td>
            <td>{{ level.singles.q_wins }}-{{ level.singles.q_losses }}</td>
            <td>{{ level.doubles.wins }}-{{ level.doubles.losses }}</td>
            <td>{{ level.doubles.q_wins }}-{{ level.doubles.q_losses }}</td>
          </tr>
        </tbody>
      </table>
    </details-card>

    <details-card
      title="Career Prize Money"
      :tour
      :value="player.pm?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })"
    />

    <details-card
      title="Age"
      :tour
      :value="player.age ? `${player.age} years` : 'Unknown'"
      :description="
        player.dod && player.dob ? `${dateTimeFormat.formatRange(getDate(player.dob), getDate(player.dod))}`
        : player.dob ? dateTimeFormat.format(getDate(player.dob))
        : undefined
      "
    />

    <details-card
      title="Height"
      :tour
      :value="player.height ? `${player.height} cm` : 'Unknown'"
      :description="player.height ? convertToFt(player.height) : undefined"
    />

    <details-card
      title="Plays"
      :tour
      :value="isDefined(player.rh) ? handedness(player.rh) : 'Unknown'"
    />

    <details-card
      title="Backhand"
      :tour
      :value="player.bh ? `${player.bh}-Handed` : 'Unknown'"
    />

    <details-card
      v-if="player.turned_pro || player.retired"
      :title="
        player.turned_pro && player.retired ? 'Turned pro'
        : player.turned_pro ? 'Turned pro'
        : 'Retired'
      "
      :tour
      :value="player.turned_pro ? player.turned_pro : 'Unknown'"
      :description="
        player.turned_pro && player.retired ? `${player.retired - player.turned_pro} years`
        : player.turned_pro && active ? `${currentYear - player.turned_pro} years`
        : undefined
      "
    />

    <details-card
      v-if="player.hof"
      :tour
      title="Hall of Fame Induction"
      :value="player.hof"
    />

    <details-card
      v-if="player.coaches?.length"
      title="Coaches"
      :tour
    >
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
    </details-card>

    <details-card
      v-if="player.countries.length"
      title="Previous Representations"
      :tour
    >
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
    </details-card>

    <details-card
      title="Most Frequent H2H"
      :tour
    >
      <div
        v-for="h2h in player.h2h"
        :key="h2h.opponent.id"
        class="flex items-center justify-between"
      >
        <player-link :player="h2h.opponent" />
        <div>{{ h2h.wins }}-{{ h2h.matches - h2h.wins }}</div>
      </div>
    </details-card>
  </u-page-columns>
  <u-page-columns
    v-else-if="status === 'pending'"
    class="lg:columns-2 xl:columns-3 2xl:columns-3"
  >
    <loading-base
      v-for="_ in 10"
      :key="_"
    />
  </u-page-columns>
  <error-message
    v-else
    :icon="icons.noPlayer"
    :message="`No details found for ${playerName}`"
  />
</template>

<style scoped>
@reference "../../../assets/css/main.css";

td {
  @apply py-1 px-5 text-sm;
}

th {
  @apply px-5 text-sm text-muted;
}
</style>
