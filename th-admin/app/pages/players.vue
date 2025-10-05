<script setup lang="ts">
useHead({ title: "Players - TH Admin" })
const selectedLetter = ref<string>("Update")

const {
  data: players,
  status,
  refresh
} = await useFetch<{ first_name: string; last_name: string; id: string }[]>("/api/get-players", {
  query: { letter: selectedLetter },
  default: () => []
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
            <create-player />
            <u-popover>
              <u-button
                icon="lucide:table-of-contents"
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
            :items="[
              'Update',
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'N',
              'O',
              'P',
              'Q',
              'R',
              'S',
              'T',
              'U',
              'V',
              'W',
              'X',
              'Y',
              'Z'
            ]"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <div v-if="['idle', 'pending'].includes(status)">Loading...</div>

        <u-page-list
          v-else-if="players.length"
          class="*:my-2"
        >
          <u-link
            v-for="player in players"
            :key="player.id"
            :to="{ name: 'edit-player', query: { id: player.id } }"
            :id="player.id"
          >
            {{ player.first_name ? `${player.first_name} ${player.last_name}` : player.id }}
          </u-link>
        </u-page-list>

        <div v-else>
          Error loading players.
          <u-button
            @click="() => refresh()"
            label="Refresh"
            icon="lucide:refresh-ccw"
          />
        </div>
      </template>
    </u-dashboard-panel>
  </div>
</template>
