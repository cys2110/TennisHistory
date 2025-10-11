<script setup lang="ts">
useHead({ title: "Tournaments - TH Admin" })
const { data: tournaments, status, refresh } = await useFetch<TournamentInterface[]>("/api/tournaments/get", { default: () => [] })

const toc = computed(() => [
  {
    id: "tournaments",
    label: "Tournaments",
    items: tournaments.value.map(tournament => ({
      label: tournament.name ?? tournament.id.toString(),
      to: `#tournament-${tournament.id}`
    }))
  }
])
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar title="Tournaments">
          <template #right>
            <u-popover>
              <u-button
                icon="lucide:table-of-contents"
                size="sm"
                class="mx-2"
              />
              <template #content>
                <u-command-palette
                  placeholder="Search tournaments"
                  :groups="toc"
                  :loading="status === 'pending'"
                  :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
                />
              </template>
            </u-popover>
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <u-page-grid
          v-if="tournaments.length"
          class="gap-y-2 gap-x-5"
        >
          <tournaments-edit
            v-for="tournament in tournaments"
            :key="tournament.id"
            :tournament
          />
        </u-page-grid>

        <div v-else-if="status === 'pending'">Loading...</div>

        <div
          v-else
          class="flex flex-col items-center gap-1"
        >
          No tournaments found.
          <u-button
            @click="() => reloadNuxtApp()"
            label="Refresh"
            icon="lucide:refresh-ccw"
          />
        </div>
      </template>
    </u-dashboard-panel>
  </div>
</template>
