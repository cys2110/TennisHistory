<script setup lang="ts">
const { player } = defineProps<{ player: PlayerDetailsType }>()

const playerDetails = computed(() => [
  { title: "Career High", value: player.ch ? `${player.ch} (${player.ch_date})` : "—" },
  { title: "Win-Loss", value: player.wl },
  { title: "Titles", value: player.titles },
  { title: "Prize Money", value: `$${player.pm}` },
  { title: "Age", value: player.age ? `${player.age} years (${player.dod ? `${player.dob} - ${player.dod}` : player.dob})` : "Unknown" },
  { title: "Height", value: player.height ? `${player.height} cm (${convertToFt(player.height)})` : "Unknown" },
  { title: "Plays", value: player.rh ? handedness(player.rh) : "Unknown" },
  { title: "Backhand", value: player.bh ? `${player.bh}-Handed` : "Unknown" },
  { title: "Hall of Fame Induction", value: player.hof ?? "—" }
])
</script>

<template>
  <dashboard-subpanel title="Details">
    <u-page-grid class="lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <u-page-card
        v-for="detail in playerDetails"
        :key="detail.title"
        :title="detail.title"
        :description="detail.value"
        spotlight
        variant="outline"
      />
      <u-page-card
        :title="player.coaches.length === 1 ? 'Coach' : 'Coaches'"
        spotlight
        variant="outline"
      >
        <template #description>
          <template
            v-if="player.coaches.length > 0"
            v-for="coach in player.coaches"
            :key="coach.id"
          >
            <u-link
              v-if="coach.labels.includes('Player')"
              class="hover-link"
              :to="{ name: 'player', params: { name: useChangeCase(coach.name || '', 'kebabCase').value, id: coach.id } }"
              prefetch-on="interaction"
            >
              {{ coach.name }}
            </u-link>
            <template v-else>{{ coach.id }}</template>
          </template>
          <template v-else>—</template>
        </template>
      </u-page-card>
      <u-page-card
        v-if="player.countries.length > 0"
        class="col-span-2"
        title="Previous Representations"
        spotlight
        variant="outline"
      >
        <template #description>
          <div
            v-for="country in player.countries"
            :key="country.id"
            class="grid grid-cols-3 gap-2"
          >
            <flag-icon :country="country" />
            <span>{{ country.name }}</span>
            <span>{{ country.dates }}</span>
          </div>
        </template>
      </u-page-card>
    </u-page-grid>
  </dashboard-subpanel>
</template>
