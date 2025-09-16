<script setup lang="ts">
definePageMeta({ name: "coach" })
const {
  params: { id }
} = useRoute("coach")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

interface APIResponse extends PlayerInterface {
  start_date?: DateType
  end_date?: DateType
  gs: EventInterface[]
}

// API call
const { data: coach } = await useFetch<PersonInterface>("/api/coaches/overview", {
  key: `coach-overview-${id}`,
  query: { id },
  server: false
})

const { data: players, status } = await useFetch<APIResponse[]>("/api/coaches/details", {
  query: { id },
  default: () => [],
  server: false
})

useHead({
  title: () => `${coach.value ? `${coach.value.first_name} ${coach.value.last_name}` : capitalCase(id as string)} | Coaches`
})

// TOC
const toc = computed(() => [
  {
    id: "players",
    items: get(players).map(player => ({
      label: `${player.first_name} ${player.last_name}`,
      to: `#player-${player.id}`
    }))
  }
])
</script>

<template>
  <u-container :class="{ 'max-w-(--container-7xl)': !coach || !coach.labels.includes('Player') }">
    <u-page>
      <template
        #left
        v-if="coach && coach.labels.includes('Player')"
      >
        <u-page-aside>
          <u-link :to="{ name: 'player', params: { id, name: kebabCase(`${coach.first_name}-${coach.last_name}`) } }">
            <u-icon :name="icons.player" />
            {{ coach.first_name }} {{ coach.last_name }}
          </u-link>
        </u-page-aside>
      </template>

      <template #right>
        <u-page-aside>
          <u-command-palette
            v-if="players.length"
            placeholder="Search players"
            :groups="toc"
            :loading="status === 'pending'"
            :fuse="{ resultLimit: 1000 }"
            :ui="{ content: 'max-h-200' }"
          />
        </u-page-aside>
      </template>

      <u-page-header
        headline="Coaches"
        :title="coach ? `${coach.first_name} ${coach.last_name}` : capitalCase(id as string)"
        :description="`Players coached by ${coach ? `${coach.first_name} ${coach.last_name}` : capitalCase(id as string)}`"
      >
        <template
          #links
          v-if="mdAndDown"
        >
          <u-button
            v-if="coach && coach.labels.includes('Player')"
            :to="{ name: 'player', params: { id, name: kebabCase(`${coach.first_name}-${coach.last_name}`) } }"
            :icon="icons.player"
          />
          <u-popover>
            <u-button :icon="icons.toc" />
            <template #content>
              <u-command-palette
                v-if="players.length"
                placeholder="Search players"
                :groups="toc"
                :loading="status === 'pending'"
                :fuse="{ resultLimit: 200 }"
                :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
              />
            </template>
          </u-popover>
        </template>
      </u-page-header>

      <u-page-body>
        <u-page-columns
          v-if="players.length || ['idle', 'pending'].includes(status)"
          class="scroll-smooth overflow-y-auto p-5"
        >
          <div
            v-if="players.length"
            v-for="player in players"
            :key="player.id"
            :id="`player-${player.id}`"
          >
            <u-page-card
              highlight
              :highlight-color="getTourColour(player.tour)"
              :ui="{ leading: 'flex items-center gap-2', title: 'text-xl' }"
            >
              <template #leading>
                <coloured-badge :label="player.tour" />
                <u-icon
                  :name="getFlagCode(player.country)"
                  class="text-2xl"
                />
              </template>

              <template #title>
                <u-link
                  :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name}-${player.last_name}`) } }"
                  class="hover-link default-link w-fit"
                >
                  {{ player.first_name }} {{ player.last_name }}
                </u-link>
              </template>

              <template #description>
                <div v-if="player.start_date || player.end_date">
                  {{
                    player.start_date && player.end_date ?
                      player.start_date.year === player.end_date.year ?
                        player.start_date.year
                      : `${player.start_date.year} - ${player.end_date.year}`
                    : `${player.start_date?.year} - present`
                  }}
                </div>

                <div
                  v-if="player.gs.length"
                  class="flex flex-col gap-1"
                >
                  <div class="font-semibold">Grand Slam Titles</div>
                  <u-link
                    v-for="event in player.gs"
                    :key="event.id"
                    :to="{
                      name: 'event',
                      params: { id: event.tournament.id, name: kebabCase(event.tournament.name), year: event.year, eid: event.id }
                    }"
                    class="hover-link default-link w-fit"
                  >
                    {{ event.tournament.name }} {{ event.year }}
                  </u-link>
                </div>
              </template>
            </u-page-card>
          </div>

          <loading-base
            v-else
            v-for="_ in 6"
            :key="_"
          />
        </u-page-columns>
        <error-message
          v-else
          :icon="icons.noPlayer"
          :message="`No players coached by ${coach ? `${coach.first_name} ${coach.last_name}` : capitalCase(id as string)}`"
        />
      </u-page-body>
    </u-page>
  </u-container>
</template>
