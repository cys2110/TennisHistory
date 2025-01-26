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
        class="text-emerald-700 dark:text-emerald-600 text-2xl"
      />
      <u-badge
        v-else-if="player.incomplete"
        class="bg-red-600 dark:bg-red-700 dark:text-slate-300"
        :label="`${player.incomplete}.`"
        size="sm"
      />
    </div>
    <div class="text-sm flex gap-1 justify-end">
      <template
        v-for="(_, index) in new Array(5)"
        :key="index"
      >
        <!--prettier-ignore-->
        <span v-if="(player as any)[`s${index + 1}`]">
          {{ (player as any)[`s${index + 1}`] }}<sup v-if="(player as any)[`t${index + 1}`]">{{ (player as any)[`t${index + 1}`] }}</sup>
        </span>
      </template>
    </div>
  </div>
</template>
