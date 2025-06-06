<script setup lang="ts">
type EventType = Pick<EventInterface, "id" | "tournament" | "draw_type" | "year" | "surface" | "category" | "venues" | "dates"> & {
  rounds: {
    round: RoundType
    matches: Pick<MatchInterface, "match_no" | "p1" | "p2">[]
  }[]
}

defineProps<{ event: EventType }>()
const appConfig = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")
</script>

<template>
  <u-card :ui="{ footer: 'justify-center mt-auto' }">
    <template #header>
      <base-link
        type="tournament"
        :tournament="event.tournament"
        class="text-base font-semibold"
      />
    </template>

    <u-collapsible
      v-for="round in event.rounds"
      :key="round.round"
    >
      <u-button
        class="group my-2"
        :label="round.round"
        color="neutral"
        :ui="{
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
        }"
        block
        :trailing-icon="appConfig.ui.icons.chevronDown"
      />
      <template #content>
        <base-link
          v-for="match in round.matches"
          :key="match.match_no"
          type="match"
          :tournament="event.tournament"
          :id="event.id"
          :year="event.year"
          :match_no="match.match_no"
        >
          <div class="flex items-center gap-2">
            <u-icon :name="match.p1.country.alpha2 ? `flag:${match.p1.country.alpha2}-4x3` : `flags:${match.p1.country.id}`" />
            <u-user
              :avatar="{
                src: `https://www.atptour.com/-/media/alias/player-headshot/${match.p1.id}`,
                icon: ICONS.player
              }"
              :name="match.p1.name"
              :size="mdAndUp ? 'md' : 'sm'"
            />
            v.
            <u-icon :name="match.p2.country.alpha2 ? `flag:${match.p2.country.alpha2}-4x3` : `flags:${match.p2.country.id}`" />
            <u-user
              :avatar="{
                src: `https://www.atptour.com/-/media/alias/player-headshot/${match.p2.id}`,
                icon: ICONS.player
              }"
              :name="match.p2.name"
              :size="mdAndUp ? 'md' : 'sm'"
            />
          </div>
        </base-link>
      </template>
    </u-collapsible>

    <template #footer>
      <event-buttons
        :tournament="event.tournament"
        :year="event.year"
        :id="event.id"
        :draw_type="event.draw_type"
      />
    </template>
  </u-card>
</template>
