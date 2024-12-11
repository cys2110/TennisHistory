<script setup lang="tsx">
import { defineComponent } from 'vue'
import Fieldset from 'primevue/fieldset'
import { DateTime } from 'luxon'
import GetFlag from '../Global/GetFlag.vue'
import { convertToFt, encodeName, formatDate, smallDate } from '@/utils/functions'
import type { Player } from '@/utils/types'

const props = defineProps<{
  player: Player
}>()
const {
  countryConnection,
  prev_countriesConnection,
  turned_pro,
  retired,
  dob,
  rh,
  bh1,
  height_cm,
  coaches,
  career_high,
  ch_date,
  win,
  loss,
  titles,
  pm_USD,
} = props.player

const statistics = [
  {
    title: 'Career High',
    value: career_high ?? '—',
    description: ch_date ? formatDate(ch_date) : '—',
  },
  { title: 'Win-Loss', value: `${win}—${loss}` },
  { title: 'Titles', value: titles },
  { title: 'Prize Money', prefix: '$', value: pm_USD.toLocaleString('en-GB') },
]

const descriptionItems = [
  {
    label: 'Country',
    value: <div class="flex items-center">
      <GetFlag country={countryConnection.edges[0].node.id} />
      <div class="ml-2">{countryConnection.edges[0].node.name}</div>
    </div>,
    colSpan: 1
  },
  {
    label: 'Active',
    value: turned_pro ?
      <div>
        {<div>{retired ? retired.id - turned_pro.id : DateTime.now().year - turned_pro.id + 1} years</div>}
        <div>{turned_pro.id} - {retired?.id || 'present'}</div>
      </div>
      : '—',
    colSpan: 1
  },
  {
    label: 'Age',
    value: dob ? <div>
      <div>{Math.floor(Math.abs(DateTime.fromISO(dob).diffNow('years').toObject().years || 0))}</div>
      <div>{formatDate(dob)}</div>
    </div> : '—',
    colSpan: 1
  },
  {
    label: 'Height',
    value: height_cm ? <div>
      <div>{height_cm} cm</div>
      <div>{convertToFt(height_cm)}</div>
    </div> : '—',
    colSpan: 1
  },
  {
    label: 'Plays',
    value: rh === true ? 'Right-handed' : rh === false ? 'Left-handed' : '—',
    colSpan: 1

  },
  {
    label: 'Backhand',
    value: bh1 === true ? 'One-handed' : bh1 === false ? 'Two-handed' : '—',
    colSpan: 1
  },
  {
    label: coaches.length === 1 ? 'Coach' : 'Coaches',
    value: <div class="flex flex-col">
      {coaches.length > 0 ? coaches.map(coach => {
        return coach.first_name ? <router-link class="hover-link" to={{ name: 'player', params: { name: encodeName(coach.full_name), id: coach.id } }}>{coach.full_name}</router-link> : coach.id
      }) : '—'}
    </div>,
    colSpan: 1
  },
  {
    label: 'Previous Representations',
    value: prev_countriesConnection && prev_countriesConnection.edges.length > 0 ? <div>
      {prev_countriesConnection.edges.map((country) => {
        return <div class="grid grid-cols-6 gap-2">
          <div><GetFlag country={country.node.id} /></div>
          <div class="col-span-2">{country.node.name}</div>
          <div class="col-span-3">{smallDate(country.properties.start_date)}—{smallDate(country.properties.end_date)}</div>
        </div>
      })}
    </div> : '—',
    colSpan: 2
  }
]

const Descriptions = defineComponent(() => {
  return () => (
    <>
      {descriptionItems.map(item => (
        <Fieldset legend={item.label} class={`sm:col-span-1 md:col-span-${item.colSpan} lg:col-span-${item.colSpan} xl:col-span-${item.colSpan} flex justify-center items-center`}>{item.value}</Fieldset>
      ))}
    </>
  );
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 justify-center">
    <Card v-for="stat in statistics" :key="stat.title" class="p-5 w-11/12 mx-auto text-center">
      <template #subtitle>{{ stat.title }}</template>
      <template #footer v-if="stat.description">
        <div class="text-zinc-400">{{ stat.description }}</div>
      </template>
      <template #content>
        <div class="font-bold text-xl md:text-lg lg:text-2xl">{{ stat.prefix || '' }} {{ stat.value }}</div>
      </template>
    </Card>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 mt-5">
    <Descriptions />
  </div>
</template>