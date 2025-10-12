<script setup>
useHead({ title: "Players - TH Admin" })
const {
  ui: { icons }
} = useAppConfig()
const selectedLetter = ref("Update")

const {
  data: players,
  status,
  refresh
} = await useFetch("/api/players/get-players", {
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

const handleClick = async id => {
  await navigateTo({
    name: "player",
    params: { id }
  })
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar title="Players">
          <template #leading>
            <u-dashboard-sidebar-collapse variant="link" />
          </template>
          <template #right>
            <players-create />
            <u-popover>
              <u-button
                :icon="icons.menu"
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
          class="gap-y-2 gap-x-5 2xl:grid-cols-4"
        >
          <u-button
            v-for="player in players"
            :key="player.id"
            :id="player.id"
            :label="player.first_name ? `${player.first_name} ${player.last_name}` : player.id"
            @click="handleClick(player.id)"
            :color="player.labels.includes('Update') ? 'warning' : 'primary'"
            block
          />
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
