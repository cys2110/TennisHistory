<script setup lang="ts">
type H2HMatchType = Pick<EventInterface, "id" | "tournament" | "surface" | "year"> & {
  match: Pick<MatchInterface, "match_no" | "sets" | "winner" | "round" | "tbs" | "incomplete">
}

defineProps<{
  matches: H2HMatchType[]
  status: APIStatusType
  tour: "ATP" | "WTA"
}>()

const route = useRoute()
const p1Name = computed(() => decodeName(route.params.p1Name as string))
const p2Name = computed(() => decodeName(route.params.p2Name as string))
</script>

<template>
  <error-message
    v-if="status === 'error' || !matches.length"
    :message="`No matches played between ${p1Name} and ${p2Name}`"
  />
  <u-page-grid v-else>
    <u-page-card
      v-for="match in matches"
      :key="match.id"
      :ui="{
        root:
          match.match.winner.id === route.params.p1Id
            ? 'min-w-66 ring-primary-600 dark:ring-primary-600 h-full shadow-none hover:shadow-none'
            : 'min-w-66 ring-emerald-700 dark:ring-emerald-700 shadow-none hover:shadow-none',
        description: 'text-sm flex flex-col gap-1 w-full',
        wrapper: 'order-last flex flex-col items-start',
        body: 'flex-1 w-full',
        title: 'flex justify-between'
      }"
      highlight
    >
      <template #title>
        <base-link
          type="tournament"
          :tournament="match.tournament"
        />
        <base-link
          type="event"
          :id="match.id.toString()"
          :tournament="match.tournament"
          :year="match.year"
        />
      </template>

      <template #description>
        <div class="flex justify-between gap-5 w-full text-sm">
          <span>Surface</span>
          <base-link
            type="surface"
            :id="match.surface.id"
            class="text-sm font-semibold"
          />
        </div>
        <div class="flex justify-between gap-5 w-full text-sm">
          <span>Round</span>
          <span class="font-semibold">{{ match.match.round }}</span>
        </div>
        <div class="flex justify-between gap-5 w-full text-sm">
          <span>Winner</span>
          <span class="font-semibold">{{ match.match.winner.name }}</span>
        </div>
        <div class="flex justify-between gap-5 w-full text-sm">
          <span>Score</span>
          <match-score-item
            :sets="match.match.sets"
            :tbs="match.match.tbs"
            :tournament="match.tournament"
            :id="match.id"
            :year="match.year.toString()"
            :match_no="match.match.match_no"
            :incomplete="match.match.incomplete"
            :tour
            type="Singles"
            class="font-semibold"
          />
        </div>
      </template>
    </u-page-card>
  </u-page-grid>
</template>
