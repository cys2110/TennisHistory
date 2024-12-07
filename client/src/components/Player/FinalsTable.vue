<script setup>
import { computed } from 'vue'
import { encodeName } from '@/utils/functions'
import { COLOURS, SURFACES } from '@/utils/variables'

// Variables
const props = defineProps(['events'])
const flattenedEvents = computed(() =>
  props.events.flatMap(({ year, count, events }) =>
    events.map((event, index) => ({
      year: index === 0 ? year : '',
      count: index === 0 ? count : 0,
      event,
    })),
  ),
)

// Table styling
const customHeaderStyle = { style: { backgroundColor: COLOURS.violet700, textAlign: 'center' } }
const customHeaderCell = () => customHeaderStyle
const customCell = (record) => ({ rowSpan: record.count, align: 'center' })

const columns = [
  {
    title: 'Year',
    dataIndex: 'year',
    key: 'year',
    customCell,
    customHeaderCell,
  },
  {
    title: 'Total',
    dataIndex: 'count',
    key: 'count',
    customCell,
    customHeaderCell,
  },
  {
    title: 'Event',
    dataIndex: 'event',
    key: 'eventName',
    customHeaderCell,
  },
  {
    title: 'Surface',
    dataIndex: ['event', 'surface'],
    key: 'surface',
    customHeaderCell,
  },
]
</script>

<template>
  <a-table :columns :data-source="flattenedEvents">
    <template #bodyCell="{ column, text }">
      <template v-if="column.title === 'Event'">
        <router-link
          class="hover-link"
          :to="{ name: 'tournament', params: { name: encodeName(text.tname), id: text.tid } }"
          >{{ text.tname }}</router-link
        >
      </template>
      <template v-if="column.title === 'Surface'">{{ SURFACES[text] }}</template>
    </template>
  </a-table>
</template>
