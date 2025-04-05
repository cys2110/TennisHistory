<script setup lang="ts">
defineProps<{ player: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year"> }>()
const currentYear = new Date().getFullYear()
</script>

<template>
  <div>
    <u-page-card
      :key="player.id"
      :title="player.name"
      :to="{ name: 'player', params: { name: encodeName(player.name), id: player.id } }"
      :icon="`flag:${player.country.alpha2}-4x3`"
      highlight
      :ui="{ body: 'max-h-70', container: 'lg:flex items-center text-center' }"
      orientation="vertical"
      reverse
    >
      <template #description>
        {{
          player.min_year && player.min_year === player.max_year
            ? player.min_year
            : player.min_year && player.max_year === currentYear
            ? `${player.min_year} - present`
            : player.min_year
            ? `${player.min_year} - ${player.max_year}`
            : "—"
        }}
      </template>
      <nuxt-img
        :src="`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`"
        :alt="player.name"
        class="rounded-full border border-neutral-500 max-h-40"
      />
    </u-page-card>
  </div>
</template>
