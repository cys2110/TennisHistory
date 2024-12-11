<script setup lang="ts">
// @ts-nocheck
import { Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import Tab from 'primevue/tab'
import TabList from 'primevue/tablist'
import Tabs from 'primevue/tabs'
import TabPanels from 'primevue/tabpanels'
import { GET_MATCH } from '@/services/MatchService'
import {
  encodeName,
  headshot,
  percentage,
  unencodeName,
  updateDocumentTitle,
} from '@/utils/functions'
import { COLOURS } from '@/utils/variables'
import { Incomplete, StatusInfo, type Match } from '@/utils/types'

// Variables
const props = defineProps<{
  name: string
  id: string
  eid: string
  year: string
  mid: string
}>()

document.title = `${unencodeName(props.name)} ${props.year} | TennisHistory`
const match: Ref<Match | null> = ref(null)
const stats: Ref<{ category: string, p1Value: number, p2Value: number, p1Max?: number, p2Max?: number, p1Actual?: number, p2Actual?: number }[][]> = ref([])
const serviceSpeed = ref(null)

// Get player params
const playerParams = (player: { player: { player: { full_name: string; id: string } } }) => {
  const name = encodeName(player.player.player.full_name)
  return {
    name: name,
    id: player.player.player.id,
  }
}

// API call
const { query, variables } = GET_MATCH(parseInt(props.mid), parseInt(props.eid))
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) {
    match.value = newResult.matches[0]
    updateDocumentTitle(
      `${match.value?.p1.player.player.full_name} vs. ${match.value?.p2.player.player.full_name} | ${unencodeName(props.name)} ${props.year} | TennisHistory`,
    )
    const serviceStats = [
      {
        category: 'Aces',
        p1Value: match.value?.p1.aces,
        p2Value: match.value?.p2.aces,
      },
      {
        category: 'Double faults',
        p1Value: match.value?.p1.dfs,
        p2Value: match.value?.p2.dfs,
      },
      {
        category: 'First serve',
        p1Actual: match.value?.p1.serve1_pts,
        p1Max:
          match.value?.p1.serve1_pts &&
          match.value?.p1.serve2_pts &&
          match.value?.p1.serve1_pts + match.value.p1.serve2_pts,
        p2Actual: match.value?.p2.serve1_pts,
        p2Max:
          match.value?.p2.serve1_pts &&
          match.value?.p2.serve2_pts &&
          match.value.p2.serve1_pts + match.value.p2.serve2_pts,
      },
      {
        category: '1st serve points won',
        p1Actual: match.value.p1.serve1_pts_w,
        p1Max: match.value.p1.serve1_pts,
        p2Actual: match.value.p2.serve1_pts_w,
        p2Max: match.value.p2.serve1_pts,
      },
      {
        category: '2nd serve points won',
        p1Actual: match.value.p1.serve2_pts_w,
        p1Max: match.value.p1.serve2_pts,
        p2Actual: match.value.p2.serve2_pts_w,
        p2Max: match.value.p2.serve1_pts,
      },
      {
        category: 'Break points saved',
        p1Actual: match.value.p1.bps_saved,
        p1Max: match.value.p1.bps_faced,
        p2Actual: match.value.p2.bps_saved,
        p2Max: match.value.p2.bps_faced,
      },
    ]
    serviceStats.map((stat) => {
      if (stat.p1Max && stat.p2Max && stat.p1Actual && stat.p2Actual) {
        stat.p1Value = percentage(stat.p1Actual, stat.p1Max)
        stat.p2Value = percentage(stat.p2Actual, stat.p2Max)
      }
    })
    const returnStats = [
      {
        category: '1st serve return points won',
        p1Actual: match.value.p1.ret1_w,
        p1Max: match.value.p1.ret1,
        p2Actual: match.value.p2.ret1_w,
        p2Max: match.value.p2.ret1,
      },
      {
        category: '2nd serve return points won',
        p1Actual: match.value.p1.ret2_w,
        p1Max: match.value.p1.ret2,
        p2Actual: match.value.p2.ret2_w,
        p2Max: match.value.p2.ret2,
      },
      {
        category: 'Break points converted',
        p1Actual: match.value.p1.bps_converted,
        p1Max: match.value.p1.bp_opps,
        p2Actual: match.value.p2.bps_converted,
        p2Max: match.value.p2.bp_opps,
      },
    ]
    returnStats.map((stat) => {
      stat.p1Value = percentage(stat.p1Actual, stat.p1Max)
      stat.p2Value = percentage(stat.p2Actual, stat.p2Max)
    })

    let pointStats = [
      {
        category: 'Service points won',
        p1Actual: match.value.p1.serve1_pts_w + match.value.p1.serve2_pts_w,
        p1Max: match.value.p1.serve1_pts + match.value.p1.serve2_pts,
        p2Actual: match.value.p2.serve1_pts_w + match.value.p2.serve2_pts_w,
        p2Max: match.value.p2.serve1_pts + match.value.p2.serve2_pts,
      },
      {
        category: 'Return points won',
        p1Actual: match.value.p1.ret1_w + match.value.p1.ret2_w,
        p1Max: match.value.p1.ret1 + match.value.p1.ret2,
        p2Actual: match.value.p2.ret1_w + match.value.p2.ret2_w,
        p2Max: match.value.p2.ret1 + match.value.p2.ret2,
      },
      match.value.p1.net && {
        category: 'Net points won',
        p1Actual: match.value.p1.net_w,
        p1Max: match.value.p1.net,
        p2Actual: match.value.p2.net_w,
        p2Max: match.value.p2.net,
      },
      match.value.p1.winners && {
        category: 'Winners',
        p1Value: match.value.p1.winners,
        p2Value: match.value.p2.winners,
      },
      match.value.p1.ues && {
        category: 'Unforced errors',
        p1Value: match.value.p1.ues,
        p2Value: match.value.p2.ues,
      },
      {
        category: 'Total Points Won',
        p1Actual:
          match.value.p1.serve1_pts_w +
          match.value.p1.serve2_pts_w +
          match.value.p1.ret1_w +
          match.value.p1.ret2_w,
        p1Max:
          match.value.p1.serve1_pts +
          match.value.p1.serve2_pts +
          match.value.p1.ret1 +
          match.value.p1.ret2,
        p2Actual:
          match.value.p2.serve1_pts_w +
          match.value.p2.serve2_pts_w +
          match.value.p2.ret1_w +
          match.value.p2.ret2_w,
        p2Max:
          match.value.p1.serve1_pts +
          match.value.p1.serve2_pts +
          match.value.p1.ret1 +
          match.value.p1.ret2,
      },
    ].filter(Boolean)
    pointStats.map((stat) => {
      if (stat.p1Max) {
        stat.p1Value = percentage(stat.p1Actual, stat.p1Max)
        stat.p2Value = percentage(stat.p2Actual, stat.p2Max)
      }
    })
    stats.value = [serviceStats, returnStats, pointStats]
    if (match.value.p1.max_speed_kph) {
      serviceSpeed.value = [
        { name: 'Max Speed', p1: match.value.p1.max_speed_kph, p2: match.value.p2.max_speed_kph },
        {
          name: '1st serve average speed',
          p1: match.value.p1.avg_sv1_kph,
          p2: match.value.p2.avg_sv1_kph,
        },
        {
          name: '2nd serve average speed',
          p1: match.value.p1.avg_sv2_kph,
          p2: match.value.p2.avg_sv2_kph,
        },
      ]
    }
  }
}, { immediate: true })

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
  <Title v-if="match">
    <template #title>{{ unencodeName(name) }} {{ year }}</template>
    <template #subtitle>{{ match.round.round }}—{{ match.p1.player.player.full_name }} v. {{
      match.p2.player.player.full_name }}</template>
  </Title>
  <div v-if="match" class="w-3/4 mx-auto">
    <Tabs value="0">
      <TabList>
        <Tab value="0">Details</Tab>
        <Tab value="1">Service Stats</Tab>
        <Tab value="2">Return Stats</Tab>
        <Tab value="3">Points Stats</Tab>
        <Tab v-if="match.p1.max_speed_kph" value="4">Service Speed</Tab>
      </TabList>
      <TabPanels>
        <MatchDetails :match />
        <StatsChart v-for="(stat, index) in stats" :key="index" :stats="stat"
          :p1="passProps(match.p1.player.player, ['full_name', 'id'])"
          :p2="passProps(match.p2.player.player, ['full_name', 'id'])" :tabValue="(index + 1).toString()" />
        <ServiceSpeed v-if="match.p1.max_speed_kph" :stats="serviceSpeed"
          :p1="passProps(match.p1.player.player, ['full_name', 'id'])"
          :p2="passProps(match.p2.player.player, ['full_name', 'id'])" />
      </TabPanels>
    </Tabs>
  </div>
  <Loading v-else :loading>
    <template #none>No stats available</template>
  </Loading>
</template>