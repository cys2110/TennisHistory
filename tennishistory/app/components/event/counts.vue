<script setup lang="ts">
const { events } = defineProps<{ events: EventInterface[] }>()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const smAndDown = breakpoints.smaller("md")

const brokenOutCounts = computed(() => [
  {
    tour: "ATP",
    title: "ATP Events",
    total: events.reduce((acc, curr) => {
      if (curr.tours.includes("ATP")) acc++
      return acc
    }, 0),
    tour_level: events.reduce((acc, curr) => {
      if (curr.category || (curr.atp_category && !ATP_CATEGORIES.includes(curr.atp_category))) acc++
      return acc
    }, 0),
    challenger_level: events.reduce((acc, curr) => {
      if (curr.atp_category && ATP_CHALLENGER_CATEGORIES.includes(curr.atp_category)) acc++
      return acc
    }, 0)
  },
  {
    tour: "WTA",
    title: "WTA Events",
    total: events.reduce((acc, curr) => {
      if (curr.tours.includes("WTA")) acc++
      return acc
    }, 0),
    tour_level: events.reduce((acc, curr) => {
      if (curr.category || (curr.wta_category && !WTA_CATEGORIES.includes(curr.wta_category))) acc++
      return acc
    }, 0),
    challenger_level: events.reduce((acc, curr) => {
      if (curr.wta_category && WTA_CHALLENGER_CATEGORIES.includes(curr.wta_category)) acc++
      return acc
    }, 0)
  },
  {
    tour: "ITF",
    title: "ITF Events",
    total: events.reduce((acc, curr) => {
      if (curr.tours.includes("Men") || curr.tours.includes("Women")) acc++
      return acc
    }, 0),
    tour_level: events.reduce((acc, curr) => {
      if (curr.tours.includes("Men")) acc++
      return acc
    }, 0),
    challenger_level: events.reduce((acc, curr) => {
      if (curr.tours.includes("Women")) acc++
      return acc
    }, 0)
  }
])
</script>

<template>
  <u-container>
    <u-card
      v-if="smAndDown"
      class="ring-primary"
    >
      <div
        v-for="count in brokenOutCounts"
        :key="count.tour"
        class="my-2"
      >
        <div class="flex justify-between text-sm font-semibold">
          <span>{{ count.title }}</span>
          <span>{{ count.total }}</span>
        </div>
        <div class="flex justify-between text-xs">
          <span>
            {{ count.tour === "ITF" ? "Men" : "Tour Level" }}
          </span>
          <span>{{ count.tour_level }}</span>
        </div>
        <div class="flex justify-between text-xs">
          <span>
            {{ count.tour === "ITF" ? "Women" : "Challenger Level" }}
          </span>
          <span>{{ count.challenger_level }}</span>
        </div>
      </div>
    </u-card>
    <div
      v-else
      class="grid grid-cols-3 gap-5"
    >
      <u-card
        v-for="count in brokenOutCounts"
        :key="count.tour"
        :class="
          count.tour === 'ATP' ? 'ring-atp'
          : count.tour === 'WTA' ? 'ring-wta'
          : 'ring-primary'
        "
        :ui="{
          header: 'flex justify-between items-center font-semibold sm:p-4',
          body: 'flex flex-col gap-1 sm:p-4'
        }"
      >
        <template #header>
          <span>{{ count.title }}</span>
          <span>{{ count.total }}</span>
        </template>

        <div class="flex justify-between items-center text-sm">
          <span>{{ count.tour === "ITF" ? "Men" : "Tour Level" }}</span>
          <span>{{ count.tour_level }}</span>
        </div>

        <div class="flex justify-between items-center text-sm">
          <span>{{ count.tour === "ITF" ? "Women" : "Challenger Level" }}</span>
          <span>{{ count.challenger_level }}</span>
        </div>
      </u-card>
    </div>
  </u-container>
</template>
