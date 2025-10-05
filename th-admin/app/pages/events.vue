<script setup lang="ts">
useHead({ title: "Events - TH Admin" })
const year = ref(new Date().getFullYear())

const { data: events, status } = await useFetch<{ name: string; id: number }[]>("/api/get-events", { query: { year }, default: () => [] })

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
            <create-event />
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
        <div v-if="['idle', 'loading'].includes(status)">Loading...</div>

        <div v-else-if="status === 'error'">
          Error loading events.
          <u-button
            @click="() => reloadNuxtApp()"
            label="Refresh"
            icon="lucide:refresh-ccw"
          />
        </div>

        <u-page-list
          v-else
          class="*:my-2"
        >
          <u-link
            v-for="event in events"
            :key="event.id"
            :to="{ name: 'edit-event', query: { id: event.id } }"
            :id="`event-${event.id}`"
          >
            {{ event.name ?? event.id }}
          </u-link>
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
