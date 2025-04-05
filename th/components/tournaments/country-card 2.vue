<script setup lang="ts">
defineProps<{ event: CountryEventType }>()
const name = useRouteParams<string>("name")
const tid = useRouteParams<string>("tid")
</script>

<template>
  <u-page-card
    :title="event.year"
    reverse
    highlight
    :ui="{ body: 'w-full', description: 'flex flex-col gap-3 items-center w-full' }"
  >
    <template #description>
      <div class="flex items-center gap-2">
        <flag-icon :country="event.c1" />
        <span>{{ event.c1.name }}</span>
      </div>
      <div class="text-sm">d.</div>
      <div class="flex items-center gap-2">
        <flag-icon :country="event.c2" />
        <span>{{ event.c2.name }}</span>
      </div>
      <div class="text-sm">{{ event.score }}</div>
    </template>
    <template #footer>
      <event-buttons
        :name
        :tid
        :year="event.year"
        :eid="event.eid"
        drawType="Country draw"
      />
    </template>
  </u-page-card>
</template>
