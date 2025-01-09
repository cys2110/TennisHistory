<script setup lang="ts">
import { breakpointsTailwind } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndUp = breakpoints.greaterOrEqual('lg')

const events = ref<EventCardType[]>([])
const sidebarLinks = ref<{ label: string; to: string }[]>([])

// Surface filter
const surface = ref(['Clay', 'Grass', 'Hard'])
const surfaces = [
  { label: 'Clay', value: 'Clay' },
  { label: 'Grass', value: 'Grass' },
  { label: 'Hard', value: 'Hard' },
]

// Month filter
const month = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
const monthsOptions = MONTHS.map((month, index) => ({ label: month, value: (index + 1).toString() }))

// Category filter
const category = ref(['ATP 250', 'ATP 500', 'ATP Masters 1000', 'Grand Slam', 'ATP Finals'])
const categoryOptions = [
  { label: 'ATP 250', value: 'ATP 250' },
  { label: 'ATP 500', value: 'ATP 500' },
  { label: 'ATP Masters 1000', value: 'ATP Masters 1000' },
  { label: 'Grand Slam', value: 'Grand Slam' },
  { label: 'ATP Finals', value: 'ATP Finals' },
]

const { isReady, isLoading, execute } = useAsyncState(
  () =>
    getUpcomingTournaments(surface.value, month.value, category.value).then((results) => {
      events.value = results
      console.log(results)
      sidebarLinks.value = results.map((event: EventCardType) => ({
        label: event.tname,
        to: `#event-${event.eid}`,
      }))
      return results
    }),
  [],
  { immediate: true },
)

watch(
  () => [surface.value, month.value, category.value],
  () => execute(),
)
</script>

<template>
  <el-container class="h-screen">
    <el-main>
      <div class="w-5/6 mx-auto">
        <page-title>
          <template #heading>Upcoming Tournaments</template>
        </page-title>
        <div v-if="events.length > 0" class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
          <event-card v-for="event in events" :key="event.eid" :event />
        </div>
        <error-message v-else :icon="['fad', 'calendar-xmark']">
          <template #message>No upcoming tournaments</template>
        </error-message>
      </div>
    </el-main>
    <el-aside v-if="lgAndUp" class="h-screen sticky">
      <div class="px-8 mt-24 flex flex-col gap-3">
        <div class="text-lg text-slate-800 dark:text-slate-400">Filters</div>
        <select-component label="Category" :options="categoryOptions" v-model="category" />
        <select-component label="Month" :options="monthsOptions" v-model="month" />
        <select-component label="Surface" :options="surfaces" v-model="surface" />
      </div>
      <el-scrollbar v-if="sidebarLinks.length > 0" class="!max-h-96 mt-10">
        <div class="flex flex-col gap-2">
          <div class="text-lg text-slate-800 dark:text-slate-400">Tournaments</div>
          <router-link v-for="link in sidebarLinks" :key="link.label" :to="link.to" exact-active-class="text-green-600" class="ml-5">{{ link.label }}</router-link>
        </div>
      </el-scrollbar>
    </el-aside>
  </el-container>
</template>

<style>
.el-menu::-webkit-scrollbar,
.el-scrollbar::-webkit-scrollbar,
.el-aside::-webkit-scrollbar,
.el-main::-webkit-scrollbar {
  display: none !important;
}
</style>
