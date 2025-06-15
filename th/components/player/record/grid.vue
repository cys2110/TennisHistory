<script setup lang="ts">
const { tour } = defineProps<{
  results: APIPlayerRecordType
  status: APIStatusType
  tour: TourType
}>()
const {
  params: { name }
} = useRoute()

const majorTournaments = [
  { id: 580, name: "Australian Open" },
  { id: 520, name: "French Open" },
  { id: 540, name: "Wimbledon" },
  { id: 580, name: "US Open" },
  { id: tour === "ATP" ? 605 : 10, name: "Year End Finals" },
  { id: 96, name: "Olympics" }
]
</script>

<template>
  <u-page-list>
    <dashboard-subpanel
      v-for="tournament in majorTournaments"
      :key="tournament.id"
    >
      <template #title>
        <u-link
          :to="{ name: 'tournament', params: { id: tournament.id, name: encodeName(tournament.name) } }"
          class="hover-link"
        >
          {{ tournament.name }}
        </u-link>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <u-alert
            color="singles"
            variant="subtle"
            title="Singles"
            class="w-full text-center mb-5"
          />
          <div
            v-if="results.singles[tournament.id].length"
            class="flex flex-col gap-1 items-center text-sm font-semibold"
          >
            <div
              v-for="result in results.singles[tournament.id]"
              :key="result.year"
            >
              <u-link
                :to="{ name: 'event', params: { id: tournament.id, name: encodeName(tournament.name), year: result.year, eid: result.id } }"
                class="hover-link"
              >
                {{ result.year }}
              </u-link>
              -
              <span :class="{ 'text-success': result.round === 'Win' }">
                {{ result.round === "Win" ? "WIN" : result.round }}
              </span>
            </div>
          </div>
          <error-message
            v-else
            :message="`${name} has not played in ${tournament.name} singles`"
          />
        </div>

        <div>
          <u-alert
            color="doubles"
            variant="subtle"
            title="Doubles"
            class="w-full text-center mb-5"
          />
          <div
            v-if="results.doubles[tournament.id].length"
            class="flex flex-col gap-1 items-center text-sm font-semibold"
          >
            <div
              v-for="result in results.doubles[tournament.id]"
              :key="result.year"
            >
              <u-link
                :to="{ name: 'event', params: { id: tournament.id, name: encodeName(tournament.name), year: result.year, eid: result.id } }"
                class="hover-link"
              >
                {{ result.year }}
              </u-link>
              -
              <span :class="{ 'text-success': result.round === 'Win' }">
                {{ result.round === "Win" ? "WIN" : result.round }}
              </span>
            </div>
          </div>
          <error-message
            v-else
            :message="`${name} has not played in ${tournament.name} doubles`"
          />
        </div>
      </div>
    </dashboard-subpanel>
  </u-page-list>
</template>
