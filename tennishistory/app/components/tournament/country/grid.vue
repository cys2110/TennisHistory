<script setup lang="ts">
defineProps<{
  countries: TournamentCountryType[]
  status: APIStatusType
}>()
const { icons } = useAppConfig()
const tournamentName = inject<string>("tournamentName", "")
</script>

<template>
  <u-page-grid v-if="countries.length || status === 'pending'">
    <u-card
      v-if="countries.length"
      v-for="country in countries"
      :key="country.country.id"
      class="ring-joint"
    >
      <template #header>
        <country-link
          :country="country.country"
          :icon-only="false"
        />
      </template>

      <dashboard-subpanel title="Individual Winners">
        <div class="text-center text-sm">
          <div class="grid grid-cols-4 gap-2">
            <div></div>
            <div>Singles</div>
            <div>Doubles</div>
            <div>Total</div>
          </div>

          <div class="grid grid-cols-4 gap-2 mt-2">
            <u-badge
              label="ATP"
              color="atp"
              class="w-fit mx-auto"
            />
            <div class="font-semibold">{{ country.atp_singles_wins }}</div>
            <div class="font-semibold">{{ country.atp_doubles_wins }}</div>
            <div class="font-semibold">{{ country.atp_singles_wins + country.atp_doubles_wins }}</div>
          </div>

          <div class="grid grid-cols-4 gap-2 mt-2">
            <u-badge
              label="WTA"
              color="wta"
              class="w-fit mx-auto"
            />
            <div class="font-semibold">{{ country.wta_singles_wins }}</div>
            <div class="font-semibold">{{ country.wta_doubles_wins }}</div>
            <div class="font-semibold">{{ country.wta_singles_wins + country.wta_doubles_wins }}</div>
          </div>

          <div class="grid grid-cols-4 gap-2 mt-2">
            <u-badge
              label="Total"
              color="joint"
              class="w-fit mx-auto"
            />
            <div class="font-semibold">{{ country.atp_singles_wins + country.wta_singles_wins }}</div>
            <div class="font-semibold">{{ country.atp_doubles_wins + country.wta_doubles_wins }}</div>
            <div class="font-semibold">{{
              country.atp_singles_wins + country.atp_doubles_wins + country.wta_singles_wins + country.wta_doubles_wins
            }}</div>
          </div>
        </div>
      </dashboard-subpanel>

      <dashboard-subpanel title="Total Wins">
        <div class="text-center text-sm">
          <div class="grid grid-cols-4 gap-2">
            <div></div>
            <div>Singles</div>
            <div>Doubles</div>
            <div>Total</div>
          </div>

          <div class="grid grid-cols-4 gap-2 mt-2">
            <u-badge
              label="ATP"
              color="atp"
              class="w-fit mx-auto"
            />
            <div class="font-semibold">{{ country.total_atp_singles_wins }}</div>
            <div class="font-semibold">{{ country.total_atp_doubles_wins }}</div>
            <div class="font-semibold">{{ country.total_atp_singles_wins + country.total_atp_doubles_wins }}</div>
          </div>

          <div class="grid grid-cols-4 gap-2 mt-2">
            <u-badge
              label="WTA"
              color="wta"
              class="w-fit mx-auto"
            />
            <div class="font-semibold">{{ country.total_wta_singles_wins }}</div>
            <div class="font-semibold">{{ country.total_wta_doubles_wins }}</div>
            <div class="font-semibold">{{ country.total_wta_singles_wins + country.total_wta_doubles_wins }}</div>
          </div>

          <div class="grid grid-cols-4 gap-2 mt-2">
            <u-badge
              label="Total"
              color="joint"
              class="w-fit mx-auto"
            />
            <div class="font-semibold">{{ country.total_atp_singles_wins + country.total_wta_singles_wins }}</div>
            <div class="font-semibold">{{ country.total_atp_doubles_wins + country.total_wta_doubles_wins }}</div>
            <div class="font-semibold">{{
              country.total_atp_singles_wins + country.total_atp_doubles_wins + country.total_wta_singles_wins + country.total_wta_doubles_wins
            }}</div>
          </div>
        </div>
      </dashboard-subpanel>
    </u-card>

    <loading-base
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.noCountries"
    :message="`No countries represented by winners of ${tournamentName}`"
  />
</template>
