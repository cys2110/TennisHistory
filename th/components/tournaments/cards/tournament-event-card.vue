<script setup lang="ts">
defineProps<{
  event: Pick<EventInterface, "id" | "year" | "draw_type" | "winner" | "loser"> & {
    match: Pick<MatchInterface, "sets" | "tbs" | "incomplete">
  }
}>()
const route = useRoute()
</script>

<template>
  <div>
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
            :sets="event.match.sets"
            :tbs="event.match.tbs"
            :tournament="{ name: route.params.name as string, id: route.params.id as string }"
            :year="event.year"
            :id="event.id"
            match_no="1"
            :incomplete="event.match.incomplete"
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
          :tournament="{ name: route.params.name as string, id: route.params.id as string }"
          :year="event.year"
          :id="event.id"
          :draw_type="event.draw_type"
        />
      </template>
    </u-page-card>
  </div>
</template>
