<script setup lang="ts">
const { player, active } = defineProps<{ player: PlayerDetailsType; active: boolean }>()
const currentYear = new Date().getFullYear()

const playerDetails = [
  { title: "Career High", value: player.ch ?? "—", description: player.ch_date ?? undefined },
  { title: "Win-Loss", value: `${player.wins}—${player.losses}` },
  { title: "Titles", value: player.titles },
  { title: "Prize Money", value: `$${player.pm}` },
  {
    title: "Age",
    value: player.age ? `${player.age} years` : "Unknown",
    description: player.dod ? `${player.dob} - ${player.dod}` : player.dob ?? undefined
  },
  player.turned_pro || player.retired
    ? {
        title:
          player.turned_pro && (player.retired || active)
            ? "Career span"
            : player.turned_pro
            ? "Turned pro"
            : "Retired",
        value:
          player.turned_pro && player.retired
            ? `${player.turned_pro} - ${player.retired}`
            : player.turned_pro && active
            ? `${player.turned_pro} - present`
            : player.turned_pro || player.retired,
        description:
          active && player.turned_pro
            ? `${currentYear - player.turned_pro} years`
            : player.turned_pro && player.retired
            ? `${player.retired - player.turned_pro} years`
            : undefined
      }
    : null,
  {
    title: "Height",
    value: player.height ? `${player.height} cm (${convertToFt(player.height)})` : "Unknown"
  },
  { title: "Plays", value: player.rh ? handedness(player.rh) : "Unknown" },
  { title: "Backhand", value: player.bh ? `${player.bh}-Handed` : "Unknown" },
  player.hof ? { title: "Hall of Fame Induction", value: player.hof } : null
].filter(Boolean)
</script>

<template>
  <u-page-columns class="lg:columns-2 xl:columns-3 2xl:columns-3">
    <!--@vue-expect-error-->
    <details-card
      v-for="detail in playerDetails"
      :key="detail?.title"
      :detail
    />
    <u-page-card
      :title="player.coaches.length === 1 ? 'Coach' : 'Coaches'"
      highlight
    >
      <template #description>
        <base-link
          v-if="player.coaches.length"
          v-for="coach in player.coaches"
          :key="coach.id"
          :id="coach.id"
          type="coach"
        >
          {{ coach.name ?? coach.id }}
        </base-link>
        <template v-else>—</template>
      </template>
    </u-page-card>
  </u-page-columns>
  <u-page-card
    v-if="player.countries.length"
    class="mt-10"
    title="Previous Representations"
    highlight
  >
    <template #description>
      <div
        v-for="country in player.countries"
        :key="country.id"
        class="grid grid-cols-9 items-center my-2"
      >
        <country-link :country />
        <u-link
          class="hover-link w-fit col-span-4"
          :to="{ name: 'country', params: { id: country.id } }"
        >
          {{ country.name }}
        </u-link>
        <span class="col-span-4">{{ country.dates }}</span>
      </div>
    </template>
  </u-page-card>
</template>
