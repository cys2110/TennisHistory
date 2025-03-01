<script setup lang="ts">
const { player } = defineProps<{ player: Omit<PlayerType, "id" | "name" | "wl_pc" | "pro"> }>()

const playerDetails = computed(() => [
  { title: "Career High", value: player.ch ?? "—", description: player.ch_date },
  { title: "Win-Loss", value: player.wl },
  { title: "Titles", value: player.titles },
  { title: "Prize Money", value: `$${player.pm}` },
  { title: "Age", value: player.age ? `${player.age} years` : "Unknown", description: player.dod ? `${player.dob} - ${player.dod}` : (player.dob ?? "") },
  { title: "Height", value: player.height ? `${player.height} cm (${convertToFt(Number(player.height))})` : "Unknown" },
  { title: "Plays", value: handedness(player.rh) },
  { title: "Backhand", value: player.bh ? `${player.bh}-Handed` : "Unknown" },
  { title: "Hall of Fame Induction", value: player.hof ?? "—" }
])
</script>

<template>
  <u-page-grid>
    <u-page-card
      v-for="detail in playerDetails"
      :key="detail.title"
      :title="detail.title"
      :description="detail.value"
      highlight
      variant="subtle"
    >
      <template
        #footer
        v-if="detail.description"
        >{{ detail.description }}</template
      >
    </u-page-card>

    <u-page-card
      :title="player.coaches.length === 1 ? 'Coach' : 'Coaches'"
      highlight
      variant="subtle"
    >
      <template #description>
        <div
          v-if="player.coaches.length > 0"
          v-for="coach in player.coaches"
          :key="coach.id"
        >
          <nuxt-link
            v-if="coach.name"
            class="hover-link"
            :to="{ name: 'player', params: { name: useChangeCase(coach.name, 'kebabCase').value, id: coach.id } }"
            prefetch-on="interaction"
          >
            {{ coach.name }}
          </nuxt-link>
          <template v-else>{{ coach.id }}</template>
        </div>
        <template v-else>—</template>
      </template>
    </u-page-card>

    <u-page-card
      class="col-span-2"
      title="Previous Representations"
      highlight
      variant="subtle"
    >
      <template #description>
        <div
          v-if="player.countries.length > 0"
          v-for="country in player.countries"
          :key="country.id"
        >
          <flag-icon :country="country" />
          <span>{{ country.name }}</span>
          <span>{{ country.dates }}</span>
        </div>
        <template v-else>—</template>
      </template>
    </u-page-card>
  </u-page-grid>
</template>
