<script setup lang="ts">
import type { CountriesEnum } from "~/types/enums"
definePageMeta({ name: "players" }) // Page name for routing
useHead({ title: "Players" }) // Tab title
const toast = useToast()
const selectedLetter = ref<string | null>(null)
const page = ref(1)

// API call
const { data: players, status } = await useFetch<{ count: { low: number; high: number }; players: { id: string; name: string; country: CountriesEnum; country_name: string }[] }>("/api/allPlayers", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * 24) },
  onResponseError: () => {
    toast.add({
      title: "Error fetching players",
      icon: ICONS.error
    })
  }
})

// Function to select letter
const selectLetter = (letter: string) => {
  page.value = 1
  selectedLetter.value = selectedLetter.value === letter ? null : letter
}
</script>

<template>
  <u-page>
    <u-page-header title="Players" />

    <u-page-body>
      <u-container class="flex justify-center">
        <u-button-group>
          <u-button
            v-for="letter in LETTERS"
            :key="letter"
            variant="link"
            class="cursor-pointer font-bold"
            :class="{ 'text-emerald-600': selectedLetter === letter }"
            color="neutral"
            @click="selectLetter(letter)"
          >
            {{ letter }}
          </u-button>
        </u-button-group>
      </u-container>

      <u-page-grid v-if="(players && players.players.length > 0) || status === 'pending'">
        <!--Loading cards-->
        <u-page-card
          v-if="status === 'pending'"
          v-for="i in new Array(4)"
          :key="i"
          class="ring-violet-600 shadow-sm shadow-violet-400 hover:shadow-md hover:shadow-violet-400 text-center"
        >
          <template #title>
            <u-skeleton class="h-6 w-3/4 bg-slate-700 mx-auto" />
          </template>
        </u-page-card>

        <!--Cards linking to tournament page-->
        <u-page-card
          v-else-if="players"
          v-for="player in players.players"
          :key="player.id"
          :to="{ name: 'player', params: { id: player.id, name: useChangeCase(player.name, 'kebabCase').value } }"
          highlight
          :ui="{ title: 'flex gap-2 items-center justify-center' }"
        >
          <template #title>
            <flag-icon :country="player.country" />
            <u-user
              :name="player.name"
              :avatar="{ src: `https://www.atptour.com/-/media/alias/player-headshot/${player.id}`, icon: ICONS.person }"
            />
          </template>
        </u-page-card>
      </u-page-grid>

      <error-message
        v-else
        :icon="ICONS['no-people']"
      >
        No players found
      </error-message>

      <u-container class="flex justify-center">
        <u-pagination
          v-if="players"
          v-model:page="page"
          :total="players.count.low"
          :items-per-page="24"
          color="secondary"
          variant="subtle"
          active-color="secondary"
          active-variant="solid"
          size="sm"
        />
      </u-container>
    </u-page-body>
  </u-page>
</template>
