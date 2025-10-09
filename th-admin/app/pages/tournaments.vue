<script setup lang="ts">
useHead({ title: "Tournaments - TH Admin" })
const { data: tournaments, status } = await useFetch<TournamentInterface[]>("/api/tournaments/get", { default: () => [] })

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
            <tournaments-create />
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
        <u-page-list class="*:my-1">
          <tournaments-edit
            v-if="tournaments.length"
            v-for="tournament in tournaments"
            :key="tournament.id"
            :tournament
          />

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
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
