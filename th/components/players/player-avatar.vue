<script setup lang="ts">
defineProps<{ player: Pick<PlayerInterface, "id" | "name" | "country">; bold?: boolean; strikethrough?: boolean }>()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")
</script>

<template>
  <div class="flex items-center gap-2">
    <base-link
      type="country"
      :country="player.country"
    />
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
          :class="{ 'font-bold': bold, 'line-through': strikethrough }"
          :to="{ name: 'player', params: { id: player.id, name: encodeName(player.name) } }"
        >
          {{ player.name }}
        </u-link>
      </template>
    </u-user>
  </div>
</template>
