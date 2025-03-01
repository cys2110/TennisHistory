<script setup lang="ts">
defineProps<{ event: Pick<Event, "year" | "winner" | "loser" | "sets" | "tbs" | "eid" | "incomplete"> }>()
const name = useRouteParams<string>("name")
const tid = useRouteParams<string>("tid")
</script>

<template>
  <u-page-card
    :id="`year-${event.year}`"
    :ui="{ header: 'font-bold', body: 'w-full' }"
    :title="event.year"
    reverse
    highlight
  >
    <template #description>
      <div
        class="flex flex-col text-sm gap-3 items-center w-full"
        v-if="event.winner && event.loser"
      >
        <player-avatar :player="event.winner" />
        <div class="flex gap-2 justify-center">
          <score-item
            :sets="event.sets"
            :tbs="event.tbs"
            :name
            :tid
            :eid="event.eid"
            :year="event.year"
            match_no="1"
          />
          <u-badge
            v-if="event.incomplete"
            :label="INCOMPLETES[event.incomplete]"
            color="error"
            size="sm"
          />
        </div>
        <player-avatar :player="event.loser" />
      </div>
      <div v-else>No final played</div>
    </template>

    <template #footer>
      <event-buttons
        :name
        :tid
        :year="event.year"
        :eid="event.eid"
      />
    </template>
  </u-page-card>
</template>
