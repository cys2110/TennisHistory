<script setup lang="ts">
defineProps<{ player: Pick<PlayerInterface, "id" | "name" | "country"> }>()
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
</script>

<template>
  <ClientOnly>
    <div class="flex items-center gap-2">
      <flag-icon :country="player.country" />
      <u-user
        :name="player.name"
        :avatar="{ src: `https://www.atptour.com/-/media/alias/player-headshot/${player.id}`, icon: ICONS.player }"
        :to="{ name: 'player', params: { id: player.id, name: encodeName(player.name) } }"
        :size="mdAndUp ? 'md' : 'sm'"
      />
    </div>
  </ClientOnly>
</template>
