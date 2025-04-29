<script setup lang="ts">
defineProps<{ player: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year"> & { current?: boolean } }>()
const currentYear = new Date().getFullYear()
</script>

<template>
  <u-page-card
    :key="player.id"
    :title="player.name"
    :to="{ name: 'player', params: { name: encodeName(player.name), id: player.id } }"
    highlight
    orientation="horizontal"
    reverse
    :ui="{ leading: 'flex justify-between items-center', container: 'flex-row lg:flex lg:flex-row', wrapper: 'flex-1 order-last' }"
  >
    <template #leading>
      <u-icon :name="player.country.alpha2 ? `flag:${player.country.alpha2}-4x3` : `flags:${player.country.id}`" />
      <u-badge
        v-if="player.current === true || player.current === false"
        variant="soft"
      >
        {{ player.current ? "Current" : "Former" }}
      </u-badge>
    </template>
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
    <u-avatar
      :src="`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`"
      :alt="player.name"
      :icon="ICONS.player"
      size="3xl"
    />
  </u-page-card>
</template>
