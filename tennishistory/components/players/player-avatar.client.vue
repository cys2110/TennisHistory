<script setup lang="ts">
defineProps<{ player: Pick<PlayerInterface, "id" | "name" | "country">; bold?: boolean }>()
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
</script>

<template>
  <div class="flex items-center gap-2">
    <country-link :country="player.country" />
    <u-user
      :avatar="{
        src: `https://www.atptour.com/-/media/alias/player-headshot/${player.id}`,
        icon: ICONS.player
      }"
      :to="{ name: 'player', params: { id: player.id, name: encodeName(player.name) } }"
      :size="mdAndUp ? 'md' : 'sm'"
    >
      <template #name>
        <u-link
          class="hover-link w-fit"
          :class="{ 'font-bold': bold }"
          :to="{ name: 'player', params: { id: player.id, name: encodeName(player.name) } }"
        >
          {{ player.name }}
        </u-link>
      </template>
    </u-user>
  </div>
</template>
