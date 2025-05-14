<script setup lang="ts">
defineProps<{ events: { title: string; events: EventCardType[] }[]; status: APIStatusType; checked: boolean }>()
const route = useRoute()

const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const lgAndUp = breakpoints.greaterOrEqual("lg")
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <u-stepper
    v-if="events.length"
    :items="events"
    :linear="false"
    :size="mdAndUp ? 'sm' : 'xs'"
    :orientation="lgAndUp ? 'horizontal' : 'vertical'"
    :ui="{ header: 'mr-10', separator: 'min-h-4 lg:min-h-1', item: 'my-1.5' }"
  >
    <template #indicator="{ item }">{{ item.events.length }}</template>
    <template #content="{ item }">
      <u-page-grid>
        <event-card
          v-for="event in item.events"
          :key="event.id"
          :event
        />
      </u-page-grid>
    </template>
  </u-stepper>
  <u-page-grid
    v-else-if="['pending', 'idle'].includes(status)"
    class="2xl:grid-cols-5 mt-5 ml-5 md:ml-0"
  >
    <event-loading-card
      v-for="_ in 5"
      :key="_"
    />
  </u-page-grid>

  <error-message
    v-else
    :icon="ICONS.noTournament"
    :message="checked ? `${name} has not played any finals` : `${name} has not won any titles`"
  />
</template>
