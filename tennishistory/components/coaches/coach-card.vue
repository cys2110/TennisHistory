<script setup lang="ts">
defineProps<{ coach: Pick<CoachType, "id" | "name" | "country"> & { labels: string[] } }>()
</script>

<template>
  <u-page-card
    :title="coach.name ?? coach.id"
    :to="{ name: 'coach', params: { id: encodeName(coach.id) } }"
    :icon="
      coach.country?.alpha2
        ? `flag:${coach.country?.alpha2}-4x3`
        : coach.country
        ? `flags:${coach.country?.id}`
        : undefined
    "
    highlight
    :ui="{ container: 'flex-row lg:flex lg:flex-row', wrapper: 'flex-1 order-last' }"
    orientation="horizontal"
    reverse
  >
    <u-avatar
      v-if="coach.labels.includes('Player')"
      :src="`https://www.atptour.com/-/media/alias/player-headshot/${coach.id}`"
      :alt="coach.name ?? ''"
      :icon="ICONS.player"
      size="3xl"
    />
    <u-avatar
      v-else
      :icon="ICONS.coach"
      size="3xl"
    />
  </u-page-card>
</template>
