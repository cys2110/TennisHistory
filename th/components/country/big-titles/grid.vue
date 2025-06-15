<script setup lang="ts">
type EventPreview = Pick<EventInterface, "id" | "year" | "category" | "tournament" | "atp_category" | "wta_category" | "tours">

const { players, status } = defineProps<{
  players: { singles_players: CountryBigTitlesAPIResponseType[]; doubles_players: CountryBigTitlesAPIResponseType[] }
  status: APIStatusType
}>()

const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
const keys = [
  {
    label: "Grand Slams",
    key: "gs" as keyof Pick<CountryBigTitlesAPIResponseType, "gs" | "a1000" | "olympics" | "finals">
  },
  {
    label: "1000 level",
    key: "a1000" as keyof Pick<CountryBigTitlesAPIResponseType, "gs" | "a1000" | "olympics" | "finals">
  },
  {
    label: "Olympics",
    key: "olympics" as keyof Pick<CountryBigTitlesAPIResponseType, "gs" | "a1000" | "olympics" | "finals">
  },
  {
    label: "Year End Finals",
    key: "finals" as keyof Pick<CountryBigTitlesAPIResponseType, "gs" | "a1000" | "olympics" | "finals">
  }
]

const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div>
      <u-alert
        color="singles"
        variant="subtle"
        title="Players who have won singles big titles"
        class="w-full text-center mb-5"
      />
      <u-page-grid
        v-if="players.singles_players.length || ['pending', 'idle'].includes(status)"
        class="md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2"
      >
        <u-card
          v-if="players.singles_players.length"
          v-for="player in players.singles_players"
          :key="player.id"
          :class="player.tour === 'ATP' ? 'ring-atp dark:ring-atp' : 'ring-wta dark:ring-wta'"
          :ui="{ header: 'flex flex-row justify-between items-center' }"
        >
          <template #header>
            <u-link
              :to="{
                name: 'player',
                params: {
                  id: player.id,
                  name: encodeName(player.name)
                }
              }"
              class="hover-link"
            >
              {{ player.name }}
            </u-link>
            <u-badge
              :label="player.max_year === currentYear ? 'Active' : 'Inactive'"
              :color="player.max_year === currentYear ? 'active' : 'inactive'"
            />
          </template>
          <div class="flex flex-col gap-2 text-sm">
            <div
              v-for="key in keys"
              :key="key.label"
            >
              <template v-if="player[key.key].length">
                <div class="font-semibold text-center">{{ key.label }}</div>
                <div
                  v-for="event in player[key.key] as EventPreview[]"
                  :key="event.id"
                  class="flex items-center justify-between gap-1"
                >
                  <u-link
                    :to="{
                      name: 'tournament',
                      params: {
                        id: event.tournament.id,
                        name: encodeName(event.tournament.name)
                      }
                    }"
                    class="hover-link"
                  >
                    {{ event.tournament.name }}
                  </u-link>
                  <u-link
                    :to="{
                      name: 'event',
                      params: {
                        id: event.tournament.id,
                        name: encodeName(event.tournament.name),
                        year: event.year,
                        eid: event.id
                      }
                    }"
                    class="hover-link"
                  >
                    {{ event.year }}
                  </u-link>
                </div>
              </template>
            </div>
          </div>
        </u-card>
        <loading-player
          v-else
          v-for="_ in 6"
          :key="_"
        />
      </u-page-grid>
      <error-message
        v-else
        :message="`No players who have won singles big titles representing ${name}`"
      />
    </div>
    <div>
      <u-alert
        color="doubles"
        variant="subtle"
        title="Players who have won doubles big titles"
        class="w-full text-center mb-5"
      />
      <u-page-grid
        v-if="players.doubles_players.length || ['pending', 'idle'].includes(status)"
        class="md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2"
      >
        <u-card
          v-if="players.doubles_players.length"
          v-for="player in players.doubles_players"
          :key="player.id"
          :class="player.tour === 'ATP' ? 'ring-atp dark:ring-atp' : 'ring-wta dark:ring-wta'"
          :ui="{ header: 'flex flex-row justify-between items-center' }"
        >
          <template #header>
            <u-link
              :to="{
                name: 'player',
                params: {
                  id: player.id,
                  name: encodeName(player.name)
                }
              }"
              class="hover-link"
            >
              {{ player.name }}
            </u-link>
            <u-badge
              :label="player.max_year === currentYear ? 'Active' : 'Inactive'"
              :color="player.max_year === currentYear ? 'active' : 'inactive'"
            />
          </template>
          <div class="flex flex-col gap-2 text-sm">
            <div
              v-for="key in keys"
              :key="key.label"
            >
              <template v-if="player[key.key].length">
                <div class="font-semibold text-center">{{ key.label }}</div>
                <div
                  v-for="event in player[key.key] as EventPreview[]"
                  :key="event.id"
                  class="flex items-center justify-between gap-1"
                >
                  <u-link
                    :to="{
                      name: 'tournament',
                      params: {
                        id: event.tournament.id,
                        name: encodeName(event.tournament.name)
                      }
                    }"
                    class="hover-link"
                  >
                    {{ event.tournament.name }}
                  </u-link>
                  <u-link
                    :to="{
                      name: 'event',
                      params: {
                        id: event.tournament.id,
                        name: encodeName(event.tournament.name),
                        year: event.year,
                        eid: event.id
                      }
                    }"
                    class="hover-link"
                  >
                    {{ event.year }}
                  </u-link>
                </div>
              </template>
            </div>
          </div>
        </u-card>
        <loading-player
          v-else
          v-for="_ in 6"
          :key="_"
        />
      </u-page-grid>
      <error-message
        v-else
        :message="`No players who have won doubles big titles representing ${name}`"
      />
    </div>
  </div>
</template>
