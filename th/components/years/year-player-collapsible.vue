<script setup lang="ts">
defineProps<{ label: string; players: Pick<PlayerInterface, "id" | "name" | "country">[]; year: string }>()
</script>

<template>
  <u-collapsible>
    <u-button
      class="group my-2"
      :label="`Players ${label}`"
      color="neutral"
      :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
      block
      :trailing-icon="ICONS.chevronDown"
    />
    <template #content>
      <div class="flex flex-col gap-2 max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent scrollbar-thumb-rounded-full">
        <player-avatar
          v-if="players.length > 0"
          v-for="player in players"
          :key="player.id"
          :player
        />
        <span
          v-else
          class="text-sm text-center"
        >
          No players {{ label }} in {{ year }}
        </span>
      </div>
    </template>
  </u-collapsible>
</template>
