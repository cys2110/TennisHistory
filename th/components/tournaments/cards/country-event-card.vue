<script setup lang="ts">
defineProps<{ event: CountryEventType }>()
const route = useRoute()
</script>

<template>
  <u-page-card
    :title="event.year"
    reverse
    highlight
    :ui="{ body: 'w-full', description: 'flex flex-col gap-3 items-center w-full' }"
  >
    <template #description>
      <u-link
        class="flex items-center gap-2"
        :to="{ name: 'country', params: { id: event.c1.id } }"
      >
        <u-icon :name="`flag:${event.c1.alpha2}-4x3`" />
        <span class="hover-link w-fit">{{ event.c1.name }}</span>
      </u-link>
      <div class="text-sm">d.</div>
      <u-link
        class="flex items-center gap-2"
        :to="{ name: 'country', params: { id: event.c2.id } }"
      >
        <u-icon :name="`flag:${event.c2.alpha2}-4x3`" />
        <span class="hover-link w-fit">{{ event.c2.name }}</span>
      </u-link>
      <div class="text-sm">{{ event.score }}</div>
    </template>
    <template #footer>
      <event-buttons
        :tournament="{ id: route.params.id as string, name: route.params.name as string }"
        :year="event.year"
        :id="event.id"
        draw_type="Country draw"
      />
    </template>
  </u-page-card>
</template>
