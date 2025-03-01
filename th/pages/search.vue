<script setup lang="ts">
import { EventsModal, PlayersModal, UmpiresModal } from "#components"
definePageMeta({ name: "search" })
useHead({ title: "Search" })
const searchTerm = ref("")
const modal = useModal()

// API call
const { data, status } = await useFetch<SearchResultsType>("/api/searchResults", { query: { searchTerm }, immediate: false })

const tabItems = computed(() => {
  if (data.value) {
    const searchResults = []
    for (const [key, value] of Object.entries(sEARCHRESULTS)) {
      if ((data.value as any)[key]) {
        searchResults.push({
          value: (data.value as any)[key],
          ...value
        })
      }
    }
    return searchResults
  }
  return []
})

const openUmpiresModal = (umpire: string) => {
  modal.open(UmpiresModal, { id: umpire })
}

const openEventsModal = (type: string, id: string, name?: string) => {
  const title =
    type === "Venue" ? `Events held at ${name}, ${id}`
    : type === "Surface" ? `Events played on ${id}`
    : `Events supervised by ${id}`
  modal.open(EventsModal, { type, id, name, title })
}

const openPlayersModal = (type: string, id: string, name?: string) => {
  const title = type === "Country" ? `Players who have represented ${name}` : `Players coached by ${name}`
  modal.open(PlayersModal, { type, id, title })
}
</script>

<template>
  <u-page>
    <!--TODO: Loading state-->
    <u-page-header
      title="Search"
      description="Search for players, tournaments, coaches, umpires, countries, venues, umpires and supervisors"
    />

    <u-page-body>
      <u-input
        v-model="searchTerm"
        class="w-full"
        placeholder="Search"
      />

      <u-alert
        v-if="status === 'pending' || status === 'error'"
        variant="subtle"
        :color="status === 'pending' ? 'info' : 'error'"
        :icon="status === 'pending' ? ICONS.loading : ICONS['no-info']"
        :title="status === 'pending' ? 'Loading search results' : 'Error fetching search results'"
      />
      <u-tabs
        v-else-if="data"
        :items="tabItems"
      >
        <template #players="{ item }">
          <u-page-grid>
            <u-page-card
              v-for="player in item.value"
              :key="player.id"
              :title="player.name"
              :icon="`flag:${player.country.alpha2}-4x3`"
              highlight
              orientation="horizontal"
              :to="`/players/${useChangeCase(player.name, 'kebabCase').value}/${player.id}/overview`"
            >
              <nuxt-img
                :src="`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`"
                :alt="player.name"
                class="border border-slate-500 rounded-full"
              />
            </u-page-card>
          </u-page-grid>
        </template>

        <template #tournaments="{ item }">
          <u-page-grid>
            <u-page-card
              v-for="tournament in item.value"
              :key="tournament.id"
              :to="`/tournaments/${useChangeCase(tournament.name, 'kebabCase').value}/${tournament.id}`"
              :title="tournament.name"
              highlight
            />
          </u-page-grid>
        </template>

        <template #umpires="{ item }">
          <u-page-grid>
            <u-page-card
              v-for="umpire in item.value"
              :key="umpire"
              :title="umpire"
              highlight
              @click="openUmpiresModal(umpire)"
            />
          </u-page-grid>
        </template>

        <template #supervisors="{ item }">
          <u-page-grid>
            <u-page-card
              v-for="supervisor in item.value"
              :key="supervisor"
              :title="supervisor"
              highlight
              @click="openEventsModal('Supervisor', supervisor)"
            />
          </u-page-grid>
        </template>

        <template #surfaces="{ item }">
          <u-page-grid>
            <u-page-card
              v-for="surface in item.value"
              :key="surface"
              :title="surface"
              highlight
              @click="openEventsModal('Surface', surface)"
            />
          </u-page-grid>
        </template>

        <template #venues="{ item }">
          <u-page-grid>
            <u-page-card
              v-for="venue in item.value"
              :key="venue.city"
              :title="venue.name"
              highlight
              @click="openEventsModal('Venue', venue.city, venue.name)"
              :icon="`flag${venue.country.alpha2}-4x3`"
            />
          </u-page-grid>
        </template>

        <template #countries="{ item }">
          <u-page-grid>
            <u-page-card
              v-for="country in item.value"
              :key="country.id"
              :title="country.name"
              :icon="`flag:${country.alpha2}-4x3`"
              @click="openPlayersModal('Country', country.id, country.name)"
            />
          </u-page-grid>
        </template>

        <template #coaches="{ item }">
          <u-page-grid>
            <u-page-card
              v-for="coach in item.value"
              :key="coach.id"
              :title="coach.name ?? coach.id"
              @click="openPlayersModal('Coach', coach.id, coach.name ?? coach.id)"
            />
          </u-page-grid>
        </template>
      </u-tabs>
    </u-page-body>
  </u-page>
</template>
