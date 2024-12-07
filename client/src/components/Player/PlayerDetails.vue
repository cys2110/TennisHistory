<script setup lang="ts">
import { computed, markRaw, onMounted, Ref, ref, shallowRef } from 'vue'
import Icon from '@ant-design/icons-vue'
import { DateTime } from 'luxon'
import { convertToFt, encodeName, formatDate, smallDate } from '@/utils/functions'
import { PlayerDetailsType } from '@/utils/types'

const props = defineProps<{
  player: PlayerDetailsType
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
const selectedFlag = shallowRef(null)
const olderFlags: Ref<(any | null)[]> = ref([])

onMounted(async () => {
  const countryCode = countryConnection.edges[0].node.id
  try {
    const flags: { [key: string]: any } = await import(`@/components/icons/flags`)
    selectedFlag.value = flags[countryCode] || null
  } catch (error) {
    console.error(`Flag for ${countryCode} not found`, error)
  }
  if (prev_countriesConnection.edges.length > 0) {
    for (const country of prev_countriesConnection.edges) {
      const countryCode = String(country.node.id)
      try {
        const flag: { [key: string]: any } = await import(`@/components/icons/flags`)
        olderFlags.value.push(markRaw(flag[countryCode] || null))
      } catch (error) {
        console.error(`Flag for ${countryCode} not found`, error)
        olderFlags.value.push(null)
      }
    }
  }
})

const statistics = [
  {
    title: 'Career High',
    value: career_high ?? '—',
    description: ch_date ? formatDate(ch_date) : '—',
  },
  { title: 'Win-Loss', value: `${win}—${loss}` },
  { title: 'Titles', value: titles },
  { title: 'Prize Money', prefix: '$', value: pm_USD },
]

const playerYears = computed(() => {
  if (turned_pro && retired) {
    return `${retired.id - turned_pro.id} years`
  } else {
    return `${DateTime.now().year - turned_pro.id + 1} years`
  }
})

const age = computed(() => {
  if (dob) {
    return Math.floor(Math.abs(DateTime.fromISO(dob).diffNow('years').toObject().years || 0))
  }
  return '—'
})

const playingHand = computed(() => {
  switch (rh) {
    case true:
      return 'Right-handed'
    case false:
      return 'Left-handed'
    default:
      return '—'
  }
})

const backhand = computed(() => {
  switch (bh1) {
    case true:
      return 'One-handed'
    case false:
      return 'Two-handed'
    default:
      return '—'
  }
})

const descriptionItems = [
  {
    label: 'Active',
    value: turned_pro ? playerYears : '—',
    description: turned_pro ? `${turned_pro.id}—${retired?.id || 'present'}` : null,
  },
  {
    label: 'Age',
    value: age,
    description: dob ? formatDate(dob) : null,
  },
  {
    label: 'Height',
    value: height_cm ? `${height_cm} cm` : '—',
    description: height_cm ? convertToFt(height_cm) : null,
  },
  {
    label: 'Plays',
    value: playingHand,
  },
  {
    label: 'Backhand',
    value: backhand,
  },
]
</script>

<template>
  <a-row justify="space-evenly" :gutter="[5, 16]">
    <a-col v-for="stat in statistics" :key="stat.title" :xs="24" :md="11" :xl="5">
      <a-card class="text-center full-card">
        <a-statistic :title="stat.title" :prefix="stat.prefix || ''" :value="stat.value" />
        <a-card-meta v-if="stat.description" :description="stat.description" />
      </a-card>
    </a-col>
  </a-row>
  <a-descriptions
    :colon="false"
    class="my-10 text-center bg-violet-800 rounded-lg"
    bordered
    layout="vertical"
    size="middle"
  >
    <a-descriptions-item class="bg-black" label="Country">
      <div class="flex items-center justify-center">
        <Icon v-if="selectedFlag" class="mr-2 text-2xl" :component="selectedFlag" />
        <div>{{ countryConnection.edges[0].node.name }}</div>
      </div>
    </a-descriptions-item>
    <a-descriptions-item
      v-for="item in descriptionItems"
      :key="item.label"
      class="bg-black"
      :label="item.label"
    >
      <div>{{ item.value }}</div>
      <div v-if="item.description">{{ item.description }}</div>
    </a-descriptions-item>
    <a-descriptions-item class="bg-black" :label="coaches.length === 1 ? 'Coach' : 'Coaches'">
      <div v-if="coaches.length > 0" v-for="coach in coaches" :key="coach.id">
        <router-link
          v-if="coach.full_name"
          class="hover-link"
          :to="{ name: 'player', params: { name: encodeName(coach.full_name), id: coach.id } }"
        >
          {{ coach.full_name }}
        </router-link>
        <div v-else>{{ coach.id }}</div>
      </div>
      <div v-else>—</div>
    </a-descriptions-item>
    <a-descriptions-item class="bg-black" label="Previous Representations" :span="2">
      <a-row
        v-if="prev_countriesConnection.edges.length > 0"
        v-for="(country, index) in prev_countriesConnection.edges"
        :key="country.node.id"
        class="flex items-center justify-center"
      >
        <a-col :span="2">
          <Icon
            v-if="olderFlags.length > 0 && olderFlags[index]"
            class="mr-2 text-2xl"
            :component="olderFlags[index]"
          />
        </a-col>
        <a-col :span="9">{{ country.node.name }}</a-col>
        <a-col :span="13">
          {{ smallDate(country.properties.start_date) }}—
          {{ smallDate(country.properties.end_date) }}
        </a-col>
      </a-row>
      <div v-else>—</div>
    </a-descriptions-item>
  </a-descriptions>
</template>
