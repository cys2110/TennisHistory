<script setup lang="ts">
defineProps<{
  players: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year" | "tour" | "last_name">[]
  status: APIStatusType
}>()
const { icons } = useAppConfig()
const { params } = useRoute()
const name = computed(() => decodeName(params.name as string))
</script>

<template>
  <u-page-grid
    v-if="players.length || ['pending', 'idle'].includes(status)"
    class="my-5"
  >
    <player-card
      v-if="players.length"
      v-for="player in players"
      :key="player.id"
      :player
    />
    <loading-player
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.noPlayer"
    :message="`No players who have represented ${name}`"
  />
</template>
