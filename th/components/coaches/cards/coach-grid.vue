<script setup lang="ts">
defineProps<{
  players: (Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year" | "ch" | "ch_date" | "dob"> & {
    coach_start: string | null
    coach_end: string | null
    gs: Pick<EventInterface, "year" | "id" | "tournament">[]
  })[]
  status: APIStatusType
  name: string
}>()
</script>

<template>
  <u-page-columns v-if="players.length || ['pending', 'idle'].includes(status)">
    <coach-player-card
      v-if="players.length"
      v-for="player in players"
      :key="player.id"
      :player
    />

    <base-loading-card
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-columns>
  <error-message
    v-else
    :message="`No players coached by ${name}`"
  />
</template>
