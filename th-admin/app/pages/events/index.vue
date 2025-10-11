<script setup lang="ts">
useHead({ title: "Events - TH Admin" })
const {
  ui: { icons }
} = useAppConfig()
const year = ref(new Date().getFullYear())

const {
  data: events,
  status,
  refresh
} = await useFetch<{ name: string; id: number }[]>("/api/events/get-events", { query: { year }, default: () => [] })

watch(year, () => {
  refresh()
})

const toc = computed(() => [
  {
    id: "events",
    label: "Events",
    items: get(events).map(event => ({
      label: event.name ?? event.id.toString(),
      to: `#event-${event.id}`
    }))
  }
])
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar title="Events">
          <template #right>
            <events-create />
            <u-popover>
              <u-button
                :icon="icons.menu"
                class="mx-2"
              />
              <template #content>
                <u-command-palette
                  placeholder="Search events"
                  :groups="toc"
                  :loading="status === 'pending'"
                  :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
                />
              </template>
            </u-popover>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <u-select-menu
            v-model="year"
            :items="ALL_YEARS"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-grid
          v-if="events.length"
          class="gap-y-2 gap-x-5 2xl:grid-cols-4"
        >
          <u-link
            v-for="event in events"
            :key="event.id"
            :to="{ name: 'event', params: { id: event.id } }"
            :id="`event-${event.id}`"
            class="text-sm hover-link"
          >
            {{ event.name ? `${event.name} - ${event.id}` : event.id }}
          </u-link>
        </u-page-grid>

        <loading v-else-if="status === 'pending'" />
        <reload
          v-else
          message="events"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
