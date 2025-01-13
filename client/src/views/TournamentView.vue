<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { breakpointsTailwind, useAsyncState, useBreakpoints } from '@vueuse/core'
import { useRouteParams } from '@vueuse/router'
import { useChangeCase } from '@vueuse/integrations'
import { Fieldset, Skeleton } from 'primevue'
import getTournamentDetails from '@/services/getTournamentDetails'
import type { Countries } from '@/types/enums'
import TournamentBreadcrumb from '@/components/TournamentBreadcrumb.vue'
import PageTitle from '@/components/layout/PageTitle.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import FlagIcon from '@/components/FlagIcon.vue'
import TournamentCard from '@/components/tournament/TournamentCard.vue'
import TournamentLoadingCard from '@/components/tournament/TournamentLoadingCard.vue'

interface SponsorNameType {
  name: string
  years: string
}

interface VenueType {
  name: string
  city: string
  country: Countries
  years: string
}

const tname = useRouteParams('name')
const tid = useRouteParams('tid')
document.title = `${useChangeCase(tname.value as string, 'capitalCase').value} | TennisHistory`

const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndUp = breakpoints.greaterOrEqual('lg')

const tournament: Ref<TournamentType | undefined> = ref()
const sponsorNames: Ref<SponsorNameType[]> = ref([])
const venues: Ref<VenueType[]> = ref([])
const events: Ref<TournamentEventType[]> = ref([])
const sidebarLinks: Ref<{ label: string; to: string }[]> = ref([])

const { error, isLoading } = useAsyncState(
  () =>
    getTournamentDetails(tid.value as string).then((results) => {
      tournament.value = results.tournament
      console.log(results)
      events.value = results.events
      sidebarLinks.value = results.events.map((event: TournamentEventType) => ({
        label: event.year,
        to: `#event-${event.eid}`
      }))

      // Get venue list
      const venueList: VenueType[] = []
      results.tournament.venues.forEach((venue: Omit<VenueType, 'years'>) => {
        const first = results.events.find((event: TournamentEventType) => event.venue === venue.name)
        const last = results.events.findLast((event: TournamentEventType) => event.venue === venue.name)
        if (first === last) {
          venueList.push({ ...venue, years: `${first?.year}` })
        } else {
          venueList.push({ ...venue, years: `${first?.year} - ${last?.year}` })
        }
      })
      venues.value = venueList

      // Get sponsor name list
      if (results.tournament.names.length > 0) {
        const sponsorList: { name: string; years: string }[] = []
        results.tournament.names.forEach((name: string) => {
          const first = results.events.find((event: TournamentEventType) => event.name === name)
          const last = results.events.findLast((event: TournamentEventType) => event.name === name)
          if (first === last) {
            sponsorList.push({ name: name, years: `${first?.year}` })
          } else {
            sponsorList.push({ name: name, years: `${first?.year} - ${last?.year}` })
          }
        })
        sponsorNames.value = sponsorList
      }
      return results
    }),
  [],
  { immediate: true }
)
</script>

<template>
  <div class="grid grid-cols-12 p-10">
    <div class="col-span-10 px-5">
      <page-title>
        <template #breadcrumbs>
          <tournament-breadcrumb v-if="tournament" :tournament="tournament.name" :tid="tid as string" />
        </template>
        <template #heading>{{ tournament?.name ?? useChangeCase(tname as string, 'capitalCase').value }}</template>
        <template #subheading>{{ tournament?.years ?? '' }}</template>
      </page-title>
      <div class="flex justify-evenly">
        <Fieldset v-if="isLoading" v-for="i in new Array(2)" :key="i" class="w-40">
          <template #legend>
            <Skeleton width="30%" />
          </template>
          <Skeleton width="100%" />
        </Fieldset>
        <Fieldset v-if="sponsorNames.length > 0" legend="Sponsors">
          <div v-for="name in sponsorNames" :key="name.name">{{ name.name }} ({{ name.years }})</div>
        </Fieldset>
        <Fieldset legend="Venues">
          <div v-for="venue in venues" :key="venue.name" class="flex gap-2">
            {{ venue.name }}, {{ venue.city }}
            <flag-icon :country="venue.country" />
            ({{ venue.years }})
          </div>
        </Fieldset>
      </div>
      <div class="grid grid-cols-4 gap-5 my-10">
        <tournament-loading-card v-if="isLoading" v-for="i in new Array(4)" :key="i" />
        <tournament-card v-else-if="events.length > 0" v-for="event in events" :key="event.eid" :event />
      </div>
      <error-message v-if="error" :icon="['fad', 'circle-exclamation']">
        <template #error-message>No tournament information available</template>
      </error-message>
    </div>
    <Sidebar v-if="lgAndUp" :links="sidebarLinks">
      <template #anchor-heading>
        <div class="text-slate-400">On this page</div>
      </template>
    </Sidebar>
  </div>
</template>
