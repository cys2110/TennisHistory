<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GET_EVENT } from '@/services/EventService'
import { unencodeName, updateDocumentTitle } from '@/utils/functions'
import type { Event, Entry, EntryConnection, Round } from '@/utils/types'
import { ENTRY_INFO } from '@/utils/variables'

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

const event: Ref<Omit<Event, 'rounds'> & { rounds: Omit<Round, 'matches' | 'event'>[] } | null> = ref(null)
const entryInfo: Ref<{ array: EntryConnection[]; title: string }[]> = ref([])
const entries: Ref<Entry[]> = ref([])

// Menubar
const menuItems: Ref<{ route: string; label: string }[]> = ref([])
const menuOptions = { itemColor: '{cyan.500}', gap: '1rem' }
const pages = [
  { title: 'Results', name: 'results' },
  { title: 'Draw', name: 'draw' },
]

// Update document title
watch(() => name, () => updateDocumentTitle(`${unencodeName(name as string)} ${year} | TennisHistory`), { immediate: true })

// Navigate
const navigateToHeading = (heading: string) => router.push({ hash: heading })

// API call
const { query, variables } = GET_EVENT(parseInt(eid as string), eid as string)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) {
    entries.value = newResult.entries
    event.value = newResult.events[0]
    const sections: Section[] = ['ldaConnection', 'wdConnection', 'wcConnection', 'qualifiersConnection', 'llsConnection', 'altConnection', 'retConnection', 'woConnection', 'defaultedConnection']
    entryInfo.value = sections.flatMap((section) => {
      const data = newResult.events[0][section].edges

      return data && data.length > 0
        ? [{ array: data, title: ENTRY_INFO[section] }]
        : []
    }).filter(Boolean)

    menuItems.value = [
      ...(event.value?.rounds[0].pm ? [{ route: '#awards', label: 'Awards' }] : []),
      ...(event.value && event.value.seeds.length > 0 ? [{ route: '#seeds', label: 'Seeds' }] : []),
      ...(entryInfo.value.length > 0 ? [{ route: '#entry-info', label: 'Entry Information' }] : []),
      { route: '#entries', label: 'Entries' },
    ].filter(Boolean)
  }
},
  { immediate: true },
)

watch(error, (newError) => {
  if (newError) console.error(newError)
}, { immediate: true })

const passProps = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  return Object.fromEntries(
    keys.map((key) => [key, obj[key]])
  ) as Pick<T, K>;
};
</script>

<template>
  <div v-if="event" class="md:w-3/4 mx-auto">
    <Menubar :model="menuItems" class="mb-5" :dt="menuOptions">
      <template #item="{ item }">
        <router-link :to="item.route" @click.prevent="() => navigateToHeading(item.route)">
          {{
            item.label
          }}
        </router-link>
      </template>
      <template #end>
        <div class="flex items-center">
          <Button v-for="page in pages" :key="page.title" as="router-link" :label="page.title" size="small" rounded
            class="mx-2" raised :to="{ name: page.name }" />
        </div>
      </template>
    </Menubar>
    <EventOverview class="my-10"
      :event="passProps(event, ['currency', 'pm', 'tfc', 'sponsor_name', 'category', 'start_date', 'end_date', 'surface', 'venue', 'supervisors', 'draw_type'])" />
    <PrizeMoney :rounds="event.rounds" :currency="event.currency" class="!my-10" />
    <Seeds :seeds="event.seeds" class="!my-10" />
    <EntryInfo :entryInfo class="!my-10" />
    <Entries :entries />
  </div>
  <Loading v-else :loading>
    <template #none>No data available</template>
  </Loading>
</template>

<style scoped>
:deep(.p-menubar-item-content a) {
  font-weight: bolder !important;
}

:deep(.p-button-label) {
  font-weight: bolder !important;
}
</style>