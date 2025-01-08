<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue'
import { getUpcomingTournaments } from 'src/neo4j/getUpcomingTournaments'
import { MONTHS } from 'src/utils/variables'
import PageTitle from 'src/components/PageTitle.vue'
import pageLink from 'src/components/nav/PageLink.vue'
import EventCard from 'src/components/EventCard.vue'

const loading = ref(false)

// Surface filter
const surface = ref('All')
const surfaces = ['All', 'Clay', 'Grass', 'Hard']

// Month filter
const month = ref('All')
const months = ['All', ...MONTHS]

// Category filter
const category = ref('All')
const categories = ['All', 'ATP 250', 'ATP 500', 'ATP Masters 1000', 'Grand Slam', 'ATP Finals']

const selectOptions = [
  { vModel: category, options: categories, label: 'Category' },
  { vModel: month, options: months, label: 'Month' },
  { vModel: surface, options: surfaces, label: 'Surface' },
]

// Db call
const events: Ref<EventCardType[]> = ref([])
const sidebarLinks: Ref<{ title: string; link: string }[]> = ref([])

const fetchUpcoming = () => {
  loading.value = true
  getUpcomingTournaments({ surface: 'All', month: 'All', category: 'All' })
    .then((results: EventCardType[]) => {
      events.value = results
      sidebarLinks.value = results.map((event) => {
        return {
          title: event.tname,
          link: `#${event.tid}`,
        }
      })
    })
    .catch((error) => console.error('Error fetching events:', error))
    .finally(() => (loading.value = false))
}

onMounted(() => {
  fetchUpcoming()
})
</script>

<template>
  <q-page padding>
    <page-title>
      <template #heading>Upcoming Events</template>
    </page-title>

    <!--Loading skeletons-->

    <div v-if="events.length > 0" class="row justify-evenly q-gutter-md">
      <event-card v-for="event in events" :key="event.tid" :event />
    </div>

    <q-banner v-else rounded class="bg-warning">
      <div class="row items-center justify-center q-gutter-sm">
        <q-icon
          name="fa-duotone fa-regular fa-calendar-circle-minus"
          size="xs"
          class="text-negative"
        />
        <span class="text-negative text-weight-bold text-subtitle1">No upcoming events </span>
      </div>
    </q-banner>

    <!--Keep select options at top of screen-->
    <q-page-sticky position="top" expand class="bg-black">
      <q-toolbar class="row justify-evenly">
        <q-select
          v-for="select in selectOptions"
          :key="select.label"
          :label="select.label"
          v-model="select.vModel.value"
          outlined
          dense
          color="green-7"
          label-color="green-7"
          :options="select.options"
          options-dense
          dropdown-icon="fa-duotone fa-solid fa-circle-chevron-down"
          class="selects q-my-sm q-py-xs"
        ></q-select>
      </q-toolbar>
    </q-page-sticky>

    <!--Right sidebar navigation-->
    <q-page-sticky
      v-if="$q.screen.gt.md && sidebarLinks.length > 0"
      position="right"
      :offset="[20, 20]"
      class="scroll-wrapper"
    >
      <div class="text-subtitle-1 text-weight-bold q-mb-md">On this page</div>
      <q-scroll-area class="scroller">
        <q-list dense>
          <page-link v-for="link in sidebarLinks" :key="link.title" v-bind="link" />
        </q-list>
      </q-scroll-area>
    </q-page-sticky>
  </q-page>
</template>

<style>
.scroll-wrapper {
  height: 100vh;
  overflow-y: auto;
}
.scroller {
  height: calc(100vh - 200px);
  width: 200px;
}

.selects {
  width: 10%;
}
</style>
