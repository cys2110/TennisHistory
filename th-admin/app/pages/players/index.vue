<script setup lang="ts">
useHead({ title: "Players - TH Admin" })
const {
  ui: { icons }
} = useAppConfig()
const selectedLetter = ref<string>("Update")

const {
  data: players,
  status,
  refresh
} = await useFetch<{ first_name: string; last_name: string; id: string }[]>("/api/players/get-players", {
  query: { letter: selectedLetter },
  default: () => []
})

watch(selectedLetter, () => {
  refresh()
})

const toc = computed(() => [
  {
    id: "players",
    label: "Players",
    items: players.value.map(player => ({
      label: player.first_name ? `${player.first_name} ${player.last_name}` : player.id,
      to: `#${player.id}`
    }))
  }
])
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar title="Players">
          <template #right>
            <players-create />
            <u-popover>
              <u-button
                :icon="icons.menu"
                size="sm"
                class="mx-2"
              />
              <template #content>
                <u-command-palette
                  placeholder="Search players"
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
            v-model="selectedLetter"
            :items="['Update', ...letters]"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-grid
          v-if="players?.length"
          class="gap-x-5 gap-y-2 2xl:grid-cols-6"
        >
          <u-link
            v-for="player in players"
            :key="player.id"
            :to="{ name: 'player', params: { id: player.id } }"
            :id="player.id"
            class="text-sm hover-link"
          >
            {{ player.first_name ? `${player.first_name} ${player.last_name}` : player.id }}
          </u-link>
        </u-page-grid>

        <loading v-else-if="status === 'pending'" />
        <reload
          v-else
          message="players"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
