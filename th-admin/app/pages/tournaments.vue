<script setup lang="ts">
useHead({ title: "Tournaments - TH Admin" })
const {
  ui: { icons }
} = useAppConfig()
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
            <tournaments-create />
            <u-popover>
              <u-button
                :icon="icons.menu"
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

        <loading v-else-if="status === 'pending'" />
        <reload
          v-else
          message="tournaments"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
