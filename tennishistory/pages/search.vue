<script setup lang="ts">
import EventsModal from "~/components/search/events-modal.vue"
import PlayersModal from "~/components/search/players-modal.vue"
import UmpiresModal from "~/components/search/umpires-modal.vue"
definePageMeta({ name: "search" })
useHead({ title: "Search" })

const searchTerm = ref("")
const modal = useModal()

const { data, status, error } = await useFetch<SearchResultsType>("/api/getSearchResults", { query: { searchTerm }, immediate: false })

const tabItems = computed(() => {
  if (data.value) {
    return [
      ...(data.value.Players.length > 0 ? [{ label: "Players", icon: "i-material-symbols-person-rounded", slot: "players", data: data.value.Players }] : []),
      ...(data.value.Tournaments.length > 0 ? [{ label: "Tournaments", icon: "i-material-symbols-trophy-outline-rounded", slot: "tournaments" }] : []),
      ...(data.value.Countries.length > 0 ? [{ label: "Countries", icon: "i-material-symbols-globe", slot: "countries" }] : []),
      ...(data.value.Venues.length > 0 ? [{ label: "Venues", icon: "i-material-symbols-stadium-outline-rounded", slot: "venues" }] : []),
      ...(data.value.Surfaces.length > 0 ? [{ label: "Surfaces", icon: "i-game-icons-tennis-court", slot: "surfaces" }] : []),
      ...(data.value.Coaches.length > 0 ? [{ label: "Coaches", icon: "i-ph-magnifying-glass-duotone", slot: "coaches" }] : []),
      ...(data.value.Umpires.length > 0 ? [{ label: "Umpires", icon: "i-game-icons-whistle", slot: "umpires" }] : []),
      ...(data.value.Supervisors.length > 0 ? [{ label: "Supervisors", icon: "i-solar-clipboard-bold-duotone", slot: "supervisors" }] : [])
    ].filter(Boolean)
  }
  return []
})

const openModal = (type: string, id: string, name?: string) => {
  switch (type) {
    case "coaches":
      modal.open(PlayersModal, { type, id, description: "Coach", title: `Players coached by ${name}` })
      break
    case "countries":
      modal.open(PlayersModal, { type, id, description: "Country", title: `Players who have representated ${name}` })
      break
    case "supervisors":
      modal.open(EventsModal, { type, id, description: "Supervisor", title: `Events supervised by ${id}` })
      break
    case "umpires":
      modal.open(UmpiresModal, { type, id, description: "Umpire", title: `Matches umpired by ${id}` })
      break
    case "venues":
      modal.open(EventsModal, { type, id, name, description: "Venue", title: `Events held at ${name}, ${id}` })
      break
    default:
      break
  }
}
</script>

<template>
  <u-page>
    <u-page-header title="Search">
      <template #description>Search for players, tournaments, coaches, umpires, countries, venues, umpires and supervisors</template>
    </u-page-header>
    <u-page-body>
      <u-input
        v-model="searchTerm"
        class="w-full"
        placeholder="Search"
      />
      <u-tabs
        v-if="data"
        :items="tabItems"
      >
        <template #players>
          <u-page-grid>
            <u-page-card
              v-for="player in data.Players"
              :key="player.id"
              :to="`/players/${useChangeCase(player.name, 'kebabCase').value}/${player.id}/overview`"
              :title="player.name"
              :icon="`flag:${COUNTRY_CODES[player.country]}-4x3`"
              orientation="horizontal"
            >
              <u-avatar
                :src="`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`"
                :alt="player.name"
                icon="i-material-symbols-account-circle"
                size="sm"
                class="border border-slate-500"
              />
            </u-page-card>
          </u-page-grid>
        </template>
        <template #tournaments>
          <u-page-grid>
            <u-page-card
              v-for="tournament in data.Tournaments"
              :key="tournament.id"
              :to="`/tournaments/${useChangeCase(tournament.name, 'kebabCase').value}/${tournament.id}`"
              :title="tournament.name"
            />
          </u-page-grid>
        </template>
        <template #coaches>
          <u-page-grid>
            <u-page-card
              v-for="coach in data.Coaches"
              :key="coach.id"
              :title="coach.name ?? coach.id"
              @click="openModal('coaches', coach.id, coach.name ?? coach.id)"
            />
          </u-page-grid>
        </template>
        <template #countries>
          <u-page-grid>
            <u-page-card
              v-for="country in data.Countries"
              :key="country.id"
              :title="country.name"
              :icon="`flag:${COUNTRY_CODES[country.id]}-4x3`"
              @click="openModal('countries', country.id, country.name)"
            />
          </u-page-grid>
        </template>
        <template #surfaces>
          <u-page-grid>
            <u-page-card
              v-for="surface in data.Surfaces"
              :key="surface"
              :title="surface"
              @click="openModal('surfaces', surface)"
            />
          </u-page-grid>
        </template>
        <template #supervisors>
          <u-page-grid>
            <u-page-card
              v-for="supervisor in data.Supervisors"
              :key="supervisor"
              :title="supervisor"
              @click="openModal('supervisors', supervisor)"
            />
          </u-page-grid>
        </template>
        <template #umpires>
          <u-page-grid>
            <u-page-card
              v-for="umpire in data.Umpires"
              :key="umpire"
              :title="umpire"
              @click="openModal('umpires', umpire)"
            />
          </u-page-grid>
        </template>
        <template #venues>
          <u-page-grid>
            <u-page-card
              v-for="venue in data.Venues"
              :key="venue.name"
              @click="openModal('venues', venue.city, venue.name)"
              :title="`${venue.name}, ${venue.city}`"
              :icon="`flag:${COUNTRY_CODES[venue.country]}-4x3`"
            />
          </u-page-grid>
        </template>
      </u-tabs>
      <u-alert
        v-if="status === 'pending' || error"
        variant="subtle"
        :color="status === 'pending' ? 'primary' : 'warning'"
        :icon="status === 'pending' ? 'i-line-md-loading-twotone-loop' : 'i-material-symbols-search-off-rounded'"
        :ui="{ icon: 'size-6', title: 'text-lg', root: 'w-3/4s mx-auto' }"
      >
        <template #title>{{ status === "pending" ? "Search results are currently being fetched" : "No events available" }}</template>
      </u-alert>
    </u-page-body>
  </u-page>
</template>
