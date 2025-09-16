<script setup lang="ts">
const {
  params: { id }
} = useRoute("tournament")
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const tournamentName = inject<string>("tournamentName", "")

// API call
const { data: countries, status } = await useFetch<TournamentCountryType[]>("/api/tournaments/country", {
  key: `tournament-country-${id}`,
  query: { id },
  default: () => [],
  server: false
})
</script>

<template>
  <client-only>
    <teleport to="#dashboard-right">
      <tournament-country-chart v-if="mdAndUp && countries.length" />
    </teleport>
  </client-only>
  <u-card
    v-if="countries.length"
    v-for="country in countries"
    :key="country.country.id"
    class="ring-primary my-5"
  >
    <template #header>
      <country-link
        :country="country.country"
        :icon-only="false"
      />
    </template>

    <table class="w-full text-sm text-center [&>tbody>tr>td]:py-1 [&>thead>tr>th]:text-muted">
      <thead>
        <tr>
          <th />
          <th :colspan="3">Individual Winners</th>
          <th :colspan="3">Total Wins</th>
        </tr>
        <tr>
          <th />
          <th>Singles</th>
          <th>Doubles</th>
          <th>Total</th>
          <th>Singles</th>
          <th>Doubles</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <u-badge
              label="ATP"
              color="atp"
              class="w-fit mx-auto"
            />
          </td>
          <td>{{ country.atp_singles_wins }}</td>
          <td>{{ country.atp_doubles_wins }}</td>
          <td>{{ country.atp_singles_wins + country.atp_doubles_wins }}</td>
          <td>{{ country.total_atp_singles_wins }}</td>
          <td>{{ country.total_atp_doubles_wins }}</td>
          <td>{{ country.total_atp_singles_wins + country.total_atp_doubles_wins }}</td>
        </tr>
        <tr>
          <td>
            <u-badge
              label="WTA"
              color="wta"
              class="w-fit mx-auto"
            />
          </td>
          <td>{{ country.wta_singles_wins }}</td>
          <td>{{ country.wta_doubles_wins }}</td>
          <td>{{ country.wta_singles_wins + country.wta_doubles_wins }}</td>
          <td>{{ country.total_wta_singles_wins }}</td>
          <td>{{ country.total_wta_doubles_wins }}</td>
          <td>{{ country.total_wta_singles_wins + country.total_wta_doubles_wins }}</td>
        </tr>
        <tr>
          <td>
            <u-badge
              label="Total"
              class="w-fit mx-auto"
            />
          </td>
          <td>{{ country.atp_singles_wins + country.wta_singles_wins }}</td>
          <td>{{ country.atp_doubles_wins + country.wta_doubles_wins }}</td>
          <td>{{ country.atp_singles_wins + country.atp_doubles_wins + country.wta_singles_wins + country.wta_doubles_wins }}</td>
          <td>{{ country.total_atp_singles_wins + country.total_wta_singles_wins }}</td>
          <td>{{ country.total_atp_doubles_wins + country.total_wta_doubles_wins }}</td>
          <td>{{
            country.total_atp_singles_wins + country.total_atp_doubles_wins + country.total_wta_singles_wins + country.total_wta_doubles_wins
          }}</td>
        </tr>
      </tbody>
    </table>
  </u-card>

  <loading-base
    v-else-if="['idle', 'pending'].includes(status)"
    v-for="_ in 10"
    :key="_"
    class="my-5"
  />
  <error-message
    v-else
    :icon="icons.noCountries"
    :message="`No countries represented by winners of ${tournamentName}`"
  />
</template>
