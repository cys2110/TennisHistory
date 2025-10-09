<script setup lang="ts">
useHead({ title: "Events - TH Admin" })
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
    items: events.value.map(event => ({
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
                icon="lucide:table-of-contents"
                size="sm"
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
        <u-page-list class="*:my-2">
          <u-link
            v-if="events.length"
            v-for="event in events"
            :key="event.id"
            :to="{ name: 'event', params: { id: event.id } }"
            :id="`event-${event.id}`"
            class="text-sm hover-link"
          >
            {{ event.name ?? event.id }}
          </u-link>

          <div v-else-if="status === 'pending'">Loading...</div>

          <div
            v-else
            class="flex flex-col gap-1 items-center"
          >
            Error loading events.
            <u-button
              @click="() => reloadNuxtApp()"
              label="Refresh"
              icon="lucide:refresh-ccw"
            />
          </div>
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
