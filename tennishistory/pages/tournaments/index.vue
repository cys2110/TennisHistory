<script setup lang="ts">
definePageMeta({ name: "tournaments" }) // Page name for routing
useHead({ title: "Tournaments" }) // Tab title
const toast = useToast()
const selectedLetter = ref<string | null>(null)
const page = ref(1)

// API call
const { data: tournaments, status } = await useFetch<{ count: { low: number; high: number }; tournaments: { id: string; name: string }[] }>("/api/allTournaments", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * 24) },
  onResponseError: () => {
    toast.add({
      title: "Error fetching tournaments",
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
    <u-page-header title="Tournaments" />

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

      <u-page-grid v-if="(tournaments && tournaments.tournaments.length > 0) || status === 'pending'">
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
          v-else-if="tournaments"
          v-for="tournament in tournaments.tournaments"
          :key="tournament.id"
          :title="tournament.name"
          :to="{ name: 'tournament', params: { tid: tournament.id, name: useChangeCase(tournament.name, 'kebabCase').value } }"
          class="tournament-card ring-violet-600 shadow-sm shadow-violet-400 hover:shadow-md hover:shadow-violet-400 text-center"
        />
      </u-page-grid>

      <error-message
        v-else
        :icon="ICONS['no-trophy']"
      >
        No tournaments found
      </error-message>

      <u-container class="flex justify-center">
        <u-pagination
          v-if="tournaments"
          v-model:page="page"
          :total="tournaments.count.low"
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
