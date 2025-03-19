<script setup lang="ts">
const { player, index, id } = defineProps<{ player: H2HPlayerType; index: number; id: string }>()

const playerDetails = computed(() => [
  { title: "DOB", value: player.dob ?? "Unknown" },
  { title: "Height", value: player.height ? `${player.height}cm (${convertToFt(Number(player.height))})` : "Unknown" },
  { title: "Plays", value: player.rh ? handedness(player.rh) : "Unknown" },
  { title: "Backhand", value: player.bh ? `${player.bh}-Handed` : "Unknown" },
  { title: "Turned pro", value: player.pro ?? "Unknown" }
])
</script>

<template>
  <u-page-card
    :icon="`flag:${player.country.alpha2}-4x3`"
    :title="player.name"
    highlight
    reverse
    :ui="{ body: 'w-full', root: index === 1 ? 'min-w-66 ring-primary-600 dark:ring-primary-600' : 'min-w-66 ring-emerald-700 dark:ring-emerald-700 shadow-emerald-700 dark:shadow-emerald-500 hover:shadow-emerald-700 dark:hover:shadow-emerald-500' }"
  >
    <nuxt-img
      :src="`https://www.atptour.com/-/media/alias/player-headshot/${id}`"
      :alt="player.name"
      class="rounded-full border-1 border-neutral-500 mx-auto"
      sizes="20px"
    />

    <template #description>
      <div
        v-for="detail in playerDetails"
        :key="detail.title"
        class="flex justify-between items-center"
      >
        <span>{{ detail.title }}</span>
        <span class="font-semibold">{{ detail.value }}</span>
      </div>
    </template>
  </u-page-card>
</template>
