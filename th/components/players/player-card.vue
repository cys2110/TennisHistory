<script setup lang="ts">
defineProps<{ player: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year"> & { current?: boolean } }>()
const currentYear = new Date().getFullYear()
</script>

<template>
  <div>
    <u-page-card
      :key="player.id"
      :title="player.name"
      :to="{ name: 'player', params: { name: encodeName(player.name), id: player.id } }"
      highlight
      orientation="horizontal"
      reverse
      :ui="{ leading: 'flex justify-between items-center' }"
    >
      <template #leading>
        <u-icon :name="`flag:${player.country.alpha2}-4x3`" />
        <u-badge
          v-if="player.current"
          variant="soft"
        >
          {{ player.current ? "Current" : "Former" }}
        </u-badge>
      </template>
      <template #description>
        {{ player.min_year && player.min_year === player.max_year ? player.min_year : player.min_year && player.max_year === currentYear ? `${player.min_year} - present` : player.min_year ? `${player.min_year} - ${player.max_year}` : "—" }}
      </template>
      <nuxt-img
        :src="`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`"
        :alt="player.name"
        class="rounded-full border border-neutral-600 dark:border-neutral-400 max-h-40 mx-auto"
      />
    </u-page-card>
  </div>
</template>
