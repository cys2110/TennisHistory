<script setup lang="ts">
defineProps<{ event: TournamentEventType }>()
const name = useRouteParams<string>("name")
const tid = useRouteParams<string>("id")
</script>

<template>
  <u-page-card
    :title="event.year"
    reverse
    highlight
    :ui="{ body: 'w-full' }"
  >
    <template #description>
      <div
        v-if="event.winner && event.loser"
        class="flex flex-col gap-3 items-center w-full"
      >
        <player-avatar :player="event.winner" />
        <div class="text-sm">d.</div>
        <player-avatar :player="event.loser" />
        <score-item
          :sets="event.sets"
          :tbs="event.tbs"
          :name
          :tid
          :year="event.year"
          :eid="event.eid"
          mid="1"
          class="text-sm"
        />
      </div>
      <div
        v-else
        class="text-center"
      >
        No final played
      </div>
    </template>

    <template #footer>
      <event-buttons
        :name
        :tid
        :year="event.year"
        :eid="event.eid"
        :drawType="event.draw_type"
      />
    </template>
  </u-page-card>
</template>
