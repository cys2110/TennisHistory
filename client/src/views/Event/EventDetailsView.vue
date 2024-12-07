<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { Grid } from 'ant-design-vue'
import { GET_EVENT } from '@/services/EventService'
import { unencodeName, updateDocumentTitle } from '@/utils/functions'
import { ENTRY_INFO } from '@/utils/variables'
import type { EntryConnectionNode, EventDetailsType } from '@/utils/types'

type Section =
  | 'ldaConnection'
  | 'wdConnection'
  | 'retConnection'
  | 'woConnection'
  | 'defaultedConnection'
  | 'llsConnection'
  | 'altConnection'
  | 'wcConnection'
  | 'qualifiersConnection'

const route = useRoute()
const router = useRouter()
const { name, id, year, eid } = route.params

const { useBreakpoint } = Grid
const screens = useBreakpoint()

const event: Ref<EventDetailsType | null> = ref(null)
const entryInfo: Ref<{ array: EntryConnectionNode['edges'][]; title: string }[]> = ref([])
const entries = ref(null)
const anchorItems: Ref<{ key: string; href: string; title: string }[]> = ref([])

// Update document title
watch(
  () => name,
  () => updateDocumentTitle(`${unencodeName(name as string)} ${year} | TennisHistory`),
  { immediate: true },
)

// Navigate to pages
const navigateTo = (page: string) => router.push({ name: page })

// API call
const { query, variables } = GET_EVENT(parseInt(eid as string), eid as string)
const { result, loading, error } = useQuery(query, variables)

watch(
  result,
  (newResult) => {
    if (newResult) {
      entries.value = newResult.entries
      event.value = newResult.events[0]
      const sections: Section[] = [
        'ldaConnection',
        'wdConnection',
        'wcConnection',
        'qualifiersConnection',
        'llsConnection',
        'altConnection',
        'retConnection',
        'woConnection',
        'defaultedConnection',
      ]
      entryInfo.value = sections.flatMap((section) => {
        const data = newResult.events[0][section].edges

        return data && data.length > 0
          ? [
            {
              array: data,
              title: ENTRY_INFO[section],
            },
          ]
          : []
      }).filter(Boolean)

      anchorItems.value = [
        { key: 'details', href: '#details', title: 'Details' },
        ...(event.value?.rounds[0].pm ? [{ key: 'pm', href: '#awards', title: 'Awards' }] : []),
        ...(event.value && event.value.seeds.length > 0
          ? [{ key: 'seeds', href: '#seeds', title: 'Seeds' }]
          : []),
        ...(entryInfo.value.length > 0
          ? [{ key: 'info', href: '#entry-info', title: 'Entry Information' }]
          : []),
        { key: 'entries', href: '#entries', title: 'Entries' },
      ].filter(Boolean)
    }
  },
  { immediate: true },
)

watch(
  error,
  (newError) => {
    if (newError) console.error(newError)
  },
  { immediate: true },
)

const pages = ['results', 'draw']
</script>

<template>
  <a-row v-if="event" justify="space-evenly" :gutter="32">

    <a-col :span="4" v-if="screens.sm">
      <a-anchor :items="anchorItems" :offset-top="75" />
    </a-col>

    <a-col :xs="24" :sm="20">
      <div v-if="screens.xs" class="flex justify-evenly my-5">
        <a-button v-for="page in pages" :key="page" @click="navigateTo(page)" class="!border-violet-700 capitalize">{{
          page }}</a-button>
      </div>
      <EventOverview :event />
      <PrizeMoney :rounds="event.rounds" :currency="event.currency" />
      <Seeds :seeds="event.seeds" />
      <EntryInfo :entryInfo />
      <Entries :entries />
    </a-col>
  </a-row>
  <Loading v-else :loading>
    <template #none>No data available</template>
  </Loading>
</template>