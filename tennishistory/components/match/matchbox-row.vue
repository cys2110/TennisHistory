<script setup lang="ts">
defineProps<{ player: MatchPlayerType; winner: string }>()
</script>

<template>
  <div class="grid grid-cols-7 items-center gap-2 my-2">
    <flag-icon :country="player.country" />
    <player-component
      class="col-span-2"
      :id="player.id"
      :name="player.name"
    />
    <span class="text-center">
      <small v-if="player.seed || player.status">({{ player.seed }}{{ player.status }})</small>
    </span>
    <small>{{ player.rank }}</small>
    <div>
      <u-icon
        v-if="winner === player.id"
        :name="ICONS.check"
        class="text-emerald-600"
      />
      <u-badge
        v-else-if="player.incomplete"
        class="bg-red-800"
        :label="player.incomplete"
      />
    </div>
    <div class="text-right text-sm">
      <template
        v-for="(_, index) in new Array(5)"
        :key="index"
      >
        <span v-if="(player as any)[`s${index + 1}`]">
          {{ (player as any)[`s${index + 1}`] }}
          <sup v-if="(player as any)[`t${index + 1}`]">
            {{ (player as any)[`t${index + 1}`] }}
          </sup>
        </span>
      </template>
    </div>
  </div>
</template>
