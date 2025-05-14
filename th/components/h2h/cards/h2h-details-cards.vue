<script setup lang="ts">
defineProps<{
  c1: CountryInterface
  c2: CountryInterface
  h2h: {
    p1: H2HPlayerInterface
    p2: H2HPlayerInterface
    p1Wins: number
    p2Wins: number
  } | null
  status: APIStatusType
}>()

const route = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const lgAndUp = breakpoints.greaterOrEqual("lg")

const p1Id = computed(() => route.params.p1Id as string)
const p2Id = computed(() => route.params.p2Id as string)
const p1Name = computed(() => decodeName(route.params.p1Name as string))
const p2Name = computed(() => decodeName(route.params.p2Name as string))
</script>

<template>
  <error-message
    v-if="status === 'error'"
    :message="`No head to head found for ${p1Name} v. ${p2Name}`"
    :icon="ICONS.noH2H"
  />
  <div
    v-else-if="h2h"
    class="flex gap-10 justify-center mb-10"
  >
    <h2h-player-card
      v-if="h2h && lgAndUp"
      :player="h2h.p1"
      :index="1"
      :id="p1Id"
      :country="c1"
      :key="1"
    />
    <div class="flex flex-col items-center flex-1">
      <doughnut-chart
        :p1-wins="h2h.p1Wins"
        :p2-wins="h2h.p2Wins"
      />
      <h2h-progress
        :h2h
        :c1
        :c2
      />
    </div>
    <h2h-player-card
      v-if="h2h && lgAndUp"
      :player="h2h.p2"
      :index="2"
      :id="p2Id"
      :country="c2"
      :key="2"
    />
  </div>
  <u-progress
    v-else
    size="xl"
    animation="swing"
  />
</template>
